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
import {
  QrCode,
  Plus,
  Filter,
  Search,
  Calendar,
  MapPin,
  Package,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listPropriedades } from "@/services/propriedades";
import { listSafras } from "@/services/safras";
import { listTalhoes } from "@/services/talhoes";
import {
  createLoteRastreabilidade,
  listLotesRastreabilidade,
  type CreateLoteRastreabilidadeInput,
  type LoteRastreabilidadeComRelacionamentos,
} from "@/services/rastreabilidade";

const statusColors: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-600 border-green-500/20",
  transito: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  entregue: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pendente: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const statusLabels: Record<string, string> = {
  ativo: "Ativo",
  transito: "Em trânsito",
  processando: "Processando",
  entregue: "Entregue",
  pendente: "Pendente",
};

const emptyForm = {
  codigo: "",
  produto: "",
  propriedade_id: "",
  safra_id: "",
  talhao_id: "",
  data_producao: new Date().toISOString().slice(0, 10),
  quantidade: "",
  unidade: "toneladas",
  status: "ativo",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateLoteRastreabilidadeInput => ({
  codigo: form.codigo.trim(),
  produto: form.produto.trim(),
  propriedade_id: form.propriedade_id || null,
  safra_id: form.safra_id || null,
  talhao_id: form.talhao_id || null,
  data_producao: form.data_producao || null,
  quantidade: form.quantidade ? Number(form.quantidade) : null,
  unidade: form.unidade.trim() || null,
  status: form.status || "ativo",
  observacoes: form.observacoes.trim() || null,
});

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const getStatusClass = (status: string | null) => {
  return statusColors[status ?? "ativo"] ?? statusColors.ativo;
};

const getStatusLabel = (status: string | null) => {
  return statusLabels[status ?? "ativo"] ?? statusLabels.ativo;
};

const matchesSearch = (lote: LoteRastreabilidadeComRelacionamentos, query: string) => {
  const searchable = [
    lote.codigo,
    lote.produto,
    lote.status,
    lote.propriedades?.nome,
    lote.safras?.nome,
    lote.talhoes?.nome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const Rastreabilidade = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: lotes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["lotes-rastreabilidade"],
    queryFn: listLotesRastreabilidade,
  });

  const { data: propriedades = [] } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const { data: safras = [] } = useQuery({
    queryKey: ["safras"],
    queryFn: listSafras,
  });

  const { data: talhoes = [] } = useQuery({
    queryKey: ["talhoes"],
    queryFn: listTalhoes,
  });

  const createMutation = useMutation({
    mutationFn: createLoteRastreabilidade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lotes-rastreabilidade"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Lote cadastrado",
        description: "O lote rastreável foi salvo no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar o lote.",
        variant: "destructive",
      });
    },
  });

  const filteredLotes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return lotes.filter((lote) => matchesSearch(lote, query));
  }, [lotes, searchQuery]);

  const filteredTalhoes = useMemo(() => {
    if (!form.propriedade_id) return talhoes;
    return talhoes.filter((talhao) => talhao.propriedade_id === form.propriedade_id);
  }, [form.propriedade_id, talhoes]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.codigo.trim() || !form.produto.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe código e produto do lote.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(buildPayload(form));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Rastreabilidade
          </h1>
          <p className="text-muted-foreground mt-1">
            Rastreie lotes desde a origem até o destino final
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button
            variant="hero"
            className="gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Novo Lote
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código do lote..."
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando lotes...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <QrCode className="h-8 w-8 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Não foi possível carregar
          </h3>
          <p className="text-muted-foreground max-w-sm">
            {error instanceof Error
              ? error.message
              : "Confira a conexão com o Supabase e tente novamente."}
          </p>
        </div>
      ) : filteredLotes.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredLotes.map((lote) => (
            <Card key={lote.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <QrCode className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg font-mono truncate">
                        {lote.codigo}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {lote.produto}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusClass(lote.status)} variant="outline">
                    {getStatusLabel(lote.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Produção: {formatDate(lote.data_producao)}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>{lote.quantidade ?? 0} {lote.unidade || ""}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {lote.propriedades?.nome || "Sem propriedade"} - {lote.talhoes?.nome || "Sem talhão"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <span className="truncate font-medium">
                    {lote.safras?.nome || "Sem safra"}
                  </span>
                </div>

                {lote.qr_code && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground truncate">{lote.qr_code}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <QrCode className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhum lote encontrado
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Cadastre lotes para habilitar rastreabilidade e consulta por QR Code.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Lote
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Novo lote</DialogTitle>
              <DialogDescription>
                Gere um lote rastreável com QR Code público para consulta.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={form.codigo}
                  onChange={(event) => handleChange("codigo", event.target.value)}
                  placeholder="LOT-2024-001"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="produto">Produto</Label>
                <Input
                  id="produto"
                  value={form.produto}
                  onChange={(event) => handleChange("produto", event.target.value)}
                  placeholder="Soja"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="propriedade">Propriedade</Label>
                <select
                  id="propriedade"
                  value={form.propriedade_id}
                  onChange={(event) => {
                    handleChange("propriedade_id", event.target.value);
                    handleChange("talhao_id", "");
                  }}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sem propriedade vinculada</option>
                  {propriedades.map((propriedade) => (
                    <option key={propriedade.id} value={propriedade.id}>
                      {propriedade.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="talhao">Talhão</Label>
                <select
                  id="talhao"
                  value={form.talhao_id}
                  onChange={(event) => handleChange("talhao_id", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sem talhão vinculado</option>
                  {filteredTalhoes.map((talhao) => (
                    <option key={talhao.id} value={talhao.id}>
                      {talhao.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="safra">Safra</Label>
                <select
                  id="safra"
                  value={form.safra_id}
                  onChange={(event) => handleChange("safra_id", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sem safra vinculada</option>
                  {safras.map((safra) => (
                    <option key={safra.id} value={safra.id}>
                      {safra.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_producao">Data de produção</Label>
                <Input
                  id="data_producao"
                  type="date"
                  value={form.data_producao}
                  onChange={(event) => handleChange("data_producao", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.quantidade}
                  onChange={(event) => handleChange("quantidade", event.target.value)}
                  placeholder="125.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidade">Unidade</Label>
                <Input
                  id="unidade"
                  value={form.unidade}
                  onChange={(event) => handleChange("unidade", event.target.value)}
                  placeholder="toneladas"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="ativo">Ativo</option>
                  <option value="transito">Em trânsito</option>
                  <option value="processando">Processando</option>
                  <option value="entregue">Entregue</option>
                  <option value="pendente">Pendente</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Certificações, destino ou informações de rastreabilidade"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
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

export default Rastreabilidade;
