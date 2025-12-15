import { useState } from "react";
import { PropertyCard } from "@/components/dashboard/PropertyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allProperties = [
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
  {
    id: "5",
    name: "Fazenda Bom Jesus",
    location: "Lucas do Rio Verde, MT",
    area: 3200,
    mainCrop: "Soja",
    status: "active" as const,
  },
  {
    id: "6",
    name: "Chácara Vista Alegre",
    location: "Campinas, SP",
    area: 12,
    mainCrop: "Hortaliças",
    status: "inactive" as const,
  },
  {
    id: "7",
    name: "Fazenda São Pedro",
    location: "Sorriso, MT",
    area: 1800,
    mainCrop: "Milho",
    status: "active" as const,
  },
  {
    id: "8",
    name: "Fazenda Primavera",
    location: "Cristalina, GO",
    area: 950,
    mainCrop: "Feijão",
    status: "pending" as const,
  },
];

const Propriedades = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProperties = allProperties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="animate-fade-in">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Propriedades Rurais
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas propriedades e áreas de cultivo
          </p>
        </div>
        <Button variant="hero" className="gap-2 w-fit animate-fade-in">
          <Plus className="h-4 w-4" />
          Nova Propriedade
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-slide-up">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou localização..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredProperties.length} propriedades
          </span>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              )}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      {filteredProperties.length > 0 ? (
        <div
          className={cn(
            "grid gap-4 lg:gap-6",
            viewMode === "grid"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}
        >
          {filteredProperties.map((property, index) => (
            <div
              key={property.id}
              className="animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
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
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
          <div className="rounded-full bg-muted p-4 mb-4">
            <MapPin className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Nenhuma propriedade encontrada
          </h3>
          <p className="text-muted-foreground max-w-sm">
            Tente ajustar os filtros ou adicione uma nova propriedade ao sistema.
          </p>
          <Button variant="hero" className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Adicionar Propriedade
          </Button>
        </div>
      )}
    </div>
  );
};

export default Propriedades;
