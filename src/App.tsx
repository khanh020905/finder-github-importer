import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import { useTranslation } from "react-i18next";
import Splash from "./pages/Splash";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Swipe from "./pages/Swipe";
import Explore from "./pages/Explore";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import StudyGroups from "./pages/StudyGroups";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, profile } = useAuth();
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  if (user) {
    // If user has no name set, go to onboarding
    if (!profile?.name) return <Navigate to="/onboarding" replace />;
    return <Navigate to="/explore" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Landing page — default entry point */}
    <Route path="/" element={<Landing />} />
    <Route path="/home" element={<Landing />} />

    {/* Auth flow */}
    <Route path="/splash" element={<Splash />} />
    <Route
      path="/login"
      element={
        <PublicRoute>
          <Login />
        </PublicRoute>
      }
    />
    <Route
      path="/onboarding"
      element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      }
    />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />

    {/* Main app (with layout) */}
    <Route
      path="/swipe"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Swipe />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/explore"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Explore />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/matches"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Matches />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/messages"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Messages />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Profile />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/events"
      element={
        <ProtectedRoute>
          <AppLayout>
            <Events />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/events/:id"
      element={
        <ProtectedRoute>
          <AppLayout>
            <EventDetail />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/study-groups"
      element={
        <ProtectedRoute>
          <AppLayout>
            <StudyGroups />
          </AppLayout>
        </ProtectedRoute>
      }
    />
    <Route
      path="/user-profile"
      element={
        <ProtectedRoute>
          <AppLayout>
            <UserProfile />
          </AppLayout>
        </ProtectedRoute>
      }
    />

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
