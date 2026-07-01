
-- MISSIONS
CREATE TABLE public.missions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Untitled Mission',
  objective TEXT,
  primary_kpi TEXT,
  target_arr NUMERIC,
  budget_ceiling NUMERIC,
  timeline_days INTEGER,
  brand_name TEXT,
  brand_description TEXT,
  brand_tone TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  current_step INTEGER NOT NULL DEFAULT 1,
  form JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.missions TO authenticated;
GRANT ALL ON public.missions TO service_role;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own missions" ON public.missions
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- DECISIONS
CREATE TABLE public.mission_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  decision_text TEXT,
  owner_role TEXT,
  confidence INTEGER,
  arr_low NUMERIC,
  arr_high NUMERIC,
  test_budget NUMERIC,
  forecast_period_days INTEGER,
  primary_kpi TEXT,
  secondary_kpis JSONB NOT NULL DEFAULT '[]'::jsonb,
  risks JSONB NOT NULL DEFAULT '[]'::jsonb,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  assumptions JSONB NOT NULL DEFAULT '[]'::jsonb,
  audit_status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_decisions TO authenticated;
GRANT ALL ON public.mission_decisions TO service_role;
ALTER TABLE public.mission_decisions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own decisions" ON public.mission_decisions
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- APPROVALS
CREATE TABLE public.mission_approvals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID NOT NULL REFERENCES public.missions(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_name TEXT NOT NULL,
  budget_cap NUMERIC NOT NULL,
  approved_channels JSONB NOT NULL DEFAULT '[]'::jsonb,
  require_future_approval BOOLEAN NOT NULL DEFAULT false,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mission_approvals TO authenticated;
GRANT ALL ON public.mission_approvals TO service_role;
ALTER TABLE public.mission_approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own approvals" ON public.mission_approvals
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- IMMUTABLE ACTIVITY LOG (insert + select only)
CREATE TABLE public.mission_activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  actor TEXT NOT NULL,
  agent TEXT,
  action TEXT NOT NULL,
  status TEXT,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.mission_activity_log TO authenticated;
GRANT ALL ON public.mission_activity_log TO service_role;
ALTER TABLE public.mission_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users read own activity" ON public.mission_activity_log
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users insert own activity" ON public.mission_activity_log
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
-- no UPDATE or DELETE policies => append-only

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_missions_updated
  BEFORE UPDATE ON public.missions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER trg_mission_decisions_updated
  BEFORE UPDATE ON public.mission_decisions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-set owner_id on insert if omitted
CREATE OR REPLACE FUNCTION public.set_owner_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.owner_id IS NULL THEN
    NEW.owner_id = auth.uid();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_missions_owner BEFORE INSERT ON public.missions
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();
CREATE TRIGGER trg_decisions_owner BEFORE INSERT ON public.mission_decisions
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();
CREATE TRIGGER trg_approvals_owner BEFORE INSERT ON public.mission_approvals
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();
CREATE TRIGGER trg_activity_owner BEFORE INSERT ON public.mission_activity_log
  FOR EACH ROW EXECUTE FUNCTION public.set_owner_id();

CREATE INDEX idx_missions_owner ON public.missions(owner_id);
CREATE INDEX idx_decisions_mission ON public.mission_decisions(mission_id);
CREATE INDEX idx_approvals_mission ON public.mission_approvals(mission_id);
CREATE INDEX idx_activity_mission ON public.mission_activity_log(mission_id);
CREATE INDEX idx_activity_created ON public.mission_activity_log(created_at DESC);
