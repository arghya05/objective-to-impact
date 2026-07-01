import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

interface Entry {
  id: string;
  created_at: string;
  actor: string;
  agent: string | null;
  action: string;
  status: string | null;
  mission_id: string | null;
}

export function ActivityLog({ missionId }: { missionId: string | null }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [q, setQ] = useState("");
  const [agent, setAgent] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchLog = async () => {
      setLoading(true);
      let query = supabase.from("mission_activity_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (missionId) query = query.eq("mission_id", missionId);
      const { data } = await query;
      if (active) { setEntries((data as any) ?? []); setLoading(false); }
    };
    fetchLog();
    const iv = setInterval(fetchLog, 5000);
    return () => { active = false; clearInterval(iv); };
  }, [missionId]);

  const agents = useMemo(() => Array.from(new Set(entries.map((e) => e.agent).filter(Boolean))) as string[], [entries]);
  const statuses = useMemo(() => Array.from(new Set(entries.map((e) => e.status).filter(Boolean))) as string[], [entries]);

  const filtered = entries.filter((e) => {
    if (q && !`${e.action} ${e.actor} ${e.agent ?? ""}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (agent !== "all" && e.agent !== agent) return false;
    if (status !== "all" && e.status !== status) return false;
    return true;
  });

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold font-display">Activity log</h3>
        <span className="text-[10px] text-muted-foreground">Append-only · immutable</span>
      </div>
      <div className="grid md:grid-cols-4 gap-2 mb-3">
        <div className="relative md:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search actor or action" className="pl-8" />
        </div>
        <Select value={agent} onValueChange={setAgent}>
          <SelectTrigger><SelectValue placeholder="Agent" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All agents</SelectItem>
            {agents.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="text-left py-2 px-3">Time</th>
              <th className="text-left py-2 px-3">Actor</th>
              <th className="text-left py-2 px-3">Agent</th>
              <th className="text-left py-2 px-3">Action</th>
              <th className="text-left py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">Loading…</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={5} className="text-center py-6 text-muted-foreground">No activity yet.</td></tr>}
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="py-2 px-3 text-muted-foreground whitespace-nowrap">{new Date(e.created_at).toLocaleString()}</td>
                <td className="py-2 px-3">{e.actor}</td>
                <td className="py-2 px-3">{e.agent}</td>
                <td className="py-2 px-3 font-medium">{e.action}</td>
                <td className="py-2 px-3"><span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">{e.status ?? "—"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
