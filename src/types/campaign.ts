export interface AgentStatus {
  id: string;
  name: string;
  status: "idle" | "active" | "working" | "error";
  lastAction: string;
  nextAction: string;
  reasoning?: string;
  icon: string;
}

export interface Campaign {
  id: string;
  name: string;
  objective: string;
  status: "draft" | "active" | "paused" | "completed";
  budget: number;
  spent: number;
  roas: number;
  cac: number;
  conversions: number;
  startDate: string;
  endDate: string;
}

export interface CampaignBrief {
  objectiveType: string;
  targetKPI: string;
  targetValue: string;
  timeWindow: string;
  budgetMin: number;
  budgetMax: number;
  geo: string[];
  productCategory: string;
  constraints: string[];
  prioritySegments: string[];
  brandTone: string;
  // New enriched fields
  brandName: string;
  brandDescription: string;
  campaignName: string;
  occasion: string;
  targetAudience: string;
  ageRange: string;
  gender: string;
  painPoints: string;
  uniqueSellingPoints: string;
  competitorContext: string;
  keyMessages: string[];
  callToAction: string;
  landingPageUrl: string;
  promotionDetails: string;
  seasonality: string;
  previousCampaignLearnings: string;
}

export interface Cohort {
  id: string;
  name: string;
  size: number;
  expectedUplift: string;
  reasoning: string;
  messageAngle: string;
  type: string;
}

export interface CreativeVariant {
  id: string;
  angle: string;
  headline: string;
  shortCopy: string;
  longCopy: string;
  description: string;
  format: string;
  channel: string;
}

export interface ChannelAllocation {
  channel: string;
  budget: number;
  percentage: number;
  expectedCPA: string;
  expectedROAS: string;
  frequencyCap: string;
}

export interface AuditIssue {
  id: string;
  platform: string;
  category: "structure" | "targeting" | "creative" | "budget" | "tracking" | "performance";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  recommendation: string;
  impactScore: number;
  applied?: boolean;
}

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  status: "running" | "completed" | "archived" | "draft";
  variants: { name: string; traffic: number; conversions: number; revenue: number }[];
  successMetric: string;
  startDate: string;
  endDate?: string;
  winner?: string;
  confidence?: number;
}

export interface CustomerIntelligence {
  totalCustomers: number;
  avgLTV: number;
  churnRisk: { high: number; medium: number; low: number };
  topSegments: { name: string; size: number; ltv: number; churnRisk: string }[];
  lifecycleDistribution: { stage: string; count: number; percentage: number }[];
  channelPropensity: { channel: string; score: number }[];
}
