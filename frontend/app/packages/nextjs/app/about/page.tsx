"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Building, Mail, MapPin, Phone, Shield, Cpu, Users, ShieldCheck, Terminal, Layers } from "lucide-react";
import { Building2 } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { SmoothScroll } from "~~/components/smooth-scroll";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Separator } from "~~/components/ui/shadcn/separator";

// Variantes de animación fluidas
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 90, damping: 16 } 
  }
};

const leftRevealVariants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
};

export default function AboutPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-filabe-dark overflow-hidden">
      <SmoothScroll />

      {/* Navigation */}
      <MainNav
        showAuthButtons={true}
        onLoginClick={() => setLoginModalOpen(true)}
        onSignUpClick={() => setSignUpModalOpen(true)}
      />

      <main className="flex-1 relative py-16 lg:py-24">
        {/* Luces de fondo ambientales */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-filabe-teal/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-filabe-teal/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          
          {/* Hero Header Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-24">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-filabe-teal/20 bg-filabe-teal/5 text-xs font-semibold text-filabe-teal uppercase tracking-wider">
                Sobre Nosotros
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-filabe-text leading-none">
                Evolucionando el <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-filabe-text via-filabe-text to-filabe-teal">
                  Ecosistema Financiero
                </span>
              </h1>
              <div className="h-1 w-20 bg-gradient-to-r from-filabe-teal to-transparent rounded-full" />
              <p className="max-w-2xl text-lg text-filabe-text/80 leading-relaxed">
                Astera es una plataforma de infraestructura tecnológica diseñada para la próxima generación de mercados tokenizados regulados en América Latina, combinando programabilidad blockchain con estricto soporte legal.
              </p>
            </motion.div>

            {/* Elemento Gráfico Interactivo a la derecha */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 60 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="border border-filabe-lightgray bg-filabe-gray/30 p-6 rounded-2xl relative overflow-hidden backdrop-blur-md shadow-2xl shadow-black/50">
                <div className="flex items-center justify-between mb-6 border-b border-filabe-lightgray/40 pb-4">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-filabe-teal" />
                    <span className="text-xs font-mono text-filabe-text/60">astera-core-status</span>
                  </div>
                  <div className="h-2 w-2 rounded-full bg-filabe-teal animate-pulse" />
                </div>
                <div className="space-y-3 font-mono text-xs text-filabe-text/70">
                  <p className="text-filabe-teal">&gt; initializing legal-compliance layer...</p>
                  <p>&gt; binding verified identities (KYC/AML) on-chain</p>
                  <p>&gt; ledger state: active / network finality &lt; 1s</p>
                  <p className="text-filabe-text/40">&gt; multi-framework architecture deployment ok</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Misión y Visión Balanceadas */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-28 grid gap-8 md:grid-cols-2"
          >
            <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="group">
              <Card className="border-filabe-lightgray bg-filabe-gray/50 h-full backdrop-blur-sm transition-all duration-300 hover:border-filabe-teal/30 hover:bg-filabe-gray/80 rounded-2xl p-4">
                <CardHeader>
                  <CardTitle className="text-filabe-text flex items-center gap-3 text-xl font-bold">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-colors duration-300">
                      <Layers className="h-5 w-5" />
                    </div>
                    Nuestra Misión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70 leading-relaxed text-sm md:text-base">
                    Proveer a fintechs, PSAVs e instituciones financieras la capa tecnológica necesaria para emitir y operar activos digitales regulados de forma ágil, segura y sin fricciones.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} whileHover={{ y: -6 }} className="group">
              <Card className="border-filabe-lightgray bg-filabe-gray/50 h-full backdrop-blur-sm transition-all duration-300 hover:border-filabe-teal/30 hover:bg-filabe-gray/80 rounded-2xl p-4">
                <CardHeader>
                  <CardTitle className="text-filabe-text flex items-center gap-3 text-xl font-bold">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal group-hover:bg-filabe-teal group-hover:text-filabe-dark transition-colors duration-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    Nuestra Visión
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70 leading-relaxed text-sm md:text-base">
                    Consolidarnos como el estándar de infraestructura on-chain para activos del mundo real (RWA) en la región, impulsando un ecosistema financiero transparente, permissioned y eficiente.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Infraestructura Core - Bento Grid Rediseñado */}
          <div className="mb-28">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <h2 className="text-3xl font-bold tracking-tight text-filabe-text">Infraestructura Core</h2>
              <p className="text-filabe-text/60 text-sm mt-2">Módulos avanzados integrados en nuestro ledger distribuido</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-6 md:grid-cols-3"
            >
              {/* Card Ancha Destacada */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="md:col-span-2">
                <Card className="border-filabe-lightgray bg-gradient-to-br from-filabe-gray to-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 rounded-2xl p-6 h-full flex flex-col justify-between relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-filabe-teal/5 rounded-bl-full pointer-events-none group-hover:bg-filabe-teal/10 transition-colors duration-300" />
                  <CardHeader className="p-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal mb-4 shadow-inner">
                      <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-4xl font-black tracking-tight text-filabe-text">100%</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <h4 className="text-lg font-bold text-filabe-text mb-1">Compliance Automático</h4>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      Lógica nativa de cumplimiento normativo integrada directamente en los contratos inteligentes. Auditoría y trazabilidad on-chain sin puntos ciegos.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card Vertical PSAV */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                <Card className="border-filabe-lightgray bg-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 rounded-2xl p-6 h-full flex flex-col justify-between">
                  <CardHeader className="p-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal mb-4">
                      <Building className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-3xl font-black tracking-tight text-filabe-text">PSAV</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 mt-4">
                    <h4 className="text-lg font-bold text-filabe-text mb-1">Estructura Regulada</h4>
                    <p className="text-filabe-text/60 text-sm leading-relaxed">
                      Control administrativo avanzado diseñado para proveedores de servicios de activos virtuales y entidades financieras tradicionales.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Card Vertical Speed */}
              <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="md:col-span-3">
                <Card className="border-filabe-lightgray bg-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-filabe-teal/10 text-filabe-teal shrink-0">
                      <Cpu className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl font-black text-filabe-text">Sub-second Finality</CardTitle>
                      <h4 className="text-sm font-semibold text-filabe-teal">Consenso Avalanche de Alta Velocidad</h4>
                    </div>
                  </div>
                  <p className="text-filabe-text/60 text-sm max-w-xl leading-relaxed">
                    Liquidación instantánea de transacciones financieras y ejecuciones de smart contracts optimizadas para cargas de trabajo críticas e institucionales.
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          </div>

          {/* Equipo Directivo Rediseñado */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl font-bold tracking-tight text-filabe-text">Equipo de Core Developers</h2>
              <p className="text-filabe-text/60 text-sm mt-2">Los ingenieros detrás de la infraestructura descentralizada de Astera</p>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            >
              {/* Desarrollador 1 - DigiCris */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="border-filabe-lightgray bg-gradient-to-b from-filabe-gray to-filabe-gray/30 h-full transition-all duration-300 hover:border-filabe-teal/40 hover:shadow-2xl hover:shadow-filabe-teal/5 rounded-2xl overflow-hidden relative">
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full p-1 bg-gradient-to-tr from-filabe-teal/30 to-transparent group-hover:from-filabe-teal transition-all duration-500 relative">
                      <div className="w-full h-full rounded-full overflow-hidden bg-filabe-dark">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="DigiCris"
                          width={200}
                          height={200}
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-filabe-text text-xl font-bold">DigiCris</CardTitle>
                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-filabe-teal/10 text-filabe-teal border border-filabe-teal/20">
                      Team Lead
                    </div>
                  </div>
                  <div className="border-t border-filabe-lightgray/40 bg-filabe-dark/40 px-6 py-4">
                    <p className="text-center text-filabe-text/70 font-mono text-xs">
                      Full Stack & Web3 Architect
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Desarrollador 2 - Carlos Henríquez (NightmareFox12) */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="border-filabe-lightgray bg-gradient-to-b from-filabe-gray to-filabe-gray/30 h-full transition-all duration-300 hover:border-filabe-teal/40 hover:shadow-2xl hover:shadow-filabe-teal/5 rounded-2xl overflow-hidden relative">
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full p-1 bg-gradient-to-tr from-filabe-teal/30 to-transparent group-hover:from-filabe-teal transition-all duration-500 relative">
                      <div className="w-full h-full rounded-full overflow-hidden bg-filabe-dark">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="NightmareFox12"
                          width={200}
                          height={200}
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-filabe-text text-xl font-bold">NightmareFox12</CardTitle>
                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-filabe-teal/10 text-filabe-teal border border-filabe-teal/20">
                      Core Developer
                    </div>
                  </div>
                  <div className="border-t border-filabe-lightgray/40 bg-filabe-dark/40 px-6 py-4">
                    <p className="text-center text-filabe-text/70 font-mono text-xs">
                      Blockchain & Advanced Backend Engineer
                    </p>
                  </div>
                </Card>
              </motion.div>

              {/* Desarrollador 3 - Echizen512 */}
              <motion.div variants={itemVariants} whileHover={{ y: -8 }} className="group">
                <Card className="border-filabe-lightgray bg-gradient-to-b from-filabe-gray to-filabe-gray/30 h-full transition-all duration-300 hover:border-filabe-teal/40 hover:shadow-2xl hover:shadow-filabe-teal/5 rounded-2xl overflow-hidden relative">
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full p-1 bg-gradient-to-tr from-filabe-teal/30 to-transparent group-hover:from-filabe-teal transition-all duration-500 relative">
                      <div className="w-full h-full rounded-full overflow-hidden bg-filabe-dark">
                        <Image
                          src="/placeholder.svg?height=200&width=200"
                          alt="Echizen512"
                          width={200}
                          height={200}
                          className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>
                    </div>
                    <CardTitle className="text-filabe-text text-xl font-bold">Echizen512</CardTitle>
                    <div className="mt-1.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-filabe-teal/10 text-filabe-teal border border-filabe-teal/20">
                      Core Developer
                    </div>
                  </div>
                  <div className="border-t border-filabe-lightgray/40 bg-filabe-dark/40 px-6 py-4">
                    <p className="text-center text-filabe-text/70 font-mono text-xs">
                      Full Stack Dev & System Logic
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
          {/* Testimonios 
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Testimonios</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardContent className="pt-6">
                  <div className="mb-4 text-4xl font-serif text-filabe-teal">"</div>
                  <p className="mb-4 text-lg italic text-filabe-text/70">
                    Experiencia muy positiva al haber hecho trato con Filabe.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-filabe-dark">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Julio Lucero"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-filabe-text">Julio Lucero</p>
                      <p className="text-sm text-filabe-text/70">Cliente de Terrazas Diez</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardContent className="pt-6">
                  <div className="mb-4 text-4xl font-serif text-filabe-teal">"</div>
                  <p className="mb-4 text-lg italic text-filabe-text/70">
                    Felices estamos, enamorados de todo lo que es Magnolias.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full bg-filabe-dark">
                      <Image
                        src="/placeholder.svg?height=100&width=100"
                        alt="Karina Melgares"
                        width={100}
                        height={100}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-filabe-text">Karina Melgares</p>
                      <p className="text-sm text-filabe-text/70">Cliente de Magnolias</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          */}

{/* Preguntas Frecuentes */}
<div className="mb-20 relative" id="faq-section">
  {/* Halo de luz de fondo sutil */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-filabe-teal/5 rounded-full blur-3xl pointer-events-none" />

  <motion.h2 
    initial={{ opacity: 0, y: -10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="mb-2 text-center text-3xl font-bold tracking-tight text-filabe-text relative z-10"
  >
    Preguntas Frecuentes
  </motion.h2>
  <p className="mb-12 text-center text-xs font-mono text-filabe-text/50 uppercase tracking-widest relative z-10">
    &gt; astera_knowledge_base // protocol_docs
  </p>

  <motion.div 
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: "-100px" }}
    className="max-w-4xl mx-auto grid gap-4 relative z-10"
  >
    {/* FAQ 1 - Compliance */}
    <motion.div variants={itemVariants} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="border-filabe-lightgray bg-gradient-to-r from-filabe-gray to-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 hover:shadow-lg hover:shadow-filabe-teal/5" id="faq-compliance">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-md bg-filabe-teal/10 text-filabe-teal font-mono text-xs font-bold shrink-0">
              01
            </div>
            <CardTitle className="text-filabe-text text-base md:text-lg font-bold">
              ¿Cómo garantiza Astera el cumplimiento normativo (Compliance)?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pl-14 pr-6 pb-5">
          <p className="text-filabe-text/70 text-sm md:text-base leading-relaxed">
            Astera es <span className="text-filabe-teal font-medium">compliance-native</span>. El protocolo valida las reglas de elegibilidad, límites del mercado, restricciones de transferencia y procesos de freeze directamente en la lógica de los smart contracts antes de autorizar cualquier transacción.
          </p>
        </CardContent>
      </Card>
    </motion.div>

    {/* FAQ 2 - Custodia */}
    <motion.div variants={itemVariants} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="border-filabe-lightgray bg-gradient-to-r from-filabe-gray to-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 hover:shadow-lg hover:shadow-filabe-teal/5" id="faq-custodia">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-md bg-filabe-teal/10 text-filabe-teal font-mono text-xs font-bold shrink-0">
              02
            </div>
            <CardTitle className="text-filabe-text text-base md:text-lg font-bold">
              ¿Astera realiza custodia de los fondos de los inversores?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pl-14 pr-6 pb-5">
          <p className="text-filabe-text/70 text-sm md:text-base leading-relaxed">
            No. El modelo de Astera es de <span className="text-filabe-teal font-medium">no custodia</span>. La infraestructura enruta los fondos de las compras del mercado primario directamente a la wallet del fideicomiso, exchange regulado o estructura legal definida por el operador del sistema.
          </p>
        </CardContent>
      </Card>
    </motion.div>

    {/* FAQ 3 - Identidad */}
    <motion.div variants={itemVariants} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="border-filabe-lightgray bg-gradient-to-r from-filabe-gray to-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 hover:shadow-lg hover:shadow-filabe-teal/5" id="faq-identidad">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-md bg-filabe-teal/10 text-filabe-teal font-mono text-xs font-bold shrink-0">
              03
            </div>
            <CardTitle className="text-filabe-text text-base md:text-lg font-bold">
              ¿Cómo se vincula el proceso KYC con las wallets de los usuarios?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pl-14 pr-6 pb-5">
          <p className="text-filabe-text/70 text-sm md:text-base leading-relaxed">
            A través de una capa de identidad verificada. Cuando un usuario completa con éxito su proceso de KYC, su dirección de wallet se registra <span className="text-filabe-teal font-medium">on-chain</span> en una lista permissioned, habilitándola para recibir, operar o transferir los activos tokenizados bajo las reglas del mercado.
          </p>
        </CardContent>
      </Card>
    </motion.div>

    {/* FAQ 4 - Arquitectura */}
    <motion.div variants={itemVariants} whileHover={{ x: 6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <Card className="border-filabe-lightgray bg-gradient-to-r from-filabe-gray to-filabe-gray/40 transition-all duration-300 hover:border-filabe-teal/30 hover:shadow-lg hover:shadow-filabe-teal/5" id="faq-arquitectura">
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-md bg-filabe-teal/10 text-filabe-teal font-mono text-xs font-bold shrink-0">
              04
            </div>
            <CardTitle className="text-filabe-text text-base md:text-lg font-bold">
              ¿Qué tipo de modelo operativo ofrece para empresas y Fintechs?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pl-14 pr-6 pb-5">
          <p className="text-filabe-text/70 text-sm md:text-base leading-relaxed">
            Ofrecemos una solución modular <span className="text-filabe-teal font-medium">white-label</span>. Esto permite a los desarrolladores y plataformas financieras construir su propio frontend, marca y experiencia de usuario a medida, mientras que el operador regulado (PSAV) conserva el control administrativo centralizado de las reglas on-chain.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  </motion.div>
</div>
          {/* Contacto 
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Nuestras Oficinas</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Oficina Berazategui</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">Av. Mitre 799, B1880 Berazategui, Provincia de Buenos Aires</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">(+54) 11 5612-9008</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">hola@filabe.com.ar</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Oficina Puerto Madero</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">Lola Mora 421 Of. 401, CABA</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">Oficina Villarobles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">Ruta 11 KM. 374, Villarobles</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">(+54) 11 5613-3057</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-filabe-teal" />
                    <p className="text-filabe-text/70">arenas.villarobles@filabe.com.ar</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Redes Sociales 
          <div className="mb-20 text-center">
            <h2 className="mb-6 text-2xl font-bold text-filabe-text">Síguenos en Redes Sociales</h2>
            <div className="flex justify-center gap-6">
              <Link
                href="https://facebook.com"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal transition-colors hover:bg-filabe-teal hover:text-filabe-dark"
              >
                <Phone className="h-6 w-6" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://instagram.com"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal transition-colors hover:bg-filabe-teal hover:text-filabe-dark"
              >
                <Phone className="h-6 w-6" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://youtube.com"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal transition-colors hover:bg-filabe-teal hover:text-filabe-dark"
              >
                <Phone className="h-6 w-6" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          */}
          </div>
      </main>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-filabe-text font-bold text-xl flex items-center gap-2">
              <img src="/favicon.png" alt="icon" className="h-16 w-16"/>
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
