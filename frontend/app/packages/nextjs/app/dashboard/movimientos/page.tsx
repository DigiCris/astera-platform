"use client"

import { Label } from "~~/components/ui/shadcn/label"

import Link from "next/link"
import Image from "next/image"
import {
  ArrowUpRight,
  Bell,
  Building2,
  CreditCard,
  DollarSign,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  PieChart,
  User,
  Wallet,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from "lucide-react"

import { Button } from "~~/components/ui/shadcn/button"
import { Card, CardContent } from "~~/components/ui/shadcn/card"
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/shadcn/sheet"
import { Input } from "~~/components/ui/shadcn/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~~/components/ui/shadcn/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select"
import { useState, useRef, useEffect } from "react"

export default function MovimientosPage() {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [expandedTransactions, setExpandedTransactions] = useState<number[]>([])
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

  const toggleTransactionExpand = (transactionId: number) => {
    setExpandedTransactions((prev) =>
      prev.includes(transactionId) ? prev.filter((id) => id !== transactionId) : [...prev, transactionId],
    )
  }

  const isTransactionExpanded = (transactionId: number) => expandedTransactions.includes(transactionId)

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
                          className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
                            <p className="font-medium">Movimiento registrado</p>
                            <span className="text-xs text-muted-foreground">Hace 30 minutos</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Se ha registrado un nuevo movimiento en tu cuenta por $125.00.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Distribución programada</p>
                            <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            La próxima distribución de "Terrazas Diez" está programada para el 15 de junio.
                          </p>
                        </div>
                      </div>

                      <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                        <div className="flex flex-col gap-1 w-full">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Retiro procesado</p>
                            <span className="text-xs text-muted-foreground">Hace 1 día</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Tu solicitud de retiro por $500.00 ha sido procesada exitosamente.
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
                    className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
              <h1 className="text-2xl font-bold tracking-tight">Historial de Movimientos</h1>
            </div>

            {/* Filtros - Desktop */}
            <div className="hidden md:flex md:flex-row gap-4 items-center">
              <div className="relative w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Buscar movimientos..." className="w-full pl-8 bg-background" />
              </div>
              <div className="flex gap-2">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Tipo de Movimiento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="investment">Inversiones</SelectItem>
                    <SelectItem value="distribution">Distribuciones</SelectItem>
                    <SelectItem value="withdrawal">Retiros</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="all">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="completed">Completados</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filtros - Mobile */}
            <div className="md:hidden">
              <div className="flex gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar..." className="w-full pl-8 bg-background" />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className={filtersOpen ? "bg-primary/10" : ""}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {filtersOpen && (
                <div className="p-4 mb-4 border rounded-lg bg-background animate-in fade-in-80 duration-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filtros</h3>
                    <Button variant="ghost" size="icon" onClick={() => setFiltersOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile-type">Tipo de Movimiento</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="mobile-type" className="w-full">
                          <SelectValue placeholder="Tipo de Movimiento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="investment">Inversiones</SelectItem>
                          <SelectItem value="distribution">Distribuciones</SelectItem>
                          <SelectItem value="withdrawal">Retiros</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-status">Estado</Label>
                      <Select defaultValue="all">
                        <SelectTrigger id="mobile-status" className="w-full">
                          <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="completed">Completados</SelectItem>
                          <SelectItem value="pending">Pendientes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="mobile-date">Fecha</Label>
                      <Input id="mobile-date" type="date" className="w-full" />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" className="flex-1">
                        Limpiar
                      </Button>
                      <Button className="flex-1">Aplicar</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Tabla de Movimientos - Desktop */}
            <div className="hidden md:block">
              <Card>
                <CardContent className="p-0">
                  <div className="relative w-full overflow-auto">
                    <table className="w-full caption-bottom text-sm">
                      <thead className="border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                          <th className="h-12 px-4 text-left align-middle font-medium">Descripción</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Fecha</th>
                          <th className="h-12 px-4 text-left align-middle font-medium">Estado</th>
                          <th className="h-12 px-4 text-right align-middle font-medium">Monto</th>
                          <th className="h-12 px-4 text-center align-middle font-medium">Detalles</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allTransactions.map((transaction) => (
                          <tr
                            key={transaction.id}
                            className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                          >
                            <td className="p-4 align-middle">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`flex h-9 w-9 items-center justify-center rounded-full ${
                                    transaction.type === "investment"
                                      ? "bg-blue-100"
                                      : transaction.type === "distribution"
                                        ? "bg-green-100"
                                        : "bg-yellow-100"
                                  }`}
                                >
                                  {transaction.type === "investment" ? (
                                    <ArrowUpRight className="h-4 w-4 text-blue-600" />
                                  ) : transaction.type === "distribution" ? (
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Wallet className="h-4 w-4 text-yellow-600" />
                                  )}
                                </div>
                                <div>
                                  <div className="font-medium">{transaction.description}</div>
                                  <div className="text-xs text-muted-foreground">
                                    {transaction.type === "investment"
                                      ? "Inversión"
                                      : transaction.type === "distribution"
                                        ? "Distribución"
                                        : "Retiro"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 align-middle">{transaction.date}</td>
                            <td className="p-4 align-middle">
                              <div
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                  transaction.status === "Completado"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {transaction.status}
                              </div>
                            </td>
                            <td className="p-4 align-middle text-right">
                              <span
                                className={`font-medium ${
                                  transaction.type === "investment"
                                    ? "text-muted-foreground"
                                    : transaction.type === "distribution"
                                      ? "text-green-600"
                                      : "text-yellow-600"
                                }`}
                              >
                                {transaction.type === "investment" ? "-" : "+"}
                                {transaction.amount}
                              </span>
                            </td>
                            <td className="p-4 align-middle text-center">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Ver
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Detalles del Movimiento</DialogTitle>
                                    <DialogDescription>Información detallada sobre esta transacción.</DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="flex items-center gap-3">
                                      <div
                                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                          transaction.type === "investment"
                                            ? "bg-blue-100"
                                            : transaction.type === "distribution"
                                              ? "bg-green-100"
                                              : "bg-yellow-100"
                                        }`}
                                      >
                                        {transaction.type === "investment" ? (
                                          <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                        ) : transaction.type === "distribution" ? (
                                          <DollarSign className="h-5 w-5 text-green-600" />
                                        ) : (
                                          <Wallet className="h-5 w-5 text-yellow-600" />
                                        )}
                                      </div>
                                      <div>
                                        <div className="font-medium">{transaction.description}</div>
                                        <div className="text-sm text-muted-foreground">
                                          {transaction.type === "investment"
                                            ? "Inversión"
                                            : transaction.type === "distribution"
                                              ? "Distribución"
                                              : "Retiro"}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-sm font-medium">Fecha</div>
                                        <div className="text-sm">{transaction.date}</div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">Estado</div>
                                        <div
                                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                            transaction.status === "Completado"
                                              ? "bg-green-100 text-green-800"
                                              : "bg-yellow-100 text-yellow-800"
                                          }`}
                                        >
                                          {transaction.status}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">Monto</div>
                                        <div
                                          className={`text-sm font-medium ${
                                            transaction.type === "investment"
                                              ? "text-muted-foreground"
                                              : transaction.type === "distribution"
                                                ? "text-green-600"
                                                : "text-yellow-600"
                                          }`}
                                        >
                                          {transaction.type === "investment" ? "-" : "+"}
                                          {transaction.amount}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium">ID de Transacción</div>
                                        <div className="text-sm">TRX-{transaction.id}</div>
                                      </div>
                                    </div>
                                    {transaction.type === "investment" && transaction.projectDetails && (
                                      <div>
                                        <div className="text-sm font-medium mb-2">Detalles del Proyecto</div>
                                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                                          <div className="relative h-12 w-12 overflow-hidden rounded-md shrink-0">
                                            <Image
                                              src={
                                                transaction.projectDetails.image ||
                                                "/placeholder.svg?height=48&width=48" ||
                                                "/placeholder.svg"
                                              }
                                              alt={transaction.projectDetails.title}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div>
                                            <div className="font-medium">{transaction.projectDetails.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                              {transaction.projectDetails.tokens} tokens adquiridos
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {transaction.type === "distribution" && transaction.projectDetails && (
                                      <div>
                                        <div className="text-sm font-medium mb-2">Detalles de la Distribución</div>
                                        <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                                          <div className="relative h-12 w-12 overflow-hidden rounded-md shrink-0">
                                            <Image
                                              src={
                                                transaction.projectDetails.image ||
                                                "/placeholder.svg?height=48&width=48" ||
                                                "/placeholder.svg"
                                              }
                                              alt={transaction.projectDetails.title}
                                              fill
                                              className="object-cover"
                                            />
                                          </div>
                                          <div>
                                            <div className="font-medium">{transaction.projectDetails.title}</div>
                                            <div className="text-xs text-muted-foreground">
                                              Distribución trimestral Q{transaction.projectDetails.quarter}{" "}
                                              {transaction.projectDetails.year}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                    {transaction.type === "withdrawal" && transaction.withdrawalDetails && (
                                      <div>
                                        <div className="text-sm font-medium mb-2">Detalles del Retiro</div>
                                        <div className="space-y-2 p-3 rounded-md bg-muted">
                                          <div className="grid grid-cols-2 gap-2">
                                            <div>
                                              <div className="text-xs text-muted-foreground">Método</div>
                                              <div className="text-sm">{transaction.withdrawalDetails.method}</div>
                                            </div>
                                            <div>
                                              <div className="text-xs text-muted-foreground">Cuenta</div>
                                              <div className="text-sm">
                                                {transaction.withdrawalDetails.accountNumber}
                                              </div>
                                            </div>
                                          </div>
                                          <div>
                                            <div className="text-xs text-muted-foreground">Banco</div>
                                            <div className="text-sm">{transaction.withdrawalDetails.bank}</div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Movimientos - Mobile */}
            <div className="md:hidden space-y-4">
              {allTransactions.map((transaction) => (
                <Card key={transaction.id} className="overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleTransactionExpand(transaction.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          transaction.type === "investment"
                            ? "bg-blue-100"
                            : transaction.type === "distribution"
                              ? "bg-green-100"
                              : "bg-yellow-100"
                        }`}
                      >
                        {transaction.type === "investment" ? (
                          <ArrowUpRight className="h-5 w-5 text-blue-600" />
                        ) : transaction.type === "distribution" ? (
                          <DollarSign className="h-5 w-5 text-green-600" />
                        ) : (
                          <Wallet className="h-5 w-5 text-yellow-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium ${
                          transaction.type === "investment"
                            ? "text-muted-foreground"
                            : transaction.type === "distribution"
                              ? "text-green-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {transaction.type === "investment" ? "-" : "+"}
                        {transaction.amount}
                      </span>
                      {isTransactionExpanded(transaction.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>

                  {isTransactionExpanded(transaction.id) && (
                    <div className="px-4 pb-4 pt-2 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Tipo</p>
                          <p className="font-medium">
                            {transaction.type === "investment"
                              ? "Inversión"
                              : transaction.type === "distribution"
                                ? "Distribución"
                                : "Retiro"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Estado</p>
                          <div
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              transaction.status === "Completado"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {transaction.status}
                          </div>
                        </div>
                      </div>

                      {transaction.type === "investment" && transaction.projectDetails && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Detalles del Proyecto</p>
                          <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                            <div className="relative h-10 w-10 overflow-hidden rounded-md shrink-0">
                              <Image
                                src={transaction.projectDetails.image || "/placeholder.svg?height=40&width=40"}
                                alt={transaction.projectDetails.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.projectDetails.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {transaction.projectDetails.tokens} tokens adquiridos
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {transaction.type === "distribution" && transaction.projectDetails && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Detalles de la Distribución</p>
                          <div className="flex items-center gap-3 p-3 rounded-md bg-muted">
                            <div className="relative h-10 w-10 overflow-hidden rounded-md shrink-0">
                              <Image
                                src={transaction.projectDetails.image || "/placeholder.svg?height=40&width=40"}
                                alt={transaction.projectDetails.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{transaction.projectDetails.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Distribución trimestral Q{transaction.projectDetails.quarter}{" "}
                                {transaction.projectDetails.year}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {transaction.type === "withdrawal" && transaction.withdrawalDetails && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground mb-2">Detalles del Retiro</p>
                          <div className="space-y-2 p-3 rounded-md bg-muted">
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <p className="text-xs text-muted-foreground">Método</p>
                                <p className="text-sm">{transaction.withdrawalDetails.method}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Cuenta</p>
                                <p className="text-sm">{transaction.withdrawalDetails.accountNumber}</p>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Banco</p>
                              <p className="text-sm">{transaction.withdrawalDetails.bank}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full">
                            Ver Detalles Completos
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Detalles del Movimiento</DialogTitle>
                            <DialogDescription>Información detallada sobre esta transacción.</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                                  transaction.type === "investment"
                                    ? "bg-blue-100"
                                    : transaction.type === "distribution"
                                      ? "bg-green-100"
                                      : "bg-yellow-100"
                                }`}
                              >
                                {transaction.type === "investment" ? (
                                  <ArrowUpRight className="h-5 w-5 text-blue-600" />
                                ) : transaction.type === "distribution" ? (
                                  <DollarSign className="h-5 w-5 text-green-600" />
                                ) : (
                                  <Wallet className="h-5 w-5 text-yellow-600" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">{transaction.description}</div>
                                <div className="text-sm text-muted-foreground">
                                  {transaction.type === "investment"
                                    ? "Inversión"
                                    : transaction.type === "distribution"
                                      ? "Distribución"
                                      : "Retiro"}
                                </div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-sm font-medium">Fecha</div>
                                <div className="text-sm">{transaction.date}</div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Estado</div>
                                <div
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    transaction.status === "Completado"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {transaction.status}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">Monto</div>
                                <div
                                  className={`text-sm font-medium ${
                                    transaction.type === "investment"
                                      ? "text-muted-foreground"
                                      : transaction.type === "distribution"
                                        ? "text-green-600"
                                        : "text-yellow-600"
                                  }`}
                                >
                                  {transaction.type === "investment" ? "-" : "+"}
                                  {transaction.amount}
                                </div>
                              </div>
                              <div>
                                <div className="text-sm font-medium">ID de Transacción</div>
                                <div className="text-sm">TRX-{transaction.id}</div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}
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
const allTransactions = [
  {
    id: 1,
    type: "distribution",
    description: "Distribución Trimestral - Oakridge Apartments",
    amount: "$125.00",
    date: "1 Mayo, 2023",
    status: "Completado",
    projectDetails: {
      title: "Oakridge Apartments",
      image: "/placeholder.svg?height=48&width=48",
      quarter: 2,
      year: 2023,
    },
  },
  {
    id: 2,
    type: "investment",
    description: "Inversión - Riverside Commercial Center",
    amount: "$10,000.00",
    date: "15 Abril, 2023",
    status: "Completado",
    projectDetails: {
      title: "Riverside Commercial Center",
      image: "/placeholder.svg?height=48&width=48",
      tokens: 1000,
    },
  },
  {
    id: 3,
    type: "distribution",
    description: "Distribución Trimestral - Mountain View Retail Plaza",
    amount: "$75.00",
    date: "1 Abril, 2023",
    status: "Completado",
    projectDetails: {
      title: "Mountain View Retail Plaza",
      image: "/placeholder.svg?height=48&width=48",
      quarter: 1,
      year: 2023,
    },
  },
  {
    id: 4,
    type: "investment",
    description: "Inversión - Sunset Heights Development",
    amount: "$7,500.00",
    date: "22 Marzo, 2023",
    status: "Completado",
    projectDetails: {
      title: "Sunset Heights Development",
      image: "/placeholder.svg?height=48&width=48",
      tokens: 750,
    },
  },
  {
    id: 5,
    type: "distribution",
    description: "Distribución Trimestral - Oakridge Apartments",
    amount: "$125.00",
    date: "1 Febrero, 2023",
    status: "Completado",
    projectDetails: {
      title: "Oakridge Apartments",
      image: "/placeholder.svg?height=48&width=48",
      quarter: 1,
      year: 2023,
    },
  },
  {
    id: 6,
    type: "withdrawal",
    description: "Retiro de Fondos",
    amount: "$500.00",
    date: "15 Marzo, 2023",
    status: "Completado",
    withdrawalDetails: {
      method: "Transferencia Bancaria",
      accountNumber: "****5678",
      bank: "Banco Nación Argentina",
    },
  },
  {
    id: 7,
    type: "withdrawal",
    description: "Retiro de Fondos",
    amount: "$1,200.00",
    date: "10 Mayo, 2023",
    status: "Pendiente",
    withdrawalDetails: {
      method: "Transferencia Bancaria",
      accountNumber: "****5678",
      bank: "Banco Nación Argentina",
    },
  },
]
