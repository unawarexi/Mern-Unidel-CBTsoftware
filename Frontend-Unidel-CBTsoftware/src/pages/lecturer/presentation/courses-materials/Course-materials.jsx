import React, { useMemo } from "react";
import { FileText, Download, User, Tag } from "lucide-react";
import { useGetLecturerCoursesAction } from "../../../../store/user-store";

const Card = ({ mat }) => (
  <div className="xl:w-1/4 md:w-1/2 p-4">
    <div className="bg-gray-100 p-6 rounded-lg flex flex-col h-full shadow border border-slate-200">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-orange-500" />
        <span className="font-semibold text-slate-900 text-base break-all">{mat.filename}</span>
      </div>
      <div className="flex items-center gap-3 mb-3">
        <span className="flex items-center gap-1 px-2 py-0.5 bg-orange-50 text-orange-700 rounded text-xs font-semibold uppercase">
          <Tag className="w-3 h-3" />
          {mat.category || "document"}
        </span>
        <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded text-xs font-semibold uppercase">{mat.type}</span>
      </div>
      <div className="mb-3">
        <h2 className="text-lg text-gray-900 font-medium title-font mb-1">{mat.courseTitle}</h2>
        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-mono">{mat.courseCode}</span>
      </div>
      <div className="flex items-center gap-2 mb-3">
        <User className="w-4 h-4 text-slate-500" />
        <span className="text-sm text-slate-700 font-medium">{mat.uploadedByName || mat.uploadedByEmail || mat.uploadedBy || "-"}</span>
      </div>
      <div className="text-xs text-slate-500 mb-3">{mat.uploadedAt ? new Date(mat.uploadedAt).toLocaleDateString() : ""}</div>
      <p className="leading-relaxed text-base flex-1 mb-4">{mat.description || <span className="text-slate-400">No description</span>}</p>
      <div className="mt-auto">
        <a href={mat.url} className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors" target="_blank" rel="noopener noreferrer">
          <Download className="w-4 h-4" />
          Download
        </a>
      </div>
    </div>
  </div>
);

const CourseMaterials = () => {
  const { courses = [], isLoading } = useGetLecturerCoursesAction();

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
          courseTitle: course.courseTitle,
          courseCode: course.courseCode,
          uploadedByName,
          uploadedByEmail,
        };
      })
    );
  }, [courses]);

  return (
    <div className="w-full min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-500 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Course Materials</h2>
          </div>
          <p className="text-slate-600 ml-14">All uploaded materials for your assigned courses.</p>
        </div>
        {isLoading ? (
          <div className="py-12 text-center text-slate-400">Loading...</div>
        ) : allMaterials.length === 0 ? (
          <div className="py-12 text-center text-slate-400">No course materials found.</div>
        ) : (
          <div className="flex flex-wrap -m-4">
            {allMaterials.map((mat) => (
              <Card key={mat._id} mat={mat} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseMaterials;
