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
import { useToast } from "@/hooks/use-toast";
import { createEtiqueta, listEtiquetas } from "@/services/etiquetas";
import { listLotesRastreabilidade } from "@/services/rastreabilidade";
import {
  Tag,
  Plus,
  Search,
  Printer,
  Download,
  QrCode,
  Copy,
} from "lucide-react";

const statusColors: Record<string, string> = {
  ativa: "bg-green-500/10 text-green-600 border-green-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  expirada: "bg-red-500/10 text-red-600 border-red-500/20",
};

const initialForm = {
  lote_id: "",
  tipo: "qr_code",
  quantidade: "",
  unidade: "unidades",
  status: "ativa",
};

const formatTipo = (tipo: string | null) => {
  if (tipo === "codigo_barras") return "Código de barras";
  return "QR Code";
};

const Etiquetas = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: etiquetas = [], isLoading, isError } = useQuery({
    queryKey: ["etiquetas"],
    queryFn: listEtiquetas,
  });

  const { data: lotes = [] } = useQuery({
    queryKey: ["lotes-rastreabilidade"],
    queryFn: listLotesRastreabilidade,
  });

  const loteSelecionado = useMemo(
    () => lotes.find((lote) => lote.id === form.lote_id),
    [form.lote_id, lotes],
  );

  const nextCodigo = useMemo(() => {
    const year = new Date().getFullYear();
    return `ETQ-${year}-${String(etiquetas.length + 1).padStart(3, "0")}`;
  }, [etiquetas.length]);

  const filteredEtiquetas = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return etiquetas;

    return etiquetas.filter((etiqueta) =>
      [
        etiqueta.codigo,
        etiqueta.produto,
        etiqueta.status,
        etiqueta.tipo,
        etiqueta.lotes_rastreabilidade?.codigo,
        etiqueta.lotes_rastreabilidade?.produto,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [etiquetas, search]);

  const mutation = useMutation({
    mutationFn: createEtiqueta,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["etiquetas"] });
      setOpen(false);
      setForm(initialForm);
      toast({
        title: "Etiqueta gerada",
        description: "A etiqueta foi salva e já está disponível na lista.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar etiqueta",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const conteudo = loteSelecionado?.codigo
      ? `${window.location.origin}/consulta-qrcode?codigo=${encodeURIComponent(loteSelecionado.codigo)}`
      : null;

    mutation.mutate({
      codigo: nextCodigo,
      lote_id: form.lote_id || null,
      tipo: form.tipo,
      produto: loteSelecionado?.produto || null,
      quantidade: form.quantidade ? Number(form.quantidade) : loteSelecionado?.quantidade ?? null,
      unidade: form.unidade || loteSelecionado?.unidade || null,
      conteudo,
      status: form.status,
      impressoes: 0,
    });
  };

  const handleCopy = async (conteudo: string | null) => {
    if (!conteudo) return;
    await navigator.clipboard.writeText(conteudo);
    toast({ title: "Conteúdo copiado", description: "O link da etiqueta foi copiado." });
  };

  const handleDownload = (codigo: string, conteudo: string | null) => {
    if (!conteudo) return;

    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${codigo}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Etiquetas
          </h1>
          <p className="text-muted-foreground mt-1">
            Gere e gerencie etiquetas de rastreabilidade
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Gerar Etiqueta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gerar etiqueta</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="space-y-2">
                <Label>Código</Label>
                <Input value={nextCodigo} disabled />
              </div>
              <div className="space-y-2">
                <Label>Lote rastreável</Label>
                <Select
                  value={form.lote_id}
                  onValueChange={(value) => {
                    const lote = lotes.find((item) => item.id === value);
                    setForm((current) => ({
                      ...current,
                      lote_id: value,
                      quantidade: lote?.quantidade ? String(lote.quantidade) : current.quantidade,
                      unidade: lote?.unidade || current.unidade,
                    }));
                  }}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <SelectItem value="qr_code">QR Code</SelectItem>
                      <SelectItem value="codigo_barras">Código de barras</SelectItem>
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
                      <SelectItem value="ativa">Ativa</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="expirada">Expirada</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Input
                    value={form.unidade}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, unidade: event.target.value }))
                    }
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={mutation.isPending || !form.lote_id}>
                  {mutation.isPending ? "Gerando..." : "Gerar etiqueta"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar etiqueta..."
          className="pl-9 h-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando etiquetas...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar as etiquetas.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredEtiquetas.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhuma etiqueta encontrada.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredEtiquetas.map((etiqueta) => (
          <Card key={etiqueta.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-mono">{etiqueta.codigo}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {etiqueta.produto || etiqueta.lotes_rastreabilidade?.produto || "Produto não informado"}
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusColors[etiqueta.status || ""] || "bg-muted text-muted-foreground"}
                  variant="outline"
                >
                  {etiqueta.status || "sem status"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <QrCode className="h-4 w-4" />
                <span>{formatTipo(etiqueta.tipo)}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Lote</p>
                  <p className="font-mono">
                    {etiqueta.lotes_rastreabilidade?.codigo || "Sem lote"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Quantidade</p>
                  <p className="font-medium">
                    {etiqueta.quantidade ?? 0} {etiqueta.unidade || ""}
                  </p>
                </div>
              </div>

              <div className="text-sm">
                <p className="text-muted-foreground">Impressões</p>
                <p className="font-medium">{etiqueta.impressoes ?? 0} etiqueta(s)</p>
              </div>

              <div className="pt-3 border-t flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-1" disabled>
                  <Printer className="h-4 w-4" />
                  Imprimir
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleDownload(etiqueta.codigo, etiqueta.conteudo)}
                  disabled={!etiqueta.conteudo}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1"
                  onClick={() => handleCopy(etiqueta.conteudo)}
                  disabled={!etiqueta.conteudo}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Etiquetas;
