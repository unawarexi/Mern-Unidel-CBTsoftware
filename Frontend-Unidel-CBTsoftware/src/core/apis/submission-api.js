/* eslint-disable no-unused-vars */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/submissions";

// ========== STUDENT API FUNCTIONS ==========

export const startExam = async (examId) => {
  console.log("[API] startExam called", examId);
  const response = await fetch(`${BASE_URL}/start/${examId}`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] startExam error:", error);
    throw new Error(error.message || "Failed to start exam");
  }
  return response.json();
};

export const saveAnswer = async ({ submissionId, questionId, answer }) => {
  console.log("[API] saveAnswer called", { submissionId, questionId, answer });
  const response = await fetch(`${BASE_URL}/${submissionId}/answer`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ questionId, answer }),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] saveAnswer error:", error);
    throw new Error(error.message || "Failed to save answer");
  }
  return response.json();
};

export const submitExam = async (submissionId) => {
  console.log("[API] submitExam called", submissionId);
  const response = await fetch(`${BASE_URL}/${submissionId}/submit`, {
    method: "POST",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] submitExam error:", error);
    throw new Error(error.message || "Failed to submit exam");
  }
  return response.json();
};

export const getStudentSubmission = async (examId) => {
  console.log("[API] getStudentSubmission called", examId);
  const response = await fetch(`${BASE_URL}/exam/${examId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getStudentSubmission error:", error);
    throw new Error(error.message || "Failed to fetch submission");
  }
  return response.json();
};

export const getMySubmissions = async (params = {}) => {
  console.log("[API] getMySubmissions called", params);
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/student/me?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getMySubmissions error:", error);
    throw new Error(error.message || "Failed to fetch submissions");
  }
  return response.json();
};

// ========== LECTURER API FUNCTIONS ==========

export const getExamSubmissions = async (examId, params = {}) => {
  console.log("[API] getExamSubmissions called", { examId, params });
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/exam/${examId}/all?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamSubmissions error:", error);
    throw new Error(error.message || "Failed to fetch exam submissions");
  }
  return response.json();
};

export const getExamStatistics = async (examId) => {
  console.log("[API] getExamStatistics called", examId);
  const response = await fetch(`${BASE_URL}/exam/${examId}/statistics`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamStatistics error:", error);
    throw new Error(error.message || "Failed to fetch statistics");
  }
  return response.json();
};

export const addFeedback = async ({ submissionId, feedback }) => {
  console.log("[API] addFeedback called", { submissionId, feedback });
  const response = await fetch(`${BASE_URL}/${submissionId}/feedback`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ feedback }),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] addFeedback error:", error);
    throw new Error(error.message || "Failed to add feedback");
  }
  return response.json();
};

export const flagSubmission = async ({ submissionId, reason }) => {
  console.log("[API] flagSubmission called", { submissionId, reason });
  const response = await fetch(`${BASE_URL}/${submissionId}/flag`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ reason }),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] flagSubmission error:", error);
    throw new Error(error.message || "Failed to flag submission");
  }
  return response.json();
};

// ========== ADMIN API FUNCTIONS ==========

export const getAllSubmissions = async (params = {}) => {
  console.log("[API] getAllSubmissions called", params);
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${BASE_URL}/admin/all?${queryString}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getAllSubmissions error:", error);
    throw new Error(error.message || "Failed to fetch all submissions");
  }
  return response.json();
};

export const getSystemStatistics = async () => {
  console.log("[API] getSystemStatistics called");
  const response = await fetch(`${BASE_URL}/admin/statistics`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getSystemStatistics error:", error);
    throw new Error(error.message || "Failed to fetch system statistics");
  }
  return response.json();
};

export const deleteSubmission = async (submissionId) => {
  console.log("[API] deleteSubmission called", submissionId);
  const response = await fetch(`${BASE_URL}/${submissionId}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] deleteSubmission error:", error);
    throw new Error(error.message || "Failed to delete submission");
  }
  return response.json();
};

// ========== QUERY OPTIONS ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS - STUDENT ==========

export const useStartExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: startExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
    },
  });
};

export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: saveAnswer,
  });
};

export const useSubmitExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mySubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["studentSubmission"] });
    },
  });
};

export const useGetStudentSubmission = (examId) => {
  return useQuery({
    queryKey: ["studentSubmission", examId],
    queryFn: () => getStudentSubmission(examId),
    enabled: !!examId,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetMySubmissions = (params = {}) => {
  return useQuery({
    queryKey: ["mySubmissions", params],
    queryFn: () => getMySubmissions(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

// ========== REACT QUERY HOOKS - LECTURER ==========

export const useGetExamSubmissions = (examId, params = {}) => {
  return useQuery({
    queryKey: ["examSubmissions", examId, params],
    queryFn: () => getExamSubmissions(examId, params),
    enabled: !!examId,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetExamStatistics = (examId) => {
  return useQuery({
    queryKey: ["examStatistics", examId],
    queryFn: () => getExamStatistics(examId),
    enabled: !!examId,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useAddFeedback = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addFeedback,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["examSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["examStatistics"] });
    },
  });
};

export const useFlagSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: flagSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["examSubmissions"] });
    },
  });
};

// ========== REACT QUERY HOOKS - ADMIN ==========

export const useGetAllSubmissions = (params = {}) => {
  return useQuery({
    queryKey: ["allSubmissions", params],
    queryFn: () => getAllSubmissions(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetSystemStatistics = () => {
  return useQuery({
    queryKey: ["systemStatistics"],
    queryFn: getSystemStatistics,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["systemStatistics"] });
    },
  });
};
