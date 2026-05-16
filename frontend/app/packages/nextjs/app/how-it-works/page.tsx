"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building,
  Building2,
  CheckCircle,
  Clock,
  Coins,
  CreditCard,
  FileCheck,
  Home,
  Lightbulb,
  Shield,
  UserCheck,
  Users,
} from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";

export default function HowItWorksPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <MainNav
        showAuthButtons={true}
        onLoginClick={() => setLoginModalOpen(true)}
        onSignUpClick={() => setSignUpModalOpen(true)}
      />

     <main className="flex-1 bg-filabe-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-filabe-text">¿Cómo Funciona?</h1>
            <p className="mx-auto max-w-3xl text-lg text-filabe-text/70">
              Astera integra identidad, compliance y emisión regulada en una infraestructura modular on-chain diseñada para plataformas financieras y operadores del mercado.
            </p>
          </div>

          {/* Proceso de Operación Regulada */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Flujo de Emisión y Operación</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">1. Configuración del Activo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    El operador regulado (PSAV) crea el activo digital en la plataforma, definiendo las reglas de mercado, caps máximos, plazos y la estructura legal subyacente.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">2. Validación KYC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    El usuario completa la verificación de identidad. Al aprobarse, su clave pública o wallet queda habilitada y vinculada inmutablemente dentro del protocolo core.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">3. Adhesión e Inversión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    El inversor acepta de forma electrónica los términos legales. La operación primaria procesa la orden, enviando los fondos directamente al destino o fideicomiso definido.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Coins className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">4. Control Secundario</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Los tokens se administran bajo restricciones automatizadas. Cualquier transferencia secundaria se ejecuta obligatoriamente bajo las reglas de compliance on-chain de la red.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

        {/* Proceso de Desarrollo */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Arquitectura y Desarrollo</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Capa Regulatoria On-Chain</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Diseñamos una infraestructura modular donde las reglas de cumplimiento normativo, el KYC y las restricciones de transferencia conviven directamente en el core de los smart contracts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Building className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Integración Modular (White-Label)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Proveemos las APIs y herramientas necesarias para que terceros construyan su propio frontend y experiencia de usuario, manteniendo un flujo operativo robusto y adaptado a su marca.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Home className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Auditoría e Inmutabilidad</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Garantizamos un registro transparente de todos los eventos del mercado secundario, límites operativos y procesos de verificación, ofreciendo un entorno seguro y completamente auditable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Proyectos Destacados */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Proyectos Destacados</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Terrazas Diez</CardTitle>
                  <CardDescription className="text-filabe-text/70">Berazategui</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-filabe-dark">
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="Terrazas Diez"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mb-4 text-filabe-text/70">
                    Torre de 13 pisos con sistema de energía solar, cocheras, terraza con sum, y ascensores de última
                    generación.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Energía solar para espacios comunes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Balcones amplios con vistas únicas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Diseño sustentable y moderno</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Arenas Villarobles</CardTitle>
                  <CardDescription className="text-filabe-text/70">Villarobles, Costa Atlántica</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-filabe-dark">
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="Arenas Villarobles"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mb-4 text-filabe-text/70">
                    Desarrollo residencial frente al mar con volúmenes escalonados que maximizan las vistas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Diseño armonioso con la naturaleza</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Espacios verdes y amenities exclusivos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Ubicación privilegiada frente al mar</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Magnolias</CardTitle>
                  <CardDescription className="text-filabe-text/70">Sourigues</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 aspect-video overflow-hidden rounded-md bg-filabe-dark">
                    <Image
                      src="/placeholder.svg?height=400&width=600"
                      alt="Magnolias"
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <p className="mb-4 text-filabe-text/70">
                    Barrio cerrado de casas estilo Townhouses, integrado en un entorno natural.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Entorno natural privilegiado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Seguridad las 24 horas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-filabe-teal" />
                      <span className="text-filabe-text/70">Espacios comunes para toda la familia</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Valores */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Nuestros Valores</h2>
            <div className="grid gap-6 md:grid-cols-5">
              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Shield className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-filabe-text">Confianza</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-filabe-text">Servicio</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Coins className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-filabe-text">Transparencia</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Clock className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-filabe-text">Compromiso</CardTitle>
                </CardHeader>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl text-filabe-text">Innovación</CardTitle>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="rounded-lg bg-filabe-teal/10 p-8 text-center">
            <h2 className="mb-4 text-3xl font-bold text-filabe-text">¿Listo para transformar tu vida?</h2>
            <p className="mx-auto mb-6 max-w-2xl text-lg text-filabe-text/70">
              Te invitamos a ser parte de nuestra comunidad y a descubrir todos nuestros proyectos en movimiento.
              ¡Construyamos juntos!
            </p>
            <Button asChild size="lg" className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">
              <Link href="/projects">
                Ver Proyectos <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-filabe-text font-bold text-xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span>ASTERA</span>
            </div>
          </div>
          <p className="text-center text-sm text-filabe-text/70 md:text-left">
            &copy; {new Date().getFullYear()} ASTERA. Todos los derechos reservados.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-filabe-text/70 hover:text-filabe-teal">
              Términos
            </Link>
            <Link href="/privacy" className="text-sm text-filabe-text/70 hover:text-filabe-teal">
              Privacidad
            </Link>
            <Link href="/contact" className="text-sm text-filabe-text/70 hover:text-filabe-teal">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
      <SignUpModal open={signUpModalOpen} onOpenChange={setSignUpModalOpen} />
    </div>
  );
}
