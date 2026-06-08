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
  Wheat,
  Plus,
  Filter,
  Search,
  Calendar,
  Scale,
  Truck,
  Warehouse,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listSafras } from "@/services/safras";
import { listTalhoes } from "@/services/talhoes";
import {
  createProducao,
  listProducao,
  type CreateProducaoInput,
  type ProducaoComRelacionamentos,
} from "@/services/producao";

const statusColors: Record<string, string> = {
  armazenado: "bg-green-500/10 text-green-600 border-green-500/20",
  expedido: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const emptyForm = {
  data: new Date().toISOString().slice(0, 10),
  produto: "",
  safra_id: "",
  talhao_id: "",
  quantidade: "",
  unidade: "toneladas",
  qualidade: "",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateProducaoInput => ({
  data: form.data || new Date().toISOString().slice(0, 10),
  produto: form.produto.trim(),
  safra_id: form.safra_id || null,
  talhao_id: form.talhao_id || null,
  quantidade: form.quantidade ? Number(form.quantidade) : null,
  unidade: form.unidade.trim() || null,
  qualidade: form.qualidade.trim() || null,
  observacoes: form.observacoes.trim() || null,
});

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const getStatusClass = (qualidade: string | null) => {
  const status = qualidade?.toLowerCase() || "armazenado";
  return statusColors[status] ?? statusColors.armazenado;
};

const getStatusLabel = (qualidade: string | null) => {
  return qualidade || "armazenado";
};

const matchesSearch = (producao: ProducaoComRelacionamentos, query: string) => {
  const searchable = [
    producao.produto,
    producao.unidade,
    producao.qualidade,
    producao.safras?.nome,
    producao.talhoes?.nome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const Producao = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: producao = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["producao"],
    queryFn: listProducao,
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
    mutationFn: createProducao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["producao"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Produção registrada",
        description: "A colheita foi salva no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao registrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar a produção.",
        variant: "destructive",
      });
    },
  });

  const filteredProducao = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return producao.filter((item) => matchesSearch(item, query));
  }, [producao, searchQuery]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.produto.trim()) {
      toast({
        title: "Produto obrigatório",
        description: "Informe o produto colhido para continuar.",
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
          <Button
            variant="hero"
            className="gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Registrar Produção
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar produção..."
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando produção...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <Wheat className="h-8 w-8 text-destructive" />
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
      ) : filteredProducao.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredProducao.map((prod) => (
            <Card key={prod.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Wheat className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{prod.produto}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {prod.talhoes?.nome || "Sem talhão"}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusClass(prod.qualidade)} variant="outline">
                    {getStatusLabel(prod.qualidade)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(prod.data)}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Quantidade</p>
                      <p className="font-medium">
                        {prod.quantidade ?? 0} {prod.unidade || ""}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Qualidade</p>
                    <p className="font-medium">{prod.qualidade || "-"}</p>
                  </div>
                </div>

                <div className="pt-2 border-t space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Warehouse className="h-4 w-4 text-muted-foreground" />
                    <span>{prod.safras?.nome || "Sem safra vinculada"}</span>
                  </div>
                  {prod.observacoes && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Truck className="h-4 w-4" />
                      <span className="line-clamp-1">{prod.observacoes}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Wheat className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhuma produção encontrada
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Registre a produção colhida para alimentar rastreabilidade e estoque.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Registrar Produção
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Registrar produção</DialogTitle>
              <DialogDescription>
                Salve a colheita realizada e vincule ao ciclo produtivo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <Label htmlFor="talhao">Talhão</Label>
                <select
                  id="talhao"
                  value={form.talhao_id}
                  onChange={(event) => handleChange("talhao_id", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="">Sem talhão vinculado</option>
                  {talhoes.map((talhao) => (
                    <option key={talhao.id} value={talhao.id}>
                      {talhao.nome}
                    </option>
                  ))}
                </select>
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
                <Label htmlFor="qualidade">Status/qualidade</Label>
                <Input
                  id="qualidade"
                  value={form.qualidade}
                  onChange={(event) => handleChange("qualidade", event.target.value)}
                  placeholder="armazenado"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Destino, umidade, responsável ou observações da colheita"
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

export default Producao;
