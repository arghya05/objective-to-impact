import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Growth Brain", path: "/growth-brain" },
  { label: "Campaign Builder", path: "/builder" },
  { label: "Audiences", path: "/audiences" },
  { label: "Creatives Studio", path: "/creatives" },
  { label: "Channels & Budgets", path: "/channels" },
  { label: "Launch Center", path: "/launch" },
  { label: "Monitoring", path: "/monitoring" },
  { label: "Experiments", path: "/experiments" },
  { label: "Audit Center", path: "/audit" },
  { label: "Governance", path: "/governance" },
  { label: "Settings", path: "/settings" },
];

export function TopNav() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-6 shrink-0">
      <div className="flex items-center gap-3 mr-8">
        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-sm">
          <span className="text-primary-foreground text-sm font-bold font-display">A</span>
        </div>
        <span className="text-sm font-semibold text-foreground font-display hidden sm:inline tracking-tight">
          Agentic Campaign OS
        </span>
      </div>
      <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )
            }
          >
            {item.label}
          </RouterNavLink>
        ))}
      </nav>
    </header>
  );
}
