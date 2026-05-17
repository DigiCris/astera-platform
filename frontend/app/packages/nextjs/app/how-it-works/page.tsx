"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
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
  Terminal,
  Cpu,
  ShieldCheck,
  Fingerprint
} from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";

// Variantes de animación coordinadas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  }
};

export default function HowItWorksPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-filabe-dark text-filabe-text overflow-hidden">
      {/* Navigation */}
      <MainNav
        showAuthButtons={true}
        onLoginClick={() => setLoginModalOpen(true)}
        onSignUpClick={() => setSignUpModalOpen(true)}
      />

      <main className="flex-1 relative py-16 lg:py-24">
        {/* Ambient background glows */}
        <div className="absolute top-10 left-1/4 w-[600px] h-[600px] bg-filabe-teal/5 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-filabe-teal/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">

          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-24 text-center max-w-3xl mx-auto space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-filabe-teal/20 bg-filabe-teal/5 text-xs font-mono text-filabe-teal">
              <Terminal className="h-3 w-3" /> system_architecture_v3.0
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none">
              ¿Cómo <span className="text-transparent bg-clip-text bg-gradient-to-r from-filabe-text to-filabe-teal">Funciona?</span>
            </h1>
            <p className="text-lg text-filabe-text/70 leading-relaxed pt-2">
              Astera integra identidad, compliance y emisión regulada en una infraestructura modular on-chain diseñada para plataformas financieras y operadores del mercado.
            </p>
          </motion.div>

          {/* Proceso de Operación Regulada (Timeline interactiva) */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-14 text-center text-2xl md:text-3xl font-black tracking-tight uppercase"
            >
              Flujo de Emisión y Operación
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-4 relative"
            >
              {/* Paso 1 */}
              <motion.div variants={itemVariants} className="relative group">
                <Card className="border-filabe-lightgray bg-filabe-gray/40 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 hover:bg-filabe-gray/70 rounded-2xl p-2 relative z-10 flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                        <UserCheck className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-4xl font-black text-filabe-text/10 group-hover:text-filabe-teal/20 transition-colors duration-300">01</span>
                    </div>
                    <CardTitle className="text-filabe-text text-lg font-bold">Configuración</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      El operador regulado (PSAV) crea el activo digital en la plataforma, definiendo las reglas de mercado, caps máximos, plazos y la estructura legal subyacente.
                    </p>
                  </CardContent>
                </Card>
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-filabe-teal/30 group-hover:text-filabe-teal group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Paso 2 */}
              <motion.div variants={itemVariants} className="relative group">
                <Card className="border-filabe-lightgray bg-filabe-gray/40 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 hover:bg-filabe-gray/70 rounded-2xl p-2 relative z-10 flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                        <FileCheck className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-4xl font-black text-filabe-text/10 group-hover:text-filabe-teal/20 transition-colors duration-300">02</span>
                    </div>
                    <CardTitle className="text-filabe-text text-lg font-bold">Validación KYC</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      El usuario completa la verificación de identidad. Al aprobarse, su clave pública o wallet queda habilitada y vinculada inmutablemente dentro del protocolo core.
                    </p>
                  </CardContent>
                </Card>
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-filabe-teal/30 group-hover:text-filabe-teal group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Paso 3 */}
              <motion.div variants={itemVariants} className="relative group">
                <Card className="border-filabe-lightgray bg-filabe-gray/40 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 hover:bg-filabe-gray/70 rounded-2xl p-2 relative z-10 flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-4xl font-black text-filabe-text/10 group-hover:text-filabe-teal/20 transition-colors duration-300">03</span>
                    </div>
                    <CardTitle className="text-filabe-text text-lg font-bold">Inversión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      El inversor acepta de forma electrónica los términos legales. La operación primaria procesa la orden, enviando los fondos directamente al destino o fideicomiso definido.
                    </p>
                  </CardContent>
                </Card>
                <div className="hidden md:block absolute top-1/2 -right-4 -translate-y-1/2 z-20 text-filabe-teal/30 group-hover:text-filabe-teal group-hover:translate-x-1 transition-all duration-300">
                  <ArrowRight className="h-6 w-6" />
                </div>
              </motion.div>

              {/* Paso 4 */}
              <motion.div variants={itemVariants} className="group">
                <Card className="border-filabe-lightgray bg-filabe-gray/40 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 hover:bg-filabe-gray/70 rounded-2xl p-2 flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                        <Coins className="h-6 w-6" />
                      </div>
                      <span className="font-mono text-4xl font-black text-filabe-text/10 group-hover:text-filabe-teal/20 transition-colors duration-300">04</span>
                    </div>
                    <CardTitle className="text-filabe-text text-lg font-bold">Control Secundario</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      Los tokens se administran bajo restricciones automatizadas. Cualquier transferencia secundaria se ejecuta obligatoriamente bajo las reglas de compliance on-chain de la red.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Arquitectura y Desarrollo (Bento Grid Rediseñado) */}
          <div className="mb-12">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-14 text-center text-2xl md:text-3xl font-black tracking-tight uppercase"
            >
              Arquitectura y Desarrollo
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Card Destacada - Capa Regulatoria (Doble Ancho) */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="md:col-span-2">
                <Card className="border-filabe-lightgray bg-gradient-to-br from-filabe-gray to-filabe-gray/30 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden group transition-all duration-300 hover:border-filabe-teal/40">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-filabe-teal/5 rounded-bl-full pointer-events-none group-hover:bg-filabe-teal/10 transition-colors duration-300" />
                  <CardHeader className="p-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal mb-5 shadow-inner">
                      <Lightbulb className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-filabe-text text-xl md:text-2xl font-black">Capa Regulatoria On-Chain</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-filabe-text/70 text-sm md:text-base leading-relaxed">
                      Diseñamos una infraestructura modular avanzada donde las reglas de cumplimiento normativo, los módulos de KYC distribuidos y las restricciones automáticas de transferencia conviven y se ejecutan directamente en el core inmutable de nuestros contratos inteligentes.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card Vertical - Integración Modular */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/40 backdrop-blur-sm rounded-2xl p-6 h-full flex flex-col justify-between transition-all duration-300 hover:border-filabe-teal/40">
                  <CardHeader className="p-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal mb-5">
                      <Building className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-filabe-text text-xl font-black">Integración White-Label</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <p className="text-filabe-text/70 text-sm leading-relaxed">
                      Proveemos el set de APIs de baja latencia y SDKs necesarios para que terceros construyan su propio frontend y flujos de experiencia de usuario a medida, delegando el peso del ledger y las reglas on-chain a nuestra red.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card Horizontal Inferior Ancha - Auditoría */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="md:col-span-3">
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all duration-300 hover:border-filabe-teal/40">
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal shadow-inner">
                      <Fingerprint className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-black text-filabe-text">Auditoría en Tiempo Real</CardTitle>
                      <span className="text-xs font-mono text-filabe-teal">zero-trust cryptography</span>
                    </div>
                  </div>
                  <p className="text-filabe-text/60 text-sm max-w-2xl leading-relaxed">
                    Garantizamos un registro criptográfico transparente e inalterable de todos los eventos del mercado secundario, límites operativos y estados de verificación. Esto ofrece a los reguladores y auditores un entorno seguro, determinista y completamente auditable sin fricción operativa.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Proyectos Destacados */}
          <div className="mb-20">
            <div className="flex flex-col items-center mb-10 space-y-2">
              <h2 className="text-center text-3xl font-extrabold tracking-tight text-filabe-text">
                Proyectos Destacados
              </h2>
              <div className="h-0.5 w-12 bg-filabe-teal rounded-full opacity-60" />
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Proyecto 1: Terrazas Diez */}
              <Card className="bg-filabe-gray/10 border-filabe-lightgray/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-filabe-teal/40 transition-all duration-300 group flex flex-col justify-between shadow-xl shadow-black/10">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-bold text-filabe-text group-hover:text-filabe-teal transition-colors">
                    Solaria Alpine Array
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-filabe-text/50 mt-1 flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-filabe-teal" /> Zermatt, Suiza
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="aspect-video overflow-hidden rounded-xl border border-filabe-lightgray/20 bg-filabe-dark/50 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=600&auto=format&fit=crop"
                        alt="Solaria Alpine Array"
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-filabe-text/70">
                      Micro-grid solar, contratos PPA firmados
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-filabe-gray/10 border-filabe-lightgray/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-filabe-teal/40 transition-all duration-300 group flex flex-col justify-between shadow-xl shadow-black/10">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-bold text-filabe-text group-hover:text-filabe-teal transition-colors">
                    Aether Data Tower
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-filabe-text/50 mt-1 flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-filabe-teal" /> Frankfurt, Alemania
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="aspect-video overflow-hidden rounded-xl border border-filabe-lightgray/20 bg-filabe-dark/50 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop"
                        alt="Aether Data Tower"
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-filabe-text/70">
                      Tier IV Data Center, refrigeración líquida
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Proyecto 3: Magnolias */}
              <Card className="bg-filabe-gray/10 border-filabe-lightgray/30 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-filabe-teal/40 transition-all duration-300 group flex flex-col justify-between shadow-xl shadow-black/10">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-lg font-bold text-filabe-text group-hover:text-filabe-teal transition-colors">
                    Veridian Logistics Hub
                  </CardTitle>
                  <CardDescription className="text-[11px] font-mono uppercase tracking-wider text-filabe-text/50 mt-1 flex items-center gap-1.5">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-filabe-teal" /> Puerto de Rotterdam, Países Bajos
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="aspect-video overflow-hidden rounded-xl border border-filabe-lightgray/20 bg-filabe-dark/50 relative">
                      <Image
                        src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop"
                        alt="Magnolias"
                        width={600}
                        height={400}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                      />
                    </div>
                    <p className="text-xs leading-relaxed text-filabe-text/70">
                      Distribución automatizada, AI drone delivery ready
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Valores */}
          <div className="mb-24 relative">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mb-12 text-center text-2xl md:text-3xl font-black tracking-tight uppercase text-filabe-text"
            >
              Nuestros Valores Core
            </motion.h2>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-4 sm:grid-cols-2 md:grid-cols-5"
            >
              {/* Confianza */}
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-filabe-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/5 border border-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                      <Shield className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                      Confianza
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Servicio */}
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-filabe-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/5 border border-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                      <Users className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                      Servicio
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Transparencia */}
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-filabe-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/5 border border-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                      <Coins className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                      Transparencia
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Compromiso */}
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-filabe-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/5 border border-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                      <Clock className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                      Compromiso
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>

              {/* Innovación */}
              <motion.div variants={itemVariants} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 15 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/30 backdrop-blur-sm h-full transition-all duration-300 hover:border-filabe-teal/40 group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-filabe-teal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardHeader className="flex flex-col items-center justify-center p-6 text-center h-full space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/5 border border-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-all duration-300 shadow-inner">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-base font-bold text-filabe-text tracking-tight group-hover:text-filabe-teal transition-colors duration-200">
                      Innovación
                    </CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* CTA Sección */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative rounded-2xl border border-filabe-teal/20 bg-gradient-to-br from-filabe-gray/60 to-filabe-dark/90 p-8 md:p-12 text-center overflow-hidden group shadow-xl shadow-filabe-teal-[2px]"
          >
            {/* Efecto decorativo de red/nodo */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-filabe-teal/10 rounded-full blur-2xl pointer-events-none group-hover:bg-filabe-teal/20 transition-colors duration-500" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-filabe-text">
                ¿Listo para escalar tu infraestructura<span className="text-filabe-teal animate-pulse">_</span>?
              </h2>
              <p className="text-sm md:text-base text-filabe-text/70 leading-relaxed max-w-xl mx-auto">
                Únete al ecosistema de Astera y despliega módulos financieros automatizados bajo el estándar tecnológico on-chain más seguro del mercado.
              </p>
              <div className="pt-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-filabe-teal text-filabe-dark font-bold tracking-wide hover:bg-filabe-teal/90 transition-all duration-300 shadow-md hover:shadow-filabe-teal/20 px-8 rounded-xl group/btn"
                >
                  <Link href="/projects" className="inline-flex items-center gap-2">
                    Explorar Protocolos
                    <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
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
