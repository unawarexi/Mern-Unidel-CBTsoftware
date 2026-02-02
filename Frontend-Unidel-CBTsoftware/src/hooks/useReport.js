import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  generateReport,
  getReports,
  getReportById,
} from "../core/apis/report-api";
import { toast } from "react-hot-toast";

/**
 * Mutation hook for generating a report
 */
export const useGenerateReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: generateReport,
    onSuccess: (data) => {
      toast.success(data.message || "Report generated successfully!");
      queryClient.invalidateQueries(["reports"]);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to generate report");
    },
  });
};

/**
 * Query hook for getting report history
 */
export const useGetReports = (type) => {
  return useQuery({
    queryKey: ["reports", type],
    queryFn: () => getReports(type),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Query hook for getting a specific report
 */
export const useGetReportById = (id) => {
  return useQuery({
    queryKey: ["reports", id],
    queryFn: () => getReportById(id),
    enabled: !!id,
  });
};
