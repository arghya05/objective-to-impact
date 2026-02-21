import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "draft" | "active" | "paused" | "completed";
}

const statusStyles: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  completed: "bg-primary/10 text-primary",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide",
      statusStyles[status]
    )}>
      <span className={cn(
        "h-1.5 w-1.5 rounded-full",
        status === "active" && "bg-success",
        status === "draft" && "bg-muted-foreground",
        status === "paused" && "bg-warning",
        status === "completed" && "bg-primary",
      )} />
      {status}
    </span>
  );
}
