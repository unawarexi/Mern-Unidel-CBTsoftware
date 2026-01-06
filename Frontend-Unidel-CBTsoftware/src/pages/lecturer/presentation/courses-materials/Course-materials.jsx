import React, { useMemo, useState } from "react";
import { FileText, Download, User, Tag, Trash2, Calendar } from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";
import { useDeleteCourseMaterialAction } from "../../../../store/course-store";
import DeleteModal from "../../../../components/Delete-modal";

const Card = ({ mat, onDelete, onDeleteClick }) => {
  return (
    <div className="xl:w-1/3 lg:w-1/2 w-full p-3">
        <div className="bg-white p-5 rounded-xl flex flex-col h-full shadow-sm border border-slate-200 hover:shadow-md transition-all duration-200 hover:border-orange-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="p-2 bg-orange-50 rounded-lg shrink-0">
                <FileText className="w-4 h-4 text-orange-600" />
              </div>
              <span className="font-semibold text-slate-900 text-sm break-all line-clamp-2">{mat.filename}</span>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                onDeleteClick(mat);
              }}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0 ml-2"
              title="Delete material"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded-md text-xs font-medium">
              <Tag className="w-3 h-3" />
              {mat.category || "document"}
            </span>
            <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">{mat.type}</span>
          </div>

          {/* Course Info */}
          <div className="mb-3">
            <h2 className="text-base text-gray-900 font-semibold mb-1.5 line-clamp-1">{mat.courseTitle}</h2>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono font-medium">{mat.courseCode}</span>
          </div>

          {/* Uploader Info */}
          <div className="flex items-center gap-1.5 mb-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-600 truncate">{mat.uploadedByName || mat.uploadedByEmail || mat.uploadedBy || "-"}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 mb-3">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">{mat.uploadedAt ? new Date(mat.uploadedAt).toLocaleDateString() : ""}</span>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 flex-1 mb-4 line-clamp-2">{mat.description || <span className="text-slate-400 italic">No description</span>}</p>

          {/* Download Button */}
          <div className="mt-auto">
            <a
              href={mat.url}
              className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg text-sm font-medium hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-sm hover:shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4" />
              Download File
            </a>
          </div>
        </div>
      </div>
    );
};

const CourseMaterials = () => {
  const { courses = [], isLoading, refetch } = useGetLecturerCoursesAction();
  const { deleteMaterial } = useDeleteCourseMaterialAction();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);

  const handleDeleteClick = (material) => {
    setMaterialToDelete(material);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!materialToDelete) return;
    try {
      await deleteMaterial({ courseId: materialToDelete.courseId, materialId: materialToDelete._id });
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
        // Try to find the lecturer who uploaded this material
        let uploadedByName = "";
        let uploadedByEmail = "";
        if (Array.isArray(course.lecturers)) {
          const found = course.lecturers.find((l) => (l._id && mat.uploadedBy && l._id.toString() === mat.uploadedBy.toString()) || (l._id && mat.uploadedBy && l._id === mat.uploadedBy));
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
      })
    );
  }, [courses]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg shadow-orange-500/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900">Course Materials</h2>
              <p className="text-sm text-slate-600 mt-0.5">Manage and access all your course materials</p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="py-16 text-center">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent"></div>
            <p className="text-slate-500 mt-4 text-sm">Loading materials...</p>
          </div>
        ) : allMaterials.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl shadow-sm border border-slate-200">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 text-base font-medium mb-1">No course materials found</p>
            <p className="text-slate-400 text-sm">Upload materials to see them here</p>
          </div>
        ) : (
          <div className="flex flex-wrap -m-3">
            {allMaterials.map((mat) => (
              <Card key={mat._id} mat={mat} onDeleteClick={handleDeleteClick} />
            ))}
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
        title="Delete Material"
        message="Are you sure you want to delete this material?"
        itemName={materialToDelete?.filename}
      />
    </div>
  );
};

export default CourseMaterials;
