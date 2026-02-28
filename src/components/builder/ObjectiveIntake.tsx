import { useState } from "react";
import { CampaignBrief } from "@/types/campaign";
import { AgentStepBanner, stepAgents } from "./AgentStepBanner";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";

interface Props {
  brief: CampaignBrief;
  onBriefChange: (brief: CampaignBrief) => void;
  onNext: () => void;
}

function SectionCard({ title, subtitle, children, defaultOpen = true }: { title: string; subtitle?: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-border rounded-xl card-elevated">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5">
        <div className="text-left">
          <h3 className="text-sm font-bold text-foreground font-display">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {open ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-5 pb-5 pt-0">{children}</div>}
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-2">{children}</label>;
}

function TextInput({ value, onChange, placeholder, className }: { value: string; onChange: (v: string) => void; placeholder?: string; className?: string }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${className ?? ""}`}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
    />
  );
}

function ChipSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
            value === opt
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-secondary text-secondary-foreground border-border hover:border-primary/30 hover:bg-primary/5"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export function ObjectiveIntake({ brief, onBriefChange, onNext }: Props) {
  const [showJSON, setShowJSON] = useState(false);

  const objectives = ["ROAS", "CAC", "Leads", "Conversions", "Retention", "Reactivation"];
  const tones = ["Professional", "Playful", "Urgent", "Premium", "Casual", "Inspirational", "Bold"];
  const occasions = ["Product Launch", "Seasonal Sale", "Festival / Holiday", "Flash Sale", "Brand Awareness", "Re-engagement", "Loyalty Program", "Event Promotion", "Clearance", "New Market Entry", "Other"];
  const genders = ["All", "Male", "Female", "Non-Binary"];
  const ageRanges = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+", "All Ages"];
  const seasonalities = ["Spring", "Summer", "Fall", "Winter", "Year-Round", "Back to School", "Holiday Season", "New Year"];

  const set = (field: keyof CampaignBrief, value: any) => {
    onBriefChange({ ...brief, [field]: value });
  };

  return (
    <div className="space-y-4">
      <AgentStepBanner {...stepAgents[0]} status="working" />
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Step 1: Define Your Campaign</h2>
        </div>
        <p className="text-xs text-muted-foreground">Everything here feeds into audience selection, creative generation, channel planning, and launch artifacts.</p>
      </div>

      {/* Brand & Campaign Identity */}
      <SectionCard title="Brand & Campaign Identity" subtitle="Who is running this campaign?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <FieldLabel>Brand Name *</FieldLabel>
            <TextInput value={brief.brandName} onChange={(v) => set("brandName", v)} placeholder="e.g., Nike, Glossier, Acme Corp" />
          </div>
          <div>
            <FieldLabel>Campaign Name</FieldLabel>
            <TextInput value={brief.campaignName} onChange={(v) => set("campaignName", v)} placeholder="e.g., Summer Blowout 2026" />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Brand Description</FieldLabel>
            <TextArea value={brief.brandDescription} onChange={(v) => set("brandDescription", v)} placeholder="Briefly describe the brand, its values, and positioning. This helps generate on-brand creatives." rows={2} />
          </div>
          <div>
            <FieldLabel>Brand Tone</FieldLabel>
            <ChipSelect options={tones} value={brief.brandTone} onChange={(v) => set("brandTone", v)} />
          </div>
        </div>
      </SectionCard>

      {/* Campaign Occasion & Context */}
      <SectionCard title="Campaign Occasion & Context" subtitle="What's the trigger for this campaign?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FieldLabel>Occasion / Trigger *</FieldLabel>
            <ChipSelect options={occasions} value={brief.occasion} onChange={(v) => set("occasion", v)} />
          </div>
          <div>
            <FieldLabel>Promotion / Offer Details</FieldLabel>
            <TextArea value={brief.promotionDetails} onChange={(v) => set("promotionDetails", v)} placeholder="e.g., 30% off sitewide, Buy 2 Get 1, Free shipping over $50..." rows={2} />
          </div>
          <div>
            <FieldLabel>Seasonality</FieldLabel>
            <ChipSelect options={seasonalities} value={brief.seasonality} onChange={(v) => set("seasonality", v)} />
          </div>
          <div>
            <FieldLabel>Product / Category *</FieldLabel>
            <TextInput value={brief.productCategory} onChange={(v) => set("productCategory", v)} placeholder="e.g., Running Shoes, Skincare, SaaS" />
          </div>
          <div>
            <FieldLabel>Landing Page URL</FieldLabel>
            <TextInput value={brief.landingPageUrl} onChange={(v) => set("landingPageUrl", v)} placeholder="https://..." />
          </div>
        </div>
      </SectionCard>

      {/* Objective & KPI */}
      <SectionCard title="Objective & KPI Targets" subtitle="What does success look like?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FieldLabel>Objective Type *</FieldLabel>
            <ChipSelect options={objectives} value={brief.objectiveType} onChange={(v) => set("objectiveType", v)} />
          </div>
          <div>
            <FieldLabel>Target KPI & Value</FieldLabel>
            <div className="flex gap-2">
              <TextInput value={brief.targetKPI} onChange={(v) => set("targetKPI", v)} placeholder="e.g., ROAS" className="flex-1" />
              <input
                type="text"
                value={brief.targetValue}
                onChange={(e) => set("targetValue", e.target.value)}
                placeholder="e.g., 4.0x"
                className="w-24 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Time Window</FieldLabel>
            <select
              value={brief.timeWindow}
              onChange={(e) => set("timeWindow", e.target.value)}
              className="w-full bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option>7 days</option>
              <option>14 days</option>
              <option>30 days</option>
              <option>60 days</option>
              <option>90 days</option>
            </select>
          </div>
          <div>
            <FieldLabel>Budget Range</FieldLabel>
            <div className="flex gap-2 items-center">
              <input type="number" value={brief.budgetMin} onChange={(e) => set("budgetMin", Number(e.target.value))} className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
              <span className="text-muted-foreground text-xs font-medium">to</span>
              <input type="number" value={brief.budgetMax} onChange={(e) => set("budgetMax", Number(e.target.value))} className="flex-1 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
            </div>
          </div>
          <div>
            <FieldLabel>Geography</FieldLabel>
            <TextInput value={brief.geo.join(", ")} onChange={(v) => set("geo", v.split(",").map(s => s.trim()))} placeholder="US, UK, DE..." />
          </div>
        </div>
      </SectionCard>

      {/* Target Audience */}
      <SectionCard title="Target Audience & Persona" subtitle="Who are you trying to reach?">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FieldLabel>Target Audience Description</FieldLabel>
            <TextArea value={brief.targetAudience} onChange={(v) => set("targetAudience", v)} placeholder="e.g., Health-conscious millennials who shop online, value sustainability, and have purchased fitness products in the last 90 days." rows={2} />
          </div>
          <div>
            <FieldLabel>Age Range</FieldLabel>
            <ChipSelect options={ageRanges} value={brief.ageRange} onChange={(v) => set("ageRange", v)} />
          </div>
          <div>
            <FieldLabel>Gender</FieldLabel>
            <ChipSelect options={genders} value={brief.gender} onChange={(v) => set("gender", v)} />
          </div>
          <div>
            <FieldLabel>Pain Points / Needs</FieldLabel>
            <TextArea value={brief.painPoints} onChange={(v) => set("painPoints", v)} placeholder="What problems does your audience face that your product solves?" rows={2} />
          </div>
          <div>
            <FieldLabel>Competitor Context</FieldLabel>
            <TextArea value={brief.competitorContext} onChange={(v) => set("competitorContext", v)} placeholder="Who are the main competitors? What are they doing differently?" rows={2} />
          </div>
        </div>
      </SectionCard>

      {/* Messaging & Creative Direction */}
      <SectionCard title="Messaging & Creative Direction" subtitle="Fuel for creative generation in Step 4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <FieldLabel>Unique Selling Points (USPs)</FieldLabel>
            <TextArea value={brief.uniqueSellingPoints} onChange={(v) => set("uniqueSellingPoints", v)} placeholder="What makes your product/brand stand out? e.g., 100% organic, fastest delivery, patented technology..." rows={2} />
          </div>
          <div>
            <FieldLabel>Key Messages</FieldLabel>
            <TextArea
              value={brief.keyMessages.join("\n")}
              onChange={(v) => set("keyMessages", v.split("\n").filter(Boolean))}
              placeholder="One message per line&#10;e.g., Save 30% this weekend only&#10;Free shipping on all orders"
              rows={3}
            />
          </div>
          <div>
            <FieldLabel>Primary Call to Action</FieldLabel>
            <TextInput value={brief.callToAction} onChange={(v) => set("callToAction", v)} placeholder="e.g., Shop Now, Sign Up Free, Book a Demo" />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Previous Campaign Learnings</FieldLabel>
            <TextArea value={brief.previousCampaignLearnings} onChange={(v) => set("previousCampaignLearnings", v)} placeholder="What worked or didn't work in past campaigns? e.g., Video ads outperformed static by 2x, urgency messaging drove higher CTR..." rows={2} />
          </div>
        </div>
      </SectionCard>

      {/* Campaign Brief JSON */}
      <div className="bg-card border border-border rounded-xl card-elevated">
        <button onClick={() => setShowJSON(!showJSON)} className="w-full flex items-center justify-between p-5 text-sm font-semibold text-foreground font-display">
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
        <button onClick={onNext} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm">
          Continue to Data & Compliance →
        </button>
      </div>
    </div>
  );
}
