import { create } from "zustand";
import { useEffect } from "react";
import {
  useCreateActivityLog,
  useGetActivityLogs,
  useGetAdminDashboardStats,
  useGetLecturerDashboardStats,
  useGetStudentDashboardStats,
  useGetExamAnalytics,
  useGetSystemAnalytics,
  useExportStatistics,
  useGetFraudAnalytics,
} from "../core/apis/statistics-api";

const useStatisticsStore = create((set) => ({
  // State
  dashboardStats: null,
  examAnalytics: null,
  activityLogs: [],
  fraudAnalytics: null,
  isLoading: false,
  error: null,

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) =>
    set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setDashboardStats: (stats) => set({ dashboardStats: stats }),
  setExamAnalytics: (analytics) => set({ examAnalytics: analytics }),
  setActivityLogs: (logs) => set({ activityLogs: logs }),
  setFraudAnalytics: (analytics) => set({ fraudAnalytics: analytics }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// ========== ACTIVITY LOG HOOKS ==========

export const useCreateActivityLogAction = () => {
  const { setError } = useStatisticsStore();
  const createActivityLogMutation = useCreateActivityLog();

  const createActivityLog = async (logData) => {
    console.log("[STORE] useCreateActivityLogAction called", logData);
    try {
      const result = await createActivityLogMutation.mutateAsync(logData);
      return result;
    } catch (error) {
      console.error("[STORE] useCreateActivityLogAction error:", error);
      setError(error.message);
      throw error;
    }
  };

  return {
    createActivityLog,
    isLoading: createActivityLogMutation.isPending,
    error: createActivityLogMutation.error,
  };
};

export const useGetActivityLogsAction = (params = {}) => {
  const { setActivityLogs, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetActivityLogs(params);

  useEffect(() => {
    if (data) {
      setActivityLogs(data.data || []);
    }
  }, [data, setActivityLogs]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    activityLogs: data?.data || [],
    pagination: data?.pagination,
    isLoading,
    error,
    refetch,
  };
};

// ========== DASHBOARD STATS HOOKS ==========

export const useGetAdminDashboardStatsAction = (params = {}) => {
  const { setDashboardStats, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetAdminDashboardStats(params);

  useEffect(() => {
    if (data) {
      setDashboardStats(data.data);
    }
  }, [data, setDashboardStats]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    dashboardStats: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetLecturerDashboardStatsAction = (params = {}) => {
  const { setDashboardStats, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetLecturerDashboardStats(params);

  useEffect(() => {
    if (data) {
      setDashboardStats(data.data);
    }
  }, [data, setDashboardStats]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    dashboardStats: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export const useGetStudentDashboardStatsAction = (params = {}) => {
  const { setDashboardStats, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetStudentDashboardStats(params);

  useEffect(() => {
    if (data) {
      setDashboardStats(data.data);
    }
  }, [data, setDashboardStats]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    dashboardStats: data?.data,
    isLoading,
    error,
    refetch,
  };
};

// ========== EXAM ANALYTICS HOOKS ==========

export const useGetExamAnalyticsAction = (examId) => {
  const { setExamAnalytics, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetExamAnalytics(examId);

  useEffect(() => {
    if (data) {
      setExamAnalytics(data.data);
    }
  }, [data, setExamAnalytics]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    examAnalytics: data?.data,
    isLoading,
    error,
    refetch,
  };
};

// ========== SYSTEM ANALYTICS HOOKS ==========

export const useGetSystemAnalyticsAction = (params = {}) => {
  const { setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetSystemAnalytics(params);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    systemAnalytics: data?.data,
    isLoading,
    error,
    refetch,
  };
};

// ========== EXPORT HOOKS ==========

export const useExportStatisticsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useStatisticsStore();
  const exportStatisticsMutation = useExportStatistics();

  const exportStatistics = async (params) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await exportStatisticsMutation.mutateAsync(params);
      showToast("Statistics exported successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useExportStatisticsAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to export statistics", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    exportStatistics,
    isLoading: exportStatisticsMutation.isPending,
    error: exportStatisticsMutation.error,
  };
};

// ========== FRAUD ANALYTICS HOOKS ==========

export const useGetFraudAnalyticsAction = (params = {}) => {
  const { setFraudAnalytics, setError } = useStatisticsStore();
  const { data, isLoading, error, refetch } = useGetFraudAnalytics(params);

  useEffect(() => {
    if (data) {
      setFraudAnalytics(data.data);
    }
  }, [data, setFraudAnalytics]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    fraudAnalytics: data?.data,
    isLoading,
    error,
    refetch,
  };
};

export default useStatisticsStore;
