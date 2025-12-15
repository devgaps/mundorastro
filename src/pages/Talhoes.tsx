import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Grid3X3,
  Plus,
  Filter,
  Search,
  MapPin,
  Ruler,
  Droplets,
} from "lucide-react";

const mockTalhoes = [
  {
    id: "1",
    nome: "Talhão A1",
    propriedade: "Fazenda Santa Maria",
    area: 45.5,
    cultura: "Soja",
    tipoSolo: "Latossolo Vermelho",
    irrigacao: "Pivô Central",
    status: "plantado",
  },
  {
    id: "2",
    nome: "Talhão A2",
    propriedade: "Fazenda Santa Maria",
    area: 38.2,
    cultura: "Milho",
    tipoSolo: "Latossolo Vermelho",
    irrigacao: "Sequeiro",
    status: "colhido",
  },
  {
    id: "3",
    nome: "Talhão B1",
    propriedade: "Fazenda Boa Vista",
    area: 62.0,
    cultura: "Algodão",
    tipoSolo: "Argissolo",
    irrigacao: "Gotejamento",
    status: "preparando",
  },
  {
    id: "4",
    nome: "Talhão C1",
    propriedade: "Sítio São José",
    area: 12.8,
    cultura: "Café",
    tipoSolo: "Cambissolo",
    irrigacao: "Aspersão",
    status: "plantado",
  },
  {
    id: "5",
    nome: "Talhão D1",
    propriedade: "Fazenda Nova Esperança",
    area: 85.0,
    cultura: "Soja",
    tipoSolo: "Latossolo Amarelo",
    irrigacao: "Pivô Central",
    status: "plantado",
  },
  {
    id: "6",
    nome: "Talhão D2",
    propriedade: "Fazenda Nova Esperança",
    area: 72.3,
    cultura: "Milho Safrinha",
    tipoSolo: "Latossolo Amarelo",
    irrigacao: "Sequeiro",
    status: "em crescimento",
  },
];

const statusColors: Record<string, string> = {
  plantado: "bg-green-500/10 text-green-600 border-green-500/20",
  colhido: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  preparando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  "em crescimento": "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const Talhoes = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Talhões
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os talhões das suas propriedades
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Talhão
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar talhão..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {mockTalhoes.map((talhao) => (
          <Card key={talhao.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Grid3X3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{talhao.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{talhao.cultura}</p>
                  </div>
                </div>
                <Badge className={statusColors[talhao.status]} variant="outline">
                  {talhao.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{talhao.propriedade}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Ruler className="h-4 w-4" />
                <span>{talhao.area} hectares</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Droplets className="h-4 w-4" />
                <span>{talhao.irrigacao}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">Solo: {talhao.tipoSolo}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Talhoes;
