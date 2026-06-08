import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  defaultEmpresaConfig,
  defaultIntegracoesConfig,
  defaultPreferenciasConfig,
  type EmpresaConfig,
  type IntegracoesConfig,
  listConfiguracoes,
  type PreferenciasConfig,
  saveConfiguracao,
} from "@/services/configuracoes";
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

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const Configuracoes = () => {
  const [empresa, setEmpresa] = useState<EmpresaConfig>(defaultEmpresaConfig);
  const [preferencias, setPreferencias] = useState<PreferenciasConfig>(defaultPreferenciasConfig);
  const [integracoes, setIntegracoes] = useState<IntegracoesConfig>(defaultIntegracoesConfig);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: configuracoes = [], isLoading } = useQuery({
    queryKey: ["configuracoes"],
    queryFn: listConfiguracoes,
  });

  const configByKey = useMemo(
    () => new Map(configuracoes.map((config) => [config.chave, config.valor])),
    [configuracoes],
  );

  useEffect(() => {
    const empresaValor = configByKey.get("empresa");
    const preferenciasValor = configByKey.get("preferencias");
    const integracoesValor = configByKey.get("integracoes");

    if (isRecord(empresaValor)) {
      setEmpresa({ ...defaultEmpresaConfig, ...empresaValor } as EmpresaConfig);
    }
    if (isRecord(preferenciasValor)) {
      setPreferencias({ ...defaultPreferenciasConfig, ...preferenciasValor } as PreferenciasConfig);
    }
    if (isRecord(integracoesValor)) {
      setIntegracoes({ ...defaultIntegracoesConfig, ...integracoesValor } as IntegracoesConfig);
    }
  }, [configByKey]);

  const mutation = useMutation({
    mutationFn: async () => {
      await Promise.all([
        saveConfiguracao("empresa", empresa),
        saveConfiguracao("preferencias", preferencias),
        saveConfiguracao("integracoes", integracoes),
      ]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["configuracoes"] });
      toast({
        title: "Configurações salvas",
        description: "As preferências foram atualizadas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro ao salvar configurações",
        description: error instanceof Error ? error.message : "Tente novamente em instantes.",
        variant: "destructive",
      });
    },
  });

  const updatePreferencia = (key: keyof PreferenciasConfig, value: boolean) => {
    setPreferencias((current) => ({ ...current, [key]: value }));
  };

  const updateIntegracao = (key: keyof IntegracoesConfig, value: boolean) => {
    setIntegracoes((current) => ({ ...current, [key]: value }));
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Configurações
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalize o sistema de acordo com suas necessidades
          </p>
        </div>
        <Button className="gap-2" onClick={() => mutation.mutate()} disabled={mutation.isPending || isLoading}>
          <Save className="h-4 w-4" />
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
              <Input
                id="empresa"
                value={empresa.nome}
                onChange={(event) => setEmpresa((current) => ({ ...current, nome: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ</Label>
              <Input
                id="cnpj"
                value={empresa.cnpj}
                onChange={(event) => setEmpresa((current) => ({ ...current, cnpj: event.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                value={empresa.endereco}
                onChange={(event) =>
                  setEmpresa((current) => ({ ...current, endereco: event.target.value }))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </CardTitle>
            <CardDescription>Configure alertas e avisos do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Notificações por E-mail</Label>
                <p className="text-sm text-muted-foreground">Receba alertas importantes por e-mail</p>
              </div>
              <Switch
                checked={preferencias.email}
                onCheckedChange={(value) => updatePreferencia("email", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Alertas de Manutenção</Label>
                <p className="text-sm text-muted-foreground">Avisos sobre manutenção de equipamentos</p>
              </div>
              <Switch
                checked={preferencias.manutencao}
                onCheckedChange={(value) => updatePreferencia("manutencao", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Relatórios Automáticos</Label>
                <p className="text-sm text-muted-foreground">Envio semanal de relatórios</p>
              </div>
              <Switch
                checked={preferencias.relatorios}
                onCheckedChange={(value) => updatePreferencia("relatorios", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Push no Celular</Label>
                <p className="text-sm text-muted-foreground">Notificações no aplicativo móvel</p>
              </div>
              <Switch
                checked={preferencias.push}
                onCheckedChange={(value) => updatePreferencia("push", value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Segurança
            </CardTitle>
            <CardDescription>Configurações de segurança da conta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Autenticação em Duas Etapas</Label>
                <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
              </div>
              <Switch
                checked={preferencias.doisFatores}
                onCheckedChange={(value) => updatePreferencia("doisFatores", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Sessão Automática</Label>
                <p className="text-sm text-muted-foreground">Manter conectado por 30 dias</p>
              </div>
              <Switch
                checked={preferencias.sessaoAutomatica}
                onCheckedChange={(value) => updatePreferencia("sessaoAutomatica", value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Alterar Senha</Label>
              <div className="flex gap-2">
                <Input type="password" placeholder="Nova senha" className="flex-1" />
                <Button variant="outline" disabled>
                  Alterar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Aparência
            </CardTitle>
            <CardDescription>Personalize a interface do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-muted-foreground">Alterne entre tema claro e escuro</p>
              </div>
              <Switch
                checked={preferencias.modoEscuro}
                onCheckedChange={(value) => updatePreferencia("modoEscuro", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Menu Compacto</Label>
                <p className="text-sm text-muted-foreground">Reduz o tamanho do menu lateral</p>
              </div>
              <Switch
                checked={preferencias.menuCompacto}
                onCheckedChange={(value) => updatePreferencia("menuCompacto", value)}
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label>Animações</Label>
                <p className="text-sm text-muted-foreground">Habilitar transições animadas</p>
              </div>
              <Switch
                checked={preferencias.animacoes}
                onCheckedChange={(value) => updatePreferencia("animacoes", value)}
              />
            </div>
          </CardContent>
        </Card>

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
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-500/10">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">E-mail SMTP</p>
                    <p className="text-sm text-muted-foreground">
                      {integracoes.smtp ? "Conectado" : "Não configurado"}
                    </p>
                  </div>
                  <Switch
                    checked={integracoes.smtp}
                    onCheckedChange={(value) => updateIntegracao("smtp", value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-blue-500/10">
                    <Smartphone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">App Mobile</p>
                    <p className="text-sm text-muted-foreground">
                      {integracoes.mobile ? "Conectado" : "Não configurado"}
                    </p>
                  </div>
                  <Switch
                    checked={integracoes.mobile}
                    onCheckedChange={(value) => updateIntegracao("mobile", value)}
                  />
                </div>
              </div>
              <div className="rounded-lg border border-dashed p-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Settings className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">API Externa</p>
                    <p className="text-sm text-muted-foreground">
                      {integracoes.apiExterna ? "Conectado" : "Não configurado"}
                    </p>
                  </div>
                  <Switch
                    checked={integracoes.apiExterna}
                    onCheckedChange={(value) => updateIntegracao("apiExterna", value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Configuracoes;
