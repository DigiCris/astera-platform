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
import { Separator } from "../ui/shadcn/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/shadcn/tabs";
import { ArrowLeft, ArrowRight, Check, DollarSign, Upload, Wallet } from "lucide-react";

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
  const [step, setStep] = useState(1);
  const [investmentAmount, setInvestmentAmount] = useState(project.minimumInvestment.toString());
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "crypto">("bank");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const totalSteps = 4;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Handle investment submission
    console.log({
      projectId: project.id,
      investmentAmount: Number.parseFloat(investmentAmount),
      acceptedTerms,
      paymentMethod,
      proofFile,
    });
    // Close modal or show success
    if (onOpenChange) {
      onOpenChange(false);
    }
    // Redirect to confirmation page
    window.location.href = "/dashboard";
  };

  const isAmountValid = () => {
    const amount = Number.parseFloat(investmentAmount);
    return !isNaN(amount) && amount >= project.minimumInvestment;
  };

  const renderStepIndicator = () => {
    return (
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

        {step === 1 && (
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

        {step === 2 && (
          <div className="space-y-4 py-2">
            <div className="p-4 bg-filabe-dark rounded-lg border border-filabe-lightgray">
              <h3 className="font-medium mb-2 text-filabe-text">Términos y Condiciones</h3>
              <div className="max-h-48 overflow-y-auto text-sm text-filabe-text/70 p-2 border rounded-md bg-filabe-gray border-filabe-lightgray">
                <p className="mb-2">Yo, el abajo firmante, declaro que:</p>
                <ol className="list-decimal pl-5 space-y-2">
                  <li>
                    Toda la información proporcionada en relación con esta inversión es verdadera, precisa y completa
                    según mi leal saber y entender.
                  </li>
                  <li>
                    Los fondos que estoy invirtiendo provienen de fuentes legítimas y no representan ganancias de
                    ninguna actividad ilícita.
                  </li>
                  <li>
                    Entiendo que las inversiones inmobiliarias implican riesgos, incluida la posible pérdida del
                    capital, y que el rendimiento pasado no garantiza resultados futuros.
                  </li>
                  <li>
                    Reconozco que esta inversión está sujeta a los plazos de construcción y entrega establecidos en el
                    contrato.
                  </li>
                  <li>
                    He revisado todos los documentos de la oferta y comprendo los términos y condiciones asociados con
                    esta inversión.
                  </li>
                  <li>
                    Estoy realizando esta inversión basándome en mi propia evaluación independiente de los méritos y
                    riesgos de la inversión.
                  </li>
                </ol>
                <p className="mt-2">
                  Entiendo que hacer una declaración falsa puede constituir perjurio y puede estar sujeto a sanciones
                  legales.
                </p>
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
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none text-filabe-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos y condiciones
                </label>
                <p className="text-sm text-filabe-text/70">
                  Al marcar esta casilla, confirmo que he leído, entendido y acepto los términos anteriores.
                </p>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-filabe-text">Seleccionar Método de Pago</Label>
              <Tabs
                defaultValue="crypto"
                onValueChange={value => setPaymentMethod(value as "bank" | "crypto")}
                className="border-filabe-lightgray"
              >
                <TabsList className="grid w-full grid-cols-1 bg-filabe-dark">
                  {/* <TabsTrigger
                    value="bank"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark"
                  >
                    Transferencia Bancaria
                  </TabsTrigger> */}
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
                      <Wallet className="h-4 w-4 mr-2 text-filabe-teal" /> Detalles de Pago con Criptomonedas
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="space-y-1">
                        <span className="text-filabe-text/70">Dirección Bitcoin (BTC):</span>
                        <div className="p-2 bg-filabe-gray rounded border border-filabe-lightgray break-all font-mono text-xs text-filabe-text">
                          bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                        </div>
                      </div>
                      <div className="space-y-1">
                        <span className="text-filabe-text/70">Dirección Ethereum (ETH):</span>
                        <div className="p-2 bg-filabe-gray rounded border border-filabe-lightgray break-all font-mono text-xs text-filabe-text">
                          0x71C7656EC7ab88b098defB751B7401B5f6d8976F
                        </div>
                      </div>
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
                    <div className="mt-4 text-sm text-filabe-text/70">
                      <p>
                        Por favor incluye el número de referencia en el memo de la transacción si es posible. Los pagos
                        con criptomonedas suelen confirmarse en 1 hora.
                      </p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label className="text-filabe-text">Subir Comprobante de Pago</Label>
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-filabe-lightgray p-8">
                {proofPreview ? (
                  <div className="space-y-4 w-full">
                    <div className="relative h-40 w-full overflow-hidden rounded-lg">
                      <Image
                        src={proofPreview || "/placeholder.svg"}
                        alt="Comprobante de pago"
                        fill
                        className="object-contain"
                      />
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
                      Eliminar y Subir Otro Archivo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 text-filabe-text/70 mb-2" />
                    <p className="text-sm text-filabe-text/70 mb-1">
                      Arrastra y suelta tu comprobante de pago aquí o haz clic para buscar
                    </p>
                    <p className="text-xs text-filabe-text/70">Formatos soportados: JPG, PNG, PDF (Máx 5MB)</p>
                    <Label
                      htmlFor="proof-upload"
                      className="mt-4 cursor-pointer inline-flex h-9 items-center justify-center rounded-md bg-filabe-teal px-4 py-2 text-sm font-medium text-filabe-dark shadow transition-colors hover:bg-filabe-teal/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    >
                      Seleccionar Archivo
                    </Label>
                    <Input
                      id="proof-upload"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      className="sr-only"
                      onChange={handleFileChange}
                    />
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-filabe-dark rounded-lg border border-filabe-lightgray">
              <h3 className="font-medium mb-2 flex items-center text-filabe-text">
                <Check className="h-4 w-4 mr-2 text-filabe-teal" /> Resumen de Inversión
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-filabe-text/70">Proyecto:</span>
                  <span className="font-medium text-filabe-text">{project.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-filabe-text/70">Monto de Inversión:</span>
                  <span className="font-medium text-filabe-text">
                    ${Number.parseFloat(investmentAmount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-filabe-text/70">Método de Pago:</span>
                  <span className="font-medium text-filabe-text capitalize">
                    {paymentMethod === "bank" ? "Transferencia Bancaria" : "Criptomoneda"}
                  </span>
                </div>
                <Separator className="bg-filabe-lightgray" />
                <div className="flex justify-between">
                  <span className="text-filabe-text/70">Estado:</span>
                  <span className="font-medium text-yellow-500">Pendiente de Verificación</span>
                </div>
              </div>
              <div className="mt-4 text-sm text-filabe-text/70">
                <p>
                  Nuestro equipo verificará tu pago en un plazo de 1-2 días hábiles. Recibirás un correo electrónico de
                  confirmación una vez que tu inversión sea procesada.
                </p>
              </div>
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
            <div></div>
          )}
          {step < totalSteps ? (
            <Button
              onClick={handleNext}
              disabled={(step === 1 && !isAmountValid()) || (step === 2 && !acceptedTerms)}
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Siguiente <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!proofFile}
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
