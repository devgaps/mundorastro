import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Propriedade = Database["public"]["Tables"]["propriedades"]["Row"];
export type CreatePropriedadeInput = Omit<
  Database["public"]["Tables"]["propriedades"]["Insert"],
  "user_id"
>;

export const listPropriedades = async () => {
  const { data, error } = await supabase
    .from("propriedades")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const createPropriedade = async (input: CreatePropriedadeInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuario nao autenticado.");

  const { data, error } = await supabase
    .from("propriedades")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return data;
};
