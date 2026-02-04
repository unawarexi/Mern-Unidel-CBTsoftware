import React, { useEffect, useCallback, useMemo } from "react";
import { throttle } from "../core/services/debounce-throttle";
import { create } from "zustand";
import {
  useLogin,
  useLogout,
  useChangePasswordFirstLogin,
  useForgotPassword,
  useResetPassword,
  useAdminSignup,
  useUpdateProfile,
  useChangePassword,
  useGetCurrentUser,
} from "../hooks/useAuth";

// Initial state is null, we will fetch from /me
const persistedUser = null;

export const useAuthStore = create((set) => ({
  // State
  user: persistedUser,
  isAuthenticated: !!persistedUser,
  isLoading: !persistedUser, // Only loading if no persisted user
  error: null,
  isFirstLogin: false,
  isSessionExpired: false, // Flag to prevent multiple session expiry redirects

  // Global UI state (toast / loader)
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) =>
    set({ toast: { visible: true, message, type, duration } }),
  hideToast: () =>
    set({
      toast: { visible: false, message: "", type: "success", duration: 3000 },
    }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setUser: (user) => {
    console.log("[STORE] setUser called", user);
    // Cookie-based auth: no localStorage
    set({ user, isAuthenticated: !!user, isSessionExpired: false }); // Reset session expired flag on login
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFirstLogin: (isFirstLogin) => set({ isFirstLogin }),

  clearAuth: () => {
    console.log("[STORE] clearAuth called");
    // Cookie-based auth: no localStorage
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isFirstLogin: false,
    });
  },

  // Add session expiry handler
  handleSessionExpiry: (navigate) => {
    const state = useAuthStore.getState();
    const user = state.user;

    // Prevent multiple session expiry calls
    if (state.isSessionExpired) {
      console.log("⚠️ Session expiry already handled, skipping duplicate");
      return;
    }

    const role = (user?.role || user?.type || "").toString().toLowerCase();

    // Determine redirect route based on role
    let redirectRoute = "/portal-signin";
    if (role === "admin" || role === "superadmin") {
      redirectRoute = "/admin-signin";
    } else if (role === "lecturer") {
      redirectRoute = "/lecturer-signin";
    } else if (role === "agent") {
      redirectRoute = "/signin-agent";
    }

    // Clear auth state and set session expired flag
    // Cookie-based auth: no localStorage

    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isFirstLogin: false,
      isSessionExpired: true, // Set flag to prevent multiple redirects
      toast: {
        visible: true,
        message: "Your session has expired. Please login again.",
        type: "warning",
        duration: 5000,
      },
    });

    // Navigate to appropriate signin page
    if (navigate) {
      navigate(redirectRoute, { replace: true });
    }

    console.log(`🔒 Session expired, redirecting to ${redirectRoute}`);
  },
}));

// ========== WRAPPER HOOKS FOR COMPONENTS ==========

export const useAuthLogin = () => {
  const { setUser, setFirstLogin, showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useLogin();

  const login = useMemo(
    () =>
      throttle(
        async (credentials) => {
          setLoading(true);
          try {
            const data = await mutateAsync(credentials);
            if (data?.requirePasswordChange || data.user?.isFirstLogin) {
              setFirstLogin(true);
              showToast(
                "First login detected. Please change your password.",
                "info",
              );
            } else if (data.user) {
              setUser(data.user);
              showToast("Login successful", "success");
            }
            return data;
          } catch (error) {
            showToast(error.message || "Login failed", "error");
            throw error;
          } finally {
            setLoading(false);
          }
        },
        2000,
        { trailing: false },
      ),
    [mutateAsync, setUser, setFirstLogin, showToast, setLoading],
  );

  return { login, isLoading };
};

export const useAuthLogout = () => {
  const { clearAuth, showToast } = useAuthStore();
  const { mutateAsync, isLoading } = useLogout();

  const logout = async () => {
    try {
      await mutateAsync();
      showToast("Logged out successfully", "success");
    } catch (error) {
      showToast(error.message || "Logout failed", "error");
    } finally {
      clearAuth();
    }
  };

  return { logout, isLoading };
};

export const useAuthChangePasswordFirstLogin = () => {
  const { setUser, setFirstLogin, showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useChangePasswordFirstLogin();

  const changePassword = async (data) => {
    setLoading(true);
    try {
      const result = await mutateAsync(data);
      setUser(result.user);
      setFirstLogin(false);
      showToast("Password changed successfully", "success");
      return result;
    } catch (error) {
      showToast(error.message || "Change failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, isLoading };
};

export const useAuthForgotPassword = () => {
  const { showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useForgotPassword();

  const forgotPassword = async (payload) => {
    setLoading(true);
    try {
      const res = await mutateAsync(payload);
      showToast("Reset email sent", "success");
      return res;
    } catch (error) {
      showToast(error.message || "Request failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { forgotPassword, isLoading };
};

export const useAuthResetPassword = () => {
  const { showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useResetPassword();

  const resetPassword = async (data) => {
    setLoading(true);
    try {
      const res = await mutateAsync(data);
      showToast("Password reset successful", "success");
      return res;
    } catch (error) {
      showToast(error.message || "Reset failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, isLoading };
};

export const useAuthAdminSignup = () => {
  const { setUser, showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useAdminSignup();

  const signup = async (data) => {
    setLoading(true);
    try {
      const res = await mutateAsync(data);
      setUser(res.user);
      showToast("Admin account created", "success");
      return res;
    } catch (error) {
      showToast(error.message || "Signup failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { signup, isLoading };
};

export const useAuthUpdateProfile = () => {
  const { setUser, showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useUpdateProfile();

  const updateProfile = async (data) => {
    setLoading(true);
    try {
      const res = await mutateAsync(data);
      setUser(res.user);
      showToast("Profile updated", "success");
      return res;
    } catch (error) {
      showToast(error.message || "Update failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { updateProfile, isLoading };
};

export const useAuthChangePassword = () => {
  const { showToast, setLoading } = useAuthStore();
  const { mutateAsync, isLoading } = useChangePassword();

  const changePassword = async (data) => {
    setLoading(true);
    try {
      const res = await mutateAsync(data);
      showToast("Password changed", "success");
      return res;
    } catch (error) {
      showToast(error.message || "Change failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { changePassword, isLoading };
};

export const useAuthCurrentUser = () => {
  const { setUser, clearAuth, setLoading } = useAuthStore();
  const { data, isLoading, error, refetch } = useGetCurrentUser({
    // Always try to fetch unless we know we are explicitly logged out (optional optimization, but simple is better)
    enabled: true,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      const userObj = data.user || data.data;
      if (userObj) setUser(userObj);
      else clearAuth();
    }
    if (error) {
      const isAuthErr = ["401", "403", "unauthorized", "expired"].some((k) =>
        error.message?.toLowerCase().includes(k),
      );
      if (isAuthErr) clearAuth();
    }

    // Sync loading state: if query is done, turn off global loader
    if (!isLoading) {
      setLoading(false);
    }
  }, [data, error, isLoading, setUser, clearAuth, setLoading]);

  return { user: data?.user || data?.data, isLoading, error, refetch };
};

export default useAuthStore;
