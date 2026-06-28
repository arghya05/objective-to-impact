import { useState } from "react";
import { Rocket, Play, Shield, Check, AlertTriangle, Mail, Send, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { CampaignBrief } from "@/types/campaign";
import { AgentStepBanner, stepAgents } from "./AgentStepBanner";
import { toast } from "sonner";

interface Props {
  brief: CampaignBrief;
  onNext: () => void;
  onBack: () => void;
}

export function LaunchCenter({ brief, onNext, onBack }: Props) {
  const [simulated, setSimulated] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSendBrief = () => {
    if (!email) { toast.error("Please enter an email"); return; }
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
      toast.success(`Campaign brief sent to ${email}`, {
        description: "Full campaign artifacts, approvals & deployment plan delivered.",
      });
    }, 2500);
  };

  const brandLabel = brief.brandName || "Brand";
  const categoryLabel = brief.productCategory || "Products";
  const occasionLabel = brief.occasion || "Campaign";

  // Dynamic artifacts based on brief
  const artifacts = [
    {
      platform: "Google Ads",
      items: [
        `2 Search campaigns for "${categoryLabel}"`,
        `6 Ad groups targeting ${brief.targetAudience ? brief.targetAudience.slice(0, 40) + "..." : "key audiences"}`,
        `24 RSA variants (${brief.brandTone} tone)`,
        `120 keywords for ${categoryLabel}`,
        brief.callToAction ? `CTA: "${brief.callToAction}"` : "Sitelink + callout assets",
      ],
      status: "ready",
    },
    {
      platform: "Meta Ads",
      items: [
        `3 Campaign objectives (${brief.objectiveType || "ROAS"})`,
        `5 Ad sets (cohort-based, ${brief.geo.join(", ") || "US"})`,
        `12 Creative variants (${brief.brandTone} tone)`,
        brief.occasion ? `Occasion: ${brief.occasion}` : "Custom audiences uploaded",
      ],
      status: "ready",
    },
    {
      platform: "Email",
      items: [
        `3 Email templates for ${brandLabel}`,
        `2 Drip sequences (${occasionLabel})`,
        brief.keyMessages.length > 0 ? `Key message: "${brief.keyMessages[0]}"` : "A/B subject lines",
        "Scheduled sends (Tue/Thu 10AM)",
      ],
      status: "ready",
    },
    ...(["Retention", "Reactivation"].includes(brief.objectiveType)
      ? [{
          platform: "WhatsApp / SMS",
          items: [
            `2 Message templates for ${brandLabel}`,
            brief.promotionDetails ? `Promo: ${brief.promotionDetails}` : "Rich media cards",
            "Quick reply buttons",
            "Opt-out handling",
          ],
          status: "pending",
        }]
      : []),
  ];

  const approvals = [
    { role: "Marketing Manager", name: "Sarah Chen", status: "approved" as const },
    { role: "Compliance Officer", name: "Michael Torres", status: "approved" as const },
    { role: "Brand Manager", name: "Lisa Patel", status: "pending" as const },
  ];

  const allApproved = approvals.every(a => a.status === "approved");

  const handleSimulate = () => {
    setSimulating(true);
    setTimeout(() => {
      setSimulating(false);
      setSimulated(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <AgentStepBanner {...stepAgents[5]} status={simulated ? "complete" : simulating ? "working" : "ready"} />
      {/* Dynamic context banner */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-4">
        <p className="text-[11px] text-muted-foreground font-medium">Launch artifacts for</p>
        <p className="text-sm font-bold text-foreground font-display">
          {brandLabel} · {occasionLabel} · {brief.objectiveType || "ROAS"} · {brief.geo.join(", ") || "US"}
        </p>
        {brief.promotionDetails && (
          <p className="text-xs text-muted-foreground mt-0.5">Promotion: {brief.promotionDetails}</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <h2 className="text-base font-bold text-foreground mb-5 font-display">Platform Artifacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artifacts.map((art) => (
            <div key={art.platform} className="border border-border rounded-xl p-5 bg-secondary/20 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-foreground">{art.platform}</h3>
                <span className={cn(
                  "text-[10px] font-semibold px-2.5 py-1 rounded-full",
                  art.status === "ready" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                )}>
                  {art.status === "ready" ? "Ready" : "Pending"}
                </span>
              </div>
              <ul className="space-y-1.5">
                {art.items.map((item, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground/50 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-5">
          <Shield className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Approvals Required</h2>
        </div>
        <div className="space-y-2">
          {approvals.map((a) => (
            <div key={a.role} className="flex items-center justify-between py-3 px-4 rounded-xl bg-secondary/30 hover:bg-secondary/40 transition-colors">
              <div>
                <p className="text-sm text-foreground font-medium">{a.name}</p>
                <p className="text-[10px] text-muted-foreground">{a.role}</p>
              </div>
              {a.status === "approved" ? (
                <span className="flex items-center gap-1.5 text-xs text-success font-semibold"><Check className="h-3 w-3" /> Approved</span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs text-warning font-semibold"><AlertTriangle className="h-3 w-3" /> Pending</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Execution Plan */}
      <div className="bg-card border border-border rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-2">
          <Rocket className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Execution: Selected Users × Offer × Timing × Channel</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          The optimizer's selected (customer, offer, channel, send_time) tuples are dispatched to push, in-app, email, search boost, merchant placement and checkout coupon surfaces. Sample send event:
        </p>
        <pre className="text-[11px] bg-secondary/40 rounded-lg p-3 font-mono text-muted-foreground overflow-x-auto">{`{
  "campaign_id": "${(brief.campaignName || brandLabel).replace(/\\s+/g, "_").toUpperCase().slice(0, 20)}",
  "merchant_id": "M_${brandLabel.slice(0, 3).toUpperCase()}",
  "customer_id": "U456",
  "offer": "${brief.promotionDetails || "20_percent_off"}",
  "channel": "push",
  "send_time": "2026-06-28T19:00"
}`}</pre>
        <div className="flex gap-2 flex-wrap mt-3">
          {["push", "in-app banner", "email", "search boost", "merchant placement", "checkout coupon"].map(ch => (
            <span key={ch} className="text-[10px] px-2.5 py-1 bg-secondary text-foreground rounded-full font-semibold border border-border">{ch}</span>
          ))}
        </div>
      </div>


      <div className="bg-card border border-primary/20 rounded-xl p-6 card-elevated">
        <div className="flex items-center gap-2.5 mb-4">
          <Mail className="h-4 w-4 text-primary" />
          <h2 className="text-base font-bold text-foreground font-display">Send Campaign Brief via Email</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          Send the complete campaign plan — artifacts, audience cohorts, creative assets, channel allocation & approval status — directly to stakeholders.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="email"
            placeholder="Enter email address..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={sent}
            className="flex-1 px-4 py-2.5 bg-secondary border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSendBrief}
            disabled={sending || sent}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
              sent
                ? "bg-success/10 text-success border border-success/20"
                : "bg-primary text-primary-foreground hover:opacity-90 shadow-sm"
            )}
          >
            {sent ? <CheckCircle2 className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : sent ? "Sent ✓" : "Send Brief"}
          </button>
        </div>
        {sent && (
          <div className="mt-3 p-3 bg-success/5 border border-success/15 rounded-lg">
            <p className="text-xs text-success font-medium">✓ Campaign brief delivered to {email}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Includes: {artifacts.length} platform artifacts · {approvals.length} approval statuses · Full deployment plan</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 justify-between">
        <button onClick={onBack} className="px-6 py-2.5 bg-secondary text-secondary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all">← Back</button>
        <div className="flex gap-3">
          <button onClick={handleSimulate} disabled={simulating} className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all border border-border">
            <Play className="h-4 w-4" />
            {simulating ? "Simulating..." : simulated ? "✓ Simulation Complete" : "Simulate"}
          </button>
          <button onClick={onNext} disabled={!allApproved} className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 shadow-sm" title={!allApproved ? "All approvals required" : ""}>
            <Rocket className="h-4 w-4" />
            Launch Campaign
          </button>
        </div>
      </div>
    </div>
  );
}
