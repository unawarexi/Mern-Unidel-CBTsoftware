import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

// Base Components
import ErrorBoundary from "./components/ErrorBoundary";
import OfflineBanner from "./components/ui/OfflineBanner";
import { FullPageSpinner } from "./components/Spinners";
import NotFound from "./pages/NotFound";

// Auth & Store
import { queryClient } from "./core/lib/query-client";

// Pages
import SignIn from "./pages/auth/Sign-in";
import AdminSignIn from "./pages/auth/Admin-SignIn";
import AgentSignIn from "./pages/auth/Agent-SignIn";
import AgentSignUp from "./pages/auth/Agent-SignUp";
import LecturerSignIn from "./pages/auth/Lecturer-SignIn";
import ForgotPassword from "./pages/auth/Forgot-password";
import ResetPassword from "./pages/auth/Reset-password";
import AuthSelection from "./pages/auth/AuthSelection";
import StudentDashboard from "./pages/student/layout/Student-dashboard-layout";
import LecturerDashboard from "./pages/lecturer/layout/Lecturer-dashboard-layout";
import AdminDashboard from "./pages/admin/layout/Admin-dashboard-layout";
import StudentApplication from "./pages/public/applications/StudentApplication";
import PublicJobs from "./pages/public/careers/PublicJobs";
import SupportPage from "./pages/shared/SupportPage";

// Layouts & Routes
import MainLayout from "./layouts/MainLayout";
import AdminRoutes from "./pages/admin/Admin.routes";
import LecturerRoutes from "./pages/lecturer/Lecturer.routes";
import StudentRoutes from "./pages/student/Student.routes";
import AgentRoutes from "./pages/agent/agent.routes";
import AgentDashboard from "./pages/agent/layout/Agent-dashboard-layout";

// Refactored Modular Components
import {
  AuthInitializer,
  NetworkInitializer,
} from "./components/AppInitializers";
import { GuestOnly, ProtectedRoute } from "./components/RouteGuards";
import { SessionExpiryHandler } from "./components/SessionExpiryHandler";
import { SectionsApp } from "./components/SectionsApp";
import { GlobalUIOverlay } from "./components/GlobalUIOverlay";
import { PrivacyPolicy, TermsOfService } from "./pages/landing/Export-landing";

// Public Content Routes
import AcademicsRoutes from "./pages/public/academics/AcademicsRoutes";
import AdmissionsRoutes from "./pages/public/admissions/AdmissionsRoutes";
import StudentLifeRoutes from "./pages/public/student-life/StudentLifeRoutes";
import ResearchRoutes from "./pages/public/research/ResearchRoutes";
import AboutRoutes from "./pages/public/about/AboutRoutes";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthInitializer />
        <NetworkInitializer />

        <Router>
          <OfflineBanner />
          <SessionExpiryHandler />
          <GlobalUIOverlay />

          <Suspense
            fallback={<FullPageSpinner message="Loading application..." />}
          >
            <Routes>
              {/* Auth routes */}
              <Route path="/portal-signin" element={<SignIn />} />
              <Route path="/admin-signin" element={<AdminSignIn />} />
              <Route path="/signin-agent" element={<AgentSignIn />} />
              <Route path="/agent-signup" element={<AgentSignUp />} />
              <Route path="/lecturer-signin" element={<LecturerSignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/auth/selection"
                element={
                  <GuestOnly>
                    <AuthSelection />
                  </GuestOnly>
                }
              />
              {/* Protected Dashboard Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["admin", "superadmin"]}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="*" element={<AdminRoutes />} />
              </Route>
              <Route
                path="/lecturer/*"
                element={
                  <ProtectedRoute allowedRoles={["lecturer"]}>
                    <LecturerDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="*" element={<LecturerRoutes />} />
              </Route>
              <Route
                path="/student/*"
                element={
                  <ProtectedRoute allowedRoles={["student"]}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="*" element={<StudentRoutes />} />
              </Route>
              <Route
                path="/agent/*"
                element={
                  <ProtectedRoute allowedRoles={["agent"]}>
                    <AgentDashboard />
                  </ProtectedRoute>
                }
              >
                <Route path="*" element={<AgentRoutes />} />
              </Route>

              {/* Main layout (header/footer) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<SectionsApp />} />
                <Route path="/apply" element={<StudentApplication />} />
                <Route path="/careers" element={<PublicJobs />} />
                <Route path="/support" element={<SupportPage />} />

                {/* Expanded Content Routes */}
                <Route path="/academics/*" element={<AcademicsRoutes />} />
                <Route path="/admissions/*" element={<AdmissionsRoutes />} />
                <Route path="/student-life/*" element={<StudentLifeRoutes />} />
                <Route path="/research/*" element={<ResearchRoutes />} />
                <Route path="/about/*" element={<AboutRoutes />} />
              </Route>
              {/* Policy pages */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              {/* 404 Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
