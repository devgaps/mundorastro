import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { getDashboardData } from "@/services/dashboard";
import { generateRelatorioCsv, type RelatorioTipo } from "@/services/relatorios";
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  TrendingUp,
  Wheat,
  DollarSign,
  MapPin,
  Printer,
} from "lucide-react";

const relatorios: Array<{
  id: RelatorioTipo;
  titulo: string;
  descricao: string;
  categoria: string;
  icon: typeof Wheat;
  formato: string;
}> = [
  {
    id: "producao",
    titulo: "Relatório de Produção",
    descricao: "Produção por data, produto, quantidade e qualidade",
    categoria: "Produção",
    icon: Wheat,
    formato: "CSV",
  },
  {
    id: "financeiro",
    titulo: "Balanço Financeiro",
    descricao: "Receitas, despesas, categorias e status de pagamento",
    categoria: "Financeiro",
    icon: DollarSign,
    formato: "CSV",
  },
  {
    id: "produtividade",
    titulo: "Análise de Produtividade",
    descricao: "Resumo de safras, áreas, progresso e estágios",
    categoria: "Análise",
    icon: TrendingUp,
    formato: "CSV",
  },
  {
    id: "cadastro",
    titulo: "Inventário de Propriedades",
    descricao: "Propriedades e talhões cadastrados",
    categoria: "Cadastro",
    icon: MapPin,
    formato: "CSV",
  },
  {
    id: "caderno",
    titulo: "Histórico do Caderno de Campo",
    descricao: "Atividades agronômicas registradas no período",
    categoria: "Operacional",
    icon: FileText,
    formato: "CSV",
  },
  {
    id: "rastreabilidade",
    titulo: "Rastreabilidade por Lote",
    descricao: "Lotes, QR Codes e dados rastreáveis",
    categoria: "Rastreabilidade",
    icon: BarChart3,
    formato: "CSV",
  },
];

const downloadCsv = (fileName: string, csv: string) => {
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const Relatorios = () => {
  const [loadingReport, setLoadingReport] = useState<RelatorioTipo | null>(null);
  const { toast } = useToast();
  const { data } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  const handleGenerate = async (tipo: RelatorioTipo) => {
    setLoadingReport(tipo);
    try {
      const csv = await generateRelatorioCsv(tipo);
      downloadCsv(`mundorastro-${tipo}-${new Date().toISOString().slice(0, 10)}.csv`, csv);
      toast({
        title: "Relatório gerado",
        description: "O arquivo CSV foi preparado com os dados atuais.",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar relatório",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    } finally {
      setLoadingReport(null);
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Relatórios
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere e exporte relatórios da operação
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{relatorios.length}</p>
                <p className="text-sm text-muted-foreground">Modelos disponíveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <Download className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.stats.documentos ?? 0}</p>
                <p className="text-sm text-muted-foreground">Documentos armazenados</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <Calendar className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{data?.stats.lotesRastreados ?? 0}</p>
                <p className="text-sm text-muted-foreground">Lotes rastreáveis</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Relatórios Disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {relatorios.map((relatorio) => {
            const IconComponent = relatorio.icon;
            return (
              <Card key={relatorio.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                      {relatorio.formato}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-3">{relatorio.titulo}</CardTitle>
                  <CardDescription>{relatorio.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Dados atuais do Supabase</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 gap-1"
                      onClick={() => handleGenerate(relatorio.id)}
                      disabled={loadingReport !== null}
                    >
                      <Download className="h-4 w-4" />
                      {loadingReport === relatorio.id ? "Gerando..." : "Baixar"}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1" disabled>
                      <Printer className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Relatorios;
