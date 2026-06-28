import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, RotateCcw, Zap, FlaskConical, Mail, Send, CheckCircle2, Brain, TrendingUp, ArrowRight, RefreshCw, Lightbulb, Target, BarChart3, Repeat } from "lucide-react";
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
  const [activeExperiment, setActiveExperiment] = useState(0);
  const [reinforcementCycle, setReinforcementCycle] = useState(0);

  const brandLabel = brief.brandName || "Campaign";
  const targetLabel = `${brief.targetKPI || brief.objectiveType || "ROAS"} ${brief.targetValue || "4.0x"}`;

  // Simulate live experiment progression
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveExperiment(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulate reinforcement learning cycles
  useEffect(() => {
    const interval = setInterval(() => {
      setReinforcementCycle(prev => prev + 1);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

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
    { label: `Current CAC`, value: "$12.90", sub: `Below target ✓` },
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

  const experiments = [
    {
      id: "EXP-001",
      name: `CTA Test: "${brief.callToAction || "Shop Now"}" vs "Get Yours Today"`,
      status: "winner_found" as const,
      channel: "Meta Ads",
      metric: "CVR",
      control: "2.1%",
      variant: "3.4%",
      lift: "+62%",
      confidence: "97.2%",
      learning: `"Get Yours Today" outperforms across ${brief.targetAudience?.slice(0, 20) || "all cohorts"} — urgency-based CTAs drive higher CVR for ${brief.productCategory || "this category"}`,
      applied: true,
    },
    {
      id: "EXP-002",
      name: `Audience: ${brief.occasion || "Seasonal"} Lookalike vs Interest-based`,
      status: "running" as const,
      channel: "Google Ads",
      metric: "ROAS",
      control: "3.8x",
      variant: "4.2x",
      lift: "+10.5%",
      confidence: "84.1%",
      learning: "Lookalike audiences trending higher but need more data for significance",
      applied: false,
    },
    {
      id: "EXP-003",
      name: `Email: ${brief.brandTone} tone vs Casual tone subject lines`,
      status: "winner_found" as const,
      channel: "Email",
      metric: "Open Rate",
      control: "18.3%",
      variant: "26.7%",
      lift: "+46%",
      confidence: "99.1%",
      learning: `Casual tone subject lines significantly outperform ${brief.brandTone} tone for ${brandLabel} — updating brand tone guidelines`,
      applied: true,
    },
  ];

  const reinforcementLearnings = [
    {
      cycle: 1,
      observation: `${brief.brandTone} tone underperforms in email for ${brief.productCategory || "this category"}`,
      hypothesis: "Casual, conversational tone drives higher open rates",
      action: "Creative Agent updated tone guidelines for email channel",
      impact: "Email open rates +46%, click-through +22%",
      feedsInto: ["Creative Studio", "Audience Segmentation"],
      icon: Lightbulb,
    },
    {
      cycle: 2,
      observation: `Urgency-based CTAs outperform benefit-based CTAs for ${brief.occasion || "seasonal"} campaigns`,
      hypothesis: "Time-sensitive framing activates loss aversion",
      action: "All ad copy regenerated with urgency framing; budget shifted to high-urgency creatives",
      impact: "CVR +62%, CAC reduced by $2.10",
      feedsInto: ["Creative Studio", "Channel Budget", "Launch Artifacts"],
      icon: Target,
    },
    {
      cycle: 3,
      observation: `Lookalike audiences from ${brandLabel} converters outperform interest targeting`,
      hypothesis: "First-party data signals are stronger than platform interest categories",
      action: "Segmentation Agent rebuilt cohorts using converter lookalikes; Media Mix reallocated 30% budget",
      impact: "ROAS improved from 3.8x to 4.3x",
      feedsInto: ["Audience Cohorts", "Media Mix", "Data Readiness"],
      icon: BarChart3,
    },
  ];

  const feedbackLoop = [
    { step: "Monitor", desc: "Collect real-time performance data", active: reinforcementCycle % 4 === 0 },
    { step: "Experiment", desc: "Run hypothesis-driven A/B tests", active: reinforcementCycle % 4 === 1 },
    { step: "Learn", desc: "Extract statistically valid insights", active: reinforcementCycle % 4 === 2 },
    { step: "Reinforce", desc: "Apply learnings across all agents & steps", active: reinforcementCycle % 4 === 3 },
  ];

  return (
    <div className="space-y-6">
      <AgentStepBanner {...stepAgents[6]} status="working" />

      {/* Triple-agent indicator */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 bg-card border border-primary/15 rounded-xl p-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">Optimizer Agent</p>
            <p className="text-[10px] text-muted-foreground">Auto-adjusting bids & budgets</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-success/10 text-success flex items-center gap-1 ml-auto shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> Active
          </span>
        </div>
        <div className="flex items-center gap-3 bg-card border border-primary/15 rounded-xl p-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FlaskConical className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">Experiment Agent</p>
            <p className="text-[10px] text-muted-foreground">Running A/B tests & validation</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary flex items-center gap-1 ml-auto shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" /> Testing
          </span>
        </div>
        <div className="flex items-center gap-3 bg-card border border-warning/15 rounded-xl p-3">
          <div className="h-8 w-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
            <Brain className="h-4 w-4 text-warning" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-foreground">Reinforcement Agent</p>
            <p className="text-[10px] text-muted-foreground">Feeding learnings back to all agents</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-warning/10 text-warning flex items-center gap-1 ml-auto shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-warning animate-pulse" /> Learning
          </span>
        </div>
      </div>

      {/* Reinforcement Learning Loop — Visual */}
      <div className="bg-card border border-warning/20 rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-4">
          <Repeat className="h-4 w-4 text-warning" />
          <h2 className="text-base font-bold text-foreground font-display">Reinforcement Learning Loop</h2>
          <span className="text-[10px] font-mono text-muted-foreground ml-auto">Cycle #{Math.max(1, reinforcementCycle)}</span>
        </div>
        <p className="text-xs text-muted-foreground mb-5">Every insight feeds back into the system — agents continuously improve based on real performance data.</p>
        <div className="flex items-center justify-between gap-2">
          {feedbackLoop.map((phase, i) => (
            <div key={phase.step} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "flex-1 rounded-xl p-3 border transition-all duration-700",
                phase.active
                  ? "bg-warning/10 border-warning/30 shadow-sm scale-[1.02]"
                  : "bg-secondary/30 border-border"
              )}>
                <p className={cn(
                  "text-xs font-bold transition-colors",
                  phase.active ? "text-warning" : "text-foreground"
                )}>{phase.step}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{phase.desc}</p>
              </div>
              {i < feedbackLoop.length - 1 && (
                <ArrowRight className={cn(
                  "h-3.5 w-3.5 shrink-0 transition-colors",
                  phase.active ? "text-warning" : "text-border"
                )} />
              )}
            </div>
          ))}
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

      {/* Experiments Section */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-5">
          <FlaskConical className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Active Experiments</h2>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary ml-auto">
            {experiments.filter(e => e.status === "running").length} running · {experiments.filter(e => e.status === "winner_found").length} concluded
          </span>
        </div>
        <div className="space-y-4">
          {experiments.map((exp, i) => (
            <div
              key={exp.id}
              className={cn(
                "border rounded-xl p-5 transition-all",
                i === activeExperiment ? "border-primary/30 bg-primary/5" : "border-border bg-secondary/20",
                exp.status === "winner_found" && "border-success/20"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{exp.id}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full font-semibold text-muted-foreground">{exp.channel}</span>
                </div>
                <span className={cn(
                  "text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1",
                  exp.status === "winner_found" ? "bg-success/10 text-success" : "bg-primary/10 text-primary"
                )}>
                  {exp.status === "winner_found" && <CheckCircle2 className="h-3 w-3" />}
                  {exp.status === "running" && <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />}
                  {exp.status === "winner_found" ? "Winner Found" : "Running"}
                </span>
              </div>
              <p className="text-sm font-semibold text-foreground mb-3">{exp.name}</p>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Control</p>
                  <p className="text-sm font-mono font-bold text-foreground">{exp.control}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Variant</p>
                  <p className="text-sm font-mono font-bold text-primary">{exp.variant}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Lift</p>
                  <p className="text-sm font-mono font-bold text-success">{exp.lift}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase">Confidence</p>
                  <p className="text-sm font-mono font-bold text-foreground">{exp.confidence}</p>
                </div>
              </div>
              <div className={cn(
                "rounded-lg p-3",
                exp.applied ? "bg-success/5 border border-success/15" : "bg-secondary/30 border border-border"
              )}>
                <div className="flex items-start gap-2">
                  <Lightbulb className={cn("h-3.5 w-3.5 mt-0.5 shrink-0", exp.applied ? "text-success" : "text-muted-foreground")} />
                  <div>
                    <p className="text-xs text-foreground font-medium">Learning: {exp.learning}</p>
                    {exp.applied && (
                      <p className="text-[10px] text-success font-semibold mt-1 flex items-center gap-1">
                        <RefreshCw className="h-3 w-3" /> Applied — Reinforcement Agent updated downstream agents
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reinforcement Learnings — What Changed */}
      <div className="bg-card border border-warning/20 rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-2">
          <Brain className="h-4 w-4 text-warning" />
          <h2 className="text-base font-bold text-foreground font-display">Reinforcement: What Changed</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5">
          Each learning is automatically propagated back to the relevant agents and steps — the entire campaign evolves based on real data.
        </p>
        <div className="space-y-4">
          {reinforcementLearnings.map((rl, i) => (
            <div key={i} className="border border-warning/15 rounded-xl p-5 bg-warning/5 hover:bg-warning/8 transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <rl.icon className="h-4 w-4 text-warning" />
                <p className="text-xs font-bold text-foreground">Learning Cycle #{rl.cycle}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Observation</p>
                  <p className="text-xs text-foreground">{rl.observation}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1 mt-3">Hypothesis</p>
                  <p className="text-xs text-foreground">{rl.hypothesis}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1">Action Taken</p>
                  <p className="text-xs text-foreground">{rl.action}</p>
                  <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1 mt-3">Impact</p>
                  <p className="text-xs text-success font-semibold">{rl.impact}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-warning/15">
                <p className="text-[10px] uppercase text-muted-foreground font-semibold mb-1.5">Feeds Back Into</p>
                <div className="flex gap-2 flex-wrap">
                  {rl.feedsInto.map(step => (
                    <span key={step} className="text-[10px] px-2.5 py-1 bg-warning/10 text-warning rounded-full font-semibold flex items-center gap-1">
                      <ArrowRight className="h-2.5 w-2.5" /> {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Measurement & Attribution (Holdout / Control) */}
      <div className="bg-card border border-success/20 rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-2">
          <BarChart3 className="h-4 w-4 text-success" />
          <h2 className="text-base font-bold text-foreground font-display">Measurement & Attribution — Holdout vs Treatment</h2>
          <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success ml-auto">95% CI</span>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          A randomized 10% control group receives no promo. Without this holdout we cannot prove the campaign <em>caused</em> the uplift — we'd just be paying for orders that would have happened anyway.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[
            { label: "Treatment users", value: "45,000", sub: "Received promo" },
            { label: "Control users", value: "5,000", sub: "Holdout — no promo" },
            { label: "Treatment orders", value: "4,182", sub: "9.29% conv rate" },
            { label: "Control orders (adj.)", value: "3,090", sub: "6.87% conv rate" },
          ].map(k => (
            <div key={k.label} className="bg-secondary/40 rounded-xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</p>
              <p className="text-xl font-bold font-mono text-foreground mt-1">{k.value}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-success/5 border border-success/20 rounded-xl p-4">
            <p className="text-[10px] uppercase text-success font-semibold">Incremental Orders</p>
            <p className="text-2xl font-mono font-bold text-success mt-1">+1,092</p>
            <p className="text-[10px] text-muted-foreground">Treatment − Control (adj.)</p>
          </div>
          <div className="bg-success/5 border border-success/20 rounded-xl p-4">
            <p className="text-[10px] uppercase text-success font-semibold">Incremental GMV</p>
            <p className="text-2xl font-mono font-bold text-success mt-1">$721K</p>
            <p className="text-[10px] text-muted-foreground">Sales_treatment − Sales_control_adjusted</p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p className="text-[10px] uppercase text-primary font-semibold">True ROI</p>
            <p className="text-2xl font-mono font-bold text-primary mt-1">3.4x</p>
            <p className="text-[10px] text-muted-foreground">vs 5.1x naive (which counts non-incremental orders)</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-3 font-mono">
          Incremental Sales = Sales_treatment − Sales_control_adjusted. Repeat-rate and merchant retention measured 30/60/90d post-exposure.
        </p>
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

      {/* Email Monitoring Report */}
      <div className="bg-card border border-primary/20 rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-4">
          <Mail className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Send Monitoring Report via Email</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Send real-time campaign performance — live metrics, active alerts, autopilot actions & optimization changes — to stakeholders.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="email"
            placeholder="Enter email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
            className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSendReport}
            disabled={sending || sent}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
              sent
                ? "bg-success/10 text-success border border-success/20"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            )}
          >
            {sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : sent ? "Sent ✓" : "Send Report"}
          </button>
        </div>
        {sent && (
          <div className="mt-3 p-3 bg-success/5 border border-success/15 rounded-lg">
            <p className="text-xs text-success font-medium">✓ Monitoring report delivered to {email}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Includes: Live KPIs · {alerts.length} active alerts · {autopilotLog.length} autopilot actions · {experiments.length} experiments · {reinforcementLearnings.length} reinforcement cycles</p>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
      </div>
    </div>
  );
}
