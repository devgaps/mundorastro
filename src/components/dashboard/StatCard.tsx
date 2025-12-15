import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning";
  className?: string;
}

export const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) => {
  const variants = {
    default: {
      bg: "bg-card",
      iconBg: "bg-muted",
      iconColor: "text-muted-foreground",
    },
    primary: {
      bg: "bg-card",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    success: {
      bg: "bg-card",
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
    warning: {
      bg: "bg-card",
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
  };

  const styles = variants[variant];

  return (
    <div
      className={cn(
        "rounded-xl border p-6 shadow-card transition-all duration-300 hover:shadow-card-hover",
        styles.bg,
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={cn(
                  "font-medium",
                  trend.isPositive ? "text-success" : "text-destructive"
                )}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-muted-foreground">vs. mês anterior</span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "rounded-xl p-3",
            styles.iconBg
          )}
        >
          <Icon className={cn("h-6 w-6", styles.iconColor)} />
        </div>
      </div>
    </div>
  );
};
