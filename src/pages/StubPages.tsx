import { CheckCircle, Shield, Plug, Palette, Eye, Edit, ShieldAlert, ClipboardList, Settings2, Users, Lock, FileText, AlertTriangle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

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

const auditLog = [
  { time: "Feb 21, 14:32", user: "Optimizer Agent", action: "Paused Creative #3 (Meta)", type: "auto", approved: true },
  { time: "Feb 21, 12:15", user: "Media Mix Agent", action: "Shifted $500 from Display to Meta", type: "auto", approved: true },
  { time: "Feb 21, 10:00", user: "Sarah Chen", action: "Approved campaign launch: Q1 Retention", type: "manual", approved: true },
  { time: "Feb 20, 16:45", user: "Creative Agent", action: "Generated 12 new ad variants", type: "auto", approved: true },
  { time: "Feb 20, 14:20", user: "Michael Torres", action: "Rejected budget increase > $10K", type: "manual", approved: false },
  { time: "Feb 20, 11:00", user: "Deployment Agent", action: "Deployed Google Ads RSA assets", type: "auto", approved: true },
  { time: "Feb 19, 15:30", user: "Lisa Patel", action: "Updated brand tone guidelines", type: "manual", approved: true },
  { time: "Feb 19, 09:00", user: "Data Readiness Agent", action: "Validated EU consent flags", type: "auto", approved: true },
];

const safetyRules = [
  { rule: "No competitor brand mentions", active: true },
  { rule: "No unverified product claims", active: true },
  { rule: "Price accuracy must match catalog", active: true },
  { rule: "Restricted: alcohol, gambling, pharma", active: true },
  { rule: "Max 20% text overlay on images", active: true },
  { rule: "CTA required in every creative", active: false },
];

export function GovernancePage() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Governance</h1>
        </div>
        <p className="text-sm text-muted-foreground">Role-based approvals, audit log, compliance controls, and safety rules</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Human-in-the-Loop Controls */}
        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-display">Human-in-the-Loop Controls</h3>
          </div>
          {["Budget changes > $5K", "New audience activation", "Creative approval", "Campaign launch", "Autopilot bid changes", "Experiment promotion", "Audience exclusion changes"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2.5 border-b border-border/50 last:border-0">
              <span className="text-xs text-foreground">{item}</span>
              <div className="h-5 w-9 rounded-full bg-success/20 flex items-center justify-end px-0.5 cursor-pointer">
                <div className="h-4 w-4 rounded-full bg-success" />
              </div>
            </div>
          ))}
        </div>

        {/* Roles */}
        <div className="bg-card border border-border rounded-xl p-5 card-elevated">
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground font-display">Roles & Permissions</h3>
          </div>
          {[
            { role: "Viewer", desc: "Read-only access to dashboards, reports, and audit logs", users: 12, icon: Eye, permissions: ["View dashboards", "View reports", "View audit log"] },
            { role: "Marketer", desc: "Create campaigns, manage creatives, audiences, and experiments", users: 5, icon: Edit, permissions: ["Create campaigns", "Manage creatives", "Run experiments", "View all"] },
            { role: "Admin", desc: "Full access including approvals, settings, and governance controls", users: 2, icon: Lock, permissions: ["All permissions", "Approve launches", "Manage users", "Configure settings"] },
          ].map((r) => (
            <div key={r.role} className="py-3 border-b border-border/50 last:border-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <r.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">{r.role}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">{r.users} users</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 ml-6">{r.desc}</p>
              <div className="flex flex-wrap gap-1.5 mt-2 ml-6">
                {r.permissions.map(p => (
                  <span key={p} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-muted-foreground">{p}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Safe Copy Rules */}
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">Safe Copy & Content Rules</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {safetyRules.map(r => (
            <div key={r.rule} className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-secondary/30">
              <span className="text-xs text-foreground">{r.rule}</span>
              <div className={cn(
                "h-5 w-9 rounded-full flex items-center px-0.5 cursor-pointer transition-all",
                r.active ? "bg-success/20 justify-end" : "bg-secondary justify-start"
              )}>
                <div className={cn("h-4 w-4 rounded-full", r.active ? "bg-success" : "bg-muted-foreground/40")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-card border border-border rounded-xl card-elevated overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">Audit Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Time</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Actor</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Action</th>
                <th className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Type</th>
                <th className="text-center text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {auditLog.map((log, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{log.time}</td>
                  <td className="px-5 py-3 text-sm text-foreground font-medium">{log.user}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{log.action}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={cn(
                      "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      log.type === "auto" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                    )}>{log.type === "auto" ? "Agent" : "Manual"}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {log.approved ? (
                      <CheckCircle className="h-4 w-4 text-success mx-auto" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-destructive mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const connectors = [
  { name: "Google Ads", status: "Connected", icon: "🔵", lastSync: "2 min ago" },
  { name: "Meta Ads", status: "Connected", icon: "🟣", lastSync: "5 min ago" },
  { name: "CRM / CDP", status: "Connected", icon: "🟢", lastSync: "1 min ago" },
  { name: "Email (SendGrid)", status: "Connected", icon: "📧", lastSync: "3 min ago" },
  { name: "WhatsApp", status: "Setup Required", icon: "💬", lastSync: "—" },
  { name: "Analytics", status: "Connected", icon: "📊", lastSync: "1 min ago" },
  { name: "YouTube", status: "Connected", icon: "🔴", lastSync: "10 min ago" },
  { name: "Push Notifications", status: "Setup Required", icon: "🔔", lastSync: "—" },
];

const kpiDefinitions = [
  { kpi: "ROAS", model: "Last-click", window: "7 days", description: "Revenue / Ad Spend" },
  { kpi: "CAC", model: "First-touch", window: "30 days", description: "Total Spend / New Customers" },
  { kpi: "CVR", model: "Linear", window: "14 days", description: "Conversions / Clicks" },
  { kpi: "LTV", model: "Probabilistic", window: "12 months", description: "Predicted lifetime value" },
  { kpi: "CTR", model: "N/A", window: "Session", description: "Clicks / Impressions" },
];

export function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Settings2 className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground">Connectors, brand kit, KPI definitions, and attribution configuration</p>
      </div>

      {/* Connectors */}
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <div className="flex items-center gap-2 mb-4">
          <Plug className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">Connectors</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {connectors.map((c) => (
            <div key={c.name} className="border border-border rounded-xl p-4 hover:bg-secondary/30 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{c.icon}</span>
                  <span className="text-sm font-medium text-foreground">{c.name}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className={cn(
                  "text-[10px] font-semibold",
                  c.status === "Connected" ? "text-success" : "text-warning"
                )}>{c.status}</span>
                <span className="text-[10px] text-muted-foreground">{c.lastSync}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Kit */}
      <div className="bg-card border border-border rounded-xl p-5 card-elevated">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">Brand Kit</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Primary Colors</p>
            <div className="flex gap-2">
              {["#5B4ED8", "#10B981", "#1E293B", "#F8FAFC"].map(c => (
                <div key={c} className="h-7 w-7 rounded-lg border border-border shadow-sm" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Fonts</p>
            <p className="text-sm text-foreground">Space Grotesk / DM Sans</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Tone</p>
            <p className="text-sm text-foreground">Professional</p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-4">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-3 font-semibold">Logo</p>
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-bold font-display">A</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Definitions */}
      <div className="bg-card border border-border rounded-xl card-elevated overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground font-display">KPI Definitions & Attribution</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">KPI</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Attribution Model</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Window</th>
                <th className="text-left text-[11px] uppercase tracking-wider text-muted-foreground font-semibold px-5 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {kpiDefinitions.map(kpi => (
                <tr key={kpi.kpi} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-foreground font-mono">{kpi.kpi}</td>
                  <td className="px-5 py-3 text-xs text-foreground">{kpi.model}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground font-mono">{kpi.window}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{kpi.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
