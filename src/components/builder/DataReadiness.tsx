import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { CampaignBrief } from "@/types/campaign";

interface Props {
  brief: CampaignBrief;
  onNext: () => void;
  onBack: () => void;
}

export function DataReadiness({ brief, onNext, onBack }: Props) {
  const geos = brief.geo.filter(Boolean);
  const hasEU = geos.some(g => ["EU", "UK", "DE", "FR", "IT", "ES", "NL", "BE", "SE", "PL"].includes(g.toUpperCase()));
  const hasUS = geos.some(g => ["US", "US-CA"].includes(g.toUpperCase()));

  const channels = new Set<string>();
  // Infer channels from occasion/objective
  channels.add("Email");
  channels.add("Meta");
  channels.add("Google");
  if (["Retention", "Reactivation"].includes(brief.objectiveType)) {
    channels.add("WhatsApp");
    channels.add("Push");
    channels.add("SMS");
  }
  if (["ROAS", "Conversions", "Leads"].includes(brief.objectiveType)) {
    channels.add("Display");
  }

  const complianceChecks = [
    { id: "email-consent", label: `Email consent verified for ${brief.brandName || "brand"}`, channel: "Email", status: channels.has("Email") ? "pass" as const : "pass" as const },
    ...(channels.has("WhatsApp") || channels.has("SMS") ? [{ id: "sms-consent", label: "SMS/WhatsApp opt-in verified", channel: "WhatsApp/SMS", status: "pass" as const }] : []),
    ...(channels.has("Push") ? [{ id: "push-consent", label: "Push notification opt-in", channel: "Push", status: "warning" as const, note: "38% coverage — consider enrichment" }] : []),
    ...(hasEU ? [{ id: "gdpr", label: `GDPR compliance (${geos.filter(g => ["EU", "UK", "DE", "FR", "IT", "ES", "NL", "BE", "SE", "PL"].includes(g.toUpperCase())).join(", ")})`, channel: "All", status: "pass" as const }] : []),
    ...(hasUS ? [{ id: "ccpa", label: "CCPA compliance (US-CA)", channel: "All", status: "pass" as const }] : []),
    { id: "tracking", label: `Tracking pixels & UTMs configured for ${brief.brandName || "campaign"}`, channel: Array.from(channels).slice(0, 2).join(", "), status: "pass" as const },
    { id: "suppression", label: "Suppression lists applied", channel: "All", status: "pass" as const },
    { id: "frequency", label: "Frequency cap policies active", channel: "All", status: channels.has("Display") ? "warning" as const : "pass" as const, note: channels.has("Display") ? "No cap set for Display — recommended 3/week" : undefined },
    ...(brief.landingPageUrl ? [{ id: "landing", label: `Landing page accessible: ${brief.landingPageUrl}`, channel: "All", status: "pass" as const }] : []),
  ];

  const allCompliancePass = complianceChecks.every((c) => c.status === "pass");

  const dataFields = [
    { field: "customer_id", coverage: "100%", status: "ok" },
    { field: "email", coverage: "96%", status: "ok" },
    ...(channels.has("WhatsApp") || channels.has("SMS") ? [{ field: "phone", coverage: "72%", status: "warning" }] : []),
    { field: "consent_flags", coverage: "100%", status: "ok" },
    { field: "lifecycle_stage", coverage: "88%", status: "ok" },
    { field: "purchase_history", coverage: "94%", status: "ok" },
    { field: "channel_opt_in", coverage: "81%", status: "warning" },
    { field: "region", coverage: geos.length > 0 ? "100%" : "0%", status: geos.length > 0 ? "ok" : "warning" },
    ...(brief.targetAudience ? [{ field: "audience_match", coverage: "76%", status: "ok" }] : []),
  ];

  const allPass = complianceChecks.every((c) => c.status === "pass" || c.status === "warning");

  return (
    <div className="space-y-6">
      {/* Dynamic context banner */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
        <p className="text-[11px] text-muted-foreground font-medium">Compliance check for</p>
        <p className="text-sm font-bold text-foreground font-display">
          {brief.brandName || "Campaign"} · {brief.occasion || brief.objectiveType || "General"} · {geos.join(", ") || "Global"}
        </p>
        {brief.promotionDetails && (
          <p className="text-xs text-muted-foreground mt-0.5">Promotion: {brief.promotionDetails}</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-5 font-display">Data & Compliance Checklist</h2>
        <div className="space-y-1.5">
          {complianceChecks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-secondary/50 transition-colors">
              {check.status === "pass" && <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />}
              {check.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
              {check.status !== "pass" && check.status !== "warning" && <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground font-medium">{check.label}</span>
                  <span className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground font-mono">{check.channel}</span>
                </div>
                {check.note && <p className="text-xs text-warning mt-0.5">{check.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-5 font-display">Data Field Coverage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dataFields.map((f) => (
            <div key={f.field} className="bg-secondary/50 rounded-xl p-4">
              <p className="text-xs text-muted-foreground font-mono">{f.field}</p>
              <p className={`text-xl font-bold font-mono mt-1.5 ${f.status === "ok" ? "text-success" : "text-warning"}`}>
                {f.coverage}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
        <button onClick={onNext} disabled={!allPass} className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all shadow-sm disabled:opacity-50">
          Continue to Audiences →
        </button>
      </div>
    </div>
  );
}
