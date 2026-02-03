import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  loginUser,
  changePasswordFirstLogin,
  forgotPassword,
  resetPassword,
  adminSignup,
  getCurrentUser,
  updateProfile,
  changePassword,
  logout,
  refreshToken,
  agentSignup,
} from "../core/apis/auth-api";

// ========== REACT QUERY HOOKS ==========

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
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
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};

// Agent signup mutation
export const useAgentSignup = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: agentSignup,
    onSuccess: (data) => {
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};

// Get current user query
export const useGetCurrentUser = (options = {}) => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    enabled: options.enabled ?? true,
  });
};

// Update profile mutation
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
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
      queryClient.setQueryData(["currentUser"], { user: data.user });
    },
  });
};
