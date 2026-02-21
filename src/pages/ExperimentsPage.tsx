import { useState } from "react";
import { FlaskConical, TrendingUp, CheckCircle, Clock, Archive, Trophy, AlertTriangle } from "lucide-react";
import { mockExperiments } from "@/data/mockData";
import { Experiment } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  running: { label: "Running", color: "bg-primary/10 text-primary", icon: Clock },
  completed: { label: "Completed", color: "bg-success/10 text-success", icon: CheckCircle },
  archived: { label: "Archived", color: "bg-secondary text-muted-foreground", icon: Archive },
  draft: { label: "Draft", color: "bg-warning/10 text-warning", icon: Clock },
};

const ExperimentsPage = () => {
  const [experiments] = useState<Experiment[]>(mockExperiments);
  const [expandedExp, setExpandedExp] = useState<string | null>("EXP-001");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = experiments.filter(e => filterStatus === "all" || e.status === filterStatus);

  const running = experiments.filter(e => e.status === "running").length;
  const completed = experiments.filter(e => e.status === "completed").length;
  const avgConfidence = Math.round(experiments.filter(e => e.confidence).reduce((s, e) => s + (e.confidence || 0), 0) / experiments.filter(e => e.confidence).length);

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <FlaskConical className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Experiments</h1>
        </div>
        <p className="text-sm text-muted-foreground">A/B tests, multi-armed bandit optimization, and experiment tracking</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Running Tests", value: running.toString(), sub: "Active experiments", icon: Clock },
          { label: "Completed", value: completed.toString(), sub: "With results", icon: CheckCircle },
          { label: "Avg Confidence", value: `${avgConfidence}%`, sub: "Statistical significance", icon: TrendingUp },
          { label: "Total Revenue Lift", value: "+$18.2K", sub: "From winning variants", icon: Trophy },
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

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "running", "completed", "archived"].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold border transition-all capitalize",
              filterStatus === status
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-secondary text-secondary-foreground border-border hover:border-primary/30"
            )}
          >
            {status === "all" ? "All" : status}
          </button>
        ))}
      </div>

      {/* Experiments List */}
      <div className="space-y-4">
        {filtered.map(exp => {
          const isExpanded = expandedExp === exp.id;
          const config = statusConfig[exp.status];
          const StatusIcon = config.icon;
          const totalConversions = exp.variants.reduce((s, v) => s + v.conversions, 0);

          const chartData = exp.variants.map(v => ({
            name: v.name,
            conversions: v.conversions,
            revenue: v.revenue,
            isWinner: exp.winner === v.name,
          }));

          return (
            <div
              key={exp.id}
              className={cn(
                "bg-card border rounded-xl card-elevated transition-all",
                isExpanded ? "border-primary" : "border-border"
              )}
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => setExpandedExp(isExpanded ? null : exp.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1", config.color)}>
                        <StatusIcon className="h-3 w-3" /> {config.label}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{exp.id}</span>
                      {exp.winner && (
                        <span className="text-[10px] font-semibold text-success flex items-center gap-1">
                          <Trophy className="h-3 w-3" /> Winner: {exp.winner}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">{exp.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{exp.hypothesis}</p>
                  </div>
                  <div className="text-right ml-4 shrink-0">
                    {exp.confidence && (
                      <div>
                        <p className={cn(
                          "text-lg font-bold font-mono",
                          exp.confidence >= 95 ? "text-success" : exp.confidence >= 80 ? "text-primary" : "text-warning"
                        )}>{exp.confidence}%</p>
                        <p className="text-[10px] text-muted-foreground">confidence</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Variant bars */}
                <div className="mt-4 space-y-2">
                  {exp.variants.map((v, i) => {
                    const pct = totalConversions > 0 ? (v.conversions / totalConversions) * 100 : 50;
                    return (
                      <div key={v.name} className="flex items-center gap-3">
                        <span className="text-[10px] text-muted-foreground w-36 truncate">{v.name}</span>
                        <div className="flex-1 bg-secondary rounded-full h-3 overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              exp.winner === v.name ? "bg-success" : i === 0 ? "bg-primary/50" : "bg-primary"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-foreground w-16 text-right">{v.conversions}</span>
                        <span className="text-xs font-mono text-success w-20 text-right">${v.revenue.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-0 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-3">Performance Comparison</p>
                      <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 91%)" />
                          <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(220 13% 91%)", borderRadius: 12, fontSize: 11 }} />
                          <Bar dataKey="conversions" radius={[6, 6, 0, 0]}>
                            {chartData.map((d, i) => (
                              <Cell key={i} fill={d.isWinner ? "hsl(152 55% 42%)" : "hsl(240 65% 55%)"} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      <div className="bg-secondary/40 rounded-xl p-4">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Experiment Details</p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between"><span className="text-muted-foreground">Success Metric</span><span className="text-foreground font-medium">{exp.successMetric}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span className="text-foreground font-mono">{exp.startDate}</span></div>
                          {exp.endDate && <div className="flex justify-between"><span className="text-muted-foreground">End Date</span><span className="text-foreground font-mono">{exp.endDate}</span></div>}
                          <div className="flex justify-between"><span className="text-muted-foreground">Traffic Split</span><span className="text-foreground font-mono">{exp.variants.map(v => `${v.traffic}%`).join(" / ")}</span></div>
                        </div>
                      </div>
                      {exp.status === "running" && (
                        <div className="flex gap-2">
                          <button className="flex-1 px-3 py-2 bg-success text-success-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-1.5">
                            <Trophy className="h-3 w-3" /> Promote Winner
                          </button>
                          <button className="flex-1 px-3 py-2 bg-secondary text-secondary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all border border-border flex items-center justify-center gap-1.5">
                            <Archive className="h-3 w-3" /> Archive
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExperimentsPage;
