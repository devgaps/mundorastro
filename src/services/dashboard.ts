import { supabase } from "@/integrations/supabase/client";

const startOfMonth = () => {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().slice(0, 10);
};

const isMissingTableError = (error: unknown) =>
  Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "PGRST205",
  );

const getCount = async (table: Parameters<typeof supabase.from>[0]) => {
  const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
  if (isMissingTableError(error)) return 0;
  if (error) throw error;
  return count ?? 0;
};

export type DashboardStats = {
  propriedades: number;
  talhoes: number;
  areaTotal: number;
  safrasAtivas: number;
  producaoMes: number;
  valorEstoque: number;
  comprasPendentes: number;
  itensCriticos: number;
  expedicoesMes: number;
  usuarios: number;
  lotesRastreados: number;
  etiquetasGeradas: number;
  documentos: number;
};

export type DashboardSafra = {
  id: string;
  nome: string;
  progresso: number;
  area: number;
  status: string;
};

export type DashboardAtividade = {
  id: string;
  tipo: "producao" | "compra" | "estoque" | "expedicao" | "caderno";
  descricao: string;
  created_at: string;
};

export type DashboardAlerta = {
  id: string;
  tipo: "critico" | "aviso";
  mensagem: string;
  modulo: string;
};

export type DashboardData = {
  stats: DashboardStats;
  safras: DashboardSafra[];
  atividades: DashboardAtividade[];
  alertas: DashboardAlerta[];
};

const formatRelativeDate = (date: string) => {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHours < 1) return "Agora há pouco";
  if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? "s" : ""}`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ontem";
  return `Há ${diffDays} dias`;
};

export const formatDashboardDate = formatRelativeDate;

export const getDashboardData = async (): Promise<DashboardData> => {
  const monthStart = startOfMonth();

  const [
    propriedades,
    talhoes,
    safrasAtivas,
    comprasPendentes,
    expedicoesMes,
    usuarios,
    lotesRastreados,
    etiquetasGeradas,
    documentos,
    propriedadesArea,
    talhoesArea,
    producaoMes,
    estoque,
    safras,
    comprasRecentes,
    producoesRecentes,
    cadernoRecente,
    expedicoesRecentes,
  ] = await Promise.all([
    getCount("propriedades"),
    getCount("talhoes"),
    supabase
      .from("safras")
      .select("*", { count: "exact", head: true })
      .in("status", ["ativo", "em andamento", "plantio", "colheita"]),
    supabase
      .from("compras")
      .select("*", { count: "exact", head: true })
      .in("status", ["pendente", "aguardando", "aguardando aprovação"]),
    supabase
      .from("expedicao")
      .select("*", { count: "exact", head: true })
      .gte("data_expedicao", monthStart),
    getCount("profiles"),
    getCount("lotes_rastreabilidade"),
    getCount("etiquetas"),
    getCount("documentos"),
    supabase.from("propriedades").select("area_total"),
    supabase.from("talhoes").select("area"),
    supabase.from("producao").select("quantidade").gte("data", monthStart),
    supabase.from("estoque").select("id,nome,quantidade,quantidade_minima,valor_unitario"),
    supabase
      .from("safras")
      .select("id,nome,progresso,area,status")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("compras")
      .select("id,numero,fornecedor,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("producao")
      .select("id,produto,quantidade,unidade,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("caderno_campo")
      .select("id,tipo_atividade,responsavel,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
    supabase
      .from("expedicao")
      .select("id,numero,status,created_at")
      .order("created_at", { ascending: false })
      .limit(4),
  ]);

  const queryErrors = [
    safrasAtivas.error,
    comprasPendentes.error,
    expedicoesMes.error,
    propriedadesArea.error,
    talhoesArea.error,
    producaoMes.error,
    estoque.error,
    safras.error,
    comprasRecentes.error,
    producoesRecentes.error,
    cadernoRecente.error,
    expedicoesRecentes.error,
  ].filter(Boolean);

  if (queryErrors[0]) throw queryErrors[0];

  const areaPropriedades =
    propriedadesArea.data?.reduce((total, item) => total + Number(item.area_total ?? 0), 0) ?? 0;
  const areaTalhoes = talhoesArea.data?.reduce((total, item) => total + Number(item.area ?? 0), 0) ?? 0;
  const valorEstoque =
    estoque.data?.reduce(
      (total, item) => total + Number(item.quantidade ?? 0) * Number(item.valor_unitario ?? 0),
      0,
    ) ?? 0;
  const itensCriticos =
    estoque.data?.filter(
      (item) =>
        item.quantidade_minima !== null &&
        Number(item.quantidade ?? 0) <= Number(item.quantidade_minima ?? 0),
    ).length ?? 0;

  const alertas: DashboardAlerta[] = [
    ...(estoque.data ?? [])
      .filter(
        (item) =>
          item.quantidade_minima !== null &&
          Number(item.quantidade ?? 0) <= Number(item.quantidade_minima ?? 0),
      )
      .slice(0, 3)
      .map((item) => ({
        id: `estoque-${item.id}`,
        tipo: "critico" as const,
        mensagem: `${item.nome} abaixo do mínimo`,
        modulo: "Estoque",
      })),
  ];

  if ((comprasPendentes.count ?? 0) > 0) {
    alertas.push({
      id: "compras-pendentes",
      tipo: "aviso",
      mensagem: `${comprasPendentes.count ?? 0} compra(s) aguardando ação`,
      modulo: "Compras",
    });
  }

  const atividades: DashboardAtividade[] = [
    ...(producoesRecentes.data ?? []).map((item) => ({
      id: `producao-${item.id}`,
      tipo: "producao" as const,
      descricao: `Produção registrada - ${item.produto} (${item.quantidade ?? 0} ${item.unidade || ""})`,
      created_at: item.created_at,
    })),
    ...(comprasRecentes.data ?? []).map((item) => ({
      id: `compra-${item.id}`,
      tipo: "compra" as const,
      descricao: `Compra ${item.numero || item.fornecedor} - ${item.status || "sem status"}`,
      created_at: item.created_at,
    })),
    ...(cadernoRecente.data ?? []).map((item) => ({
      id: `caderno-${item.id}`,
      tipo: "caderno" as const,
      descricao: `${item.tipo_atividade} registrada${item.responsavel ? ` por ${item.responsavel}` : ""}`,
      created_at: item.created_at,
    })),
    ...(expedicoesRecentes.data ?? []).map((item) => ({
      id: `expedicao-${item.id}`,
      tipo: "expedicao" as const,
      descricao: `Expedição ${item.numero || "sem número"} - ${item.status || "sem status"}`,
      created_at: item.created_at,
    })),
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 6);

  return {
    stats: {
      propriedades,
      talhoes,
      areaTotal: areaPropriedades || areaTalhoes,
      safrasAtivas: safrasAtivas.count ?? 0,
      producaoMes: producaoMes.data?.reduce((total, item) => total + Number(item.quantidade ?? 0), 0) ?? 0,
      valorEstoque,
      comprasPendentes: comprasPendentes.count ?? 0,
      itensCriticos,
      expedicoesMes: expedicoesMes.count ?? 0,
      usuarios,
      lotesRastreados,
      etiquetasGeradas,
      documentos,
    },
    safras:
      safras.data?.map((item) => ({
        id: item.id,
        nome: item.nome,
        progresso: Number(item.progresso ?? 0),
        area: Number(item.area ?? 0),
        status: item.status || "sem status",
      })) ?? [],
    atividades,
    alertas,
  };
};
