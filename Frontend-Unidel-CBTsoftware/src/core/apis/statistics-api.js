const API_ROOT = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";
const BASE_URL = `${API_ROOT}/statistics`;

// ========== RAW API FUNCTIONS - ACTIVITY LOGS ==========

export const createActivityLog = async (logData) => {
  console.log("[API] createActivityLog called", logData);
  const response = await fetch(`${BASE_URL}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(logData),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] createActivityLog error:", error);
    throw new Error(error.message || "Failed to create activity log");
  }
  return response.json();
};

export const getActivityLogs = async (params = {}) => {
  console.log("[API] getActivityLogs called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/activity?${queryString}` : `${BASE_URL}/activity`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getActivityLogs error:", error);
    throw new Error(error.message || "Failed to fetch activity logs");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - DASHBOARD STATISTICS ==========

export const getAdminDashboardStats = async (params = {}) => {
  console.log("[API] getAdminDashboardStats called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/admin/dashboard?${queryString}` : `${BASE_URL}/admin/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getAdminDashboardStats error:", error);
    throw new Error(error.message || "Failed to fetch admin dashboard stats");
  }
  return response.json();
};

export const getLecturerDashboardStats = async (params = {}) => {
  console.log("[API] getLecturerDashboardStats called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/lecturer/dashboard?${queryString}` : `${BASE_URL}/lecturer/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getLecturerDashboardStats error:", error);
    throw new Error(error.message || "Failed to fetch lecturer dashboard stats");
  }
  return response.json();
};

export const getStudentDashboardStats = async (params = {}) => {
  console.log("[API] getStudentDashboardStats called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/student/dashboard?${queryString}` : `${BASE_URL}/student/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getStudentDashboardStats error:", error);
    throw new Error(error.message || "Failed to fetch student dashboard stats");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - EXAM ANALYTICS ==========

export const getExamAnalytics = async (examId) => {
  console.log("[API] getExamAnalytics called", examId);
  const response = await fetch(`${BASE_URL}/exam/${examId}/analytics`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamAnalytics error:", error);
    throw new Error(error.message || "Failed to fetch exam analytics");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - SYSTEM ANALYTICS ==========

export const getSystemAnalytics = async (params = {}) => {
  console.log("[API] getSystemAnalytics called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/system/analytics?${queryString}` : `${BASE_URL}/system/analytics`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getSystemAnalytics error:", error);
    throw new Error(error.message || "Failed to fetch system analytics");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - EXPORT ==========

export const exportStatistics = async (params = {}) => {
  console.log("[API] exportStatistics called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/export?${queryString}` : `${BASE_URL}/export`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] exportStatistics error:", error);
    throw new Error(error.message || "Failed to export statistics");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - FRAUD ANALYTICS ==========

export const getFraudAnalytics = async (params = {}) => {
  console.log("[API] getFraudAnalytics called", params);
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/fraud/analytics?${queryString}` : `${BASE_URL}/fraud/analytics`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getFraudAnalytics error:", error);
    throw new Error(error.message || "Failed to fetch fraud analytics");
  }
  return response.json();
};
