import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/attachments";

// Upload single file
export const uploadAttachment = async (formData) => {
  const response = await fetch(`${BASE_URL}/attachments/upload`, {
    method: "POST",
    credentials: "include",
    body: formData, // don't set Content-Type for multipart/form-data
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to upload file");
  }
  return response.json();
};

// Get attachments for current user
export const getUserAttachments = async () => {
  const response = await fetch(`${BASE_URL}/attachments`, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch attachments");
  }
  return response.json();
};

// Delete attachment by URL (pass encoded fileUrl)
export const deleteAttachment = async (fileUrl) => {
  const encoded = encodeURIComponent(fileUrl);
  const response = await fetch(`${BASE_URL}/attachments/${encoded}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete attachment");
  }
  return response.json();
};

//===================================== React Query hooks
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
