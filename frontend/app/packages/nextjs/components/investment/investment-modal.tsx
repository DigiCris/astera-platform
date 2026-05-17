"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/shadcn/button";
import { Card, CardContent } from "../ui/shadcn/card";
import { Checkbox } from "../ui/shadcn/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/shadcn/dialog";
import { Input } from "../ui/shadcn/input";
import { Label } from "../ui/shadcn/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/shadcn/tabs";
import { ArrowLeft, ArrowRight, DollarSign, Download, FileText, Loader2, Upload, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import { keccak256 } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { createClient } from "~~/utils/supabase/client";

// ── Constantes del contrato ─────────────────────────────────────────────
const GENERIC_DOCUMENT_HASH = "0x6997b5bd3d2c1b7e3812ca8741ad8183292eb39507b7433e622e2474c0fff23a" as `0x${string}`;
const GENERIC_DOCUMENT_URI =
  "https://ivory-accessible-owl-927.mypinata.cloud/ipfs/bafkreiaycpbk6u5a2j6o7j3pwmn7qakvmgix2kt2queuiw733gqvn27kl4";
const COMPLIANCE_ADDRESS = "0xFA129CC39d49942b1D0C4fb5587DB605B98E1Dd9" as `0x${string}`;
const CHAIN_ID = 43114;

// ── EIP-712 types ───────────────────────────────────────────────────────
const EIP712_TYPES = {
  AgreementAcceptance: [
    { name: "genericDocumentHash", type: "bytes32" },
    { name: "genericDocumentURI", type: "string" },
    { name: "signedDocumentHash", type: "bytes32" },
    { name: "user", type: "address" },
  ],
} as const;

interface InvestmentModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  project: {
    id: number;
    title: string;
    minimumInvestment: number;
    image?: string;
  };
}

export function InvestmentModal({ trigger, open, onOpenChange, project }: InvestmentModalProps) {
  const { address } = useAccount();
  const supabase = createClient();

  // ── States ──────────────────────────────────────────────────────────
  const [step, setStep] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(project.minimumInvestment.toString());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "crypto">("bank");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);

  // ── Hooks ────────────────────────────────────────────────────────────
  const { signTypedDataAsync } = useSignTypedData();

  const { data: isCompliant } = useScaffoldReadContract({
    contractName: "AsteraComplianceManager",
    functionName: "isCompliant",
    args: [address],
  });

  const { writeContractAsync: writeComplianceManager } = useScaffoldWriteContract({
    contractName: "AsteraComplianceManager",
  });

  const totalSteps = isCompliant ? 3 : 4;

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !address) return;

    if (file.type !== "application/pdf") {
      toast.error("Solo se aceptan archivos PDF");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("El archivo debe ser menor a 5MB");
      return;
    }

    setIsSigning(true);
    try {
      // 1. Hash keccak256 del PDF firmado
      const buffer = await file.arrayBuffer();
      const signedDocHash = keccak256(new Uint8Array(buffer)) as `0x${string}`;

      // 2. Firma EIP-712
      toast.loading("Firmando con tu wallet...", { id: "sign" });
      const signature = await signTypedDataAsync({
        domain: {
          name: "AsteraCompliance",
          version: "1",
          chainId: CHAIN_ID,
          verifyingContract: COMPLIANCE_ADDRESS,
        },
        types: EIP712_TYPES,
        primaryType: "AgreementAcceptance",
        message: {
          genericDocumentHash: GENERIC_DOCUMENT_HASH,
          genericDocumentURI: GENERIC_DOCUMENT_URI,
          signedDocumentHash: signedDocHash,
          user: address,
        },
      });
      toast.success("Firma EIP-712 obtenida ✓", { id: "sign" });

      // 3. Subir PDF a Supabase Storage
      const walletLower = address.toLowerCase();
      const filePath = `${walletLower}/signed_agreement.pdf`;

      const originalFetch = window.fetch;
      window.fetch = async (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("x-wallet-address", walletLower);
        return originalFetch(input, { ...init, headers });
      };
      try {
        const { error: uploadError } = await supabase.storage
          .from("kyc-documents")
          .upload(filePath, file, { upsert: true });
        if (uploadError) throw new Error(`Upload falló: ${uploadError.message}`);
      } finally {
        window.fetch = originalFetch;
      }
      toast.success("PDF subido ✓");

      // 4. Llamar al smart contract
      toast.loading("Enviando transacción...", { id: "tx" });
      await writeComplianceManager({
        functionName: "acceptTermsAndJoin",
        args: [signedDocHash, signature],
      });
      toast.success("¡Adhesión confirmada on-chain! ✓", { id: "tx" });

      // 5. Actualizar UI local
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: "sign" });
      // Limpiar input para permitir re-intentar
      e.target.value = "";
    } finally {
      setIsSigning(false);
    }
  };

  const handleSubmit = () => {
    console.log({ projectId: project.id, investmentAmount, acceptedTerms, paymentMethod, proofFile });
    onOpenChange?.(false);
    window.location.href = "/dashboard";
  };

  const isAmountValid = () => {
    const amount = Number.parseFloat(investmentAmount);
    return !isNaN(amount) && amount >= project.minimumInvestment;
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2.5 w-2.5 rounded-full ${
            index + 1 === step ? "bg-filabe-teal" : index + 1 < step ? "bg-filabe-teal/60" : "bg-filabe-lightgray"
          }`}
        />
      ))}
    </div>
  );

  // ── El step del fideicomiso se muestra cuando NO es compliant ────────
  const fideicomisoStep = !isCompliant ? 1 : null; // step 1 si no es compliant
  const amountStep = isCompliant ? 1 : 2;
  const termsStep = isCompliant ? 2 : 3;
  const paymentStep = isCompliant ? 3 : 4;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-137.5 bg-filabe-gray border-filabe-lightgray">
        <DialogHeader>
          <DialogTitle className="text-filabe-text">Invertir en {project.title}</DialogTitle>
          <DialogDescription className="text-filabe-text/70">
            Completa los siguientes pasos para invertir en este proyecto.
          </DialogDescription>
        </DialogHeader>

        {renderStepIndicator()}

        {/* ── STEP FIDEICOMISO (solo si no es compliant) ── */}
        {step === fideicomisoStep && !isCompliant && (
          <div className="space-y-2 py-2">
            <div className="flex justify-center">
              <Button
                onClick={async () => {
                  const pdfUrl = GENERIC_DOCUMENT_URI;
                  try {
                    const response = await fetch(pdfUrl);
                    if (!response.ok) throw new Error("Error al descargar");
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "Contrato_Fideicomiso.pdf";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                    window.URL.revokeObjectURL(url);
                  } catch {
                    window.open(pdfUrl, "_blank");
                  }
                }}
              >
                <Download className="w-5 h-5 mr-2" />
                Descargar Fideicomiso
              </Button>
            </div>

            <Label className="text-filabe-text mt-5">Subir Fideicomiso firmado digitalmente</Label>

            <div className="mt-2 rounded-lg border border-dashed border-filabe-lightgray transition-colors hover:bg-filabe-dark/20">
              {isSigning ? (
                /* Estado: procesando firma + subida */
                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                  <Loader2 className="h-10 w-10 text-filabe-teal animate-spin" />
                  <p className="text-sm text-filabe-text/70">Procesando firma y subida...</p>
                </div>
              ) : proofPreview ? (
                /* Estado: archivo listo */
                <div className="flex flex-col items-center justify-center p-8 space-y-4 w-full">
                  <div className="relative h-40 w-full overflow-hidden rounded-lg">
                    <div className="flex flex-col items-center justify-center h-full w-full bg-filabe-dark/40 rounded-lg text-filabe-text/80">
                      <FileText className="h-12 w-12 text-filabe-teal mb-2" />
                      <span className="text-sm font-medium px-4 text-center truncate max-w-xs">{proofFile?.name}</span>
                      <span className="text-xs text-filabe-teal mt-1">✓ Firmado y enviado on-chain</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
                    onClick={() => {
                      setProofFile(null);
                      setProofPreview(null);
                    }}
                  >
                    Eliminar y Subir Otro Documento
                  </Button>
                </div>
              ) : (
                /* Estado: esperando archivo */
                <label
                  htmlFor="proof-upload"
                  className="flex flex-col items-center justify-center p-8 cursor-pointer w-full text-center group"
                >
                  <Upload className="h-8 w-8 text-filabe-text/70 mb-3 transition-colors group-hover:text-filabe-teal" />
                  <p className="text-sm text-filabe-text/90 font-medium mb-1">
                    Arrastra y suelta el fideicomiso firmado aquí
                  </p>
                  <p className="text-xs text-filabe-text/60 mb-4">Al subir, se pedirá firma EIP-712 en tu wallet</p>
                  <span className="text-[11px] px-3 py-1 bg-filabe-dark rounded-full text-filabe-text/50 border border-filabe-lightgray/30">
                    Solo PDF · Máx 5MB
                  </span>
                  <Input id="proof-upload" type="file" accept=".pdf" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>
        )}

        {/* ── STEP MONTO ── */}
        {step === amountStep && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-4 p-4 bg-filabe-dark rounded-lg border border-filabe-lightgray">
              <div className="relative h-16 w-16 overflow-hidden rounded-md shrink-0">
                <Image
                  src={project.image || "/placeholder.svg?height=64&width=64"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium text-filabe-text">{project.title}</h3>
                <p className="text-sm text-filabe-text/70">
                  Inversión mínima: ${project.minimumInvestment.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-amount" className="text-filabe-text">
                Monto de Inversión ($)
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-filabe-text/70" />
                <Input
                  id="investment-amount"
                  type="number"
                  min={project.minimumInvestment}
                  step="1000"
                  value={investmentAmount}
                  onChange={e => setInvestmentAmount(e.target.value)}
                  className="pl-9 bg-filabe-dark border-filabe-lightgray text-filabe-text"
                />
              </div>
              {!isAmountValid() && (
                <p className="text-sm text-destructive">
                  El monto debe ser al menos ${project.minimumInvestment.toLocaleString()}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-filabe-text">Detalles de la Inversión</Label>
              <Card className="bg-filabe-dark border-filabe-lightgray">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-filabe-text/70">Tipo de Unidad</span>
                    <span className="font-medium text-filabe-text">Apartamento</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-filabe-text/70">Plazo de Construcción</span>
                    <span className="font-medium text-filabe-text">24 meses</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-filabe-text/70">Valorización Estimada</span>
                    <span className="font-medium text-filabe-text">+30% al finalizar</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ── STEP TÉRMINOS ── */}
        {step === termsStep && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-filabe-dark rounded-lg border border-filabe-lightgray">
              <h3 className="font-medium mb-2 text-filabe-text">Términos y Condiciones</h3>
              <div className="max-h-48 overflow-y-auto text-sm text-filabe-text/70 p-2 border rounded-md bg-filabe-gray border-filabe-lightgray">
                <p className="mb-2">Yo, el abajo firmante, declaro que:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Toda la información proporcionada es verdadera, precisa y completa.</li>
                  <li>Los fondos provienen de fuentes legítimas.</li>
                  <li>Entiendo que las inversiones inmobiliarias implican riesgos.</li>
                  <li>Esta inversión está sujeta a los plazos establecidos en el contrato.</li>
                  <li>He revisado todos los documentos y comprendo los términos.</li>
                  <li>Realizo esta inversión basándome en mi propia evaluación independiente.</li>
                </ol>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={checked => setAcceptedTerms(!!checked)}
                className="border-filabe-lightgray data-[state=checked]:bg-filabe-teal data-[state=checked]:border-filabe-teal mt-1"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium leading-none text-filabe-text">
                  Acepto los términos y condiciones
                </label>
                <p className="text-sm text-filabe-text/70">
                  Al marcar esta casilla, confirmo que he leído y acepto los términos anteriores.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP PAGO ── */}
        {step === paymentStep && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-filabe-text">Seleccionar Método de Pago</Label>
              <Tabs defaultValue="crypto" onValueChange={v => setPaymentMethod(v as "bank" | "crypto")}>
                <TabsList className="grid w-full grid-cols-1 bg-filabe-dark">
                  <TabsTrigger
                    value="crypto"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark w-full"
                  >
                    Criptomoneda
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="crypto" className="space-y-4 pt-4">
                  <div className="p-4 bg-filabe-dark rounded-lg border border-filabe-lightgray">
                    <h3 className="font-medium mb-2 flex items-center text-filabe-text">
                      <Wallet className="h-4 w-4 mr-2 text-filabe-teal" /> Detalles de Pago
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-filabe-text/70">Dirección USDT:</span>
                        <div className="p-2 bg-filabe-gray rounded border border-filabe-lightgray break-all font-mono text-xs text-filabe-text">
                          0x8fC9f05f7B21346FD5DE4Cef36D75f99a07156F5
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-filabe-text/70">Referencia:</span>
                        <span className="font-medium text-filabe-text">
                          INV-{project.id}-{Math.floor(Math.random() * 10000)}
                        </span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
            </Button>
          ) : (
            <div />
          )}

          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={
                (step === fideicomisoStep && !proofFile) || // 👈 bloquea si no firmó el fideicomiso
                (step === amountStep && !isAmountValid()) ||
                (step === termsStep && !acceptedTerms) ||
                isSigning
              }
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">
              Completar Inversión
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
