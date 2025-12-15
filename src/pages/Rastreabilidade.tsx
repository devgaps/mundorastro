import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QrCode,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  Package,
  ArrowRight,
} from "lucide-react";

const mockLotes = [
  {
    id: "1",
    codigo: "LOT-2024-001",
    produto: "Soja",
    origem: "Fazenda Santa Maria - Talhão A1",
    dataColheita: "2024-01-10",
    quantidade: 125.5,
    unidade: "toneladas",
    destino: "Porto Santos",
    certificacoes: ["Orgânico", "Fair Trade"],
    status: "rastreado",
  },
  {
    id: "2",
    codigo: "LOT-2024-002",
    produto: "Milho",
    origem: "Fazenda Boa Vista - Talhão B1",
    dataColheita: "2024-01-08",
    quantidade: 210.0,
    unidade: "toneladas",
    destino: "Cooperativa Central",
    certificacoes: ["RTRS"],
    status: "em trânsito",
  },
  {
    id: "3",
    codigo: "LOT-2024-003",
    produto: "Café Arábica",
    origem: "Sítio São José - Talhão C1",
    dataColheita: "2024-01-06",
    quantidade: 320,
    unidade: "sacas",
    destino: "Exportação Europa",
    certificacoes: ["Rainforest Alliance", "UTZ"],
    status: "rastreado",
  },
  {
    id: "4",
    codigo: "LOT-2024-004",
    produto: "Algodão",
    origem: "Fazenda Nova Esperança - Talhão D1",
    dataColheita: "2024-01-07",
    quantidade: 45.2,
    unidade: "toneladas",
    destino: "Indústria Têxtil",
    certificacoes: ["BCI"],
    status: "processando",
  },
  {
    id: "5",
    codigo: "LOT-2024-005",
    produto: "Soja",
    origem: "Fazenda Nova Esperança - Talhão D2",
    dataColheita: "2024-01-05",
    quantidade: 180.7,
    unidade: "toneladas",
    destino: "China",
    certificacoes: ["RTRS", "ProTerra"],
    status: "entregue",
  },
  {
    id: "6",
    codigo: "LOT-2024-006",
    produto: "Milho Safrinha",
    origem: "Fazenda Santa Maria - Talhão A2",
    dataColheita: "2024-01-09",
    quantidade: 98.3,
    unidade: "toneladas",
    destino: "Armazém Regional",
    certificacoes: [],
    status: "pendente",
  },
];

const statusColors: Record<string, string> = {
  rastreado: "bg-green-500/10 text-green-600 border-green-500/20",
  "em trânsito": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  entregue: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pendente: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const Rastreabilidade = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Rastreabilidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Rastreie lotes desde a origem até o destino final
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Lote
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por código do lote..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockLotes.map((lote) => (
          <Card key={lote.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <QrCode className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">{lote.codigo}</CardTitle>
                    <p className="text-sm text-muted-foreground">{lote.produto}</p>
                  </div>
                </div>
                <Badge className={statusColors[lote.status]} variant="outline">
                  {lote.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Colheita: {new Date(lote.dataColheita).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>{lote.quantidade} {lote.unidade}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{lote.origem}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="truncate font-medium">{lote.destino}</span>
              </div>

              {lote.certificacoes.length > 0 && (
                <div className="pt-2 border-t flex flex-wrap gap-2">
                  {lote.certificacoes.map((cert) => (
                    <Badge key={cert} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rastreabilidade;
