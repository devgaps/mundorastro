import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { createExpedicao, listExpedicoes } from "@/services/expedicao";
import { listLotesRastreabilidade } from "@/services/rastreabilidade";
import {
  Truck,
  Plus,
  Search,
  Calendar,
  MapPin,
  Package,
  Building2,
} from "lucide-react";

const statusColors: Record<string, string> = {
  agendado: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  "em trânsito": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  entregue: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelado: "bg-red-500/10 text-red-600 border-red-500/20",
};

const initialForm = {
  lote_id: "",
  cliente: "",
  destino: "",
  transportadora: "",
  data_expedicao: new Date().toISOString().slice(0, 10),
  quantidade: "",
  unidade: "toneladas",
  status: "agendado",
  observacoes: "",
};

const Expedicao = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: expedicoes = [], isLoading, isError } = useQuery({
    queryKey: ["expedicoes"],
    queryFn: listExpedicoes,
  });

  const { data: lotes = [] } = useQuery({
    queryKey: ["lotes-rastreabilidade"],
    queryFn: listLotesRastreabilidade,
  });

  const mutation = useMutation({
    mutationFn: createExpedicao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expedicoes"] });
      setOpen(false);
      setForm(initialForm);
      toast({
        title: "Expedição cadastrada",
        description: "O envio foi salvo e já está disponível na lista.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar expedição",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const filteredExpedicoes = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return expedicoes;

    return expedicoes.filter((expedicao) =>
      [
        expedicao.numero,
        expedicao.cliente,
        expedicao.destino,
        expedicao.transportadora,
        expedicao.status,
        expedicao.lotes_rastreabilidade?.codigo,
        expedicao.lotes_rastreabilidade?.produto,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [expedicoes, search]);

  const nextNumero = useMemo(() => {
    const year = new Date().getFullYear();
    return `EXP-${year}-${String(expedicoes.length + 1).padStart(3, "0")}`;
  }, [expedicoes.length]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({
      numero: nextNumero,
      lote_id: form.lote_id || null,
      cliente: form.cliente,
      destino: form.destino,
      transportadora: form.transportadora || null,
      data_expedicao: form.data_expedicao,
      quantidade: form.quantidade ? Number(form.quantidade) : null,
      unidade: form.unidade || null,
      status: form.status,
      observacoes: form.observacoes || null,
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Expedição
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o envio e transporte de produtos
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Expedição
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Nova expedição</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Número</Label>
                  <Input value={nextNumero} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Data de expedição</Label>
                  <Input
                    type="date"
                    value={form.data_expedicao}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, data_expedicao: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Lote rastreável</Label>
                  <Select
                    value={form.lote_id}
                    onValueChange={(value) => setForm((current) => ({ ...current, lote_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {lotes.map((lote) => (
                        <SelectItem key={lote.id} value={lote.id}>
                          {lote.codigo} - {lote.produto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cliente</Label>
                  <Input
                    value={form.cliente}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, cliente: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Destino</Label>
                  <Input
                    value={form.destino}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, destino: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Transportadora</Label>
                  <Input
                    value={form.transportadora}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, transportadora: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quantidade</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.quantidade}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, quantidade: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={form.unidade}
                    onValueChange={(value) => setForm((current) => ({ ...current, unidade: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">kg</SelectItem>
                      <SelectItem value="toneladas">toneladas</SelectItem>
                      <SelectItem value="sacas">sacas</SelectItem>
                      <SelectItem value="unidades">unidades</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => setForm((current) => ({ ...current, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="agendado">Agendado</SelectItem>
                      <SelectItem value="em trânsito">Em trânsito</SelectItem>
                      <SelectItem value="entregue">Entregue</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={form.observacoes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, observacoes: event.target.value }))
                  }
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={mutation.isPending}>
                  {mutation.isPending ? "Salvando..." : "Salvar expedição"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar expedição..."
          className="pl-9 h-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando expedições...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar as expedições.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredExpedicoes.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma expedição encontrada.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredExpedicoes.map((expedicao) => (
          <Card key={expedicao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Truck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">
                      {expedicao.numero || "Sem número"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {expedicao.transportadora || "Transportadora não informada"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusColors[expedicao.status || ""] || "bg-muted text-muted-foreground"}
                  variant="outline"
                >
                  {expedicao.status || "sem status"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(expedicao.data_expedicao).toLocaleDateString("pt-BR")}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{expedicao.destino || "Destino não informado"}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{expedicao.cliente || "Cliente não informado"}</span>
              </div>

              <div className="pt-2 border-t flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {expedicao.lotes_rastreabilidade?.codigo || "Sem lote"} 
                    {expedicao.lotes_rastreabilidade?.produto
                      ? ` - ${expedicao.lotes_rastreabilidade.produto}`
                      : ""}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {expedicao.quantidade ?? 0} {expedicao.unidade || ""}
                </span>
              </div>
              {expedicao.observacoes && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  {expedicao.observacoes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Expedicao;
