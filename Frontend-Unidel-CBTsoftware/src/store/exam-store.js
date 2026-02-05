import { create } from "zustand";
import { useEffect } from "react";
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
  useBulkUploadQuestions,
  useImproveQuestionsContent,
} from "../hooks/useExam";

const useExamStore = create((set) => ({
  // Client-side state
  selectedQuestionBank: null,
  selectedExam: null,
  generationHistory: [],
  setGenerationHistory: (history) => set({ generationHistory: history }),
  addToGenerationHistory: (item) =>
    set((state) => ({
      generationHistory: [item, ...state.generationHistory],
    })),
  clearGenerationHistory: () => set({ generationHistory: [] }),

  // UI helpers
  toast: { visible: false, message: "", type: "success", duration: 3000 },
  showToast: (message, type = "success", duration = 3000) =>
    set({ toast: { visible: true, message, type, duration } }),
  hideToast: () =>
    set({
      toast: { visible: false, message: "", type: "success", duration: 3000 },
    }),

  globalLoader: false,
  showLoader: () => set({ globalLoader: true }),
  hideLoader: () => set({ globalLoader: false }),

  // Actions
  setSelectedQuestionBank: (questionBank) =>
    set({ selectedQuestionBank: questionBank }),
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
  const { setExtractedText, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const extractTextMutation = useExtractTextFromFile();

  const extractText = async (file) => {
    console.log("[STORE] useExtractTextAction called");
    setError(null);
    showLoader();

    try {
      const data = await extractTextMutation.mutateAsync(file);
      setExtractedText(data.text || "");
      showToast("Text extracted successfully", "success");
      return data;
    } catch (error) {
      console.error("[STORE] useExtractTextAction error:", error);
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
  const {
    setGeneratedQuestions,
    setError,
    showToast,
    showLoader,
    hideLoader,
    addToGenerationHistory,
  } = useExamStore();
  const generateQuestionsMutation = useGenerateQuestionsFromFile();
  // We need to store the controller to be able to abort it
  // Since this hook is called in component, we can use a ref or state
  // But to expose it to the UI, we might need a store-level controller if distinct components need access
  // For simplicity, we'll assume the component that calls generate also calls cancel
  // But wait, React Query mutations accept a signal? No, we pass it to the mutation function.
  // We can use a ref in the component, OR we can store the controller in the store.
  // Let's store the controller in the store to be safe and accessible.

  // Actually, let's add an abort action to the store
  const { setAbortController, abortController } = useExamStore();

  const generateQuestions = async ({ file, numberOfQuestions, difficulty }) => {
    console.log("[STORE] useGenerateQuestionsAction called");
    setError(null);
    showLoader();

    // Create new controller
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const data = await generateQuestionsMutation.mutateAsync({
        file,
        numberOfQuestions,
        difficulty,
        signal: controller.signal,
      });
      setGeneratedQuestions(data.questions || []);
      showToast(
        `${data.questions?.length || 0} questions generated successfully`,
        "success",
      );

      // Add to history
      if (data.questions && data.questions.length > 0) {
        addToGenerationHistory({
          id: Date.now(),
          filename: file.name,
          timestamp: Date.now(),
          questions: data.questions,
        });
      }

      return data;
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Generation cancelled");
        showToast("Generation cancelled", "info");
      } else {
        console.error("[STORE] useGenerateQuestionsAction error:", error);
        setError(error.message);
        showToast(error.message || "Failed to generate questions", "error");
        throw error;
      }
    } finally {
      hideLoader();
      setAbortController(null);
    }
  };

  const cancelGeneration = () => {
    if (abortController) {
      abortController.abort();
      setAbortController(null);
      hideLoader();
    }
  };

  return {
    generateQuestions,
    cancelGeneration,
    isLoading: generateQuestionsMutation.isLoading,
    error: generateQuestionsMutation.error,
  };
};

// ========== QUESTION BANK HOOKS ==========

export const useCreateQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const createQuestionBankMutation = useCreateQuestionBank();

  const createQuestionBank = async (data) => {
    console.log("[STORE] useCreateQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createQuestionBankMutation.mutateAsync(data);
      showToast("Question bank created successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useCreateQuestionBankAction error:", error);
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
  const { data, isLoading, error, refetch } =
    useGetLecturerQuestionBanks(filters);

  useEffect(() => {
    if (error) {
      setError(error.message);
      showToast(error.message || "Failed to fetch question banks", "error");
    }
  }, [error, setError, showToast]);

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

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch question bank:", error.message);
    }
  }, [error, setError]);

  return {
    questionBank: data?.questionBank,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const updateQuestionBankMutation = useUpdateQuestionBank();

  const updateQuestionBank = async (id, data) => {
    console.log("[STORE] useUpdateQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateQuestionBankMutation.mutateAsync({ id, data });
      showToast("Question bank updated successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useUpdateQuestionBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const addQuestionMutation = useAddQuestionToBank();

  const addQuestion = async (id, question) => {
    console.log("[STORE] useAddQuestionToBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await addQuestionMutation.mutateAsync({ id, question });
      showToast("Question added successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useAddQuestionToBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const updateQuestionMutation = useUpdateQuestionInBank();

  const updateQuestion = async (id, questionId, data) => {
    console.log("[STORE] useUpdateQuestionInBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateQuestionMutation.mutateAsync({
        id,
        questionId,
        data,
      });
      showToast("Question updated successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useUpdateQuestionInBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const deleteQuestionMutation = useDeleteQuestionFromBank();

  const deleteQuestion = async (id, questionId) => {
    console.log("[STORE] useDeleteQuestionFromBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteQuestionMutation.mutateAsync({
        id,
        questionId,
      });
      showToast("Question deleted successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useDeleteQuestionFromBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const submitMutation = useSubmitForApproval();

  const submitForApproval = async (id) => {
    console.log("[STORE] useSubmitForApprovalAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await submitMutation.mutateAsync(id);
      showToast("Question bank submitted for approval", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useSubmitForApprovalAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const deleteQuestionBankMutation = useDeleteQuestionBank();

  const deleteQuestionBank = async (id) => {
    console.log("[STORE] useDeleteQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteQuestionBankMutation.mutateAsync(id);
      showToast("Question bank deleted successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useDeleteQuestionBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const improveMutation = useImproveQuestionsWithAI();

  const improveQuestions = async (id) => {
    console.log("[STORE] useImproveQuestionsAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await improveMutation.mutateAsync(id);
      showToast("Questions improved successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useImproveQuestionsAction error:", error);
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

export const useImproveQuestionsContentAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const improveMutation = useImproveQuestionsContent();

  const improveContent = async (questions) => {
    console.log("[STORE] useImproveQuestionsContentAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await improveMutation.mutateAsync(questions);
      showToast("Questions improved successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useImproveQuestionsContentAction error:", error);
      setError(error.message);
      showToast(error.message || "Failed to improve questions", "error");
      throw error;
    } finally {
      setLoading(false);
      hideLoader();
    }
  };

  return {
    improveContent,
    isLoading: improveMutation.isLoading,
    error: improveMutation.error,
  };
};

// ========== ADMIN APPROVAL HOOKS ==========

export const useGetPendingApprovalsAction = () => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetPendingApprovals();

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch pending approvals:", error.message);
    }
  }, [error, setError]);

  return {
    pendingApprovals: data?.questionBanks || [],
    count: data?.count || 0,
    isLoading,
    error,
    refetch,
  };
};

export const useApproveQuestionBankAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const approveMutation = useApproveQuestionBank();

  const approveQuestionBank = async (id, comments) => {
    console.log("[STORE] useApproveQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await approveMutation.mutateAsync({ id, comments });
      showToast("Question bank approved successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useApproveQuestionBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const rejectMutation = useRejectQuestionBank();

  const rejectQuestionBank = async (id, comments) => {
    console.log("[STORE] useRejectQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await rejectMutation.mutateAsync({ id, comments });
      showToast("Question bank rejected", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useRejectQuestionBankAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const createExamMutation = useCreateExam();

  const createExam = async (data) => {
    console.log("[STORE] useCreateExamAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createExamMutation.mutateAsync(data);
      showToast("Exam created successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useCreateExamAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const createExamMutation = useCreateExamFromQuestionBank();

  const createExamFromQuestionBank = async (data) => {
    console.log("[STORE] useCreateExamFromQuestionBankAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await createExamMutation.mutateAsync(data);
      showToast("Exam created from question bank successfully", "success");
      return result;
    } catch (error) {
      console.error(
        "[STORE] useCreateExamFromQuestionBankAction error:",
        error,
      );
      setError(error.message);
      showToast(
        error.message || "Failed to create exam from question bank",
        "error",
      );
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

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch exams:", error.message);
    }
  }, [error, setError]);

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

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log("❌ Failed to fetch active exams:", error.message);
    }
  }, [error, setError]);

  useEffect(() => {
    if (data) {
      console.log("✅ Active exams fetched:", data.exams?.length || 0);
    }
  }, [data]);

  return {
    activeExams: data?.exams || [],
    count: data?.count || 0,
    isLoading,
    error: error?.message || null,
    refetch,
  };
};

export const useGetExamByIdAction = (id) => {
  const { setError } = useExamStore();
  const { data, isLoading, error, refetch } = useGetExamById(id);

  useEffect(() => {
    if (data?.exam) {
      console.log(" Exam fetched successfully", data.exam);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      setError(error.message);
      console.log(" Failed to fetch exam:", error.message);
    }
  }, [error, setError]);

  return {
    exam: data?.exam,
    isLoading,
    error,
    refetch,
  };
};

export const useUpdateExamAction = () => {
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const updateExamMutation = useUpdateExam();

  const updateExam = async (id, data) => {
    console.log("[STORE] useUpdateExamAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await updateExamMutation.mutateAsync({ id, data });
      showToast("Exam updated successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useUpdateExamAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const publishExamMutation = usePublishExam();

  const publishExam = async (id) => {
    console.log("[STORE] usePublishExamAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await publishExamMutation.mutateAsync(id);
      showToast("Exam published successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] usePublishExamAction error:", error);
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
  const { setLoading, setError, showToast, showLoader, hideLoader } =
    useExamStore();
  const deleteExamMutation = useDeleteExam();

  const deleteExam = async (id) => {
    console.log("[STORE] useDeleteExamAction called");
    setLoading(true);
    setError(null);
    showLoader();

    try {
      const result = await deleteExamMutation.mutateAsync(id);
      showToast("Exam deleted successfully", "success");
      return result;
    } catch (error) {
      console.error("[STORE] useDeleteExamAction error:", error);
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

  const generateImage = async ({
    question,
    questionBankId,
    questionId,
    oldPublicId,
  }) => {
    setError(null);
    showLoader();
    try {
      const result = await mutation.mutateAsync({
        question,
        questionBankId,
        questionId,
        oldPublicId,
      });
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

export const useBulkUploadQuestionsAction = () => {
  const { setGeneratedQuestions, showToast, showLoader, hideLoader, setError } =
    useExamStore();
  const bulkUploadMutation = useBulkUploadQuestions();

  const bulkUpload = async (file) => {
    setError(null);
    showLoader();
    try {
      const result = await bulkUploadMutation.mutateAsync(file);
      setGeneratedQuestions(result.questions || []);
      showToast(
        `Imported ${result.questions?.length || 0} questions from file`,
        "success",
      );
      return result;
    } catch (err) {
      setError(err.message);
      showToast(err.message || "Failed to parse file", "error");
      throw err;
    } finally {
      hideLoader();
    }
  };

  return {
    bulkUpload,
    isLoading: bulkUploadMutation.isLoading,
    error: bulkUploadMutation.error,
  };
};

export default useExamStore;
