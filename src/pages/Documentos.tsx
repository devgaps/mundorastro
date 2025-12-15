import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Plus,
  Filter,
  Search,
  Calendar,
  Download,
  Eye,
  Folder,
  File,
  FileSpreadsheet,
  FileImage,
} from "lucide-react";

const mockDocumentos = [
  {
    id: "1",
    nome: "Certificado Orgânico 2024",
    tipo: "Certificação",
    formato: "PDF",
    tamanho: "2.4 MB",
    dataUpload: "2024-01-10",
    propriedade: "Fazenda Santa Maria",
    status: "válido",
  },
  {
    id: "2",
    nome: "Contrato Cooperativa Central",
    tipo: "Contrato",
    formato: "PDF",
    tamanho: "1.8 MB",
    dataUpload: "2024-01-05",
    propriedade: "Todas",
    status: "válido",
  },
  {
    id: "3",
    nome: "Análise de Solo - Talhão A1",
    tipo: "Laudo",
    formato: "PDF",
    tamanho: "856 KB",
    dataUpload: "2023-12-15",
    propriedade: "Fazenda Santa Maria",
    status: "válido",
  },
  {
    id: "4",
    nome: "Planilha de Custos 2023",
    tipo: "Financeiro",
    formato: "Excel",
    tamanho: "3.2 MB",
    dataUpload: "2024-01-08",
    propriedade: "Todas",
    status: "válido",
  },
  {
    id: "5",
    nome: "Mapa de Propriedade",
    tipo: "Mapa",
    formato: "Imagem",
    tamanho: "5.1 MB",
    dataUpload: "2023-11-20",
    propriedade: "Fazenda Boa Vista",
    status: "válido",
  },
  {
    id: "6",
    nome: "CAR - Cadastro Ambiental Rural",
    tipo: "Documento Legal",
    formato: "PDF",
    tamanho: "1.2 MB",
    dataUpload: "2023-06-10",
    propriedade: "Fazenda Nova Esperança",
    status: "expirado",
  },
  {
    id: "7",
    nome: "Receituário Agronômico",
    tipo: "Receituário",
    formato: "PDF",
    tamanho: "420 KB",
    dataUpload: "2024-01-12",
    propriedade: "Sítio São José",
    status: "válido",
  },
  {
    id: "8",
    nome: "Manual Equipamentos",
    tipo: "Manual",
    formato: "PDF",
    tamanho: "8.7 MB",
    dataUpload: "2023-08-01",
    propriedade: "Todas",
    status: "válido",
  },
];

const statusColors: Record<string, string> = {
  válido: "bg-green-500/10 text-green-600 border-green-500/20",
  expirado: "bg-red-500/10 text-red-600 border-red-500/20",
  pendente: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
};

const formatIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  Excel: FileSpreadsheet,
  Imagem: FileImage,
};

const Documentos = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Documentos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie documentos e certificações
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <Folder className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-muted-foreground">PDFs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">34</p>
                <p className="text-xs text-muted-foreground">Planilhas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <div className="flex items-center gap-3">
              <FileImage className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">33</p>
                <p className="text-xs text-muted-foreground">Imagens</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar documento..." className="pl-9 h-10" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
        {mockDocumentos.map((doc) => {
          const IconComponent = formatIcons[doc.formato] || File;
          return (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <Badge className={statusColors[doc.status]} variant="outline">
                    {doc.status}
                  </Badge>
                </div>
                <CardTitle className="text-base mt-2 line-clamp-2">{doc.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>{doc.tipo}</span>
                  <span>{doc.tamanho}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{doc.propriedade}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(doc.dataUpload).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="pt-2 border-t flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-1">
                    <Eye className="h-4 w-4" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Documentos;
