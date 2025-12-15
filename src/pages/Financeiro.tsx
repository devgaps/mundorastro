import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatCard } from "@/components/dashboard/StatCard";
import {
  DollarSign,
  Plus,
  Filter,
  Search,
  Calendar,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  CreditCard,
} from "lucide-react";

const mockTransacoes = [
  {
    id: "1",
    data: "2024-01-12",
    descricao: "Venda de Soja - LOT-2024-001",
    categoria: "Receita",
    tipo: "entrada",
    valor: 156250.00,
    status: "confirmado",
  },
  {
    id: "2",
    data: "2024-01-11",
    descricao: "Compra de Fertilizantes NPK",
    categoria: "Insumos",
    tipo: "saida",
    valor: 45800.00,
    status: "confirmado",
  },
  {
    id: "3",
    data: "2024-01-10",
    descricao: "Venda de Milho - LOT-2024-002",
    categoria: "Receita",
    tipo: "entrada",
    valor: 89400.00,
    status: "pendente",
  },
  {
    id: "4",
    data: "2024-01-09",
    descricao: "Manutenção Trator John Deere",
    categoria: "Manutenção",
    tipo: "saida",
    valor: 12500.00,
    status: "confirmado",
  },
  {
    id: "5",
    data: "2024-01-08",
    descricao: "Folha de Pagamento - Janeiro",
    categoria: "Pessoal",
    tipo: "saida",
    valor: 78000.00,
    status: "confirmado",
  },
  {
    id: "6",
    data: "2024-01-07",
    descricao: "Venda de Café - LOT-2024-003",
    categoria: "Receita",
    tipo: "entrada",
    valor: 224000.00,
    status: "confirmado",
  },
  {
    id: "7",
    data: "2024-01-06",
    descricao: "Combustível - Dezembro",
    categoria: "Operacional",
    tipo: "saida",
    valor: 28500.00,
    status: "confirmado",
  },
  {
    id: "8",
    data: "2024-01-05",
    descricao: "Compra de Sementes",
    categoria: "Insumos",
    tipo: "saida",
    valor: 67000.00,
    status: "pendente",
  },
];

const statusColors: Record<string, string> = {
  confirmado: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  cancelado: "bg-red-500/10 text-red-600 border-red-500/20",
};

const Financeiro = () => {
  const totalEntradas = mockTransacoes
    .filter(t => t.tipo === "entrada" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalSaidas = mockTransacoes
    .filter(t => t.tipo === "saida" && t.status === "confirmado")
    .reduce((sum, t) => sum + t.valor, 0);
  
  const saldo = totalEntradas - totalSaidas;

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Financeiro
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie receitas e despesas da operação
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Receitas"
          value={`R$ ${(totalEntradas / 1000).toFixed(0)}k`}
          subtitle="este mês"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Despesas"
          value={`R$ ${(totalSaidas / 1000).toFixed(0)}k`}
          subtitle="este mês"
          icon={TrendingDown}
          variant="warning"
          trend={{ value: 8.2, isPositive: false }}
        />
        <StatCard
          title="Saldo"
          value={`R$ ${(saldo / 1000).toFixed(0)}k`}
          subtitle="atual"
          icon={Wallet}
          variant="primary"
        />
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar transação..." className="pl-9 h-10" />
      </div>

      {/* Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTransacoes.map((trans) => (
              <div
                key={trans.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    trans.tipo === "entrada" 
                      ? "bg-green-500/10" 
                      : "bg-red-500/10"
                  }`}>
                    {trans.tipo === "entrada" ? (
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{trans.descricao}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(trans.data).toLocaleDateString('pt-BR')}</span>
                      <span>•</span>
                      <span>{trans.categoria}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={statusColors[trans.status]} variant="outline">
                    {trans.status}
                  </Badge>
                  <span className={`font-semibold ${
                    trans.tipo === "entrada" 
                      ? "text-green-600" 
                      : "text-red-600"
                  }`}>
                    {trans.tipo === "entrada" ? "+" : "-"} R$ {trans.valor.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Financeiro;
