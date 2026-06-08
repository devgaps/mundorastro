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
import {
  Plus,
  Search,
  Filter,
  Package,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Eye,
  Edit,
  ArrowUpDown,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  createItemEstoque,
  listEstoque,
  type CreateItemEstoqueInput,
  type ItemEstoque,
} from "@/services/estoque";

const categorias = ["Fertilizantes", "Sementes", "Defensivos", "Combustível", "Peças", "Embalagens", "Outros"];
const unidades = ["kg", "L", "un", "m", "cx"];

const emptyForm = {
  nome: "",
  categoria: "",
  unidade: "",
  quantidade: "",
  quantidadeMinima: "",
  localizacao: "",
  valorUnitario: "",
};

const buildPayload = (form: typeof emptyForm, totalItens: number): CreateItemEstoqueInput => ({
  codigo: `ITM-${String(totalItens + 1).padStart(3, "0")}`,
  nome: form.nome.trim(),
  categoria: form.categoria || null,
  unidade: form.unidade || null,
  quantidade: form.quantidade ? Number(form.quantidade) : 0,
  quantidade_minima: form.quantidadeMinima ? Number(form.quantidadeMinima) : 0,
  localizacao: form.localizacao.trim() || null,
  valor_unitario: form.valorUnitario ? Number(form.valorUnitario) : 0,
  ultima_movimentacao: new Date().toISOString().slice(0, 10),
});

const getStatusEstoque = (item: ItemEstoque) => {
  const quantidade = item.quantidade ?? 0;
  const minima = item.quantidade_minima ?? 0;
  const percentual = minima > 0 ? (quantidade / minima) * 100 : 999;

  if (percentual <= 50) return { status: "critico", label: "Crítico", variant: "destructive" as const };
  if (percentual <= 100) return { status: "baixo", label: "Baixo", variant: "secondary" as const };
  return { status: "ok", label: "Normal", variant: "outline" as const };
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
};

const Estoque = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoItem, setNovoItem] = useState(emptyForm);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: itens = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["estoque"],
    queryFn: listEstoque,
  });

  const createMutation = useMutation({
    mutationFn: createItemEstoque,
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ["estoque"] });
      setDialogOpen(false);
      setNovoItem(emptyForm);
      toast({
        title: "Item adicionado",
        description: `${newItem.nome} foi adicionado ao estoque.`,
      });
    },
    onError: (mutationError) => {
      toast({
        title: "Erro ao adicionar",
        description:
          mutationError instanceof Error
            ? mutationError.message
            : "Não foi possível salvar o item.",
        variant: "destructive",
      });
    },
  });

  const filteredItens = useMemo(() => {
    const query = searchTerm.toLowerCase();

    return itens.filter((item) => {
      const searchable = [item.codigo, item.nome, item.localizacao]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const matchesSearch = searchable.includes(query);
      const matchesCategoria = categoriaFilter === "todos" || item.categoria === categoriaFilter;
      return matchesSearch && matchesCategoria;
    });
  }, [categoriaFilter, itens, searchTerm]);

  const totalItens = itens.length;
  const valorTotalEstoque = itens.reduce(
    (acc, item) => acc + ((item.quantidade ?? 0) * (item.valor_unitario ?? 0)),
    0
  );
  const itensCriticos = itens.filter((item) => getStatusEstoque(item).status === "critico").length;
  const itensBaixos = itens.filter((item) => getStatusEstoque(item).status === "baixo").length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!novoItem.nome.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Informe o nome do item para continuar.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate(buildPayload(novoItem, totalItens));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Estoque</h1>
          <p className="text-muted-foreground">Controle de insumos e materiais</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome do Item</Label>
                <Input
                  id="nome"
                  placeholder="Ex: Fertilizante NPK"
                  value={novoItem.nome}
                  onChange={(event) => setNovoItem({ ...novoItem, nome: event.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="categoria">Categoria</Label>
                  <Select
                    value={novoItem.categoria}
                    onValueChange={(value) => setNovoItem({ ...novoItem, categoria: value })}
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
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select
                    value={novoItem.unidade}
                    onValueChange={(value) => setNovoItem({ ...novoItem, unidade: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades.map((un) => (
                        <SelectItem key={un} value={un}>{un}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantidade">Quantidade</Label>
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="0"
                    value={novoItem.quantidade}
                    onChange={(event) => setNovoItem({ ...novoItem, quantidade: event.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidadeMinima">Qtd. Mínima</Label>
                  <Input
                    id="quantidadeMinima"
                    type="number"
                    placeholder="0"
                    value={novoItem.quantidadeMinima}
                    onChange={(event) => setNovoItem({ ...novoItem, quantidadeMinima: event.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="valorUnitario">Valor Unitário (R$)</Label>
                <Input
                  id="valorUnitario"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={novoItem.valorUnitario}
                  onChange={(event) => setNovoItem({ ...novoItem, valorUnitario: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Galpão A - Prateleira 1"
                  value={novoItem.localizacao}
                  onChange={(event) => setNovoItem({ ...novoItem, localizacao: event.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? "Salvando..." : "Adicionar"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Itens</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItens}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(valorTotalEstoque)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Crítico</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{itensCriticos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itensBaixos}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
              <SelectTrigger className="w-[160px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todas</SelectItem>
                {categorias.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
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
                <TableHead>Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Valor Unit.</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin inline mr-2" />
                    Carregando itens...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-destructive">
                    {error instanceof Error ? error.message : "Não foi possível carregar o estoque."}
                  </TableCell>
                </TableRow>
              ) : filteredItens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum item encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredItens.map((item) => {
                  const statusInfo = getStatusEstoque(item);
                  const quantidade = item.quantidade ?? 0;
                  const valorUnitario = item.valor_unitario ?? 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo || "-"}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-xs text-muted-foreground">{item.localizacao || "-"}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.categoria || "-"}</TableCell>
                      <TableCell className="text-right">
                        {quantidade} {item.unidade || ""}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(valorUnitario)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(quantidade * valorUnitario)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <ArrowUpDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Estoque;
