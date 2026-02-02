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
import AdminSignUp from "./pages/auth/Admin-SignUp";
import LecturerSignIn from "./pages/auth/Lecturer-SignIn";
import ForgotPassword from "./pages/auth/Forgot-password";
import ResetPassword from "./pages/auth/Reset-password";
import AuthSelection from "./pages/auth/AuthSelection";
import StudentDashboard from "./pages/student/layout/Student-dashboard-layout";
import LecturerDashboard from "./pages/lecturer/layout/Lecturer-dashboard-layout";
import AdminDashboard from "./pages/admin/layout/Admin-dashboard-layout";

// Layouts & Routes
import MainLayout from "./layouts/MainLayout";
import AdminRoutes from "./pages/admin/Admin.routes";
import LecturerRoutes from "./pages/lecturer/Lecturer.routes";
import StudentRoutes from "./pages/student/Student.routes";

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
              <Route
                path="/portal-signin"
                element={
                  <GuestOnly>
                    <SignIn />
                  </GuestOnly>
                }
              />
              <Route
                path="/admin-signin"
                element={
                  <GuestOnly>
                    <AdminSignIn />
                  </GuestOnly>
                }
              />
              <Route
                path="/admin-signup"
                element={
                  <GuestOnly>
                    <AdminSignUp />
                  </GuestOnly>
                }
              />
              <Route
                path="/lecturer-signin"
                element={
                  <GuestOnly>
                    <LecturerSignIn />
                  </GuestOnly>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <GuestOnly>
                    <ForgotPassword />
                  </GuestOnly>
                }
              />
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

              {/* Main layout (header/footer) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<SectionsApp />} />
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
