import { create } from "zustand";
import { useEffect } from "react";
import {
  useStartExam,
  useSaveAnswer,
  useSubmitExam,
  useGetStudentSubmission,
  useGetMySubmissions,
  useGetExamSubmissions,
  useGetExamStatistics,
  useAddFeedback,
  useFlagSubmission,
  useGetAllSubmissions,
  useGetSystemStatistics,
  useDeleteSubmission,
} from "../core/apis/submission-api";

const useSubmissionStore = create((set) => ({
  // State
  currentSubmission: null,
  timeRemaining: null,
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
  setCurrentSubmission: (submission) => set({ currentSubmission: submission }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  clearSubmission: () => set({ currentSubmission: null, timeRemaining: null }),
}));

// ========== STUDENT HOOKS ==========

export const useStartExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader, setCurrentSubmission, setTimeRemaining } =
    useSubmissionStore();
  const startExamMutation = useStartExam();

  const startExam = async (examId) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await startExamMutation.mutateAsync(examId);
      setCurrentSubmission(result.submission);
      setTimeRemaining(result.timeRemaining);
      showToast("Exam started successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to start exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    startExam,
    isLoading: startExamMutation.isPending,
    error: startExamMutation.error,
  };
};

export const useSaveAnswerAction = () => {
  const { setError, showToast } = useSubmissionStore();
  const saveAnswerMutation = useSaveAnswer();

  const saveAnswer = async (submissionId, questionId, answer) => {
    try {
      const result = await saveAnswerMutation.mutateAsync({ submissionId, questionId, answer });
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to save answer", "error");
      throw error;
    }
  };

  return {
    saveAnswer,
    isLoading: saveAnswerMutation.isPending,
    error: saveAnswerMutation.error,
  };
};

export const useSubmitExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader, clearSubmission } = useSubmissionStore();
  const submitExamMutation = useSubmitExam();

  const submitExam = async (submissionId) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await submitExamMutation.mutateAsync(submissionId);
      clearSubmission();
      showToast("Exam submitted successfully! Your results have been recorded.", "success", 5000);
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to submit exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    submitExam,
    isLoading: submitExamMutation.isPending,
    error: submitExamMutation.error,
  };
};

export const useGetStudentSubmissionAction = (examId) => {
  const { setCurrentSubmission, setTimeRemaining, setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetStudentSubmission(examId);

  useEffect(() => {
    if (data) {
      setCurrentSubmission(data.submission);
      setTimeRemaining(data.timeRemaining);
    }
  }, [data, setCurrentSubmission, setTimeRemaining]);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    submission: data?.submission,
    timeRemaining: data?.timeRemaining,
    isLoading,
    error,
    refetch,
  };
};

export const useGetMySubmissionsAction = (params = {}) => {
  const { setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetMySubmissions(params);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    refetch,
  };
};

// ========== LECTURER HOOKS ==========

export const useGetExamSubmissionsAction = (examId, params = {}) => {
  const { setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetExamSubmissions(examId, params);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    refetch,
  };
};

export const useGetExamStatisticsAction = (examId) => {
  const { setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetExamStatistics(examId);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    statistics: data?.statistics || null,
    isLoading,
    error,
    refetch,
  };
};

export const useAddFeedbackAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useSubmissionStore();
  const addFeedbackMutation = useAddFeedback();

  const addFeedback = async (submissionId, feedback) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await addFeedbackMutation.mutateAsync({ submissionId, feedback });
      showToast("Feedback added successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to add feedback", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    addFeedback,
    isLoading: addFeedbackMutation.isPending,
    error: addFeedbackMutation.error,
  };
};

export const useFlagSubmissionAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useSubmissionStore();
  const flagSubmissionMutation = useFlagSubmission();

  const flagSubmission = async (submissionId, reason) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await flagSubmissionMutation.mutateAsync({ submissionId, reason });
      showToast("Submission flagged successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to flag submission", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    flagSubmission,
    isLoading: flagSubmissionMutation.isPending,
    error: flagSubmissionMutation.error,
  };
};

// ========== ADMIN HOOKS ==========

export const useGetAllSubmissionsAction = (params = {}) => {
  const { setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetAllSubmissions(params);

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    submissions: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.currentPage || 1,
    isLoading,
    error,
    refetch,
  };
};

export const useGetSystemStatisticsAction = () => {
  const { setError } = useSubmissionStore();
  const { data, isLoading, error, refetch } = useGetSystemStatistics();

  useEffect(() => {
    if (error) {
      setError(error.message);
    }
  }, [error, setError]);

  return {
    statistics: data?.statistics || null,
    isLoading,
    error,
    refetch,
  };
};

export const useDeleteSubmissionAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useSubmissionStore();
  const deleteSubmissionMutation = useDeleteSubmission();

  const deleteSubmission = async (submissionId) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteSubmissionMutation.mutateAsync(submissionId);
      showToast("Submission deleted successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete submission", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteSubmission,
    isLoading: deleteSubmissionMutation.isPending,
    error: deleteSubmissionMutation.error,
  };
};

export default useSubmissionStore;
