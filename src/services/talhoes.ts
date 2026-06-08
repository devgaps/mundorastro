import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Talhao = Database["public"]["Tables"]["talhoes"]["Row"];
export type CreateTalhaoInput = Omit<
  Database["public"]["Tables"]["talhoes"]["Insert"],
  "user_id"
>;

export type TalhaoComPropriedade = Talhao & {
  propriedades: {
    nome: string;
  } | null;
};

export const listTalhoes = async () => {
  const { data, error } = await supabase
    .from("talhoes")
    .select("*, propriedades(nome)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as TalhaoComPropriedade[];
};

export const createTalhao = async (input: CreateTalhaoInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuario nao autenticado.");

  const { data, error } = await supabase
    .from("talhoes")
    .insert({ ...input, user_id: user.id })
    .select("*, propriedades(nome)")
    .single();

  if (error) throw error;

  return data as TalhaoComPropriedade;
};
