import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type ItemEstoque = Database["public"]["Tables"]["estoque"]["Row"];
export type CreateItemEstoqueInput = Omit<
  Database["public"]["Tables"]["estoque"]["Insert"],
  "user_id"
>;

export const listEstoque = async () => {
  const { data, error } = await supabase
    .from("estoque")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const createItemEstoque = async (input: CreateItemEstoqueInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("estoque")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return data;
};
