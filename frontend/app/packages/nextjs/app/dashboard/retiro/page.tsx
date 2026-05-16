import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  BanknoteIcon,
  Bell,
  Building2,
  CreditCard,
  CreditCardIcon,
  FileText,
  HelpCircle,
  LogOut,
  Menu,
  PieChart,
  User,
  Wallet,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/shadcn/alert";
import { Badge } from "~~/components/ui/shadcn/badge";
import { Button } from "~~/components/ui/shadcn/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~~/components/ui/shadcn/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~~/components/ui/shadcn/dropdown-menu";
import { Input } from "~~/components/ui/shadcn/input";
import { Label } from "~~/components/ui/shadcn/label";
import { RadioGroup, RadioGroupItem } from "~~/components/ui/shadcn/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~~/components/ui/shadcn/select";
import { Sheet, SheetContent, SheetTrigger } from "~~/components/ui/shadcn/sheet";

export default function RetiroPage() {
  return (
    <div className="flex min-h-screen">
      {/* Mobile Navigation */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden absolute top-4 left-4 z-50">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex h-full flex-col">
            <div className="border-b px-6 py-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Filabe</span>
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
                  <Link href="/about" className="flex items-center gap-3 rounded-lg px-3 py-2 text-accent-foreground">
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
                <div className="relative h-10 w-10 overflow-hidden rounded-full">
                  <Image src="/placeholder.svg?height=40&width=40" alt="User avatar" fill className="object-cover" />
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

      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block md:w-64 lg:w-72">
        <div className="flex h-full flex-col">
          <div className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Filabe</span>
            </div>
          </div>
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
              <div className="relative h-10 w-10 overflow-hidden rounded-full">
                <Image src="/placeholder.svg?height=40&width=40" alt="User avatar" fill className="object-cover" />
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
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
          <div className="flex flex-1 items-center">
            {/* <Logo /> */}
            <nav className="hidden md:flex items-center ml-6 gap-6">
              <Link href="/" className="text-sm font-medium">
                Inicio
              </Link>
              <Link href="/projects" className="text-sm font-medium text-primary">
                Proyectos
              </Link>
              <Link href="/how-it-works" className="text-sm font-medium">
                Cómo Funciona
              </Link>
              <Link href="/about" className="text-sm font-medium">
                Nosotros
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                    3
                  </span>
                  <span className="sr-only">Notificaciones</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Notificaciones</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary">
                    Marcar todas como leídas
                  </Button>
                </div>
                <DropdownMenuItem className="p-4 cursor-pointer">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Fondos disponibles</p>
                      <span className="text-xs text-muted-foreground">Hace 2 horas</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tienes $3,250 disponibles para retirar a tu cuenta bancaria.
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 cursor-pointer">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Retiro procesado</p>
                      <span className="text-xs text-muted-foreground">Hace 2 días</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Tu solicitud de retiro por $500.00 ha sido procesada exitosamente.
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem className="p-4 cursor-pointer">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">Nueva cuenta bancaria</p>
                      <span className="text-xs text-muted-foreground">Hace 4 días</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Has añadido una nueva cuenta bancaria a tu perfil para retiros.
                    </p>
                  </div>
                </DropdownMenuItem>
                <div className="p-4 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todas las notificaciones
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="relative h-8 w-8 overflow-hidden rounded-full md:hidden">
              <Image src="/placeholder.svg?height=32&width=32" alt="User avatar" fill className="object-cover" />
            </div>
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Retirar Fondos</h1>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Formulario de Retiro */}
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Solicitar Retiro</CardTitle>
                <CardDescription>Completa el formulario para retirar fondos a tu cuenta bancaria.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Saldo Disponible</p>
                    <p className="text-2xl font-bold">$3,250.00</p>
                  </div>
                  <Wallet className="h-8 w-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Monto a Retirar ($)</Label>
                  <Input id="amount" type="number" placeholder="0.00" min="100" max="3250" />
                  <p className="text-xs text-muted-foreground">Monto mínimo de retiro: $100.00</p>
                </div>

                <div className="space-y-2">
                  <Label>Método de Retiro</Label>
                  <RadioGroup defaultValue="bank">
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center gap-2 cursor-pointer">
                        <BanknoteIcon className="h-4 w-4" />
                        Transferencia Bancaria
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 rounded-md border p-3">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                        <CreditCardIcon className="h-4 w-4" />
                        Tarjeta de Débito
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank-name">Banco</Label>
                  <Select defaultValue="banco-nacion">
                    <SelectTrigger id="bank-name">
                      <SelectValue placeholder="Selecciona tu banco" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banco-nacion">Banco Nación Argentina</SelectItem>
                      <SelectItem value="banco-galicia">Banco Galicia</SelectItem>
                      <SelectItem value="banco-santander">Banco Santander</SelectItem>
                      <SelectItem value="banco-bbva">BBVA</SelectItem>
                      <SelectItem value="banco-macro">Banco Macro</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">Número de Cuenta</Label>
                  <Input id="account-number" placeholder="Ingresa tu número de cuenta" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cbu">CBU/CVU</Label>
                  <Input id="cbu" placeholder="Ingresa tu CBU o CVU" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-holder">Titular de la Cuenta</Label>
                  <Input id="account-holder" placeholder="Nombre del titular de la cuenta" />
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Importante</AlertTitle>
                  <AlertDescription>
                    El titular de la cuenta debe coincidir con el titular de la cuenta en Filabe. Los retiros suelen
                    procesarse en 1-3 días hábiles.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Solicitar Retiro</Button>
              </CardFooter>
            </Card>

            {/* Historial de Retiros */}
            <div className="space-y-4 md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Retiros</CardTitle>
                  <CardDescription>Tus solicitudes de retiro recientes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">$1,200.00</p>
                      <p className="text-sm text-muted-foreground">10 Mayo, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Completado
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">$850.00</p>
                      <p className="text-sm text-muted-foreground">28 Abril, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                        Pendiente
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">$500.00</p>
                      <p className="text-sm text-muted-foreground">15 Abril, 2023</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                        Completado
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Información Importante</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Tiempos de Procesamiento</h3>
                    <p className="text-sm text-muted-foreground">
                      Los retiros se procesan en días hábiles y pueden tardar entre 1-3 días en reflejarse en tu cuenta.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Comisiones</h3>
                    <p className="text-sm text-muted-foreground">
                      No cobramos comisiones por retiros, pero tu banco podría aplicar cargos por transferencias.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Límites</h3>
                    <p className="text-sm text-muted-foreground">
                      Retiro mínimo: $100.00. Retiro máximo: $10,000.00 por día.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
