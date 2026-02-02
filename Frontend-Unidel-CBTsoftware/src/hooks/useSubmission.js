import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  startExam,
  saveAnswer,
  submitExam,
  getStudentSubmission,
  getMySubmissions,
  getExamSubmissions,
  getExamStatistics,
  addFeedback,
  flagSubmission,
  getAllSubmissions,
  getSystemStatistics,
  deleteSubmission,
} from "../core/apis/submission-api";

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
