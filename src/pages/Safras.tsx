import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
  Sprout,
  Plus,
  Filter,
  Search,
  Calendar,
  Target,
  MapPin,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listPropriedades } from "@/services/propriedades";
import { listTalhoes } from "@/services/talhoes";
import {
  createSafra,
  listSafras,
  type CreateSafraInput,
  type SafraComRelacionamentos,
} from "@/services/safras";

const statusColors: Record<string, string> = {
  planejada: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  em_andamento: "bg-green-500/10 text-green-600 border-green-500/20",
  finalizada: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  cancelada: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  planejada: "Planejada",
  em_andamento: "Em andamento",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

const emptyForm = {
  nome: "",
  cultura: "",
  propriedade_id: "",
  talhao_id: "",
  data_plantio: "",
  data_colheita_prevista: "",
  area: "",
  progresso: "0",
  status: "em_andamento",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateSafraInput => ({
  nome: form.nome.trim(),
  cultura: form.cultura.trim() || null,
  propriedade_id: form.propriedade_id || null,
  talhao_id: form.talhao_id || null,
  data_plantio: form.data_plantio || null,
  data_colheita_prevista: form.data_colheita_prevista || null,
  area: form.area ? Number(form.area) : null,
  progresso: form.progresso ? Number(form.progresso) : 0,
  status: form.status || "em_andamento",
  observacoes: form.observacoes.trim() || null,
});

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const getStatusClass = (status: string | null) => {
  return statusColors[status ?? "em_andamento"] ?? statusColors.em_andamento;
};

const getStatusLabel = (status: string | null) => {
  return statusLabels[status ?? "em_andamento"] ?? statusLabels.em_andamento;
};

const matchesSearch = (safra: SafraComRelacionamentos, query: string) => {
  const searchable = [
    safra.nome,
    safra.cultura,
    safra.status,
    safra.propriedades?.nome,
    safra.talhoes?.nome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const Safras = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: safras = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["safras"],
    queryFn: listSafras,
  });

  const { data: propriedades = [] } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const { data: talhoes = [] } = useQuery({
    queryKey: ["talhoes"],
    queryFn: listTalhoes,
  });

  const createMutation = useMutation({
    mutationFn: createSafra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["safras"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Safra cadastrada",
        description: "O ciclo foi salvo no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar a safra.",
        variant: "destructive",
      });
    },
  });

  const filteredSafras = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return safras.filter((safra) => matchesSearch(safra, query));
  }, [safras, searchQuery]);

  const filteredTalhoes = useMemo(() => {
    if (!form.propriedade_id) return talhoes;
    return talhoes.filter((talhao) => talhao.propriedade_id === form.propriedade_id);
  }, [form.propriedade_id, talhoes]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome da safra para continuar.",
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
            Safras
          </h1>
          <p className="text-muted-foreground mt-1">
            Acompanhe o ciclo das suas safras
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
            Nova Safra
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar safra..."
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando safras...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <Sprout className="h-8 w-8 text-destructive" />
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
      ) : filteredSafras.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredSafras.map((safra) => (
            <Card key={safra.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sprout className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{safra.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {safra.area ?? 0} hectares • {safra.cultura || "Cultura não definida"}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusClass(safra.status)} variant="outline">
                    {getStatusLabel(safra.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {formatDate(safra.data_plantio)} - {formatDate(safra.data_colheita_prevista)}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="font-medium">{safra.progresso ?? 0}%</span>
                  </div>
                  <Progress value={safra.progresso ?? 0} className="h-2" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Propriedade</p>
                      <p className="font-medium truncate">
                        {safra.propriedades?.nome || "Não vinculada"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-0">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div className="min-w-0">
                      <p className="text-xs text-muted-foreground">Talhão</p>
                      <p className="font-medium truncate">
                        {safra.talhoes?.nome || "Não vinculado"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Sprout className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhuma safra encontrada
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Cadastre uma safra para acompanhar o ciclo produtivo.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Safra
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Nova safra</DialogTitle>
              <DialogDescription>
                Registre o ciclo de plantio e acompanhamento da produção.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(event) => handleChange("nome", event.target.value)}
                  placeholder="Safra 2024/2025 - Soja"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cultura">Cultura</Label>
                <Input
                  id="cultura"
                  value={form.cultura}
                  onChange={(event) => handleChange("cultura", event.target.value)}
                  placeholder="Soja"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="planejada">Planejada</option>
                  <option value="em_andamento">Em andamento</option>
                  <option value="finalizada">Finalizada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
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
                <Label htmlFor="data_plantio">Plantio</Label>
                <Input
                  id="data_plantio"
                  type="date"
                  value={form.data_plantio}
                  onChange={(event) => handleChange("data_plantio", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_colheita_prevista">Colheita prevista</Label>
                <Input
                  id="data_colheita_prevista"
                  type="date"
                  value={form.data_colheita_prevista}
                  onChange={(event) => handleChange("data_colheita_prevista", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area">Área (ha)</Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.area}
                  onChange={(event) => handleChange("area", event.target.value)}
                  placeholder="120"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="progresso">Progresso (%)</Label>
                <Input
                  id="progresso"
                  type="number"
                  min="0"
                  max="100"
                  value={form.progresso}
                  onChange={(event) => handleChange("progresso", event.target.value)}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Notas de planejamento, manejo e acompanhamento"
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

export default Safras;
