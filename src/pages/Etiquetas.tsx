import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tag,
  Plus,
  Filter,
  Search,
  Printer,
  Download,
  QrCode,
  Copy,
} from "lucide-react";

const mockEtiquetas = [
  {
    id: "1",
    codigo: "ETQ-2024-001",
    lote: "LOT-2024-001",
    produto: "Soja",
    quantidade: 125.5,
    unidade: "toneladas",
    dataGeracao: "2024-01-10",
    tipo: "QR Code",
    impressoes: 50,
    status: "ativa",
  },
  {
    id: "2",
    codigo: "ETQ-2024-002",
    lote: "LOT-2024-002",
    produto: "Milho",
    quantidade: 210.0,
    unidade: "toneladas",
    dataGeracao: "2024-01-08",
    tipo: "Código de Barras",
    impressoes: 100,
    status: "ativa",
  },
  {
    id: "3",
    codigo: "ETQ-2024-003",
    lote: "LOT-2024-003",
    produto: "Café Arábica",
    quantidade: 320,
    unidade: "sacas",
    dataGeracao: "2024-01-06",
    tipo: "QR Code",
    impressoes: 320,
    status: "ativa",
  },
  {
    id: "4",
    codigo: "ETQ-2024-004",
    lote: "LOT-2024-004",
    produto: "Algodão",
    quantidade: 45.2,
    unidade: "toneladas",
    dataGeracao: "2024-01-07",
    tipo: "Código de Barras",
    impressoes: 25,
    status: "pendente",
  },
  {
    id: "5",
    codigo: "ETQ-2024-005",
    lote: "LOT-2024-005",
    produto: "Soja",
    quantidade: 180.7,
    unidade: "toneladas",
    dataGeracao: "2024-01-05",
    tipo: "QR Code",
    impressoes: 90,
    status: "expirada",
  },
  {
    id: "6",
    codigo: "ETQ-2024-006",
    lote: "LOT-2024-006",
    produto: "Milho Safrinha",
    quantidade: 98.3,
    unidade: "toneladas",
    dataGeracao: "2024-01-09",
    tipo: "QR Code",
    impressoes: 0,
    status: "pendente",
  },
];

const statusColors: Record<string, string> = {
  ativa: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  expirada: "bg-red-500/10 text-red-600 border-red-500/20",
};

const Etiquetas = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Etiquetas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere e gerencie etiquetas de rastreabilidade
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Gerar Etiqueta
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar etiqueta..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {mockEtiquetas.map((etq) => (
          <Card key={etq.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">{etq.codigo}</CardTitle>
                    <p className="text-sm text-muted-foreground">{etq.produto}</p>
                  </div>
                </div>
                <Badge className={statusColors[etq.status]} variant="outline">
                  {etq.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <QrCode className="h-4 w-4" />
                <span>{etq.tipo}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Lote</p>
                  <p className="font-mono">{etq.lote}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-medium">{etq.quantidade} {etq.unidade}</p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Impressões</p>
                <p className="font-medium">{etq.impressoes} etiqueta(s)</p>
              </div>

              <div className="pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1">
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Etiquetas;
