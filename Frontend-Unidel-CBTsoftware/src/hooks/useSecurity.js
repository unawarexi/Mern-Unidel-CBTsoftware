import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  reportViolation,
  getSubmissionViolations,
  getMyViolationStats,
  getExamViolations,
} from "../core/apis/security-api";

// ========== STANDARD QUERY OPTIONS ==========
const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
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
