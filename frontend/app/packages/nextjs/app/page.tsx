"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, DollarSign, LineChart, Shield, Users } from "lucide-react";
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
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none mb-6">
                Expertos en Diseño y Desarrollo Urbano
              </h1>
              <p className="max-w-[600px] mx-auto text-filabe-text/90 md:text-xl mb-8">
                Construimos hogares y comunidades con una visión de futuro que inspira la innovación. Nuestro compromiso
                es construir calidad de vida para nuestros clientes.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row justify-center">
                <Link href="/projects">
                  <Button size="lg" className="gap-1.5 bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">
                    Explorar Proyectos <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/how-it-works">
                  <Button size="lg" variant="outline" className="border-filabe-teal text-filabe-teal">
                    Cómo Funciona
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Logros */}
        <section className="bg-filabe-dark py-16">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4 text-filabe-text">Nuestros Logros</h2>
                <div className="h-1 w-20 bg-filabe-teal mb-6"></div>
                <p className="text-filabe-text/80 text-lg">
                  En Filabe, nos enorgullecemos de nuestro impacto en el desarrollo urbano y la creación de espacios que
                  mejoran la calidad de vida.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <span className="text-5xl font-bold text-filabe-teal block">+40</span>
                  <span className="text-2xl font-medium text-filabe-text">mil m²</span>
                  <p className="text-filabe-text/70 mt-2">construidos</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
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

        {/* How It Works */}
        <section className="bg-filabe-gray">
          <div className="filabe-container">
            <div className="flex flex-col items-start justify-center space-y-2 mb-12">
              <h2 className="section-heading">Cómo Trabajamos</h2>
              <p className="max-w-[700px] text-filabe-text/80 md:text-lg">
                Nuestro proceso está diseñado para garantizar la máxima calidad y satisfacción en cada proyecto que
                desarrollamos.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-12 mt-12 md:grid-cols-3">
              <div className="flex flex-col items-start space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20">
                  <Users className="h-8 w-8 text-filabe-teal" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">1. Diseño Personalizado</h3>
                <p className="text-filabe-text/70">
                  Trabajamos estrechamente con nuestros clientes para entender sus necesidades y crear espacios que
                  reflejen su visión y estilo de vida.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20">
                  <Shield className="h-8 w-8 text-filabe-teal" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">2. Construcción de Calidad</h3>
                <p className="text-filabe-text/70">
                  Utilizamos materiales de primera calidad y las técnicas más avanzadas para garantizar durabilidad,
                  eficiencia y sostenibilidad en cada proyecto.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20">
                  <DollarSign className="h-8 w-8 text-filabe-teal" />
                </div>
                <h3 className="text-xl font-bold text-filabe-text">3. Entrega y Seguimiento</h3>
                <p className="text-filabe-text/70">
                  Nos comprometemos con plazos realistas y ofrecemos un servicio posventa excepcional para asegurar la
                  satisfacción total de nuestros clientes.
                </p>
              </div>
            </div>
            <div className="flex justify-center mt-12">
              <Link href="/how-it-works">
                <Button size="lg" className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90">
                  Conoce Más
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Filosofía y Valores */}
        <section className="bg-filabe-dark">
          <div className="filabe-container">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div>
                  <h2 className="section-heading">Nuestra Filosofía</h2>
                  <p className="max-w-[600px] text-filabe-text/80 md:text-lg mt-6">
                    En Filabe, aspiramos a ser líderes en América Latina en desarrollos inmobiliarios que generen
                    bienestar y satisfacción, construyendo comunidades sostenibles que maximizan la calidad de vida con
                    un menor impacto ambiental.
                  </p>
                </div>
                <ul className="grid gap-6">
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-filabe-teal/20 shrink-0">
                      <DollarSign className="h-5 w-5 text-filabe-teal" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text">Confianza</h3>
                      <p className="text-filabe-text/70">
                        Construimos relaciones sólidas basadas en la honestidad y el cumplimiento de nuestros
                        compromisos.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-filabe-teal/20 shrink-0">
                      <Shield className="h-5 w-5 text-filabe-teal" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text">Transparencia</h3>
                      <p className="text-filabe-text/70">
                        Comunicamos de manera clara y abierta todos los aspectos de nuestros proyectos y procesos.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-filabe-teal/20 shrink-0">
                      <LineChart className="h-5 w-5 text-filabe-teal" />
                    </div>
                    <div>
                      <h3 className="font-bold text-filabe-text">Innovación</h3>
                      <p className="text-filabe-text/70">
                        Buscamos constantemente nuevas soluciones y tecnologías para mejorar nuestros desarrollos y
                        procesos.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="mx-auto w-full max-w-[500px] lg:max-w-none">
                <div className="aspect-square overflow-hidden rounded-md">
                  <Image
                    src="/placeholder.svg?height=800&width=800"
                    alt="Desarrollo inmobiliario Filabe"
                    width={800}
                    height={800}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonios */}
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
              <div className="text-filabe-text font-bold text-xl">FILABE</div>
              <p className="mt-4 text-sm text-filabe-text/70 max-w-xs">
                Transformamos la ciudad para que puedas transformar tu vida. Inversión inmobiliaria accesible para
                todos.
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
              <h3 className="text-lg font-semibold mb-4 text-filabe-text">Oficinas</h3>
              <ul className="space-y-4">
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Berazategui</p>
                  <p>Av. Mitre 799, B1880 Berazategui</p>
                  <p>Provincia de Buenos Aires</p>
                  <p>Tel: (+54) 11 5612-9008</p>
                </li>
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Puerto Madero</p>
                  <p>Lola Mora 421 Of. 401, CABA</p>
                </li>
                <li className="text-filabe-text/70">
                  <p className="font-medium text-filabe-text">Villarobles</p>
                  <p>Ruta 11 KM. 374, Villarobles</p>
                  <p>Tel: (+54) 11 5613-3057</p>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-filabe-text">Contacto</h3>
              <ul className="space-y-2 text-filabe-text/70">
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <span>(+54) 11 5612-9008</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <span>hola@filabe.com.ar</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mt-0.5"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <span>@filabe.ar</span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold mb-4 mt-6 text-filabe-text">Preguntas Frecuentes</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about#faq-financiamiento" className="text-filabe-text/70 hover:text-filabe-teal">
                    ¿Ofrecen opciones de financiamiento?
                  </Link>
                </li>
                <li>
                  <Link href="/about#faq-permutas" className="text-filabe-text/70 hover:text-filabe-teal">
                    ¿Aceptan permutas como parte de pago?
                  </Link>
                </li>
                <li>
                  <Link href="/about#faq-posventa" className="text-filabe-text/70 hover:text-filabe-teal">
                    ¿Qué tipo de servicio posventa ofrecen?
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-filabe-lightgray mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-filabe-text/70">
              &copy; {new Date().getFullYear()} SUAREZ FILABE SA. Todos los derechos reservados.
            </p>
            <p className="text-sm text-filabe-text/70 mt-2 md:mt-0">San Martín Calle 52 654 88, Quilmes, B1878FQN</p>
          </div>
        </div>
      </footer>

      {/* Auth Modals */}
      <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
      <SignUpModal open={showSignUpModal} onOpenChange={setShowSignUpModal} />
    </div>
  );
}
