import { useMemo, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Search,
  Filter,
  ShoppingCart,
  Package,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createCompra,
  listCompras,
  type Compra,
  type CreateCompraInput,
} from "@/services/compras";

const categorias = ["Insumos", "Sementes", "Fertilizantes", "Defensivos", "Equipamentos", "Combustível", "Outros"];

const emptyForm = {
  fornecedor: "",
  dataEntrega: "",
  categoria: "",
  valorTotal: "",
  observacoes: "",
};

const buildPayload = (form: typeof emptyForm, totalCompras: number): CreateCompraInput => ({
  numero: `CP-${new Date().getFullYear()}-${String(totalCompras + 1).padStart(3, "0")}`,
  fornecedor: form.fornecedor.trim(),
  data_compra: new Date().toISOString().slice(0, 10),
  data_entrega: form.dataEntrega || null,
  itens: 1,
  valor_total: form.valorTotal ? Number(form.valorTotal) : 0,
  status: "pendente",
  categoria: form.categoria || null,
  observacoes: form.observacoes.trim() || null,
});

const getStatusBadge = (status: string | null) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
    pendente: { variant: "secondary", label: "Pendente" },
    aprovada: { variant: "default", label: "Aprovada" },
    entregue: { variant: "outline", label: "Entregue" },
    cancelada: { variant: "destructive", label: "Cancelada" },
  };
  const config = variants[status ?? "pendente"] ?? variants.pendente;
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

const formatDate = (date: string | null) => {
  if (!date) return "-";
  return new Date(`${date}T00:00:00`).toLocaleDateString("pt-BR");
};

const Compras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novaCompra, setNovaCompra] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: compras = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["compras"],
    queryFn: listCompras,
  });

  const createMutation = useMutation({
    mutationFn: createCompra,
    onSuccess: (newCompra) => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      setDialogOpen(false);
      setNovaCompra(emptyForm);
      toast({
        title: "Compra registrada",
        description: `Pedido ${newCompra.numero || newCompra.id} criado com sucesso.`,
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao registrar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar a compra.",
        variant: "destructive",
      });
    },
  });

  const filteredCompras = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return compras.filter((compra) => {
      const searchable = [compra.numero, compra.fornecedor, compra.categoria]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchable.includes(query);
      const matchesStatus = statusFilter === "todos" || compra.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [compras, searchTerm, statusFilter]);

  const totalCompras = compras.length;
  const valorTotal = compras.reduce((acc, compra) => acc + (compra.valor_total ?? 0), 0);
  const comprasPendentes = compras.filter((compra) => compra.status === "pendente").length;
  const comprasEntregues = compras.filter((compra) => compra.status === "entregue").length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!novaCompra.fornecedor.trim()) {
      toast({
        title: "Fornecedor obrigatório",
        description: "Informe o fornecedor para continuar.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(buildPayload(novaCompra, totalCompras));
  };

  const renderRows = (rows: Compra[]) => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
            Carregando compras...
          </TableCell>
        </TableRow>
      );
    }

    if (isError) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-destructive">
            {error instanceof Error ? error.message : "Não foi possível carregar as compras."}
          </TableCell>
        </TableRow>
      );
    }

    if (rows.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
            Nenhuma compra encontrada
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((compra) => (
      <TableRow key={compra.id}>
        <TableCell className="font-medium">{compra.numero || "-"}</TableCell>
        <TableCell>{compra.fornecedor}</TableCell>
        <TableCell>{compra.categoria || "-"}</TableCell>
        <TableCell>{formatDate(compra.data_compra)}</TableCell>
        <TableCell>{formatDate(compra.data_entrega)}</TableCell>
        <TableCell className="text-right font-medium">{formatCurrency(compra.valor_total ?? 0)}</TableCell>
        <TableCell>{getStatusBadge(compra.status)}</TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Compras</h1>
          <p className="text-muted-foreground">Gerencie pedidos de compra e fornecedores</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Compra
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Registrar Nova Compra</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fornecedor">Fornecedor</Label>
                <Input
                  id="fornecedor"
                  placeholder="Nome do fornecedor"
                  value={novaCompra.fornecedor}
                  onChange={(event) => setNovaCompra({ ...novaCompra, fornecedor: event.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novaCompra.categoria}
                    onValueChange={(value) => setNovaCompra({ ...novaCompra, categoria: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dataEntrega">Data de Entrega</Label>
                  <Input
                    id="dataEntrega"
                    type="date"
                    value={novaCompra.dataEntrega}
                    onChange={(event) => setNovaCompra({ ...novaCompra, dataEntrega: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorTotal">Valor Total (R$)</Label>
                <Input
                  id="valorTotal"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={novaCompra.valorTotal}
                  onChange={(event) => setNovaCompra({ ...novaCompra, valorTotal: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais..."
                  value={novaCompra.observacoes}
                  onChange={(event) => setNovaCompra({ ...novaCompra, observacoes: event.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvando..." : "Salvar Compra"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Compras</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompras}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorTotal)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendentes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comprasPendentes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Entregues</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{comprasEntregues}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou fornecedor..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="entregue">Entregue</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Número</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Data Compra</TableHead>
                <TableHead>Entrega</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderRows(filteredCompras)}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compras;
