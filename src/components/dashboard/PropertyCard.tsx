import { MapPin, ChevronRight, Ruler, Wheat } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  name: string;
  location: string;
  area: number;
  mainCrop: string;
  status: "active" | "inactive" | "pending";
  imageUrl?: string;
  onClick?: () => void;
}

export const PropertyCard = ({
  name,
  location,
  area,
  mainCrop,
  status,
  imageUrl,
  onClick,
}: PropertyCardProps) => {
  const statusConfig = {
    active: {
      label: "Ativa",
      className: "bg-success/10 text-success",
    },
    inactive: {
      label: "Inativa",
      className: "bg-muted text-muted-foreground",
    },
    pending: {
      label: "Pendente",
      className: "bg-warning/10 text-warning",
    },
  };

  const statusStyle = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "group rounded-xl border bg-card overflow-hidden shadow-card transition-all duration-300 hover:shadow-card-hover cursor-pointer"
      )}
    >
      {/* Image */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <MapPin className="h-12 w-12 text-primary/40" />
          </div>
        )}
        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium",
              statusStyle.className
            )}
          >
            {statusStyle.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{location}</span>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 pt-2 border-t border-border">
          <div className="flex items-center gap-1.5 text-sm">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{area}</span>
            <span className="text-muted-foreground">ha</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Wheat className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{mainCrop}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
