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
import { createEquipamento, listEquipamentos } from "@/services/equipamentos";
import { listPropriedades } from "@/services/propriedades";
import {
  Tractor,
  Plus,
  Search,
  Calendar,
  Gauge,
  Wrench,
  MapPin,
} from "lucide-react";

const statusColors: Record<string, string> = {
  operacional: "bg-green-500/10 text-green-600 border-green-500/20",
  manutenção: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  inativo: "bg-red-500/10 text-red-600 border-red-500/20",
};

const initialForm = {
  propriedade_id: "",
  nome: "",
  tipo: "Trator",
  marca: "",
  modelo: "",
  ano: "",
  identificacao: "",
  horas_uso: "",
  quilometragem: "",
  proxima_manutencao: "",
  status: "operacional",
  observacoes: "",
};

const Equipamentos = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: equipamentos = [], isLoading, isError } = useQuery({
    queryKey: ["equipamentos"],
    queryFn: listEquipamentos,
  });

  const { data: propriedades = [] } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const filteredEquipamentos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return equipamentos;

    return equipamentos.filter((equipamento) =>
      [
        equipamento.nome,
        equipamento.tipo,
        equipamento.marca,
        equipamento.modelo,
        equipamento.identificacao,
        equipamento.status,
        equipamento.propriedades?.nome,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [equipamentos, search]);

  const mutation = useMutation({
    mutationFn: createEquipamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipamentos"] });
      setOpen(false);
      setForm(initialForm);
      toast({
        title: "Equipamento cadastrado",
        description: "O equipamento foi salvo e já aparece na lista.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao cadastrar equipamento",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    mutation.mutate({
      propriedade_id: form.propriedade_id || null,
      nome: form.nome,
      tipo: form.tipo || null,
      marca: form.marca || null,
      modelo: form.modelo || null,
      ano: form.ano ? Number(form.ano) : null,
      identificacao: form.identificacao || null,
      horas_uso: form.horas_uso ? Number(form.horas_uso) : null,
      quilometragem: form.quilometragem ? Number(form.quilometragem) : null,
      proxima_manutencao: form.proxima_manutencao || null,
      status: form.status,
      observacoes: form.observacoes || null,
    });
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Equipamentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie máquinas e implementos agrícolas
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo equipamento</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    value={form.nome}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, nome: event.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Propriedade</Label>
                  <Select
                    value={form.propriedade_id}
                    onValueChange={(value) =>
                      setForm((current) => ({ ...current, propriedade_id: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma propriedade" />
                    </SelectTrigger>
                    <SelectContent>
                      {propriedades.map((propriedade) => (
                        <SelectItem key={propriedade.id} value={propriedade.id}>
                          {propriedade.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select
                    value={form.tipo}
                    onValueChange={(value) => setForm((current) => ({ ...current, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Trator">Trator</SelectItem>
                      <SelectItem value="Colheitadeira">Colheitadeira</SelectItem>
                      <SelectItem value="Pulverizador">Pulverizador</SelectItem>
                      <SelectItem value="Plantadeira">Plantadeira</SelectItem>
                      <SelectItem value="Implemento">Implemento</SelectItem>
                      <SelectItem value="Caminhão">Caminhão</SelectItem>
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
                      <SelectItem value="operacional">Operacional</SelectItem>
                      <SelectItem value="manutenção">Manutenção</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Marca</Label>
                  <Input
                    value={form.marca}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, marca: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Modelo</Label>
                  <Input
                    value={form.modelo}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, modelo: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ano</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.ano}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, ano: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Identificação</Label>
                  <Input
                    value={form.identificacao}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, identificacao: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horas de uso</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.horas_uso}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, horas_uso: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Quilometragem</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.quilometragem}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, quilometragem: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Próxima manutenção</Label>
                  <Input
                    type="date"
                    value={form.proxima_manutencao}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, proxima_manutencao: event.target.value }))
                    }
                  />
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
                  {mutation.isPending ? "Salvando..." : "Salvar equipamento"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar equipamento..."
          className="pl-9 h-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando equipamentos...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar os equipamentos.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredEquipamentos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum equipamento encontrado.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredEquipamentos.map((equipamento) => (
          <Card key={equipamento.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Tractor className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{equipamento.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {equipamento.tipo || "Tipo não informado"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusColors[equipamento.status || ""] || "bg-muted text-muted-foreground"}
                  variant="outline"
                >
                  {equipamento.status || "sem status"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">{equipamento.marca || "Marca não informada"}</span>
                {equipamento.modelo && <span>•</span>}
                {equipamento.modelo && <span>{equipamento.modelo}</span>}
              </div>
              {equipamento.ano && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Ano: {equipamento.ano}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4" />
                <span>
                  {equipamento.quilometragem
                    ? `${equipamento.quilometragem.toLocaleString("pt-BR")} km`
                    : `${equipamento.horas_uso ?? 0} horas`}
                </span>
              </div>
              {equipamento.proxima_manutencao && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Wrench className="h-4 w-4" />
                  <span>
                    Manutenção:{" "}
                    {new Date(equipamento.proxima_manutencao).toLocaleDateString("pt-BR")}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{equipamento.propriedades?.nome || "Sem propriedade vinculada"}</span>
              </div>
              {equipamento.identificacao && (
                <p className="font-mono text-sm bg-muted px-2 py-1 rounded">
                  {equipamento.identificacao}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Equipamentos;
