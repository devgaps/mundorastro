import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AuthProvider } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Propriedades from "./pages/Propriedades";
import Talhoes from "./pages/Talhoes";
import Equipamentos from "./pages/Equipamentos";
import CadernoDeCampo from "./pages/CadernoDeCampo";
import Safras from "./pages/Safras";
import Producao from "./pages/Producao";
import Rastreabilidade from "./pages/Rastreabilidade";
import ConsultaQRCode from "./pages/ConsultaQRCode";
import Expedicao from "./pages/Expedicao";
import Etiquetas from "./pages/Etiquetas";
import Estoque from "./pages/Estoque";
import Compras from "./pages/Compras";
import Financeiro from "./pages/Financeiro";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Documentos from "./pages/Documentos";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/consulta-qrcode" element={<ConsultaQRCode />} />
          
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected routes with sidebar layout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/propriedades" element={<Propriedades />} />
            <Route path="/talhoes" element={<Talhoes />} />
            <Route path="/equipamentos" element={<Equipamentos />} />
            <Route path="/caderno-de-campo" element={<CadernoDeCampo />} />
            <Route path="/safras" element={<Safras />} />
            <Route path="/producao" element={<Producao />} />
            <Route path="/rastreabilidade" element={<Rastreabilidade />} />
            <Route path="/expedicao" element={<Expedicao />} />
            <Route path="/etiquetas" element={<Etiquetas />} />
            <Route path="/estoque" element={<Estoque />} />
            <Route path="/compras" element={<Compras />} />
            <Route path="/financeiro" element={<Financeiro />} />
            <Route path="/relatorios" element={<Relatorios />} />
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/documentos" element={<Documentos />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
          </Route>
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
