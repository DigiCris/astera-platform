"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, Wallet } from "lucide-react";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import { MainNav } from "~~/components/main-nav";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~~/components/ui/shadcn/table";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

export default function DashboardPage() {
  const { address } = useAccount();
  const notificationsRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  //states
  const [, setNotificationsOpen] = useState(false);
  const [expandedProjects, setExpandedProjects] = useState<number[]>([]);

  const { data: userBalance } = useScaffoldReadContract({
    contractName: "USDC",
    functionName: "balanceOf",
    args: [address],
  });

  // Añadir un efecto para cerrar el menú al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        buttonRef.current &&
        !notificationsRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProjectExpand = (projectId: number) => {
    setExpandedProjects(prev =>
      prev.includes(projectId) ? prev.filter(id => id !== projectId) : [...prev, projectId],
    );
  };

  const isProjectExpanded = (projectId: number) => expandedProjects.includes(projectId);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Main Navigation */}
      {/* <header className="sticky top-0 z-50 w-full border-b border-filabe-lightgray bg-filabe-dark/95 backdrop-blur supports-backdrop-filter:bg-filabe-dark/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-filabe-text font-bold text-xl flex items-center gap-2">
              <img src="/favicon.png" alt="icon" className="h-16 w-16" />
              <span>ASTERA</span>
            </Link>
          </div>
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
                          className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
                  5
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

                  <div className="max-h-100 overflow-auto">
                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Nuevo proyecto disponible</p>
                          <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          El proyecto &quot;Terrazas Brown&quot; ya está disponible para inversión.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Actualización de proyecto</p>
                          <span className="text-xs text-muted-foreground">Hace 1 día</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          El proyecto &quot;Terrazas Diez&quot; ha alcanzado el 75% de su objetivo de financiación.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Distribución de rendimientos</p>
                          <span className="text-xs text-muted-foreground">Hace 3 días</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Se ha realizado una distribución de rendimientos para el proyecto &quot;Arenas
                          Villarobles&quot;.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200 border-b">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Nuevo documento disponible</p>
                          <span className="text-xs text-muted-foreground">Hace 4 días</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Se ha añadido un nuevo documento a tu perfil: &quot;Contrato de inversión - Magnolias&quot;.
                        </p>
                      </div>
                    </div>

                    <div className="p-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200">
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-center justify-between">
                          <p className="font-medium">Recordatorio de KYC</p>
                          <span className="text-xs text-muted-foreground">Hace 5 días</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Por favor completa tu proceso de verificación KYC para desbloquear todas las funcionalidades.
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
      </header> */}

      <MainNav />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        {/* <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
          <div className="flex h-full flex-col">
            <nav className="flex-1 overflow-auto py-6">
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight">Dashboard</h2>
                <div className="space-y-1">
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 rounded-lg bg-accent px-3 py-2 text-accent-foreground"
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
        </div> */}

        {/* Main Content */}
        <div className="flex-1">
          <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight">Mi Portafolio</h1>
            </div>

            {/* Saldo Disponible */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <Card className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Saldo Disponible</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userBalance !== null && userBalance !== undefined
                      ? (() => {
                          const value = Number(formatUnits(userBalance, 8));
                          return value > 0 && value < 0.01 ? value.toFixed(5) : value.toFixed(2);
                        })()
                      : "Loading..."}
                    &nbsp; USDC
                  </div>
                </CardContent>
              </Card>
              <Card className="">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Invertido</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$1</div>
                  <p className="text-xs text-muted-foreground">+12.5% desde el mes pasado</p>
                </CardContent>
              </Card>
            </div>

            {/* Detalle de Tokens por Proyecto - Versión Desktop */}
            <div className="hidden md:block">
              <Card>
                <CardHeader>
                  <CardTitle>Mis Tokens por Proyecto</CardTitle>
                  <CardDescription>Detalle de todos tus tokens adquiridos</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Proyecto</TableHead>
                        <TableHead>Tokens Totales</TableHead>
                        <TableHead>Valor por Token</TableHead>
                        <TableHead>Valor Total</TableHead>
                        {/* <TableHead>Rendimiento</TableHead> */}
                        <TableHead className="text-center">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tokensByProject.map(project => (
                        <TableRow key={project.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                              <div className="relative h-8 w-8 overflow-hidden rounded-md">
                                <Image
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <span>{project.title}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{project.totalTokens}</div>
                            <div className="text-xs text-muted-foreground">
                              {project.transactions.map((t, i) => (
                                <span key={i}>
                                  {t.amount} {i < project.transactions.length - 1 ? " + " : ""}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>${project.valuePerToken}</TableCell>
                          <TableCell>${(project.totalTokens * project.valuePerToken).toLocaleString()}</TableCell>
                          {/* <TableCell>
                            <span
                              className={`${project.performance >= 0 ? "text-green-600" : "text-red-600"} font-medium`}
                            >
                              {project.performance >= 0 ? "+" : ""}
                              {project.performance}%
                            </span>
                          </TableCell> */}
                          <TableCell className="text-center">
                            <Link href={`/projects/${project.id}`}>
                              <Button size="sm">Ver Detalles</Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            {/* Detalle de Tokens por Proyecto - Versión Mobile */}
            <div className="md:hidden space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Mis Tokens por Proyecto</h2>
              </div>

              {tokensByProject.map(project => (
                <Card key={project.id} className="overflow-hidden">
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => toggleProjectExpand(project.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image
                          src={project.image || "/placeholder.svg"}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-muted-foreground">{project.totalTokens} tokens</p>
                      </div>
                    </div>
                    {/* <div className="flex items-center gap-3">
                      <span className={`${project.performance >= 0 ? "text-green-600" : "text-red-600"} font-medium`}>
                        {project.performance >= 0 ? "+" : ""}
                        {project.performance}%
                      </span>
                      {isProjectExpanded(project.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div> */}
                  </div>

                  {isProjectExpanded(project.id) && (
                    <div className="px-4 pb-4 pt-2 border-t border-border">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Valor por Token</p>
                          <p className="font-medium">${project.valuePerToken}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Valor Total</p>
                          <p className="font-medium">
                            ${(project.totalTokens * project.valuePerToken).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-muted-foreground mb-1">Transacciones</p>
                        <div className="space-y-1">
                          {project.transactions.map((t, i) => (
                            <div key={i} className="text-sm">
                              {t.date}: <span className="font-medium">{t.amount} tokens</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Link href={`/projects/${project.id}`} className="w-full">
                        <Button variant="outline" size="sm" className="w-full">
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  )}
                </Card>
              ))}
            </div>
            <div className="flex justify-center items-center">
              <Link href="/projects">
                <Button>Explorar Proyectos</Button>
              </Link>
            </div>

            {/* Últimos Movimientos */}
            {/* <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Últimos Movimientos</h2>
                <Link href="/dashboard/movimientos" className="text-sm text-primary hover:underline flex items-center">
                  Ver todos <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {transactions.slice(0, 3).map(transaction => (
                      <div key={transaction.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
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
                            <p className="font-medium text-sm sm:text-base">{transaction.description}</p>
                            <p className="text-xs text-muted-foreground">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
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
                          </p>
                          <p className="text-xs text-muted-foreground">{transaction.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-filabe-dark border-t border-filabe-lightgray py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="text-filabe-text font-bold text-xl flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
  );
}

// Datos de tokens por proyecto
const tokensByProject = [
  {
    id: 1,
    title: "Terrazas Diez",
    location: "Berazategui, Buenos Aires",
    type: "Residencial",
    totalTokens: 500,
    valuePerToken: 11.5,
    image: "/placeholder.svg?height=32&width=32",
    transactions: [
      { date: "15 Enero, 2023", amount: 300 },
      { date: "10 Marzo, 2023", amount: 200 },
    ],
  },
  {
    id: 2,
    title: "Terrazas Brown",
    location: "Quilmes Centro, Buenos Aires",
    type: "Residencial",
    totalTokens: 1000,
    valuePerToken: 11.2,
    image: "/placeholder.svg?height=32&width=32",
    transactions: [
      { date: "5 Febrero, 2023", amount: 500 },
      { date: "20 Abril, 2023", amount: 300 },
      { date: "15 Mayo, 2023", amount: 200 },
    ],
  },
  {
    id: 3,
    title: "Jufré 1085",
    location: "Villa Crespo, CABA",
    type: "Histórico",
    totalTokens: 750,
    valuePerToken: 11.2,
    image: "/placeholder.svg?height=32&width=32",
    transactions: [{ date: "10 Marzo, 2023", amount: 750 }],
  },
  {
    id: 4,
    title: "Arenas Villarobles",
    location: "Costa Atlántica",
    type: "Frente al mar",
    totalTokens: 200,
    valuePerToken: 15,
    image: "/placeholder.svg?height=32&width=32",
    transactions: [
      { date: "1 Enero, 2023", amount: 100 },
      { date: "15 Febrero, 2023", amount: 100 },
    ],
  },
  {
    id: 5,
    title: "Magnolias",
    location: "Sourigues",
    type: "Barrio Cerrado",
    totalTokens: 300,
    valuePerToken: 10.5,
    image: "/placeholder.svg?height=32&width=32",
    transactions: [{ date: "5 Mayo, 2023", amount: 300 }],
  },
];

// const transactions = [
//   {
//     id: 1,
//     type: "distribution",
//     description: "Distribución Trimestral - Terrazas Diez",
//     amount: "$125.00",
//     date: "1 Mayo, 2023",
//     status: "Completado",
//   },
//   {
//     id: 2,
//     type: "investment",
//     description: "Inversión - Terrazas Brown",
//     amount: "$10,000.00",
//     date: "15 Abril, 2023",
//     status: "Completado",
//   },
//   {
//     id: 3,
//     type: "distribution",
//     description: "Distribución Trimestral - Arenas Villarobles",
//     amount: "$75.00",
//     date: "1 Abril, 2023",
//     status: "Completado",
//   },
//   {
//     id: 4,
//     type: "investment",
//     description: "Inversión - Jufré 1085",
//     amount: "$7,500.00",
//     date: "22 Marzo, 2023",
//     status: "Completado",
//   },
//   {
//     id: 5,
//     type: "distribution",
//     description: "Distribución Trimestral - Terrazas Diez",
//     amount: "$125.00",
//     date: "1 Febrero, 2023",
//     status: "Completado",
//   },
// ];
