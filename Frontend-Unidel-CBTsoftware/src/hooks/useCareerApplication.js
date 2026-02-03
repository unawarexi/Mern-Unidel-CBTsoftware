import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  applyForJob,
  getAllCareerApplications,
  updateCareerApplicationStatus,
} from "../core/apis/career-application-api";

export const useApplyForJob = () => {
  return useMutation({
    mutationFn: applyForJob,
  });
};

export const useGetAllCareerApplications = (params) => {
  return useQuery({
    queryKey: ["career-applications", params],
    queryFn: () => getAllCareerApplications(params),
  });
};

export const useUpdateCareerApplicationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCareerApplicationStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["career-applications"] });
    },
  });
};
