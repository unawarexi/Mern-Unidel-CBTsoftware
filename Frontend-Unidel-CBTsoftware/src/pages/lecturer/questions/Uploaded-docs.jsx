import React, { useEffect } from "react";
import useAttachmentStore, {
  useGetUserAttachmentsAction,
  useDeleteAttachmentAction,
} from "../../../store/attachment-store";
import { Loader, Trash2, FileText, Download, ExternalLink } from "lucide-react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";

const UploadedDocs = () => {
  const { attachments } = useAttachmentStore();
  const { isLoading, refetch } = useGetUserAttachmentsAction();
  const { deleteAttachment, isLoading: isDeleting } =
    useDeleteAttachmentAction();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleDelete = async (url) => {
    if (window.confirm("Are you sure you want to delete this document?")) {
      await deleteAttachment(url);
      refetch();
    }
  };

  const getFileName = (url) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.split("/").pop();
    } catch (e) {
      return url;
    }
  };

  return (
    <LecturerPage
      title="Uploaded Documents"
      subtitle="Manage your uploaded files and question source documents"
      icon={LecturerIcons.Questions}
    >
      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader className="w-12 h-12 text-orange-500 animate-spin" />
            <p className={cn(isDarkMode ? "text-slate-400" : "text-slate-600")}>
              Loading documents...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {attachments?.documents?.length === 0 ? (
              <div
                className={cn(
                  "col-span-full py-12 text-center rounded-xl border-2 border-dashed",
                  isDarkMode
                    ? "border-slate-800 bg-slate-800/20"
                    : "border-slate-200 bg-slate-50",
                )}
              >
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-20" />
                <p
                  className={cn(
                    isDarkMode ? "text-slate-400" : "text-slate-600",
                  )}
                >
                  No documents uploaded yet.
                </p>
              </div>
            ) : (
              attachments?.documents?.map((url, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "group flex items-center justify-between border rounded-xl p-5 transition-all hover:shadow-lg",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 hover:border-orange-500/50"
                      : "bg-white border-slate-200 hover:border-orange-300",
                  )}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className={cn(
                        "p-3 rounded-lg",
                        isDarkMode ? "bg-blue-500/10" : "bg-blue-50",
                      )}
                    >
                      <FileText
                        className={cn(
                          "w-6 h-6",
                          isDarkMode ? "text-blue-400" : "text-blue-600",
                        )}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "font-semibold truncate",
                          isDarkMode ? "text-white" : "text-slate-800",
                        )}
                        title={getFileName(url)}
                      >
                        {getFileName(url)}
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        Source: File Upload
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-700 text-slate-300"
                          : "hover:bg-slate-100 text-slate-600",
                      )}
                      title="View file"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <button
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDarkMode
                          ? "hover:bg-red-500/10 text-red-400 hover:text-red-300"
                          : "hover:bg-red-50 text-red-600 hover:text-red-700",
                      )}
                      disabled={isDeleting}
                      onClick={() => handleDelete(url)}
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </LecturerPage>
  );
};

export default UploadedDocs;
