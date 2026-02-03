import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProgram,
  getAllPrograms,
  updateProgram,
  deleteProgram,
  restoreProgram,
} from "../core/apis/special-program-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useGetAllPrograms = () => {
  return useQuery({
    queryKey: ["programs"],
    queryFn: getAllPrograms,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useUpdateProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useDeleteProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};

export const useRestoreProgram = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreProgram,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["programs"] });
    },
  });
};
