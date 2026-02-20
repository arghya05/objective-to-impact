import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const complianceChecks: Array<{ id: string; label: string; channel: string; status: "pass" | "warning" | "fail"; note?: string }> = [
  { id: "email-consent", label: "Email consent verified", channel: "Email", status: "pass" },
  { id: "sms-consent", label: "SMS/WhatsApp opt-in", channel: "WhatsApp", status: "pass" },
  { id: "push-consent", label: "Push notification opt-in", channel: "Push", status: "warning", note: "38% coverage — consider enrichment" },
  { id: "gdpr", label: "GDPR compliance (EU regions)", channel: "All", status: "pass" },
  { id: "ccpa", label: "CCPA compliance (US-CA)", channel: "All", status: "pass" },
  { id: "tracking", label: "Tracking pixels & UTMs configured", channel: "Meta, Google", status: "pass" },
  { id: "suppression", label: "Suppression lists applied", channel: "All", status: "pass" },
  { id: "frequency", label: "Frequency cap policies active", channel: "All", status: "warning", note: "No cap set for Display — recommended 3/week" },
];

const dataFields = [
  { field: "customer_id", coverage: "100%", status: "ok" },
  { field: "email", coverage: "96%", status: "ok" },
  { field: "phone", coverage: "72%", status: "warning" },
  { field: "consent_flags", coverage: "100%", status: "ok" },
  { field: "lifecycle_stage", coverage: "88%", status: "ok" },
  { field: "purchase_history", coverage: "94%", status: "ok" },
  { field: "channel_opt_in", coverage: "81%", status: "warning" },
  { field: "region", coverage: "100%", status: "ok" },
];

export function DataReadiness({ onNext, onBack }: Props) {
  const allPass = complianceChecks.every((c) => c.status !== "fail");

  return (
    <div className="space-y-6">
      {/* Compliance Checklist */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Data & Compliance Checklist</h2>
        <div className="space-y-2">
          {complianceChecks.map((check) => (
            <div key={check.id} className="flex items-start gap-3 py-2 px-3 rounded-md hover:bg-secondary/30 transition-colors">
              {check.status === "pass" && <CheckCircle className="h-4 w-4 text-success mt-0.5 shrink-0" />}
              {check.status === "warning" && <AlertTriangle className="h-4 w-4 text-warning mt-0.5 shrink-0" />}
              {check.status === "fail" && <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground">{check.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-secondary rounded text-muted-foreground font-mono">{check.channel}</span>
                </div>
                {check.note && <p className="text-xs text-warning mt-0.5">{check.note}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Coverage */}
      <div className="bg-card border border-border rounded-lg p-6 card-glow">
        <h2 className="text-base font-semibold text-foreground mb-4">Data Field Coverage</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {dataFields.map((f) => (
            <div key={f.field} className="bg-secondary/50 rounded-md p-3">
              <p className="text-xs text-muted-foreground font-mono">{f.field}</p>
              <p className={`text-lg font-semibold font-mono mt-1 ${
                f.status === "ok" ? "text-success" : "text-warning"
              }`}>
                {f.coverage}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between">
        <button onClick={onBack} className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!allPass}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          Continue to Audiences →
        </button>
      </div>
    </div>
  );
}
