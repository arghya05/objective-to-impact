import { useState } from "react";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
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

const CampaignBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <ObjectiveIntake onNext={() => setCurrentStep(2)} />;
      case 2: return <DataReadiness onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />;
      case 3: return <AudienceCohorts onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />;
      case 4: return <CreativeStudio onNext={() => setCurrentStep(5)} onBack={() => setCurrentStep(3)} />;
      case 5: return <ChannelBudget onNext={() => setCurrentStep(6)} onBack={() => setCurrentStep(4)} />;
      case 6: return <LaunchCenter onNext={() => setCurrentStep(7)} onBack={() => setCurrentStep(5)} />;
      case 7: return <MonitoringStep onBack={() => setCurrentStep(6)} />;
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Campaign Builder</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Create and configure your campaign step by step</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            <button
              onClick={() => setCurrentStep(step.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                currentStep === step.id && "bg-primary text-primary-foreground",
                currentStep > step.id && "bg-success/15 text-success",
                currentStep < step.id && "bg-secondary text-muted-foreground"
              )}
            >
              {currentStep > step.id ? (
                <Check className="h-3 w-3" />
              ) : (
                <span className="font-mono text-[10px]">{step.id}</span>
              )}
              <span className="hidden md:inline">{step.label}</span>
              <span className="md:hidden">{step.short}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground mx-1 shrink-0" />
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
