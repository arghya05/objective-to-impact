import { useState, useEffect } from "react";
import { Users, TrendingUp, Tag, Sparkles, Loader2 } from "lucide-react";
import { Cohort, CampaignBrief } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Props {
  brief: CampaignBrief;
  onNext: () => void;
  onBack: () => void;
}

export function AudienceCohorts({ brief, onNext, onBack }: Props) {
  const [cohorts, setCohorts] = useState<Cohort[]>([]);
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>([]);
  const [pilotMode, setPilotMode] = useState<"brand" | "category">("brand");
  const [generating, setGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Auto-generate on mount when brief has objective
  useEffect(() => {
    if (brief.objectiveType && !hasGenerated) {
      handleGenerateCohorts();
    }
  }, []);

  const toggleCohort = (id: string) => {
    setSelectedCohorts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleGenerateCohorts = async () => {
    setGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-cohorts", {
        body: {
          objective: brief.objectiveType ? `maximize ${brief.objectiveType}` : "maximize ROAS",
          objectiveType: brief.objectiveType || "ROAS",
          targetKPI: brief.targetKPI || brief.objectiveType || "ROAS",
          targetValue: brief.targetValue || "4.0x",
          productCategory: brief.productCategory || "general e-commerce",
          geo: brief.geo.join(", ") || "US",
          budgetMin: brief.budgetMin,
          budgetMax: brief.budgetMax,
          budgetRange: `$${(brief.budgetMin / 1000).toFixed(0)}K-$${(brief.budgetMax / 1000).toFixed(0)}K`,
          brandTone: brief.brandTone || "Professional",
          timeWindow: brief.timeWindow || "30 days",
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (data?.cohorts) {
        const mapped: Cohort[] = data.cohorts.map((c: any, i: number) => ({
          id: `ai-${i}`,
          name: c.name,
          size: c.size,
          expectedUplift: c.expectedUplift,
          reasoning: c.reasoning,
          messageAngle: c.messageAngle,
          type: c.type,
        }));
        setCohorts(mapped);
        setSelectedCohorts([mapped[0]?.id, mapped[1]?.id].filter(Boolean));
        setHasGenerated(true);
        toast.success(`Segments optimized for ${brief.objectiveType || "ROAS"} in ${brief.productCategory || "e-commerce"}!`);
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e.message || "Failed to generate segments");
    } finally {
      setGenerating(false);
    }
  };

  const typeColors: Record<string, string> = {
    RFM: "text-primary",
    Lifecycle: "text-success",
    Behavioral: "text-warning",
    Affinity: "bg-card text-foreground",
    Lookalike: "text-primary",
  };

  return (
    <div className="space-y-6">
      {/* Objective context banner */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground">Segments optimized for</p>
          <p className="text-sm font-semibold text-foreground">
            {brief.objectiveType || "ROAS"} · {brief.productCategory || "All Categories"} · {brief.geo.join(", ") || "US"}
          </p>
          {brief.targetKPI && (
            <p className="text-xs text-muted-foreground mt-0.5">
              Target: {brief.targetKPI} {brief.targetValue} · {brief.timeWindow}
            </p>
          )}
        </div>
        <span className="text-xs font-mono text-primary">${(brief.budgetMin / 1000).toFixed(0)}K–${(brief.budgetMax / 1000).toFixed(0)}K</span>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">AI-Recommended Cohorts</h2>
          <div className="flex items-center gap-3">
            {cohorts.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedCohorts.length} selected · {cohorts.filter(c => selectedCohorts.includes(c.id)).reduce((a, b) => a + b.size, 0).toLocaleString()} total reach
              </span>
            )}
            <button
              onClick={handleGenerateCohorts}
              disabled={generating}
              className="px-4 py-2 bg-primary/10 text-primary rounded-md text-xs font-medium hover:bg-primary/20 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {generating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
              {generating ? "Analyzing data..." : "Regenerate Segments"}
            </button>
          </div>
        </div>

        {generating && cohorts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing {brief.productCategory || "e-commerce"} data for {brief.objectiveType || "ROAS"} optimization...</p>
            <p className="text-xs text-muted-foreground">Building segments based on RFM, lifecycle, and behavioral signals</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cohorts.map((cohort) => (
              <div
                key={cohort.id}
                onClick={() => toggleCohort(cohort.id)}
                className={cn(
                  "border rounded-lg p-4 cursor-pointer transition-all",
                  selectedCohorts.includes(cohort.id)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-border/80 bg-secondary/20"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded", typeColors[cohort.type])}>{cohort.type}</span>
                      <h3 className="text-sm font-medium text-foreground">{cohort.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cohort.reasoning}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> {cohort.size.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-success">
                        <TrendingUp className="h-3 w-3" /> {cohort.expectedUplift}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-primary">
                        <Tag className="h-3 w-3" /> {cohort.messageAngle}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 mt-1",
                    selectedCohorts.includes(cohort.id) ? "border-primary bg-primary" : "border-border"
                  )}>
                    {selectedCohorts.includes(cohort.id) && (
                      <svg className="h-3 w-3 text-primary-foreground" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pilot Selection */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Pilot Selection</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPilotMode("brand")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
              pilotMode === "brand" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            2 Brands + 1 Category
          </button>
          <button
            onClick={() => setPilotMode("category")}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs font-medium border transition-colors",
              pilotMode === "category" ? "bg-primary text-primary-foreground border-primary" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            1 Brand + 2 Cohorts
          </button>
        </div>
        <div className="bg-secondary/50 rounded-md p-4">
          <p className="text-xs text-muted-foreground">
            {pilotMode === "brand"
              ? `Pilot with Brand A & Brand B across ${brief.productCategory || "Electronics"} category. Scale plan: expand to 5 brands + 3 categories post-validation.`
              : `Pilot with Brand A targeting ${selectedCohorts.length >= 2 ? "top 2 selected cohorts" : "High-Value & Churn Risk cohorts"}. Scale plan: add remaining cohorts post-validation.`}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">← Back</button>
        <button onClick={onNext} className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">Continue to Creatives →</button>
      </div>
    </div>
  );
}
