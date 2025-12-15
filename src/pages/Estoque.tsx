import { useState } from "react";
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
  ArrowUpDown
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ItemEstoque {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  unidade: string;
  quantidade: number;
  quantidadeMinima: number;
  localizacao: string;
  ultimaMovimentacao: string;
  valorUnitario: number;
}

const itensIniciais: ItemEstoque[] = [
  {
    id: "1",
    codigo: "INS-001",
    nome: "Fertilizante NPK 10-10-10",
    categoria: "Fertilizantes",
    unidade: "kg",
    quantidade: 2500,
    quantidadeMinima: 500,
    localizacao: "Galpão A - Prateleira 1",
    ultimaMovimentacao: "2024-01-20",
    valorUnitario: 3.50
  },
  {
    id: "2",
    codigo: "SEM-001",
    nome: "Semente de Soja - Variedade A",
    categoria: "Sementes",
    unidade: "kg",
    quantidade: 150,
    quantidadeMinima: 200,
    localizacao: "Galpão B - Câmara Fria",
    ultimaMovimentacao: "2024-01-18",
    valorUnitario: 45.00
  },
  {
    id: "3",
    codigo: "DEF-001",
    nome: "Herbicida Glifosato",
    categoria: "Defensivos",
    unidade: "L",
    quantidade: 80,
    quantidadeMinima: 50,
    localizacao: "Galpão C - Área Restrita",
    ultimaMovimentacao: "2024-01-22",
    valorUnitario: 28.90
  },
  {
    id: "4",
    codigo: "COM-001",
    nome: "Diesel S10",
    categoria: "Combustível",
    unidade: "L",
    quantidade: 3200,
    quantidadeMinima: 1000,
    localizacao: "Tanque Principal",
    ultimaMovimentacao: "2024-01-25",
    valorUnitario: 5.89
  },
  {
    id: "5",
    codigo: "PEC-001",
    nome: "Óleo Lubrificante 15W40",
    categoria: "Peças",
    unidade: "L",
    quantidade: 25,
    quantidadeMinima: 30,
    localizacao: "Oficina - Estante 2",
    ultimaMovimentacao: "2024-01-15",
    valorUnitario: 32.00
  },
  {
    id: "6",
    codigo: "EMB-001",
    nome: "Sacaria 60kg",
    categoria: "Embalagens",
    unidade: "un",
    quantidade: 5000,
    quantidadeMinima: 1000,
    localizacao: "Galpão A - Prateleira 5",
    ultimaMovimentacao: "2024-01-19",
    valorUnitario: 2.50
  },
];

const categorias = ["Fertilizantes", "Sementes", "Defensivos", "Combustível", "Peças", "Embalagens", "Outros"];
const unidades = ["kg", "L", "un", "m", "cx"];

const Estoque = () => {
  const [itens, setItens] = useState<ItemEstoque[]>(itensIniciais);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [novoItem, setNovoItem] = useState({
    nome: "",
    categoria: "",
    unidade: "",
    quantidade: "",
    quantidadeMinima: "",
    localizacao: "",
    valorUnitario: ""
  });

  const filteredItens = itens.filter(item => {
    const matchesSearch = 
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = categoriaFilter === "todos" || item.categoria === categoriaFilter;
    return matchesSearch && matchesCategoria;
  });

  const getStatusEstoque = (item: ItemEstoque) => {
    const percentual = (item.quantidade / item.quantidadeMinima) * 100;
    if (percentual <= 50) return { status: "critico", label: "Crítico", variant: "destructive" as const };
    if (percentual <= 100) return { status: "baixo", label: "Baixo", variant: "secondary" as const };
    return { status: "ok", label: "Normal", variant: "outline" as const };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: ItemEstoque = {
      id: String(itens.length + 1),
      codigo: `ITM-${String(itens.length + 1).padStart(3, '0')}`,
      nome: novoItem.nome,
      categoria: novoItem.categoria,
      unidade: novoItem.unidade,
      quantidade: parseFloat(novoItem.quantidade) || 0,
      quantidadeMinima: parseFloat(novoItem.quantidadeMinima) || 0,
      localizacao: novoItem.localizacao,
      ultimaMovimentacao: new Date().toISOString().split('T')[0],
      valorUnitario: parseFloat(novoItem.valorUnitario) || 0
    };

    setItens([...itens, newItem]);
    setDialogOpen(false);
    setNovoItem({ nome: "", categoria: "", unidade: "", quantidade: "", quantidadeMinima: "", localizacao: "", valorUnitario: "" });
    
    toast({
      title: "Item adicionado",
      description: `${newItem.nome} foi adicionado ao estoque.`,
    });
  };

  // Estatísticas
  const totalItens = itens.length;
  const valorTotalEstoque = itens.reduce((acc, item) => acc + (item.quantidade * item.valorUnitario), 0);
  const itensCriticos = itens.filter(item => getStatusEstoque(item).status === "critico").length;
  const itensBaixos = itens.filter(item => getStatusEstoque(item).status === "baixo").length;

  return (
    <div className="space-y-6">
      {/* Header */}
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
                  onChange={(e) => setNovoItem({ ...novoItem, nome: e.target.value })}
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
                    onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantidadeMinima">Qtd. Mínima</Label>
                  <Input
                    id="quantidadeMinima"
                    type="number"
                    placeholder="0"
                    value={novoItem.quantidadeMinima}
                    onChange={(e) => setNovoItem({ ...novoItem, quantidadeMinima: e.target.value })}
                    required
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
                  onChange={(e) => setNovoItem({ ...novoItem, valorUnitario: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="localizacao">Localização</Label>
                <Input
                  id="localizacao"
                  placeholder="Ex: Galpão A - Prateleira 1"
                  value={novoItem.localizacao}
                  onChange={(e) => setNovoItem({ ...novoItem, localizacao: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Adicionar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por código ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Table */}
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
              {filteredItens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhum item encontrado
                  </TableCell>
                </TableRow>
              ) : (
                filteredItens.map((item) => {
                  const statusInfo = getStatusEstoque(item);
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.nome}</p>
                          <p className="text-xs text-muted-foreground">{item.localizacao}</p>
                        </div>
                      </TableCell>
                      <TableCell>{item.categoria}</TableCell>
                      <TableCell className="text-right">
                        {item.quantidade} {item.unidade}
                      </TableCell>
                      <TableCell className="text-right">{formatCurrency(item.valorUnitario)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(item.quantidade * item.valorUnitario)}
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
