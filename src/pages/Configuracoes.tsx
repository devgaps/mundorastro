import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Mail,
  Smartphone,
  Save,
} from "lucide-react";

const Configuracoes = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Configurações
        </h1>
        <p className="text-muted-foreground mt-1">
          Personalize o sistema de acordo com suas necessidades
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Empresa */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <CardDescription>Informações básicas da organização</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="empresa">Nome da Empresa</Label>
              <Input id="empresa" defaultValue="Agropecuária Santa Maria Ltda" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input id="cnpj" defaultValue="12.345.678/0001-90" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" defaultValue="Rodovia SP-322, Km 315 - Ribeirão Preto, SP" />
            </div>
            <Button className="w-full gap-2">
              <Save className="h-4 w-4" />
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure alertas e avisos do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receba alertas importantes por e-mail</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Alertas de Manutenção</Label>
                <p className="text-sm text-muted-foreground">Avisos sobre manutenção de equipamentos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios Automáticos</Label>
                <p className="text-sm text-muted-foreground">Envio semanal de relatórios</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Push no Celular</Label>
                <p className="text-sm text-muted-foreground">Notificações no aplicativo móvel</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Segurança */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Autenticação em Duas Etapas</Label>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Sessão Automática</Label>
                <p className="text-sm text-muted-foreground">Manter conectado por 30 dias</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>Alterar Senha</Label>
              <div className="flex gap-2">
                <Input type="password" placeholder="Nova senha" className="flex-1" />
                <Button variant="outline">Alterar</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Aparência */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize a interface do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">Alterne entre tema claro e escuro</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Menu Compacto</Label>
                <p className="text-sm text-muted-foreground">Reduz o tamanho do menu lateral</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">Habilitar transições animadas</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Integrações */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Integrações
            </CardTitle>
            <CardDescription>Conecte com outros sistemas e serviços</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-green-500/10">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">E-mail SMTP</p>
                      <p className="text-sm text-muted-foreground">Conectado</p>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-blue-500/10">
                      <Smartphone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">App Mobile</p>
                      <p className="text-sm text-muted-foreground">Conectado</p>
                    </div>
                    <Button variant="outline" size="sm">Configurar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-2 border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <Settings className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">API Externa</p>
                      <p className="text-sm text-muted-foreground">Não configurado</p>
                    </div>
                    <Button variant="outline" size="sm">Conectar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
