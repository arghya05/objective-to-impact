import { useState } from "react";
import { Brain, ExternalLink, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export function OpportunityBanner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-background p-5">
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">Pre-filled from Growth Brain</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">Critical</span>
          </div>
          <h2 className="text-xl font-bold text-foreground font-display tracking-tight">
            Activate At-Risk Champions before churn
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Estimated <span className="text-emerald-600 font-semibold">+$8.6M ARR</span> · 240 accounts · Confidence 78%
          </p>
        </div>
        <Button variant="outline" onClick={() => setOpen(true)} className="shrink-0">
          <Sparkles className="h-4 w-4" />
          Explain recommendation
        </Button>
      </div>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-[480px] sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Why we recommend this campaign</SheetTitle>
            <SheetDescription>Nyx's Growth Brain traced this opportunity across CRM, product, billing, and support signals.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Predicted revenue at risk" value="$8.6M" tone="danger" />
              <Stat label="Affected accounts" value="240" />
              <Stat label="Confidence" value="78% · Medium-high" />
              <Stat label="Data freshness" value="Updated 2h ago" />
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Key signals</h4>
              <ul className="space-y-1.5">
                {[
                  "Declining product usage (>30% drop, 30 days)",
                  "Renewal within 60 days on $8.6M ARR",
                  "Unresolved critical support issues",
                  "Lower campaign engagement vs cohort baseline",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-foreground">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">Assumptions & limitations</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>· Baseline churn rate held constant vs prior 4 quarters.</li>
                <li>· Attribution window of 60 days multi-touch.</li>
                <li>· Excludes accounts with active in-flight save motions.</li>
              </ul>
            </div>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4" />
              View source data
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: "danger" }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`text-base font-bold mt-1 ${tone === "danger" ? "text-rose-600" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
