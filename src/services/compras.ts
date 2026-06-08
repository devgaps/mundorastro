import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type Compra = Database["public"]["Tables"]["compras"]["Row"];
export type CreateCompraInput = Omit<
  Database["public"]["Tables"]["compras"]["Insert"],
  "user_id"
>;

export const listCompras = async () => {
  const { data, error } = await supabase
    .from("compras")
    .select("*")
    .order("data_compra", { ascending: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
};

export const createCompra = async (input: CreateCompraInput) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await supabase
    .from("compras")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) throw error;

  return data;
};
