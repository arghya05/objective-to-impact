import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
}

export function KPICard({ label, value, change, trend }: KPICardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 card-elevated hover:shadow-lg transition-shadow">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-2">{label}</p>
      <p className="text-2xl font-bold text-foreground font-display">{value}</p>
      {change && (
        <div className={cn(
          "flex items-center gap-1 mt-2 text-xs font-medium",
          trend === "up" && "text-success",
          trend === "down" && label.includes("CAC") ? "text-success" : trend === "down" ? "text-destructive" : "",
          trend === "neutral" && "text-muted-foreground"
        )}>
          {trend === "up" && <ArrowUp className="h-3 w-3" />}
          {trend === "down" && <ArrowDown className="h-3 w-3" />}
          {trend === "neutral" && <Minus className="h-3 w-3" />}
          <span>{change}</span>
        </div>
      )}
    </div>
  );
}
