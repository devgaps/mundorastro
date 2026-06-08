import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Safra = Database["public"]["Tables"]["safras"]["Row"];
export type CreateSafraInput = Omit<
  Database["public"]["Tables"]["safras"]["Insert"],
  "user_id"
>;

export type SafraComRelacionamentos = Safra & {
  propriedades: {
    nome: string;
  } | null;
  talhoes: {
    nome: string;
  } | null;
};

export const listSafras = async () => {
  const { data, error } = await supabase
    .from("safras")
    .select("*, propriedades(nome), talhoes(nome)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as SafraComRelacionamentos[];
};

export const createSafra = async (input: CreateSafraInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("safras")
    .insert({ ...input, user_id: user.id })
    .select("*, propriedades(nome), talhoes(nome)")
    .single();

  if (error) throw error;

  return data as SafraComRelacionamentos;
};
