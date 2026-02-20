import { useState } from "react";
import { Users, TrendingUp, Tag } from "lucide-react";
import { Cohort } from "@/types/campaign";
import { cn } from "@/lib/utils";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const mockCohorts: Cohort[] = [
  { id: "c1", name: "High-Value Active Buyers", size: 12400, expectedUplift: "+18%", reasoning: "RFM score > 8, purchased in last 30d, avg basket $120+", messageAngle: "Exclusive early access & loyalty rewards", type: "RFM" },
  { id: "c2", name: "Churn Risk - Category Fans", size: 8200, expectedUplift: "+25%", reasoning: "No purchase in 60-90d, previously bought 3+ times in target category", messageAngle: "We miss you — comeback offer with free shipping", type: "Lifecycle" },
  { id: "c3", name: "Price Sensitive Browsers", size: 15600, expectedUplift: "+12%", reasoning: "High browse-to-cart ratio, converts primarily during sales, avg discount used 22%", messageAngle: "Limited-time price drop on items you viewed", type: "Behavioral" },
  { id: "c4", name: "Category Affinity - Cross-sell", size: 6800, expectedUplift: "+15%", reasoning: "Bought in Electronics, shows affinity for Home & Garden based on browsing", messageAngle: "Complete your setup — items that pair with your purchase", type: "Affinity" },
  { id: "c5", name: "New Customers - Nurture", size: 22100, expectedUplift: "+8%", reasoning: "First purchase in last 14d, no repeat yet, email engaged", messageAngle: "Welcome back — here's what's trending for you", type: "Lifecycle" },
];

export function AudienceCohorts({ onNext, onBack }: Props) {
  const [selectedCohorts, setSelectedCohorts] = useState<string[]>(["c1", "c2"]);
  const [pilotMode, setPilotMode] = useState<"brand" | "category">("brand");

  const toggleCohort = (id: string) => {
    setSelectedCohorts(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const typeColors: Record<string, string> = {
    RFM: "text-primary",
    Lifecycle: "text-success",
    Behavioral: "text-warning",
    Affinity: "bg-card text-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-foreground">Recommended Cohorts</h2>
          <span className="text-xs text-muted-foreground">
            {selectedCohorts.length} selected · {mockCohorts.filter(c => selectedCohorts.includes(c.id)).reduce((a, b) => a + b.size, 0).toLocaleString()} total reach
          </span>
        </div>

        <div className="space-y-3">
          {mockCohorts.map((cohort) => (
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
              ? "Pilot with Brand A & Brand B across Electronics category. Scale plan: expand to 5 brands + 3 categories post-validation."
              : "Pilot with Brand A targeting High-Value Active Buyers & Churn Risk cohorts. Scale plan: add remaining 3 cohorts post-validation."}
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
