import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createApplication,
  getMyApplications,
  getApplicationById,
  updateApplication,
  submitApplication,
  adminReview,
  deleteApplication,
  getAllApplications,
  uploadApplicationFile,
} from "../core/apis/application-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useGetAllApplications = (params) => {
  return useQuery({
    queryKey: ["applications", params],
    queryFn: () => getAllApplications(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useCreateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
    },
  });
};

export const useGetMyApplications = () => {
  return useQuery({
    queryKey: ["applications", "my"],
    queryFn: getMyApplications,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useGetApplicationById = (id) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () => getApplicationById(id),
    enabled: !!id,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useUpdateApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateApplication,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
    },
  });
};

export const useSubmitApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitApplication,
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["applications", "my"] });
      queryClient.invalidateQueries({ queryKey: ["application", id] });
    },
  });
};

export const useAdminReviewApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminReview,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
    },
  });
};

export const useDeleteApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUploadApplicationFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadApplicationFile,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["application", variables.id],
      });
    },
  });
};
