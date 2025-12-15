import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "full" | "icon";
}

export const Logo = ({ className, size = "md", variant = "full" }: LogoProps) => {
  const sizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-14",
  };

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Leaf Icon */}
      <div className={cn("relative", sizes[size])}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className={cn("h-full w-auto")}
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Three leaves forming a circular pattern */}
          <path
            d="M24 4C24 4 32 12 32 20C32 24.4183 28.4183 28 24 28C19.5817 28 16 24.4183 16 20C16 12 24 4 24 4Z"
            className="fill-primary"
          />
          <path
            d="M10 24C10 24 6 34 12 40C15.1421 43.1421 20.1421 43.1421 23.2843 40C26.4264 36.8579 26.4264 31.8579 23.2843 28.7157C17.2843 22.7157 10 24 10 24Z"
            className="fill-primary/80"
          />
          <path
            d="M38 24C38 24 42 34 36 40C32.8579 43.1421 27.8579 43.1421 24.7157 40C21.5736 36.8579 21.5736 31.8579 24.7157 28.7157C30.7157 22.7157 38 24 38 24Z"
            className="fill-primary/60"
          />
          {/* Center circle */}
          <circle cx="24" cy="28" r="4" className="fill-background" />
        </svg>
      </div>

      {variant === "full" && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold tracking-tight text-foreground leading-none",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}>
            SGRV
          </span>
          <span className={cn(
            "text-muted-foreground leading-none",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm"
          )}>
            Sistema de Gestão Rural
          </span>
        </div>
      )}
    </div>
  );
};
