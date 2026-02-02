import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Image,
  Film,
  Folder,
  RefreshCw,
  Search,
  Filter,
  Clock,
  Download,
  Eye,
  Trash2,
  Plus,
  AlertCircle,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Uploads = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [isLoading] = useState(false);
  const [uploads] = useState([]);

  // File type icons
  const getFileIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "image":
        return Image;
      case "video":
        return Film;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case "image":
        return "text-emerald-500 bg-emerald-500/20";
      case "video":
        return "text-purple-500 bg-purple-500/20";
      default:
        return "text-blue-500 bg-blue-500/20";
    }
  };

  const actions = (
    <button
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
        "bg-orange-500 text-white hover:bg-orange-600",
      )}
    >
      <Plus className="w-4 h-4" />
      Upload File
    </button>
  );

  return (
    <StudentPage
      title="My Uploads"
      subtitle="Manage your uploaded documents and files"
      icon={StudentIcons.Documents}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Files",
              value: uploads.length,
              icon: Folder,
              color: "text-blue-500",
            },
            {
              label: "Documents",
              value: 0,
              icon: FileText,
              color: "text-red-500",
            },
            {
              label: "Images",
              value: 0,
              icon: Image,
              color: "text-emerald-500",
            },
            { label: "Videos", value: 0, icon: Film, color: "text-purple-500" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="flex items-center gap-3">
                <stat.icon className={cn("w-5 h-5", stat.color)} />
                <div>
                  <p
                    className={cn(
                      "text-xl font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {stat.value}
                  </p>
                  <p
                    className={cn(
                      "text-xs",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className={cn(
                "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-slate-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-10 pr-4 py-3 rounded-xl border outline-none",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                  : "bg-white border-gray-200 text-gray-700 placeholder-gray-400",
              )}
            />
          </div>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className={cn(
              "px-4 py-3 rounded-xl border outline-none",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white"
                : "bg-white border-gray-200 text-gray-700",
            )}
          >
            <option value="all">All Types</option>
            <option value="document">Documents</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
          </select>
        </div>

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer hover:border-orange-500",
            isDarkMode
              ? "border-slate-700 bg-slate-800/30 hover:bg-slate-800/50"
              : "border-gray-300 bg-gray-50/50 hover:bg-gray-100/50",
          )}
        >
          <Upload
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          />
          <h3
            className={cn(
              "text-lg font-semibold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Drag & Drop Files Here
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-slate-500" : "text-gray-500",
            )}
          >
            Supported formats: PDF, DOC, DOCX, PNG, JPG, MP4
          </p>
          <button className="px-6 py-2 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all">
            Browse Files
          </button>
        </div>

        {/* Files List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} height={80} borderRadius={12} />
              ))}
          </div>
        ) : uploads.length === 0 ? (
          <div
            className={cn(
              "text-center py-16 rounded-3xl border",
              isDarkMode
                ? "bg-slate-800/30 border-slate-800 text-slate-500"
                : "bg-gray-50 border-gray-100 text-gray-500",
            )}
          >
            <Folder className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
            <p className="text-sm">Your uploaded files will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {uploads.map((file, idx) => {
              const FileIcon = getFileIcon(file.type);
              const typeColors = getTypeColor(file.type);

              return (
                <motion.div
                  key={file._id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl border",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-white border-gray-100",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-xl flex items-center justify-center",
                        typeColors,
                      )}
                    >
                      <FileIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4
                        className={cn(
                          "font-semibold",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {file.name}
                      </h4>
                      <p
                        className={cn(
                          "text-sm flex items-center gap-2",
                          isDarkMode ? "text-slate-500" : "text-gray-500",
                        )}
                      >
                        <Clock className="w-3 h-3" />
                        {new Date(file.uploadedAt).toLocaleDateString()}
                        <span className="text-xs uppercase">{file.size}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className={cn(
                        "p-2 rounded-xl transition-all",
                        isDarkMode
                          ? "hover:bg-slate-700 text-slate-400"
                          : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      className={cn(
                        "p-2 rounded-xl transition-all",
                        isDarkMode
                          ? "hover:bg-slate-700 text-slate-400"
                          : "hover:bg-gray-100 text-gray-500",
                      )}
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className={cn(
                        "p-2 rounded-xl transition-all text-red-500",
                        isDarkMode ? "hover:bg-red-500/20" : "hover:bg-red-50",
                      )}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </StudentPage>
  );
};

export default Uploads;
