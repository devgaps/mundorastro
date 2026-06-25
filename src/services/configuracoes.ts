import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";

export type Configuracao = Database["public"]["Tables"]["configuracoes"]["Row"];

const LOCAL_CONFIG_KEY = "mundorastro:configuracoes";

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

const isMissingConfiguracoesTable = (error: unknown) =>
  Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );

const readLocalConfiguracoes = () => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(LOCAL_CONFIG_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Configuracao[];
  } catch {
    return [];
  }
};

const writeLocalConfiguracao = (configuracao: Configuracao) => {
  if (typeof window === "undefined") return configuracao;

  const current = readLocalConfiguracoes();
  const next = [
    ...current.filter((item) => item.chave !== configuracao.chave),
    configuracao,
  ].sort((a, b) => a.chave.localeCompare(b.chave));

  window.localStorage.setItem(LOCAL_CONFIG_KEY, JSON.stringify(next));
  return configuracao;
};

export const listConfiguracoes = async () => {
  const { data, error } = await supabase
    .from("configuracoes")
    .select("*")
    .order("chave", { ascending: true });

  if (isMissingConfiguracoesTable(error)) return readLocalConfiguracoes();
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

  if (isMissingConfiguracoesTable(error)) {
    return writeLocalConfiguracao({
      id: `local-${userId}-${chave}`,
      user_id: userId,
      chave,
      valor,
      escopo,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  }

  if (error) throw error;

  return data;
};
