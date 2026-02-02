import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  uploadAttachment,
  getUserAttachments,
  deleteAttachment,
} from "../core/apis/attachment-api";

const STANDARD_QUERY_OPTIONS = {
  staleTime: 5 * 60 * 1000,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
};

// ========== REACT QUERY HOOKS ==========

export const useUploadAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};

export const useGetUserAttachments = () => {
  return useQuery({
    queryKey: ["attachments"],
    queryFn: getUserAttachments,
    ...STANDARD_QUERY_OPTIONS,
  });
};

export const useDeleteAttachment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttachment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attachments"] });
    },
  });
};
