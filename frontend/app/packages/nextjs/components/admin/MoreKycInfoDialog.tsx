// 👈 Asegúrate de importar tu cliente de Supabase
import { useState } from "react";
import { Button } from "../ui/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/shadcn/dialog";
import { ExternalLink, Eye, FileText, Loader2, MapPin, User, Wallet } from "lucide-react";
import { IKycPending } from "~~/types/interfaces";
import { createClient } from "~~/utils/supabase/client";

interface MoreKycInfoDialogProps {
  submission: IKycPending;
}

const BUCKET_NAME = "kyc-documents";

export const MoreKycInfoDialog = ({ submission }: MoreKycInfoDialogProps) => {
  const supabase = createClient();
  const [loadingPath, setLoadingPath] = useState<string | null>(null);

  // 🔥 FUNCIÓN PARA SOLICITAR LA URL FIRMADA Y ABRIRLA
  const handleViewDocument = async (path: string) => {
    if (!path) return;

    try {
      setLoadingPath(path);

      const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, 120); // La URL expirará y dejará de funcionar en 2 minutos (120 seg)

      if (error) {
        console.error("Error al generar URL firmada:", error.message);
        alert("No se pudo obtener el documento de forma segura.");
        return;
      }

      if (data?.signedUrl) {
        window.open(data.signedUrl, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      console.error("Exception opening document:", err);
    } finally {
      setLoadingPath(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-primary text-black hover:bg-primary/80 mr-2">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Detalles de Solicitud KYC
          </DialogTitle>
          <DialogDescription>
            ID de Solicitud:{" "}
            <span className="font-mono text-xs bg-base-300 px-1.5 py-0.5 rounded">{submission.id}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* SECCIÓN 1: DATOS PERSONALES */}
          <div>
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3 uppercase tracking-wider">
              <User className="h-4 w-4" /> Datos Personales
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200 p-3 rounded-lg text-sm">
              <div>
                <span className="opacity-60 block text-xs">Nombre Completo</span>
                <span className="font-medium">
                  {submission.first_name} {submission.last_name}
                </span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Correo Electrónico</span>
                <span className="font-medium break-all">{submission.email}</span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Fecha de Nacimiento</span>
                <span className="font-medium">{submission.date_of_birth}</span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Teléfono</span>
                <span className="font-medium">{submission.phone}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: DIRECCIÓN */}
          <div>
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3 uppercase tracking-wider">
              <MapPin className="h-4 w-4" /> Dirección Residencial
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200 p-3 rounded-lg text-sm">
              <div className="sm:col-span-2">
                <span className="opacity-60 block text-xs">Calle / Avenida / Nro</span>
                <span className="font-medium">{submission.street_address}</span>
              </div>
              {submission.apt_suite && (
                <div>
                  <span className="opacity-60 block text-xs">Apto / Suite / Bloque</span>
                  <span className="font-medium">{submission.apt_suite}</span>
                </div>
              )}
              <div>
                <span className="opacity-60 block text-xs">Ciudad</span>
                <span className="font-medium">{submission.city}</span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Estado / Provincia</span>
                <span className="font-medium">{submission.state_province}</span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Código Postal</span>
                <span className="font-medium font-mono">{submission.zip_code}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: WEB3 e INVERSIONES */}
          <div>
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3 uppercase tracking-wider">
              <Wallet className="h-4 w-4" /> Perfil Web3 & Inversor
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-base-200 p-3 rounded-lg text-sm">
              <div className="sm:col-span-2">
                <span className="opacity-60 block text-xs">Dirección de Wallet</span>
                <span className="font-mono text-xs bg-base-300 p-1.5 rounded block truncate select-all mt-0.5">
                  {submission.wallet_address}
                </span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Tipo de Inversor</span>
                <span className="badge badge-outline mt-1 font-medium capitalize">{submission.investor_type}</span>
              </div>
              <div>
                <span className="opacity-60 block text-xs">Estado del Perfil (DB)</span>
                <span
                  className={`badge mt-1 font-bold uppercase ${
                    submission.profiles?.status === "verified" ? "badge-success" : "badge-warning"
                  }`}
                >
                  {submission.profiles?.status || "Sin Estado"}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="opacity-60 block text-xs">Fecha de Envío</span>
                <span className="font-medium">{new Date(submission.submitted_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* SECCIÓN 4: DOCUMENTACIÓN MODIFICADA */}
          <div>
            <h4 className="text-sm font-semibold text-primary flex items-center gap-2 mb-3 uppercase tracking-wider">
              <FileText className="h-4 w-4" /> Archivos Adjuntos ({submission.document_type.toUpperCase()})
            </h4>
            <div className="flex flex-col gap-2">
              {/* Documento Frente */}
              <div className="flex items-center justify-between p-2.5 bg-base-200 rounded-lg text-sm">
                <span className="font-medium">Identificación - Frente</span>
                <span className="text-xs font-mono opacity-50 truncate max-w-[200px] sm:max-w-xs px-2">
                  {submission.front_doc_path.split("/").pop()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  disabled={loadingPath === submission.front_doc_path}
                  onClick={() => handleViewDocument(submission.front_doc_path)}
                >
                  {loadingPath === submission.front_doc_path ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      Ver <ExternalLink className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>

              {/* Documento Reverso */}
              {submission.back_doc_path && (
                <div className="flex items-center justify-between p-2.5 bg-base-200 rounded-lg text-sm">
                  <span className="font-medium">Identificación - Reverso</span>
                  <span className="text-xs font-mono opacity-50 truncate max-w-[200px] sm:max-w-xs px-2">
                    {submission.back_doc_path.split("/").pop()}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-1 text-xs"
                    disabled={loadingPath === submission.back_doc_path}
                    onClick={() => handleViewDocument(submission.back_doc_path)}
                  >
                    {loadingPath === submission.back_doc_path ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                      <>
                        Ver <ExternalLink className="h-3 w-3" />
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Comprobante de domicilio */}
              <div className="flex items-center justify-between p-2.5 bg-base-200 rounded-lg text-sm">
                <span className="font-medium">Comprobante de Domicilio</span>
                <span className="text-xs font-mono opacity-50 truncate max-w-[200px] sm:max-w-xs px-2">
                  {submission.proof_address_path.split("/").pop()}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  disabled={loadingPath === submission.proof_address_path}
                  onClick={() => handleViewDocument(submission.proof_address_path)}
                >
                  {loadingPath === submission.proof_address_path ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <>
                      Ver <ExternalLink className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
