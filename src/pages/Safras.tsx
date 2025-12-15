import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Sprout,
  Plus,
  Filter,
  Search,
  Calendar,
  Target,
  TrendingUp,
} from "lucide-react";

const mockSafras = [
  {
    id: "1",
    nome: "Safra 2023/2024 - Soja",
    cultura: "Soja",
    dataInicio: "2023-09-15",
    dataFim: "2024-03-30",
    areaTotal: 850,
    produtividadeEstimada: 65,
    produtividadeAtual: 62,
    progresso: 75,
    status: "em andamento",
  },
  {
    id: "2",
    nome: "Safra 2023/2024 - Milho",
    cultura: "Milho",
    dataInicio: "2023-10-01",
    dataFim: "2024-04-15",
    areaTotal: 420,
    produtividadeEstimada: 180,
    produtividadeAtual: 0,
    progresso: 45,
    status: "em andamento",
  },
  {
    id: "3",
    nome: "Safrinha 2024 - Milho",
    cultura: "Milho Safrinha",
    dataInicio: "2024-02-01",
    dataFim: "2024-07-30",
    areaTotal: 320,
    produtividadeEstimada: 120,
    produtividadeAtual: 0,
    progresso: 10,
    status: "planejada",
  },
  {
    id: "4",
    nome: "Safra 2023 - Algodão",
    cultura: "Algodão",
    dataInicio: "2023-01-10",
    dataFim: "2023-08-30",
    areaTotal: 280,
    produtividadeEstimada: 280,
    produtividadeAtual: 295,
    progresso: 100,
    status: "finalizada",
  },
  {
    id: "5",
    nome: "Safra 2024 - Café",
    cultura: "Café",
    dataInicio: "2024-01-01",
    dataFim: "2024-12-31",
    areaTotal: 45,
    produtividadeEstimada: 35,
    produtividadeAtual: 0,
    progresso: 5,
    status: "em andamento",
  },
  {
    id: "6",
    nome: "Safra 2022/2023 - Soja",
    cultura: "Soja",
    dataInicio: "2022-09-20",
    dataFim: "2023-03-25",
    areaTotal: 800,
    produtividadeEstimada: 60,
    produtividadeAtual: 58,
    progresso: 100,
    status: "finalizada",
  },
];

const statusColors: Record<string, string> = {
  "em andamento": "bg-green-500/10 text-green-600 border-green-500/20",
  planejada: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  finalizada: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const Safras = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Safras
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o ciclo das suas safras
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Safra
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar safra..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockSafras.map((safra) => (
          <Card key={safra.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{safra.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{safra.areaTotal} hectares</p>
                  </div>
                </div>
                <Badge className={statusColors[safra.status]} variant="outline">
                  {safra.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(safra.dataInicio).toLocaleDateString('pt-BR')} - {new Date(safra.dataFim).toLocaleDateString('pt-BR')}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className="font-medium">{safra.progresso}%</span>
                </div>
                <Progress value={safra.progresso} className="h-2" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Meta</p>
                    <p className="font-medium">{safra.produtividadeEstimada} sc/ha</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Atual</p>
                    <p className="font-medium">{safra.produtividadeAtual > 0 ? `${safra.produtividadeAtual} sc/ha` : '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Safras;
