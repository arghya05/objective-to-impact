import { useState, useEffect } from "react";
import { Users, TrendingUp, Tag, Sparkles, Loader2 } from "lucide-react";
import { Cohort, CampaignBrief } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AgentStepBanner, stepAgents } from "./AgentStepBanner";

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
          brandName: brief.brandName || "",
          occasion: brief.occasion || "",
          targetAudience: brief.targetAudience || "",
          ageRange: brief.ageRange || "",
          gender: brief.gender || "",
          painPoints: brief.painPoints || "",
          uniqueSellingPoints: brief.uniqueSellingPoints || "",
          promotionDetails: brief.promotionDetails || "",
          seasonality: brief.seasonality || "",
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
    RFM: "text-primary bg-primary/10",
    Lifecycle: "text-success bg-success/10",
    Behavioral: "text-warning bg-warning/10",
    Affinity: "text-foreground bg-secondary",
    Lookalike: "text-primary bg-primary/10",
  };

  return (
    <div className="space-y-6">
      <AgentStepBanner {...stepAgents[2]} status={generating ? "working" : hasGenerated ? "complete" : "ready"} />
      {/* Objective context banner */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium">Segments optimized for</p>
          <p className="text-sm font-bold text-foreground font-display">
            {brief.brandName || "Brand"} · {brief.objectiveType || "ROAS"} · {brief.productCategory || "All Categories"} · {brief.geo.join(", ") || "US"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {brief.occasion && <span>{brief.occasion} · </span>}
            Target: {brief.targetKPI || brief.objectiveType} {brief.targetValue} · {brief.timeWindow}
            {brief.targetAudience && <span> · Audience: {brief.targetAudience.slice(0, 50)}...</span>}
          </p>
        </div>
        <span className="text-xs font-mono text-primary font-semibold">${(brief.budgetMin / 1000).toFixed(0)}K–${(brief.budgetMax / 1000).toFixed(0)}K</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-foreground font-display">AI-Recommended Cohorts</h2>
          <div className="flex items-center gap-3">
            {cohorts.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {selectedCohorts.length} selected · {cohorts.filter(c => selectedCohorts.includes(c.id)).reduce((a, b) => a + b.size, 0).toLocaleString()} total reach
              </span>
            )}
            <button
              onClick={handleGenerateCohorts}
              disabled={generating}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
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
                  "border rounded-xl p-4 cursor-pointer transition-all",
                  selectedCohorts.includes(cohort.id)
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", typeColors[cohort.type])}>{cohort.type}</span>
                      <h3 className="text-sm font-semibold text-foreground">{cohort.name}</h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{cohort.reasoning}</p>
                    <div className="flex items-center gap-4 mt-2.5">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" /> {cohort.size.toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-success font-medium">
                        <TrendingUp className="h-3 w-3" /> {cohort.expectedUplift}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-primary">
                        <Tag className="h-3 w-3" /> {cohort.messageAngle}
                      </span>
                    </div>
                  </div>
                  <div className={cn(
                    "h-5 w-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-1 transition-all",
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
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-4 font-display">Pilot Selection</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setPilotMode("brand")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
              pilotMode === "brand" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            2 Brands + 1 Category
          </button>
          <button
            onClick={() => setPilotMode("category")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-semibold border transition-all",
              pilotMode === "category" ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-secondary text-secondary-foreground border-border"
            )}
          >
            1 Brand + 2 Cohorts
          </button>
        </div>
        <div className="bg-secondary/50 rounded-xl p-4">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {pilotMode === "brand"
              ? `Pilot with Brand A & Brand B across ${brief.productCategory || "Electronics"} category. Scale plan: expand to 5 brands + 3 categories post-validation.`
              : `Pilot with Brand A targeting ${selectedCohorts.length >= 2 ? "top 2 selected cohorts" : "High-Value & Churn Risk cohorts"}. Scale plan: add remaining cohorts post-validation.`}
          </p>
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
        <button onClick={onNext} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">Continue to Creatives →</button>
      </div>
    </div>
  );
}
