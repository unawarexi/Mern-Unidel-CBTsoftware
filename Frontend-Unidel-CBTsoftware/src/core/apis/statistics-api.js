import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/statistics";

// ========== RAW API FUNCTIONS - ACTIVITY LOGS ==========

export const createActivityLog = async (logData) => {
  const response = await fetch(`${BASE_URL}/activity`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(logData),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create activity log");
  }
  return response.json();
};

export const getActivityLogs = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/activity?${queryString}` : `${BASE_URL}/activity`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch activity logs");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - DASHBOARD STATISTICS ==========

export const getAdminDashboardStats = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/admin/dashboard?${queryString}` : `${BASE_URL}/admin/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch admin dashboard stats");
  }
  return response.json();
};

export const getLecturerDashboardStats = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/lecturer/dashboard?${queryString}` : `${BASE_URL}/lecturer/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch lecturer dashboard stats");
  }
  return response.json();
};

export const getStudentDashboardStats = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/student/dashboard?${queryString}` : `${BASE_URL}/student/dashboard`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch student dashboard stats");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - EXAM ANALYTICS ==========

export const getExamAnalytics = async (examId) => {
  const response = await fetch(`${BASE_URL}/exam/${examId}/analytics`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch exam analytics");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - SYSTEM ANALYTICS ==========

export const getSystemAnalytics = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/system/analytics?${queryString}` : `${BASE_URL}/system/analytics`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch system analytics");
  }
  return response.json();
};

// ========== RAW API FUNCTIONS - EXPORT ==========

export const exportStatistics = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${BASE_URL}/export?${queryString}` : `${BASE_URL}/export`;
  
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to export statistics");
  }
  return response.json();
};

// ========== STANDARD QUERY OPTIONS ==========

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS - ACTIVITY LOGS ==========

export const useCreateActivityLog = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createActivityLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activity-logs"] });
    },
  });
};

export const useGetActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getActivityLogs(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - DASHBOARD STATISTICS ==========

export const useGetAdminDashboardStats = (params = {}) => {
  return useQuery({
    queryKey: ["admin-dashboard-stats", params],
    queryFn: () => getAdminDashboardStats(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetLecturerDashboardStats = (params = {}) => {
  return useQuery({
    queryKey: ["lecturer-dashboard-stats", params],
    queryFn: () => getLecturerDashboardStats(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetStudentDashboardStats = (params = {}) => {
  return useQuery({
    queryKey: ["student-dashboard-stats", params],
    queryFn: () => getStudentDashboardStats(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - EXAM ANALYTICS ==========

export const useGetExamAnalytics = (examId) => {
  return useQuery({
    queryKey: ["exam-analytics", examId],
    queryFn: () => getExamAnalytics(examId),
    enabled: !!examId,
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - SYSTEM ANALYTICS ==========

export const useGetSystemAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ["system-analytics", params],
    queryFn: () => getSystemAnalytics(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - EXPORT ==========

export const useExportStatistics = () => {
  return useMutation({
    mutationFn: exportStatistics,
  });
};
