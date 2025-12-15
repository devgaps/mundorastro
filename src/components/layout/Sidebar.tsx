import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/Logo";
import {
  LayoutDashboard,
  MapPin,
  Users,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  Wheat,
  Tractor,
  BarChart3,
  BookOpen,
  Grid3X3,
  Sprout,
  DollarSign,
  QrCode,
  Truck,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

const mainNavItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Propriedades", icon: MapPin, href: "/propriedades" },
  { label: "Talhões", icon: Grid3X3, href: "/talhoes" },
  { label: "Caderno de Campo", icon: BookOpen, href: "/caderno-de-campo" },
  { label: "Safras", icon: Sprout, href: "/safras" },
  { label: "Produção", icon: Wheat, href: "/producao" },
  { label: "Rastreabilidade", icon: QrCode, href: "/rastreabilidade" },
  { label: "Expedição", icon: Truck, href: "/expedicao" },
  { label: "Etiquetas", icon: Tag, href: "/etiquetas" },
  { label: "Equipamentos", icon: Tractor, href: "/equipamentos" },
  { label: "Financeiro", icon: DollarSign, href: "/financeiro" },
  { label: "Relatórios", icon: BarChart3, href: "/relatorios" },
];

const secondaryNavItems: NavItem[] = [
  { label: "Usuários", icon: Users, href: "/usuarios" },
  { label: "Documentos", icon: FileText, href: "/documentos" },
  { label: "Configurações", icon: Settings, href: "/configuracoes" },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.href;
    const Icon = item.icon;

    return (
      <NavLink
        to={item.href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
        )}
      >
        <Icon className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
        {!collapsed && (
          <span className="text-sm font-medium truncate">{item.label}</span>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar flex flex-col border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-sidebar-border">
        {!collapsed && <Logo variant="full" size="sm" className="text-sidebar-foreground [&_span]:text-sidebar-foreground [&_.text-muted-foreground]:text-sidebar-foreground/60" />}
        {collapsed && <Logo variant="icon" size="sm" className="mx-auto" />}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <Menu className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="space-y-1">
          {mainNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>

        {/* Divider */}
        <div className="my-4 border-t border-sidebar-border" />

        <div className="space-y-1">
          {!collapsed && (
            <span className="px-3 text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-wider">
              Sistema
            </span>
          )}
          {secondaryNavItems.map((item) => (
            <NavItemComponent key={item.href} item={item} />
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/login"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
            "text-sidebar-foreground/70 hover:bg-destructive/10 hover:text-destructive"
          )}
        >
          <LogOut className={cn("h-5 w-5 shrink-0", collapsed && "mx-auto")} />
          {!collapsed && <span className="text-sm font-medium">Sair</span>}
        </NavLink>
      </div>
    </aside>
  );
};
