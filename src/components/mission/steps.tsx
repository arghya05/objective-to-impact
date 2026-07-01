import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle2, Rocket, Wifi, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { MissionForm } from "@/lib/mission-mock";
import { supabase } from "@/integrations/supabase/client";

interface StepProps {
  form: MissionForm;
  setForm: (f: MissionForm) => void;
  missionId: string | null;
}

const brandTones = ["Professional", "Playful", "Urgent", "Premium", "Casual"];
const objectives = ["Retention", "Expansion", "Pipeline Generation", "Reactivation"];
const kpis = ["Retained ARR", "Expansion ARR", "Pipeline Generated", "Win-back rate"];

export function StepObjective({ form, setForm }: StepProps) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-bold font-display mb-1">Objective</h3>
      <p className="text-xs text-muted-foreground mb-5">Define the commercial outcome this mission must deliver.</p>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Brand name"><Input value={form.brand_name} onChange={(e) => setForm({ ...form, brand_name: e.target.value })} /></Field>
        <Field label="Campaign name"><Input value={form.campaign_name} onChange={(e) => setForm({ ...form, campaign_name: e.target.value })} /></Field>
        <Field label="Brand description" full><Textarea rows={2} value={form.brand_description} onChange={(e) => setForm({ ...form, brand_description: e.target.value })} /></Field>
        <Field label="Brand tone" full>
          <div className="flex flex-wrap gap-1.5">
            {brandTones.map((t) => (
              <button key={t} type="button"
                onClick={() => setForm({ ...form, brand_tone: t })}
                className={cn("text-xs px-3 py-1 rounded-full border transition-colors",
                  form.brand_tone === t ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border hover:border-primary/40")}>
                {t}
              </button>
            ))}
          </div>
        </Field>
        <Field label="Commercial objective">
          <Select value={form.objective} onValueChange={(v) => setForm({ ...form, objective: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{objectives.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Primary KPI">
          <Select value={form.primary_kpi} onValueChange={(v) => setForm({ ...form, primary_kpi: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>{kpis.map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Target incremental ARR (USD)"><Input type="number" value={form.target_arr} onChange={(e) => setForm({ ...form, target_arr: Number(e.target.value) })} /></Field>
        <Field label="Budget ceiling (USD)"><Input type="number" value={form.budget_ceiling} onChange={(e) => setForm({ ...form, budget_ceiling: Number(e.target.value) })} /></Field>
        <Field label="Campaign timeline (days)"><Input type="number" value={form.timeline_days} onChange={(e) => setForm({ ...form, timeline_days: Number(e.target.value) })} /></Field>
        <Field label="Campaign owner"><Input value={form.campaign_owner} onChange={(e) => setForm({ ...form, campaign_owner: e.target.value })} /></Field>
        <Field label="Audience exclusions" full><Textarea rows={2} value={form.audience_exclusions} onChange={(e) => setForm({ ...form, audience_exclusions: e.target.value })} /></Field>
        <Field label="Legal / compliance constraints" full><Textarea rows={2} value={form.compliance_notes} onChange={(e) => setForm({ ...form, compliance_notes: e.target.value })} /></Field>
      </div>
    </Card>
  );
}

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <Label className="text-xs">{label}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function StepDataCompliance({ form, setForm }: StepProps) {
  const excludeAffected = () => {
    setForm({ ...form, compliance_checks: form.compliance_checks.map((c) => c.label === "WhatsApp opt-in coverage" ? { ...c, ok: true, warning: undefined, note: "Affected users excluded" } as any : c) });
    toast.success("Affected users excluded from audience.");
  };
  const resolveIssue = () => toast.info("Governance task created for the ops team.");

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h3 className="text-base font-bold font-display mb-4">Connected data sources</h3>
        <div className="grid md:grid-cols-3 gap-3">
          {form.data_sources.map((s) => {
            const healthy = s.health === "healthy";
            return (
              <div key={s.name} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold">{s.name}</span>
                  {healthy ? <Wifi className="h-4 w-4 text-emerald-600" /> : <WifiOff className="h-4 w-4 text-amber-600" />}
                </div>
                <p className={cn("text-[11px]", healthy ? "text-emerald-700" : "text-amber-700")}>
                  {s.status} · {s.health}
                </p>
              </div>
            );
          })}
        </div>
      </Card>
      <Card className="p-6">
        <h3 className="text-base font-bold font-display mb-4">Compliance checklist</h3>
        <ul className="space-y-2">
          {form.compliance_checks.map((c: any) => (
            <li key={c.label} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3">
              <div className="flex items-start gap-2">
                {c.ok ? <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5" /> : <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />}
                <div>
                  <p className="text-sm font-medium">{c.label}</p>
                  {c.warning && <p className="text-xs text-amber-700 mt-0.5">{c.warning}</p>}
                  {c.note && <p className="text-xs text-emerald-700 mt-0.5">{c.note}</p>}
                </div>
              </div>
              {!c.ok && (
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={excludeAffected}>Exclude affected users</Button>
                  <Button size="sm" onClick={resolveIssue}>Resolve data issue</Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

export function StepAudiences({ form, setForm }: StepProps) {
  const totals = useMemo(() => {
    const sel = form.audiences.filter((a) => a.included);
    return { accounts: sel.reduce((s, a) => s + a.accounts, 0), arr: sel.reduce((s, a) => s + a.arr, 0) };
  }, [form.audiences]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold font-display">Recommended audiences</h3>
          <p className="text-xs text-muted-foreground">Nyx Segmentation Agent built these cohorts from CRM, product, and billing signals.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Selected reach</p>
          <p className="text-sm font-bold">{totals.accounts.toLocaleString()} accounts · ${(totals.arr / 1_000_000).toFixed(1)}M ARR</p>
        </div>
      </div>
      <div className="space-y-2">
        {form.audiences.map((a) => (
          <div key={a.id} className={cn("rounded-xl border p-4 transition-all", a.included ? "border-primary/40 bg-primary/5" : "border-border bg-background")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold">{a.name}</h4>
                  <span className={cn("text-[10px] font-semibold px-1.5 py-0.5 rounded-full border",
                    a.risk === "Critical" && "bg-rose-50 text-rose-700 border-rose-200",
                    a.risk === "High" && "bg-amber-50 text-amber-700 border-amber-200",
                    a.risk === "Medium" && "bg-indigo-50 text-indigo-700 border-indigo-200",
                  )}>{a.risk}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{a.accounts.toLocaleString()} accounts · {a.note}</p>
              </div>
              <Button
                size="sm"
                variant={a.included ? "outline" : "default"}
                onClick={() => setForm({ ...form, audiences: form.audiences.map((x) => x.id === a.id ? { ...x, included: !x.included } : x) })}
              >
                {a.included ? "Exclude" : "Include"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function StepCreatives({ form }: StepProps) {
  return (
    <Card className="p-6">
      <h3 className="text-base font-bold font-display mb-1">Creatives</h3>
      <p className="text-xs text-muted-foreground mb-4">Creative Agent will generate 12 variants across email, LinkedIn, Meta, and display once audiences lock.</p>
      <div className="grid md:grid-cols-3 gap-3">
        {["Email", "LinkedIn", "Meta"].map((ch) => (
          <div key={ch} className="rounded-xl border border-dashed border-border p-6 text-center">
            <p className="text-sm font-semibold">{ch}</p>
            <p className="text-xs text-muted-foreground mt-1">4 variants queued</p>
            <div className="mt-3 h-1 rounded-full bg-secondary overflow-hidden">
              <div className="h-full w-1/3 bg-primary animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

const scenarioMultiplier = { Conservative: 0.7, Recommended: 1, Aggressive: 1.35 } as const;

export function StepChannelsBudget({ form, setForm }: StepProps) {
  const total = form.channels.reduce((s, c) => s + c.budget, 0);
  const m = scenarioMultiplier[form.scenario];
  const arrLow = Math.round(4_800_000 * m);
  const arrHigh = Math.round(9_200_000 * m);

  const setBudget = (id: string, v: number) => {
    setForm({ ...form, channels: form.channels.map((c) => c.id === id ? { ...c, budget: v } : c) });
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold font-display">Channels & budget</h3>
            <p className="text-xs text-muted-foreground">Editable allocation. Media Mix Agent will rebalance as signals evolve.</p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
            {(["Conservative", "Recommended", "Aggressive"] as const).map((s) => (
              <button key={s} onClick={() => setForm({ ...form, scenario: s })}
                className={cn("text-xs font-semibold px-3 py-1 rounded-md transition-all",
                  form.scenario === s ? "bg-background text-foreground shadow-sm" : "text-muted-foreground")}>
                {s}
              </button>
            ))}
          </div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-wide text-muted-foreground">
              <th className="text-left py-2">Channel</th>
              <th className="text-right py-2">Budget (USD)</th>
              <th className="text-right py-2">% of total</th>
            </tr>
          </thead>
          <tbody>
            {form.channels.map((c) => (
              <tr key={c.id} className="border-t border-border">
                <td className="py-2 font-medium">{c.name}</td>
                <td className="py-2 text-right">
                  <Input type="number" value={c.budget} onChange={(e) => setBudget(c.id, Number(e.target.value))} className="w-32 ml-auto text-right" />
                </td>
                <td className="py-2 text-right text-muted-foreground">{total ? Math.round((c.budget / total) * 100) : 0}%</td>
              </tr>
            ))}
            <tr className="border-t border-border font-bold">
              <td className="py-2">Total</td>
              <td className="py-2 text-right">${total.toLocaleString()}</td>
              <td />
            </tr>
          </tbody>
        </table>
      </Card>
      <div className="grid md:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Forecast ARR impact</p>
          <p className="text-lg font-bold mt-1">${(arrLow / 1_000_000).toFixed(1)}M – ${(arrHigh / 1_000_000).toFixed(1)}M</p>
        </Card>
        <Card className="p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Confidence range</p>
          <p className="text-lg font-bold mt-1">{Math.round(72 * m)}% – {Math.min(92, Math.round(85 * m))}%</p>
        </Card>
        <Card className="p-4 border-primary/30 bg-primary/5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Reallocation insight</p>
          <p className="text-xs mt-1">Move $5,000 from Display to Meta: projected +12% incremental conversion based on current signal strength.</p>
        </Card>
      </div>
    </div>
  );
}

export function StepLaunch({ form, missionId }: StepProps) {
  const [open, setOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [launching, setLaunching] = useState(false);
  const selected = form.audiences.filter((a) => a.included);
  const total = form.channels.reduce((s, c) => s + c.budget, 0);

  const launch = async () => {
    if (!missionId) { toast.error("Save the mission first"); return; }
    setLaunching(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      await supabase.from("missions").update({ status: "launched" }).eq("id", missionId);
      await supabase.from("mission_activity_log").insert({
        mission_id: missionId,
        owner_id: userData.user?.id!,
        actor: userData.user?.email ?? "user",
        agent: "Deployment Agent",
        action: "Campaign launched",
        status: "success",
        payload: { channels: form.channels, total_budget: total, audiences: selected.map((a) => a.id) },
      });
      toast.success("Campaign launched. Activity log entry written.");
      setOpen(false);
    } catch (e: any) {
      toast.error(e.message ?? "Launch failed");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-base font-bold font-display mb-4">Launch review</h3>
      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <ReviewRow label="Audience count" value={`${selected.reduce((s, a) => s + a.accounts, 0).toLocaleString()} accounts across ${selected.length} cohorts`} />
        <ReviewRow label="Channels selected" value={form.channels.map((c) => c.name).join(", ")} />
        <ReviewRow label="Budget cap" value={`$${total.toLocaleString()} / $${form.budget_ceiling.toLocaleString()}`} />
        <ReviewRow label="Required approvals" value="1 (Growth Lead)" />
        <ReviewRow label="Known risks" value="WhatsApp consent gap, Meta creative fatigue" />
        <ReviewRow label="Timeline" value={`${form.timeline_days} days`} />
        <ReviewRow label="Rollback plan" value="Auto-pause on ROAS<0.5 after 72h; manual rollback via Deployment Agent." full />
      </div>
      <div className="mt-6 flex justify-end">
        <Button size="lg" onClick={() => setOpen(true)}>
          <Rocket className="h-4 w-4" />
          Launch Campaign
        </Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm campaign launch</DialogTitle>
            <DialogDescription>An immutable activity log entry will be written and the Deployment Agent will assemble platform artifacts.</DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" className="mt-1" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} />
            <span>I confirm the audience, budget, and channels are correct.</span>
          </label>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={launch} disabled={!confirm || launching}>{launching ? "Launching…" : "Launch now"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function ReviewRow({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={cn("rounded-xl border border-border p-3", full && "md:col-span-2")}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm text-foreground mt-1">{value}</p>
    </div>
  );
}
