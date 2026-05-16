"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { LoginModal } from "~~/components/auth/login-modal";
import { SignUpModal } from "~~/components/auth/signup-modal";
import { Button } from "~~/components/ui/shadcn/button";
import { Separator } from "~~/components/ui/shadcn/separator";

export default function PrivacyPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [signUpModalOpen, setSignUpModalOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-filabe-lightgray bg-filabe-dark/95 backdrop-blur supports-[backdrop-filter]:bg-filabe-dark/60">
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
              Mi Inversión
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLoginModalOpen(true)}
              className="border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
            >
              Ingresar
            </Button>
            <Button
              size="sm"
              onClick={() => setSignUpModalOpen(true)}
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Registrarse
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-filabe-dark">
        <div className="container py-12 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-filabe-text">Política de Privacidad</h1>
            <div className="bg-filabe-gray p-8 rounded-lg border border-filabe-lightgray space-y-6 text-filabe-text/90">
              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">1. Introducción</h2>
                <p className="mb-3">
                  En FILABE, valoramos y respetamos su privacidad. Esta Política de Privacidad describe cómo
                  recopilamos, utilizamos, almacenamos y protegemos su información personal cuando utiliza nuestra
                  plataforma de crowdfunding inmobiliario.
                </p>
                <p>
                  Al utilizar nuestra plataforma, usted acepta las prácticas descritas en esta Política de Privacidad.
                  Le recomendamos que lea detenidamente este documento para comprender nuestros procedimientos con
                  respecto a su información personal.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">2. Información que Recopilamos</h2>
                <p className="mb-3">Podemos recopilar los siguientes tipos de información:</p>
                <h3 className="font-medium mb-2 text-filabe-text">2.1 Información Personal</h3>
                <ul className="list-disc pl-6 space-y-2 mb-3">
                  <li>Información de identificación (nombre, apellido, fecha de nacimiento)</li>
                  <li>
                    Información de contacto (dirección de correo electrónico, número de teléfono, dirección postal)
                  </li>
                  <li>Información financiera (detalles de cuenta bancaria, historial de transacciones)</li>
                  <li>Documentos de identidad (DNI, pasaporte) para verificación KYC</li>
                  <li>Información fiscal (CUIT/CUIL, situación fiscal)</li>
                </ul>
                <h3 className="font-medium mb-2 text-filabe-text">2.2 Información de Uso</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Datos de navegación y uso de la plataforma</li>
                  <li>Dirección IP y tipo de dispositivo</li>
                  <li>Cookies y tecnologías similares</li>
                  <li>Historial de inversiones y preferencias</li>
                  <li>Comunicaciones con nuestro equipo de soporte</li>
                </ul>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">3. Cómo Utilizamos su Información</h2>
                <p className="mb-3">Utilizamos su información personal para los siguientes propósitos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Proporcionar y mejorar nuestros servicios</li>
                  <li>Procesar inversiones y transacciones</li>
                  <li>Verificar su identidad y cumplir con requisitos regulatorios (KYC/AML)</li>
                  <li>Comunicarnos con usted sobre su cuenta, inversiones y actualizaciones de la plataforma</li>
                  <li>Enviar información sobre nuevos proyectos y oportunidades de inversión</li>
                  <li>Prevenir fraudes y actividades ilegales</li>
                  <li>Cumplir con obligaciones legales y fiscales</li>
                  <li>Resolver disputas y solucionar problemas</li>
                  <li>Personalizar su experiencia en nuestra plataforma</li>
                </ul>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">4. Compartición de Información</h2>
                <p className="mb-3">
                  Podemos compartir su información personal con las siguientes categorías de destinatarios:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Desarrolladores de proyectos inmobiliarios en los que invierte</li>
                  <li>
                    Proveedores de servicios que nos ayudan a operar nuestra plataforma (procesadores de pago, servicios
                    de verificación de identidad, servicios en la nube)
                  </li>
                  <li>Asesores profesionales (abogados, contadores, auditores)</li>
                  <li>Autoridades reguladoras y gubernamentales cuando sea requerido por ley</li>
                  <li>
                    Potenciales compradores o inversores en caso de una venta, fusión o reorganización de nuestra
                    empresa
                  </li>
                </ul>
                <p className="mt-3">No vendemos su información personal a terceros con fines de marketing.</p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">5. Seguridad de la Información</h2>
                <p className="mb-3">
                  Implementamos medidas de seguridad técnicas, administrativas y físicas diseñadas para proteger su
                  información personal contra acceso no autorizado, pérdida, mal uso o alteración. Estas medidas
                  incluyen:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encriptación de datos sensibles</li>
                  <li>Firewalls y sistemas de detección de intrusiones</li>
                  <li>Acceso restringido a información personal</li>
                  <li>Monitoreo regular de nuestros sistemas para detectar vulnerabilidades</li>
                  <li>Capacitación de personal en prácticas de seguridad de datos</li>
                </ul>
                <p className="mt-3">
                  A pesar de nuestros esfuerzos, ningún método de transmisión o almacenamiento electrónico es 100%
                  seguro. No podemos garantizar la seguridad absoluta de su información.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">6. Retención de Datos</h2>
                <p className="mb-3">
                  Conservamos su información personal durante el tiempo necesario para cumplir con los propósitos
                  descritos en esta Política de Privacidad, a menos que se requiera o permita un período de retención
                  más largo por ley.
                </p>
                <p className="mb-3">Los factores que consideramos para determinar el período de retención incluyen:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>La duración de su relación con nosotros y los proyectos en los que ha invertido</li>
                  <li>Requisitos legales y regulatorios aplicables</li>
                  <li>Plazos de prescripción para posibles reclamaciones legales</li>
                  <li>Nuestras necesidades comerciales legítimas</li>
                </ul>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">7. Sus Derechos</h2>
                <p className="mb-3">
                  Dependiendo de su ubicación, puede tener ciertos derechos con respecto a su información personal, que
                  pueden incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Derecho de acceso: solicitar una copia de la información personal que tenemos sobre usted</li>
                  <li>Derecho de rectificación: solicitar la corrección de información inexacta o incompleta</li>
                  <li>
                    Derecho de supresión: solicitar la eliminación de su información personal en determinadas
                    circunstancias
                  </li>
                  <li>Derecho de oposición: oponerse al procesamiento de su información personal</li>
                  <li>Derecho de limitación: solicitar la restricción del procesamiento de su información personal</li>
                  <li>
                    Derecho de portabilidad: solicitar la transferencia de su información a otro proveedor de servicios
                  </li>
                </ul>
                <p className="mt-3">
                  Para ejercer estos derechos, contáctenos a través de nuestra página de{" "}
                  <Link href="/contact" className="text-filabe-teal hover:underline">
                    Contacto
                  </Link>{" "}
                  o enviando un correo electrónico a privacidad@filabe.com.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">8. Cookies y Tecnologías Similares</h2>
                <p className="mb-3">
                  Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestra plataforma, analizar
                  el uso del sitio y personalizar el contenido.
                </p>
                <p className="mb-3">Tipos de cookies que utilizamos:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Cookies esenciales: necesarias para el funcionamiento básico de la plataforma</li>
                  <li>
                    Cookies de rendimiento: nos ayudan a entender cómo los usuarios interactúan con nuestra plataforma
                  </li>
                  <li>
                    Cookies de funcionalidad: permiten recordar sus preferencias y proporcionar funciones mejoradas
                  </li>
                  <li>
                    Cookies de publicidad: utilizadas para mostrar anuncios relevantes y medir la efectividad de las
                    campañas
                  </li>
                </ul>
                <p className="mt-3">
                  Puede gestionar sus preferencias de cookies a través de la configuración de su navegador.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">9. Transferencias Internacionales</h2>
                <p>
                  Su información personal puede ser transferida y procesada en países distintos a aquel en el que
                  reside. Estos países pueden tener leyes de protección de datos diferentes a las de su país. Cuando
                  transferimos información a otros países, implementamos salvaguardas apropiadas para proteger su
                  información y cumplir con las leyes aplicables.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">10. Cambios a esta Política</h2>
                <p>
                  Podemos actualizar esta Política de Privacidad periódicamente para reflejar cambios en nuestras
                  prácticas o por otros motivos operativos, legales o regulatorios. Le notificaremos cualquier cambio
                  material publicando la nueva Política de Privacidad en nuestra plataforma y, cuando sea apropiado, le
                  informaremos por correo electrónico. Le recomendamos que revise esta política regularmente para estar
                  informado sobre cómo protegemos su información.
                </p>
              </section>

              <Separator className="bg-filabe-lightgray" />

              <section>
                <h2 className="text-xl font-semibold mb-3 text-filabe-text">11. Contacto</h2>
                <p>
                  Si tiene preguntas, inquietudes o solicitudes relacionadas con esta Política de Privacidad o el
                  procesamiento de su información personal, contáctenos a través de nuestra página de{" "}
                  <Link href="/contact" className="text-filabe-teal hover:underline">
                    Contacto
                  </Link>{" "}
                  o enviando un correo electrónico a privacidad@filabe.com.
                </p>
              </section>

              <div className="mt-8 text-sm text-filabe-text/70">
                <p>Última actualización: 15 de mayo de 2023</p>
              </div>
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
            <Link href="/privacy" className="text-sm text-filabe-teal hover:underline">
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
