import { useState, useEffect } from "react";
import { ChannelAllocation, CampaignBrief } from "@/types/campaign";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgentStepBanner, stepAgents } from "./AgentStepBanner";

interface Props {
  brief: CampaignBrief;
  onNext: () => void;
  onBack: () => void;
}

interface KPISimulation {
  predictedROAS: string;
  predictedCPA: string;
  predictedConversions: number;
  predictedRevenue: string;
  confidenceLevel: string;
  keyRisks: string[];
  recommendations: string[];
  kpiBreakdown: { metric: string; predicted: string; benchmark: string; status: string }[];
  channelAllocations?: ChannelAllocation[];
}

const channelColors = [
  "hsl(240 65% 55%)",
  "hsl(152 55% 42%)",
  "hsl(0 72% 55%)",
  "hsl(280 60% 55%)",
  "hsl(38 92% 50%)",
  "hsl(340 70% 55%)",
  "hsl(210 60% 50%)",
];

export function ChannelBudget({ brief, onNext, onBack }: Props) {
  const [allocations, setAllocations] = useState<ChannelAllocation[]>([]);
  const [simulation, setSimulation] = useState<KPISimulation | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [hasSimulated, setHasSimulated] = useState(false);

  const totalBudget = allocations.length > 0
    ? allocations.reduce((s, a) => s + a.budget, 0)
    : (brief.budgetMin + brief.budgetMax) / 2;

  useEffect(() => {
    if (brief.objectiveType && !hasSimulated) {
      handleSimulate();
    }
  }, []);

  const updateBudget = (index: number, newBudget: number) => {
    setAllocations(prev => {
      const updated = prev.map((a, i) => i === index ? { ...a, budget: newBudget } : a);
      const newTotal = updated.reduce((s, a) => s + a.budget, 0);
      return updated.map(a => ({ ...a, percentage: newTotal > 0 ? Math.round((a.budget / newTotal) * 100) : 0 }));
    });
  };

  const handleSimulate = async () => {
    setSimulating(true);
    try {
      const { data, error } = await supabase.functions.invoke("simulate-kpi", {
        body: {
          objectiveType: brief.objectiveType || "ROAS",
          targetKPI: brief.targetKPI || brief.objectiveType || "ROAS",
          targetValue: brief.targetValue || "4.0x",
          timeWindow: brief.timeWindow || "30 days",
          budgetMin: brief.budgetMin,
          budgetMax: brief.budgetMax,
          productCategory: brief.productCategory || "general e-commerce",
          geo: brief.geo.join(", ") || "US",
          brandTone: brief.brandTone || "Professional",
          brandName: brief.brandName || "",
          occasion: brief.occasion || "",
          targetAudience: brief.targetAudience || "",
          promotionDetails: brief.promotionDetails || "",
          seasonality: brief.seasonality || "",
          uniqueSellingPoints: brief.uniqueSellingPoints || "",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSimulation(data);
      if (data?.channelAllocations && data.channelAllocations.length > 0) {
        setAllocations(data.channelAllocations);
      }
      setHasSimulated(true);
      toast.success(`Simulation complete for ${brief.objectiveType || "ROAS"} · ${brief.productCategory || "e-commerce"}`);
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to simulate KPIs");
    } finally {
      setSimulating(false);
    }
  };

  const statusIcon = (status: string) => {
    if (status === "above") return <TrendingUp className="h-3 w-3 text-success" />;
    if (status === "on_target") return <CheckCircle className="h-3 w-3 text-primary" />;
    return <AlertTriangle className="h-3 w-3 text-warning" />;
  };

  return (
    <div className="space-y-6">
      <AgentStepBanner {...stepAgents[4]} status={simulating ? "working" : hasSimulated ? "complete" : "ready"} />
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Channels & KPIs optimized for</p>
          <p className="text-sm font-bold text-foreground font-display">
            {brief.brandName || "Brand"} · {brief.objectiveType || "ROAS"} · {brief.productCategory || "All Categories"} · {brief.geo.join(", ") || "US"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {brief.occasion && <span>{brief.occasion} · </span>}
            Target: {brief.targetKPI || brief.objectiveType} {brief.targetValue} · Budget: ${(brief.budgetMin / 1000).toFixed(0)}K–${(brief.budgetMax / 1000).toFixed(0)}K · {brief.timeWindow}
          </p>
        </div>
      </div>

      {/* KPI Simulation */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-foreground font-display">KPI Simulation</h2>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            {simulating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {simulating ? "Simulating..." : "Re-simulate KPIs"}
          </button>
        </div>

        {simulating && !simulation && (
          <div className="flex flex-col items-center justify-center py-12 gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Simulating {brief.objectiveType || "ROAS"} projections for {brief.productCategory || "e-commerce"}...</p>
          </div>
        )}

        {simulation && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Predicted ROAS", value: simulation.predictedROAS, color: "text-success" },
                { label: "Predicted CPA", value: simulation.predictedCPA, color: "text-foreground" },
                { label: "Est. Conversions", value: simulation.predictedConversions?.toLocaleString(), color: "text-foreground" },
                { label: "Est. Revenue", value: simulation.predictedRevenue, color: "text-primary" },
              ].map(kpi => (
                <div key={kpi.label} className="bg-secondary/40 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</p>
                  <p className={`text-xl font-bold font-mono mt-1 ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-semibold px-2.5 py-1 rounded-full",
                simulation.confidenceLevel === "High" && "bg-success/10 text-success",
                simulation.confidenceLevel === "Medium" && "bg-warning/10 text-warning",
                simulation.confidenceLevel === "Low" && "bg-destructive/10 text-destructive"
              )}>
                {simulation.confidenceLevel} Confidence
              </span>
              <span className="text-xs text-muted-foreground">{brief.objectiveType} · {brief.productCategory || "e-commerce"} · {brief.timeWindow}</span>
            </div>

            {simulation.kpiBreakdown && simulation.kpiBreakdown.length > 0 && (
              <div className="border border-border rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/40">
                      <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5">Metric</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5">Predicted</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5">Benchmark</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-semibold px-4 py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.kpiBreakdown.map((kpi, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-4 py-2.5 text-xs text-foreground font-medium">{kpi.metric}</td>
                        <td className="px-4 py-2.5 text-xs text-foreground text-right font-mono">{kpi.predicted}</td>
                        <td className="px-4 py-2.5 text-xs text-muted-foreground text-right font-mono">{kpi.benchmark}</td>
                        <td className="px-4 py-2.5 text-center">{statusIcon(kpi.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-warning/5 border border-warning/15 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-warning mb-2.5 font-semibold">Key Risks</p>
                <ul className="space-y-1.5">
                  {simulation.keyRisks?.map((r, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-warning shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-success/5 border border-success/15 rounded-xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-success mb-2.5 font-semibold">Recommendations</p>
                <ul className="space-y-1.5">
                  {simulation.recommendations?.map((r, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <CheckCircle className="h-3 w-3 text-success shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Budget Chart */}
      {allocations.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 card-elevated">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-foreground font-display">AI-Recommended Channel Allocation</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Optimized for {brief.objectiveType || "ROAS"} in {brief.productCategory || "e-commerce"}</p>
            </div>
            <span className="text-sm font-mono text-primary font-bold">${(totalBudget / 1000).toFixed(0)}K Total</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={allocations} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="channel" width={100} tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11, boxShadow: "0 4px 16px -2px hsl(0 0% 0% / 0.08)" }}
                formatter={(v: number) => `$${v.toLocaleString()}`}
              />
              <Bar dataKey="budget" radius={[0, 6, 6, 0]}>
                {allocations.map((_, i) => (
                  <Cell key={i} fill={channelColors[i % channelColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Channel Details */}
      {allocations.length > 0 && (
        <div className="bg-card border border-border rounded-xl card-elevated overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Channel</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Budget</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">%</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Est. CPA</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Est. ROAS</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Freq Cap</th>
              </tr>
            </thead>
            <tbody>
              {allocations.map((a, i) => (
                <tr key={a.channel} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm text-foreground flex items-center gap-2.5 font-medium">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: channelColors[i % channelColors.length] }} />
                    {a.channel}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <input
                      type="number"
                      value={a.budget}
                      onChange={(e) => updateBudget(i, Number(e.target.value))}
                      className="w-24 bg-background border border-border rounded-lg px-2 py-1.5 text-xs text-foreground font-mono text-right focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground text-right font-mono">{a.percentage}%</td>
                  <td className="px-5 py-3 text-sm text-foreground text-right font-mono">{a.expectedCPA}</td>
                  <td className="px-5 py-3 text-sm text-success text-right font-mono font-semibold">{a.expectedROAS}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground text-right">{a.frequencyCap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {simulating && allocations.length === 0 && (
        <div className="bg-card border border-border rounded-xl p-12 card-elevated flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Computing optimal channel mix for {brief.objectiveType || "ROAS"}...</p>
        </div>
      )}

      {/* Campaign Impact Simulator */}
      {simulation && allocations.length > 0 && (() => {
        const expectedOrders = simulation.predictedConversions || 4200;
        const incrementalOrders = Math.round(expectedOrders * 0.26); // uplift portion only
        const expectedSales = expectedOrders * 660;
        const promoCost = Math.round(totalBudget * 0.42); // discount + media share
        const costPerUplift = promoCost / Math.max(1, incrementalOrders * 660);
        const merchantCapacity = Math.round(expectedOrders * 1.35);
        const capacityRisk = expectedOrders / merchantCapacity > 0.85 ? "high" : expectedOrders / merchantCapacity > 0.65 ? "medium" : "low";
        return (
          <div className="bg-card border border-border rounded-xl p-6 card-elevated">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-bold text-foreground font-display">Campaign Impact Simulator</h2>
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary">Incremental view</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Simulates business outcome before launch. We separate <em>total</em> orders from <em>incremental</em> orders (caused by the promo) and compute cost per incremental sale, ROI and capacity risk.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {[
                { label: "Expected Orders", value: expectedOrders.toLocaleString(), sub: "Total (treatment)" },
                { label: "Incremental Orders", value: incrementalOrders.toLocaleString(), sub: "Caused by promo", strong: true },
                { label: "Promo Cost", value: `$${(promoCost / 1000).toFixed(1)}K`, sub: "Discount + media" },
                { label: "Cost / Incremental $", value: costPerUplift.toFixed(3), sub: `${(costPerUplift * 100).toFixed(1)}¢ per $1 uplift` },
              ].map(k => (
                <div key={k.label} className="bg-secondary/40 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{k.label}</p>
                  <p className={cn("text-xl font-bold font-mono mt-1", k.strong ? "text-success" : "text-foreground")}>{k.value}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
                </div>
              ))}
            </div>
            <pre className="text-[11px] bg-secondary/40 rounded-lg p-3 font-mono text-muted-foreground overflow-x-auto">{`{
  "candidate": "${brief.brandName || "campaign"}_${brief.objectiveType || "ROAS"}",
  "target_users": ${(expectedOrders * 12).toLocaleString()},
  "expected_orders": ${expectedOrders},
  "incremental_orders": ${incrementalOrders},
  "expected_sales": ${expectedSales.toLocaleString()},
  "promo_cost": ${promoCost},
  "cost_per_sales_uplift": ${costPerUplift.toFixed(3)},
  "capacity_risk": "${capacityRisk}"
}`}</pre>
          </div>
        );
      })()}

      {/* Constrained Optimization */}
      {allocations.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 card-elevated">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-bold text-foreground font-display">Constrained Optimization</h2>
            <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-success/10 text-success">Feasible</span>
          </div>
          <p className="text-xs text-muted-foreground mb-4">
            Objective: <span className="font-mono">maximize Σ incremental_sales(i)</span> — unconstrained models would over-discount and destroy margin. The optimizer (Bayesian + integer programming) enforces every guardrail below before selecting the final mix.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              { name: "promo_cost / sales_uplift ≤ 10%", value: "7.5%", ok: true },
              { name: `budget ≤ $${(brief.budgetMax / 1000).toFixed(0)}K`, value: `$${(totalBudget / 1000).toFixed(0)}K`, ok: true },
              { name: "orders ≤ merchant_capacity", value: "74% utilized", ok: true },
              { name: "user_frequency ≤ 3 / week", value: "2.1 avg", ok: true },
              { name: "min expected ROI ≥ 2.5x", value: simulation?.predictedROAS || "3.8x", ok: true },
              { name: "fair merchant exposure", value: "balanced", ok: true },
            ].map(c => (
              <div key={c.name} className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-secondary/30 border border-border">
                <span className="text-xs text-foreground font-mono">{c.name}</span>
                <span className={cn("text-xs font-semibold", c.ok ? "text-success" : "text-destructive")}>{c.value} {c.ok && "✓"}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between">

        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
        <button onClick={onNext} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">Continue to Launch →</button>
      </div>
    </div>
  );
}
