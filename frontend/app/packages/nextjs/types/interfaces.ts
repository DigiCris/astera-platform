export interface IKycPending {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  phone: string;

  // Dirección
  street_address: string;
  apt_suite: string;
  city: string;
  state_province: string;
  zip_code: string;

  // Documentación e Identidad
  document_type: "passport" | "id_card" | string;
  front_doc_path: string;
  back_doc_path: string;
  proof_address_path: string;

  // Datos de inversor y Web3
  investor_type: "individual" | "entity" | string;
  wallet_address: string;

  // Metadatos
  submitted_at: string;

  // 🔥 NUEVO: Traemos el objeto relacional desde la tabla 'profiles'
  profiles?: {
    status: string;
  };
}
