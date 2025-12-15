import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Plus,
  Filter,
  Search,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Sun,
} from "lucide-react";

const mockRegistros = [
  {
    id: "1",
    data: "2024-01-10",
    talhao: "Talhão A1",
    propriedade: "Fazenda Santa Maria",
    tipoAtividade: "Aplicação de Defensivo",
    produto: "Roundup Original",
    dosagem: "2,5 L/ha",
    responsavel: "João Silva",
    observacoes: "Aplicação realizada pela manhã, condições climáticas favoráveis",
    status: "concluído",
  },
  {
    id: "2",
    data: "2024-01-08",
    talhao: "Talhão B1",
    propriedade: "Fazenda Boa Vista",
    tipoAtividade: "Irrigação",
    produto: "-",
    dosagem: "15 mm",
    responsavel: "Carlos Mendes",
    observacoes: "Irrigação por pivô central durante 4 horas",
    status: "concluído",
  },
  {
    id: "3",
    data: "2024-01-12",
    talhao: "Talhão C1",
    propriedade: "Sítio São José",
    tipoAtividade: "Adubação",
    produto: "NPK 10-10-10",
    dosagem: "400 kg/ha",
    responsavel: "Maria Santos",
    observacoes: "Adubação de cobertura programada",
    status: "pendente",
  },
  {
    id: "4",
    data: "2024-01-11",
    talhao: "Talhão D1",
    propriedade: "Fazenda Nova Esperança",
    tipoAtividade: "Monitoramento de Pragas",
    produto: "-",
    dosagem: "-",
    responsavel: "Pedro Oliveira",
    observacoes: "Identificada presença de lagarta-da-soja em níveis baixos",
    status: "concluído",
  },
  {
    id: "5",
    data: "2024-01-09",
    talhao: "Talhão A2",
    propriedade: "Fazenda Santa Maria",
    tipoAtividade: "Plantio",
    produto: "Semente DM 68i",
    dosagem: "18 sementes/m",
    responsavel: "João Silva",
    observacoes: "Plantio realizado com espaçamento de 0,5m entre linhas",
    status: "concluído",
  },
  {
    id: "6",
    data: "2024-01-14",
    talhao: "Talhão D2",
    propriedade: "Fazenda Nova Esperança",
    tipoAtividade: "Colheita",
    produto: "-",
    dosagem: "-",
    responsavel: "Antônio Ferreira",
    observacoes: "Colheita programada - verificar umidade dos grãos",
    status: "agendado",
  },
];

const statusColors: Record<string, string> = {
  concluído: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  agendado: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const atividadeIcons: Record<string, React.ElementType> = {
  "Aplicação de Defensivo": Bug,
  "Irrigação": Droplets,
  "Adubação": Leaf,
  "Monitoramento de Pragas": Bug,
  "Plantio": Leaf,
  "Colheita": Sun,
};

const CadernoDeCampo = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Caderno de Campo
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre todas as atividades realizadas nos talhões
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Registro
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar registro..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockRegistros.map((registro) => {
          const IconComponent = atividadeIcons[registro.tipoAtividade] || BookOpen;
          return (
            <Card key={registro.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{registro.tipoAtividade}</CardTitle>
                      <p className="text-sm text-muted-foreground">{registro.talhao} • {registro.propriedade}</p>
                    </div>
                  </div>
                  <Badge className={statusColors[registro.status]} variant="outline">
                    {registro.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(registro.data).toLocaleDateString('pt-BR')}</span>
                </div>
                {registro.produto !== "-" && (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Produto:</span>
                      <p className="font-medium">{registro.produto}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Dosagem:</span>
                      <p className="font-medium">{registro.dosagem}</p>
                    </div>
                  </div>
                )}
                <div className="pt-2 border-t">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">Responsável:</span> {registro.responsavel}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">{registro.observacoes}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default CadernoDeCampo;
