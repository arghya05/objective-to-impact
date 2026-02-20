export interface AgentStatus {
  id: string;
  name: string;
  status: "idle" | "active" | "working" | "error";
  lastAction: string;
  nextAction: string;
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
