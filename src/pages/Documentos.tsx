import { useMemo, useState } from "react";
import type { ElementType } from "react";
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
import { createDocumento, getDocumentoUrl, listDocumentos } from "@/services/documentos";
import { listPropriedades } from "@/services/propriedades";
import {
  FileText,
  Plus,
  Search,
  Calendar,
  Download,
  Eye,
  Folder,
  File,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";

const statusColors: Record<string, string> = {
  valido: "bg-green-500/10 text-green-600 border-green-500/20",
  expirado: "bg-red-500/10 text-red-600 border-red-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const formatIcons: Record<string, ElementType> = {
  PDF: FileText,
  XLS: FileSpreadsheet,
  XLSX: FileSpreadsheet,
  CSV: FileSpreadsheet,
  PNG: FileImage,
  JPG: FileImage,
  JPEG: FileImage,
  WEBP: FileImage,
};

const initialForm = {
  propriedade_id: "",
  nome: "",
  tipo: "Certificação",
  formato: "",
  validade: "",
  status: "valido",
  observacoes: "",
};

const formatBytes = (bytes: number | null) => {
  if (!bytes) return "0 KB";
  const units = ["bytes", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

const Documentos = () => {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: documentos = [], isLoading, isError } = useQuery({
    queryKey: ["documentos"],
    queryFn: listDocumentos,
  });

  const { data: propriedades = [] } = useQuery({
    queryKey: ["propriedades"],
    queryFn: listPropriedades,
  });

  const mutation = useMutation({
    mutationFn: () =>
      createDocumento(
        {
          propriedade_id: form.propriedade_id || null,
          nome: form.nome,
          tipo: form.tipo || null,
          formato: form.formato || null,
          validade: form.validade || null,
          status: form.status,
          observacoes: form.observacoes || null,
          url: null,
        },
        file,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      setOpen(false);
      setForm(initialForm);
      setFile(null);
      toast({
        title: "Documento salvo",
        description: "O documento foi armazenado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar documento",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const filteredDocumentos = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return documentos;

    return documentos.filter((documento) =>
      [
        documento.nome,
        documento.tipo,
        documento.formato,
        documento.status,
        documento.propriedades?.nome,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [documentos, search]);

  const stats = useMemo(() => {
    const planilhas = documentos.filter((doc) =>
      ["XLS", "XLSX", "CSV", "EXCEL"].includes((doc.formato || "").toUpperCase()),
    ).length;
    const imagens = documentos.filter((doc) =>
      ["PNG", "JPG", "JPEG", "WEBP", "IMAGEM"].includes((doc.formato || "").toUpperCase()),
    ).length;
    const pdfs = documentos.filter((doc) => (doc.formato || "").toUpperCase() === "PDF").length;

    return { total: documentos.length, pdfs, planilhas, imagens };
  }, [documentos]);

  const handleOpenDocumento = async (documentoId: string, download = false) => {
    const documento = documentos.find((item) => item.id === documentoId);
    if (!documento) return;

    try {
      const url = await getDocumentoUrl(documento);
      if (!url) {
        toast({ title: "Documento sem arquivo", variant: "destructive" });
        return;
      }

      if (download) {
        const link = document.createElement("a");
        link.href = url;
        link.download = documento.nome;
        link.click();
        return;
      }

      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast({
        title: "Erro ao abrir documento",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Documentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie documentos e certificações
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Novo documento</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                mutation.mutate();
              }}
              className="grid gap-4"
            >
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
                  <Label>Arquivo</Label>
                  <Input
                    type="file"
                    onChange={(event) => {
                      const selectedFile = event.target.files?.[0] ?? null;
                      setFile(selectedFile);
                      if (selectedFile && !form.nome) {
                        setForm((current) => ({ ...current, nome: selectedFile.name }));
                      }
                    }}
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
                  <Input
                    value={form.tipo}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, tipo: event.target.value }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Formato</Label>
                  <Input
                    value={form.formato}
                    placeholder="PDF, XLSX, PNG..."
                    onChange={(event) =>
                      setForm((current) => ({ ...current, formato: event.target.value.toUpperCase() }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Validade</Label>
                  <Input
                    type="date"
                    value={form.validade}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, validade: event.target.value }))
                    }
                  />
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
                      <SelectItem value="valido">Válido</SelectItem>
                      <SelectItem value="pendente">Pendente</SelectItem>
                      <SelectItem value="expirado">Expirado</SelectItem>
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
                  {mutation.isPending ? "Salvando..." : "Salvar documento"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.pdfs}</p>
                <p className="text-xs text-muted-foreground">PDFs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.planilhas}</p>
                <p className="text-xs text-muted-foreground">Planilhas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileImage className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.imagens}</p>
                <p className="text-xs text-muted-foreground">Imagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar documento..."
          className="pl-9 h-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando documentos...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar os documentos.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredDocumentos.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum documento encontrado.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {filteredDocumentos.map((documento) => {
          const IconComponent = formatIcons[(documento.formato || "").toUpperCase()] || File;
          return (
            <Card key={documento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Badge
                    className={statusColors[documento.status || ""] || "bg-muted text-muted-foreground"}
                    variant="outline"
                  >
                    {documento.status || "sem status"}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2">{documento.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{documento.tipo || "Sem tipo"}</span>
                  <span>{formatBytes(documento.tamanho_bytes)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{documento.propriedades?.nome || "Sem propriedade vinculada"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(documento.created_at).toLocaleDateString("pt-BR")}</span>
                </div>
                <div className="pt-2 border-t flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1"
                    onClick={() => handleOpenDocumento(documento.id)}
                    disabled={!documento.storage_path && !documento.url}
                  >
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1"
                    onClick={() => handleOpenDocumento(documento.id, true)}
                    disabled={!documento.storage_path && !documento.url}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Documentos;
