import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

export type Configuracao = Database["public"]["Tables"]["configuracoes"]["Row"];

export type EmpresaConfig = {
  nome: string;
  cnpj: string;
  endereco: string;
};

export type PreferenciasConfig = {
  email: boolean;
  manutencao: boolean;
  relatorios: boolean;
  push: boolean;
  doisFatores: boolean;
  sessaoAutomatica: boolean;
  modoEscuro: boolean;
  menuCompacto: boolean;
  animacoes: boolean;
};

export type IntegracoesConfig = {
  smtp: boolean;
  mobile: boolean;
  apiExterna: boolean;
};

export const defaultEmpresaConfig: EmpresaConfig = {
  nome: "",
  cnpj: "",
  endereco: "",
};

export const defaultPreferenciasConfig: PreferenciasConfig = {
  email: true,
  manutencao: true,
  relatorios: false,
  push: true,
  doisFatores: false,
  sessaoAutomatica: true,
  modoEscuro: false,
  menuCompacto: false,
  animacoes: true,
};

export const defaultIntegracoesConfig: IntegracoesConfig = {
  smtp: false,
  mobile: false,
  apiExterna: false,
};

const getCurrentUserId = async () => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("Usuário não autenticado.");

  return user.id;
};

export const listConfiguracoes = async () => {
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .order("chave", { ascending: true });

  if (error) throw error;

  return data ?? [];
};

export const saveConfiguracao = async (chave: string, valor: Json, escopo = "usuario") => {
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("configuracoes")
    .upsert(
      {
        user_id: userId,
        chave,
        valor,
        escopo,
      },
      { onConflict: "user_id,chave" },
    )
    .select()
    .single();

  if (error) throw error;

  return data;
};
