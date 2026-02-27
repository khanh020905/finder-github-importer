import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";
import Swipe from "./pages/Swipe";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Landing page */}
          <Route path="/home" element={<Landing />} />

          {/* Auth flow */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Main app (with layout) */}
          <Route path="/" element={<AppLayout><Swipe /></AppLayout>} />
          <Route path="/explore" element={<AppLayout><Explore /></AppLayout>} />
          <Route path="/matches" element={<AppLayout><Matches /></AppLayout>} />
          <Route path="/messages" element={<AppLayout><Messages /></AppLayout>} />
          <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
