import { ReactNode, useState } from "react";
import { TopNav } from "@/components/TopNav";
import { AgentPanel } from "@/components/AgentPanel";
import { mockAgents } from "@/data/mockData";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [agentPanelCollapsed, setAgentPanelCollapsed] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <AgentPanel agents={mockAgents} collapsed={agentPanelCollapsed} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="px-1 py-1 border-b border-border bg-card">
            <button
              onClick={() => setAgentPanelCollapsed(!agentPanelCollapsed)}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
              title={agentPanelCollapsed ? "Expand agents" : "Collapse agents"}
            >
              {agentPanelCollapsed ? (
                <PanelLeftOpen className="h-3.5 w-3.5" />
              ) : (
                <PanelLeftClose className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
