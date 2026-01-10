/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Upload, Search, Filter, Edit2, Trash2, X, Download, MoreVertical } from "lucide-react";
import {
  useCreateStudentAction,
  useGetAllStudentsAction,
  useUpdateStudentAction,
  useDeleteStudentAction,
} from "../../../../store/user-store";
import { useUploadAttachmentAction, useGetUserAttachmentsAction } from "../../../../store/attachment-store";
import { useGetAllCoursesAction } from "../../../../store/course-store";
import { useGetAllDepartmentsAction } from "../../../../store/department-store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DeleteModal from "../../../../components/Delete-modal";

// Zod schema for student form validation
const studentSchema = z.object({
  fullname: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  department: z.string().min(1, "Department is required"),
  level: z.number().min(100, "Level required").max(900, "Level required"),
  courses: z.array(z.string()).min(1, "At least one course is required"), // <-- Changed to array
});

const StudentsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All");
  const [editingStudent, setEditingStudent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    matricNumber: "",
    department: "",
    courses: "", // comma-separated
  });

  const { departments = [] } = useGetAllDepartmentsAction();

  // store hooks
  const { createStudent } = useCreateStudentAction();
  // eslint-disable-next-line no-unused-vars
  const { students = [], refetch, isLoading: loadingStudents } = useGetAllStudentsAction();
  const { updateStudent } = useUpdateStudentAction();
  const { deleteStudent } = useDeleteStudentAction();
  const { uploadAttachment } = useUploadAttachmentAction();
  // eslint-disable-next-line no-unused-vars
  const { attachments, refetch: refetchAttachments } = useGetUserAttachmentsAction();
  const { courses: allCourses = [] } = useGetAllCoursesAction();

  useEffect(() => {
    // initial fetch (refetch from hook if available)
    if (refetch) refetch();
  }, [refetch]);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      fullname: "",
      email: "",
      department: "",
      courses: [], // <-- Changed to array
      level: 100,
    },
  });

  const selectedCourses = watch("courses") || [];

  const handleAddStudent = async (data) => {
    const payload = {
      fullname: data.fullname,
      email: data.email,
      department: data.department,
      courses: data.courses, // <-- Now an array of course IDs
      level: data.level,
    };

    console.log("[DEBUG] handleAddStudent payload:", payload);

    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, payload);
      } else {
        await createStudent(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditingStudent(null);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    
    // Extract course IDs from student courses
    const courseIds = Array.isArray(student.courses)
      ? student.courses.map(c => typeof c === "object" && c?._id ? c._id : c)
      : [];
    
    reset({
      fullname: student.fullname || "",
      email: student.email || "",
      department: typeof student.department === "object" && student.department?._id 
        ? student.department._id 
        : student.department || "",
      courses: courseIds,
      level: student.level || 100,
    });
    setShowModal(true);
  };

  const handleDelete = async (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      await deleteStudent(studentToDelete._id);
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    (async () => {
      try {
        await uploadAttachment(form);
        if (refetchAttachments) refetchAttachments();
        setShowUploadModal(false);
      } catch (err) {
        console.error(err);
      }
    })();
  };

  const filteredStudents = (students || []).filter((student) => {
    const matchesSearch = (student.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) || (student.email || "").toLowerCase().includes(searchTerm.toLowerCase()) || (student.matricNumber || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" || student.department === filterDepartment;
    const matchesLevel = filterLevel === "All" || student.level === Number(filterLevel);
    const matchesCourse =
      filterCourse === "All" ||
      (Array.isArray(student.courses) &&
        student.courses.some((c) =>
          typeof c === "object"
            ? c.courseCode === filterCourse || c._id === filterCourse
            : c === filterCourse
        ));
    return matchesSearch && matchesDept && matchesLevel && matchesCourse;
  });

  // Helper to map course IDs to course code/title for display
  const getCourseLabels = (courseIds) => {
    if (!Array.isArray(courseIds) || !courseIds.length) return [];
    return courseIds
      .map((cid) => {
        const course = allCourses.find((c) => c._id === cid || c._id === cid?._id);
        return course ? `${course.courseCode} - ${course.courseTitle}` : null;
      })
      .filter(Boolean);
  };

  // Helper to get department name by _id (same as in lecturer management)
  const getDepartmentName = (deptId) => {
    // Handle if department is already populated (object)
    if (typeof deptId === 'object' && deptId !== null) {
      return deptId.departmentName || '-';
    }
    // Handle if department is just an ID (string)
    const dept = departments.find((d) => d._id === deptId);
    return dept ? dept.departmentName : deptId || "-";
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Students Management</h1>
          <p className="text-xs sm:text-base text-gray-600">Manage student accounts and enrollments</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors flex-1 sm:flex-none justify-center">
                <UserPlus size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Student</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowUploadModal(true)} className="flex items-center gap-1 sm:gap-2 bg-blue-900 hover:bg-blue-800 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors flex-1 sm:flex-none justify-center">
                <Upload size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Bulk Upload</span>
                <span className="sm:hidden">Upload</span>
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 w-full sm:max-w-md order-3 sm:order-2">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 sm:gap-3 w-full sm:w-auto order-2 sm:order-3 overflow-x-auto pb-1 sm:pb-0">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors min-w-[80px] sm:flex-1 sm:min-w-0">
                <option value="All">All</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 min-w-[70px] sm:flex-1 sm:min-w-0">
                <option>All</option>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 min-w-[100px] sm:flex-1 sm:min-w-0">
                <option>All</option>
                {allCourses.map((course) => (
                  <option key={course._id} value={course.courseCode}>
                    {course.courseCode} - {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Name</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden sm:table-cell">Email</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden md:table-cell">Matric</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden lg:table-cell">Department</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredStudents.map((student, index) => {
                    const courseLabels = getCourseLabels(
                      Array.isArray(student.courses)
                        ? student.courses.map((c) =>
                            typeof c === "object" && c?._id ? c._id : c
                          )
                        : []
                    );
                    const displayCourses = courseLabels.slice(0, 2).join(", ");
                    const hasMore = courseLabels.length > 2;
                    return (
                      <motion.tr key={student._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-900 font-medium text-[10px] sm:text-base">
                          <div className="truncate max-w-[100px] sm:max-w-none">{student.fullname}</div>
                          <div className="sm:hidden text-[9px] text-slate-500 mt-0.5 truncate max-w-[100px]">{student.email}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base hidden sm:table-cell">
                          <div className="truncate max-w-[150px]">{student.email}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base hidden md:table-cell">{student.matricNumber}</td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base hidden lg:table-cell">
                          <div className="truncate max-w-[120px]">{getDepartmentName(student.department)}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base">
                          {courseLabels.length === 0 && <span className="text-[10px] sm:text-xs text-gray-400 italic">No courses</span>}
                          {courseLabels.length > 0 && (
                            <div className="truncate max-w-[80px] sm:max-w-[150px]">
                              <span className="text-[10px] sm:text-base">{displayCourses}</span>
                              {hasMore && <span className="text-[10px] sm:text-xs text-blue-600 font-medium">&nbsp;...</span>}
                            </div>
                          )}
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="flex gap-1 sm:gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(student)} className="p-1 sm:p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors">
                              <Edit2 size={12} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(student)} className="p-1 sm:p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                              <Trash2 size={12} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
              onClick={() => {
                setShowModal(false);
                setEditingStudent(null);
                reset();
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingStudent ? "Edit Student" : "Add New Student"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingStudent(null);
                      reset();
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(handleAddStudent)}>
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Full Name</label>
                    <input
                      type="text"
                      {...register("fullname")}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter student full name"
                    />
                    {errors.fullname && <span className="text-xs text-red-600">{errors.fullname.message}</span>}
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter email address"
                    />
                    {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
                  </div>

                  {/* Matric Number - auto-generated, greyed out */}
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Matric Number
                      <span className="ml-2 text-xs text-gray-400">(auto-generated)</span>
                    </label>
                    <input
                      type="text"
                      value={editingStudent?.matricNumber || ""}
                      disabled
                      className="w-full px-4 py-2 bg-gray-100 border border-slate-300 rounded-lg text-slate-400 cursor-not-allowed"
                      placeholder="Will be generated"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Department</label>
                    <select
                      {...register("department")}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept._id} value={dept._id}>
                          {dept.departmentName}
                        </option>
                      ))}
                    </select>
                    {errors.department && <span className="text-xs text-red-600">{errors.department.message}</span>}
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Level</label>
                    <input
                      type="number"
                      {...register("level", { valueAsNumber: true })}
                      min={100}
                      max={900}
                      step={100}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      placeholder="e.g. 100, 200, 300"
                    />
                    {errors.level && <span className="text-xs text-red-600">{errors.level.message}</span>}
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Courses (Select Multiple)</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {allCourses.map((course) => (
                        <label key={course._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                          <input
                            type="checkbox"
                            value={course._id}
                            checked={selectedCourses.includes(course._id)}
                            onChange={(e) => {
                              const courseId = e.target.value;
                              const newCourses = e.target.checked
                                ? [...selectedCourses, courseId]
                                : selectedCourses.filter(id => id !== courseId);
                              setValue("courses", newCourses, { shouldValidate: true });
                            }}
                            className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span className="text-sm text-slate-700">{course.courseCode} - {course.courseTitle}</span>
                        </label>
                      ))}
                      {allCourses.length === 0 && (
                        <span className="text-xs text-gray-400 italic block p-2">No courses available</span>
                      )}
                    </div>
                    {errors.courses && <span className="text-xs text-red-600">{errors.courses.message}</span>}
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {editingStudent ? "Update" : "Add"} Student
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingStudent(null);
                        reset();
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUploadModal && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowUploadModal(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Bulk Upload Students</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-slate-700 mb-2">Drop your CSV or PDF file here</p>
                    <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                    <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload" />
                    <label htmlFor="file-upload" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors">
                      Choose File
                    </label>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-700 text-sm mb-2 font-medium">File Format Requirements:</p>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• CSV: name, email, courseId, status</li>
                      <li>• PDF: Structured table format</li>
                      <li>• Maximum file size: 5MB</li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Student"
        message="Are you sure you want to delete this student?"
        itemName={studentToDelete?.fullname}
      />
    </div>
  );
};

export default StudentsManagement;
