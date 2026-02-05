const API_ROOT =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/auth`;

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

// Agent signup
export const agentSignup = async (data) => {
  const response = await fetch(`${BASE_URL}/agent/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Agent signup failed");
  }
  return response.json();
};

// Admin signup (Invitation based - this endpoint might change but export is needed for boot)
export const adminSignup = async (data) => {
  const response = await fetch(`${BASE_URL}/admin/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Admin signup failed");
  }
  return response.json();
};

// Get current user with session expiry detection
export const getCurrentUser = async () => {
  let response = await fetch(`${BASE_URL}/me`, {
    method: "GET",
    credentials: "include",
  });

  // If 401, try to refresh token
  if (response.status === 401) {
    try {
      const refreshRes = await refreshToken();
      if (refreshRes.success) {
        // Retry original request
        response = await fetch(`${BASE_URL}/me`, {
          method: "GET",
          credentials: "include",
        });
      }
    } catch (err) {
      console.log("Silent refresh failed:", err);
      // Fall through to return null
    }
  }

  // If still not authenticated or session expired, return null
  if (response.status === 401 || response.status === 403) {
    return { user: null };
  }

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch user");
  }

  const data = await response.json();
  return { user: data.user || data.data || null };
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
