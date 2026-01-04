import { create } from "zustand";
import { useEffect } from "react";
import useUserStore from "./user-store";
import { useUploadAttachment, useGetUserAttachments, useDeleteAttachment } from "../core/apis/attachment-api";

const useAttachmentStore = create((set) => ({
  attachments: [],
  isUploading: false,
  uploadProgress: 0, // 0-100
  setAttachments: (attachments) => set({ attachments }),
  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  clear: () => set({ attachments: [], isUploading: false, uploadProgress: 0 }),
}));

// Hook: upload action wrapper
export const useUploadAttachmentAction = () => {
  const { setUploading, setUploadProgress } = useAttachmentStore();
  const { showToast, showLoader, hideLoader } = useUserStore();
  const uploadMutation = useUploadAttachment();

  const uploadAttachment = async (formData) => {
    console.log("[STORE] useUploadAttachmentAction called");
    setUploading(true);
    setUploadProgress(0);
    showLoader();

    try {
      const res = await uploadMutation.mutateAsync(formData);
      setUploading(false);
      setUploadProgress(100);
      showToast(res?.message || "File uploaded", "success");
      return res;
    } catch (err) {
      console.error("[STORE] useUploadAttachmentAction error:", err);
      setUploading(false);
      setUploadProgress(0);
      showToast(err?.message || "Upload failed", "error");
      throw err;
    } finally {
      hideLoader();
    }
  };

  return {
    uploadAttachment,
    isLoading: uploadMutation.isLoading,
    error: uploadMutation.error,
  };
};

// Hook: get attachments (keeps zustand store in sync)
export const useGetUserAttachmentsAction = () => {
  const setAttachments = useAttachmentStore((s) => s.setAttachments);
  const query = useGetUserAttachments();
  const { data, isLoading, error, refetch } = query;

  useEffect(() => {
    if (data?.data) {
      console.log("[STORE] useGetUserAttachmentsAction data:", data.data);
      setAttachments(data.data);
    }
  }, [data, setAttachments]);

  return {
    attachments: data?.data || [],
    isLoading,
    error,
    refetch,
  };
};

// Hook: delete attachment wrapper
export const useDeleteAttachmentAction = () => {
  const deleteMutation = useDeleteAttachment();
  const { showToast, showLoader, hideLoader } = useUserStore();

  const deleteAttachment = async (fileUrl) => {
    console.log("[STORE] useDeleteAttachmentAction called", fileUrl);
    showLoader();
    try {
      const res = await deleteMutation.mutateAsync(fileUrl);
      showToast(res?.message || "Attachment deleted", "success");
      return res;
    } catch (err) {
      console.error("[STORE] useDeleteAttachmentAction error:", err);
      showToast(err?.message || "Failed to delete attachment", "error");
      throw err;
    } finally {
      hideLoader();
    }
  };

  return {
    deleteAttachment,
    isLoading: deleteMutation.isLoading,
    error: deleteMutation.error,
  };
};

export default useAttachmentStore;
