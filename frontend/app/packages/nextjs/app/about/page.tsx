"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Building, Mail, MapPin, Phone } from "lucide-react";
import { Building2 } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { MainNav } from "~~/components/main-nav";
import { SmoothScroll } from "~~/components/smooth-scroll";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Separator } from "~~/components/ui/shadcn/separator";

export default function AboutPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SmoothScroll />

      {/* Navigation */}
      <MainNav
        showAuthButtons={true}
        onLoginClick={() => setLoginModalOpen(true)}
        onSignUpClick={() => setSignUpModalOpen(true)}
      />

      <main className="flex-1 bg-filabe-dark">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-filabe-text">Nosotros</h1>
            <p className="mx-auto max-w-3xl text-lg text-filabe-text/70">
              Filabe es una empresa dedicada a la construcción de hogares y comunidades con una visión de futuro que
              inspira la innovación. Nuestro compromiso es construir calidad de vida para nuestros clientes.
            </p>
          </div>

          {/* Misión y Visión */}
          <div className="mb-20 grid gap-8 md:grid-cols-2">
            <Card className="border-filabe-lightgray bg-filabe-gray">
              <CardHeader>
                <CardTitle className="text-filabe-text">Nuestra Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-filabe-text/70">
                  Ser líderes en América Latina en desarrollos inmobiliarios que generen bienestar y satisfacción.
                </p>
              </CardContent>
            </Card>

            <Card className="border-filabe-lightgray bg-filabe-gray">
              <CardHeader>
                <CardTitle className="text-filabe-text">Nuestra Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-filabe-text/70">
                  Construir comunidades sostenibles, maximizando la calidad de vida con un menor impacto ambiental.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Logros */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Nuestros Logros</h2>
            <div className="grid gap-8 md:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Building className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-filabe-text">40,000+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">Metros cuadrados construidos</p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Building className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-filabe-text">5+</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">Proyectos destacados</p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray text-center">
                <CardHeader>
                  <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-filabe-teal/20 text-filabe-teal">
                    <Building className="h-8 w-8" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-filabe-text">3</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">Oficinas en Argentina</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Equipo Directivo */}
          <div className="mb-20">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Equipo Directivo</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Sebastian Suarez"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-filabe-text">Sebastian Suarez</CardTitle>
                  <CardDescription className="text-filabe-text/70">CEO</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-filabe-text/70">
                    Visionario y líder comprometido con el crecimiento del equipo.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Noelia Suarez"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-filabe-text">Noelia Suarez</CardTitle>
                  <CardDescription className="text-filabe-text/70">Especialista en Comunicación</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-filabe-text/70">
                    Voz oficial de la compañía, apasionada por la decoración.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Emmanuel Ricci"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-filabe-text">Emmanuel Ricci</CardTitle>
                  <CardDescription className="text-filabe-text/70">Director Comercial</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-filabe-text/70">
                    Enfocado en el crecimiento estratégico y la fidelización de clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Eduardo Palanika Yancowey"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-filabe-text">Eduardo Palanika Yancowey</CardTitle>
                  <CardDescription className="text-filabe-text/70">Gerente de Arquitectura</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-filabe-text/70">
                    Responsable de optimizar resultados en proyectos arquitectónicos.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full">
                    <Image
                      src="/placeholder.svg?height=200&width=200"
                      alt="Rodrigo Lucero"
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardTitle className="text-filabe-text">Rodrigo Lucero</CardTitle>
                  <CardDescription className="text-filabe-text/70">Gerente de Expansión y Desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-filabe-text/70">
                    Comprometido con la excelencia y la creación de comunidades sostenibles.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Testimonios */}
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

          {/* Preguntas Frecuentes */}
          <div className="mb-20" id="faq-section">
            <h2 className="mb-10 text-center text-3xl font-bold text-filabe-text">Preguntas Frecuentes</h2>
            <div className="grid gap-6">
              <Card className="border-filabe-lightgray bg-filabe-gray" id="faq-financiamiento">
                <CardHeader>
                  <CardTitle className="text-filabe-text">
                    ¿Ofrecen opciones de financiamiento para la compra de propiedades?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Sí, ofrecemos diversas opciones de financiamiento adaptadas a las necesidades de nuestros clientes,
                    incluyendo planes de pago flexibles durante la construcción y alianzas con entidades bancarias.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray" id="faq-permutas">
                <CardHeader>
                  <CardTitle className="text-filabe-text">¿Aceptan permutas como parte de pago?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Sí, evaluamos caso por caso la posibilidad de aceptar propiedades en permuta como parte de pago para
                    nuestros desarrollos inmobiliarios.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray" id="faq-posventa">
                <CardHeader>
                  <CardTitle className="text-filabe-text">¿Qué tipo de servicio posventa ofrecen?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Nuestro servicio posventa incluye atención personalizada, garantía sobre la construcción,
                    mantenimiento y asesoramiento continuo para asegurar la satisfacción total de nuestros clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-filabe-lightgray bg-filabe-gray">
                <CardHeader>
                  <CardTitle className="text-filabe-text">¿Qué amenidades ofrecen en sus proyectos?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-filabe-text/70">
                    Dependiendo del proyecto, ofrecemos amenidades como piscinas, gimnasios, salones de usos múltiples,
                    áreas verdes, seguridad 24/7, estacionamientos y tecnologías sustentables.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contacto */}
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

          {/* Redes Sociales */}
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
          </div>

          <Separator className="mb-8 bg-filabe-lightgray" />

          <div className="text-center text-sm text-filabe-text/70">
            <p>Copyright © {new Date().getFullYear()} ASTERA</p>
            <p>Ecosistema Blockchain y Activos Digitales Regulados</p>
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
