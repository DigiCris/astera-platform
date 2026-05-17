"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthWallet } from "./auth/AuthWallet";
import { RainbowKitCustomConnectButton } from "./scaffold-eth";
import { Building2, CreditCard, FileText, Menu, PieChart, X } from "lucide-react";
import { cn } from "~~/lib/shadcn/utils";

interface MainNavProps {
  showAuthButtons?: boolean;
  onLoginClick?: () => void;
  onSignUpClick?: () => void;
  activePath?: string;
}

export function MainNav({ showAuthButtons = true, onLoginClick, onSignUpClick, activePath }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // console.log("showAuthButtons", showAuthButtons);
  // console.log("onLoginClick", onLoginClick);
  // console.log("onSignUpClick", onSignUpClick);
  // console.log("activePath", activePath);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/projects", label: "Proyectos" },
    { href: "/how-it-works", label: "¿Cómo Funciona?" },
    { href: "/about", label: "Nosotros" },
    { href: "/dashboard", label: "Mi Balance" },
  ];

  return (
    <>
      <AuthWallet />
      <header
        className={`sticky top-0 z-50 w-full border-b border-filabe-lightgray bg-filabe-dark/95 backdrop-blur supports-[backdrop-filter]:bg-filabe-dark/60 ${mobileMenuOpen ? "z-[100]" : ""}`}
      >
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="text-filabe-text font-bold text-xl flex items-center gap-2 z-[110]">
            <img src="/favicon.png" alt="icon" className="h-16 w-16"/>
            <span>ASTERA</span>
          </Link>

          {/* Mobile menu button */}
          <button
            className="md:hidden z-[110] p-2 text-filabe-text hover:text-filabe-teal transition-colors"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Mobile menu overlay - Fondo negro sólido */}
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-black opacity-100 z-[90] md:hidden"
              onClick={() => setMobileMenuOpen(false)}
              style={{ position: "fixed", top: 0, right: 0, bottom: 0, left: 0 }}
            />
          )}

          {/* Mobile menu */}
          <div
            className={cn(
              "fixed inset-y-0 right-0 w-3/4 max-w-sm bg-black border-l border-filabe-lightgray p-6 flex flex-col z-[100] transition-transform duration-300 ease-in-out md:hidden",
              mobileMenuOpen ? "translate-x-0" : "translate-x-full",
            )}
            style={{ backgroundColor: "#000000" }}
          >
            <div className="mt-6 flex flex-col space-y-4 bg-black">
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-filabe-text">Principal</h2>
                <div className="space-y-1">
                  {navLinks.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-accent hover:text-accent-foreground",
                        activePath === link.href ? "bg-accent text-accent-foreground" : "text-filabe-text",
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.href === "/" && <PieChart className="h-4 w-4" />}
                      {link.href === "/projects" && <CreditCard className="h-4 w-4" />}
                      {link.href === "/how-it-works" && <FileText className="h-4 w-4" />}
                      {link.href === "/about" && <FileText className="h-4 w-4" />}
                      {link.href === "/dashboard" && <PieChart className="h-4 w-4" />}
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* {showAuthButtons && (
              <div className="px-4 py-2">
                <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-filabe-text">Cuenta</h2>
                <div className="space-y-4 px-2 mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLoginClick?.();
                    }}
                    className="w-full border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
                  >
                    Ingresar
                  </Button>
                  <Button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onSignUpClick?.();
                    }}
                    className="w-full bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
                  >
                    Registrarse
                  </Button>
                </div>
              </div>
            )} */}
              <RainbowKitCustomConnectButton />
            </div>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-filabe-teal",
                  activePath === link.href ? "text-filabe-teal" : "text-filabe-text",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <RainbowKitCustomConnectButton />

          {/* 
        {showAuthButtons && (
          <div className="hidden md:flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onLoginClick}
              className="border-filabe-lightgray text-filabe-text hover:bg-filabe-dark"
            >
              Ingresar
            </Button>
            <Button
              size="sm"
              onClick={onSignUpClick}
              className="bg-filabe-teal text-filabe-dark hover:bg-filabe-teal/90"
            >
              Registrarse
            </Button>
          </div>
        )} */}
        </div>
      </header>
    </>
  );
}
