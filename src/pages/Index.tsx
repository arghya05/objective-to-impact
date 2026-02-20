import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { mockKPIs, mockCampaigns, mockSpendData, mockConversionData } from "@/data/mockData";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Campaign Overview</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Real-time performance across all campaigns</p>
        </div>
        <button
          onClick={() => navigate("/builder")}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {mockKPIs.map((kpi) => (
          <KPICard key={kpi.label} {...kpi} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Spend by Channel */}
        <div className="bg-card border border-border rounded-lg p-4 card-glow">
          <h3 className="text-sm font-medium text-foreground mb-4">Spend by Channel</h3>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={mockSpendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: "hsl(210 20% 92%)" }}
              />
              <Area type="monotone" dataKey="meta" stackId="1" stroke="hsl(190 95% 50%)" fill="hsl(190 95% 50% / 0.3)" />
              <Area type="monotone" dataKey="google" stackId="1" stroke="hsl(152 60% 48%)" fill="hsl(152 60% 48% / 0.3)" />
              <Area type="monotone" dataKey="email" stackId="1" stroke="hsl(38 92% 55%)" fill="hsl(38 92% 55% / 0.3)" />
              <Area type="monotone" dataKey="display" stackId="1" stroke="hsl(280 65% 60%)" fill="hsl(280 65% 60% / 0.3)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversions */}
        <div className="bg-card border border-border rounded-lg p-4 card-glow">
          <h3 className="text-sm font-medium text-foreground mb-4">Conversions & Revenue</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={mockConversionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`} />
              <Tooltip
                contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 6, fontSize: 11 }}
                labelStyle={{ color: "hsl(210 20% 92%)" }}
              />
              <Bar yAxisId="left" dataKey="conversions" fill="hsl(190 95% 50%)" radius={[3, 3, 0, 0]} />
              <Bar yAxisId="right" dataKey="revenue" fill="hsl(152 60% 48% / 0.6)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-card border border-border rounded-lg card-glow">
        <div className="p-4 border-b border-border">
          <h3 className="text-sm font-medium text-foreground">Recent Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Campaign</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Objective</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Status</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Budget</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Spent</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">ROAS</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">CAC</th>
                <th className="text-right text-[11px] uppercase tracking-wider text-muted-foreground font-medium px-4 py-3">Conversions</th>
              </tr>
            </thead>
            <tbody>
              {mockCampaigns.map((c) => (
                <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{c.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{c.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary-foreground">{c.objective}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-sm text-foreground text-right font-mono">${(c.budget / 1000).toFixed(0)}K</td>
                  <td className="px-4 py-3 text-sm text-foreground text-right font-mono">${(c.spent / 1000).toFixed(1)}K</td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    {c.roas > 0 ? <span className="text-success">{c.roas}x</span> : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono">
                    {c.cac > 0 ? `$${c.cac}` : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground text-right font-mono">{c.conversions > 0 ? c.conversions.toLocaleString() : "—"}</td>
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
