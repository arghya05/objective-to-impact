import { Card } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, Legend } from "recharts";

const arrSeries = Array.from({ length: 12 }).map((_, i) => ({
  week: `W${i + 1}`,
  forecast: Math.round(400_000 + i * 240_000 + Math.sin(i / 2) * 60_000),
  actual: i < 8 ? Math.round(380_000 + i * 232_000 + Math.cos(i / 2) * 55_000) : null,
}));
const spendByChannel = [
  { channel: "Email", spend: 4200 },
  { channel: "LinkedIn", spend: 10800 },
  { channel: "Meta", spend: 13100 },
  { channel: "Display", spend: 7200 },
  { channel: "CS", spend: 4600 },
];
const convByAudience = [
  { cohort: "Champions", conv: 12.4 },
  { cohort: "Growth", conv: 8.1 },
  { cohort: "Downgraded", conv: 5.6 },
];

export function ForecastVsActual() {
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-4 gap-3">
        <Metric label="Expected retained ARR" value="$8.6M" />
        <Metric label="Actual retained ARR" value="$5.2M" trend="+18% wow" />
        <Metric label="Spend" value="$39.9k" />
        <Metric label="Incremental lift" value="calculating" muted />
        <Metric label="Confidence" value="78%" />
        <Metric label="Forecast accuracy" value="91%" trend="on track" />
        <Metric label="Campaign health" value="Healthy" tone="ok" />
        <Metric label="Holdout" value="10% eligible accounts" />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">ARR retained over time · forecast vs actual</h4>
          <div className="h-56">
            <ResponsiveContainer>
              <LineChart data={arrSeries}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Math.round(v / 1000)}k`} />
                <Tooltip formatter={(v: any) => v ? `$${Number(v).toLocaleString()}` : "—"} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="forecast" stroke="hsl(var(--muted-foreground))" strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">Spend by channel</h4>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={spendByChannel}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="channel" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(v: any) => `$${Number(v).toLocaleString()}`} />
                <Bar dataKey="spend" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4">
          <h4 className="text-sm font-semibold mb-3">Conversion by audience (%)</h4>
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={convByAudience} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="cohort" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip formatter={(v: any) => `${v}%`} />
                <Bar dataKey="conv" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card className="p-4 border-primary/30 bg-primary/5">
          <h4 className="text-sm font-semibold mb-3">Experiment · Holdout</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span className="text-muted-foreground">Control group</span><span className="font-semibold">10% of eligible accounts</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Incremental lift</span><span className="font-semibold">Calculating…</span></li>
            <li className="flex justify-between"><span className="text-muted-foreground">Results available in</span><span className="font-semibold">18 days</span></li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value, trend, muted, tone }: { label: string; value: string; trend?: string; muted?: boolean; tone?: "ok" }) {
  return (
    <Card className="p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-base font-bold mt-1 ${muted ? "text-muted-foreground" : tone === "ok" ? "text-emerald-600" : "text-foreground"}`}>{value}</p>
      {trend && <p className="text-[10px] text-emerald-600 mt-0.5">{trend}</p>}
    </Card>
  );
}
