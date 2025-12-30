import { create } from "zustand";
import {
  useExtractTextFromFile,
  useGenerateQuestionsFromFile,
  useCreateQuestionBank,
  useGetLecturerQuestionBanks,
  useGetQuestionBankById,
  useUpdateQuestionBank,
  useAddQuestionToBank,
  useUpdateQuestionInBank,
  useDeleteQuestionFromBank,
  useSubmitForApproval,
  useDeleteQuestionBank,
  useImproveQuestionsWithAI,
  useGetPendingApprovals,
  useApproveQuestionBank,
  useRejectQuestionBank,
  useCreateExam,
  useCreateExamFromQuestionBank,
  useGetLecturerExams,
  useGetActiveExamsForStudent,
  useGetExamById,
  useUpdateExam,
  usePublishExam,
  useDeleteExam,
  useGenerateImageForQuestion,
} from "../core/apis/exam-api";

const useExamStore = create((set) => ({
  // Client-side state
  selectedQuestionBank: null,
  selectedExam: null,
  generatedQuestions: [],
  extractedText: "",
  isLoading: false,
  error: null,

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) => set({ toast: { visible: true, message, type, duration } }),
  hideToast: () => set({ toast: { visible: false, message: "", type: "success", duration: 3000 } }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setSelectedQuestionBank: (questionBank) => set({ selectedQuestionBank: questionBank }),
  clearSelectedQuestionBank: () => set({ selectedQuestionBank: null }),

  setSelectedExam: (exam) => set({ selectedExam: exam }),
  clearSelectedExam: () => set({ selectedExam: null }),

  setGeneratedQuestions: (questions) => set({ generatedQuestions: questions }),
  clearGeneratedQuestions: () => set({ generatedQuestions: [] }),

  setExtractedText: (text) => set({ extractedText: text }),
  clearExtractedText: () => set({ extractedText: "" }),

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}));

// ========== FILE EXTRACTION & AI HOOKS ==========

export const useExtractTextAction = () => {
  const { setExtractedText, setError, showToast, showLoader, hideLoader } = useExamStore();
  const extractTextMutation = useExtractTextFromFile();

  const extractText = async (file) => {
    setError(null);
    showLoader();

    try {
      const data = await extractTextMutation.mutateAsync(file);
      setExtractedText(data.text || "");
      showToast("Text extracted successfully", "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to extract text", "error");
      throw error;
    } finally {
      hideLoader();
    }
  };

  return {
    extractText,
    isLoading: extractTextMutation.isLoading,
    error: extractTextMutation.error,
  };
};

export const useGenerateQuestionsAction = () => {
  const { setGeneratedQuestions, setError, showToast, showLoader, hideLoader } = useExamStore();
  const generateQuestionsMutation = useGenerateQuestionsFromFile();

  const generateQuestions = async ({ file, numberOfQuestions, difficulty }) => {
    setError(null);
    showLoader();

    try {
      const data = await generateQuestionsMutation.mutateAsync({
        file,
        numberOfQuestions,
        difficulty,
      });
      setGeneratedQuestions(data.questions || []);
      showToast(`${data.questions?.length || 0} questions generated successfully`, "success");
      return data;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to generate questions", "error");
      throw error;
    } finally {
      hideLoader();
    }
  };

  return {
    generateQuestions,
    isLoading: generateQuestionsMutation.isLoading,
    error: generateQuestionsMutation.error,
  };
};

// ========== QUESTION BANK HOOKS ==========

export const useCreateQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const createQuestionBankMutation = useCreateQuestionBank();

  const createQuestionBank = async (data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createQuestionBankMutation.mutateAsync(data);
      showToast("Question bank created successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createQuestionBank,
    isLoading: createQuestionBankMutation.isLoading,
    error: createQuestionBankMutation.error,
  };
};

export const useGetLecturerQuestionBanksAction = (filters = {}) => {
  const { setError, showToast } = useExamStore();
  const { data, isLoading, error, refetch } = useGetLecturerQuestionBanks(filters);

  if (error) {
    setError(error.message);
    showToast(error.message || "Failed to fetch question banks", "error");
  }

  return {
    questionBanks: data?.questionBanks || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useGetQuestionBankByIdAction = (id) => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetQuestionBankById(id);

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch question bank:", error.message);
  }

  return {
    questionBank: data?.questionBank,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const updateQuestionBankMutation = useUpdateQuestionBank();

  const updateQuestionBank = async (id, data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateQuestionBankMutation.mutateAsync({ id, data });
      showToast("Question bank updated successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateQuestionBank,
    isLoading: updateQuestionBankMutation.isLoading,
    error: updateQuestionBankMutation.error,
  };
};

export const useAddQuestionToBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const addQuestionMutation = useAddQuestionToBank();

  const addQuestion = async (id, question) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await addQuestionMutation.mutateAsync({ id, question });
      showToast("Question added successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to add question", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    addQuestion,
    isLoading: addQuestionMutation.isLoading,
    error: addQuestionMutation.error,
  };
};

export const useUpdateQuestionInBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const updateQuestionMutation = useUpdateQuestionInBank();

  const updateQuestion = async (id, questionId, data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateQuestionMutation.mutateAsync({ id, questionId, data });
      showToast("Question updated successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update question", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateQuestion,
    isLoading: updateQuestionMutation.isLoading,
    error: updateQuestionMutation.error,
  };
};

export const useDeleteQuestionFromBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const deleteQuestionMutation = useDeleteQuestionFromBank();

  const deleteQuestion = async (id, questionId) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteQuestionMutation.mutateAsync({ id, questionId });
      showToast("Question deleted successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete question", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteQuestion,
    isLoading: deleteQuestionMutation.isLoading,
    error: deleteQuestionMutation.error,
  };
};

export const useSubmitForApprovalAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const submitMutation = useSubmitForApproval();

  const submitForApproval = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await submitMutation.mutateAsync(id);
      showToast("Question bank submitted for approval", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to submit for approval", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    submitForApproval,
    isLoading: submitMutation.isLoading,
    error: submitMutation.error,
  };
};

export const useDeleteQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const deleteQuestionBankMutation = useDeleteQuestionBank();

  const deleteQuestionBank = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteQuestionBankMutation.mutateAsync(id);
      showToast("Question bank deleted successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteQuestionBank,
    isLoading: deleteQuestionBankMutation.isLoading,
    error: deleteQuestionBankMutation.error,
  };
};

export const useImproveQuestionsAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const improveMutation = useImproveQuestionsWithAI();

  const improveQuestions = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await improveMutation.mutateAsync(id);
      showToast("Questions improved successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to improve questions", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    improveQuestions,
    isLoading: improveMutation.isLoading,
    error: improveMutation.error,
  };
};

// ========== ADMIN APPROVAL HOOKS ==========

export const useGetPendingApprovalsAction = () => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetPendingApprovals();

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch pending approvals:", error.message);
  }

  return {
    pendingApprovals: data?.questionBanks || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useApproveQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const approveMutation = useApproveQuestionBank();

  const approveQuestionBank = async (id, comments) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await approveMutation.mutateAsync({ id, comments });
      showToast("Question bank approved successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to approve question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    approveQuestionBank,
    isLoading: approveMutation.isLoading,
    error: approveMutation.error,
  };
};

export const useRejectQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const rejectMutation = useRejectQuestionBank();

  const rejectQuestionBank = async (id, comments) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await rejectMutation.mutateAsync({ id, comments });
      showToast("Question bank rejected", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to reject question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    rejectQuestionBank,
    isLoading: rejectMutation.isLoading,
    error: rejectMutation.error,
  };
};

// ========== EXAM HOOKS ==========

export const useCreateExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const createExamMutation = useCreateExam();

  const createExam = async (data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createExamMutation.mutateAsync(data);
      showToast("Exam created successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createExam,
    isLoading: createExamMutation.isLoading,
    error: createExamMutation.error,
  };
};

export const useCreateExamFromQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const createExamMutation = useCreateExamFromQuestionBank();

  const createExamFromQuestionBank = async (data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createExamMutation.mutateAsync(data);
      showToast("Exam created from question bank successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to create exam from question bank", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    createExamFromQuestionBank,
    isLoading: createExamMutation.isLoading,
    error: createExamMutation.error,
  };
};

export const useGetLecturerExamsAction = (filters = {}) => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetLecturerExams(filters);

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch exams:", error.message);
  }

  return {
    exams: data?.exams || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useGetActiveExamsForStudentAction = () => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetActiveExamsForStudent();

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch active exams:", error.message);
  }

  return {
    activeExams: data?.exams || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useGetExamByIdAction = (id) => {
  const { setSelectedExam, setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetExamById(id);

  if (data?.exam) {
    setSelectedExam(data.exam);
    console.log("✅ Exam fetched successfully", data.exam);
  }

  if (error) {
    setError(error.message);
    console.log("❌ Failed to fetch exam:", error.message);
  }

  return {
    exam: data?.exam,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const updateExamMutation = useUpdateExam();

  const updateExam = async (id, data) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateExamMutation.mutateAsync({ id, data });
      showToast("Exam updated successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to update exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    updateExam,
    isLoading: updateExamMutation.isLoading,
    error: updateExamMutation.error,
  };
};

export const usePublishExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const publishExamMutation = usePublishExam();

  const publishExam = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await publishExamMutation.mutateAsync(id);
      showToast("Exam published successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to publish exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    publishExam,
    isLoading: publishExamMutation.isLoading,
    error: publishExamMutation.error,
  };
};

export const useDeleteExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } = useExamStore();
  const deleteExamMutation = useDeleteExam();

  const deleteExam = async (id) => {
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteExamMutation.mutateAsync(id);
      showToast("Exam deleted successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to delete exam", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    deleteExam,
    isLoading: deleteExamMutation.isLoading,
    error: deleteExamMutation.error,
  };
};

export const useGenerateImageForQuestionAction = () => {
  const { showToast, showLoader, hideLoader, setError } = useExamStore();
  const mutation = useGenerateImageForQuestion();

  const generateImage = async ({ question, questionBankId, questionId }) => {
    setError(null);
    showLoader();
    try {
      const result = await mutation.mutateAsync({ question, questionBankId, questionId });
      showToast("Image generated successfully", "success");
      return result;
    } catch (error) {
      setError(error.message);
      showToast(error.message || "Failed to generate image", "error");
      throw error;
    } finally {
      hideLoader();
    }
  };

  return {
    generateImage,
    isLoading: mutation.isLoading,
    error: mutation.error,
  };
};

export default useExamStore;
