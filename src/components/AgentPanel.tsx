import { Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap, Brain, UserCheck, FlaskConical, Search } from "lucide-react";
import { AgentStatus } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { useState } from "react";

const iconMap: Record<string, React.ElementType> = {
  Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap, Brain, UserCheck, FlaskConical, Search,
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
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  return (
    <aside className={cn(
      "border-r border-border bg-card flex flex-col transition-all duration-300 shrink-0",
      collapsed ? "w-14" : "w-72"
    )}>
      <div className="p-4 border-b border-border">
        {!collapsed && (
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Agent Activity ({agents.filter(a => a.status !== "idle").length}/{agents.length})
          </h2>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {agents.map((agent) => {
          const Icon = iconMap[agent.icon] || Target;
          const isExpanded = expandedAgent === agent.id;
          return (
            <div
              key={agent.id}
              className={cn(
                "rounded-lg p-2.5 hover:bg-secondary transition-all cursor-pointer group",
                agent.status === "working" && "bg-primary/5"
              )}
              onClick={() => !collapsed && setExpandedAgent(isExpanded ? null : agent.id)}
            >
              <div className="flex items-center gap-2.5">
                <div className="relative shrink-0">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    agent.status === "working" ? "bg-primary/10" : "bg-secondary"
                  )}>
                    <Icon className={cn(
                      "h-4 w-4",
                      agent.status === "working" ? "text-primary" : "text-muted-foreground"
                    )} />
                  </div>
                  <span className={cn(
                    "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card",
                    statusColors[agent.status]
                  )} />
                </div>
                {!collapsed && (
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground truncate">
                        {agent.name}
                      </span>
                      <span className={cn(
                        "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                        agent.status === "active" && "bg-success/10 text-success",
                        agent.status === "working" && "bg-primary/10 text-primary",
                        agent.status === "idle" && "text-muted-foreground",
                        agent.status === "error" && "bg-destructive/10 text-destructive",
                      )}>
                        {statusLabels[agent.status]}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                      {agent.lastAction}
                    </p>
                  </div>
                )}
              </div>
              {!collapsed && agent.status !== "idle" && (
                <div className="mt-1.5 ml-10">
                  <p className="text-[11px] text-primary/70">
                    Next: {agent.nextAction}
                  </p>
                </div>
              )}
              {!collapsed && isExpanded && agent.reasoning && (
                <div className="mt-2 ml-10 bg-primary/5 border border-primary/10 rounded-lg p-2.5">
                  <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-1">Reasoning</p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{agent.reasoning}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
