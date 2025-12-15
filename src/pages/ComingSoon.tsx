import { useLocation } from "react-router-dom";
import { Construction, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const pageNames: Record<string, string> = {
  "/producao": "Produção",
  "/equipamentos": "Equipamentos",
  "/relatorios": "Relatórios",
  "/usuarios": "Usuários",
  "/documentos": "Documentos",
  "/configuracoes": "Configurações",
};

const ComingSoon = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pageName = pageNames[location.pathname] || "Esta página";

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center animate-fade-in">
      <div className="rounded-full bg-primary/10 p-6 mb-6">
        <Construction className="h-12 w-12 text-primary" />
      </div>
      <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
        {pageName}
      </h1>
      <p className="text-muted-foreground max-w-md mb-8">
        Esta funcionalidade está em desenvolvimento. Em breve você poderá
        acessar todas as ferramentas de gestão rural.
      </p>
      <Button variant="outline" className="gap-2" onClick={() => navigate("/dashboard")}>
        <ArrowLeft className="h-4 w-4" />
        Voltar ao Dashboard
      </Button>
    </div>
  );
};

export default ComingSoon;
