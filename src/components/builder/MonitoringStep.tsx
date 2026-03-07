import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, RotateCcw, Zap, FlaskConical, Mail, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignBrief } from "@/types/campaign";
import { AgentStepBanner, stepAgents } from "./AgentStepBanner";
import { toast } from "sonner";

interface Props {
  brief: CampaignBrief;
  onBack: () => void;
}

const liveData = [
  { time: "00:00", spend: 120, cac: 14.2, roas: 3.8 },
  { time: "04:00", spend: 340, cac: 13.8, roas: 4.0 },
  { time: "08:00", spend: 890, cac: 12.5, roas: 4.3 },
  { time: "12:00", spend: 1650, cac: 13.1, roas: 4.1 },
  { time: "16:00", spend: 2400, cac: 12.8, roas: 4.2 },
  { time: "20:00", spend: 3100, cac: 13.4, roas: 3.9 },
  { time: "Now", spend: 3450, cac: 12.9, roas: 4.1 },
];

export function MonitoringStep({ brief, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const brandLabel = brief.brandName || "Campaign";
  const targetLabel = `${brief.targetKPI || brief.objectiveType || "ROAS"} ${brief.targetValue || "4.0x"}`;

  const handleSendReport = () => {
    if (!email) { toast.error("Please enter an email"); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`Monitoring report sent to ${email}`, {
        description: "Live metrics, alerts, autopilot actions & optimization changes delivered.",
      });
    }, 2500);
  };

  const metrics = [
    { label: "Today's Spend", value: "$3,450", sub: `69% of $${((brief.budgetMin + brief.budgetMax) / 2 / 30).toFixed(0)}/day budget` },
    { label: `Current ${brief.objectiveType === "CAC" ? "CAC" : "CAC"}`, value: "$12.90", sub: `Below target ✓` },
    { label: `Current ${brief.objectiveType || "ROAS"}`, value: brief.targetValue || "4.1x", sub: `Above ${targetLabel} target ✓` },
    { label: "Conversions", value: "267", sub: `Pacing: On track (${brief.timeWindow})` },
  ];

  const alerts = [
    { type: "warning", message: `Creative #3 (Urgency - Meta) for ${brief.productCategory || "product"} showing fatigue: CTR dropped 35% in 48h`, action: "Pause creative" },
    { type: "info", message: `Display frequency approaching cap for ${brandLabel} ${brief.occasion || "campaign"}`, action: "Adjust cap" },
    { type: "success", message: `Email sequence for "${brief.keyMessages[0] || brief.promotionDetails || "campaign"}" performing 22% above benchmark`, action: "Scale up" },
  ];

  const autopilotLog = [
    { time: "14:32", agent: "Optimizer", action: `Paused Creative #3 (Meta - Urgency variant) for ${brandLabel}`, reason: "CTR below 0.8% threshold for 24h", evidence: "CTR: 0.62% vs 1.4% benchmark", rollback: true },
    { time: "12:15", agent: "Media Mix", action: `Shifted $500 from Display to Meta for ${brief.productCategory || "products"}`, reason: `Meta ROAS 4.3x vs Display 1.9x for ${brief.occasion || "campaign"}`, evidence: "48h rolling ROAS comparison", rollback: true },
    { time: "09:00", agent: "Creative", action: `Refreshed ad copy for ${brief.targetAudience ? brief.targetAudience.slice(0, 30) : "Cohort C1"}`, reason: "Engagement plateau detected", evidence: "Flat CTR for 72h", rollback: true },
  ];

  return (
    <div className="space-y-6">
      <AgentStepBanner {...stepAgents[6]} status="working" />

      {/* Dual-agent indicator */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="flex items-center gap-3 bg-card border border-primary/15 rounded-xl p-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Optimizer Agent</p>
            <p className="text-[10px] text-muted-foreground">Auto-adjusting bids, budgets & creative rotation in real-time</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1 ml-auto shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Active
          </span>
        </div>
        <div className="flex items-center gap-3 bg-card border border-primary/15 rounded-xl p-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">Experiment Agent</p>
            <p className="text-[10px] text-muted-foreground">Running A/B tests, validating hypotheses & identifying winners</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1 ml-auto shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Testing
          </span>
        </div>
      </div>
      {/* Dynamic context banner */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
        <p className="text-[11px] text-muted-foreground font-medium">Monitoring</p>
        <p className="text-sm font-bold text-foreground font-display">
          {brandLabel} · {brief.occasion || brief.objectiveType || "Campaign"} · {brief.productCategory || "All"} · {brief.geo.join(", ") || "US"}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Target: {targetLabel} · Budget: ${(brief.budgetMin / 1000).toFixed(0)}K–${(brief.budgetMax / 1000).toFixed(0)}K · {brief.timeWindow}
        </p>
      </div>

      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {metrics.map(m => (
          <div key={m.label} className="bg-card border border-border rounded-xl p-4 card-elevated">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{m.label}</p>
            <p className="text-2xl font-bold font-mono text-foreground mt-1.5">{m.value}</p>
            <p className="text-[11px] text-success mt-1.5 font-medium">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Live Chart */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-4 font-display">Live Performance — {brandLabel}</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={liveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11, boxShadow: "0 4px 16px -2px hsl(0 0% 0% / 0.08)" }} />
            <Area type="monotone" dataKey="roas" stroke="hsl(240 65% 55%)" fill="hsl(240 65% 55% / 0.1)" name={brief.objectiveType || "ROAS"} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-4 font-display">Active Alerts</h2>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors">
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.type === "warning" ? "text-warning" : a.type === "success" ? "text-success" : "text-primary"}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{a.message}</p>
              </div>
              <button className="text-xs text-primary hover:underline whitespace-nowrap font-semibold">{a.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Autopilot Log */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-4 font-display">Autopilot Audit Log</h2>
        <div className="space-y-3">
          {autopilotLog.map((log, i) => (
            <div key={i} className="border border-border rounded-xl p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{log.time}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">{log.agent}</span>
                </div>
                {log.rollback && (
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground font-medium">
                    <RotateCcw className="h-3 w-3" /> Rollback
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground font-medium">{log.action}</p>
              <p className="text-xs text-muted-foreground mt-1">Reason: {log.reason}</p>
              <p className="text-xs text-muted-foreground">Evidence: {log.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
      </div>
    </div>
  );
}
