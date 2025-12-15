import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Wheat,
  Plus,
  Filter,
  Search,
  Calendar,
  Scale,
  Truck,
  Warehouse,
} from "lucide-react";

const mockProducao = [
  {
    id: "1",
    data: "2024-01-10",
    safra: "Safra 2023/2024 - Soja",
    talhao: "Talhão A1",
    cultura: "Soja",
    quantidade: 125.5,
    unidade: "toneladas",
    umidade: 13.2,
    destino: "Armazém Central",
    responsavel: "João Silva",
    status: "armazenado",
  },
  {
    id: "2",
    data: "2024-01-09",
    safra: "Safra 2023/2024 - Soja",
    talhao: "Talhão A2",
    cultura: "Soja",
    quantidade: 98.3,
    unidade: "toneladas",
    umidade: 14.1,
    destino: "Cooperativa Agrícola",
    responsavel: "Carlos Mendes",
    status: "expedido",
  },
  {
    id: "3",
    data: "2024-01-08",
    safra: "Safra 2023/2024 - Milho",
    talhao: "Talhão B1",
    cultura: "Milho",
    quantidade: 210.0,
    unidade: "toneladas",
    umidade: 12.8,
    destino: "Armazém Central",
    responsavel: "Pedro Oliveira",
    status: "armazenado",
  },
  {
    id: "4",
    data: "2024-01-07",
    safra: "Safra 2023 - Algodão",
    talhao: "Talhão D1",
    cultura: "Algodão",
    quantidade: 45.2,
    unidade: "toneladas",
    umidade: 8.5,
    destino: "Beneficiadora",
    responsavel: "Maria Santos",
    status: "processando",
  },
  {
    id: "5",
    data: "2024-01-06",
    safra: "Safra 2024 - Café",
    talhao: "Talhão C1",
    cultura: "Café",
    quantidade: 320,
    unidade: "sacas",
    umidade: 11.0,
    destino: "Armazém Café",
    responsavel: "Antônio Ferreira",
    status: "armazenado",
  },
  {
    id: "6",
    data: "2024-01-05",
    safra: "Safra 2023/2024 - Soja",
    talhao: "Talhão D2",
    cultura: "Soja",
    quantidade: 180.7,
    unidade: "toneladas",
    umidade: 13.5,
    destino: "Porto Santos",
    responsavel: "João Silva",
    status: "expedido",
  },
];

const statusColors: Record<string, string> = {
  armazenado: "bg-green-500/10 text-green-600 border-green-500/20",
  expedido: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const Producao = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Produção
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre e acompanhe a produção colhida
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Registrar Produção
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar produção..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockProducao.map((prod) => (
          <Card key={prod.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Wheat className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{prod.cultura}</CardTitle>
                    <p className="text-sm text-muted-foreground">{prod.talhao}</p>
                  </div>
                </div>
                <Badge className={statusColors[prod.status]} variant="outline">
                  {prod.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(prod.data).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Quantidade</p>
                    <p className="font-medium">{prod.quantidade} {prod.unidade}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Umidade</p>
                  <p className="font-medium">{prod.umidade}%</p>
                </div>
              </div>

              <div className="pt-2 border-t space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span>{prod.destino}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  <span>{prod.safra}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Producao;
