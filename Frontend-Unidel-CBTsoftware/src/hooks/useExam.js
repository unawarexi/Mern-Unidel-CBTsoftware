import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  extractTextFromFile,
  generateQuestionsFromFile,
  createQuestionBank,
  getLecturerQuestionBanks,
  getQuestionBankById,
  updateQuestionBank,
  addQuestionToBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  submitForApproval,
  deleteQuestionBank,
  improveQuestionsWithAI,
  getPendingApprovals,
  approveQuestionBank,
  rejectQuestionBank,
  createExam,
  createExamFromQuestionBank,
  getLecturerExams,
  getActiveExamsForStudent,
  getExamById,
  updateExam,
  publishExam,
  deleteExam,
  generateImageForQuestion,
  bulkUploadQuestions,
} from "../core/apis/exam-api";

// ========== REACT QUERY HOOKS - FILE EXTRACTION & AI ==========

export const useExtractTextFromFile = () => {
  return useMutation({
    mutationFn: extractTextFromFile,
  });
};

export const useGenerateQuestionsFromFile = () => {
  return useMutation({
    mutationFn: generateQuestionsFromFile,
  });
};

// ========== REACT QUERY HOOKS - QUESTION BANK ==========

export const useCreateQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useGetLecturerQuestionBanks = (filters = {}) => {
  return useQuery({
    queryKey: ["questionBanks", filters],
    queryFn: () => getLecturerQuestionBanks(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetQuestionBankById = (id) => {
  return useQuery({
    queryKey: ["questionBank", id],
    queryFn: () => getQuestionBankById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 10,
  });
};

export const useUpdateQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuestionBank,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables.id] });
    },
  });
};

export const useAddQuestionToBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addQuestionToBank,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useUpdateQuestionInBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuestionInBank,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useDeleteQuestionFromBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestionFromBank,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useSubmitForApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitForApproval,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useDeleteQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useImproveQuestionsWithAI = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: improveQuestionsWithAI,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["questionBank", variables] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

// ========== REACT QUERY HOOKS - ADMIN APPROVAL ==========

export const useGetPendingApprovals = () => {
  return useQuery({
    queryKey: ["pendingApprovals"],
    queryFn: getPendingApprovals,
  });
};

export const useApproveQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: approveQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

export const useRejectQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingApprovals"] });
      queryClient.invalidateQueries({ queryKey: ["questionBanks"] });
    },
  });
};

// ========== REACT QUERY HOOKS - EXAMS ==========

export const useCreateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useCreateExamFromQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExamFromQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useGetLecturerExams = (filters = {}) => {
  return useQuery({
    queryKey: ["exams", filters],
    queryFn: () => getLecturerExams(filters),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetActiveExamsForStudent = () => {
  return useQuery({
    queryKey: ["activeExams"],
    queryFn: getActiveExamsForStudent,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useGetExamById = (id) => {
  return useQuery({
    queryKey: ["exam", id],
    queryFn: () => getExamById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};

export const useUpdateExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam", variables.id] });
    },
  });
};

export const usePublishExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: publishExam,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
      queryClient.invalidateQueries({ queryKey: ["exam", variables] });
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
  });
};

export const useGenerateImageForQuestion = () => {
  return useMutation({
    mutationFn: generateImageForQuestion,
  });
};

// ========== REACT QUERY HOOKS - BULK UPLOAD QUESTIONS ==========
export const useBulkUploadQuestions = () => {
  return useMutation({
    mutationFn: bulkUploadQuestions,
  });
};
