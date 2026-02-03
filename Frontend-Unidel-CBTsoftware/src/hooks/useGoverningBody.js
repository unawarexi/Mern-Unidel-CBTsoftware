import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createBody,
  getAllBodies,
  updateBody,
  deleteBody,
  restoreBody,
} from "../core/apis/governing-body-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useGetAllBodies = () => {
  return useQuery({
    queryKey: ["governingBodies"],
    queryFn: getAllBodies,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBody,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governingBodies"] });
    },
  });
};

export const useUpdateBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateBody,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governingBodies"] });
    },
  });
};

export const useDeleteBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBody,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governingBodies"] });
    },
  });
};

export const useRestoreBody = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreBody,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["governingBodies"] });
    },
  });
};
