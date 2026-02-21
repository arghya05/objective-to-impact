import { useState } from "react";
import { Search, Shield, AlertTriangle, CheckCircle, ArrowRight, Zap, TrendingUp, XCircle } from "lucide-react";
import { mockAuditIssues } from "@/data/mockData";
import { AuditIssue } from "@/types/campaign";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const categoryLabels: Record<string, string> = {
  structure: "Structure",
  targeting: "Targeting",
  creative: "Creative",
  budget: "Budget",
  tracking: "Tracking",
  performance: "Performance",
};

const categoryColors: Record<string, string> = {
  structure: "bg-primary/10 text-primary",
  targeting: "bg-warning/10 text-warning",
  creative: "bg-success/10 text-success",
  budget: "bg-destructive/10 text-destructive",
  tracking: "bg-destructive/10 text-destructive",
  performance: "bg-warning/10 text-warning",
};

const severityColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-secondary text-muted-foreground border-border",
};

const AuditCenter = () => {
  const [issues, setIssues] = useState<AuditIssue[]>(mockAuditIssues);
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filtered = issues.filter(i =>
    (filterPlatform === "all" || i.platform === filterPlatform) &&
    (filterSeverity === "all" || i.severity === filterSeverity) &&
    (filterCategory === "all" || i.category === filterCategory)
  );

  const healthScore = Math.round(100 - (issues.filter(i => !i.applied).reduce((sum, i) => sum + i.impactScore, 0) / issues.length));
  const opportunityScore = issues.filter(i => !i.applied).reduce((sum, i) => sum + i.impactScore, 0);
  const highCount = issues.filter(i => i.severity === "high" && !i.applied).length;
  const mediumCount = issues.filter(i => i.severity === "medium" && !i.applied).length;
  const lowCount = issues.filter(i => i.severity === "low" && !i.applied).length;

  const handleApply = (id: string) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, applied: true } : i));
    toast.success("Recommendation applied (simulated)");
  };

  return (
    <div className="p-6 space-y-6 max-w-[1400px] mx-auto">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Search className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold text-foreground font-display tracking-tight">Audit Center</h1>
        </div>
        <p className="text-sm text-muted-foreground">Automated Ads Account Audit Engine — detect issues and optimize performance</p>
      </div>

      {/* Audit Scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-card border border-border rounded-xl p-5 card-elevated text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Account Health</p>
          <div className={cn(
            "text-4xl font-bold font-mono",
            healthScore >= 70 ? "text-success" : healthScore >= 50 ? "text-warning" : "text-destructive"
          )}>{healthScore}</div>
          <p className="text-[10px] text-muted-foreground mt-1">out of 100</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 card-elevated text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Optimization Score</p>
          <div className="text-4xl font-bold font-mono text-primary">{opportunityScore}</div>
          <p className="text-[10px] text-muted-foreground mt-1">opportunity points</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 card-elevated text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Issues Found</p>
          <div className="text-4xl font-bold font-mono text-foreground">{issues.filter(i => !i.applied).length}</div>
          <div className="flex justify-center gap-2 mt-1.5">
            <span className="text-[10px] text-destructive font-semibold">{highCount}H</span>
            <span className="text-[10px] text-warning font-semibold">{mediumCount}M</span>
            <span className="text-[10px] text-muted-foreground font-semibold">{lowCount}L</span>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-5 card-elevated text-center">
          <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">Est. Uplift</p>
          <div className="text-4xl font-bold font-mono text-success">+24%</div>
          <p className="text-[10px] text-muted-foreground mt-1">if all fixes applied</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={filterPlatform}
          onChange={e => setFilterPlatform(e.target.value)}
          className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Platforms</option>
          <option value="Google Ads">Google Ads</option>
          <option value="Meta Ads">Meta Ads</option>
        </select>
        <select
          value={filterSeverity}
          onChange={e => setFilterSeverity(e.target.value)}
          className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Severity</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All Categories</option>
          {Object.keys(categoryLabels).map(cat => (
            <option key={cat} value={cat}>{categoryLabels[cat]}</option>
          ))}
        </select>
      </div>

      {/* Issues List */}
      <div className="space-y-3">
        {filtered.map(issue => (
          <div
            key={issue.id}
            className={cn(
              "bg-card border rounded-xl p-5 card-elevated transition-all",
              issue.applied ? "opacity-60 border-success/30" : "border-border"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", severityColors[issue.severity])}>{issue.severity.toUpperCase()}</span>
                  <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", categoryColors[issue.category])}>{categoryLabels[issue.category]}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{issue.platform}</span>
                  {issue.applied && <span className="text-[10px] font-semibold text-success flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Applied</span>}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{issue.title}</h3>
                <p className="text-xs text-muted-foreground mt-1">{issue.description}</p>
                <div className="mt-3 bg-success/5 border border-success/15 rounded-lg p-3 flex items-start gap-2">
                  <Zap className="h-3 w-3 text-success shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground">{issue.recommendation}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 ml-4 shrink-0">
                <div className="text-right">
                  <p className="text-[10px] text-muted-foreground">Impact</p>
                  <p className={cn(
                    "text-lg font-bold font-mono",
                    issue.impactScore >= 80 ? "text-destructive" : issue.impactScore >= 60 ? "text-warning" : "text-muted-foreground"
                  )}>{issue.impactScore}</p>
                </div>
                {!issue.applied && (
                  <button
                    onClick={() => handleApply(issue.id)}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Zap className="h-3 w-3" /> Apply Fix
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-card border border-dashed border-border rounded-xl p-12 flex flex-col items-center gap-2 text-center">
          <CheckCircle className="h-8 w-8 text-success" />
          <p className="text-sm text-foreground font-medium">No issues match your filters</p>
          <p className="text-xs text-muted-foreground">Try adjusting filters or all issues have been resolved</p>
        </div>
      )}
    </div>
  );
};

export default AuditCenter;
