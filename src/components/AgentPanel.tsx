import { Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap } from "lucide-react";
import { AgentStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap,
};

const statusColors: Record<string, string> = {
  active: "bg-agent-active",
  working: "bg-agent-working animate-pulse-glow",
  idle: "bg-agent-idle",
  error: "bg-agent-error",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  working: "Processing",
  idle: "Idle",
  error: "Error",
};

interface AgentPanelProps {
  agents: AgentStatus[];
  collapsed?: boolean;
}

export function AgentPanel({ agents, collapsed = false }: AgentPanelProps) {
  return (
    <aside className={cn(
      "border-r border-border bg-sidebar flex flex-col transition-all duration-300 shrink-0",
      collapsed ? "w-14" : "w-72"
    )}>
      <div className="p-3 border-b border-border">
        {!collapsed && (
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Agent Activity
          </h2>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {agents.map((agent) => {
          const Icon = iconMap[agent.icon] || Target;
          return (
            <div
              key={agent.id}
              className={cn(
                "rounded-md p-2 hover:bg-sidebar-accent transition-colors cursor-pointer group",
                agent.status === "working" && "bg-sidebar-accent"
              )}
            >
              <div className="flex items-center gap-2">
                <div className="relative shrink-0">
                  <Icon className="h-4 w-4 text-sidebar-foreground" />
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full",
                    statusColors[agent.status]
                  )} />
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-sidebar-accent-foreground truncate">
                        {agent.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {statusLabels[agent.status]}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                      {agent.lastAction}
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && agent.status !== "idle" && (
                <div className="mt-1.5 ml-6">
                  <p className="text-[10px] text-primary/80">
                    Next: {agent.nextAction}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
