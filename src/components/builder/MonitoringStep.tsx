import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Pause, RefreshCw, ArrowRightLeft, RotateCcw } from "lucide-react";

interface Props {
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

const alerts = [
  { type: "warning", message: "Creative #3 (Urgency - Meta) showing fatigue: CTR dropped 35% in 48h", action: "Pause creative" },
  { type: "info", message: "Display frequency approaching cap: 2.8/3.0 weekly for Cohort C2", action: "Adjust cap" },
  { type: "success", message: "Email sequence performing 22% above benchmark — consider increasing send volume", action: "Scale up" },
];

const autopilotLog = [
  { time: "14:32", agent: "Optimizer", action: "Paused Creative #3 (Meta - Urgency variant)", reason: "CTR below 0.8% threshold for 24h", evidence: "CTR: 0.62% vs 1.4% benchmark", rollback: true },
  { time: "12:15", agent: "Media Mix", action: "Shifted $500 from Display to Meta", reason: "Meta ROAS 4.3x vs Display 1.9x", evidence: "48h rolling ROAS comparison", rollback: true },
  { time: "09:00", agent: "Creative", action: "Refreshed ad copy for Cohort C1", reason: "Engagement plateau detected", evidence: "Flat CTR for 72h", rollback: true },
];

export function MonitoringStep({ onBack }: Props) {
  return (
    <div className="space-y-6">
      {/* Live Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Today's Spend", value: "$3,450", sub: "69% of daily budget" },
          { label: "Current CAC", value: "$12.90", sub: "Below $15 target ✓" },
          { label: "Current ROAS", value: "4.1x", sub: "Above 3.5x target ✓" },
          { label: "Conversions", value: "267", sub: "Pacing: On track" },
        ].map(m => (
          <div key={m.label} className="bg-card border border-border rounded-lg p-4 card-glow">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="text-2xl font-semibold font-mono text-foreground mt-1">{m.value}</p>
            <p className="text-[10px] text-success mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Live Chart */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Live Performance</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={liveData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 14% 18%)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "hsl(215 12% 52%)" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "hsl(220 18% 10%)", border: "1px solid hsl(220 14% 18%)", borderRadius: 6, fontSize: 11 }} />
            <Area type="monotone" dataKey="roas" stroke="hsl(190 95% 50%)" fill="hsl(190 95% 50% / 0.2)" name="ROAS" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Alerts */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Active Alerts</h2>
        <div className="space-y-2">
          {alerts.map((a, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-secondary/20">
              <AlertTriangle className={`h-4 w-4 mt-0.5 shrink-0 ${a.type === "warning" ? "text-warning" : a.type === "success" ? "text-success" : "text-primary"}`} />
              <div className="flex-1">
                <p className="text-sm text-foreground">{a.message}</p>
              </div>
              <button className="text-xs text-primary hover:underline whitespace-nowrap">{a.action}</button>
            </div>
          ))}
        </div>
      </div>

      {/* Autopilot Log */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Autopilot Audit Log</h2>
        <div className="space-y-3">
          {autopilotLog.map((log, i) => (
            <div key={i} className="border border-border rounded-md p-3 bg-secondary/10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">{log.time}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-primary/10 text-primary rounded">{log.agent}</span>
                </div>
                {log.rollback && (
                  <button className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground">
                    <RotateCcw className="h-3 w-3" /> Rollback
                  </button>
                )}
              </div>
              <p className="text-sm text-foreground">{log.action}</p>
              <p className="text-xs text-muted-foreground mt-1">Reason: {log.reason}</p>
              <p className="text-xs text-muted-foreground">Evidence: {log.evidence}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">← Back</button>
      </div>
    </div>
  );
}
