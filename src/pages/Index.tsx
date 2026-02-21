import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockKPIs, mockCampaigns, mockSpendData, mockConversionData, mockCustomerIntelligence, mockLearningMemory } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";
import { Plus, Brain, BookOpen, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const Overview = () => {
  const navigate = useNavigate();
  const intel = mockCustomerIntelligence;

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Campaign Overview</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time performance across all campaigns and agents</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/growth-brain")}
            className="flex items-center gap-2 px-4 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:bg-secondary/80 transition-all border border-border"
          >
            <Brain className="h-4 w-4 text-primary" />
            Growth Brain
          </button>
          <button
            onClick={() => navigate("/builder")}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Customer Intelligence Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-4 card-elevated">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Total Customers</p>
          </div>
          <p className="text-xl font-bold font-mono text-foreground">{intel.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 card-elevated">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Avg LTV</p>
          </div>
          <p className="text-xl font-bold font-mono text-success">${intel.avgLTV}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 card-elevated">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">High Churn Risk</p>
          </div>
          <p className="text-xl font-bold font-mono text-destructive">{intel.churnRisk.high.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 card-elevated cursor-pointer hover:bg-secondary/30 transition-colors" onClick={() => navigate("/growth-brain")}>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Strategy Queue</p>
          </div>
          <p className="text-xl font-bold font-mono text-primary">4 actions</p>
          <p className="text-[10px] text-primary mt-0.5">View in Growth Brain →</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Spend by Channel</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockSpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11, boxShadow: "0 4px 16px -2px hsl(0 0% 0% / 0.08)" }}
                labelStyle={{ color: "hsl(220 20% 12%)" }}
              />
              <Area type="monotone" dataKey="meta" stackId="1" stroke="hsl(240 65% 55%)" fill="hsl(240 65% 55% / 0.15)" />
              <Area type="monotone" dataKey="google" stackId="1" stroke="hsl(152 55% 42%)" fill="hsl(152 55% 42% / 0.15)" />
              <Area type="monotone" dataKey="email" stackId="1" stroke="hsl(38 92% 50%)" fill="hsl(38 92% 50% / 0.15)" />
              <Area type="monotone" dataKey="display" stackId="1" stroke="hsl(280 60% 55%)" fill="hsl(280 60% 55% / 0.15)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <h3 className="text-sm font-semibold text-foreground mb-4 font-display">Conversions & Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockConversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11, boxShadow: "0 4px 16px -2px hsl(0 0% 0% / 0.08)" }}
                labelStyle={{ color: "hsl(220 20% 12%)" }}
              />
              <Bar yAxisId="left" dataKey="conversions" fill="hsl(240 65% 55%)" radius={[6, 6, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="hsl(152 55% 42% / 0.5)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Learning Memory Highlights */}
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">Learning Memory — Top Insights</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockLearningMemory.slice(0, 3).map((mem, i) => (
            <div key={i} className="bg-secondary/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize",
                  mem.type === "creative" && "bg-primary/10 text-primary",
                  mem.type === "audience" && "bg-success/10 text-success",
                  mem.type === "channel" && "bg-warning/10 text-warning",
                )}>{mem.type}</span>
                <span className="text-[10px] text-success font-medium">{mem.confidence}</span>
              </div>
              <p className="text-xs text-foreground leading-relaxed">{mem.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-card border border-border rounded-xl card-elevated overflow-hidden">
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground font-display">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Campaign</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Objective</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Status</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Budget</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Spent</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">ROAS</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">CAC</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{c.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{c.objective}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-sm text-foreground text-right font-mono">${(c.budget / 1000).toFixed(0)}K</td>
                  <td className="px-5 py-3.5 text-sm text-foreground text-right font-mono">${(c.spent / 1000).toFixed(1)}K</td>
                  <td className="px-5 py-3.5 text-sm text-right font-mono">
                    {c.roas > 0 ? <span className="text-success font-semibold">{c.roas}x</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-right font-mono">
                    {c.cac > 0 ? `$${c.cac}` : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-sm text-foreground text-right font-mono">{c.conversions > 0 ? c.conversions.toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Overview;
