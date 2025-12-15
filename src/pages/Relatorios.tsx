import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

const mockRelatorios = [
  {
    id: "1",
    titulo: "Relatório de Produção Mensal",
    descricao: "Resumo da produção por cultura e talhão",
    categoria: "Produção",
    icon: Wheat,
    ultimaGeracao: "2024-01-10",
    formato: "PDF",
  },
  {
    id: "2",
    titulo: "Balanço Financeiro",
    descricao: "Receitas, despesas e fluxo de caixa",
    categoria: "Financeiro",
    icon: DollarSign,
    ultimaGeracao: "2024-01-08",
    formato: "Excel",
  },
  {
    id: "3",
    titulo: "Análise de Produtividade",
    descricao: "Comparativo de produtividade entre safras",
    categoria: "Análise",
    icon: TrendingUp,
    ultimaGeracao: "2024-01-05",
    formato: "PDF",
  },
  {
    id: "4",
    titulo: "Inventário de Propriedades",
    descricao: "Lista completa de propriedades e talhões",
    categoria: "Cadastro",
    icon: MapPin,
    ultimaGeracao: "2024-01-12",
    formato: "PDF",
  },
  {
    id: "5",
    titulo: "Histórico do Caderno de Campo",
    descricao: "Todas as atividades registradas no período",
    categoria: "Operacional",
    icon: FileText,
    ultimaGeracao: "2024-01-11",
    formato: "Excel",
  },
  {
    id: "6",
    titulo: "Rastreabilidade por Lote",
    descricao: "Histórico completo de rastreabilidade",
    categoria: "Rastreabilidade",
    icon: BarChart3,
    ultimaGeracao: "2024-01-09",
    formato: "PDF",
  },
];

const Relatorios = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-sm text-muted-foreground">Relatórios gerados este mês</p>
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
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-muted-foreground">Downloads totais</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Agendamentos ativos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Relatórios Disponíveis</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {mockRelatorios.map((rel) => {
            const IconComponent = rel.icon;
            return (
              <Card key={rel.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded bg-muted">
                      {rel.formato}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-3">{rel.titulo}</CardTitle>
                  <CardDescription>{rel.descricao}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Última geração: {new Date(rel.ultimaGeracao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1">
                      <Download className="h-4 w-4" />
                      Baixar
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1">
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
