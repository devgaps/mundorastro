import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import {
  createPropriedade,
  listPropriedades,
  type CreatePropriedadeInput,
  type Propriedade,
} from "@/services/propriedades";

type ViewMode = "grid" | "list";

const emptyForm = {
  nome: "",
  proprietario: "",
  cidade: "",
  estado: "",
  endereco: "",
  area_total: "",
  car: "",
  observacoes: "",
};

const formatLocation = (property: Propriedade) => {
  const cityState = [property.cidade, property.estado].filter(Boolean).join(", ");
  return cityState || property.endereco || "Localização não informada";
};

const getMainCrop = (property: Propriedade) => {
  return property.observacoes || property.proprietario || "Sem cultura definida";
};

const buildPayload = (form: typeof emptyForm): CreatePropriedadeInput => ({
  nome: form.nome.trim(),
  proprietario: form.proprietario.trim() || null,
  cidade: form.cidade.trim() || null,
  estado: form.estado.trim().toUpperCase() || null,
  endereco: form.endereco.trim() || null,
  area_total: form.area_total ? Number(form.area_total) : null,
  car: form.car.trim() || null,
  observacoes: form.observacoes.trim() || null,
});

const Propriedades = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: propriedades = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const createMutation = useMutation({
    mutationFn: createPropriedade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["propriedades"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Propriedade cadastrada",
        description: "Os dados foram salvos no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar a propriedade.",
        variant: "destructive",
      });
    },
  });

  const filteredProperties = useMemo(() => {
    const query = searchQuery.toLowerCase();

    return propriedades.filter((property) => {
      const searchable = [
        property.nome,
        property.proprietario,
        property.cidade,
        property.estado,
        property.endereco,
        property.car,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [propriedades, searchQuery]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome da propriedade para continuar.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(buildPayload(form));
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Propriedades Rurais
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas propriedades e áreas de cultivo
          </p>
        </div>
        <Button
          variant="hero"
          className="gap-2 w-fit animate-fade-in"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          Nova Propriedade
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredProperties.length} propriedades
          </span>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
              aria-label="Visualizar em grade"
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
              aria-label="Visualizar em lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando propriedades...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <MapPin className="h-8 w-8 text-destructive" />
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
      ) : filteredProperties.length > 0 ? (
        <div
          className={cn(
            "grid gap-4 lg:gap-6",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <PropertyCard
                name={property.nome}
                location={formatLocation(property)}
                area={property.area_total ?? 0}
                mainCrop={getMainCrop(property)}
                status="active"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="rounded-full bg-muted p-4 mb-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhuma propriedade encontrada
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Cadastre a primeira propriedade para iniciar o backend real do sistema.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Propriedade
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Nova propriedade</DialogTitle>
              <DialogDescription>
                Cadastre os dados principais da propriedade rural.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="nome">Nome</Label>
                <Input
                  id="nome"
                  value={form.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  placeholder="Fazenda Santa Maria"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proprietario">Proprietário</Label>
                <Input
                  id="proprietario"
                  value={form.proprietario}
                  onChange={(e) => handleChange("proprietario", e.target.value)}
                  placeholder="Nome do proprietário"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_total">Área total (ha)</Label>
                <Input
                  id="area_total"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.area_total}
                  onChange={(e) => handleChange("area_total", e.target.value)}
                  placeholder="1250"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cidade">Cidade</Label>
                <Input
                  id="cidade"
                  value={form.cidade}
                  onChange={(e) => handleChange("cidade", e.target.value)}
                  placeholder="Ribeirão Preto"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Input
                  id="estado"
                  value={form.estado}
                  onChange={(e) => handleChange("estado", e.target.value)}
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="endereco">Endereço</Label>
                <Input
                  id="endereco"
                  value={form.endereco}
                  onChange={(e) => handleChange("endereco", e.target.value)}
                  placeholder="Estrada rural, km 10"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="car">CAR</Label>
                <Input
                  id="car"
                  value={form.car}
                  onChange={(e) => handleChange("car", e.target.value)}
                  placeholder="Cadastro Ambiental Rural"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(e) => handleChange("observacoes", e.target.value)}
                  placeholder="Culturas principais, notas operacionais ou observações gerais"
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

export default Propriedades;
