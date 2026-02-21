import { useState } from "react";
import { CampaignBrief } from "@/types/campaign";

interface Props {
  brief: CampaignBrief;
  onBriefChange: (brief: CampaignBrief) => void;
  onNext: () => void;
}

export function ObjectiveIntake({ brief, onBriefChange, onNext }: Props) {
  const [showJSON, setShowJSON] = useState(false);

  const objectives = ["ROAS", "CAC", "Leads", "Conversions", "Retention", "Reactivation"];
  const tones = ["Professional", "Playful", "Urgent", "Premium", "Casual"];

  const handleChange = (field: keyof CampaignBrief, value: any) => {
    onBriefChange({ ...brief, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-5 font-display">Step 1: Define Your Objective</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Objective Type */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Objective Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {objectives.map((obj) => (
                <button
                  key={obj}
                  onClick={() => handleChange("objectiveType", obj)}
                  className={`px-3 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                    brief.objectiveType === obj
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  {obj}
                </button>
              ))}
            </div>
          </div>

          {/* Target KPI */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Target KPI & Value
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g., ROAS"
                value={brief.targetKPI}
                onChange={(e) => handleChange("targetKPI", e.target.value)}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <input
                type="text"
                placeholder="e.g., 4.0x"
                value={brief.targetValue}
                onChange={(e) => handleChange("targetValue", e.target.value)}
                className="w-24 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Time Window */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Time Window
            </label>
            <select
              value={brief.timeWindow}
              onChange={(e) => handleChange("timeWindow", e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>

          {/* Budget Range */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Budget Range
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={brief.budgetMin}
                onChange={(e) => handleChange("budgetMin", Number(e.target.value))}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <span className="text-muted-foreground text-xs font-medium">to</span>
              <input
                type="number"
                value={brief.budgetMax}
                onChange={(e) => handleChange("budgetMax", Number(e.target.value))}
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>

          {/* Geo */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Geography
            </label>
            <input
              type="text"
              placeholder="US, UK, DE..."
              value={brief.geo.join(", ")}
              onChange={(e) => handleChange("geo", e.target.value.split(",").map(s => s.trim()))}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Product Category */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Product / Category
            </label>
            <input
              type="text"
              placeholder="e.g., Electronics, Fashion..."
              value={brief.productCategory}
              onChange={(e) => handleChange("productCategory", e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>

          {/* Brand Tone */}
          <div>
            <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2.5">
              Brand Tone
            </label>
            <div className="flex gap-2 flex-wrap">
              {tones.map((tone) => (
                <button
                  key={tone}
                  onClick={() => handleChange("brandTone", tone)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    brief.brandTone === tone
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-secondary text-secondary-foreground border-border hover:border-primary/30 hover:bg-primary/5"
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Brief JSON */}
      <div className="bg-card border border-border rounded-xl card-elevated">
        <button
          onClick={() => setShowJSON(!showJSON)}
          className="w-full flex items-center justify-between p-5 text-sm font-semibold text-foreground font-display"
        >
          <span>Campaign Brief (JSON)</span>
          <span className="text-xs text-primary font-medium">{showJSON ? "Hide" : "Show"}</span>
        </button>
        {showJSON && (
          <div className="px-5 pb-5">
            <pre className="bg-secondary rounded-xl p-4 text-xs font-mono text-foreground overflow-x-auto">
              {JSON.stringify(brief, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm"
        >
          Continue to Data & Compliance →
        </button>
      </div>
    </div>
  );
}
