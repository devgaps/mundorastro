import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Producao = Database["public"]["Tables"]["producao"]["Row"];
export type CreateProducaoInput = Omit<
  Database["public"]["Tables"]["producao"]["Insert"],
  "user_id"
>;

export type ProducaoComRelacionamentos = Producao & {
  safras: {
    nome: string;
  } | null;
  talhoes: {
    nome: string;
  } | null;
};

export const listProducao = async () => {
  const { data, error } = await supabase
    .from("producao")
    .select("*, safras(nome), talhoes(nome)")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as ProducaoComRelacionamentos[];
};

export const createProducao = async (input: CreateProducaoInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("producao")
    .insert({ ...input, user_id: user.id })
    .select("*, safras(nome), talhoes(nome)")
    .single();

  if (error) throw error;

  return data as ProducaoComRelacionamentos;
};
