import { Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap, Brain, UserCheck, FlaskConical, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  Target, ShieldCheck, Users, Palette, BarChart3, Rocket, Zap, Brain, UserCheck, FlaskConical, Search,
};

interface AgentStepBannerProps {
  agentName: string;
  agentIcon: string;
  description: string;
  status?: "analyzing" | "working" | "complete" | "ready";
  capabilities?: string[];
}

const statusConfig = {
  analyzing: { label: "Analyzing", color: "bg-warning/10 text-warning", dot: "bg-warning animate-pulse" },
  working: { label: "Processing", color: "bg-primary/10 text-primary", dot: "bg-primary animate-pulse" },
  complete: { label: "Complete", color: "bg-success/10 text-success", dot: "bg-success" },
  ready: { label: "Ready", color: "bg-primary/10 text-primary", dot: "bg-primary" },
};

export function AgentStepBanner({ agentName, agentIcon, description, status = "ready", capabilities }: AgentStepBannerProps) {
  const Icon = iconMap[agentIcon] || Brain;
  const s = statusConfig[status];

  return (
    <div className="bg-card border border-primary/20 rounded-xl p-4 flex items-start gap-3 shadow-sm">
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <h3 className="text-sm font-bold text-foreground font-display">{agentName}</h3>
          <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1.5", s.color)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
            {s.label}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {capabilities && capabilities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {capabilities.map((cap) => (
              <span key={cap} className="text-[10px] font-medium text-muted-foreground bg-secondary rounded-full px-2 py-0.5">
                {cap}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Agent config for each step
export const stepAgents = [
  {
    step: 1,
    agentName: "Objective Agent",
    agentIcon: "Target",
    description: "Captures campaign goals, KPIs, brand context, and constraints to define the mission brief.",
    capabilities: ["Goal Setting", "KPI Definition", "Budget Framing", "Brand Profiling"],
  },
  {
    step: 2,
    agentName: "Data Readiness Agent",
    agentIcon: "ShieldCheck",
    description: "Scans data sources, validates compliance (GDPR/CCPA), and confirms platform integrations.",
    capabilities: ["Data Audit", "Compliance Check", "Integration Scan", "Privacy Validation"],
  },
  {
    step: 3,
    agentName: "Segmentation Agent",
    agentIcon: "Users",
    description: "Builds intelligent audience cohorts using behavioral, demographic, and predictive signals.",
    capabilities: ["Cohort Building", "Lookalike Modeling", "Churn Prediction", "LTV Scoring"],
  },
  {
    step: 4,
    agentName: "Creative Agent",
    agentIcon: "Palette",
    description: "Generates ad copy, headlines, and visuals tailored to each audience cohort and channel.",
    capabilities: ["Copywriting", "Image Generation", "A/B Variants", "Multi-Format Ads"],
  },
  {
    step: 5,
    agentName: "Media Mix Agent",
    agentIcon: "BarChart3",
    description: "Selects optimal channels, allocates budget, and simulates KPI outcomes across platforms.",
    capabilities: ["Channel Selection", "Budget Optimization", "ROAS Simulation", "Frequency Capping"],
  },
  {
    step: 6,
    agentName: "Deployment Agent",
    agentIcon: "Rocket",
    description: "Assembles platform artifacts (Google Ads, Meta, Email) and deploys campaigns to live platforms.",
    capabilities: ["Artifact Assembly", "Platform Push", "Approval Routing", "Launch Verification"],
  },
  {
    step: 7,
    agentName: "Optimizer + Experiment Agent",
    agentIcon: "Zap",
    description: "Monitors live performance, auto-optimizes bids/budgets, and runs A/B experiments autonomously.",
    capabilities: ["Real-time Monitoring", "Auto-Optimization", "A/B Testing", "Anomaly Detection"],
    secondary: {
      agentName: "Experiment Agent",
      agentIcon: "FlaskConical",
      description: "Designs and runs controlled experiments to validate hypotheses and find winning strategies.",
    },
  },
];
