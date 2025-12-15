import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tractor,
  Plus,
  Filter,
  Search,
  Calendar,
  Gauge,
  Wrench,
} from "lucide-react";

const mockEquipamentos = [
  {
    id: "1",
    nome: "Trator John Deere 6150J",
    tipo: "Trator",
    marca: "John Deere",
    modelo: "6150J",
    ano: 2022,
    horasUso: 1250,
    proximaManutencao: "2024-02-15",
    status: "operacional",
  },
  {
    id: "2",
    nome: "Colheitadeira New Holland CR6.80",
    tipo: "Colheitadeira",
    marca: "New Holland",
    modelo: "CR6.80",
    ano: 2021,
    horasUso: 890,
    proximaManutencao: "2024-01-20",
    status: "operacional",
  },
  {
    id: "3",
    nome: "Pulverizador Jacto Uniport 3030",
    tipo: "Pulverizador",
    marca: "Jacto",
    modelo: "Uniport 3030",
    ano: 2023,
    horasUso: 320,
    proximaManutencao: "2024-03-10",
    status: "operacional",
  },
  {
    id: "4",
    nome: "Plantadeira Massey Ferguson MF 500",
    tipo: "Plantadeira",
    marca: "Massey Ferguson",
    modelo: "MF 500",
    ano: 2020,
    horasUso: 1580,
    proximaManutencao: "2024-01-05",
    status: "manutenção",
  },
  {
    id: "5",
    nome: "Grade Aradora Baldan CRSG",
    tipo: "Implemento",
    marca: "Baldan",
    modelo: "CRSG 32x32",
    ano: 2019,
    horasUso: 2100,
    proximaManutencao: "2024-04-01",
    status: "operacional",
  },
  {
    id: "6",
    nome: "Caminhão Mercedes Atego 2426",
    tipo: "Caminhão",
    marca: "Mercedes-Benz",
    modelo: "Atego 2426",
    ano: 2021,
    horasUso: 45000,
    proximaManutencao: "2024-02-28",
    status: "inativo",
  },
];

const statusColors: Record<string, string> = {
  operacional: "bg-green-500/10 text-green-600 border-green-500/20",
  manutenção: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  inativo: "bg-red-500/10 text-red-600 border-red-500/20",
};

const Equipamentos = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Equipamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie máquinas e implementos agrícolas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Equipamento
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar equipamento..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {mockEquipamentos.map((equip) => (
          <Card key={equip.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Tractor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equip.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{equip.tipo}</p>
                  </div>
                </div>
                <Badge className={statusColors[equip.status]} variant="outline">
                  {equip.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{equip.marca}</span>
                <span>•</span>
                <span>{equip.modelo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Ano: {equip.ano}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <span>{equip.tipo === "Caminhão" ? `${equip.horasUso.toLocaleString()} km` : `${equip.horasUso} horas`}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wrench className="h-4 w-4" />
                <span>Manutenção: {new Date(equip.proximaManutencao).toLocaleDateString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Equipamentos;
