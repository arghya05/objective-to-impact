import { AppLayout } from "@/components/AppLayout";

interface StubPageProps {
  title: string;
  description: string;
}

function StubPage({ title, description }: StubPageProps) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
      <div className="mt-8 border border-dashed border-border rounded-lg p-12 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">This section is under development. Use the Campaign Builder to access this functionality.</p>
      </div>
    </div>
  );
}

export const AudiencesPage = () => <StubPage title="Audiences" description="Manage segments, cohorts, and audience rules" />;
export const CreativesPage = () => <StubPage title="Creatives Studio" description="Create and manage ad creatives across channels" />;
export const ChannelsPage = () => <StubPage title="Channels & Budgets" description="Configure channel mix and budget allocation" />;
export const LaunchPage = () => <StubPage title="Launch Center" description="Review and deploy campaign artifacts" />;
export const MonitoringPage = () => <StubPage title="Monitoring" description="Live campaign performance and autopilot controls" />;
export const ExperimentsPage = () => <StubPage title="Experiments" description="A/B tests, hypotheses, and experiment results" />;

export function GovernancePage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Governance</h1>
        <p className="text-sm text-muted-foreground mt-1">Role-based approvals, audit log, and compliance controls</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5 card-glow">
          <h3 className="text-sm font-medium text-foreground mb-3">Human-in-the-Loop Controls</h3>
          {["Budget changes > $5K", "New audience activation", "Creative approval", "Campaign launch", "Autopilot bid changes"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
              <span className="text-xs text-foreground">{item}</span>
              <div className="h-5 w-9 rounded-full bg-success/20 flex items-center justify-end px-0.5 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-success" />
              </div>
            </div>
          ))}
        </div>
        <div className="bg-card border border-border rounded-lg p-5 card-glow">
          <h3 className="text-sm font-medium text-foreground mb-3">Roles</h3>
          {[
            { role: "Viewer", desc: "Read-only access to dashboards and reports", users: 12 },
            { role: "Marketer", desc: "Create campaigns, manage creatives and audiences", users: 5 },
            { role: "Admin", desc: "Full access including approvals and settings", users: 2 },
          ].map((r) => (
            <div key={r.role} className="py-2 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">{r.role}</span>
                <span className="text-[10px] text-muted-foreground">{r.users} users</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Connectors, brand kit, and attribution configuration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: "Google Ads", status: "Connected", color: "text-success" },
          { name: "Meta Ads", status: "Connected", color: "text-success" },
          { name: "CRM / CDP", status: "Connected", color: "text-success" },
          { name: "Email (SendGrid)", status: "Connected", color: "text-success" },
          { name: "WhatsApp", status: "Setup Required", color: "text-warning" },
          { name: "Analytics", status: "Connected", color: "text-success" },
        ].map((c) => (
          <div key={c.name} className="bg-card border border-border rounded-lg p-4 card-glow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">{c.name}</span>
              <span className={`text-[10px] font-medium ${c.color}`}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-lg p-5 card-glow">
        <h3 className="text-sm font-medium text-foreground mb-3">Brand Kit</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Primary Colors</p>
            <div className="flex gap-2">
              {["#0EA5E9", "#10B981", "#1E293B"].map(c => (
                <div key={c} className="h-6 w-6 rounded-full border border-border" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Font</p>
            <p className="text-sm text-foreground">Inter / JetBrains Mono</p>
          </div>
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Tone</p>
            <p className="text-sm text-foreground">Professional</p>
          </div>
          <div className="bg-secondary/30 rounded-md p-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Logo</p>
            <p className="text-xs text-muted-foreground">Upload logo →</p>
          </div>
        </div>
      </div>
    </div>
  );
}
