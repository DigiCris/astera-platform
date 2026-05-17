"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, ChevronRight, DollarSign, ShieldCheck, Shield, Users, Cpu } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Progress } from "~~/components/ui/shadcn/progress";

const featuredProjects = [
  {
    id: 1,
    title: "Terrazas Diez",
    location: "Berazategui, Buenos Aires",
    type: "Residencial",
    features: "Energía solar, balcones amplios",
    minimumInvestment: 50000,
    fundingProgress: 75,
    timeLeft: 12,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 2,
    title: "Terrazas Brown",
    location: "Quilmes Centro, Buenos Aires",
    type: "Residencial",
    features: "Monoambientes y 2 ambientes",
    minimumInvestment: 45000,
    fundingProgress: 60,
    timeLeft: 18,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 3,
    title: "Jufré 1085",
    location: "Villa Crespo, CABA",
    type: "Histórico",
    features: "Fachada original preservada",
    minimumInvestment: 65000,
    fundingProgress: 40,
    timeLeft: 24,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 4,
    title: "Arenas Villarobles",
    location: "Costa Atlántica",
    type: "Frente al mar",
    features: "Vistas al océano, amenities",
    minimumInvestment: 70000,
    fundingProgress: 85,
    timeLeft: 6,
    image: "/placeholder.svg?height=400&width=600",
  },
  {
    id: 5,
    title: "Magnolias",
    location: "Sourigues",
    type: "Barrio Cerrado",
    features: "Townhouses, entorno natural",
    minimumInvestment: 55000,
    fundingProgress: 65,
    timeLeft: 15,
    image: "/placeholder.svg?height=400&width=600",
  },
] as const;

// Variantes para animaciones fluidas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemLeftVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

const itemCardVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 16 } }
};

export default function HomePage() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <MainNav
        // showAuthButtons={false}
        onLoginClick={() => setShowLoginModal(true)}
        onSignUpClick={() => setShowSignUpModal(true)}
        activePath="/"
      />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="relative w-full py-24 md:py-32 lg:py-40 bg-cover bg-center"
          style={{ backgroundImage: 'url("/images/filabe_hero.png")' }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="container relative px-4 md:px-6 z-10 flex justify-center items-center">
            <div className="max-w-2xl text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-6 text-filabe-text">
                Infraestructura para Activos Digitales Regulados
              </h1>
              <p className="max-w-[600px] mx-auto text-filabe-text/90 md:text-xl mb-8">
                Astera permite emitir y operar activos de mercados financieros modernos mediante infraestructura blockchain con compliance, identidad verificada y reglas de mercado integradas desde el diseño.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                  <Button size="lg" className="gap-1.5 bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90 w-full">
                    Ver GitHub <ChevronRight className="h-4 w-4" />
                  </Button>
                </a>
                <Link href="/how-it-works" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="border-filabe-teal text-filabe-teal w-full">
                    Cómo Funciona
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Logros / Infraestructura Rediseñada */}
        <section className="bg-filabe-dark relative py-20 lg:py-28 overflow-hidden">
          {/* Sutil brillo de fondo de red de nodos */}
          <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-filabe-teal/5 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            className="container relative z-10 px-4 md:px-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* Bloque Izquierdo del Texto */}
              <motion.div variants={itemLeftVariants} className="lg:col-span-5 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-filabe-teal/20 bg-filabe-teal/5 text-xs font-medium text-filabe-teal tracking-wide uppercase">
                  Tecnología Institucional
                </div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-filabe-text">
                  Nuestra Infraestructura
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-filabe-teal to-transparent rounded-full"></div>
                <p className="text-filabe-text/80 text-lg leading-relaxed">
                  En Astera, nos enfocamos en el impacto de la tecnología ledger distribuida para optimizar la liquidez global y automatizar el cumplimiento en mercados financieros permissioned.
                </p>
              </motion.div>

              {/* Bloque Derecho: Bento Grid Interactivo con Métricas */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Card Destacada Principal (100% On-Chain) */}
                <motion.div
                  variants={itemCardVariants}
                  whileHover={{ y: -6, borderHorizontal: "1px solid #00f2fe" }}
                  className="sm:col-span-2 border border-filabe-lightgray bg-filabe-gray/60 p-8 rounded-2xl relative overflow-hidden backdrop-blur-sm group hover:border-filabe-teal/30 transition-all duration-300"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-filabe-teal/5 rounded-bl-full pointer-events-none group-hover:bg-filabe-teal/10 transition-colors duration-300" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-filabe-teal/10 text-filabe-teal">
                          <ShieldCheck className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-semibold uppercase tracking-wider text-filabe-teal">Core Protocol</span>
                      </div>
                      <h3 className="text-5xl font-black tracking-tight text-filabe-text bg-clip-text">
                        100%
                      </h3>
                      <span className="text-xl font-bold text-filabe-text/90 block">Estructura On-Chain</span>
                    </div>
                    <p className="text-filabe-text/70 max-w-xs text-sm sm:text-right leading-relaxed">
                      Lógica dura de cumplimiento regulatorio, KYC, y control de mercado ejecutándose de manera inmutable en cada bloque.
                    </p>
                  </div>
                </motion.div>

                {/* Card Sub-Second Finality */}
                <motion.div
                  variants={itemCardVariants}
                  whileHover={{ y: -6 }}
                  className="border border-filabe-lightgray bg-filabe-gray/40 p-6 rounded-2xl hover:border-filabe-teal/30 transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-filabe-teal/10 text-filabe-teal w-fit mb-4">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h4 className="text-2xl font-bold text-filabe-text mb-1">&lt; 1s</h4>
                  <p className="text-sm font-semibold text-filabe-teal mb-2">Finalidad de Bloque</p>
                  <p className="text-xs text-filabe-text/60 leading-relaxed">
                    Operaciones ágiles y predecibles impulsadas por el consenso avanzado de la red Avalanche.
                  </p>
                </motion.div>

                {/* Card Enterprise PSAV */}
                <motion.div
                  variants={itemCardVariants}
                  whileHover={{ y: -6 }}
                  className="border border-filabe-lightgray bg-filabe-gray/40 p-6 rounded-2xl hover:border-filabe-teal/30 transition-all duration-300"
                >
                  <div className="p-3 rounded-xl bg-filabe-teal/10 text-filabe-teal w-fit mb-4">
                    <Users className="h-5 w-5" />
                  </div>
                  <h4 className="text-2xl font-bold text-filabe-text mb-1">PSAV</h4>
                  <p className="text-sm font-semibold text-filabe-teal mb-2">Modelo de Operación</p>
                  <p className="text-xs text-filabe-text/60 leading-relaxed">
                    Arquitectura permissioned pensada de raíz para proveedores de servicios de activos virtuales.
                  </p>
                </motion.div>

              </div>
            </div>
          </motion.div>
        </section>

        {/* Featured Projects 
        <section className="bg-filabe-dark">
          <div className="filabe-container">
            <div className="flex flex-col items-start justify-center space-y-2 mb-12">
              <h2 className="section-heading">Proyectos Destacados</h2>
              <p className="max-w-[700px] text-filabe-text/80 md:text-lg">
                Descubre nuestros desarrollos inmobiliarios más emblemáticos, diseñados con los más altos estándares de
                calidad y sostenibilidad.
              </p>
            </div>
            <div className="project-grid">
              {featuredProjects.map(project => (
                <Card key={project.id} className="overflow-hidden bg-filabe-gray border-filabe-lightgray">
                  <div className="relative h-48">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-filabe-teal text-filabe-dark px-2 py-1 text-xs font-medium rounded">
                      {project.type}
                    </div>
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
                        <span className="text-filabe-text/70">Progreso de Construcción</span>
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
            <div className="flex justify-center mt-12">
              <Link href="/projects">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 border-filabe-teal text-filabe-teal hover:bg-filabe-teal/10"
                >
                  Ver Todos los Proyectos <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      */}
        {/* How It Works - Rediseñado e Institucional */}
        <section className="bg-filabe-gray relative py-20 overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-filabe-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="filabe-container relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-start justify-center space-y-3 mb-16"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-filabe-teal/10 bg-filabe-teal/5 text-xs font-semibold text-filabe-teal uppercase tracking-wider">
                Workflow de Implementación
              </div>
              <h2 className="section-heading text-filabe-text">¿Cómo Trabajamos?</h2>
              <p className="max-w-[700px] text-filabe-text/80 md:text-lg leading-relaxed">
                Nuestra infraestructura simplifica la tokenización institucional mediante un proceso estandarizado, seguro y completamente automatizado on-chain.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-3"
            >
              {/* Paso 1 */}
              <motion.div
                variants={itemCardVariants}
                whileHover={{ y: -6 }}
                className="flex flex-col items-start space-y-4 p-6 rounded-2xl border border-filabe-lightgray bg-filabe-dark/30 backdrop-blur-sm hover:border-filabe-teal/30 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal transition-transform duration-300 hover:scale-110">
                  <Users className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">1. Onboarding e Identidad</h3>
                <p className="text-filabe-text/70 text-sm leading-relaxed">
                  Configuración del entorno permissioned. Vinculamos las reglas de KYC/AML locales directamente a los contratos inteligentes encargados del control de acceso.
                </p>
              </motion.div>

              {/* Paso 2 */}
              <motion.div
                variants={itemCardVariants}
                whileHover={{ y: -6 }}
                className="flex flex-col items-start space-y-4 p-6 rounded-2xl border border-filabe-lightgray bg-filabe-dark/30 backdrop-blur-sm hover:border-filabe-teal/30 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal transition-transform duration-300 hover:scale-110">
                  <Cpu className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">2. Emisión Programable</h3>
                <p className="text-filabe-text/70 text-sm leading-relaxed">
                  Despliegue y acuñación de los smart contracts del activo digital (RWA), incrustando límites operativos, reglas de transferencia y compliance nativo.
                </p>
              </motion.div>

              {/* Paso 3 */}
              <motion.div
                variants={itemCardVariants}
                whileHover={{ y: -6 }}
                className="flex flex-col items-start space-y-4 p-6 rounded-2xl border border-filabe-lightgray bg-filabe-dark/30 backdrop-blur-sm hover:border-filabe-teal/30 transition-all duration-300"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal transition-transform duration-300 hover:scale-110">
                  <DollarSign className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">3. Ciclo de Vida On-Chain</h3>
                <p className="text-filabe-text/70 text-sm leading-relaxed">
                  Automatización total de la distribución de dividendos o rendimientos, gobernanza, auditorías en tiempo real y conciliaciones del mercado primario.
                </p>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="flex justify-center mt-14"
            >
              <Link href="/how-it-works">
                <Button size="lg" className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90 shadow-lg shadow-filabe-teal/10 font-semibold px-8 transition-all duration-300 hover:tracking-wide">
                  Conoce Más
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Filosofía y Valores / Nuestra Visión */}
        <section className="bg-filabe-dark relative py-20 lg:py-28 overflow-hidden">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-filabe-teal/5 rounded-full blur-3xl pointer-events-none" />

          <div className="filabe-container relative z-10">
            <div className="grid gap-12 lg:grid-cols-2 items-center">

              {/* Bloque Izquierdo con Lista Escalonada */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col justify-center space-y-6"
              >
                <motion.div variants={itemLeftVariants}>
                  <h2 className="section-heading text-filabe-text">Nuestra Visión</h2>
                  <p className="max-w-[600px] text-filabe-text/80 md:text-lg mt-4 leading-relaxed">
                    En Astera, transformamos los mercados financieros mediante una capa regulatoria on-chain eficiente. Proporcionamos a fintechs, PSAVs e instituciones la infraestructura tecnológica necesaria para operar activos digitales con total seguridad jurídica y control operativo absoluto.
                  </p>
                </motion.div>

                <ul className="grid gap-6 mt-4">
                  {/* Item 1 */}
                  <motion.li variants={itemCardVariants} className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300 hover:bg-filabe-gray/30 group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal shrink-0 group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text text-base transition-colors duration-200 group-hover:text-filabe-teal">Compliance-Native</h3>
                      <p className="text-filabe-text/70 text-sm mt-1 leading-relaxed">
                        Reglas de mercado, límites operativos, procesos de freeze y validaciones integradas directamente en el diseño del protocolo.
                      </p>
                    </div>
                  </motion.li>

                  {/* Item 2 */}
                  <motion.li variants={itemCardVariants} className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300 hover:bg-filabe-gray/30 group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal shrink-0 group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text text-base transition-colors duration-200 group-hover:text-filabe-teal">Identidad y Control</h3>
                      <p className="text-filabe-text/70 text-sm mt-1 leading-relaxed">
                        Vinculación inmutable de identidades verificadas (KYC) a nivel de smart contract, mitigando riesgos operativos y regulatorios.
                      </p>
                    </div>
                  </motion.li>

                  {/* Item 3 */}
                  <motion.li variants={itemCardVariants} className="flex items-start gap-4 p-4 rounded-xl transition-colors duration-300 hover:bg-filabe-gray/30 group">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal shrink-0 group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text text-base transition-colors duration-200 group-hover:text-filabe-teal">Arquitectura Abierta</h3>
                      <p className="text-filabe-text/70 text-sm mt-1 leading-relaxed">
                        Infraestructura modular sin custodia forzada que permite a terceros construir experiencias financieras a medida (White-label).
                      </p>
                    </div>
                  </motion.li>
                </ul>
              </motion.div>

              {/* Bloque Derecho con Frame de Imagen Animado */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 40 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 60, damping: 15 }}
                className="mx-auto w-full max-w-[500px] lg:max-w-none relative"
              >
                {/* Glowing neon background border aura */}
                <div className="absolute inset-0 bg-gradient-to-tr from-filabe-teal/20 to-transparent rounded-2xl blur-xl" />

                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="aspect-square overflow-hidden rounded-2xl border border-filabe-lightgray bg-filabe-gray/40 p-2 backdrop-blur-sm shadow-2xl shadow-black/40"
                >
                  <Image
                    src="/astera_favicon_256.png"
                    alt="Infraestructura Blockchain Astera"
                    width={800}
                    height={800}
                    className="object-cover w-full h-full rounded-xl brightness-95 contrast-105"
                  />
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Testimonios 
        <section className="bg-filabe-gray py-16">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-filabe-text">Nuestra Comunidad Habla de Nosotros</h2>
              <div className="h-1 w-20 bg-filabe-teal mx-auto mb-6"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-filabe-dark p-6 rounded-lg border border-filabe-lightgray">
                <p className="text-filabe-text/80 italic mb-4">
                  Experiencia muy positiva al haber hecho trato con Filabe. El proceso fue transparente y el resultado
                  final superó nuestras expectativas.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-filabe-teal/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-filabe-teal font-bold">JL</span>
                  </div>
                  <div>
                    <p className="font-medium text-filabe-text">Julio Lucero</p>
                    <p className="text-sm text-filabe-text/70">Propietario</p>
                  </div>
                </div>
              </div>
              <div className="bg-filabe-dark p-6 rounded-lg border border-filabe-lightgray">
                <p className="text-filabe-text/80 italic mb-4">
                  Felices estamos, enamorados de todo lo que es Magnolias. La calidad de construcción y el diseño son
                  excepcionales, realmente se nota la diferencia.
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-filabe-teal/20 rounded-full flex items-center justify-center mr-4">
                    <span className="text-filabe-teal font-bold">KM</span>
                  </div>
                  <div>
                    <p className="font-medium text-filabe-text">Karina Melgares</p>
                    <p className="text-sm text-filabe-text/70">Propietaria en Magnolias</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      */}

        {/* CTA */}
        <section className="bg-filabe-teal text-filabe-dark">
          <div className="filabe-container py-16">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
              <div className="space-y-3">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Construyamos Juntos</h2>
                <p className="max-w-[600px] md:text-xl">
                  Transformamos la ciudad para que puedas transformar tu vida. Te invitamos a ser parte de nuestra
                  comunidad.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-1.5 bg-filabe-dark text-filabe-text hover:bg-filabe-dark/90"
                  onClick={() => setShowSignUpModal(true)}
                >
                  Registrate <ChevronRight className="h-4 w-4" />
                </Button>
                <Link href="/projects">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-filabe-dark text-filabe-text hover:bg-filabe-dark/10"
                  >
                    Explorar Proyectos
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-12">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="text-filabe-text font-bold text-xl">ASTERA</div>
              <p className="mt-4 text-sm text-filabe-text/70 max-w-xs">
                Astera permite emitir y operar activos digitales regulados mediante infraestructura blockchain con compliance e identidad verificada.
              </p>
              <div className="flex gap-4 mt-6">
                <a href="#" className="text-filabe-text/70 hover:text-filabe-teal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="text-filabe-text/70 hover:text-filabe-teal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="text-filabe-text/70 hover:text-filabe-teal">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-filabe-text">Infraestructura</h3>
              <ul className="space-y-4">
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Identidad Integrada</p>
                  <p>Unificación de la lógica de mercado con validación KYC directamente en el core del protocolo.</p>
                </li>
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Restricciones Automatizadas</p>
                  <p>Reglas de cumplimiento normativo y límites operativos integrados nativamente desde el diseño.</p>
                </li>
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Mercado Secundario</p>
                  <p>Trazabilidad completa y control de operaciones sin necesidad de estructuras de custodia centralizadas.</p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-filabe-text">Documentación</h3>
              <ul className="space-y-2 text-filabe-text/70">
                <li>
                  <Link href="/terminos-y-condiciones" className="hover:text-filabe-teal transition-colors">
                    Términos y Condiciones
                  </Link>
                </li>
                <li>
                  <Link href="/privacidad" className="hover:text-filabe-teal transition-colors">
                    Política de Privacidad
                  </Link>
                </li>
              </ul>

              <h3 className="text-lg font-semibold mb-4 mt-6 text-filabe-text">Arquitectura</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about#smart-contracts" className="text-filabe-text/70 hover:text-filabe-teal">
                    ¿Cómo funcionan las reglas de mercado?
                  </Link>
                </li>
                <li>
                  <Link href="/about#compliance" className="text-filabe-text/70 hover:text-filabe-teal">
                    Garantía de compliance regulatorio
                  </Link>
                </li>
                <li>
                  <Link href="/about#non-custodial" className="text-filabe-text/70 hover:text-filabe-teal">
                    Modelos operativos no custodios
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-filabe-lightgray mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-filabe-text/70">
              &copy; {new Date().getFullYear()} ASTERA. Todos los derechos reservados.
            </p>
            <p className="text-sm text-filabe-text/70 mt-2 md:mt-0">Ecosistema Blockchain y Activos Digitales Regulados</p>
          </div>
        </div>
      </footer>
      {/* Auth Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <SignUpModal open={showSignUpModal} onOpenChange={setShowSignUpModal} />
    </div>
  );
}
