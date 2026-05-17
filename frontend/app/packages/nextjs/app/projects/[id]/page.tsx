"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  MapPin,
  Menu,
  PieChart,
  User,
} from "lucide-react";
import { InvestmentModal } from "~~/components/investment/investment-modal";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Progress } from "~~/components/ui/shadcn/progress";
import { Separator } from "~~/components/ui/shadcn/separator";
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/shadcn/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/shadcn/tabs";

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // En una aplicación real, obtendrías los datos del proyecto según el ID
  const project = {
    id: Number.parseInt(params.id),
    title: "Terrazas Diez",
    location: "Berazategui, Buenos Aires",
    type: "Residencial",
    description:
      "Torre de 13 pisos con sistema de energía solar, cocheras, terraza con sum, y ascensores de última generación. Diseñada para ofrecer una experiencia de vida moderna y sostenible en el corazón de Berazategui.",
    targetReturn: "30% valorización",
    minimumInvestment: 50000,
    totalFunding: 5000000,
    currentFunding: 3750000,
    fundingProgress: 75,
    timeLeft: 12,
    term: "24 meses",
    expectedDistributions: "Al finalizar",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    investmentHighlights: [
      "Energía solar para espacios comunes",
      "Balcones amplios con vistas únicas",
      "Diseño sustentable y moderno",
      "Ubicación estratégica con excelente conectividad",
    ],
    riskFactors: [
      "Fluctuaciones del mercado inmobiliario",
      "Posibles retrasos en la construcción",
      "Cambios en normativas municipales",
      "Variaciones en costos de materiales",
    ],
    documents: [
      { name: "Memoria Descriptiva", type: "PDF" },
      { name: "Planos de Planta", type: "PDF" },
      { name: "Renders 3D", type: "PDF" },
      { name: "Cronograma de Obra", type: "PDF" },
    ],
    investmentTiers: [
      { name: "Básico", amount: 50000, benefits: ["Acceso a precios de preventa", "Informes trimestrales de avance"] },
      {
        name: "Premium",
        amount: 100000,
        benefits: ["Acceso a precios de preventa", "Informes trimestrales de avance", "Visitas a la obra"],
      },
      {
        name: "Elite",
        amount: 250000,
        benefits: [
          "Acceso a precios de preventa",
          "Informes trimestrales de avance",
          "Visitas a la obra",
          "Personalización de acabados",
          "Prioridad en selección de unidades",
        ],
      },
    ],
  };

  // Añadir un efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        buttonRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header - Actualizado para coincidir con el dashboard */}
      <header className="sticky top-0 z-50 w-full border-b border-filabe-lightgray bg-filabe-dark/95 backdrop-blur supports-backdrop-filter:bg-filabe-dark/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-filabe-text font-bold text-xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-filabe-teal" />
            <span>FILABE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-filabe-text">
              Inicio
            </Link>
            <Link href="/projects" className="text-sm font-medium text-filabe-text">
              Proyectos
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium text-filabe-text">
              Cómo Funciona
            </Link>
            <Link href="/about" className="text-sm font-medium text-filabe-text">
              Nosotros
            </Link>
            <Link href="/dashboard" className="text-sm font-medium text-filabe-text">
              Mi Balance
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {/* Mobile Navigation Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-filabe-text hover:text-filabe-teal">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-6 w-6 text-primary" />
                      <span className="text-xl font-bold">FILABE</span>
                    </div>
                  </div>
                  <nav className="flex-1 overflow-auto py-2">
                    <div className="px-4 py-2">
                      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Principal</h2>
                      <div className="space-y-1">
                        <Link
                          href="/"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <PieChart className="h-4 w-4" />
                          Inicio
                        </Link>
                        <Link
                          href="/projects"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <CreditCard className="h-4 w-4" />
                          Proyectos
                        </Link>
                        <Link
                          href="/how-it-works"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-accent-foreground"
                        >
                          <FileText className="h-4 w-4" />
                          Cómo Funciona
                        </Link>
                        <Link
                          href="/about"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 text-accent-foreground"
                        >
                          <FileText className="h-4 w-4" />
                          Nosotros
                        </Link>
                      </div>
                    </div>

                    <div className="px-4 py-2">
                      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Dashboard</h2>
                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <PieChart className="h-4 w-4" />
                          Portafolio
                        </Link>
                        <Link
                          href="/dashboard/movimientos"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <CreditCard className="h-4 w-4" />
                          Movimientos
                        </Link>
                        <Link
                          href="/dashboard/documentos"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <FileText className="h-4 w-4" />
                          Documentos
                        </Link>
                      </div>
                    </div>
                    <div className="px-4 py-2">
                      <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Cuenta</h2>
                      <div className="space-y-1">
                        <Link
                          href="/dashboard/perfil"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <User className="h-4 w-4" />
                          Perfil
                        </Link>
                        <Link
                          href="/dashboard/ayuda"
                          className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <HelpCircle className="h-4 w-4" />
                          Ayuda y Soporte
                        </Link>
                      </div>
                    </div>
                  </nav>
                  <div className="border-t p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">John Smith</p>
                        <p className="text-xs text-muted-foreground">john.smith@example.com</p>
                      </div>
                    </div>
                    <Button variant="outline" className="mt-4 w-full justify-start gap-2">
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="relative">
              {/* Añadir el estado y los refs al inicio del componente */}
              <>
                <Button
                  ref={buttonRef}
                  variant="ghost"
                  size="icon"
                  className="relative text-filabe-text transition-all duration-200 hover:bg-primary/10 active:scale-95"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                >
                  <Bell className="h-5 w-5 transition-transform duration-300 ease-in-out" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-filabe-teal text-[10px] font-medium text-filabe-dark animate-in zoom-in-50 duration-300">
                    3
                  </span>
                  <span className="sr-only">Notificaciones</span>
                </Button>

                {notificationsOpen && (
                  <div
                    ref={notificationsRef}
                    className="absolute right-0 top-full mt-2 w-80 bg-background border border-border shadow-lg rounded-md animate-in fade-in-80 slide-in-from-top-5 duration-200 z-50"
                  >
                    <div className="p-4 border-b">
                      <h3 className="font-medium">Notificaciones</h3>
                    </div>

                    <div className="max-h-100 overflow-auto">
                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Nuevo proyecto disponible</p>
                            <span className="text-xs text-filabe-text/70">Hace 2 horas</span>
                          </div>
                          <p className="text-sm text-filabe-text/70">
                            El proyecto &quot;Terrazas Brown&quot; ya está disponible para inversión.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Actualización de proyecto</p>
                            <span className="text-xs text-filabe-text/70">Hace 1 día</span>
                          </div>
                          <p className="text-sm text-filabe-text/70">
                            El proyecto &quot;Terrazas Diez&quot; ha alcanzado el 75% de su objetivo de financiación.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Distribución de rendimientos</p>
                            <span className="text-xs text-filabe-text/70">Hace 3 días</span>
                          </div>
                          <p className="text-sm text-filabe-text/70">
                            Se ha realizado una distribución de rendimientos para el proyecto &quot;Arenas
                            Villarobles&quot;.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        Ver todas las notificaciones
                      </Button>
                    </div>
                  </div>
                )}
              </>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-filabe-teal/20 flex items-center justify-center">
                <span className="text-sm font-medium text-filabe-teal">JS</span>
              </div>
              <span className="text-sm font-medium text-filabe-text">Juan Suarez</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-filabe-dark">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline text-filabe-text"
          >
            <ArrowLeft className="h-4 w-4" /> Volver a Proyectos
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Project Details */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-filabe-text">{project.title}</h1>
                <div className="flex items-center gap-2 text-filabe-text/70">
                  <MapPin className="h-4 w-4" />
                  <span>{project.location}</span>
                  <span className="mx-2">•</span>
                  <Building2 className="h-4 w-4" />
                  <span>{project.type}</span>
                </div>
              </div>

              <div className="relative aspect-video overflow-hidden rounded-lg">
                <Image
                  src={project.images[0] || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {project.images.slice(1).map((image, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${project.title} - Imagen ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              <Tabs defaultValue="overview" className="border-filabe-lightgray">
                <TabsList className="grid w-full grid-cols-4 bg-filabe-gray">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark"
                  >
                    Descripción
                  </TabsTrigger>
                  <TabsTrigger
                    value="financials"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark"
                  >
                    Financiación
                  </TabsTrigger>
                  <TabsTrigger
                    value="documents"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark"
                  >
                    Documentos
                  </TabsTrigger>
                  <TabsTrigger
                    value="updates"
                    className="data-[state=active]:bg-filabe-teal data-[state=active]:text-filabe-dark"
                  >
                    Actualizaciones
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-filabe-text">Descripción del Proyecto</h3>
                    <p className="text-filabe-text/70">{project.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-filabe-text">Características Destacadas</h3>
                    <ul className="space-y-2">
                      {project.investmentHighlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-filabe-teal shrink-0" />
                          <span className="text-filabe-text/70">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2 text-filabe-text">Factores de Riesgo</h3>
                    <ul className="space-y-2">
                      {project.riskFactors.map((risk, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="mt-1 h-1.5 w-1.5 rounded-full bg-destructive shrink-0" />
                          <span className="text-filabe-text/70">{risk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
                <TabsContent value="financials" className="space-y-6 pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-filabe-gray border-filabe-lightgray">
                      <CardHeader>
                        <CardTitle className="text-filabe-text">Resumen de Inversión</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Valor del Proyecto</span>
                          <span className="font-medium text-filabe-text">
                            ${(project.totalFunding * 1.2).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Objetivo de Financiación</span>
                          <span className="font-medium text-filabe-text">${project.totalFunding.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Relación Préstamo-Valor</span>
                          <span className="font-medium text-filabe-text">75%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Plazo de Construcción</span>
                          <span className="font-medium text-filabe-text">{project.term}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Retorno Objetivo</span>
                          <span className="font-medium text-filabe-text">{project.targetReturn}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Distribuciones</span>
                          <span className="font-medium text-filabe-text">{project.expectedDistributions}</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-filabe-gray border-filabe-lightgray">
                      <CardHeader>
                        <CardTitle className="text-filabe-text">Proyecciones</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Valorización Año 1</span>
                          <span className="font-medium text-filabe-text">10%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Valorización Año 2</span>
                          <span className="font-medium text-filabe-text">20%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Valorización al Finalizar</span>
                          <span className="font-medium text-filabe-text">30%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Apreciación Proyectada</span>
                          <span className="font-medium text-filabe-text">15% anual</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Retorno Total Proyectado</span>
                          <span className="font-medium text-filabe-text">30% en 2 años</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="documents" className="space-y-6 pt-4">
                  <div>
                    <h3 className="text-xl font-bold mb-4 text-filabe-text">Documentos del Proyecto</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {project.documents.map((doc, index) => (
                        <Card key={index} className="bg-filabe-gray border-filabe-lightgray">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-filabe-teal/20">
                                <FileText className="h-5 w-5 text-filabe-teal" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-filabe-text">{doc.name}</p>
                                <p className="text-sm text-filabe-text/70">Documento {doc.type}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
                              >
                                Ver
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="updates" className="space-y-6 pt-4">
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto text-filabe-text/70 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-filabe-text">Sin Actualizaciones Aún</h3>
                    <p className="text-filabe-text/70 max-w-md mx-auto">
                      Este proyecto está en fase de financiación. Las actualizaciones se publicarán aquí una vez que
                      comience la construcción.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Investment Card */}
            <div className="space-y-6">
              <Card className="sticky top-24 bg-filabe-gray border-filabe-lightgray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Detalles de Inversión</CardTitle>
                  <CardDescription className="text-filabe-text/70">
                    {project.fundingProgress}% financiado de ${project.totalFunding.toLocaleString()} objetivo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Progress value={project.fundingProgress} className="h-2 bg-filabe-lightgray">
                    <div className="h-full bg-filabe-teal" style={{ width: `${project.fundingProgress}%` }} />
                  </Progress>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-filabe-text/70">Inversores</p>
                      <p className="text-2xl font-bold text-filabe-text">
                        {Math.floor(project.currentFunding / (project.minimumInvestment * 2))}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-filabe-text/70">Tiempo Restante</p>
                      <p className="text-2xl font-bold text-filabe-text">{project.timeLeft} meses</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-filabe-text">Inversión Mínima</p>
                      <p className="text-sm font-bold text-filabe-text">
                        ${project.minimumInvestment.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-filabe-text">Retorno Objetivo</p>
                      <p className="text-sm font-bold text-filabe-text">{project.targetReturn}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-filabe-text">Plazo de Construcción</p>
                      <p className="text-sm font-bold text-filabe-text">{project.term}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-filabe-text">Entrega</p>
                      <p className="text-sm font-bold text-filabe-text">{project.expectedDistributions}</p>
                    </div>
                  </div>

                  <Separator className="bg-filabe-lightgray" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-filabe-text">Niveles de Inversión</h4>
                    {project.investmentTiers.map((tier, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-filabe-teal/20 shrink-0 mt-0.5">
                          <DollarSign className="h-3 w-3 text-filabe-teal" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-filabe-text">
                            {tier.name} - ${tier.amount.toLocaleString()}
                          </p>
                          <ul className="text-sm text-filabe-text/70">
                            {tier.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <div className="mt-1.5 h-1 w-1 rounded-full bg-filabe-teal shrink-0" />
                                <span>{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
                    size="lg"
                    onClick={() => setShowInvestmentModal(true)}
                  >
                    Invertir Ahora
                  </Button>

                  <p className="text-xs text-center text-filabe-text/70">
                    Al invertir, aceptas nuestros{" "}
                    <Link href="/terms" className="text-filabe-teal hover:underline">
                      Términos de Servicio
                    </Link>{" "}
                    y reconoces que has leído nuestras{" "}
                    <Link href="/privacy" className="text-filabe-teal hover:underline">
                      Divulgaciones de Riesgo
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-filabe-teal" />
            <span className="text-xl font-bold text-filabe-text">FILABE</span>
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

      {/* Investment Modal */}
      <InvestmentModal
        open={showInvestmentModal}
        onOpenChange={setShowInvestmentModal}
        project={{
          id: project.id,
          title: project.title,
          minimumInvestment: project.minimumInvestment,
          image: project.images[0],
        }}
      />
    </div>
  );
}
