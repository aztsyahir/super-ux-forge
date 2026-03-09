import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import VisitorRegistrationLanding from "./pages/VisitorRegistrationLanding";
import VisitorPreRegistration from "./pages/VisitorPreRegistration";
import GroupVisitManagement from "./pages/GroupVisitManagement";
import GroupInformationPage from "./pages/GroupInformationPage";
import AssignPassesPage from "./pages/AssignPassesPage";
import GroupCheckinPage from "./pages/GroupCheckinPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<VisitorRegistrationLanding />} />
          <Route path="/register" element={<VisitorPreRegistration />} />
          <Route path="/group-visits" element={<GroupVisitManagement />} />
          <Route path="/group-visits/:id" element={<GroupInformationPage />} />
          <Route path="/group-visits/:id/assign-passes" element={<AssignPassesPage />} />
          <Route path="/dashboard" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
