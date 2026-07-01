
## Goal
Add "Revenue Mission Control" as a new, self-contained feature on route `/mission-control`, reachable from the top nav. Nothing in the existing Campaign Builder, Growth Brain, Agent Panel, or edge functions is modified.

## Non-goals (to protect existing flow)
- Do NOT change the current 7-step Campaign Builder, its stepper, or any `builder/*` component.
- Do NOT modify the existing shared `AgentPanel` (11 vs 7 agents lives inside the new page only).
- Do NOT alter existing routes, edge functions, or Growth Brain deep-links.

## What gets added

### 1. Route + nav
- New route `/mission-control` in `src/App.tsx`.
- Add "Mission Control" link to `TopNav.tsx` (additive only).

### 2. New page + components (all under `src/pages/MissionControl.tsx` and `src/components/mission/`)
- `MissionControl.tsx` — page shell with its own local 11-agent sidebar (separate from the global one), 6-step stepper, and step content router. Uses the existing `AppLayout` so the global shell/agent panel stays intact.
- `MissionAgentRail.tsx` — the "Agent Activity (7/11)" rail with 11 mock agents, colored status dots, pills, "Next:" line, and a right-side drawer (shadcn `Sheet`) showing recent actions, confidence, source data, dependencies.
- `OpportunityBanner.tsx` — "Pre-filled from Growth Brain" banner with Critical badge, +$8.6M ARR, and "Explain recommendation" opening a `Sheet` with predicted revenue at risk, affected accounts, confidence, key signals, data freshness, assumptions, "View source data".
- `MissionStepper.tsx` — 6-step progress bar (Objective → Launch & Deploy) with the responsible agent under each step and dependency-blocking.
- `DecisionRecord.tsx` — the core differentiator card: decision, owner, confidence, ARR range, test budget, forecast period, primary/secondary KPIs, risks, evidence source cards, assumptions, audit status. Buttons: Approve (opens approval `Dialog` with approver name, budget cap, approved channels, checkbox, "require approval for future budget changes"), Request changes, Save as draft, Export decision record (downloads JSON).
- Step content components: `StepObjective.tsx`, `StepDataCompliance.tsx`, `StepAudiences.tsx`, `StepCreatives.tsx` (light placeholder — audiences+channels are the priority), `StepChannelsBudget.tsx` (editable allocation table + Conservative/Recommended/Aggressive toggle + reallocation insight), `StepLaunch.tsx` (final review + Launch confirmation dialog that writes an immutable activity log entry).
- `ForecastVsActual.tsx` — monitoring section with recharts line/bar charts (recharts already in deps), holdout panel.
- `ActivityLog.tsx` — searchable, filter by agent/date/status/campaign.

All UI uses existing shadcn primitives and semantic tokens from `index.css`. No new fonts, no new color tokens.

### 3. Persistence (Lovable Cloud)
Auth is required for RLS. Add a minimal `/auth` sign-in page (email+password + Google) ONLY if the user hits Mission Control unauthenticated — existing pages continue to work anonymously with mock data as they do today.

New tables (each with GRANTs + RLS scoped to `auth.uid() = owner_id`):
- `missions` — campaign draft: name, objective, kpi, target_arr, budget_ceiling, timeline_days, brand fields, status (`draft|pending_approval|approved|launched`), current_step, form JSONB.
- `mission_decisions` — 1:1 with mission: confidence, arr_low, arr_high, test_budget, risks JSONB, assumptions JSONB, evidence JSONB, audit_status.
- `mission_approvals` — approver_name, budget_cap, approved_channels, require_future_approval, approved_at.
- `mission_activity_log` — append-only: mission_id, actor, agent, action, status, payload JSONB, created_at. Immutable via policy (INSERT + SELECT only, no UPDATE/DELETE).

State also mirrored to `localStorage` for fast reloads and to survive unauth sessions.

### 4. Loading / empty / error states
- Processing agents show a shimmer bar.
- Missing integrations show empty-state cards with a "Connect" CTA (mock).
- Approval, launch, and save actions use `sonner` toasts (already wired).

## Technical notes
- Recharts is already installed (`src/components/ui/chart.tsx` uses it) — no new deps.
- No edge function work. All data is client ↔ Cloud via the existing `supabase` client.
- Types will regenerate after the migration is approved; page code that reads the new tables is written after that.

## Order of operations
1. Run the migration (tables + RLS + GRANTs). — awaits your approval
2. After migration approval: add route, TopNav link, page shell, agent rail, stepper, banner, decision record, step components, monitoring, activity log, and auth guard for `/mission-control`.
3. Wire persistence + approval/launch flows + activity log writes.
4. Smoke-test with Playwright (load page, open drawer, approve, launch, confirm activity log row).

Say the word and I'll run the migration first, then build the UI in one pass.
