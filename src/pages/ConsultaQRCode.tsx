import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoteRastreabilidadeByCodigo } from "@/services/rastreabilidade";
import {
  QrCode,
  Search,
  Calendar,
  MapPin,
  Package,
  Leaf,
  FileText,
  Sprout,
} from "lucide-react";

const statusColors: Record<string, string> = {
  rastreado: "bg-green-500/10 text-green-600 border-green-500/20",
  "em trânsito": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  entregue: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pendente: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const ConsultaQRCode = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const codigoInicial = searchParams.get("codigo")?.trim().toUpperCase() || "";
  const [codigoConsulta, setCodigoConsulta] = useState(codigoInicial);
  const [codigoBuscado, setCodigoBuscado] = useState(codigoInicial);
  const [erro, setErro] = useState("");

  const { data: loteEncontrado, isFetching, isError } = useQuery({
    queryKey: ["consulta-qrcode", codigoBuscado],
    queryFn: () => getLoteRastreabilidadeByCodigo(codigoBuscado),
    enabled: Boolean(codigoBuscado),
  });

  useEffect(() => {
    if (codigoInicial) {
      setCodigoConsulta(codigoInicial);
      setCodigoBuscado(codigoInicial);
    }
  }, [codigoInicial]);

  const handleConsulta = () => {
    setErro("");
    const codigo = codigoConsulta.trim().toUpperCase();

    if (!codigo) {
      setErro("Digite um código de lote para consultar.");
      return;
    }

    setCodigoBuscado(codigo);
    setSearchParams({ codigo });
  };

  const origem = [
    loteEncontrado?.propriedades?.nome,
    loteEncontrado?.talhoes?.nome,
  ]
    .filter(Boolean)
    .join(" - ");

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
          <QrCode className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Consulta de Rastreabilidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Digite o código do lote para consultar a origem e os dados registrados do produto.
        </p>
      </div>

      <Card className="max-w-xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite o código do lote"
                className="pl-9 h-12"
                value={codigoConsulta}
                onChange={(event) => setCodigoConsulta(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleConsulta()}
              />
            </div>
            <Button onClick={handleConsulta} className="h-12 px-6" disabled={isFetching}>
              {isFetching ? "Consultando..." : "Consultar"}
            </Button>
          </div>
          {erro && <p className="text-destructive text-sm mt-3 text-center">{erro}</p>}
          {isError && (
            <p className="text-destructive text-sm mt-3 text-center">
              Não foi possível consultar o lote agora.
            </p>
          )}
          {codigoBuscado && !isFetching && !isError && loteEncontrado === null && (
            <p className="text-muted-foreground text-sm mt-3 text-center">
              Lote não encontrado. Verifique o código e tente novamente.
            </p>
          )}
        </CardContent>
      </Card>

      {loteEncontrado && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{loteEncontrado.produto}</CardTitle>
                    <p className="font-mono text-sm text-primary mt-1">
                      {loteEncontrado.codigo}
                    </p>
                  </div>
                </div>
                <Badge
                  className={statusColors[loteEncontrado.status || ""] || "bg-muted text-muted-foreground"}
                  variant="outline"
                >
                  {loteEncontrado.status || "sem status"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Origem</p>
                    <p className="text-sm text-muted-foreground">
                      {origem || "Origem não informada"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Sprout className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Safra</p>
                    <p className="text-sm text-muted-foreground">
                      {loteEncontrado.safras?.nome || "Safra não informada"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data de produção</p>
                    <p className="text-sm text-muted-foreground">
                      {loteEncontrado.data_producao
                        ? new Date(loteEncontrado.data_producao).toLocaleDateString("pt-BR")
                        : "Data não informada"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Quantidade</p>
                    <p className="text-sm text-muted-foreground">
                      {loteEncontrado.quantidade ?? 0} {loteEncontrado.unidade || ""}
                    </p>
                  </div>
                </div>
              </div>

              {loteEncontrado.observacoes && (
                <div className="flex items-start gap-3 p-4 rounded-lg border bg-card">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Observações</p>
                    <p className="text-sm text-muted-foreground">{loteEncontrado.observacoes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsultaQRCode;
