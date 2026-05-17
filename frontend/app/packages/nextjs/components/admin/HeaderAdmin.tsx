"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RainbowKitCustomConnectButton } from "../scaffold-eth/RainbowKitCustomConnectButton";
import { Search } from "lucide-react";
import { useAccount } from "wagmi";
import { Input } from "~~/components/ui/shadcn/input";
import { createClient } from "~~/utils/supabase/client";

export function HeaderAdmin() {
  const { address, isConnected, isReconnecting, isConnecting } = useAccount();
  const supabase = createClient();
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      if (isReconnecting || isConnecting) {
        return;
      }

      // 2. Si ya terminó de buscar y de verdad NO está conectado, entonces sí cortamos el flujo
      if (!isConnected || !address) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const walletLower = address.toLowerCase();

        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("wallet_address", walletLower)
          .setHeader("x-wallet-address", walletLower)
          .maybeSingle();

        if (error) {
          console.error("Error fetching admin profile:", error.message);
          setIsAdmin(false);
          return;
        }

        if (data && data.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.log("Error en fetchAdmin:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
    // 🔥 Añadimos las banderas de conexión al array de dependencias
  }, [address, isConnected, isReconnecting, isConnecting, supabase]);

  // 3. Si Wagmi está reconectando o Supabase está consultando, congelamos la pantalla en null
  if (loading || isReconnecting || isConnecting) {
    return null;
  }

  // 4. Ahora sí es 100% seguro redirigir porque ya sabemos que Wagmi terminó y Supabase también
  if (!isAdmin) {
    console.info("No eres admin, expulsando...");
    router.push("/"); // Puedes activarlo con total confianza
    return null;
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <form className="hidden md:flex-1 md:flex max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-full"
            />
          </div>
        </form>
        <div className="flex flex-1 items-center justify-end gap-4 md:gap-2 lg:gap-4">
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </header>
  );
}
