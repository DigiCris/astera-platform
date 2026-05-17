"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { RainbowKitCustomConnectButton } from "../scaffold-eth";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/shadcn/dialog";
import { useAccount } from "wagmi";
import { createClient } from "~~/utils/supabase/client";

export const AuthWallet = () => {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  const [isChecking, setIsChecking] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserKYC = async () => {
      if (isConnected && address) {
        setIsChecking(true);
        const walletLower = address.toLowerCase();

        try {
          // 1. Buscamos el perfil del usuario
          const { data: profileData, error: fetchError } = await supabase
            .from("profiles")
            .select("id, status, role")
            .eq("wallet_address", walletLower)
            .setHeader("x-wallet-address", walletLower)
            .maybeSingle();

          if (fetchError) {
            console.error("Error al buscar perfil:", fetchError.message);
            return;
          }

          let data = profileData;

          // 2. 🔥 CORREGIDO: Si no existe el perfil, lo creamos de inmediato sin retornar antes
          if (!data) {
            const { data: newProfile, error: createError } = await supabase
              .from("profiles")
              .upsert(
                {
                  wallet_address: walletLower,
                  status: "empty",
                  role: "user",
                },
                { onConflict: "wallet_address" },
              )
              .setHeader("x-wallet-address", walletLower)
              .select("id, status, role")
              .single();

            if (createError) {
              console.error("Error al inicializar perfil Web3:", createError.message);
              return;
            }

            data = newProfile; // Asignamos el nuevo perfil creado para continuar
          }

          // 3. Evaluamos los permisos del perfil
          if (data && (data.role === "admin" || data.status != "empty")) {
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
            // Redirigir a KYC si no estamos ahí
            if (pathname !== "/kyc") router.push("/kyc");
          }
        } catch (err) {
          console.error("Error en conexión de autenticación:", err);
        } finally {
          setIsChecking(false);
        }
      } else {
        setIsAuthorized(false);
      }
    };

    checkUserKYC();
  }, [isConnected, address, pathname, router, supabase]);

  // CONDICIÓN DE SALIDA:
  if (isAuthorized || pathname === "/kyc") {
    return null;
  }

  return (
    <Dialog open={!isAuthorized}>
      <DialogContent
        showCloseButton={false}
        onOpenAutoFocus={e => {
          e.preventDefault();
          document.body.style.pointerEvents = "auto";
        }}
        onCloseAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Acceso Restringido</DialogTitle>
          <DialogDescription className="text-center text-base">
            {!isConnected ? "Conecta tu wallet para continuar." : "Tu cuenta requiere verificación de identidad."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <RainbowKitCustomConnectButton />

          {isChecking && (
            <div className="flex items-center gap-2 text-primary">
              <span className="loading loading-spinner loading-sm"></span>
              <span className="text-sm font-medium">Validando...</span>
            </div>
          )}

          {address && (
            <div className="text-xs font-mono opacity-50 bg-base-300 p-2 rounded">
              {address.slice(0, 6)}...{address.slice(-4)}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
