"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, PieChart, Search } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Input } from "~~/components/ui/shadcn/input";
import { Progress } from "~~/components/ui/shadcn/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";

export default function ProjectsPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav onLoginClick={() => setShowLoginModal(true)} onSignUpClick={() => setShowSignUpModal(true)} />

      <main className="flex-1 bg-filabe-dark">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-filabe-text">Proyectos Disponibles</h1>
              <p className="mt-2 text-filabe-text/70">
                Explora nuestros proyectos inmobiliarios y comienza a invertir desde $50,000
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 md:mt-0">
              <Link href="/dashboard">
                <Button variant="outline" className="border-filabe-lightgray text-filabe-text hover:bg-filabe-dark">
                  <PieChart className="mr-2 h-4 w-4" />
                  Mi Portafolio
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar proyectos..."
                className="pl-9 bg-filabe-gray border-filabe-lightgray text-filabe-text"
              />
            </div>
            <Select>
              <SelectTrigger className="bg-filabe-gray border-filabe-lightgray text-filabe-text">
                <SelectValue placeholder="Tipo de Proyecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="residential">Residencial</SelectItem>
                <SelectItem value="commercial">Comercial</SelectItem>
                <SelectItem value="mixed">Uso Mixto</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-filabe-gray border-filabe-lightgray text-filabe-text">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="funding">Mayor Financiación</SelectItem>
                <SelectItem value="return">Mayor Retorno</SelectItem>
                <SelectItem value="price-low">Menor Inversión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Dashboard Navigation */}
          <div className="mb-8 flex overflow-x-auto pb-2 md:hidden">
            <Link
              href="/dashboard"
              className="mr-2 whitespace-nowrap rounded-full border border-filabe-lightgray px-4 py-2 text-sm text-filabe-text"
            >
              Portafolio
            </Link>
            <Link
              href="/dashboard/movimientos"
              className="mr-2 whitespace-nowrap rounded-full border border-filabe-lightgray px-4 py-2 text-sm text-filabe-text"
            >
              Movimientos
            </Link>
            <Link
              href="/dashboard/documentos"
              className="mr-2 whitespace-nowrap rounded-full border border-filabe-lightgray px-4 py-2 text-sm text-filabe-text"
            >
              Documentos
            </Link>
            <Link
              href="/dashboard/perfil"
              className="mr-2 whitespace-nowrap rounded-full border border-filabe-lightgray px-4 py-2 text-sm text-filabe-text"
            >
              Perfil
            </Link>
            <Link
              href="/dashboard/ayuda"
              className="whitespace-nowrap rounded-full border border-filabe-lightgray px-4 py-2 text-sm text-filabe-text"
            >
              Ayuda
            </Link>
          </div>

          {/* Proyectos */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden bg-filabe-gray border-filabe-lightgray">
                <div className="relative h-48">
                  <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
                  <div className="absolute top-2 right-2 bg-filabe-teal text-filabe-dark px-2 py-1 text-xs font-medium rounded">
                    {project.type}
                  </div>
                  {project.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-amber-500 text-white hover:bg-amber-500">
                        Destacado
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-filabe-text">{project.title}</CardTitle>
                  <CardDescription className="text-filabe-text/70">{project.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-filabe-text/70">Características</span>
                      <span className="font-medium text-filabe-text">{project.features}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-filabe-text/70">Inversión Mínima</span>
                      <span className="font-medium text-filabe-text">
                        ${project.minimumInvestment.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-filabe-text/70">Retorno Objetivo</span>
                      <span className="font-medium text-filabe-text">{project.targetReturn}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-filabe-text/70">Progreso de Financiación</span>
                      <span className="font-medium text-filabe-text">{project.fundingProgress}%</span>
                    </div>
                    <Progress value={project.fundingProgress} className="h-2 bg-filabe-lightgray">
                      <div className="h-full bg-filabe-teal" style={{ width: `${project.fundingProgress}%` }} />
                    </Progress>
                    <div className="flex justify-between text-sm">
                      <span className="text-filabe-text/70">Entrega Estimada</span>
                      <span className="font-medium text-filabe-text">{project.timeLeft} meses</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">
                      Ver Proyecto
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
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

      {/* Auth Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <SignUpModal open={showSignUpModal} onOpenChange={setShowSignUpModal} />
    </div>
  );
}

// Datos de proyectos
const projects = [
  {
    id: 1,
    title: "Terrazas Diez",
    location: "Berazategui, Buenos Aires",
    type: "Residencial",
    features: "Energía solar, balcones amplios",
    minimumInvestment: 50000,
    targetReturn: 30,
    fundingProgress: 75,
    timeLeft: 12,
    featured: true,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Terrazas Brown",
    location: "Quilmes Centro, Buenos Aires",
    type: "Residencial",
    features: "Monoambientes y 2 ambientes",
    minimumInvestment: 45000,
    targetReturn: 25,
    fundingProgress: 60,
    timeLeft: 18,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Jufré 1085",
    location: "Villa Crespo, CABA",
    type: "Histórico",
    features: "Fachada original preservada",
    minimumInvestment: 65000,
    targetReturn: 22,
    fundingProgress: 40,
    timeLeft: 24,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Arenas Villarobles",
    location: "Costa Atlántica",
    type: "Frente al mar",
    features: "Vistas al océano, amenities",
    minimumInvestment: 70000,
    targetReturn: 35,
    fundingProgress: 85,
    timeLeft: 6,
    featured: true,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Magnolias",
    location: "Sourigues",
    type: "Barrio Cerrado",
    features: "Townhouses, entorno natural",
    minimumInvestment: 55000,
    targetReturn: 28,
    fundingProgress: 65,
    timeLeft: 15,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 6,
    title: "Torre Libertad",
    location: "Recoleta, CABA",
    type: "Residencial",
    features: "Apartamentos de lujo, gimnasio",
    minimumInvestment: 80000,
    targetReturn: 32,
    fundingProgress: 25,
    timeLeft: 30,
    featured: false,
    image: "/placeholder.svg?height=400&width=600",
  },
];
