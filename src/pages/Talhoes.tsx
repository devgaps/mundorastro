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
  Grid3X3,
  Plus,
  Filter,
  Search,
  MapPin,
  Ruler,
  Sprout,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listPropriedades } from "@/services/propriedades";
import {
  createTalhao,
  listTalhoes,
  type CreateTalhaoInput,
  type TalhaoComPropriedade,
} from "@/services/talhoes";

const statusColors: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-600 border-green-500/20",
  inativo: "bg-muted text-muted-foreground border-muted-foreground/20",
  preparo: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  plantado: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  colhido: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

const emptyForm = {
  nome: "",
  propriedade_id: "",
  area: "",
  cultura: "",
  variedade: "",
  status: "ativo",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateTalhaoInput => ({
  nome: form.nome.trim(),
  propriedade_id: form.propriedade_id || null,
  area: form.area ? Number(form.area) : null,
  cultura: form.cultura.trim() || null,
  variedade: form.variedade.trim() || null,
  status: form.status || "ativo",
  observacoes: form.observacoes.trim() || null,
});

const getStatusClass = (status: string | null) => {
  return statusColors[status ?? "ativo"] ?? statusColors.ativo;
};

const matchesSearch = (talhao: TalhaoComPropriedade, query: string) => {
  const searchable = [
    talhao.nome,
    talhao.cultura,
    talhao.variedade,
    talhao.status,
    talhao.propriedades?.nome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const Talhoes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: talhoes = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["talhoes"],
    queryFn: listTalhoes,
  });

  const { data: propriedades = [] } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const createMutation = useMutation({
    mutationFn: createTalhao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talhoes"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Talhão cadastrado",
        description: "O registro foi salvo no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar o talhão.",
        variant: "destructive",
      });
    },
  });

  const filteredTalhoes = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return talhoes.filter((talhao) => matchesSearch(talhao, query));
  }, [talhoes, searchQuery]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome do talhão para continuar.",
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
            Talhões
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os talhões das suas propriedades
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
            Novo Talhão
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar talhão..."
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando talhões...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <Grid3X3 className="h-8 w-8 text-destructive" />
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
      ) : filteredTalhoes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {filteredTalhoes.map((talhao) => (
            <Card key={talhao.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Grid3X3 className="h-5 w-5 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <CardTitle className="text-lg truncate">{talhao.nome}</CardTitle>
                      <p className="text-sm text-muted-foreground truncate">
                        {talhao.cultura || "Cultura não definida"}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusClass(talhao.status)} variant="outline">
                    {talhao.status || "ativo"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{talhao.propriedades?.nome || "Sem propriedade vinculada"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <span>{talhao.area ?? 0} hectares</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Sprout className="h-4 w-4" />
                  <span>{talhao.variedade || "Variedade não informada"}</span>
                </div>
                {talhao.observacoes && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {talhao.observacoes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Grid3X3 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhum talhão encontrado
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Cadastre talhões para organizar a produção por área de cultivo.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Talhão
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Novo talhão</DialogTitle>
              <DialogDescription>
                Vincule o talhão a uma propriedade e registre os dados de cultivo.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(event) => handleChange("nome", event.target.value)}
                  placeholder="Talhão A1"
                  required
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="propriedade">Propriedade</Label>
                <select
                  id="propriedade"
                  value={form.propriedade_id}
                  onChange={(event) => handleChange("propriedade_id", event.target.value)}
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
                <Label htmlFor="area">Área (ha)</Label>
                <Input
                  id="area"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.area}
                  onChange={(event) => handleChange("area", event.target.value)}
                  placeholder="45.5"
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
                  <option value="ativo">Ativo</option>
                  <option value="preparo">Preparo</option>
                  <option value="plantado">Plantado</option>
                  <option value="colhido">Colhido</option>
                  <option value="inativo">Inativo</option>
                </select>
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
                <Label htmlFor="variedade">Variedade</Label>
                <Input
                  id="variedade"
                  value={form.variedade}
                  onChange={(event) => handleChange("variedade", event.target.value)}
                  placeholder="BRS 284"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Solo, irrigação, restrições e observações operacionais"
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

export default Talhoes;
