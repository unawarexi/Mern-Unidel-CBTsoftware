import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  initiatePayment,
  getMyPayments,
  getAllPayments,
} from "../core/apis/payment-api";

export const useInitiatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: initiatePayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-payments"] });
      // Also invalidate subscription status as it might change
      queryClient.invalidateQueries({ queryKey: ["agent-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useMyPayments = () => {
  return useQuery({
    queryKey: ["my-payments"],
    queryFn: getMyPayments,
  });
};

export const useAllPayments = () => {
  return useQuery({
    queryKey: ["all-payments"],
    queryFn: getAllPayments,
  });
};
