import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Truck,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  Package,
  Clock,
  User,
} from "lucide-react";

const mockExpedicoes = [
  {
    id: "1",
    numero: "EXP-2024-001",
    data: "2024-01-12",
    destino: "Porto de Santos, SP",
    transportadora: "TransAgro Ltda",
    motorista: "José Carlos",
    placa: "ABC-1234",
    lotes: ["LOT-2024-001", "LOT-2024-005"],
    pesoTotal: 306.2,
    previsaoChegada: "2024-01-14",
    status: "em trânsito",
  },
  {
    id: "2",
    numero: "EXP-2024-002",
    data: "2024-01-11",
    destino: "Cooperativa Central, Uberlândia",
    transportadora: "Rápido Agrícola",
    motorista: "Marcos Silva",
    placa: "DEF-5678",
    lotes: ["LOT-2024-002"],
    pesoTotal: 210.0,
    previsaoChegada: "2024-01-11",
    status: "entregue",
  },
  {
    id: "3",
    numero: "EXP-2024-003",
    data: "2024-01-13",
    destino: "Indústria Têxtil, São Paulo",
    transportadora: "LogAgro Express",
    motorista: "Ricardo Oliveira",
    placa: "GHI-9012",
    lotes: ["LOT-2024-004"],
    pesoTotal: 45.2,
    previsaoChegada: "2024-01-15",
    status: "aguardando",
  },
  {
    id: "4",
    numero: "EXP-2024-004",
    data: "2024-01-10",
    destino: "Porto de Paranaguá, PR",
    transportadora: "TransAgro Ltda",
    motorista: "Fernando Costa",
    placa: "JKL-3456",
    lotes: ["LOT-2024-003"],
    pesoTotal: 19.2,
    previsaoChegada: "2024-01-12",
    status: "entregue",
  },
  {
    id: "5",
    numero: "EXP-2024-005",
    data: "2024-01-14",
    destino: "Armazém Regional, Goiânia",
    transportadora: "Rápido Agrícola",
    motorista: "Paulo Souza",
    placa: "MNO-7890",
    lotes: ["LOT-2024-006"],
    pesoTotal: 98.3,
    previsaoChegada: "2024-01-14",
    status: "carregando",
  },
  {
    id: "6",
    numero: "EXP-2024-006",
    data: "2024-01-15",
    destino: "Terminal Grãos, Rondonópolis",
    transportadora: "LogAgro Express",
    motorista: "Anderson Lima",
    placa: "PQR-1234",
    lotes: [],
    pesoTotal: 0,
    previsaoChegada: "2024-01-16",
    status: "agendado",
  },
];

const statusColors: Record<string, string> = {
  "em trânsito": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  entregue: "bg-green-500/10 text-green-600 border-green-500/20",
  aguardando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  carregando: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  agendado: "bg-purple-500/10 text-purple-600 border-purple-500/20",
};

const Expedicao = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Expedição
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o envio e transporte de produtos
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Expedição
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar expedição..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {mockExpedicoes.map((exp) => (
          <Card key={exp.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">{exp.numero}</CardTitle>
                    <p className="text-sm text-muted-foreground">{exp.transportadora}</p>
                  </div>
                </div>
                <Badge className={statusColors[exp.status]} variant="outline">
                  {exp.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(exp.data).toLocaleDateString('pt-BR')}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{exp.destino}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span>{exp.motorista}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-mono bg-muted px-2 py-0.5 rounded">{exp.placa}</span>
                </div>
              </div>

              <div className="pt-2 border-t flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>{exp.lotes.length} lote(s) • {exp.pesoTotal} ton</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(exp.previsaoChegada).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Expedicao;
