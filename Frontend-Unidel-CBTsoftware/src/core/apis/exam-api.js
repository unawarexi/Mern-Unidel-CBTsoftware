import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/exams";

// ========== FILE EXTRACTION & AI GENERATION ==========

export const extractTextFromFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/extract-text`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to extract text from file");
  }
  return response.json();
};

export const generateQuestionsFromFile = async ({ file, numberOfQuestions, difficulty }) => {
  const formData = new FormData();
  formData.append("file", file);
  if (numberOfQuestions) formData.append("numberOfQuestions", numberOfQuestions);
  if (difficulty) formData.append("difficulty", difficulty);

  const response = await fetch(`${BASE_URL}/generate-from-file`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate questions from file");
  }
  return response.json();
};

// ========== QUESTION BANK API FUNCTIONS ==========

export const createQuestionBank = async (data) => {
  const response = await fetch(`${BASE_URL}/question-bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create question bank");
  }
  return response.json();
};

export const getLecturerQuestionBanks = async ({ status, courseId } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (courseId) params.append("courseId", courseId);

  const response = await fetch(`${BASE_URL}/question-bank?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch question banks");
  }
  return response.json();
};

export const getQuestionBankById = async (id) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch question bank");
  }
  return response.json();
};

export const updateQuestionBank = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update question bank");
  }
  return response.json();
};

export const addQuestionToBank = async ({ id, question }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/questions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add question");
  }
  return response.json();
};

export const updateQuestionInBank = async ({ id, questionId, data }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/questions/${questionId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update question");
  }
  return response.json();
};

export const deleteQuestionFromBank = async ({ id, questionId }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/questions/${questionId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete question");
  }
  return response.json();
};

export const submitForApproval = async (id) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/submit`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit for approval");
  }
  return response.json();
};

export const deleteQuestionBank = async (id) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete question bank");
  }
  return response.json();
};

export const improveQuestionsWithAI = async (id) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/improve`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to improve questions");
  }
  return response.json();
};

// ========== ADMIN APPROVAL API FUNCTIONS ==========

export const getPendingApprovals = async () => {
  const response = await fetch(`${BASE_URL}/question-bank/pending/approvals`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch pending approvals");
  }
  return response.json();
};

export const approveQuestionBank = async ({ id, comments }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/approve`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to approve question bank");
  }
  return response.json();
};

export const rejectQuestionBank = async ({ id, comments }) => {
  const response = await fetch(`${BASE_URL}/question-bank/${id}/reject`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ comments }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to reject question bank");
  }
  return response.json();
};

// ========== EXAM API FUNCTIONS ==========

export const createExam = async (data) => {
  const response = await fetch(`${BASE_URL}/exams`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create exam");
  }
  return response.json();
};

export const createExamFromQuestionBank = async (data) => {
  const response = await fetch(`${BASE_URL}/exams/from-question-bank`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create exam from question bank");
  }
  return response.json();
};

export const getLecturerExams = async ({ status, courseId } = {}) => {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (courseId) params.append("courseId", courseId);

  const response = await fetch(`${BASE_URL}/exams?${params.toString()}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch exams");
  }
  return response.json();
};

export const getActiveExamsForStudent = async () => {
  const response = await fetch(`${BASE_URL}/exams/active`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch active exams");
  }
  return response.json();
};

export const getExamById = async (id) => {
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch exam");
  }
  return response.json();
};

export const updateExam = async ({ id, data }) => {
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update exam");
  }
  return response.json();
};

export const publishExam = async (id) => {
  const response = await fetch(`${BASE_URL}/exams/${id}/publish`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to publish exam");
  }
  return response.json();
};

export const deleteExam = async (id) => {
  const response = await fetch(`${BASE_URL}/exams/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete exam");
  }
  return response.json();
};

export const generateImageForQuestion = async ({ question, questionBankId, questionId }) => {
  const response = await fetch(`${BASE_URL}/question-image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ question, questionBankId, questionId }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to generate image for question");
  }
  return response.json();
};

// ========== BULK UPLOAD QUESTIONS API FUNCTION ==========
export const bulkUploadQuestions = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/question-bank/bulk-upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || "Failed to parse file");
  }
  return result;
};

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
    gcTime: 1000 * 60 * 10, // 10 minutes - cache retention
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
