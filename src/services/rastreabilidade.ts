import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type LoteRastreabilidade = Database["public"]["Tables"]["lotes_rastreabilidade"]["Row"];
export type CreateLoteRastreabilidadeInput = Omit<
  Database["public"]["Tables"]["lotes_rastreabilidade"]["Insert"],
  "user_id"
>;

export type LoteRastreabilidadeComRelacionamentos = LoteRastreabilidade & {
  propriedades: {
    nome: string;
  } | null;
  safras: {
    nome: string;
  } | null;
  talhoes: {
    nome: string;
  } | null;
};

export const listLotesRastreabilidade = async () => {
  const { data, error } = await supabase
    .from("lotes_rastreabilidade")
    .select("*, propriedades(nome), safras(nome), talhoes(nome)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as LoteRastreabilidadeComRelacionamentos[];
};

export const getLoteRastreabilidadeByCodigo = async (codigo: string) => {
  const { data, error } = await supabase
    .from("lotes_rastreabilidade")
    .select("*, propriedades(nome), safras(nome), talhoes(nome)")
    .eq("codigo", codigo)
    .maybeSingle();

  if (error) throw error;

  return data as LoteRastreabilidadeComRelacionamentos | null;
};

export const createLoteRastreabilidade = async (input: CreateLoteRastreabilidadeInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const qrCode = input.qr_code || `${window.location.origin}/consulta-qrcode?codigo=${encodeURIComponent(input.codigo)}`;

  const { data, error } = await supabase
    .from("lotes_rastreabilidade")
    .insert({ ...input, qr_code: qrCode, user_id: user.id })
    .select("*, propriedades(nome), safras(nome), talhoes(nome)")
    .single();

  if (error) throw error;

  return data as LoteRastreabilidadeComRelacionamentos;
};
