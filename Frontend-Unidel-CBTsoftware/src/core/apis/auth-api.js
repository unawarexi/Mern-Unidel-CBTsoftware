import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/auth";

// ========== API FUNCTIONS ==========

// Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }
  return response.json();
};

// Change password on first login
export const changePasswordFirstLogin = async (data) => {
  const response = await fetch(`${BASE_URL}/change-password-first-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Password change failed");
  }
  return response.json();
};

// Forgot password
export const forgotPassword = async (payload) => {
  // payload: { email, role?, identifier?, ... }
  const response = await fetch(`${BASE_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }
  return response.json();
};

// Reset password
export const resetPassword = async (data) => {
  const response = await fetch(`${BASE_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Password reset failed");
  }
  return response.json();
};

// Admin signup
export const adminSignup = async (data) => {
  const response = await fetch(`${BASE_URL}/admin/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    console.log(error.message);
    throw new Error(error.message || "Signup failed");
    
  }
  return response.json();
};

// Get current user
export const getCurrentUser = async () => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  // If not authenticated, return null user instead of throwing
  if (response.status === 401) {
    return { user: null };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user");
  }

  return response.json();
};

// Update profile
export const updateProfile = async (data) => {
  const response = await fetch(`${BASE_URL}/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Profile update failed");
  }
  return response.json();
};

// Change password
export const changePassword = async (data) => {
  const response = await fetch(`${BASE_URL}/change-password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Password change failed");
  }
  return response.json();
};

// Logout
export const logout = async () => {
  const response = await fetch(`${BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Logout failed");
  }
  return response.json();
};

// Refresh token
export const refreshToken = async () => {
  const response = await fetch(`${BASE_URL}/refresh-token`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Token refresh failed");
  }
  return response.json();
};

// ========== REACT QUERY HOOKS ==========

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // wrap cache value same shape as getCurrentUser -> { user: ... }
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};

// Change password first login mutation
export const useChangePasswordFirstLogin = () => {
  return useMutation({
    mutationFn: changePasswordFirstLogin,
  });
};

// Forgot password mutation
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,
  });
};

// Reset password mutation
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

// Admin signup mutation
export const useAdminSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminSignup,
    onSuccess: (data) => {
      // keep consistent shape
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};

// Get current user query (accept options to control enabled)
export const useGetCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options.enabled ?? true,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      // ensure we set shape { user }
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};

// Change password mutation
export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["currentUser"], null);
      queryClient.clear();
    },
  });
};

// Refresh token mutation
export const useRefreshToken = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: refreshToken,
    onSuccess: (data) => {
      // ensure consistent shape
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};
