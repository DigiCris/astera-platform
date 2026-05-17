"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building2, PieChart, Search, Globe, ShieldCheck, DollarSign, Percent, Calendar } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Input } from "~~/components/ui/shadcn/input";
import { Progress } from "~~/components/ui/shadcn/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";

// Importar o declarar el array de proyectos aquí
const projects = [
  {
    id: 1,
    title: "Solaria Alpine Array",
    location: "Zermatt, Suiza",
    type: "Energía Renovable",
    features: "Micro-grid solar, contratos PPA firmados",
    minimumInvestment: 10000,
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
    minimumInvestment: 25000,
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
    minimumInvestment: 15000,
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
    minimumInvestment: 50000,
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
    minimumInvestment: 5000,
    targetReturn: 8.8,
    fundingProgress: 25,
    timeLeft: 30,
    featured: false,
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?q=80&w=600&auto=format&fit=crop",
  },
];

export default function ProjectsPage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  
  // Anti-Hydration Error: Inicializar el año de manera segura post-montaje
  const [currentYear, setCurrentYear] = useState("");

  useEffect(() => {
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-filabe-dark text-filabe-text">
      <MainNav onLoginClick={() => setShowLoginModal(true)} onSignUpClick={() => setShowSignUpModal(true)} />

      <main className="flex-1 relative pb-16">
        {/* Luces sutiles de fondo */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-filabe-teal/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 relative z-10">
          
          {/* Header */}
          <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-filabe-teal uppercase tracking-wider mb-1">
                <Globe className="h-3 w-3" /> astera_market_feed // active_pools
              </div>
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">Mercado Primario</h1>
              <p className="mt-2 text-sm text-filabe-text/60 max-w-xl">
                Explora pools institucionales tokenizados bajo cumplimiento on-chain. Adquiere participaciones fraccionadas de activos del mundo real (RWA).
              </p>
            </div>
            <div className="shrink-0">
              <Link href="/dashboard">
                <Button variant="outline" className="border-filabe-lightgray bg-filabe-gray/30 text-filabe-text hover:bg-filabe-gray hover:border-filabe-teal/40 rounded-xl transition-all duration-200">
                  <PieChart className="mr-2 h-4 w-4 text-filabe-teal" />
                  Mi Portafolio RWA
                </Button>
              </Link>
            </div>
          </div>

          {/* Filtros */}
          <div className="mb-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4 bg-filabe-gray/20 backdrop-blur-sm p-4 rounded-2xl border border-filabe-lightgray/50">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-filabe-text/40" />
              <Input
                placeholder="Buscar por activo, ticker o ubicación..."
                className="pl-9 bg-filabe-gray/50 border-filabe-lightgray/60 text-filabe-text placeholder:text-filabe-text/30 rounded-xl focus-visible:ring-filabe-teal/40"
              />
            </div>
            <Select>
              <SelectTrigger className="bg-filabe-gray/50 border-filabe-lightgray/60 text-filabe-text rounded-xl focus:ring-filabe-teal/40">
                <SelectValue placeholder="Clase de Activo" />
              </SelectTrigger>
              <SelectContent className="bg-filabe-gray border-filabe-lightgray text-filabe-text">
                <SelectItem value="all">Todos los activos</SelectItem>
                <SelectItem value="energy">Energía Renovable</SelectItem>
                <SelectItem value="infra">Infraestructura Tech</SelectItem>
                <SelectItem value="logistics">Logística Industrial</SelectItem>
                <SelectItem value="luxury">Hotelería Luxury</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="bg-filabe-gray/50 border-filabe-lightgray/60 text-filabe-text rounded-xl focus:ring-filabe-teal/40">
                <SelectValue placeholder="Ordenar métricas" />
              </SelectTrigger>
              <SelectContent className="bg-filabe-gray border-filabe-lightgray text-filabe-text">
                <SelectItem value="newest">Lanzamientos recientes</SelectItem>
                <SelectItem value="funding">Mayor recaudación</SelectItem>
                <SelectItem value="return">Mayor APY estimado</SelectItem>
                <SelectItem value="price-low">Inversión mínima baja</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Grid de Proyectos */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(project => (
              <Card key={project.id} className="overflow-hidden bg-gradient-to-b from-filabe-gray/60 to-filabe-gray/30 border-filabe-lightgray rounded-2xl flex flex-col justify-between group transition-all duration-300 hover:border-filabe-teal/30 hover:shadow-lg hover:shadow-filabe-teal/[2px]">
                
                {/* Imagen del Activo */}
                <div className="relative h-48 overflow-hidden">
                  <Image 
                    src={project.image || "/placeholder.svg"} 
                    alt={project.title} 
                    fill 
                    sizes="(max-w-768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                  />
                  <div className="absolute top-3 right-3 bg-filabe-dark/80 backdrop-blur-md border border-filabe-lightgray text-filabe-teal px-2.5 py-1 text-xs font-mono rounded-lg">
                    {project.type}
                  </div>
                  {project.featured && (
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium border-none shadow-sm px-2.5 py-0.5 rounded-md text-xs">
                        Pool Destacado
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Info básica */}
                <CardHeader className="space-y-1 p-5 pb-3">
                  <CardTitle className="text-xl font-black text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="text-filabe-text/50 text-xs font-medium inline-flex items-center gap-1">
                    <Globe className="h-3 w-3 text-filabe-teal/70" /> {project.location}
                  </CardDescription>
                </CardHeader>

                {/* Métricas e Inversión */}
                <CardContent className="px-5 py-2 space-y-4">
                  <p className="text-xs text-filabe-text/60 line-clamp-2 min-h-[2rem] bg-filabe-dark/20 p-2 rounded-lg border border-filabe-lightgray/20">
                    {project.features}
                  </p>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-b border-filabe-lightgray/30 py-3 font-mono text-xs">
                    <div className="space-y-1">
                      <span className="text-filabe-text/40 flex items-center gap-1"><DollarSign className="h-3 w-3" /> Min. Ticket</span>
                      <span className="font-bold text-filabe-text block text-sm">
                        ${project.minimumInvestment.toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-filabe-text/40 flex items-center gap-1"><Percent className="h-3 w-3" /> APY Objetivo</span>
                      <span className="font-bold text-filabe-teal block text-sm">
                        {project.targetReturn}%
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-filabe-text/40 flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Estado</span>
                      <span className="font-bold text-filabe-text/80 block">Regulado PSAV</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-filabe-text/40 flex items-center gap-1"><Calendar className="h-3 w-3" /> Plazo</span>
                      <span className="font-bold text-filabe-text/80 block">{project.timeLeft} meses</span>
                    </div>
                  </div>

                  {/* Barra de Progreso Core */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-filabe-text/40">Fondeo de Contrato</span>
                      <span className="font-bold text-filabe-text">{project.fundingProgress}%</span>
                    </div>
                    {/* Reparado: Eliminado el div interno para evitar errores de anidamiento HTML */}
                    <Progress value={project.fundingProgress} className="h-2 bg-filabe-lightgray/40" />
                  </div>
                </CardContent>

                {/* Acción */}
                <CardFooter className="p-5 pt-3">
                  <Link href={`/projects/${project.id}`} className="w-full">
                    <Button className="w-full bg-filabe-teal text-filabe-dark font-bold rounded-xl hover:bg-filabe-teal/90 shadow-md hover:shadow-filabe-teal/10 transition-all duration-200">
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
      <footer className="bg-filabe-dark border-t border-filabe-lightgray/40 py-6 md:py-0 relative z-10">
        <div className="container mx-auto px-4 flex flex-col items-center justify-between gap-4 md:h-20 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-filabe-text font-black text-lg flex items-center gap-2 tracking-tighter">
              <Building2 className="h-5 w-5 text-filabe-teal" />
              <span>ASTERA <span className="text-filabe-teal/70 font-light">FILABE</span></span>
            </div>
          </div>
          <p className="text-center text-xs font-mono text-filabe-text/50 md:text-left">
            &copy; {currentYear || "2026"} SUAREZ FILABE SA. Infraestructura Financiera Regulada.
          </p>
          <div className="flex gap-6 text-xs font-mono">
            <Link href="/terms" className="text-filabe-text/50 hover:text-filabe-teal transition-colors">
              Términos
            </Link>
            <Link href="/privacy" className="text-filabe-text/50 hover:text-filabe-teal transition-colors">
              Privacidad
            </Link>
            <Link href="/contact" className="text-filabe-text/50 hover:text-filabe-teal transition-colors">
              Soporte RPC
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