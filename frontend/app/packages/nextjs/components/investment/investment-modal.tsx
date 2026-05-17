"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/shadcn/button";
import { Card, CardContent } from "../ui/shadcn/card";
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
import { ArrowLeft, ArrowRight, CheckCircle2, DollarSign, Download, FileText, Loader2, Upload } from "lucide-react";
import { toast } from "react-hot-toast";
import { keccak256, parseEther, parseUnits } from "viem";
import { useAccount, useSignTypedData } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { createClient } from "~~/utils/supabase/client";

// ── Contract constants ───────
const GENERIC_DOCUMENT_HASH = "0x6997b5bd3d2c1b7e3812ca8741ad8183292eb39507b7433e622e2474c0fff23a" as `0x${string}`;
const GENERIC_DOCUMENT_URI =
  "https://ivory-accessible-owl-927.mypinata.cloud/ipfs/bafkreiaycpbk6u5a2j6o7j3pwmn7qakvmgix2kt2queuiw733gqvn27kl4";
const CHAIN_ID = 43114;
const COMPLIANCE_ADDRESS = "0xFA129CC39d49942b1D0C4fb5587DB605B98E1Dd9" as `0x${string}`;

// ── EIP-712 types ────────
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

// ── Payment step states ─────────────────────────────────────────────────
type PaymentStatus = "idle" | "approving" | "approved" | "buying" | "done" | "error";

export function InvestmentModal({ trigger, open, onOpenChange, project }: InvestmentModalProps) {
  const { address } = useAccount();
  const supabase = createClient();

  // ── States
  const [step, setStep] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(project.minimumInvestment.toString());
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // ── Hooks ──
  const { signTypedDataAsync } = useSignTypedData();

  const { data: isCompliant } = useScaffoldReadContract({
    contractName: "AsteraComplianceManager",
    functionName: "isCompliant",
    args: [address],
  });

  const { writeContractAsync: writeComplianceManager } = useScaffoldWriteContract({
    contractName: "AsteraComplianceManager",
  });

  const { writeContractAsync: writeUSDC } = useScaffoldWriteContract({
    contractName: "USDC",
  });

  const { writeContractAsync: writeExchange } = useScaffoldWriteContract({
    contractName: "AsteraPrimaryExchange",
  });

  const totalSteps = isCompliant ? 2 : 3;

  const fideicomisoStep = !isCompliant ? 1 : null;
  const amountStep = isCompliant ? 1 : 2;
  const paymentStep = isCompliant ? 2 : 3;

  // ── Helpers ───
  const usdcAmount = (): bigint => {
    const amount = parseFloat(investmentAmount);
    if (isNaN(amount)) return 0n;
    return parseUnits(amount.toString(), 6);
  };

  const isAmountValid = () => {
    const amount = parseFloat(investmentAmount);
    return !isNaN(amount) && amount >= project.minimumInvestment;
  };

  // ── Handlers ──
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
      const buffer = await file.arrayBuffer();
      const signedDocHash = keccak256(new Uint8Array(buffer)) as `0x${string}`;

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

      toast.loading("Enviando transacción...", { id: "tx" });
      await writeComplianceManager({
        functionName: "acceptTermsAndJoin",
        args: [signedDocHash, signature],
      });
      toast.success("¡Adhesión confirmada on-chain! ✓", { id: "tx" });

      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: "sign" });
      e.target.value = "";
    } finally {
      setIsSigning(false);
    }
  };

  /**
   * Two-step payment:
   * 1. USDC.approve(EXCHANGE_ADDRESS, amount)
   * 2. Exchange.buy(tokenAddress, amount)
   */
  const handlePayment = async () => {
    if (!address || !project.id) return;
    setPaymentError(null);
    const amount = usdcAmount();
    if (amount === 0n) return;
    try {
      const exchangeAddress = "0x640C0638703D18B0d5B878606224FC3a592E92D6";

      // ── Step 1: Approve ──────────────────────────────────────────
      setPaymentStatus("approving");
      toast.loading("Aprobando USDC...", { id: "payment" });

      await writeUSDC({
        functionName: "approve",
        // Usamos 'amount' directamente porque ya es el BigInt que espera el contrato
        args: [exchangeAddress, amount],
      });

      toast.success("USDC aprobado ✓", { id: "payment" });
      setPaymentStatus("approved");

      // ── Step 2: Buy ──────────────────────────────────────────────
      setPaymentStatus("buying");
      toast.loading("Ejecutando inversión...", { id: "payment" });

      await writeExchange({
        functionName: "buy",
        // Aquí también pasamos 'amount' directo
        args: [exchangeAddress, amount],
      });

      toast.success("¡Inversión completada! ✓", { id: "payment" });
      setPaymentStatus("done");
    } catch (err: any) {
      console.error(err);
      const msg = err?.shortMessage ?? err?.message ?? "Error desconocido";
      setPaymentError(msg);
      setPaymentStatus("error");
      toast.error(`Error: ${msg}`, { id: "payment" });
    }
  };

  const handleSubmit = () => {
    onOpenChange?.(false);
    window.location.href = "/dashboard";
  };

  // ── Step indicator ───────────────────────────────────────────────────
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

  // ── Payment UI helpers ────────────────────────────────────────────────
  const paymentIdle = paymentStatus === "idle" || paymentStatus === "error";
  const paymentInProgress = paymentStatus === "approving" || paymentStatus === "buying";
  const paymentDone = paymentStatus === "done";

  const paymentButtonLabel = () => {
    switch (paymentStatus) {
      case "approving":
        return "Aprobando USDC...";
      case "approved":
        return "Aprobado — ejecutando...";
      case "buying":
        return "Procesando inversión...";
      case "done":
        return "¡Completado!";
      default:
        return `Invertir ${investmentAmount} USDC`;
    }
  };

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
                  try {
                    const response = await fetch(GENERIC_DOCUMENT_URI);
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
                    window.open(GENERIC_DOCUMENT_URI, "_blank");
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
                <div className="flex flex-col items-center justify-center p-8 space-y-3">
                  <Loader2 className="h-10 w-10 text-filabe-teal animate-spin" />
                  <p className="text-sm text-filabe-text/70">Procesando firma y subida...</p>
                </div>
              ) : proofPreview ? (
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
                  Inversión mínima: ${project.minimumInvestment.toLocaleString()} USDC
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="investment-amount" className="text-filabe-text">
                Monto de Inversión (USDC)
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

        {/* ── STEP PAGO ── */}
        {step === paymentStep && (
          <div className="space-y-4 py-2">
            <Label className="text-filabe-text">Pago con USDC</Label>

            {/* Amount summary */}
            <Card className="bg-filabe-dark border-filabe-lightgray">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-filabe-text/70">Monto a invertir</span>
                  <span className="font-medium text-filabe-text">
                    {parseFloat(investmentAmount).toLocaleString()} USDC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-filabe-text/70">Red</span>
                  <span className="font-medium text-filabe-text">Avalanche C-Chain</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-filabe-text/70">Token</span>
                  <span className="font-mono text-xs text-filabe-text/70">{project.id}</span>
                </div>
              </CardContent>
            </Card>

            {/* Flow steps indicator */}
            <div className="space-y-2">
              {/* Step 1: Approve */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  paymentStatus === "approving"
                    ? "border-filabe-teal bg-filabe-teal/10"
                    : paymentStatus === "approved" || paymentStatus === "buying" || paymentStatus === "done"
                      ? "border-filabe-teal/40 bg-filabe-dark"
                      : "border-filabe-lightgray bg-filabe-dark"
                }`}
              >
                <div className="shrink-0">
                  {paymentStatus === "approving" ? (
                    <Loader2 className="h-5 w-5 text-filabe-teal animate-spin" />
                  ) : paymentStatus === "approved" || paymentStatus === "buying" || paymentStatus === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-filabe-teal" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-filabe-lightgray flex items-center justify-center">
                      <span className="text-xs text-filabe-text/50">1</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-filabe-text">Aprobar USDC</p>
                  <p className="text-xs text-filabe-text/60">
                    Autoriza al contrato Exchange a gastar {parseFloat(investmentAmount).toLocaleString()} USDC
                  </p>
                </div>
              </div>

              {/* Step 2: Buy */}
              <div
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  paymentStatus === "buying"
                    ? "border-filabe-teal bg-filabe-teal/10"
                    : paymentStatus === "done"
                      ? "border-filabe-teal/40 bg-filabe-dark"
                      : "border-filabe-lightgray bg-filabe-dark"
                }`}
              >
                <div className="shrink-0">
                  {paymentStatus === "buying" ? (
                    <Loader2 className="h-5 w-5 text-filabe-teal animate-spin" />
                  ) : paymentStatus === "done" ? (
                    <CheckCircle2 className="h-5 w-5 text-filabe-teal" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-filabe-lightgray flex items-center justify-center">
                      <span className="text-xs text-filabe-text/50">2</span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-filabe-text">Confirmar Inversión</p>
                  <p className="text-xs text-filabe-text/60">
                    Llama a <code className="text-filabe-teal">Exchange.buy(token, amount)</code> on-chain
                  </p>
                </div>
              </div>
            </div>

            {/* Error */}
            {paymentStatus === "error" && paymentError && (
              <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{paymentError}</p>
            )}

            {/* Main CTA */}
            {!paymentDone ? (
              <Button
                className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
                disabled={paymentInProgress || !isAmountValid() || !project.id}
                onClick={handlePayment}
              >
                {paymentInProgress && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {paymentButtonLabel()}
              </Button>
            ) : (
              <div className="flex items-center gap-2 justify-center p-3 bg-filabe-teal/10 rounded-lg border border-filabe-teal/40">
                <CheckCircle2 className="h-5 w-5 text-filabe-teal" />
                <p className="text-sm font-medium text-filabe-teal">Inversión confirmada on-chain</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={paymentInProgress}
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
                (step === fideicomisoStep && !proofFile) || (step === amountStep && !isAmountValid()) || isSigning
              }
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!paymentDone}
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Completar Inversión
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
