import React, { useEffect } from "react";
import useAttachmentStore, { useGetUserAttachmentsAction, useDeleteAttachmentAction } from "../../../../store/attachment-store";
import { Loader, Trash2 } from "lucide-react";

const UploadedDocs = () => {
  const { attachments } = useAttachmentStore();
  const { isLoading, refetch } = useGetUserAttachmentsAction();
  const { deleteAttachment, isLoading: isDeleting } = useDeleteAttachmentAction();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (url) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteAttachment(url);
      refetch();
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Uploaded Documents</h2>
      {isLoading ? (
        <div className="flex items-center gap-2"><Loader className="animate-spin" /> Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attachments?.documents?.length === 0 && <p>No documents uploaded yet.</p>}
          {attachments?.documents?.map((url, idx) => (
            <div key={idx} className="flex items-center justify-between bg-slate-50 border rounded-lg p-4">
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline break-all">{url}</a>
              <button
                className="ml-4 text-red-600 hover:text-red-800"
                disabled={isDeleting}
                onClick={() => handleDelete(url)}
                title="Delete"
              >
                <Trash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadedDocs;
