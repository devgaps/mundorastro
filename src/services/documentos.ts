import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

const DOCUMENTOS_BUCKET = "documentos";

export type Documento = Database["public"]["Tables"]["documentos"]["Row"];
export type CreateDocumentoInput = Omit<
  Database["public"]["Tables"]["documentos"]["Insert"],
  "user_id" | "storage_bucket" | "storage_path" | "tamanho_bytes"
>;

export type DocumentoComPropriedade = Documento & {
  propriedades: {
    nome: string;
  } | null;
};

const normalizeFileName = (name: string) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const listDocumentos = async () => {
  const { data, error } = await supabase
    .from("documentos")
    .select("*, propriedades(nome)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as DocumentoComPropriedade[];
};

export const createDocumento = async (input: CreateDocumentoInput, file?: File | null) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  let storagePath: string | null = null;
  let formato = input.formato ?? null;
  let tamanhoBytes: number | null = null;

  if (file) {
    const safeName = normalizeFileName(file.name);
    storagePath = `${user.id}/${Date.now()}-${safeName}`;
    formato = file.name.split(".").pop()?.toUpperCase() || file.type || null;
    tamanhoBytes = file.size;

    const { error: uploadError } = await supabase.storage
      .from(DOCUMENTOS_BUCKET)
      .upload(storagePath, file, { upsert: false });

    if (uploadError) throw uploadError;
  }

  const { data, error } = await supabase
    .from("documentos")
    .insert({
      ...input,
      user_id: user.id,
      storage_bucket: storagePath ? DOCUMENTOS_BUCKET : null,
      storage_path: storagePath,
      formato,
      tamanho_bytes: tamanhoBytes,
    })
    .select("*, propriedades(nome)")
    .single();

  if (error) throw error;

  return data as DocumentoComPropriedade;
};

export const getDocumentoUrl = async (documento: Documento) => {
  if (documento.url) return documento.url;
  if (!documento.storage_path) return null;

  const { data, error } = await supabase.storage
    .from(documento.storage_bucket || DOCUMENTOS_BUCKET)
    .createSignedUrl(documento.storage_path, 60);

  if (error) throw error;

  return data.signedUrl;
};
