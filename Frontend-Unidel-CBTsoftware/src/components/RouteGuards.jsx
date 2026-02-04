import React, { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import useAuthStore from "../store/auth-store";
import { FullPageSpinner } from "./Spinners";

// Guest-only routes (redirect to dashboard if authenticated)
export const GuestOnly = ({ children }) => {
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
      } else if (role === "agent") {
        target = "/agent";
      }

      console.log(` Redirecting authenticated ${role} to ${target}`);
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  return !isAuthenticated ? children : null;
};

// Protected routes (redirect to signin if not authenticated)
export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isSessionExpired = useAuthStore((state) => state.isSessionExpired);

  // Show loading while checking auth state on initial mount
  if (isLoading) {
    return <FullPageSpinner message="Loading..." />;
  }

  // If session just expired, don't double-redirect - SessionExpiryHandler handles it
  if (isSessionExpired) {
    return <FullPageSpinner message="Session expired, redirecting..." />;
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated || !user) {
    console.log("🔒 Not authenticated, redirecting to signin");
    return <Navigate to="/portal-signin" replace />;
  }

  // Check role permissions
  const role = (user.role || user.type || "").toString().toLowerCase();

  // Debug role matching
  console.log(
    `Checking permissions for role: ${role}. Allowed roles:`,
    allowedRoles,
  );

  if (allowedRoles.length > 0) {
    const isAllowed =
      allowedRoles.includes(role) ||
      (role === "superadmin" && allowedRoles.includes("admin"));

    if (!isAllowed) {
      console.log(`⚠️ Role ${role} not allowed, redirecting to home`);
      return <Navigate to="/" replace />;
    }
  }

  return children;
};
