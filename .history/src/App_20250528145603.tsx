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
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
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
          <Route path="/police" element={<PolicePage />} />
          <Route path="/create-post" element={<CreatePostPage />} />
          <Route path="/safety-tips" element={<SafetyTipsPage />} />
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/signin" element={<MainLayout><SignInPage /></MainLayout>} />
          <Route path="/signup" element={<MainLayout><SignUpPage /></MainLayout>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
