import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"}/security`;

// ========== SECURITY API FUNCTIONS ==========

export const reportViolation = async (data) => {
  console.log("[API] reportViolation called with:", data);
  console.log("[API] Using BASE_URL:", BASE_URL);
  
  const response = await fetch(`${BASE_URL}/violations`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(data),
  });
  
  console.log("[API] Response status:", response.status);
  
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] reportViolation error:", error);
    throw new Error(error.message || "Failed to report violation");
  }
  
  const result = await response.json();
  console.log("[API] reportViolation success:", result);
  return result;
};

export const getSubmissionViolations = async (submissionId) => {
  console.log("[API] getSubmissionViolations called", submissionId);
  const response = await fetch(`${BASE_URL}/violations/${submissionId}`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getSubmissionViolations error:", error);
    throw new Error(error.message || "Failed to fetch submission violations");
  }
  return response.json();
};

export const getMyViolationStats = async () => {
  console.log("[API] getMyViolationStats called");
  const response = await fetch(`${BASE_URL}/students/me/violations`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getMyViolationStats error:", error);
    throw new Error(error.message || "Failed to fetch violation statistics");
  }
  return response.json();
};

export const getExamViolations = async (examId) => {
  console.log("[API] getExamViolations called", examId);
  const response = await fetch(`${BASE_URL}/exams/${examId}/violations`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    console.error("[API] getExamViolations error:", error);
    throw new Error(error.message || "Failed to fetch exam violations");
  }
  return response.json();
};

// ========== DRY: Standard Query Options ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS - SECURITY ==========

export const useReportViolation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportViolation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["violations"] });
      queryClient.invalidateQueries({ queryKey: ["violationStats"] });
    },
  });
};

export const useGetSubmissionViolations = (submissionId) => {
  return useQuery({
    queryKey: ["violations", submissionId],
    queryFn: () => getSubmissionViolations(submissionId),
    enabled: !!submissionId,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetMyViolationStats = () => {
  return useQuery({
    queryKey: ["violationStats"],
    queryFn: getMyViolationStats,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetExamViolations = (examId) => {
  return useQuery({
    queryKey: ["examViolations", examId],
    queryFn: () => getExamViolations(examId),
    enabled: !!examId,
    ...STANDARD_QUERY_OPTIONS,
  });
};
