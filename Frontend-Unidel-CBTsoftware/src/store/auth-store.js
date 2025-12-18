import { create } from "zustand";
import { useLogin, useLogout, useChangePasswordFirstLogin, useForgotPassword, useResetPassword, useAdminSignup, useUpdateProfile, useChangePassword, useGetCurrentUser } from "../core/api/auth-api";

const persistedUser = (() => {
  try {
    const raw = localStorage.getItem("authUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
})();

const useAuthStore = create((set) => ({
  // Client-side state
  user: persistedUser,
  isAuthenticated: !!persistedUser,
  isLoading: false,
  error: null,
  isFirstLogin: false,

  // Global UI state (toast / loader)
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) => set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setUser: (user) => {
    try {
      if (user) localStorage.setItem("authUser", JSON.stringify(user));
      else localStorage.removeItem("authUser");
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      // ignore
    }
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  setFirstLogin: (isFirstLogin) => set({ isFirstLogin }),

  clearAuth: () =>
    set({
      user: null,
      isAuthenticated: false,
      error: null,
      isFirstLogin: false,
    }),
}));

// ========== WRAPPER HOOKS FOR COMPONENTS ==========
// These hooks integrate TanStack Query with Zustand store

export const useAuthLogin = () => {
  const { setUser, setLoading, setError, setFirstLogin, showToast, showLoader, hideLoader } = useAuthStore();
  const loginMutation = useLogin();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await loginMutation.mutateAsync(credentials);

      // Check if it's first login
      if (data.user?.isFirstLogin) {
        setFirstLogin(true);
        showToast("First login detected. Please change your password.", "info");
      } else {
        setUser(data.user);
        showToast("Login successful", "success");
      }

      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Login failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    login,
    isLoading: loginMutation.isLoading,
    error: loginMutation.error,
  };
};

export const useAuthLogout = () => {
  const { clearAuth, setLoading, setError, showToast, showLoader, hideLoader } = useAuthStore();
  const logoutMutation = useLogout();

  const logout = async () => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      await logoutMutation.mutateAsync();
      clearAuth();
      localStorage.removeItem("authUser");
      showToast("Logged out successfully", "success");
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Logout failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    logout,
    isLoading: logoutMutation.isLoading,
    error: logoutMutation.error,
  };
};

export const useAuthChangePasswordFirstLogin = () => {
  const { setUser, setFirstLogin, setLoading, setError, showToast, showLoader, hideLoader } = useAuthStore();
  const changePasswordMutation = useChangePasswordFirstLogin();

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await changePasswordMutation.mutateAsync(passwordData);
      setUser(data.user);
      setFirstLogin(false);
      showToast("Password changed successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Password change failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    changePassword,
    isLoading: changePasswordMutation.isLoading,
    error: changePasswordMutation.error,
  };
};

export const useAuthForgotPassword = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useAuthStore();
  const forgotPasswordMutation = useForgotPassword();

  const forgotPassword = async (payload) => {
    // payload: { email, role?, identifier? }
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await forgotPasswordMutation.mutateAsync(payload);
      showToast("Password reset email sent successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Request failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    forgotPassword,
    isLoading: forgotPasswordMutation.isLoading,
    error: forgotPasswordMutation.error,
  };
};

export const useAuthResetPassword = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useAuthStore();
  const resetPasswordMutation = useResetPassword();

  const resetPassword = async (resetData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await resetPasswordMutation.mutateAsync(resetData);
      showToast("Password reset successful", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Password reset failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    resetPassword,
    isLoading: resetPasswordMutation.isLoading,
    error: resetPasswordMutation.error,
  };
};

export const useAuthAdminSignup = () => {
  const { setUser, setLoading, setError, showToast, showLoader, hideLoader } = useAuthStore();
  const signupMutation = useAdminSignup();

  const signup = async (signupData) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const data = await signupMutation.mutateAsync(signupData);
      setUser(data.user);
      showToast("Admin account created", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Signup failed", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    signup,
    isLoading: signupMutation.isLoading,
    error: signupMutation.error,
  };
};

export const useAuthUpdateProfile = () => {
  const { setUser, setLoading, setError, showToast } = useAuthStore();
  const updateProfileMutation = useUpdateProfile();

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await updateProfileMutation.mutateAsync(profileData);
      setUser(data.user);
      showToast("Profile updated successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Profile update failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    isLoading: updateProfileMutation.isLoading,
    error: updateProfileMutation.error,
  };
};

export const useAuthChangePassword = () => {
  const { setLoading, setError, showToast } = useAuthStore();
  const changePasswordMutation = useChangePassword();

  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await changePasswordMutation.mutateAsync(passwordData);
      showToast("Password changed successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Password change failed", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    changePassword,
    isLoading: changePasswordMutation.isLoading,
    error: changePasswordMutation.error,
  };
};

export const useAuthCurrentUser = () => {
  const { setUser, setError } = useAuthStore();
  const { data, isLoading, error, refetch } = useGetCurrentUser();

  // Sync TanStack Query data with Zustand store
  if (data?.user) {
    setUser(data.user);
  }

  if (error) {
    setError(error.message);
  }

  return {
    user: data?.user,
    isLoading,
    error,
    refetch,
  };
};

export default useAuthStore;
