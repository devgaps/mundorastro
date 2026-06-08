import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getDashboardData, formatDashboardDate } from "@/services/dashboard";
import {
  MapPin,
  Wheat,
  TrendingUp,
  Users,
  Plus,
  Warehouse,
  ShoppingCart,
  DollarSign,
  BookOpen,
  Truck,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Package,
  Sprout,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const modulosAcesso = [
  { nome: "Propriedades", icon: MapPin, href: "/propriedades", cor: "bg-emerald-500/10 text-emerald-600" },
  { nome: "Caderno de Campo", icon: BookOpen, href: "/caderno-de-campo", cor: "bg-blue-500/10 text-blue-600" },
  { nome: "Produção", icon: Wheat, href: "/producao", cor: "bg-amber-500/10 text-amber-600" },
  { nome: "Estoque", icon: Warehouse, href: "/estoque", cor: "bg-purple-500/10 text-purple-600" },
  { nome: "Compras", icon: ShoppingCart, href: "/compras", cor: "bg-rose-500/10 text-rose-600" },
  { nome: "Rastreabilidade", icon: QrCode, href: "/rastreabilidade", cor: "bg-cyan-500/10 text-cyan-600" },
  { nome: "Expedição", icon: Truck, href: "/expedicao", cor: "bg-orange-500/10 text-orange-600" },
  { nome: "Financeiro", icon: DollarSign, href: "/financeiro", cor: "bg-green-500/10 text-green-600" },
];

const activityIcons = {
  producao: Wheat,
  compra: ShoppingCart,
  estoque: Warehouse,
  expedicao: Truck,
  caderno: BookOpen,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboardData,
  });

  const stats = data?.stats;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground mt-1">
            Visão geral do Sistema de Gestão Rural
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="gap-2" onClick={() => navigate("/relatorios")}>
            <BarChart3 className="h-4 w-4" />
            Relatórios
          </Button>
          <Button className="gap-2" onClick={() => navigate("/propriedades")}>
            <Plus className="h-4 w-4" />
            Nova Propriedade
          </Button>
        </div>
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando painel...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar os indicadores do painel.
          </CardContent>
        </Card>
      )}

      {data && data.alertas.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5 animate-fade-in">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-destructive">Atenção necessária</p>
                <div className="space-y-1">
                  {data.alertas.map((alerta) => (
                    <div key={alerta.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-foreground">{alerta.mensagem}</span>
                      <Badge variant={alerta.tipo === "critico" ? "destructive" : "secondary"} className="text-xs">
                        {alerta.modulo}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="animate-fade-in" style={{ animationDelay: "0ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Propriedades</CardTitle>
                <MapPin className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.propriedades}</div>
                <p className="text-xs text-muted-foreground">{stats.talhoes} talhões cadastrados</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "50ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Área Total</CardTitle>
                <Sprout className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.areaTotal.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">hectares cadastrados</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "100ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
                <Warehouse className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats.valorEstoque)}</div>
                <p className="text-xs text-destructive flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {stats.itensCriticos} itens críticos
                </p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "150ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Produção do Mês</CardTitle>
                <Wheat className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.producaoMes.toLocaleString("pt-BR")}</div>
                <p className="text-xs text-muted-foreground">unidades registradas</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Safras Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.safrasAtivas}</div>
                <p className="text-xs text-muted-foreground">em andamento</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "250ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Compras Pendentes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-rose-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.comprasPendentes}</div>
                <p className="text-xs text-muted-foreground">aguardando ação</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "300ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Expedições</CardTitle>
                <Truck className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.expedicoesMes}</div>
                <p className="text-xs text-muted-foreground">realizadas este mês</p>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "350ms" }}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Usuários</CardTitle>
                <Users className="h-4 w-4 text-cyan-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.usuarios}</div>
                <p className="text-xs text-muted-foreground">perfis visíveis</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-1 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Safras em Andamento</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/safras")}>
                  Ver todas
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {data.safras.length === 0 && (
                  <p className="text-sm text-muted-foreground">Nenhuma safra cadastrada.</p>
                )}
                {data.safras.map((safra) => (
                  <div key={safra.id} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm">{safra.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {safra.area} ha - {safra.status}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{safra.progresso}%</span>
                    </div>
                    <Progress value={safra.progresso} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="lg:col-span-2 animate-fade-in" style={{ animationDelay: "450ms" }}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Atividades Recentes</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => navigate("/caderno-de-campo")}>
                  Caderno de Campo
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.atividades.length === 0 && (
                    <p className="text-sm text-muted-foreground">Nenhuma atividade recente.</p>
                  )}
                  {data.atividades.map((atividade) => {
                    const Icon = activityIcons[atividade.tipo];
                    return (
                      <div key={atividade.id} className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-muted">
                          <Icon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{atividade.descricao}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDashboardDate(atividade.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="animate-fade-in" style={{ animationDelay: "500ms" }}>
            <CardHeader>
              <CardTitle className="text-lg">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {modulosAcesso.map((modulo) => {
                  const Icon = modulo.icon;
                  return (
                    <button
                      key={modulo.nome}
                      onClick={() => navigate(modulo.href)}
                      className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-accent transition-all duration-200 group"
                    >
                      <div className={`p-3 rounded-lg ${modulo.cor} group-hover:scale-110 transition-transform`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-medium text-center">{modulo.nome}</span>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="animate-fade-in" style={{ animationDelay: "550ms" }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-green-500/10">
                    <CheckCircle2 className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.lotesRastreados}</p>
                    <p className="text-sm text-muted-foreground">Lotes rastreados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "600ms" }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-blue-500/10">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.etiquetasGeradas}</p>
                    <p className="text-sm text-muted-foreground">Etiquetas geradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="animate-fade-in" style={{ animationDelay: "650ms" }}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-amber-500/10">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.documentos}</p>
                    <p className="text-sm text-muted-foreground">Documentos armazenados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
