import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { listUsuarios } from "@/services/usuarios";
import {
  Users,
  Search,
  Mail,
  Phone,
  Shield,
  Calendar,
  UserPlus,
} from "lucide-react";

const statusColors: Record<string, string> = {
  ativo: "bg-green-500/10 text-green-600 border-green-500/20",
  inativo: "bg-red-500/10 text-red-600 border-red-500/20",
};

const roleLabels: Record<string, string> = {
  admin: "Administrador",
  manager: "Gerente",
  operator: "Operador",
};

const perfilColors: Record<string, string> = {
  admin: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  manager: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  operator: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

const getInitials = (name: string | null, email: string | null) => {
  const source = name || email || "Usuário";
  return source
    .split(/[ .@_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const Usuarios = () => {
  const [search, setSearch] = useState("");
  const { data: usuarios = [], isLoading, isError } = useQuery({
    queryKey: ["usuarios"],
    queryFn: listUsuarios,
  });

  const filteredUsuarios = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return usuarios;

    return usuarios.filter((user) =>
      [user.full_name, user.email, user.phone, user.cargo, user.role, user.status]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [search, usuarios]);

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Usuários
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie os usuários do sistema
          </p>
        </div>
        <Button variant="outline" className="gap-2" disabled>
          <UserPlus className="h-4 w-4" />
          Criar via Supabase Auth
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar usuário..."
          className="pl-9 h-10"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {isLoading && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Carregando usuários...
          </CardContent>
        </Card>
      )}

      {isError && (
        <Card className="border-destructive/30">
          <CardContent className="p-8 text-center text-destructive">
            Não foi possível carregar os usuários. Um usuário comum vê apenas o próprio perfil; administradores veem todos.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filteredUsuarios.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-muted-foreground">
            Nenhum usuário encontrado.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredUsuarios.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getInitials(user.full_name, user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="text-lg truncate">
                      {user.full_name || "Usuário sem nome"}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.cargo || "Cargo não informado"}
                    </p>
                  </div>
                </div>
                <Badge className={statusColors[user.status]} variant="outline">
                  {user.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate">{user.email || "E-mail não informado"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span>{user.phone || "Telefone não informado"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <Badge
                  className={perfilColors[user.role || ""] || "bg-muted text-muted-foreground"}
                  variant="outline"
                >
                  {user.role ? roleLabels[user.role] : "Sem papel"}
                </Badge>
              </div>
              <div className="pt-2 border-t flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Cadastro: {new Date(user.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Usuarios;
