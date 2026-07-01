import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, TrendingUp, AlertTriangle, Target, Users, ShoppingCart, RefreshCw, Zap, ArrowRight, BarChart3, Lightbulb, Search, CheckCircle2, XCircle } from "lucide-react";
import { mockCustomerIntelligence, mockLearningMemory } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const strategyRecommendations = [
  {
    id: "1",
    priority: "Critical",
    strategy: "Retention",
    title: "Activate At-Risk Champions before churn",
    description: "12,800 high-LTV customers showing declining engagement. Win-back campaign within 30 days could recover $8.6M annual revenue.",
    expectedImpact: "+$8.6M ARR",
    confidence: "High",
    suggestedActions: ["Create personalized win-back offers", "Deploy multi-channel drip sequence", "Assign dedicated cohort in Campaign Builder"],
  },
  {
    id: "2",
    priority: "High",
    strategy: "Acquisition",
    title: "Scale lookalike targeting on Meta",
    description: "1% lookalike from High-Value Loyalists showing 2.8x ROAS in current tests. Budget headroom available.",
    expectedImpact: "+340 conversions/mo",
    confidence: "High",
    suggestedActions: ["Increase Meta budget by 30%", "Create 1% LAL from top segment", "Launch with urgency creative angle"],
  },
  {
    id: "3",
    priority: "Medium",
    strategy: "Upsell",
    title: "Cross-sell electronics to fashion buyers",
    description: "28,400 Rising Stars show 45% propensity for electronics category. Average basket could increase by $67.",
    expectedImpact: "+$1.9M revenue",
    confidence: "Medium",
    suggestedActions: ["Build cross-category creative variants", "Set up email drip with product recommendations", "Test discount vs full-price positioning"],
  },
  {
    id: "4",
    priority: "Medium",
    strategy: "Reactivation",
    title: "Re-engage lapsed high-spenders",
    description: "8,900 customers with $548 avg LTV haven't purchased in 90+ days. Historical data shows 22% reactivation rate with targeted offers.",
    expectedImpact: "+$1.1M revenue",
    confidence: "Medium",
    suggestedActions: ["Deploy win-back email sequence", "Offer exclusive discount code", "Retarget on Meta with dynamic product ads"],
  },
];

const priorityColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-warning/10 text-warning",
  Medium: "bg-primary/10 text-primary",
  Low: "bg-secondary text-muted-foreground",
};

const strategyIcons: Record<string, React.ElementType> = {
  Retention: RefreshCw,
  Acquisition: Users,
  Upsell: ShoppingCart,
  Reactivation: Zap,
};

const churnData = [
  { name: "Low Risk", value: 183000, fill: "hsl(152 55% 42%)" },
  { name: "Medium Risk", value: 42300, fill: "hsl(38 92% 50%)" },
  { name: "High Risk", value: 18200, fill: "hsl(0 72% 55%)" },
];

const strategyToObjective: Record<string, string> = {
  Retention: "Retention",
  Acquisition: "Acquisition",
  Upsell: "Upsell / Cross-sell",
  Reactivation: "Reactivation",
};

const strategyToKPI: Record<string, string> = {
  Retention: "Churn Rate",
  Acquisition: "CAC",
  Upsell: "Revenue",
  Reactivation: "Reactivation Rate",
};

// Ad Account Audit — agent scans connected ad platforms and surfaces issues
// that get tackled during campaign creation in the Builder.
const auditedChannels = [
  { name: "Google Ads", status: "scanned", issues: 4, lastScan: "2m ago", spend: "$142K" },
  { name: "Meta Ads", status: "scanned", issues: 6, lastScan: "2m ago", spend: "$98K" },
  { name: "TikTok Ads", status: "scanned", issues: 2, lastScan: "5m ago", spend: "$34K" },
  { name: "LinkedIn Ads", status: "scanned", issues: 3, lastScan: "8m ago", spend: "$21K" },
  { name: "WhatsApp Business", status: "scanned", issues: 1, lastScan: "12m ago", spend: "$8K" },
];

const adAuditIssues = [
  {
    id: "a1",
    severity: "Critical",
    channel: "Google Ads",
    issue: "12 campaigns burning budget on branded terms with 0.4x ROAS",
    evidence: "$38K wasted last 30 days · 240 keywords flagged",
    fix: "Pause low-ROAS branded campaigns and reallocate to lookalike prospecting",
    tackledBy: "Campaign Builder → Channels & Budgets",
    strategy: "Acquisition",
    objective: "Acquisition",
    kpi: "ROAS",
  },
  {
    id: "a2",
    severity: "Critical",
    channel: "Meta Ads",
    issue: "Creative fatigue detected — frequency > 8.2 on top 5 ad sets",
    evidence: "CTR dropped 47% over 14 days · CPM up 62%",
    fix: "Rotate 6 new creative variants across Reels + Feed",
    tackledBy: "Campaign Builder → Creative Studio",
    strategy: "Acquisition",
    objective: "Acquisition",
    kpi: "CTR",
  },
  {
    id: "a3",
    severity: "High",
    channel: "Meta Ads",
    issue: "Audience overlap of 34% between Retargeting and Lookalike sets",
    evidence: "$14K cannibalized spend · duplicate impressions on 82K users",
    fix: "Rebuild audiences with exclusion rules in Cohort builder",
    tackledBy: "Campaign Builder → Audience Cohorts",
    strategy: "Acquisition",
    objective: "Acquisition",
    kpi: "CAC",
  },
  {
    id: "a4",
    severity: "High",
    channel: "Google Ads",
    issue: "Conversion tracking missing on 3 landing pages (Enhanced Conversions off)",
    evidence: "~18% of conversions unreported · smart bidding starved of signal",
    fix: "Enable Enhanced Conversions + server-side tagging before next launch",
    tackledBy: "Campaign Builder → Data Readiness",
    strategy: "Acquisition",
    objective: "Acquisition",
    kpi: "ROAS",
  },
  {
    id: "a5",
    severity: "Medium",
    channel: "TikTok Ads",
    issue: "No dedicated retention campaign for repeat purchasers",
    evidence: "22K repeat customers not being retargeted · $2.1M revenue at risk",
    fix: "Launch WhatsApp + Email lifecycle sequence targeting Loyal Champions",
    tackledBy: "Campaign Builder → Audience Cohorts",
    strategy: "Retention",
    objective: "Retention",
    kpi: "Retention Rate",
  },
  {
    id: "a6",
    severity: "Medium",
    channel: "LinkedIn Ads",
    issue: "Budget concentration — 78% of spend on 2 ad sets, no diversification",
    evidence: "Single point of failure · missing 4 high-intent B2B segments",
    fix: "Redistribute budget across 5 segments with guardrails in Constrained Optimizer",
    tackledBy: "Campaign Builder → Channels & Budgets",
    strategy: "Acquisition",
    objective: "Lead Generation",
    kpi: "CPL",
  },
];

const severityColors: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/20",
  High: "bg-warning/10 text-warning border-warning/20",
  Medium: "bg-primary/10 text-primary border-primary/20",
};

const GrowthBrain = () => {
  const navigate = useNavigate();
  const intel = mockCustomerIntelligence;
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>("1");

  const handleCreateCampaign = (rec: typeof strategyRecommendations[0]) => {
    const params = new URLSearchParams({
      strategy: rec.strategy,
      objective: strategyToObjective[rec.strategy] || rec.strategy,
      kpi: strategyToKPI[rec.strategy] || "ROAS",
      title: rec.title,
      description: rec.description,
      impact: rec.expectedImpact,
      priority: rec.priority,
      confidence: rec.confidence,
      actions: JSON.stringify(rec.suggestedActions),
    });
    navigate(`/builder?${params.toString()}`);
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Brain className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Growth Brain</h1>
        </div>
        <p className="text-sm text-muted-foreground">Decision Intelligence Layer — the agent audits every connected ad account (Google, Meta, TikTok, LinkedIn, WhatsApp), surfaces what's broken, and hands each fix to Campaign Builder.</p>
      </div>

      {/* Customer Intelligence KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Customers", value: intel.totalCustomers.toLocaleString(), icon: Users, sub: "Active profiles" },
          { label: "Avg LTV", value: `$${intel.avgLTV}`, icon: TrendingUp, sub: "Lifetime value" },
          { label: "High Churn Risk", value: intel.churnRisk.high.toLocaleString(), icon: AlertTriangle, sub: `${((intel.churnRisk.high / intel.totalCustomers) * 100).toFixed(1)}% of base` },
          { label: "Strategy Queue", value: `${strategyRecommendations.length}`, icon: Target, sub: "Recommended actions" },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card border border-border rounded-xl p-4 card-elevated">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">{kpi.label}</p>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-2xl font-bold font-mono text-foreground">{kpi.value}</p>
            <p className="text-[11px] text-muted-foreground mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Strategy Recommendations */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">AI Strategy Recommendations</h2>
        </div>
        <div className="space-y-3">
          {strategyRecommendations.map(rec => {
            const StratIcon = strategyIcons[rec.strategy] || Target;
            const isExpanded = expandedStrategy === rec.id;
            return (
              <div
                key={rec.id}
                className={cn(
                  "border rounded-xl p-5 transition-all cursor-pointer",
                  isExpanded ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setExpandedStrategy(isExpanded ? null : rec.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <StratIcon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", priorityColors[rec.priority])}>{rec.priority}</span>
                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{rec.strategy}</span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{rec.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <p className="text-sm font-bold text-success font-mono">{rec.expectedImpact}</p>
                    <p className="text-[10px] text-muted-foreground">{rec.confidence} confidence</p>
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-4 ml-12 space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wider mb-2">Suggested Actions</p>
                      <ul className="space-y-1.5">
                        {rec.suggestedActions.map((action, i) => (
                          <li key={i} className="text-xs text-foreground flex items-center gap-2">
                            <ArrowRight className="h-3 w-3 text-primary shrink-0" /> {action}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCreateCampaign(rec); }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all shadow-sm flex items-center gap-1.5"
                    >
                      <Zap className="h-3 w-3" /> Create Campaign from Strategy
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Intelligence Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Churn Risk Distribution */}
        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Churn Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={churnData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" nameKey="name" paddingAngle={3}>
                {churnData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11 }} formatter={(v: number) => v.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {churnData.map(d => (
              <div key={d.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                <span className="text-[10px] text-muted-foreground">{d.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Channel Propensity */}
        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Channel Propensity Scores</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={intel.channelPropensity} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" horizontal={false} />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="channel" width={80} tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11 }} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} fill="hsl(240 65% 55%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Customer Segments */}
      <div className="bg-card border border-border rounded-xl card-elevated overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground font-display">Top Customer Segments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Segment</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Size</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Avg LTV</th>
                <th className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Churn Risk</th>
              </tr>
            </thead>
            <tbody>
              {intel.topSegments.map(seg => (
                <tr key={seg.name} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-foreground">{seg.name}</td>
                  <td className="px-5 py-3.5 text-sm text-foreground text-right font-mono">{seg.size.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-sm text-success text-right font-mono font-semibold">${seg.ltv}</td>
                  <td className="px-5 py-3.5 text-center">
                    <span className={cn(
                      "text-[10px] font-semibold px-2.5 py-1 rounded-full",
                      seg.churnRisk === "High" && "bg-destructive/10 text-destructive",
                      seg.churnRisk === "Medium" && "bg-warning/10 text-warning",
                      seg.churnRisk === "Low" && "bg-success/10 text-success",
                    )}>{seg.churnRisk}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lifecycle Distribution */}
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Customer Lifecycle Distribution</h3>
        <div className="flex gap-1 h-10 rounded-xl overflow-hidden">
          {intel.lifecycleDistribution.map((stage, i) => {
            const colors = ["hsl(240 65% 55%)", "hsl(152 55% 42%)", "hsl(38 92% 50%)", "hsl(0 72% 55%)", "hsl(220 10% 70%)"];
            return (
              <div
                key={stage.stage}
                className="flex items-center justify-center text-[10px] font-semibold text-white transition-all hover:opacity-80"
                style={{ width: `${stage.percentage}%`, backgroundColor: colors[i] }}
                title={`${stage.stage}: ${stage.count.toLocaleString()} (${stage.percentage}%)`}
              >
                {stage.percentage > 8 && stage.stage}
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-3">
          {intel.lifecycleDistribution.map((stage, i) => {
            const colors = ["hsl(240 65% 55%)", "hsl(152 55% 42%)", "hsl(38 92% 50%)", "hsl(0 72% 55%)", "hsl(220 10% 70%)"];
            return (
              <div key={stage.stage} className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[i] }} />
                  <span className="text-[10px] text-muted-foreground">{stage.stage}</span>
                </div>
                <p className="text-xs font-mono text-foreground mt-0.5">{stage.percentage}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Memory */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2 mb-5">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Learning Memory</h2>
          <span className="text-[10px] px-2 py-0.5 bg-primary/10 text-primary rounded-full font-semibold">Reusable Playbooks</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockLearningMemory.map((mem, i) => (
            <div key={i} className="border border-border rounded-xl p-4 bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                  mem.type === "creative" && "bg-primary/10 text-primary",
                  mem.type === "audience" && "bg-success/10 text-success",
                  mem.type === "channel" && "bg-warning/10 text-warning",
                  mem.type === "timing" && "text-muted-foreground bg-secondary",
                )}>{mem.type}</span>
                <span className={cn(
                  "text-[10px] font-medium",
                  mem.confidence === "High" ? "text-success" : "text-warning"
                )}>{mem.confidence}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{mem.insight}</p>
              <p className="text-[10px] text-muted-foreground mt-2">Based on {mem.campaigns} campaigns</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GrowthBrain;
