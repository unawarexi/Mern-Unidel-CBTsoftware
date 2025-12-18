import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
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

// Small component to initialize auth-related queries inside the QueryClientProvider
const AuthInitializer = () => {
  // eslint-disable-next-line no-unused-vars
  const { user, isLoading, error } = useAuthCurrentUser();

  // This hook will automatically run on mount and sync user to the store
  useEffect(() => {
    if (error) {
      console.log("❌ Failed to fetch current user on app init");
    }
  }, [error]);

  return null;
};

const GuestOnly = ({ children }) => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      let target = "/";

      if (role === "admin" || role === "superadmin") {
        target = "/admin-dashboard";
      } else if (role === "lecturer") {
        target = "/lecturer-dashboard";
      } else if (role === "student") {
        target = "/student-dashboard";
      }

      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return !isAuthenticated ? children : null;
};

const SectionsApp = () => {
  return (
    <div>
      {/* Sections with IDs for navigation */}
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <Overview />
      </section>
      {/* <section id="experience">
        <Experience />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="contact">
        <Contact />
      </section> */}
    </div>
  );
};

const App = () => {
  // Get toast state from both stores
  const authToast = useAuthStore((state) => state.toast);
  const authHideToast = useAuthStore((state) => state.hideToast);
  const userToast = useUserStore((state) => state.toast);
  const userHideToast = useUserStore((state) => state.hideToast);

  // Choose which toast to display (auth store takes precedence)
  const toastToShow = authToast?.visible ? authToast : userToast?.visible ? userToast : { visible: false, message: "", type: "info", duration: 3000 };

  // Global loader if any store indicates
  const authLoading = useAuthStore((state) => state.globalLoader || state.isLoading);
  const userLoading = useUserStore((state) => state.globalLoader || state.isLoading);
  const showGlobalLoader = authLoading || userLoading;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Initialize auth queries after QueryClientProvider is mounted */}
      <AuthInitializer />

      <Router>
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
          {/* Auth routes rendered outside MainLayout (no header/footer) */}
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
          <Route
            path="/reset-password"
            element={
              <GuestOnly>
                <ResetPassword />
              </GuestOnly>
            }
          />

          {/* ====================== DASHBOARD ROUTES ===================== */}
          <Route path="/admin-dashboard" element={ <GuestOnly> <AdminDashboard /></GuestOnly>}/>

          <Route
            path="/lecturer-dashboard"
            element={
              <GuestOnly>
                <LecturerDashboard />
              </GuestOnly>
            }
          />

          <Route
            path="/student-dashboard"
            element={
              <GuestOnly>
                <StudentDashboard />
              </GuestOnly>
            }
          />

          {/* Main layout wraps site pages (header/footer present) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<SectionsApp />} />
            {/* <Route path="/about" element={<About />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/contact" element={<Contact />} /> */}
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
