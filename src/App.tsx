import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PolicePage from './pages/Police';
import CreatePostPage from './pages/CreatePostPage';
import SafetyTipsPage from './pages/SafetyTipsPage';
import BrowsePage from './pages/BrowsePage';
import MainLayout from './components/MainLayout';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/police" element={<MainLayout><PolicePage /></MainLayout>} />
          <Route path="/create-post" element={<MainLayout><CreatePostPage /></MainLayout>} />
          <Route path="/safety-tips" element={<MainLayout><SafetyTipsPage /></MainLayout>} />
          <Route path="/browse" element={<MainLayout><BrowsePage /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
