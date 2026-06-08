import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Equipamento = Database["public"]["Tables"]["equipamentos"]["Row"];
export type CreateEquipamentoInput = Omit<
  Database["public"]["Tables"]["equipamentos"]["Insert"],
  "user_id"
>;

export type EquipamentoComPropriedade = Equipamento & {
  propriedades: {
    nome: string;
  } | null;
};

export const listEquipamentos = async () => {
  const { data, error } = await supabase
    .from("equipamentos")
    .select("*, propriedades(nome)")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []) as EquipamentoComPropriedade[];
};

export const createEquipamento = async (input: CreateEquipamentoInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("equipamentos")
    .insert({ ...input, user_id: user.id })
    .select("*, propriedades(nome)")
    .single();

  if (error) throw error;

  return data as EquipamentoComPropriedade;
};
