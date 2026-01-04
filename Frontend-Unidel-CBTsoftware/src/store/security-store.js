/* eslint-disable no-unused-vars */
import { create } from "zustand";
import {
  useReportViolation,
  useGetSubmissionViolations,
  useGetMyViolationStats,
  useGetExamViolations,
} from "../core/apis/security-api";
import { useEffect } from "react";

const useSecurityStore = create((set) => ({
  // Client-side state
  violations: [],
  violationStats: null,
  examViolations: [],
  isLoading: false,
  error: null,

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) => 
    set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => 
    set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setViolations: (violations) => set({ violations }),
  setViolationStats: (stats) => set({ violationStats: stats }),
  setExamViolations: (violations) => set({ examViolations: violations }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearViolations: () => set({ violations: [], violationStats: null, examViolations: [], error: null }),
}));

// ========== SECURITY HOOKS ==========

export const useReportViolationAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useSecurityStore();
  const reportViolationMutation = useReportViolation();

  const reportViolation = async (violationData) => {
    console.log("[STORE] useReportViolationAction called", violationData);
    setLoading(true);
    setError(null);

    try {
      const response = await reportViolationMutation.mutateAsync(violationData);
      
      // Don't show toast for violations during exam (too disruptive)
      // Just log it
      console.log("⚠️ Violation reported:", response);
      
      return response;
    } catch (error) {
      console.error("[STORE] useReportViolationAction error:", error);
      setError(error.message);
      // Don't show error toast during exam to avoid disruption
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    reportViolation,
    isLoading: reportViolationMutation.isLoading,
    error: reportViolationMutation.error,
  };
};

export const useGetSubmissionViolationsAction = (submissionId) => {
  const { setError, setViolations } = useSecurityStore();
  const { data, isLoading, error, refetch } = useGetSubmissionViolations(submissionId);

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch submission violations:", error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data?.violations) {
      setViolations(data.violations);
      console.log("✅ Submission violations fetched successfully", data.violations.length);
    }
  }, [data, setViolations]);

  return {
    violations: data?.violations || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useGetMyViolationStatsAction = () => {
  const { setError, setViolationStats, setViolations } = useSecurityStore();
  const { data, isLoading, error, refetch } = useGetMyViolationStats();

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch violation stats:", error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      setViolationStats(data.stats);
      setViolations(data.violations || []);
      console.log("✅ Violation stats fetched successfully", data.stats);
    }
  }, [data, setViolationStats, setViolations]);

  return {
    stats: data?.stats || null,
    violations: data?.violations || [],
    isLoading,
    error,
    refetch,
  };
};

export const useGetExamViolationsAction = (examId) => {
  const { setError, setExamViolations } = useSecurityStore();
  const { data, isLoading, error, refetch } = useGetExamViolations(examId);

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch exam violations:", error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data?.violations) {
      setExamViolations(data.violations);
      console.log("✅ Exam violations fetched successfully", data.violations.length);
    }
  }, [data, setExamViolations]);

  return {
    violations: data?.violations || [],
    violationsByStudent: data?.violationsByStudent || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
};

export default useSecurityStore;
