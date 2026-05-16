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
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-filabe-text">Cómo Funciona</h1>
            <p className="mx-auto max-w-3xl text-lg text-filabe-text/70">
              En Filabe transformamos la ciudad para que puedas transformar tu vida, con un enfoque en la calidad, la
              innovación y el compromiso con nuestros clientes.
            </p>
          </div>

          {/* Proceso de Inversión */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Proceso de Inversión</h2>
            <div className="grid gap-8 md:grid-cols-4">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <UserCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">1. Registro</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Crea tu cuenta en nuestra plataforma para acceder a todas las oportunidades de inversión
                    inmobiliaria que ofrecemos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <FileCheck className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">2. Verificación KYC</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Completa el proceso de verificación de identidad para garantizar la seguridad y transparencia en
                    todas las transacciones.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">3. Inversión</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Selecciona el proyecto que más te interese y realiza tu inversión con montos accesibles, siguiendo
                    nuestro proceso seguro.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Coins className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">4. Seguimiento</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Recibe actualizaciones periódicas sobre el avance de tu inversión y el desarrollo del proyecto hasta
                    su finalización.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Proceso de Desarrollo */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Proceso de Desarrollo</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Lightbulb className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Diseño y Planificación</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Nuestro equipo de arquitectos y diseñadores trabaja en cada detalle para crear espacios funcionales
                    y estéticos que maximizan la calidad de vida con un menor impacto ambiental.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Building className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Construcción</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Utilizamos materiales de primera calidad y las técnicas más avanzadas para garantizar construcciones
                    duraderas, sustentables y con los más altos estándares de calidad.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Home className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-filabe-text">Entrega y Posventa</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Nuestro compromiso no termina con la entrega. Ofrecemos un servicio posventa integral para asegurar
                    que nuestros clientes disfruten plenamente de sus nuevos espacios.
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
              <span>FILABE</span>
            </div>
          </div>
          <p className="text-center text-sm text-filabe-text/70 md:text-left">
            &copy; {new Date().getFullYear()} SUAREZ FILABE SA. Todos los derechos reservados.
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
