import { StatCard } from "@/components/dashboard/StatCard";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Wheat,
  TrendingUp,
  Users,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const mockProperties = [
  {
    id: "1",
    name: "Fazenda Santa Maria",
    location: "Ribeirão Preto, SP",
    area: 1250,
    mainCrop: "Soja",
    status: "active" as const,
  },
  {
    id: "2",
    name: "Fazenda Boa Vista",
    location: "Uberaba, MG",
    area: 890,
    mainCrop: "Milho",
    status: "active" as const,
  },
  {
    id: "3",
    name: "Sítio São José",
    location: "Piracicaba, SP",
    area: 45,
    mainCrop: "Café",
    status: "pending" as const,
  },
  {
    id: "4",
    name: "Fazenda Nova Esperança",
    location: "Rio Verde, GO",
    area: 2100,
    mainCrop: "Algodão",
    status: "active" as const,
  },
];

const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Painel de Controle
          </h1>
          <p className="text-muted-foreground mt-1">
            Bem-vindo ao Sistema de Gestão Rural
          </p>
        </div>
        <div className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          <Button variant="hero" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Propriedade
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div className="animate-slide-up" style={{ animationDelay: "0ms" }}>
          <StatCard
            title="Total de Propriedades"
            value="12"
            subtitle="4 estados"
            icon={MapPin}
            variant="primary"
            trend={{ value: 8.5, isPositive: true }}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "50ms" }}>
          <StatCard
            title="Área Total"
            value="4.285"
            subtitle="hectares cadastrados"
            icon={Wheat}
            variant="success"
            trend={{ value: 12.3, isPositive: true }}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "100ms" }}>
          <StatCard
            title="Produtividade Média"
            value="62.4"
            subtitle="sacas/hectare"
            icon={TrendingUp}
            variant="warning"
            trend={{ value: 3.2, isPositive: true }}
          />
        </div>
        <div className="animate-slide-up" style={{ animationDelay: "150ms" }}>
          <StatCard
            title="Produtores Ativos"
            value="28"
            subtitle="colaboradores"
            icon={Users}
            variant="default"
          />
        </div>
      </div>

      {/* Properties Section */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-foreground">
            Propriedades Recentes
          </h2>
          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar propriedade..."
              className="pl-9 h-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
          {mockProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${200 + index * 50}ms` }}
            >
              <PropertyCard
                name={property.name}
                location={property.location}
                area={property.area}
                mainCrop={property.mainCrop}
                status={property.status}
                onClick={() => console.log("View property:", property.id)}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" className="gap-2">
            Ver todas as propriedades
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
