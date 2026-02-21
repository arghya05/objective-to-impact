import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignBrief } from "@/types/campaign";
import { ObjectiveIntake } from "@/components/builder/ObjectiveIntake";
import { DataReadiness } from "@/components/builder/DataReadiness";
import { AudienceCohorts } from "@/components/builder/AudienceCohorts";
import { CreativeStudio } from "@/components/builder/CreativeStudio";
import { ChannelBudget } from "@/components/builder/ChannelBudget";
import { LaunchCenter } from "@/components/builder/LaunchCenter";
import { MonitoringStep } from "@/components/builder/MonitoringStep";

const steps = [
  { id: 1, label: "Objective", short: "OBJ" },
  { id: 2, label: "Data & Compliance", short: "DATA" },
  { id: 3, label: "Audiences", short: "AUD" },
  { id: 4, label: "Creatives", short: "CRE" },
  { id: 5, label: "Channels & Budget", short: "CH" },
  { id: 6, label: "Launch", short: "LCH" },
  { id: 7, label: "Monitoring", short: "MON" },
];

const defaultBrief: CampaignBrief = {
  objectiveType: "",
  targetKPI: "",
  targetValue: "",
  timeWindow: "30 days",
  budgetMin: 10000,
  budgetMax: 50000,
  geo: ["US"],
  productCategory: "",
  constraints: [],
  prioritySegments: [],
  brandTone: "Professional",
};

const CampaignBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [brief, setBrief] = useState<CampaignBrief>(defaultBrief);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ObjectiveIntake brief={brief} onBriefChange={setBrief} onNext={() => setCurrentStep(2)} />;
      case 2: return <DataReadiness onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3: return <AudienceCohorts brief={brief} onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4: return <CreativeStudio brief={brief} onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5: return <ChannelBudget brief={brief} onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6: return <LaunchCenter onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
      case 7: return <MonitoringStep onBack={() => setCurrentStep(6)} />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Campaign Builder</h1>
        <p className="text-sm text-muted-foreground mt-1">Create and configure your campaign step by step</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap",
                currentStep === step.id && "bg-primary text-primary-foreground shadow-sm",
                currentStep > step.id && "bg-success/10 text-success",
                currentStep < step.id && "bg-secondary text-muted-foreground hover:bg-secondary/80"
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <span className="font-mono text-[10px] opacity-60">{step.id}</span>
              )}
              <span className="hidden md:inline">{step.label}</span>
              <span className="md:hidden">{step.short}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3.5 w-3.5 text-border mx-1 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      <div className="animate-slide-in">
        {renderStep()}
      </div>
    </div>
  );
};

export default CampaignBuilder;
