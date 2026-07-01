import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const missionSteps = [
  { id: 1, label: "Objective", agent: "Objective Agent" },
  { id: 2, label: "Data & Compliance", agent: "Data Readiness Agent" },
  { id: 3, label: "Audiences", agent: "Segmentation Agent" },
  { id: 4, label: "Creatives", agent: "Creative Agent" },
  { id: 5, label: "Channels & Budget", agent: "Media Mix Agent" },
  { id: 6, label: "Launch & Deploy", agent: "Deployment Agent" },
];

interface Props {
  current: number;
  blocked: number[];
  onChange: (step: number) => void;
}

export function MissionStepper({ current, blocked, onChange }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-stretch gap-2 overflow-x-auto">
        {missionSteps.map((step) => {
          const isCurrent = current === step.id;
          const isDone = current > step.id;
          const isBlocked = blocked.includes(step.id);
          return (
            <button
              key={step.id}
              onClick={() => !isBlocked && onChange(step.id)}
              disabled={isBlocked}
              className={cn(
                "flex-1 min-w-40 text-left rounded-xl px-3 py-2.5 transition-all border",
                isCurrent && "bg-primary text-primary-foreground border-primary shadow-sm",
                isDone && !isCurrent && "bg-emerald-50 text-emerald-800 border-emerald-200",
                !isCurrent && !isDone && !isBlocked && "bg-background text-muted-foreground border-border hover:border-primary/30 hover:text-foreground",
                isBlocked && "bg-secondary text-muted-foreground border-border opacity-60 cursor-not-allowed",
              )}
            >
              <div className="flex items-center gap-2">
                <span className={cn(
                  "h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold",
                  isCurrent && "bg-primary-foreground/20",
                  isDone && !isCurrent && "bg-emerald-200",
                  !isCurrent && !isDone && !isBlocked && "bg-secondary",
                  isBlocked && "bg-background border border-border",
                )}>
                  {isBlocked ? <Lock className="h-3 w-3" /> : isDone ? <Check className="h-3 w-3" /> : step.id}
                </span>
                <span className="text-xs font-semibold">{step.label}</span>
              </div>
              <p className={cn("text-[10px] mt-1 pl-7", isCurrent ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {step.agent}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
