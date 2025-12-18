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
import { FullPageSpinner, ButtonSpinner } from "./components/Spinners";
import useAuthStore, { useAuthCurrentUser } from "./store/auth-store";
import useUserStore from "./store/user-store";

// Scroll to hash component
// const ScrollToHash = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // If there's a hash in the URL, scroll to that element
//     if (location.hash) {
//       const id = location.hash.substring(1); // Remove the # character
//       const element = document.getElementById(id);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//       }
//     } else {
//       // If no hash, scroll to top
//       window.scrollTo(0, 0);
//     }
//   }, [location]);

//   return null;
// };

// const ProtectedRoute = ({ children }) => {
//   const authData = JSON.parse(localStorage.getItem("authValid"));
//   const isAuthenticated = authData?.valid && Date.now() < authData.expiresAt;

//   return isAuthenticated ? children : <Navigate to="/auth" />;
// };

const App = () => {
  // Ensure we fetch current user on app mount (keeps auth state fresh)
  useAuthCurrentUser();

  const authToast = useAuthStore((s) => s.toast);
  const authHideToast = useAuthStore((s) => s.hideToast);
  const userToast = useUserStore((s) => s.toast);
  const userHideToast = useUserStore((s) => s.hideToast);

  // Choose which toast to display (auth store takes precedence)
  const toastToShow = authToast.visible ? authToast : userToast.visible ? userToast : { visible: false };

  // Global loader if any store indicates
  const authLoading = useAuthStore((s) => s.globalLoader || s.isLoading);
  const userLoading = useUserStore((s) => s.globalLoader || s.isLoading);
  const showGlobalLoader = authLoading || userLoading;

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/">
        {/* Global Toast */}
        <Toast visible={toastToShow.visible} message={toastToShow.message} type={toastToShow.type} duration={toastToShow.duration} onHide={() => { authToast.visible ? authHideToast() : userHideToast(); }} />

        {/* Full page loader */}
        {showGlobalLoader && <FullPageSpinner message="Please wait..." />}

        <Routes>
          {/* Auth routes rendered outside MainLayout (no header/footer) */}
          <Route path="/portal-signin" element={<GuestOnly><SignIn /></GuestOnly>} />
          <Route path="/admin-signin" element={<GuestOnly><AdminSignIn /></GuestOnly>} />
          <Route path="/admin-signup" element={<GuestOnly><AdminSignUp /></GuestOnly>} />
          <Route path="/lecturer-signin" element={<GuestOnly><LecturerSignIn /></GuestOnly>} />
          <Route path="/forgot-password" element={<GuestOnly><ForgotPassword /></GuestOnly>} />
          <Route path="/reset-password" element={<GuestOnly><ResetPassword /></GuestOnly>} />

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

const GuestOnly = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  useEffect(() => {
    if (isAuthenticated && user) {
      const role = (user.role || user.type || "").toString().toLowerCase();
      const target = role === "admin" ? "/admin-dashboard" : role === "lecturer" ? "/lecturer-dashboard" : "/student-dashboard";
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

export default App;
