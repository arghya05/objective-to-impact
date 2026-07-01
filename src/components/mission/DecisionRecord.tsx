import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Download, FileEdit, Save, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { defaultDecision, type MissionForm } from "@/lib/mission-mock";

interface Props {
  missionId: string | null;
  form: MissionForm;
  onApproved: () => void;
}

function fmtCurrency(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export function DecisionRecord({ missionId, form, onApproved }: Props) {
  const [open, setOpen] = useState(false);
  const [approver, setApprover] = useState("");
  const [cap, setCap] = useState(form.budget_ceiling);
  const [channels, setChannels] = useState<string[]>(form.channels.map((c) => c.id));
  const [confirm, setConfirm] = useState(false);
  const [futureApprovals, setFutureApprovals] = useState(true);
  const [saving, setSaving] = useState(false);

  const d = defaultDecision;

  const log = async (action: string, payload: any = {}) => {
    if (!missionId) return;
    const { data: userData } = await supabase.auth.getUser();
    await supabase.from("mission_activity_log").insert({
      mission_id: missionId,
      owner_id: userData.user?.id!,
      actor: userData.user?.email ?? "user",
      agent: "Governance Agent",
      action,
      status: "success",
      payload,
    });
  };

  const submitApproval = async () => {
    if (!missionId) { toast.error("Save the mission first"); return; }
    if (!approver.trim() || !confirm) return;
    setSaving(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("mission_approvals").insert({
        mission_id: missionId,
        owner_id: userData.user?.id!,
        approver_name: approver,
        budget_cap: cap,
        approved_channels: channels,
        require_future_approval: futureApprovals,
      });
      if (error) throw error;
      await supabase.from("missions").update({ status: "approved" }).eq("id", missionId);
      await log("Decision approved", { approver, cap, channels });
      toast.success(`Approved by ${approver}`);
      setOpen(false);
      onApproved();
    } catch (e: any) {
      toast.error(e.message ?? "Approval failed");
    } finally {
      setSaving(false);
    }
  };

  const saveDraft = async () => {
    if (!missionId) return;
    await supabase.from("missions").update({ status: "draft" }).eq("id", missionId);
    await log("Saved as draft");
    toast.success("Saved as draft");
  };

  const requestChanges = async () => {
    await log("Requested changes");
    toast.info("Change request sent to Growth Lead");
  };

  const exportRecord = async () => {
    const record = { mission: form, decision: d, missionId, exported_at: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(record, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `decision-record-${missionId ?? "draft"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    await log("Exported decision record");
  };

  return (
    <Card className="p-6 border-primary/20">
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Campaign Decision Record</span>
          </div>
          <h3 className="text-lg font-bold font-display tracking-tight">{d.decision_text}</h3>
          <p className="text-xs text-muted-foreground mt-1">Owner: {d.owner_role} · AI confidence {d.confidence}%</p>
        </div>
        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
          {d.audit_status}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <MetricCard label="Expected incremental ARR" value={`${fmtCurrency(d.arr_low)}–${fmtCurrency(d.arr_high)}`} />
        <MetricCard label="Recommended test budget" value={fmtCurrency(d.test_budget)} />
        <MetricCard label="Forecast period" value={`${d.forecast_period_days} days`} />
        <MetricCard label="Primary KPI" value={d.primary_kpi} />
      </div>

      <div className="grid md:grid-cols-2 gap-5 mb-5">
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Secondary KPIs</h4>
          <div className="flex flex-wrap gap-1.5">
            {d.secondary_kpis.map((k) => (
              <span key={k} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-foreground">{k}</span>
            ))}
          </div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-2">Assumptions</h4>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            {d.assumptions.map((a) => <li key={a}>· {a}</li>)}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Risks</h4>
          <ul className="space-y-1.5">
            {d.risks.map((r) => (
              <li key={r} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mt-4 mb-2">Evidence</h4>
          <div className="space-y-1.5">
            {d.evidence.map((e) => (
              <button key={e.source} className="w-full text-left rounded-lg border border-border p-2 hover:border-primary/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{e.source}</span>
                  <span className="text-[10px] text-muted-foreground">{e.updated}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{e.detail}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
        <Button onClick={() => setOpen(true)}>
          <CheckCircle2 className="h-4 w-4" />
          Approve campaign
        </Button>
        <Button variant="outline" onClick={requestChanges}>
          <FileEdit className="h-4 w-4" />
          Request changes
        </Button>
        <Button variant="outline" onClick={saveDraft}>
          <Save className="h-4 w-4" />
          Save as draft
        </Button>
        <Button variant="ghost" onClick={exportRecord}>
          <Download className="h-4 w-4" />
          Export decision record
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve campaign</DialogTitle>
            <DialogDescription>Approvals are immutable and logged to the audit trail.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="approver">Approver name</Label>
              <Input id="approver" value={approver} onChange={(e) => setApprover(e.target.value)} placeholder="e.g. Priya Ramanan" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cap">Budget cap (USD)</Label>
              <Input id="cap" type="number" value={cap} onChange={(e) => setCap(Number(e.target.value))} className="mt-1.5" />
            </div>
            <div>
              <Label>Approved channels</Label>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {form.channels.map((c) => (
                  <label key={c.id} className="flex items-center gap-2 text-xs rounded-lg border border-border px-2 py-1.5 cursor-pointer">
                    <Checkbox
                      checked={channels.includes(c.id)}
                      onCheckedChange={(v) => setChannels(v ? [...channels, c.id] : channels.filter((x) => x !== c.id))}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox checked={futureApprovals} onCheckedChange={(v) => setFutureApprovals(!!v)} />
              <span>Require approval for all future budget changes on this mission.</span>
            </label>
            <label className="flex items-start gap-2 text-xs">
              <Checkbox checked={confirm} onCheckedChange={(v) => setConfirm(!!v)} />
              <span>I confirm this decision on behalf of my organization.</span>
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submitApproval} disabled={!approver.trim() || !confirm || saving}>
              {saving ? "Approving…" : "Approve & lock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}
