import { useState, useEffect } from "react";
import { Users, TrendingUp, Tag, Sparkles, Loader2, Plus, X, Wand2 } from "lucide-react";
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
  const [showCustom, setShowCustom] = useState(false);
  const [aiAssisting, setAiAssisting] = useState(false);
  const [customForm, setCustomForm] = useState({
    name: "",
    type: "Behavioral",
    size: 50000,
    expectedUplift: "+15% CTR",
    messageAngle: "",
    reasoning: "",
  });

  const handleAddCustomCohort = () => {
    if (!customForm.name.trim()) {
      toast.error("Segment name is required");
      return;
    }
    const newCohort: Cohort = {
      id: `custom-${Date.now()}`,
      name: customForm.name,
      size: Number(customForm.size) || 10000,
      expectedUplift: customForm.expectedUplift || "+10%",
      reasoning: customForm.reasoning || "Custom segment defined by user",
      messageAngle: customForm.messageAngle || "Tailored messaging",
      type: customForm.type as any,
    };
    setCohorts(prev => [newCohort, ...prev]);
    setSelectedCohorts(prev => [newCohort.id, ...prev]);
    setShowCustom(false);
    setCustomForm({ name: "", type: "Behavioral", size: 50000, expectedUplift: "+15% CTR", messageAngle: "", reasoning: "" });
    toast.success(`Custom segment "${newCohort.name}" added`);
  };

  const handleAIAssistCustom = async () => {
    if (!customForm.name.trim()) {
      toast.error("Enter a segment name or description first");
      return;
    }
    setAiAssisting(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-cohorts", {
        body: {
          objective: `Build ONE segment matching this user description: "${customForm.name}"`,
          objectiveType: brief.objectiveType || "ROAS",
          targetKPI: brief.targetKPI || "ROAS",
          targetValue: brief.targetValue || "4.0x",
          productCategory: brief.productCategory || "general",
          geo: brief.geo.join(", ") || "US",
          budgetMin: brief.budgetMin,
          budgetMax: brief.budgetMax,
          brandTone: brief.brandTone || "Professional",
          customSegmentRequest: customForm.name,
        },
      });
      if (error) throw error;
      const c = data?.cohorts?.[0];
      if (c) {
        setCustomForm(prev => ({
          ...prev,
          name: c.name || prev.name,
          type: c.type || prev.type,
          size: c.size || prev.size,
          expectedUplift: c.expectedUplift || prev.expectedUplift,
          messageAngle: c.messageAngle || prev.messageAngle,
          reasoning: c.reasoning || prev.reasoning,
        }));
        toast.success("AI filled in the segment details");
      }
    } catch (e: any) {
      toast.error(e.message || "AI assist failed");
    } finally {
      setAiAssisting(false);
    }
  };

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
              onClick={() => setShowCustom(s => !s)}
              className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl text-xs font-semibold hover:bg-secondary/70 transition-all flex items-center gap-1.5"
            >
              <Plus className="h-3 w-3" />
              {showCustom ? "Close" : "Create Custom Segment"}
            </button>
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

        {showCustom && (
          <div className="mb-5 border border-primary/30 bg-primary/5 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground font-display">Define your own segment</h3>
              <button onClick={() => setShowCustom(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Segment name / description</label>
                <input
                  type="text"
                  value={customForm.name}
                  onChange={e => setCustomForm({ ...customForm, name: e.target.value })}
                  placeholder="e.g. Lapsed VIPs in Tier-1 cities who bought premium last year"
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Type</label>
                <select
                  value={customForm.type}
                  onChange={e => setCustomForm({ ...customForm, type: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                >
                  <option>RFM</option>
                  <option>Lifecycle</option>
                  <option>Behavioral</option>
                  <option>Affinity</option>
                  <option>Lookalike</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Estimated size</label>
                <input
                  type="number"
                  value={customForm.size}
                  onChange={e => setCustomForm({ ...customForm, size: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Expected uplift</label>
                <input
                  type="text"
                  value={customForm.expectedUplift}
                  onChange={e => setCustomForm({ ...customForm, expectedUplift: e.target.value })}
                  placeholder="+18% CTR"
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Message angle</label>
                <input
                  type="text"
                  value={customForm.messageAngle}
                  onChange={e => setCustomForm({ ...customForm, messageAngle: e.target.value })}
                  placeholder="Win-back · exclusivity"
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Reasoning / signals</label>
                <textarea
                  value={customForm.reasoning}
                  onChange={e => setCustomForm({ ...customForm, reasoning: e.target.value })}
                  placeholder="Why this segment matters and which signals define it"
                  rows={2}
                  className="w-full mt-1 px-3 py-2 bg-background border border-border rounded-lg text-sm"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={handleAIAssistCustom}
                disabled={aiAssisting}
                className="px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-xl text-xs font-semibold hover:bg-secondary/70 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                {aiAssisting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                AI Auto-Fill
              </button>
              <button
                onClick={handleAddCustomCohort}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="h-3 w-3" /> Add Segment
              </button>
            </div>
          </div>
        )}

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
