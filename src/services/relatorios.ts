import { supabase } from "@/integrations/supabase/client";

export type RelatorioTipo =
  | "producao"
  | "financeiro"
  | "produtividade"
  | "cadastro"
  | "caderno"
  | "rastreabilidade";

const escapeCsv = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const text = String(value);
  if (/[",\n;]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
  return text;
};

const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  return [
    headers.map(escapeCsv).join(";"),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(";")),
  ].join("\n");
};

export const generateRelatorioCsv = async (tipo: RelatorioTipo) => {
  if (tipo === "producao") {
    const { data, error } = await supabase
      .from("producao")
      .select("data,produto,quantidade,unidade,qualidade,observacoes")
      .order("data", { ascending: false });
    if (error) throw error;
    return toCsv(data ?? []);
  }

  if (tipo === "financeiro") {
    const { data, error } = await supabase
      .from("financeiro")
      .select("data,tipo,descricao,categoria,valor,forma_pagamento,status")
      .order("data", { ascending: false });
    if (error) throw error;
    return toCsv(data ?? []);
  }

  if (tipo === "produtividade") {
    const { data, error } = await supabase
      .from("safras")
      .select("nome,cultura,area,progresso,status,data_plantio,data_colheita_prevista")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return toCsv(data ?? []);
  }

  if (tipo === "cadastro") {
    const [{ data: propriedades, error: propriedadesError }, { data: talhoes, error: talhoesError }] =
      await Promise.all([
        supabase.from("propriedades").select("nome,cidade,estado,area_total,proprietario,car"),
        supabase.from("talhoes").select("nome,cultura,variedade,area,status"),
      ]);

    if (propriedadesError) throw propriedadesError;
    if (talhoesError) throw talhoesError;

    return toCsv([
      ...(propriedades ?? []).map((item) => ({ tipo: "propriedade", ...item })),
      ...(talhoes ?? []).map((item) => ({ tipo: "talhao", ...item })),
    ]);
  }

  if (tipo === "caderno") {
    const { data, error } = await supabase
      .from("caderno_campo")
      .select("data,tipo_atividade,produto,dosagem,responsavel,status,observacoes")
      .order("data", { ascending: false });
    if (error) throw error;
    return toCsv(data ?? []);
  }

  const { data, error } = await supabase
    .from("lotes_rastreabilidade")
    .select("codigo,produto,data_producao,quantidade,unidade,status,qr_code,observacoes")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return toCsv(data ?? []);
};
