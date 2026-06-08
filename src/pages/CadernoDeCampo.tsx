import { useMemo, useState, type ElementType, type FormEvent } from "react";
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
  BookOpen,
  Plus,
  Filter,
  Search,
  Calendar,
  Droplets,
  Bug,
  Leaf,
  Sun,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { listPropriedades } from "@/services/propriedades";
import { listTalhoes } from "@/services/talhoes";
import {
  createRegistroCampo,
  listRegistrosCampo,
  type CreateRegistroCampoInput,
  type RegistroCampoComRelacionamentos,
} from "@/services/cadernoCampo";

const statusColors: Record<string, string> = {
  concluido: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  agendado: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  cancelado: "bg-red-500/10 text-red-600 border-red-500/20",
};

const statusLabels: Record<string, string> = {
  concluido: "Concluído",
  pendente: "Pendente",
  agendado: "Agendado",
  cancelado: "Cancelado",
};

const atividadeIcons: Record<string, ElementType> = {
  "Aplicação de defensivo": Bug,
  Irrigação: Droplets,
  Adubação: Leaf,
  "Monitoramento de pragas": Bug,
  Plantio: Leaf,
  Colheita: Sun,
};

const emptyForm = {
  data: new Date().toISOString().slice(0, 10),
  propriedade_id: "",
  talhao_id: "",
  tipo_atividade: "",
  produto: "",
  dosagem: "",
  responsavel: "",
  status: "concluido",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm): CreateRegistroCampoInput => ({
  data: form.data || new Date().toISOString().slice(0, 10),
  propriedade_id: form.propriedade_id || null,
  talhao_id: form.talhao_id || null,
  tipo_atividade: form.tipo_atividade.trim(),
  produto: form.produto.trim() || null,
  dosagem: form.dosagem.trim() || null,
  responsavel: form.responsavel.trim() || null,
  status: form.status || "concluido",
  observacoes: form.observacoes.trim() || null,
});

const formatDate = (date: string) => {
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const getStatusClass = (status: string | null) => {
  return statusColors[status ?? "concluido"] ?? statusColors.concluido;
};

const getStatusLabel = (status: string | null) => {
  return statusLabels[status ?? "concluido"] ?? statusLabels.concluido;
};

const matchesSearch = (registro: RegistroCampoComRelacionamentos, query: string) => {
  const searchable = [
    registro.tipo_atividade,
    registro.produto,
    registro.responsavel,
    registro.status,
    registro.propriedades?.nome,
    registro.talhoes?.nome,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return searchable.includes(query);
};

const CadernoDeCampo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: registros = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["caderno-campo"],
    queryFn: listRegistrosCampo,
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
    mutationFn: createRegistroCampo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caderno-campo"] });
      setForm(emptyForm);
      setIsDialogOpen(false);
      toast({
        title: "Registro cadastrado",
        description: "A atividade foi salva no Supabase.",
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao cadastrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar o registro.",
        variant: "destructive",
      });
    },
  });

  const filteredRegistros = useMemo(() => {
    const query = searchQuery.toLowerCase();
    return registros.filter((registro) => matchesSearch(registro, query));
  }, [registros, searchQuery]);

  const filteredTalhoes = useMemo(() => {
    if (!form.propriedade_id) return talhoes;
    return talhoes.filter((talhao) => talhao.propriedade_id === form.propriedade_id);
  }, [form.propriedade_id, talhoes]);

  const handleChange = (field: keyof typeof emptyForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.tipo_atividade.trim()) {
      toast({
        title: "Atividade obrigatória",
        description: "Informe o tipo de atividade para continuar.",
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
            Caderno de Campo
          </h1>
          <p className="text-muted-foreground mt-1">
            Registre todas as atividades realizadas nos talhões
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
            Novo Registro
          </Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar registro..."
          className="pl-9 h-10"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando registros...
        </div>
      ) : isError ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-destructive/10 p-4 mb-4">
            <BookOpen className="h-8 w-8 text-destructive" />
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
      ) : filteredRegistros.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {filteredRegistros.map((registro) => {
            const IconComponent = atividadeIcons[registro.tipo_atividade] || BookOpen;

            return (
              <Card key={registro.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-lg truncate">
                          {registro.tipo_atividade}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">
                          {registro.talhoes?.nome || "Sem talhão"} • {registro.propriedades?.nome || "Sem propriedade"}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusClass(registro.status)} variant="outline">
                      {getStatusLabel(registro.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(registro.data)}</span>
                  </div>
                  {(registro.produto || registro.dosagem) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Produto:</span>
                        <p className="font-medium">{registro.produto || "-"}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Dosagem:</span>
                        <p className="font-medium">{registro.dosagem || "-"}</p>
                      </div>
                    </div>
                  )}
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium">Responsável:</span>{" "}
                      {registro.responsavel || "Não informado"}
                    </p>
                    {registro.observacoes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {registro.observacoes}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhum registro encontrado
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Cadastre atividades para montar o histórico de manejo do campo.
          </p>
          <Button
            variant="hero"
            className="mt-4 gap-2"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Adicionar Registro
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>Novo registro</DialogTitle>
              <DialogDescription>
                Registre atividades agronômicas e operacionais realizadas no campo.
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
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(event) => handleChange("status", event.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="concluido">Concluído</option>
                  <option value="pendente">Pendente</option>
                  <option value="agendado">Agendado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="tipo_atividade">Atividade</Label>
                <Input
                  id="tipo_atividade"
                  value={form.tipo_atividade}
                  onChange={(event) => handleChange("tipo_atividade", event.target.value)}
                  placeholder="Aplicação de defensivo"
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
                <Label htmlFor="produto">Produto</Label>
                <Input
                  id="produto"
                  value={form.produto}
                  onChange={(event) => handleChange("produto", event.target.value)}
                  placeholder="NPK 10-10-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosagem">Dosagem</Label>
                <Input
                  id="dosagem"
                  value={form.dosagem}
                  onChange={(event) => handleChange("dosagem", event.target.value)}
                  placeholder="400 kg/ha"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="responsavel">Responsável</Label>
                <Input
                  id="responsavel"
                  value={form.responsavel}
                  onChange={(event) => handleChange("responsavel", event.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={form.observacoes}
                  onChange={(event) => handleChange("observacoes", event.target.value)}
                  placeholder="Condições climáticas, justificativas, recomendações e observações"
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

export default CadernoDeCampo;
