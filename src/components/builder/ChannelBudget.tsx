import { useState } from "react";
import { ChannelAllocation } from "@/types/campaign";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Props {
  onNext: () => void;
  onBack: () => void;
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

export function ChannelBudget({ onNext, onBack }: Props) {
  const [allocations, setAllocations] = useState(initialAllocations);
  const totalBudget = allocations.reduce((s, a) => s + a.budget, 0);

  const updateBudget = (index: number, newBudget: number) => {
    setAllocations(prev => prev.map((a, i) =>
      i === index ? { ...a, budget: newBudget, percentage: Math.round((newBudget / totalBudget) * 100) } : a
    ));
  };

  return (
    <div className="space-y-6">
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
