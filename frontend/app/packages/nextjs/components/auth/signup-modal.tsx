"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";
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
import { ArrowRight, Check } from "lucide-react";

interface SignUpModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SignUpModal({ trigger, open, onOpenChange }: SignUpModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleContinue = () => {
    setStep(2);
  };

  const handleSignUp = () => {
    // Handle sign up logic here
    console.log({ email, password, firstName, lastName });
    // Redirect to dashboard or verification page
    window.location.href = "/kyc";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-filabe-gray border-filabe-lightgray">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">{/* <Logo /> */}</div>
          <DialogTitle className="text-filabe-text">{step === 1 ? "Crea tu cuenta" : "Completa tu perfil"}</DialogTitle>
          <DialogDescription className="text-filabe-text/70">
            {step === 1
              ? "Únete a nuestra comunidad para recibir información exclusiva sobre nuestros proyectos."
              : "Cuéntanos un poco más sobre ti para personalizar tu experiencia."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-filabe-text">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Ingresa tu email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="bg-filabe-dark border-filabe-lightgray text-filabe-text"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-filabe-text">
                  Contraseña
                </Label>
                <Link href="#" className="text-xs text-filabe-teal hover:underline">
                  Requisitos de contraseña
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Crea una contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="bg-filabe-dark border-filabe-lightgray text-filabe-text"
              />
            </div>

            <div className="text-xs text-filabe-text/70">
              Al crear una cuenta, aceptas nuestros{" "}
              <Link href="/terms" className="text-filabe-teal hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="/privacy" className="text-filabe-teal hover:underline">
                Política de Privacidad
              </Link>
              .
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name" className="text-filabe-text">
                  Nombre
                </Label>
                <Input
                  id="first-name"
                  placeholder="Ingresa tu nombre"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="bg-filabe-dark border-filabe-lightgray text-filabe-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name" className="text-filabe-text">
                  Apellido
                </Label>
                <Input
                  id="last-name"
                  placeholder="Ingresa tu apellido"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="bg-filabe-dark border-filabe-lightgray text-filabe-text"
                />
              </div>
            </div>

            <div className="rounded-lg bg-filabe-dark p-4 border border-filabe-lightgray">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-filabe-teal/20 shrink-0 mt-0.5">
                  <Check className="h-5 w-5 text-filabe-teal" />
                </div>
                <div>
                  <p className="font-medium text-filabe-text">Siguiente: Preferencias de Contacto</p>
                  <p className="text-sm text-filabe-text/70 mt-1">
                    Después de crear tu cuenta, podrás indicarnos tus preferencias para recibir información sobre
                    nuestros proyectos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <>
              <div className="w-full flex flex-col gap-2">
                <Button
                  className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
                  onClick={handleContinue}
                >
                  Continuar
                </Button>
                <Separator className="my-2 bg-filabe-lightgray" />
                <div className="text-center text-sm text-filabe-text/70">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-filabe-teal font-medium hover:underline">
                    Ingresar
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <Button className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90" onClick={handleSignUp}>
              Crear Cuenta <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
