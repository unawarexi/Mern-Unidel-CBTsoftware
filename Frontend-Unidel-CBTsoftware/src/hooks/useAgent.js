import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAgentStudents,
  createAgentStudent,
  updateAgentStudent,
  deleteAgentStudent,
  getAgentExams,
  createAgentExam,
  getAgentQuestionBanks,
  createAgentQuestionBank,
  getAgentSubscription,
  verifyAgent,
} from "../core/apis/agent-api";

// ========== STUDENT HOOKS ==========

export const useAgentStudents = () => {
  return useQuery({
    queryKey: ["agent-students"],
    queryFn: getAgentStudents,
  });
};

export const useCreateAgentStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAgentStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-students"] });
    },
  });
};

export const useUpdateAgentStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAgentStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-students"] });
    },
  });
};

export const useDeleteAgentStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAgentStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-students"] });
    },
  });
};

// ========== EXAM HOOKS ==========

export const useAgentExams = () => {
  return useQuery({
    queryKey: ["agent-exams"],
    queryFn: getAgentExams,
  });
};

export const useCreateAgentExam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAgentExam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-exams"] });
    },
  });
};

// ========== QUESTION BANK HOOKS ==========

export const useAgentQuestionBanks = () => {
  return useQuery({
    queryKey: ["agent-question-banks"],
    queryFn: getAgentQuestionBanks,
  });
};

export const useCreateAgentQuestionBank = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAgentQuestionBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agent-question-banks"] });
    },
  });
};

// ========== SUBSCRIPTION HOOKS ==========

export const useAgentSubscription = () => {
  return useQuery({
    queryKey: ["agent-subscription"],
    queryFn: getAgentSubscription,
  });
};

// ========== ADMIN HOOKS ==========

export const useVerifyAgent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyAgent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agents"] });
    },
  });
};
