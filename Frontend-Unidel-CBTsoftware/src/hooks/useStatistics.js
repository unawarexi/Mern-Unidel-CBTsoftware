import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createActivityLog,
  getActivityLogs,
  getAdminDashboardStats,
  getLecturerDashboardStats,
  getStudentDashboardStats,
  getExamAnalytics,
  getSystemAnalytics,
  exportStatistics,
  getFraudAnalytics,
} from "../core/apis/statistics-api";

// ========== STANDARD QUERY OPTIONS ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
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

// ========== REACT QUERY HOOKS - FRAUD ANALYTICS ==========

export const useGetFraudAnalytics = (params = {}) => {
  return useQuery({
    queryKey: ["fraud-analytics", params],
    queryFn: () => getFraudAnalytics(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};
