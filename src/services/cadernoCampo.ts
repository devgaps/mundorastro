import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type RegistroCampo = Database["public"]["Tables"]["caderno_campo"]["Row"];
export type CreateRegistroCampoInput = Omit<
  Database["public"]["Tables"]["caderno_campo"]["Insert"],
  "user_id"
>;

export type RegistroCampoComRelacionamentos = RegistroCampo & {
  propriedades: {
    nome: string;
  } | null;
  talhoes: {
    nome: string;
  } | null;
};

export const listRegistrosCampo = async () => {
  const { data, error } = await supabase
    .from("caderno_campo")
    .select("*, propriedades(nome), talhoes(nome)")
    .order("data", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as RegistroCampoComRelacionamentos[];
};

export const createRegistroCampo = async (input: CreateRegistroCampoInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("caderno_campo")
    .insert({ ...input, user_id: user.id })
    .select("*, propriedades(nome), talhoes(nome)")
    .single();

  if (error) throw error;

  return data as RegistroCampoComRelacionamentos;
};
