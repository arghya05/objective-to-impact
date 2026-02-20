import { NavLink as RouterNavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", path: "/" },
  { label: "Campaign Builder", path: "/builder" },
  { label: "Audiences", path: "/audiences" },
  { label: "Creatives Studio", path: "/creatives" },
  { label: "Channels & Budgets", path: "/channels" },
  { label: "Launch Center", path: "/launch" },
  { label: "Monitoring", path: "/monitoring" },
  { label: "Experiments", path: "/experiments" },
  { label: "Governance", path: "/governance" },
  { label: "Settings", path: "/settings" },
];

export function TopNav() {
  return (
    <header className="h-12 border-b border-border bg-card flex items-center px-4 shrink-0">
      <div className="flex items-center gap-3 mr-6">
        <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
          <span className="text-primary-foreground text-xs font-bold">A</span>
        </div>
        <span className="text-sm font-semibold text-foreground hidden sm:inline">
          Agentic Campaign OS
        </span>
      </div>
      <nav className="flex items-center gap-0.5 overflow-x-auto scrollbar-none flex-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            className={({ isActive }) =>
              cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
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
