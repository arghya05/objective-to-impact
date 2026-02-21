import { useState } from "react";
import { Rocket, Play, Shield, Check, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const artifacts = [
  { platform: "Google Ads", items: ["2 Search campaigns", "6 Ad groups", "24 RSA variants", "120 keywords", "Sitelink + callout assets"], status: "ready" },
  { platform: "Meta Ads", items: ["3 Campaign objectives", "5 Ad sets (cohort-based)", "12 Creative variants", "Custom audiences uploaded"], status: "ready" },
  { platform: "Email", items: ["3 Email templates", "2 Drip sequences", "A/B subject lines", "Scheduled sends (Tue/Thu 10AM)"], status: "ready" },
  { platform: "WhatsApp", items: ["2 Message templates", "Rich media cards", "Quick reply buttons", "Opt-out handling"], status: "pending" },
];

const approvals = [
  { role: "Marketing Manager", name: "Sarah Chen", status: "approved" as const },
  { role: "Compliance Officer", name: "Michael Torres", status: "approved" as const },
  { role: "Brand Manager", name: "Lisa Patel", status: "pending" as const },
];

export function LaunchCenter({ onNext, onBack }: Props) {
  const [simulated, setSimulated] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const allApproved = approvals.every(a => a.status === "approved");

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-5 font-display">Platform Artifacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art) => (
            <div key={art.platform} className="border border-border rounded-xl p-5 bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{art.platform}</h3>
                <span className={cn(
                  "text-[10px] font-semibold px-2.5 py-1 rounded-full",
                  art.status === "ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                )}>
                  {art.status === "ready" ? "Ready" : "Pending"}
                </span>
              </div>
              <ul className="space-y-1.5">
                {art.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-5">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Approvals Required</h2>
        </div>
        <div className="space-y-2">
          {approvals.map((a) => (
            <div key={a.role} className="flex items-center justify-between py-3 px-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors">
              <div>
                <p className="text-sm text-foreground font-medium">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
              {a.status === "approved" ? (
                <span className="flex items-center gap-1.5 text-xs text-success font-semibold"><Check className="h-3 w-3" /> Approved</span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-warning font-semibold"><AlertTriangle className="h-3 w-3" /> Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
        <div className="flex gap-3">
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all border border-border"
          >
            <Play className="h-4 w-4" />
            {simulating ? "Simulating..." : simulated ? "✓ Simulation Complete" : "Simulate"}
          </button>
          <button
            onClick={onNext}
            disabled={!allApproved}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-sm"
            title={!allApproved ? "All approvals required" : ""}
          >
            <Rocket className="h-4 w-4" />
            Launch Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
