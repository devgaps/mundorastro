import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  Plus,
  Filter,
  Search,
  Mail,
  Phone,
  Shield,
  Calendar,
} from "lucide-react";

const mockUsuarios = [
  {
    id: "1",
    nome: "João Silva",
    email: "joao.silva@mundorastro.com",
    telefone: "(16) 99999-1111",
    cargo: "Administrador",
    perfil: "admin",
    ultimoAcesso: "2024-01-12T14:30:00",
    status: "ativo",
  },
  {
    id: "2",
    nome: "Maria Santos",
    email: "maria.santos@mundorastro.com",
    telefone: "(16) 99999-2222",
    cargo: "Gerente de Produção",
    perfil: "gerente",
    ultimoAcesso: "2024-01-12T10:15:00",
    status: "ativo",
  },
  {
    id: "3",
    nome: "Carlos Mendes",
    email: "carlos.mendes@mundorastro.com",
    telefone: "(34) 99999-3333",
    cargo: "Técnico Agrícola",
    perfil: "tecnico",
    ultimoAcesso: "2024-01-11T16:45:00",
    status: "ativo",
  },
  {
    id: "4",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@mundorastro.com",
    telefone: "(62) 99999-4444",
    cargo: "Operador de Campo",
    perfil: "operador",
    ultimoAcesso: "2024-01-10T08:00:00",
    status: "ativo",
  },
  {
    id: "5",
    nome: "Ana Costa",
    email: "ana.costa@mundorastro.com",
    telefone: "(16) 99999-5555",
    cargo: "Analista Financeiro",
    perfil: "financeiro",
    ultimoAcesso: "2024-01-12T11:30:00",
    status: "ativo",
  },
  {
    id: "6",
    nome: "Fernando Lima",
    email: "fernando.lima@mundorastro.com",
    telefone: "(34) 99999-6666",
    cargo: "Motorista",
    perfil: "operador",
    ultimoAcesso: "2024-01-05T09:00:00",
    status: "inativo",
  },
];

const statusColors: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-600 border-green-500/20",
  inativo: "bg-red-500/10 text-red-600 border-red-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const perfilColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  gerente: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  tecnico: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  operador: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  financeiro: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
};

const Usuarios = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar usuário..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {mockUsuarios.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {user.nome.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.nome}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.cargo}</p>
                  </div>
                </div>
                <Badge className={statusColors[user.status]} variant="outline">
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>{user.telefone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge className={perfilColors[user.perfil]} variant="outline">
                  {user.perfil}
                </Badge>
              </div>
              <div className="pt-2 border-t flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Último acesso: {new Date(user.ultimoAcesso).toLocaleString('pt-BR')}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
