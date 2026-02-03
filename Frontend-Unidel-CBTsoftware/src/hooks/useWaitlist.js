import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  subscribe,
  getSubscriptions,
  deleteSubscription,
} from "../core/apis/waitlist-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
};

export const useSubscribe = () => {
  return useMutation({
    mutationFn: subscribe,
  });
};

export const useGetSubscriptions = (params) => {
  return useQuery({
    queryKey: ["waitlist", params],
    queryFn: () => getSubscriptions(params),
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["waitlist"] });
    },
  });
};
