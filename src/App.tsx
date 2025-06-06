
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Campaigns from "./components/Campaigns";
import CampaignBuilder from "./components/CampaignBuilder";
import CampaignSetup from "./components/CampaignSetup";
import LinkedInConnect from "./components/LinkedInConnect";
import Inbox from "./components/Inbox";
import Contacts from "./components/Contacts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/campaigns" element={<Layout><Campaigns /></Layout>} />
          <Route path="/campaigns/new" element={<CampaignBuilder />} />
          <Route path="/campaigns/:id" element={<CampaignBuilder />} />
          <Route path="/campaigns/:id/setup" element={<CampaignSetup />} />
          <Route path="/linkedin-connect" element={<LinkedInConnect />} />
          <Route path="/inbox" element={<Layout><Inbox /></Layout>} />
          <Route path="/contacts" element={<Layout><Contacts /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
