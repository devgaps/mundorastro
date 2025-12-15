import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QrCode,
  Search,
  Calendar,
  MapPin,
  Package,
  ArrowRight,
  Truck,
  Leaf,
  CheckCircle,
  Clock,
  User,
  FileText,
  Thermometer,
  Droplets,
} from "lucide-react";

const mockLoteData = {
  "LOT-2024-001": {
    codigo: "LOT-2024-001",
    produto: "Soja",
    variedade: "BRS 284",
    origem: "Fazenda Santa Maria - Talhão A1",
    produtor: "João Silva",
    dataColheita: "2024-01-10",
    quantidade: 125.5,
    unidade: "toneladas",
    destino: "Porto Santos",
    certificacoes: ["Orgânico", "Fair Trade"],
    status: "rastreado",
    timeline: [
      { data: "2024-01-05", evento: "Início da Colheita", responsavel: "Carlos Mendes" },
      { data: "2024-01-10", evento: "Colheita Finalizada", responsavel: "Carlos Mendes" },
      { data: "2024-01-11", evento: "Armazenamento no Silo", responsavel: "Maria Santos" },
      { data: "2024-01-15", evento: "Expedição para Porto Santos", responsavel: "Pedro Lima" },
    ],
    qualidade: {
      umidade: "12.5%",
      impurezas: "0.8%",
      graosAvariados: "2.1%",
      proteina: "38.2%",
    },
  },
  "LOT-2024-002": {
    codigo: "LOT-2024-002",
    produto: "Milho",
    variedade: "AG 1051",
    origem: "Fazenda Boa Vista - Talhão B1",
    produtor: "Ana Costa",
    dataColheita: "2024-01-08",
    quantidade: 210.0,
    unidade: "toneladas",
    destino: "Cooperativa Central",
    certificacoes: ["RTRS"],
    status: "em trânsito",
    timeline: [
      { data: "2024-01-03", evento: "Início da Colheita", responsavel: "Roberto Alves" },
      { data: "2024-01-08", evento: "Colheita Finalizada", responsavel: "Roberto Alves" },
      { data: "2024-01-09", evento: "Secagem", responsavel: "Fernanda Lima" },
      { data: "2024-01-12", evento: "Em Trânsito", responsavel: "José Ferreira" },
    ],
    qualidade: {
      umidade: "13.0%",
      impurezas: "1.2%",
      graosAvariados: "1.8%",
      proteina: "9.5%",
    },
  },
  "LOT-2024-003": {
    codigo: "LOT-2024-003",
    produto: "Café Arábica",
    variedade: "Catuaí Vermelho",
    origem: "Sítio São José - Talhão C1",
    produtor: "Miguel Oliveira",
    dataColheita: "2024-01-06",
    quantidade: 320,
    unidade: "sacas",
    destino: "Exportação Europa",
    certificacoes: ["Rainforest Alliance", "UTZ"],
    status: "rastreado",
    timeline: [
      { data: "2024-01-01", evento: "Início da Colheita", responsavel: "Lucas Martins" },
      { data: "2024-01-06", evento: "Colheita Finalizada", responsavel: "Lucas Martins" },
      { data: "2024-01-07", evento: "Secagem em Terreiro", responsavel: "Clara Souza" },
      { data: "2024-01-10", evento: "Beneficiamento", responsavel: "Rafael Costa" },
      { data: "2024-01-14", evento: "Expedição Internacional", responsavel: "Amanda Reis" },
    ],
    qualidade: {
      umidade: "11.0%",
      impurezas: "0.3%",
      graosAvariados: "0.5%",
      proteina: "-",
    },
  },
};

const statusColors: Record<string, string> = {
  rastreado: "bg-green-500/10 text-green-600 border-green-500/20",
  "em trânsito": "bg-blue-500/10 text-blue-600 border-blue-500/20",
  processando: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  entregue: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  pendente: "bg-orange-500/10 text-orange-600 border-orange-500/20",
};

const ConsultaQRCode = () => {
  const [codigoConsulta, setCodigoConsulta] = useState("");
  const [loteEncontrado, setLoteEncontrado] = useState<typeof mockLoteData["LOT-2024-001"] | null>(null);
  const [erro, setErro] = useState("");

  const handleConsulta = () => {
    setErro("");
    const codigo = codigoConsulta.trim().toUpperCase();
    
    if (!codigo) {
      setErro("Digite um código de lote para consultar");
      return;
    }

    const lote = mockLoteData[codigo as keyof typeof mockLoteData];
    
    if (lote) {
      setLoteEncontrado(lote);
    } else {
      setLoteEncontrado(null);
      setErro("Lote não encontrado. Verifique o código e tente novamente.");
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-primary/10 mb-4">
          <QrCode className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Consulta de Rastreabilidade
        </h1>
        <p className="text-muted-foreground mt-2">
          Escaneie o QR Code ou digite o código do lote para consultar a origem e toda a cadeia de rastreabilidade do produto
        </p>
      </div>

      {/* Search Box */}
      <Card className="max-w-xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Digite o código do lote (ex: LOT-2024-001)"
                className="pl-9 h-12"
                value={codigoConsulta}
                onChange={(e) => setCodigoConsulta(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConsulta()}
              />
            </div>
            <Button onClick={handleConsulta} className="h-12 px-6">
              Consultar
            </Button>
          </div>
          {erro && (
            <p className="text-destructive text-sm mt-3 text-center">{erro}</p>
          )}
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Códigos disponíveis para teste: LOT-2024-001, LOT-2024-002, LOT-2024-003
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      {loteEncontrado && (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Main Info */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-primary/10">
                    <Leaf className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{loteEncontrado.produto}</CardTitle>
                    <p className="text-muted-foreground">{loteEncontrado.variedade}</p>
                    <p className="font-mono text-sm text-primary mt-1">{loteEncontrado.codigo}</p>
                  </div>
                </div>
                <Badge className={statusColors[loteEncontrado.status]} variant="outline">
                  {loteEncontrado.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Origem</p>
                    <p className="text-sm text-muted-foreground">{loteEncontrado.origem}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <User className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Produtor</p>
                    <p className="text-sm text-muted-foreground">{loteEncontrado.produtor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Data da Colheita</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(loteEncontrado.dataColheita).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Package className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Quantidade</p>
                    <p className="text-sm text-muted-foreground">
                      {loteEncontrado.quantidade} {loteEncontrado.unidade}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <Truck className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Destino</p>
                    <p className="text-sm text-muted-foreground">{loteEncontrado.destino}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                  <FileText className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Certificações</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {loteEncontrado.certificacoes.map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quality Info */}
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Thermometer className="h-4 w-4" />
                  Análise de Qualidade
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                    <p className="text-xs text-muted-foreground">Umidade</p>
                    <p className="font-semibold">{loteEncontrado.qualidade.umidade}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-xs text-muted-foreground">Impurezas</p>
                    <p className="font-semibold">{loteEncontrado.qualidade.impurezas}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-xs text-muted-foreground">Grãos Avariados</p>
                    <p className="font-semibold">{loteEncontrado.qualidade.graosAvariados}</p>
                  </div>
                  <div className="p-3 rounded-lg border bg-card text-center">
                    <p className="text-xs text-muted-foreground">Proteína</p>
                    <p className="font-semibold">{loteEncontrado.qualidade.proteina}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Histórico de Rastreabilidade
                </h3>
                <div className="space-y-4">
                  {loteEncontrado.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="p-1.5 rounded-full bg-primary">
                          <CheckCircle className="h-3 w-3 text-primary-foreground" />
                        </div>
                        {index < loteEncontrado.timeline.length - 1 && (
                          <div className="w-0.5 h-full bg-border mt-1" />
                        )}
                      </div>
                      <div className="pb-4">
                        <p className="font-medium">{item.evento}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(item.data).toLocaleDateString("pt-BR")} • {item.responsavel}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConsultaQRCode;
