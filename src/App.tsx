import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import Index from "./pages/Index";
import CampaignBuilder from "./pages/CampaignBuilder";
import { AudiencesPage, CreativesPage, ChannelsPage, LaunchPage, MonitoringPage, ExperimentsPage, GovernancePage, SettingsPage } from "./pages/StubPages";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/builder" element={<CampaignBuilder />} />
            <Route path="/audiences" element={<AudiencesPage />} />
            <Route path="/creatives" element={<CreativesPage />} />
            <Route path="/channels" element={<ChannelsPage />} />
            <Route path="/launch" element={<LaunchPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/experiments" element={<ExperimentsPage />} />
            <Route path="/governance" element={<GovernancePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
