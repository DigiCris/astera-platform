"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Bell,
  Building2,
  CreditCard,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  PieChart,
  User,
  Check,
  Edit,
  Key,
  Upload,
  Shield,
} from "lucide-react"

import { Button } from "~~/components/ui/shadcn/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card"
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/shadcn/sheet"
import { Input } from "~~/components/ui/shadcn/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/shadcn/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/shadcn/dialog"
import { Label } from "~~/components/ui/shadcn/label"
import { useState, useRef, useEffect } from "react"

export default function PerfilPage() {
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
            <Building2 className="h-6 w-6 text-primary" />
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
                      <img src="/favicon.png" alt="icon" className="h-16 w-16" />
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
                          className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
                            <p className="font-medium">Verificación completada</p>
                            <span className="text-xs text-muted-foreground">Hace 2 días</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Tu proceso de verificación KYC ha sido completado exitosamente.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Actualización de seguridad</p>
                            <span className="text-xs text-muted-foreground">Hace 3 días</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Hemos implementado nuevas medidas de seguridad. Revisa tu configuración.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Documento requerido</p>
                            <span className="text-xs text-muted-foreground">Hace 5 días</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Por favor, actualiza tu comprobante de domicilio para mantener tu cuenta verificada.
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
          </div>
        </div>
      </header>

      <div className="flex flex-1">
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
                    className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
              <h1 className="text-2xl font-bold tracking-tight">Mi Perfil</h1>
            </div>

            {/* Estado de Verificación */}
            <Card>
              <CardHeader>
                <CardTitle>Estado de Verificación</CardTitle>
                <CardDescription>Tu estado actual de verificación KYC</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-green-600">Verificado</p>
                    <p className="text-sm text-muted-foreground">
                      Tu cuenta ha sido verificada y puedes invertir en todos los proyectos disponibles.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs para Información Personal, Documentos, Seguridad */}
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Mis Datos</TabsTrigger>
                <TabsTrigger value="documents">Documentos</TabsTrigger>
                <TabsTrigger value="security">Seguridad</TabsTrigger>
              </TabsList>
              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>Tus datos personales registrados en la plataforma</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="md:w-1/3 flex flex-col items-center justify-center">
                        <div className="relative h-32 w-32 overflow-hidden rounded-full">
                          <Image
                            src="/placeholder.svg?height=128&width=128"
                            alt="User avatar"
                            fill
                            className="object-cover"
                          />
                        </div>
                        <Button variant="outline" size="sm" className="mt-4">
                          <Edit className="h-4 w-4 mr-2" />
                          Cambiar Foto
                        </Button>
                      </div>
                      <div className="md:w-2/3 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">Nombre</Label>
                            <Input id="first-name" value="John" readOnly className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Apellido</Label>
                            <Input id="last-name" value="Smith" readOnly className="bg-muted" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" value="john.smith@example.com" readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Teléfono</Label>
                          <Input id="phone" value="+1 (555) 123-4567" readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dob">Fecha de Nacimiento</Label>
                          <Input id="dob" value="15/01/1985" readOnly className="bg-muted" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Dirección</Label>
                          <Input id="address" value="123 Main Street, Apt 4B" readOnly className="bg-muted" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="city">Ciudad</Label>
                            <Input id="city" value="New York" readOnly className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">Estado/Provincia</Label>
                            <Input id="state" value="NY" readOnly className="bg-muted" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip">Código Postal</Label>
                            <Input id="zip" value="10001" readOnly className="bg-muted" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Información
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="documents" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos de Identidad</CardTitle>
                    <CardDescription>Documentos utilizados para verificar tu identidad</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Pasaporte - Frente</p>
                          <p className="text-sm text-muted-foreground">Subido el 15 Enero, 2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Pasaporte - Reverso</p>
                          <p className="text-sm text-muted-foreground">Subido el 15 Enero, 2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Comprobante de Domicilio</p>
                          <p className="text-sm text-muted-foreground">Subido el 15 Enero, 2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Declaraciones Juradas</CardTitle>
                    <CardDescription>Documentos legales y declaraciones juradas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Declaración Jurada de Origen de Fondos</p>
                          <p className="text-sm text-muted-foreground">Subido el 15 Enero, 2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Comprobante de Ingresos</p>
                          <p className="text-sm text-muted-foreground">Subido el 15 Enero, 2023</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Ver
                      </Button>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Subir Nuevo Documento
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Seguridad de la Cuenta</CardTitle>
                    <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Key className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Contraseña</p>
                            <p className="text-sm text-muted-foreground">Última actualización: 15 Enero, 2023</p>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Cambiar</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Cambiar Contraseña</DialogTitle>
                              <DialogDescription>
                                Ingresa tu contraseña actual y la nueva contraseña para actualizarla.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="space-y-2">
                                <Label htmlFor="current-password">Contraseña Actual</Label>
                                <Input id="current-password" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="new-password">Nueva Contraseña</Label>
                                <Input id="new-password" type="password" />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirmar Nueva Contraseña</Label>
                                <Input id="confirm-password" type="password" />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Guardar Cambios</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Autenticación de Dos Factores</p>
                            <p className="text-sm text-muted-foreground">Añade una capa adicional de seguridad</p>
                          </div>
                        </div>
                        <Button variant="outline">Configurar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-filabe-text font-bold text-xl flex items-center gap-2">
              <img src="/favicon.png" alt="icon" className="h-16 w-16" />
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
