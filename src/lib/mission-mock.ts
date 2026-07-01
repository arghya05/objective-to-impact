import { Target, Brain, ShieldCheck, Users, Sparkles, Palette, BarChart3, Rocket, Zap, FlaskConical, UserCheck } from "lucide-react";

export type AgentStatus = "Active" | "Processing" | "Idle" | "Blocked";

export interface MissionAgent {
  id: string;
  name: string;
  status: AgentStatus;
  summary: string;
  next: string;
  icon: any;
  confidence: number;
  recent: { time: string; action: string }[];
  sources: string[];
  dependencies: string[];
}

export const missionAgents: MissionAgent[] = [
  { id: "objective", name: "Objective Agent", status: "Idle", icon: Target, summary: "Awaiting refined ARR target from Growth Lead.", next: "Confirm objective locks with owner.", confidence: 92,
    recent: [{ time: "2h ago", action: "Loaded Growth Brain opportunity" }, { time: "3h ago", action: "Suggested $8.6M ARR target" }],
    sources: ["Growth Brain forecast", "CRM ARR snapshot"], dependencies: ["None"] },
  { id: "customer-intel", name: "Customer Intelligence", status: "Processing", icon: Brain, summary: "Scoring 240 at-risk accounts across engagement signals.", next: "Publish churn-risk cohort v3.", confidence: 78,
    recent: [{ time: "5m ago", action: "Refreshed product-usage decay signal" }, { time: "22m ago", action: "Merged support ticket sentiment" }],
    sources: ["Product analytics", "Support platform", "CRM"], dependencies: ["Data Readiness Agent"] },
  { id: "data-readiness", name: "Data Readiness Agent", status: "Active", icon: ShieldCheck, summary: "All primary sources healthy; WhatsApp consent partial.", next: "Flag 18% consent gap for review.", confidence: 88,
    recent: [{ time: "12m ago", action: "Verified Stripe + Salesforce sync" }, { time: "40m ago", action: "Detected WhatsApp opt-in gap" }],
    sources: ["Salesforce", "Stripe", "HubSpot"], dependencies: ["None"] },
  { id: "segmentation", name: "Segmentation Agent", status: "Processing", icon: Users, summary: "Building 3 recommended cohorts for retention play.", next: "Emit final cohort manifest to Personalization.", confidence: 81,
    recent: [{ time: "1m ago", action: "Rebuilt High-LTV Champions cohort" }, { time: "14m ago", action: "Excluded 42 duplicate accounts" }],
    sources: ["CDP", "Product analytics"], dependencies: ["Customer Intelligence"] },
  { id: "personalization", name: "Personalization Agent", status: "Active", icon: Sparkles, summary: "Aligning message angles per cohort tier.", next: "Deliver angle map to Creative Agent.", confidence: 84,
    recent: [{ time: "9m ago", action: "Ranked 6 value propositions" }],
    sources: ["Historical campaign lift"], dependencies: ["Segmentation Agent"] },
  { id: "creative", name: "Creative Agent", status: "Idle", icon: Palette, summary: "Waiting on angle map before drafting.", next: "Generate 12 creatives across 3 formats.", confidence: 0,
    recent: [], sources: ["Brand kit", "Winning creative archive"], dependencies: ["Personalization Agent"] },
  { id: "media-mix", name: "Media Mix Agent", status: "Idle", icon: BarChart3, summary: "Ready to allocate $45k test budget.", next: "Publish recommended channel split.", confidence: 0,
    recent: [], sources: ["Historical ROAS", "Bid landscape"], dependencies: ["Creative Agent"] },
  { id: "deployment", name: "Deployment Agent", status: "Idle", icon: Rocket, summary: "Awaiting approved decision record.", next: "Assemble platform artifacts.", confidence: 0,
    recent: [], sources: ["Meta API", "LinkedIn API"], dependencies: ["Approval"] },
  { id: "optimizer", name: "Optimizer Agent", status: "Active", icon: Zap, summary: "Monitoring 3 in-flight campaigns for anomalies.", next: "Rebalance bids on Meta lookalikes.", confidence: 86,
    recent: [{ time: "3m ago", action: "Auto-paused underperforming ad set" }],
    sources: ["Meta Ads", "Google Ads"], dependencies: ["None"] },
  { id: "experiment", name: "Experiment Agent", status: "Processing", icon: FlaskConical, summary: "Designing 10% holdout for incremental lift test.", next: "Lock holdout assignment.", confidence: 74,
    recent: [{ time: "8m ago", action: "Sized control group" }],
    sources: ["Attribution warehouse"], dependencies: ["Segmentation Agent"] },
  { id: "governance", name: "Governance Agent", status: "Active", icon: UserCheck, summary: "Compliance rules and approvals synced.", next: "Watch for policy drift.", confidence: 95,
    recent: [{ time: "1h ago", action: "Loaded regional privacy rules" }],
    sources: ["Policy library"], dependencies: ["None"] },
];

export const defaultMissionForm = {
  brand_name: "Nyx",
  brand_description: "Enterprise AI campaign operating system for revenue teams.",
  brand_tone: "Premium",
  campaign_name: "Activate At-Risk Champions before churn",
  objective: "Retention",
  primary_kpi: "Retained ARR",
  target_arr: 8600000,
  budget_ceiling: 45000,
  timeline_days: 60,
  audience_exclusions: "Trial accounts, employees, competitors",
  compliance_notes: "GDPR + CCPA; WhatsApp requires explicit opt-in.",
  campaign_owner: "Growth Lead",
  data_sources: [
    { name: "Salesforce", status: "connected", health: "healthy" },
    { name: "Stripe", status: "connected", health: "healthy" },
    { name: "HubSpot", status: "connected", health: "healthy" },
    { name: "Product Analytics", status: "connected", health: "partial" },
    { name: "Support Platform", status: "connected", health: "healthy" },
    { name: "Meta Ads", status: "connected", health: "healthy" },
  ],
  compliance_checks: [
    { label: "Consent validation", ok: true },
    { label: "Regional privacy restrictions", ok: true },
    { label: "Audience suppression list", ok: true },
    { label: "Claims and messaging review", ok: true },
    { label: "WhatsApp opt-in coverage", ok: false, warning: "Incomplete for 18% of selected audience." },
  ],
  audiences: [
    { id: "champions", name: "High-LTV Champions at churn risk", accounts: 240, arr: 8600000, risk: "Critical", included: true, note: "$8.6M ARR at risk" },
    { id: "growth", name: "Growth accounts with declining usage", accounts: 410, arr: 4200000, risk: "High", included: true, note: "$4.2M expansion potential" },
    { id: "downgraded", name: "Recently downgraded accounts", accounts: 175, arr: 1900000, risk: "Medium", included: false, note: "High reactivation potential" },
  ],
  channels: [
    { id: "email", name: "Lifecycle email", budget: 5000 },
    { id: "linkedin", name: "LinkedIn", budget: 12000 },
    { id: "meta", name: "Meta", budget: 15000 },
    { id: "display", name: "Retargeting display", budget: 8000 },
    { id: "cs", name: "Customer-success outreach", budget: 5000 },
  ],
  scenario: "Recommended" as "Conservative" | "Recommended" | "Aggressive",
};

export const defaultDecision = {
  decision_text: "Launch retention campaign for at-risk high-LTV accounts",
  owner_role: "Growth Lead",
  confidence: 78,
  arr_low: 5200000,
  arr_high: 8600000,
  test_budget: 45000,
  forecast_period_days: 60,
  primary_kpi: "Retained ARR",
  secondary_kpis: ["Retention rate", "CAC", "Pipeline influenced"],
  risks: [
    "Consent coverage incomplete for WhatsApp",
    "Creative fatigue risk for Meta lookalikes",
  ],
  evidence: [
    { source: "Salesforce CRM", detail: "240 accounts flagged with declining engagement", updated: "2h ago" },
    { source: "Stripe Billing", detail: "60-day renewal window on $8.6M ARR", updated: "1h ago" },
    { source: "Product Analytics", detail: "37% median usage decline last 30 days", updated: "35m ago" },
    { source: "Support Platform", detail: "Elevated critical ticket volume in cohort", updated: "12m ago" },
    { source: "Meta Ads", detail: "Baseline CTR 2.4% on retention creative", updated: "1d ago" },
  ],
  assumptions: [
    "Baseline churn rate: 14% annualized",
    "Eligible audience: 240 accounts with active contracts",
    "Attribution window: 60 days multi-touch",
  ],
  audit_status: "Ready for approval",
};

export type MissionForm = typeof defaultMissionForm;
