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
      {/* Launch Artifacts */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Platform Artifacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art) => (
            <div key={art.platform} className="border border-border rounded-lg p-4 bg-secondary/20">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-foreground">{art.platform}</h3>
                <span className={cn(
                  "text-[10px] font-medium px-2 py-0.5 rounded-full",
                  art.status === "ready" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                )}>
                  {art.status === "ready" ? "Ready" : "Pending"}
                </span>
              </div>
              <ul className="space-y-1">
                {art.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Approvals */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Approvals Required</h2>
        </div>
        <div className="space-y-2">
          {approvals.map((a) => (
            <div key={a.role} className="flex items-center justify-between py-2 px-3 rounded-md bg-secondary/20">
              <div>
                <p className="text-sm text-foreground">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
              {a.status === "approved" ? (
                <span className="flex items-center gap-1 text-xs text-success"><Check className="h-3 w-3" /> Approved</span>
              ) : (
                <span className="flex items-center gap-1 text-xs text-warning"><AlertTriangle className="h-3 w-3" /> Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">← Back</button>
        <div className="flex gap-3">
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="flex items-center gap-2 px-6 py-2 bg-secondary text-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity border border-border"
          >
            <Play className="h-4 w-4" />
            {simulating ? "Simulating..." : simulated ? "✓ Simulation Complete" : "Simulate"}
          </button>
          <button
            onClick={onNext}
            disabled={!allApproved}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
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
