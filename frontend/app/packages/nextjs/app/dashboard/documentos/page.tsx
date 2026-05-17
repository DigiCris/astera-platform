"use client"

import Link from "next/link"
import {
  Bell,
  Building2,
  CreditCard,
  Download,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  PieChart,
  User,
  Search,
  Calendar,
  Eye,
} from "lucide-react"

import { Button } from "~~/components/ui/shadcn/button"
import { Card, CardContent } from "~~/components/ui/shadcn/card"
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/shadcn/sheet"
import { Input } from "~~/components/ui/shadcn/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select"
import { useState, useRef, useEffect } from "react"

export default function DocumentosPage() {
  // Añadir el estado y los refs al inicio del componente
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Añadir un efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        buttonRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Navigation */}
      <header className="sticky top-0 z-50 w-full border-b border-filabe-lightgray bg-filabe-dark/95 backdrop-blur supports-[backdrop-filter]:bg-filabe-dark/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-filabe-text font-bold text-xl flex items-center gap-2">
            <img src="/favicon.png" alt="icon" className="h-16 w-16"/>
            <span>ASTERA</span>
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
                      <img src="/favicon.png" alt="icon" className="h-16 w-16"/>
                      <span className="text-xl font-bold">ASTERA</span>
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
                          className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
              <Button
                ref={buttonRef}
                variant="outline"
                size="icon"
                className="relative transition-all duration-200 hover:bg-primary/10 active:scale-95"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-5 w-5 transition-transform duration-300 ease-in-out" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground animate-in zoom-in-50 duration-300">
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

                  <div className="max-h-[400px] overflow-auto">
                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Nuevo documento disponible</p>
                          <span className="text-xs text-muted-foreground">Hace 1 hora</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Se ha añadido un nuevo informe trimestral para "Terrazas Diez".
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Certificado de participación</p>
                          <span className="text-xs text-muted-foreground">Hace 1 día</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Tu certificado de participación para "Jufré 1085" está disponible para descargar.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Actualización de documentos</p>
                          <span className="text-xs text-muted-foreground">Hace 3 días</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Se han actualizado los planos de planta para el proyecto "Terrazas Brown".
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
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Mobile Navigation */}

        {/* Desktop Sidebar */}
        <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
          <div className="flex h-full flex-col">
            <nav className="flex-1 overflow-auto py-6">
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
                    className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Documentos</h1>
            </div>

            {/* Filtros */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar documentos..." className="w-full pl-8 bg-background" />
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Select defaultValue="all">
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Tipo de Documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="contract">Contratos</SelectItem>
                    <SelectItem value="report">Informes</SelectItem>
                    <SelectItem value="tax">Documentos Fiscales</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Lista de Documentos */}
            <div className="grid gap-4">
              {documents.map((document) => (
                <Card key={document.id}>
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">{document.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {document.date} • {document.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 md:flex-row">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      </div>

                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </main>
        </div>
      </div>

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
    </div>
  )
}

// Sample data
const documents = [
  {
    id: 1,
    name: "Oakridge Apartments - Contrato de Inversión",
    type: "PDF",
    date: "15 Enero, 2023",
    category: "contract",
    project: "Oakridge Apartments",
  },
  {
    id: 2,
    name: "Riverside Commercial Center - Memorando de Oferta",
    type: "PDF",
    date: "10 Abril, 2023",
    category: "contract",
    project: "Riverside Commercial Center",
  },
  {
    id: 3,
    name: "Documentos Fiscales 2022",
    type: "PDF",
    date: "15 Febrero, 2023",
    category: "tax",
    project: null,
  },
  {
    id: 4,
    name: "Sunset Heights Development - Informe Trimestral Q1 2023",
    type: "PDF",
    date: "5 Abril, 2023",
    category: "report",
    project: "Sunset Heights Development",
  },
  {
    id: 5,
    name: "Mountain View Retail Plaza - Estado de Distribución",
    type: "PDF",
    date: "1 Abril, 2023",
    category: "report",
    project: "Mountain View Retail Plaza",
  },
  {
    id: 6,
    name: "Adhesión al Fideicomiso - Oakridge Apartments",
    type: "PDF",
    date: "15 Enero, 2023",
    category: "contract",
    project: "Oakridge Apartments",
  },
  {
    id: 7,
    name: "Adhesión al Fideicomiso - Riverside Commercial Center",
    type: "PDF",
    date: "10 Abril, 2023",
    category: "contract",
    project: "Riverside Commercial Center",
  },
  {
    id: 8,
    name: "Certificado de Participación - Oakridge Apartments",
    type: "PDF",
    date: "20 Enero, 2023",
    category: "contract",
    project: "Oakridge Apartments",
  },
]
