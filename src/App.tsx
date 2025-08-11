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
import PostDetailsPage from './pages/PostDetailsPage';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/police" element={<PolicePage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/safety-tips" element={<SafetyTipsPage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/post/:id" element={<PostDetailsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
