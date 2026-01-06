import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import MainLayout from "./layouts/MainLayout";
import HeroSection from "./pages/landing/Hero-section";
import Overview from "./pages/landing/Overview";
import SignIn from "./pages/auth/Sign-in";
import AdminSignIn from "./pages/auth/Admin-SignIn";
import AdminSignUp from "./pages/auth/Admin-SignUp";
import LecturerSignIn from "./pages/auth/Lecturer-SignIn";
import ForgotPassword from "./pages/auth/Forgot-password";
import ResetPassword from "./pages/auth/Reset-password";
import { queryClient } from "./core/lib/query-client";
import Toast from "./components/ui/Toast-notifier";
import { FullPageSpinner } from "./components/Spinners";
import useAuthStore, { useAuthCurrentUser } from "./store/auth-store";
import useUserStore from "./store/user-store";
import StudentDashboard from "./pages/student/layout/Student-dashboard-layout";
import LecturerDashboard from "./pages/lecturer/layout/Lecturer-dashboard-layout";
import AdminDashboard from "./pages/admin/layout/Admin-dashboard-layout";
import AdminRoutes from "./pages/admin/Admin.routes";
import LecturerRoutes from "./pages/lecturer/Lecturer.routes";
import StudentRoutes from "./pages/student/Student.routes";

// Component to initialize auth on app load
const AuthInitializer = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, isLoading, error } = useAuthCurrentUser();

  useEffect(() => {
    if (error) {
      console.log("❌ Failed to fetch current user on app init");
    }
    if (user) {
      console.log("✅ Current user loaded:", user);
    }
  }, [user, error]);

  return null;
};

// Guest-only routes (redirect to dashboard if authenticated)
const GuestOnly = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      let target = "/";

      if (role === "admin" || role === "superadmin") {
        target = "/admin";
      } else if (role === "lecturer") {
        target = "/lecturer";
      } else if (role === "student") {
        target = "/student";
      }

      console.log(`🔄 Redirecting authenticated ${role} to ${target}`);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return !isAuthenticated ? children : null;
};

// Protected routes (redirect to signin if not authenticated)
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);

  // Show loading while checking auth state on initial mount
  if (isLoading) {
    return <FullPageSpinner message="Loading..." />;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    console.log("🔒 Not authenticated, redirecting to signin");
    return <Navigate to="/portal-signin" replace />;
  }

  // Check role permissions
  const role = (user.role || user.type || "").toString().toLowerCase();
  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    console.log(`⛔ Role ${role} not allowed, redirecting to home`);
    return <Navigate to="/" replace />;
  }

  return children;
};

// Landing page sections
const SectionsApp = () => {
  return (
    <div>
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <Overview />
      </section>
    </div>
  );
};

// New component to handle session expiry
const SessionExpiryHandler = () => {
  const navigate = useNavigate();
  const handleSessionExpiry = useAuthStore((state) => state.handleSessionExpiry);

  useEffect(() => {
    const handleExpiry = (event) => {
      console.log("🔔 Session expired event received:", event.detail);
      handleSessionExpiry(navigate);
    };

    window.addEventListener("session-expired", handleExpiry);

    return () => {
      window.removeEventListener("session-expired", handleExpiry);
    };
  }, [navigate, handleSessionExpiry]);

  return null;
};

// Main App Component
const App = () => {
  // Get toast state from both stores
  const authToast = useAuthStore((state) => state.toast);
  const authHideToast = useAuthStore((state) => state.hideToast);
  const userToast = useUserStore((state) => state.toast);
  const userHideToast = useUserStore((state) => state.hideToast);

  // Choose which toast to display (auth store takes precedence)
  const toastToShow = authToast?.visible ? authToast : userToast?.visible ? userToast : { visible: false, message: "", type: "info", duration: 3000 };

  // Global loader if any store indicates
  const authLoading = useAuthStore((state) => state.globalLoader);
  const userLoading = useUserStore((state) => state.globalLoader);
  const showGlobalLoader = authLoading || userLoading;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Initialize auth queries after QueryClientProvider is mounted */}
      <AuthInitializer />

      <Router>
        {/* Add session expiry handler */}
        <SessionExpiryHandler />

        {/* Global Toast */}
        <Toast
          visible={toastToShow.visible}
          message={toastToShow.message}
          type={toastToShow.type}
          duration={toastToShow.duration}
          onHide={() => {
            if (authToast?.visible) {
              authHideToast();
            } else if (userToast?.visible) {
              userHideToast();
            }
          }}
        />

        {/* Full page loader */}
        {showGlobalLoader && <FullPageSpinner message="Please wait..." />}

        <Routes>
          {/* Auth routes (no header/footer) */}
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
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
