"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, DollarSign, FileText, Info, MapPin } from "lucide-react";
import { InvestmentModal } from "~~/components/investment/investment-modal";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Progress } from "~~/components/ui/shadcn/progress";
import { Separator } from "~~/components/ui/shadcn/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/shadcn/tabs";

const projects = [
  {
    id: 1,
    title: "Solaria Alpine Array",
    location: "Zermatt, Suiza",
    type: "Energía Renovable",
    features: "Micro-grid solar, contratos PPA firmados",
    targetReturn: 12,
    fundingProgress: 75,
    timeLeft: 12,
    featured: true,
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Aether Data Tower",
    location: "Frankfurt, Alemania",
    type: "Infraestructura Tech",
    features: "Tier IV Data Center, refrigeración líquida",
    targetReturn: 14,
    fundingProgress: 60,
    timeLeft: 18,
    featured: false,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Veridian Logistics Hub",
    location: "Puerto de Rotterdam, Países Bajos",
    type: "Logística Industrial",
    features: "Distribución automatizada, AI drone delivery ready",
    targetReturn: 9.5,
    fundingProgress: 40,
    timeLeft: 24,
    featured: false,
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Lumina Ocean Front Resort",
    location: "Maldivas, Océano Índico",
    type: "Hotelería Luxury",
    features: "Eco-resort 5 estrellas, yields por ocupación on-chain",
    minimumInvestment: 1,
    targetReturn: 18.5,
    fundingProgress: 85,
    timeLeft: 6,
    featured: true,
    image: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    title: "Horizon Wind Farm",
    location: "Austin, Texas, EE. UU.",
    type: "Eólico Core",
    features: "Turbinas de última generación, subsidios ITC aprobados",
    targetReturn: 8.8,
    fundingProgress: 25,
    timeLeft: 30,
    featured: false,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [showInvestmentModal, setShowInvestmentModal] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const project = useMemo(() => {
    const projectId = Number(params.id);

    return projects.find(item => item.id === projectId);
  }, [params.id]);

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

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-filabe-dark">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-filabe-text">Proyecto no encontrado</h1>

          <Link href="/projects">
            <Button className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">Volver a proyectos</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalFunding = 40 * 100;
  const currentFunding = (totalFunding * project.fundingProgress) / 100;

  const investmentHighlights = [
    project.features,
    "Infraestructura premium",
    "Potencial de valorización sostenida",
    "Proyecto validado por analistas externos",
  ];

  const riskFactors = [
    "Volatilidad macroeconómica",
    "Cambios regulatorios",
    "Riesgo operativo del proyecto",
    "Demoras en cronograma de ejecución",
  ];

  const documents = [
    { name: "Whitepaper del Proyecto", type: "PDF" },
    { name: "Análisis Financiero", type: "PDF" },
    { name: "Cronograma de Desarrollo", type: "PDF" },
    { name: "Due Diligence", type: "PDF" },
  ];

  const investmentTiers = [
    {
      name: "Starter",
      amount: 40,
      benefits: ["Acceso al proyecto", "Dashboard de seguimiento"],
    },
    {
      name: "Professional",
      amount: 40 * 2,
      benefits: ["Acceso prioritario", "Reportes premium", "Invitaciones privadas"],
    },
    {
      name: "Institutional",
      amount: 40 * 5,
      benefits: ["Asignación preferencial", "Asesor dedicado", "Eventos exclusivos"],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <MainNav />
      {/* MAIN */}
      <main className="flex-1 bg-filabe-dark">
        <div className="container px-4 py-8 md:px-6 md:py-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 hover:underline text-filabe-text"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Proyectos
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* LEFT */}
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
                <Image src={project.image} alt={project.title} fill className="object-cover" />
              </div>

              <Tabs defaultValue="overview">
                <TabsList className="grid w-full grid-cols-4 bg-filabe-gray">
                  <TabsTrigger value="overview">Descripción</TabsTrigger>
                  <TabsTrigger value="financials">Financiación</TabsTrigger>
                  <TabsTrigger value="documents">Documentos</TabsTrigger>
                  <TabsTrigger value="updates">Actualizaciones</TabsTrigger>
                </TabsList>

                {/* Overview */}
                <TabsContent value="overview" className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-filabe-text">Descripción del Proyecto</h3>
                      <p className="text-filabe-text/70">{project.features}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2 text-filabe-text">Características Destacadas</h3>

                      <ul className="space-y-2">
                        {investmentHighlights.map((highlight, index) => (
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
                        {riskFactors.map((risk, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="text-filabe-text/70">{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </TabsContent>

                {/* Financials */}
                <TabsContent value="financials" className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card className="bg-filabe-gray border-filabe-lightgray">
                      <CardHeader>
                        <CardTitle className="text-filabe-text">Resumen de Inversión</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Objetivo</span>
                          <span className="font-medium text-filabe-text">${totalFunding.toLocaleString()}</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Retorno Objetivo</span>
                          <span className="font-medium text-filabe-text">{project.targetReturn}%</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Tiempo Restante</span>
                          <span className="font-medium text-filabe-text">{project.timeLeft} meses</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-filabe-gray border-filabe-lightgray">
                      <CardHeader>
                        <CardTitle className="text-filabe-text">Métricas</CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Progreso</span>

                          <span className="font-medium text-filabe-text">{project.fundingProgress}%</span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-filabe-text/70">Tipo de Proyecto</span>

                          <span className="font-medium text-filabe-text">{project.type}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Documents */}
                <TabsContent value="documents" className="pt-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {documents.map((doc, index) => (
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

                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Updates */}
                <TabsContent value="updates" className="pt-4">
                  <div className="text-center py-8">
                    <Info className="h-12 w-12 mx-auto text-filabe-text/70 mb-4" />

                    <h3 className="text-xl font-bold mb-2 text-filabe-text">Sin Actualizaciones</h3>

                    <p className="text-filabe-text/70">Las actualizaciones del proyecto aparecerán aquí.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <Card className="sticky top-24 bg-filabe-gray border-filabe-lightgray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Detalles de Inversión</CardTitle>

                  <CardDescription className="text-filabe-text/70">
                    {project.fundingProgress}% financiado
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <Progress value={project.fundingProgress} className="h-2 bg-filabe-lightgray" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-filabe-text/70">Recaudado</p>

                      <p className="text-2xl font-bold text-filabe-text">${currentFunding.toLocaleString()}</p>
                    </div>

                    <div>
                      <p className="text-sm text-filabe-text/70">Tiempo</p>

                      <p className="text-2xl font-bold text-filabe-text">{project.timeLeft}m</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-filabe-text/70">Inversión mínima</p>

                      <p className="font-medium text-filabe-text">$40</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-sm text-filabe-text/70">Retorno objetivo</p>

                      <p className="font-medium text-filabe-text">{project.targetReturn}%</p>
                    </div>
                  </div>

                  <Separator className="bg-filabe-lightgray" />

                  <div className="space-y-4">
                    <h4 className="font-medium text-filabe-text">Niveles de Inversión</h4>

                    {investmentTiers.map((tier, index) => (
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-filabe-teal" />

            <span className="text-xl font-bold text-filabe-text">ASTERA</span>
          </div>

          <p className="text-center text-sm text-filabe-text/70">
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

      {/* Modal */}
      <InvestmentModal
        open={showInvestmentModal}
        onOpenChange={setShowInvestmentModal}
        project={{
          id: project.id,
          title: project.title,
          minimumInvestment: 0.001,
          image: project.image,
        }}
      />
    </div>
  );
}
