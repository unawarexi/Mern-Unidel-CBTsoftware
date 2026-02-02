import React, { useState, useMemo } from "react";
import {
  FileText,
  Trash2,
  Tag,
  User,
  Calendar,
  Download,
  FileUp,
  MoreVertical,
  ExternalLink,
} from "lucide-react";
import { useDeleteCourseMaterialAction } from "../../../store/course-store";
import { useGetLecturerCoursesAction } from "../../../store/user-store"; // Corrected store
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { LecturerIcons } from "../components/icons";
import LecturerPage from "../components/LecturerPage";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import DeleteModal from "../../../components/Delete-modal";
import { motion, AnimatePresence } from "framer-motion";
import ExportButton from "../../../components/ExportButton";

const Card = ({ mat, onDeleteClick, isDarkMode }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="xl:w-1/3 lg:w-1/2 w-full p-3"
    >
      <div
        className={cn(
          "group relative p-6 rounded-2xl flex flex-col h-full border-2 transition-all duration-300",
          isDarkMode
            ? "bg-slate-800/40 border-slate-700/50 hover:border-orange-500/30 hover:bg-slate-800/60 shadow-2xl shadow-black/20"
            : "bg-white border-slate-100 hover:border-orange-100 hover:shadow-xl hover:shadow-slate-200/50",
        )}
      >
        {/* Type Icon Overlay */}
        <div
          className={cn(
            "absolute -top-3 -right-3 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-12",
            isDarkMode
              ? "bg-slate-700 text-orange-400"
              : "bg-white text-orange-600 border border-orange-50",
          )}
        >
          <FileText className="w-5 h-5" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0 pr-4">
            <h3
              className={cn(
                "font-black text-lg leading-tight break-words",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              {mat.filename}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest",
                  isDarkMode
                    ? "bg-orange-500/10 text-orange-400"
                    : "bg-orange-50 text-orange-700",
                )}
              >
                {mat.category || "document"}
              </span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest",
                  isDarkMode
                    ? "bg-slate-700/50 text-slate-400"
                    : "bg-slate-100 text-slate-500",
                )}
              >
                {mat.type}
              </span>
            </div>
          </div>
        </div>

        {/* Course Info Section */}
        <div
          className={cn(
            "p-3 rounded-xl mb-4",
            isDarkMode ? "bg-slate-900/50" : "bg-slate-50",
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-orange-500 font-black text-xs tracking-tighter">
              {mat.courseCode}
            </span>
          </div>
          <p
            className={cn(
              "text-xs font-bold line-clamp-1",
              isDarkMode ? "text-slate-300" : "text-slate-700",
            )}
          >
            {mat.courseTitle}
          </p>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-lg",
                isDarkMode ? "bg-slate-700/50" : "bg-white shadow-sm",
              )}
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span
              className={cn(
                "text-[11px] font-bold truncate",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              {mat.uploadedByName || "Instructor"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-1.5 rounded-lg",
                isDarkMode ? "bg-slate-700/50" : "bg-white shadow-sm",
              )}
            >
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
            </div>
            <span
              className={cn(
                "text-[11px] font-bold",
                isDarkMode ? "text-slate-400" : "text-slate-600",
              )}
            >
              {mat.uploadedAt
                ? new Date(mat.uploadedAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Description */}
        <p
          className={cn(
            "text-sm font-medium flex-1 mb-6 line-clamp-2 italic",
            isDarkMode ? "text-slate-500" : "text-slate-500",
          )}
        >
          "
          {mat.description ||
            "No specific pedagogical description provided for this resource."}
          "
        </p>

        {/* Actions */}
        <div className="flex gap-2">
          <a
            href={mat.url}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-xl text-sm font-black hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-orange-600/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
          <button
            onClick={() => onDeleteClick(mat)}
            className={cn(
              "p-3 rounded-xl transition-all active:scale-95",
              isDarkMode
                ? "bg-slate-700 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                : "bg-slate-100 text-slate-500 hover:text-red-600 hover:bg-red-50",
            )}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const CourseMaterials = () => {
  const { courses = [], isLoading, refetch } = useGetLecturerCoursesAction();
  const { deleteMaterial } = useDeleteCourseMaterialAction();
  const { isDarkMode } = useThemeStore();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMaterial({
        courseId: materialToDelete.courseId,
        materialId: materialToDelete._id,
      });
      refetch();
      setDeleteModalOpen(false);
      setMaterialToDelete(null);
    } catch (error) {
      console.error("Error deleting material:", error);
    }
  };

  const allMaterials = useMemo(() => {
    return courses.flatMap((course) =>
      (course.courseMaterials || []).map((mat) => {
        let uploadedByName = "";
        let uploadedByEmail = "";
        if (Array.isArray(course.lecturers)) {
          const found = course.lecturers.find(
            (l) =>
              (l._id &&
                mat.uploadedBy &&
                l._id.toString() === mat.uploadedBy.toString()) ||
              (l._id && mat.uploadedBy && l._id === mat.uploadedBy),
          );
          if (found) {
            uploadedByName = found.fullname || "";
            uploadedByEmail = found.email || "";
          }
        }
        return {
          ...mat,
          courseId: course._id,
          courseTitle: course.courseTitle,
          courseCode: course.courseCode,
          uploadedByName,
          uploadedByEmail,
        };
      }),
    );
  }, [courses]);

  return (
    <LecturerPage
      title="Course Materials"
      subtitle="Curate and deploy scholarly resources to facilitate student academic excellence"
      icon={LecturerIcons.Materials}
      actions={
        <ExportButton type="analytics" title="Course Materials Inventory" />
      }
    >
      <div className="space-y-8">
        {/* Header Stats */}
        {!isLoading && (
          <div className="flex items-center gap-4 mb-2">
            <div
              className={cn(
                "px-4 py-2 rounded-2xl border-2 font-black text-sm",
                isDarkMode
                  ? "bg-slate-800/40 border-slate-700/50 text-orange-400"
                  : "bg-white border-slate-100 text-orange-600",
              )}
            >
              Total Assets: {allMaterials.length}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "h-72 rounded-2xl animate-pulse",
                  isDarkMode ? "bg-slate-800/40" : "bg-slate-100",
                )}
              />
            ))}
          </div>
        ) : allMaterials.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "py-24 text-center rounded-3xl border-4 border-dashed",
              isDarkMode
                ? "bg-slate-800/20 border-slate-700"
                : "bg-slate-50 border-slate-200",
            )}
          >
            <div
              className={cn(
                "w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center",
                isDarkMode ? "bg-slate-800 shadow-xl" : "bg-white shadow-lg",
              )}
            >
              <FileUp
                className={cn(
                  "w-10 h-10",
                  isDarkMode ? "text-slate-600" : "text-slate-300",
                )}
              />
            </div>
            <h3
              className={cn(
                "text-xl font-black mb-2",
                isDarkMode ? "text-white" : "text-slate-900",
              )}
            >
              No Academic Resources Found
            </h3>
            <p
              className={cn(
                "text-sm font-bold opacity-60 max-w-sm mx-auto",
                isDarkMode ? "text-slate-400" : "text-slate-500",
              )}
            >
              Select "Upload Materials" from the sidebar to begin populating
              your digital course repository.
            </p>
          </motion.div>
        ) : (
          <div className="flex flex-wrap -m-3">
            <AnimatePresence mode="popLayout">
              {allMaterials.map((mat) => (
                <Card
                  key={mat._id}
                  mat={mat}
                  onDeleteClick={handleDeleteClick}
                  isDarkMode={isDarkMode}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setMaterialToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Expunge Resource"
        message="Are you certain you wish to permanently remove this academic resource from the course registry?"
        itemName={materialToDelete?.filename}
      />
    </LecturerPage>
  );
};

export default CourseMaterials;
