import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatCard } from "@/components/dashboard/StatCard";
import {
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
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createTransacaoFinanceira,
  listFinanceiro,
  type CreateTransacaoFinanceiraInput,
  type TransacaoFinanceira,
} from "@/services/financeiro";

const statusColors: Record<string, string> = {
  pago: "bg-green-500/10 text-green-600 border-green-500/20",
  confirmado: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  cancelado: "bg-red-500/10 text-red-600 border-red-500/20",
};

const emptyForm = {
  data: new Date().toISOString().slice(0, 10),
  descricao: "",
  categoria: "",
  tipo: "entrada",
  valor: "",
  forma_pagamento: "",
  status: "pago",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateTransacaoFinanceiraInput => ({
  data: form.data || new Date().toISOString().slice(0, 10),
  descricao: form.descricao.trim(),
  categoria: form.categoria.trim() || null,
  tipo: form.tipo,
  valor: form.valor ? Number(form.valor) : 0,
  forma_pagamento: form.forma_pagamento.trim() || null,
  status: form.status || "pago",
  observacoes: form.observacoes.trim() || null,
});

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

const formatCompactCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const matchesSearch = (transacao: TransacaoFinanceira, query: string) => {
  const searchable = [
    transacao.descricao,
    transacao.categoria,
    transacao.tipo,
    transacao.status,
    transacao.forma_pagamento,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const Financeiro = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: transacoes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["financeiro"],
    queryFn: listFinanceiro,
  });

  const createMutation = useMutation({
    mutationFn: createTransacaoFinanceira,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["financeiro"] });
      setDialogOpen(false);
      setForm(emptyForm);
      toast({
        title: "Transação cadastrada",
        description: "O lançamento financeiro foi salvo no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar a transação.",
        variant: "destructive",
      });
    },
  });

  const filteredTransacoes = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return transacoes.filter((transacao) => matchesSearch(transacao, query));
  }, [searchTerm, transacoes]);

  const totalEntradas = transacoes
    .filter((transacao) => transacao.tipo === "entrada" && transacao.status !== "cancelado")
    .reduce((sum, transacao) => sum + transacao.valor, 0);

  const totalSaidas = transacoes
    .filter((transacao) => transacao.tipo === "saida" && transacao.status !== "cancelado")
    .reduce((sum, transacao) => sum + transacao.valor, 0);

  const saldo = totalEntradas - totalSaidas;

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.descricao.trim()) {
      toast({
        title: "Descrição obrigatória",
        description: "Informe a descrição da transação.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(buildPayload(form));
  };

  const renderTransactions = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando transações...
        </div>
      );
    }

    if (isError) {
      return (
        <div className="py-12 text-center text-destructive">
          {error instanceof Error ? error.message : "Não foi possível carregar o financeiro."}
        </div>
      );
    }

    if (filteredTransacoes.length === 0) {
      return (
        <div className="py-12 text-center text-muted-foreground">
          Nenhuma transação encontrada
        </div>
      );
    }

    return filteredTransacoes.map((trans) => (
      <div
        key={trans.id}
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className={`p-2 rounded-full ${trans.tipo === "entrada" ? "bg-green-500/10" : "bg-red-500/10"}`}>
            {trans.tipo === "entrada" ? (
              <ArrowUpRight className="h-5 w-5 text-green-600" />
            ) : (
              <ArrowDownRight className="h-5 w-5 text-red-600" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate">{trans.descricao}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(trans.data)}</span>
              <span>•</span>
              <span>{trans.categoria || "Sem categoria"}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <Badge className={statusColors[trans.status ?? "pago"] ?? statusColors.pago} variant="outline">
            {trans.status || "pago"}
          </Badge>
          <span className={`font-semibold ${trans.tipo === "entrada" ? "text-green-600" : "text-red-600"}`}>
            {trans.tipo === "entrada" ? "+" : "-"} {formatCurrency(trans.valor)}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
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
          <Button variant="hero" className="gap-2" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <StatCard
          title="Receitas"
          value={formatCompactCurrency(totalEntradas)}
          subtitle="lançamentos ativos"
          icon={TrendingUp}
          variant="success"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Despesas"
          value={formatCompactCurrency(totalSaidas)}
          subtitle="lançamentos ativos"
          icon={TrendingDown}
          variant="warning"
          trend={{ value: 8.2, isPositive: false }}
        />
        <StatCard
          title="Saldo"
          value={formatCompactCurrency(saldo)}
          subtitle="atual"
          icon={Wallet}
          variant="primary"
        />
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar transação..."
          className="pl-9 h-10"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Transações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">{renderTransactions()}</div>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Nova transação</DialogTitle>
              <DialogDescription>
                Registre uma receita ou despesa da operação.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={form.descricao}
                  onChange={(event) => handleChange("descricao", event.target.value)}
                  placeholder="Venda de soja"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo</Label>
                <select
                  id="tipo"
                  value={form.tipo}
                  onChange={(event) => handleChange("tipo", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="pago">Pago</option>
                  <option value="pendente">Pendente</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={form.data}
                  onChange={(event) => handleChange("data", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.valor}
                  onChange={(event) => handleChange("valor", event.target.value)}
                  placeholder="0,00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Input
                  id="categoria"
                  value={form.categoria}
                  onChange={(event) => handleChange("categoria", event.target.value)}
                  placeholder="Receita"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="forma_pagamento">Forma de pagamento</Label>
                <Input
                  id="forma_pagamento"
                  value={form.forma_pagamento}
                  onChange={(event) => handleChange("forma_pagamento", event.target.value)}
                  placeholder="Pix, boleto, cartão..."
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Notas adicionais"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Salvar
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Financeiro;
