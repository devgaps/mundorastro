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
  Trash2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Compra {
  id: string;
  numero: string;
  fornecedor: string;
  dataCompra: string;
  dataEntrega: string;
  itens: number;
  valorTotal: number;
  status: "pendente" | "aprovada" | "entregue" | "cancelada";
  categoria: string;
}

const comprasIniciais: Compra[] = [
  {
    id: "1",
    numero: "CP-2024-001",
    fornecedor: "Agro Insumos Ltda",
    dataCompra: "2024-01-15",
    dataEntrega: "2024-01-20",
    itens: 5,
    valorTotal: 15750.00,
    status: "entregue",
    categoria: "Insumos"
  },
  {
    id: "2",
    numero: "CP-2024-002",
    fornecedor: "Sementes Brasil",
    dataCompra: "2024-01-18",
    dataEntrega: "2024-01-25",
    itens: 3,
    valorTotal: 8420.50,
    status: "aprovada",
    categoria: "Sementes"
  },
  {
    id: "3",
    numero: "CP-2024-003",
    fornecedor: "Máquinas Agrícolas SA",
    dataCompra: "2024-01-20",
    dataEntrega: "2024-02-10",
    itens: 2,
    valorTotal: 125000.00,
    status: "pendente",
    categoria: "Equipamentos"
  },
  {
    id: "4",
    numero: "CP-2024-004",
    fornecedor: "Fertilizantes Norte",
    dataCompra: "2024-01-22",
    dataEntrega: "2024-01-28",
    itens: 8,
    valorTotal: 32100.00,
    status: "entregue",
    categoria: "Fertilizantes"
  },
  {
    id: "5",
    numero: "CP-2024-005",
    fornecedor: "Defensivos Agrícolas",
    dataCompra: "2024-01-25",
    dataEntrega: "2024-02-01",
    itens: 4,
    valorTotal: 18900.00,
    status: "cancelada",
    categoria: "Defensivos"
  },
];

const categorias = ["Insumos", "Sementes", "Fertilizantes", "Defensivos", "Equipamentos", "Combustível", "Outros"];

const Compras = () => {
  const [compras, setCompras] = useState<Compra[]>(comprasIniciais);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [novaCompra, setNovaCompra] = useState({
    fornecedor: "",
    dataEntrega: "",
    categoria: "",
    valorTotal: "",
    observacoes: ""
  });

  const filteredCompras = compras.filter(compra => {
    const matchesSearch = 
      compra.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
      compra.fornecedor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "todos" || compra.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: Compra["status"]) => {
    const variants: Record<Compra["status"], { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pendente: { variant: "secondary", label: "Pendente" },
      aprovada: { variant: "default", label: "Aprovada" },
      entregue: { variant: "outline", label: "Entregue" },
      cancelada: { variant: "destructive", label: "Cancelada" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCompra: Compra = {
      id: String(compras.length + 1),
      numero: `CP-2024-${String(compras.length + 1).padStart(3, '0')}`,
      fornecedor: novaCompra.fornecedor,
      dataCompra: new Date().toISOString().split('T')[0],
      dataEntrega: novaCompra.dataEntrega,
      itens: 1,
      valorTotal: parseFloat(novaCompra.valorTotal) || 0,
      status: "pendente",
      categoria: novaCompra.categoria
    };

    setCompras([...compras, newCompra]);
    setDialogOpen(false);
    setNovaCompra({ fornecedor: "", dataEntrega: "", categoria: "", valorTotal: "", observacoes: "" });
    
    toast({
      title: "Compra registrada",
      description: `Pedido ${newCompra.numero} criado com sucesso.`,
    });
  };

  // Estatísticas
  const totalCompras = compras.length;
  const valorTotal = compras.reduce((acc, c) => acc + c.valorTotal, 0);
  const comprasPendentes = compras.filter(c => c.status === "pendente").length;
  const comprasEntregues = compras.filter(c => c.status === "entregue").length;

  return (
    <div className="space-y-6">
      {/* Header */}
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
                  onChange={(e) => setNovaCompra({ ...novaCompra, fornecedor: e.target.value })}
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
                    onChange={(e) => setNovaCompra({ ...novaCompra, dataEntrega: e.target.value })}
                    required
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
                  onChange={(e) => setNovaCompra({ ...novaCompra, valorTotal: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações adicionais..."
                  value={novaCompra.observacoes}
                  onChange={(e) => setNovaCompra({ ...novaCompra, observacoes: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Salvar Compra</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
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

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por número ou fornecedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
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
          </div>
        </CardContent>
      </Card>

      {/* Table */}
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
            <TableBody>
              {filteredCompras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    Nenhuma compra encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompras.map((compra) => (
                  <TableRow key={compra.id}>
                    <TableCell className="font-medium">{compra.numero}</TableCell>
                    <TableCell>{compra.fornecedor}</TableCell>
                    <TableCell>{compra.categoria}</TableCell>
                    <TableCell>{formatDate(compra.dataCompra)}</TableCell>
                    <TableCell>{formatDate(compra.dataEntrega)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(compra.valorTotal)}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Compras;
