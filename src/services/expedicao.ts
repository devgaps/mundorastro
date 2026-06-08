import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Expedicao = Database["public"]["Tables"]["expedicao"]["Row"];
export type CreateExpedicaoInput = Omit<
  Database["public"]["Tables"]["expedicao"]["Insert"],
  "user_id"
>;

export type ExpedicaoComLote = Expedicao & {
  lotes_rastreabilidade: {
    codigo: string;
    produto: string;
  } | null;
};

export const listExpedicoes = async () => {
  const { data, error } = await supabase
    .from("expedicao")
    .select("*, lotes_rastreabilidade(codigo, produto)")
    .order("data_expedicao", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ExpedicaoComLote[];
};

export const createExpedicao = async (input: CreateExpedicaoInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("expedicao")
    .insert({ ...input, user_id: user.id })
    .select("*, lotes_rastreabilidade(codigo, produto)")
    .single();

  if (error) throw error;

  return data as ExpedicaoComLote;
};
