import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MissionAgentRail } from "@/components/mission/MissionAgentRail";
import { OpportunityBanner } from "@/components/mission/OpportunityBanner";
import { MissionStepper, missionSteps } from "@/components/mission/MissionStepper";
import { DecisionRecord } from "@/components/mission/DecisionRecord";
import { StepObjective, StepDataCompliance, StepAudiences, StepCreatives, StepChannelsBudget, StepLaunch } from "@/components/mission/steps";
import { ForecastVsActual } from "@/components/mission/ForecastVsActual";
import { ActivityLog } from "@/components/mission/ActivityLog";
import { defaultMissionForm, type MissionForm } from "@/lib/mission-mock";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

const LS_KEY = "nyx.mission.form";

export default function MissionControl() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [missionId, setMissionId] = useState<string | null>(null);
  const [current, setCurrent] = useState(1);
  const [form, setForm] = useState<MissionForm>(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? { ...defaultMissionForm, ...JSON.parse(raw) } : defaultMissionForm;
    } catch { return defaultMissionForm; }
  });

  // auth gate
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
      if (!session) navigate(`/auth?redirect=/mission-control`, { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate(`/auth?redirect=/mission-control`, { replace: true });
      else setUserId(data.session.user.id);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  // load or create mission for this user
  useEffect(() => {
    if (!userId) return;
    (async () => {
      const { data: existing } = await supabase.from("missions").select("*").eq("owner_id", userId).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (existing) {
        setMissionId(existing.id);
        setCurrent(existing.current_step ?? 1);
        if (existing.form && typeof existing.form === "object") setForm({ ...defaultMissionForm, ...(existing.form as any) });
      } else {
        const { data: created } = await supabase.from("missions").insert({
          owner_id: userId,
          name: form.campaign_name,
          objective: form.objective,
          primary_kpi: form.primary_kpi,
          target_arr: form.target_arr,
          budget_ceiling: form.budget_ceiling,
          timeline_days: form.timeline_days,
          brand_name: form.brand_name,
          brand_description: form.brand_description,
          brand_tone: form.brand_tone,
          form: form as any,
        }).select().single();
        if (created) {
          setMissionId(created.id);
          await supabase.from("mission_activity_log").insert({
            mission_id: created.id, owner_id: userId, actor: "system", agent: "Objective Agent",
            action: "Mission created", status: "success", payload: { source: "growth_brain" },
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  // persist form to LS + debounced Cloud
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(form));
  }, [form]);

  useEffect(() => {
    if (!missionId) return;
    const t = setTimeout(() => {
      supabase.from("missions").update({
        name: form.campaign_name, objective: form.objective, primary_kpi: form.primary_kpi,
        target_arr: form.target_arr, budget_ceiling: form.budget_ceiling, timeline_days: form.timeline_days,
        brand_name: form.brand_name, brand_description: form.brand_description, brand_tone: form.brand_tone,
        current_step: current, form: form as any,
      }).eq("id", missionId);
    }, 700);
    return () => clearTimeout(t);
  }, [form, current, missionId]);

  const blocked = form.compliance_checks.some((c: any) => !c.ok) ? [] : []; // demo: no hard blocks

  const stepProps = { form, setForm, missionId };
  const renderStep = () => {
    switch (current) {
      case 1: return <StepObjective {...stepProps} />;
      case 2: return <StepDataCompliance {...stepProps} />;
      case 3: return <StepAudiences {...stepProps} />;
      case 4: return <StepCreatives {...stepProps} />;
      case 5: return <StepChannelsBudget {...stepProps} />;
      case 6: return <StepLaunch {...stepProps} />;
      default: return null;
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
  };

  if (!userId) return null;

  return (
    <div className="flex h-full min-h-[calc(100vh-8rem)]">
      <MissionAgentRail />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-6 space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-primary">Nyx · Revenue Mission Control</p>
              <h1 className="text-2xl font-bold font-display tracking-tight mt-1">Campaign Builder</h1>
              <p className="text-sm text-muted-foreground mt-1">Turn AI agent recommendations into governed, measurable actions.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut className="h-4 w-4" />Sign out</Button>
          </div>

          <OpportunityBanner />
          <MissionStepper current={current} blocked={[]} onChange={setCurrent} />

          <div className="grid xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-5">{renderStep()}</div>
            <div className="space-y-5"><DecisionRecord missionId={missionId} form={form} onApproved={() => setCurrent(6)} /></div>
          </div>

          <div className="flex justify-between pt-2">
            <Button variant="outline" disabled={current === 1} onClick={() => setCurrent(Math.max(1, current - 1))}>Back</Button>
            <Button disabled={current === missionSteps.length} onClick={() => setCurrent(Math.min(missionSteps.length, current + 1))}>Continue</Button>
          </div>

          <div className="pt-4 border-t border-border">
            <h2 className="text-lg font-bold font-display tracking-tight mb-3">Forecast vs Actual</h2>
            <ForecastVsActual />
          </div>

          <ActivityLog missionId={missionId} />
        </div>
      </div>
    </div>
  );
}
