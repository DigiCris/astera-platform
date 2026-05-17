"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { Button } from "../ui/shadcn/button";
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

interface LoginModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function LoginModal({ trigger, open, onOpenChange }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    // Handle login logic here
    console.log({ email, password, rememberMe });
    // Redirect to dashboard
    window.location.href = "/dashboard";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px] bg-filabe-gray border-filabe-lightgray">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">{/* <Logo /> */}</div>
          <DialogTitle className="text-filabe-text">Ingresar a tu cuenta</DialogTitle>
          <DialogDescription className="text-filabe-text/70">
            ¡Bienvenido de nuevo! Por favor ingresa tus credenciales para continuar.
          </DialogDescription>
        </DialogHeader>

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
              <Link href="/forgot-password" className="text-xs text-filabe-teal hover:underline">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="bg-filabe-dark border-filabe-lightgray text-filabe-text"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={checked => setRememberMe(!!checked)}
              className="border-filabe-lightgray data-[state=checked]:bg-filabe-teal data-[state=checked]:border-filabe-teal"
            />
            <label
              htmlFor="remember"
              className="text-sm font-medium leading-none text-filabe-text peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Recordarme
            </label>
          </div>
        </div>

        <DialogFooter>
          <div className="w-full flex flex-col gap-2">
            <Button className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90" onClick={handleLogin}>
              Ingresar
            </Button>
            <Separator className="my-2 bg-filabe-lightgray" />
            <div className="text-center text-sm text-filabe-text/70">
              ¿No tienes una cuenta?{" "}
              <Link href="/signup" className="text-filabe-teal font-medium hover:underline">
                Regístrate
              </Link>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
