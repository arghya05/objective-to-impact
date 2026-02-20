import { useState, useEffect } from "react";
import { ChannelAllocation, CampaignBrief } from "@/types/campaign";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, Sparkles, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
}

const initialAllocations: ChannelAllocation[] = [
  { channel: "Meta Ads", budget: 18000, percentage: 36, expectedCPA: "$12-16", expectedROAS: "3.8-4.5x", frequencyCap: "4/week" },
  { channel: "Google Ads", budget: 14000, percentage: 28, expectedCPA: "$14-18", expectedROAS: "3.2-4.0x", frequencyCap: "N/A" },
  { channel: "YouTube", budget: 6000, percentage: 12, expectedCPA: "$18-25", expectedROAS: "2.5-3.2x", frequencyCap: "3/week" },
  { channel: "Display", budget: 4000, percentage: 8, expectedCPA: "$22-30", expectedROAS: "1.8-2.5x", frequencyCap: "3/week" },
  { channel: "Email", budget: 4000, percentage: 8, expectedCPA: "$4-8", expectedROAS: "8.0-12x", frequencyCap: "2/week" },
  { channel: "WhatsApp/SMS", budget: 2500, percentage: 5, expectedCPA: "$6-10", expectedROAS: "6.0-9x", frequencyCap: "1/week" },
  { channel: "Push", budget: 1500, percentage: 3, expectedCPA: "$3-6", expectedROAS: "10-15x", frequencyCap: "3/week" },
];

const channelColors = [
  "hsl(190 95% 50%)",
  "hsl(152 60% 48%)",
  "hsl(0 72% 55%)",
  "hsl(280 65% 60%)",
  "hsl(38 92% 55%)",
  "hsl(340 75% 60%)",
  "hsl(210 60% 50%)",
];

export function ChannelBudget({ brief, onNext, onBack }: Props) {
  const [allocations, setAllocations] = useState(initialAllocations);
  const [simulation, setSimulation] = useState<KPISimulation | null>(null);
  const [simulating, setSimulating] = useState(false);
  const totalBudget = allocations.reduce((s, a) => s + a.budget, 0);

  // Auto-simulate on mount if brief has objective
  useEffect(() => {
    if (brief.objectiveType) {
      handleSimulate();
    }
  }, []);

  const updateBudget = (index: number, newBudget: number) => {
    setAllocations(prev => prev.map((a, i) =>
      i === index ? { ...a, budget: newBudget, percentage: Math.round((newBudget / totalBudget) * 100) } : a
    ));
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
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setSimulation(data);
      toast.success("KPI simulation complete!");
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
      {/* KPI Simulation Panel */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">KPI Simulation</h2>
          <button
            onClick={handleSimulate}
            disabled={simulating}
            className="px-4 py-2 bg-primary/10 text-primary rounded-md text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {simulating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {simulating ? "Simulating..." : "Re-simulate KPIs"}
          </button>
        </div>

        {simulating && !simulation && (
          <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">Running AI simulation based on your campaign objective...</span>
          </div>
        )}

        {simulation && (
          <div className="space-y-4">
            {/* Top-level KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Predicted ROAS</p>
                <p className="text-xl font-bold text-success font-mono">{simulation.predictedROAS}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Predicted CPA</p>
                <p className="text-xl font-bold text-foreground font-mono">{simulation.predictedCPA}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Conversions</p>
                <p className="text-xl font-bold text-foreground font-mono">{simulation.predictedConversions.toLocaleString()}</p>
              </div>
              <div className="bg-secondary/30 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Est. Revenue</p>
                <p className="text-xl font-bold text-primary font-mono">{simulation.predictedRevenue}</p>
              </div>
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-2">
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                simulation.confidenceLevel === "High" && "bg-success/15 text-success",
                simulation.confidenceLevel === "Medium" && "bg-warning/15 text-warning",
                simulation.confidenceLevel === "Low" && "bg-destructive/15 text-destructive"
              )}>
                {simulation.confidenceLevel} Confidence
              </span>
              <span className="text-xs text-muted-foreground">
                Based on {brief.objectiveType} objective · {brief.timeWindow} window
              </span>
            </div>

            {/* KPI Breakdown */}
            {simulation.kpiBreakdown && simulation.kpiBreakdown.length > 0 && (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      <th className="text-left text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Metric</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Predicted</th>
                      <th className="text-right text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Benchmark</th>
                      <th className="text-center text-[10px] uppercase tracking-wider text-muted-foreground font-medium px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {simulation.kpiBreakdown.map((kpi, i) => (
                      <tr key={i} className="border-b border-border/50">
                        <td className="px-3 py-2 text-xs text-foreground">{kpi.metric}</td>
                        <td className="px-3 py-2 text-xs text-foreground text-right font-mono">{kpi.predicted}</td>
                        <td className="px-3 py-2 text-xs text-muted-foreground text-right font-mono">{kpi.benchmark}</td>
                        <td className="px-3 py-2 text-center">{statusIcon(kpi.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Risks & Recommendations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-warning/5 border border-warning/20 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-warning mb-2 font-medium">Key Risks</p>
                <ul className="space-y-1">
                  {simulation.keyRisks.map((r, i) => (
                    <li key={i} className="text-xs text-foreground flex items-start gap-1.5">
                      <AlertTriangle className="h-3 w-3 text-warning shrink-0 mt-0.5" /> {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                <p className="text-[10px] uppercase tracking-wider text-success mb-2 font-medium">Recommendations</p>
                <ul className="space-y-1">
                  {simulation.recommendations.map((r, i) => (
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
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Channel Allocation</h2>
          <span className="text-sm font-mono text-primary">${(totalBudget / 1000).toFixed(0)}K Total</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={allocations} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="channel" width={100} tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 6, fontSize: 11 }}
              formatter={(v: number) => `$${v.toLocaleString()}`}
            />
            <Bar dataKey="budget" radius={[0, 4, 4, 0]}>
              {allocations.map((_, i) => (
                <Cell key={i} fill={channelColors[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Channel Details */}
      <div className="bg-card border border-border rounded-lg card-glow overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Channel</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Budget</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">%</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Est. CPA</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Est. ROAS</th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Freq Cap</th>
            </tr>
          </thead>
          <tbody>
            {allocations.map((a, i) => (
              <tr key={a.channel} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 text-sm text-foreground flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: channelColors[i] }} />
                  {a.channel}
                </td>
                <td className="px-4 py-3 text-right">
                  <input
                    type="number"
                    value={a.budget}
                    onChange={(e) => updateBudget(i, Number(e.target.value))}
                    className="w-24 bg-secondary border border-border rounded px-2 py-1 text-xs text-foreground font-mono text-right focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground text-right font-mono">{a.percentage}%</td>
                <td className="px-4 py-3 text-sm text-foreground text-right font-mono">{a.expectedCPA}</td>
                <td className="px-4 py-3 text-sm text-success text-right font-mono">{a.expectedROAS}</td>
                <td className="px-4 py-3 text-sm text-muted-foreground text-right">{a.frequencyCap}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">← Back</button>
        <button onClick={onNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">Continue to Launch →</button>
      </div>
    </div>
  );
}
