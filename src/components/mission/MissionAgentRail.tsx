import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { missionAgents, type MissionAgent, type AgentStatus } from "@/lib/mission-mock";

const statusDot: Record<AgentStatus, string> = {
  Active: "bg-emerald-500",
  Processing: "bg-indigo-500 animate-pulse",
  Idle: "bg-slate-300",
  Blocked: "bg-rose-500",
};
const statusPill: Record<AgentStatus, string> = {
  Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Processing: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Idle: "bg-slate-100 text-slate-600 border-slate-200",
  Blocked: "bg-rose-50 text-rose-700 border-rose-200",
};

export function MissionAgentRail() {
  const [selected, setSelected] = useState<MissionAgent | null>(null);
  const activeCount = missionAgents.filter((a) => a.status !== "Idle").length;

  return (
    <aside className="w-72 shrink-0 border-r border-border bg-card/50 hidden lg:flex flex-col">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Agent Activity ({activeCount}/{missionAgents.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {missionAgents.map((agent) => {
          const Icon = agent.icon;
          return (
            <button
              key={agent.id}
              onClick={() => setSelected(agent)}
              className="w-full text-left rounded-lg p-2.5 hover:bg-secondary transition-colors group"
            >
              <div className="flex items-start gap-2.5">
                <div className="relative shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <span className={cn("absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-card", statusDot[agent.status])} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-foreground truncate">{agent.name}</span>
                    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full border", statusPill[agent.status])}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{agent.summary}</p>
                  <p className="text-[11px] text-primary/80 mt-1 truncate">Next: {agent.next}</p>
                  {agent.status === "Processing" && (
                    <div className="mt-1.5 h-1 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full w-1/2 bg-primary animate-pulse rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <Sheet open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <SheetContent className="w-[420px] sm:max-w-md overflow-y-auto">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <selected.icon className="h-5 w-5 text-primary" />
                  {selected.name}
                </SheetTitle>
                <SheetDescription>{selected.summary}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-5 text-sm">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full border", statusPill[selected.status])}>{selected.status}</span>
                  <span className="text-xs text-muted-foreground">Confidence {selected.confidence}%</span>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Recent actions</h4>
                  <ul className="space-y-2">
                    {selected.recent.length === 0 && <li className="text-xs text-muted-foreground">No recent activity.</li>}
                    {selected.recent.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs">
                        <span className="text-muted-foreground min-w-16">{r.time}</span>
                        <span className="text-foreground">{r.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Source data</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.sources.map((s) => (
                      <span key={s} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-foreground">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Dependencies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selected.dependencies.map((d) => (
                      <span key={d} className="text-[11px] px-2 py-0.5 rounded-full border border-border">{d}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Next action</h4>
                  <p className="text-sm text-primary">{selected.next}</p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </aside>
  );
}
