import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TransacaoFinanceira = Database["public"]["Tables"]["financeiro"]["Row"];
export type CreateTransacaoFinanceiraInput = Omit<
  Database["public"]["Tables"]["financeiro"]["Insert"],
  "user_id"
>;

export const listFinanceiro = async () => {
  const { data, error } = await supabase
    .from("financeiro")
    .select("*")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const createTransacaoFinanceira = async (input: CreateTransacaoFinanceiraInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("financeiro")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return data;
};
