
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BlogHome from "./pages/BlogHome";
import BlogPost from "./pages/BlogPost";
import BlogCategory from "./pages/BlogCategory";
import BlogAdmin from "./pages/BlogAdmin";
import AboutPage from "./pages/AboutPage";
import ExpertisePage from "./pages/ExpertisePage";
import CalculatorsPage from "./pages/CalculatorsPage";
import ComplianceToolsPage from "./pages/ComplianceToolsPage";
import NotFound from "./pages/NotFound";
import ContactPage from "./pages/ContactPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import TermsOfUsePage from "./pages/TermsOfUsePage";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BlogHome />} />
          <Route path="/post/:slug" element={<BlogPost />} />
          <Route path="/category/:category" element={<BlogCategory />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/expertise" element={<ExpertisePage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
          <Route path="/compliance-tools" element={<ComplianceToolsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookies-policy" element={<CookiePolicyPage />} />
          <Route path="/terms-of-service" element={<TermsOfUsePage />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedAdminRoute>
                <BlogAdmin />
              </ProtectedAdminRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
