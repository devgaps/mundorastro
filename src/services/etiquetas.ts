import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Etiqueta = Database["public"]["Tables"]["etiquetas"]["Row"];
export type CreateEtiquetaInput = Omit<
  Database["public"]["Tables"]["etiquetas"]["Insert"],
  "user_id"
>;

export type EtiquetaComLote = Etiqueta & {
  lotes_rastreabilidade: {
    codigo: string;
    produto: string;
  } | null;
};

export const listEtiquetas = async () => {
  const { data, error } = await supabase
    .from("etiquetas")
    .select("*, lotes_rastreabilidade(codigo, produto)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as EtiquetaComLote[];
};

export const createEtiqueta = async (input: CreateEtiquetaInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("etiquetas")
    .insert({ ...input, user_id: user.id })
    .select("*, lotes_rastreabilidade(codigo, produto)")
    .single();

  if (error) throw error;

  return data as EtiquetaComLote;
};
