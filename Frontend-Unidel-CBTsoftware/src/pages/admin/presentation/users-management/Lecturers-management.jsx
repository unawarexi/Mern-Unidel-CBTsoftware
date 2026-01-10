/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Upload, Search, Filter, Edit2, Trash2, X, Award, BookOpen } from "lucide-react";
import {
  useCreateLecturerAction,
  useGetAllLecturersAction,
  useUpdateLecturerAction,
  useDeleteLecturerAction,
} from "../../../../store/user-store";
import { useUploadAttachmentAction, useGetUserAttachmentsAction } from "../../../../store/attachment-store";
import { useGetAllCoursesAction } from "../../../../store/course-store"; // already imported
import { useGetAllDepartmentsAction } from "../../../../store/department-store";
import DeleteModal from "../../../../components/Delete-modal";
const LecturersManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All");
  const [editingLecturer, setEditingLecturer] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [lecturerToDelete, setLecturerToDelete] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    lecturerId: "",
    employeeId: "",
    department: [], // <-- Changed to array
    courses: [],
    role: "Lecturer",
  });

  const { departments = [] } = useGetAllDepartmentsAction();
  const roles = ["Lecturer", "Senior Lecturer", "Professor", "Associate Professor"];

  // store hooks
  const { createLecturer } = useCreateLecturerAction();
  // eslint-disable-next-line no-unused-vars
  const { lecturers = [], refetch, isLoading: loadingLecturers } = useGetAllLecturersAction();
  const { updateLecturer } = useUpdateLecturerAction();
  const { deleteLecturer } = useDeleteLecturerAction();
  const { uploadAttachment } = useUploadAttachmentAction();
  // eslint-disable-next-line no-unused-vars
  const { attachments, refetch: refetchAttachments } = useGetUserAttachmentsAction();

  // Fetch all courses for the course selection dropdown and for display
  const { courses: allCourses = [] } = useGetAllCoursesAction();

  useEffect(() => {
    // initial fetch (refetch from hook if available)
    if (refetch) refetch();
  }, []);

  const handleAddLecturer = async () => {
    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      lecturerId: formData.lecturerId || undefined,
      employeeId: formData.employeeId || undefined,
      department: formData.department,
      courses: formData.courses, // <-- Array of course IDs
      role: formData.role,
    };

    // Debug: Log the payload to verify courses are included
    console.log("[DEBUG] handleAddLecturer payload:", payload);
    console.log("[DEBUG] courses in payload:", payload.courses);

    try {
      if (editingLecturer) {
        await updateLecturer(editingLecturer._id, payload);
      } else {
        await createLecturer(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditingLecturer(null);
      setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: [], courses: [], role: "Lecturer" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (lecturer) => {
    setEditingLecturer(lecturer);
    setFormData({
      fullname: lecturer.fullname || "",
      email: lecturer.email || "",
      lecturerId: lecturer.lecturerId || "",
      employeeId: lecturer.employeeId || "",
      department: Array.isArray(lecturer.department) 
        ? lecturer.department.map(d => typeof d === "object" && d?._id ? d._id : d) 
        : [],
      courses: Array.isArray(lecturer.courses) ? lecturer.courses.map(c => typeof c === "object" && c?._id ? c._id : c) : [],
      role: lecturer.role || "Lecturer",
    });
    setShowModal(true);
  };

  const handleDelete = async (lecturer) => {
    setLecturerToDelete(lecturer);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!lecturerToDelete) return;
    try {
      await deleteLecturer(lecturerToDelete._id);
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setLecturerToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const form = new FormData();
    form.append("file", file);

    try {
      await uploadAttachment(form);
      if (refetchAttachments) refetchAttachments();
      setShowUploadModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredLecturers = (lecturers || []).filter((lecturer) => {
    const matchesSearch =
      (lecturer.fullname || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lecturer.lecturerId || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filterDepartment === "All" || 
      (Array.isArray(lecturer.department) && 
        lecturer.department.some(dept => {
          const deptName = typeof dept === "object" ? dept.departmentName : dept;
          return deptName === filterDepartment;
        }));
    
    const matchesLevel = filterLevel === "All" || lecturer.level === Number(filterLevel);
    const matchesCourse =
      filterCourse === "All" ||
      (Array.isArray(lecturer.courses) &&
        lecturer.courses.some((cid) => {
          const course = allCourses.find((c) => c._id === cid || c._id === cid?._id);
          return course && (course.courseCode === filterCourse || course.courseTitle === filterCourse);
        }));
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

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Lecturers Management</h1>
          <p className="text-xs sm:text-base text-gray-600">Manage lecturer accounts and course assignments</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors flex-1 sm:flex-none justify-center">
                <UserPlus size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Lecturer</span>
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
                placeholder="Search lecturers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-1.5 sm:gap-3 w-full sm:w-auto order-2 sm:order-3 overflow-x-auto pb-1 sm:pb-0">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors min-w-[80px] sm:flex-1 sm:min-w-0">
                <option>All</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.departmentName}>
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
                  <option key={course._id} value={course.courseCode}>{course.courseCode} - {course.courseTitle}</option>
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
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden md:table-cell">Role</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden lg:table-cell">Departments</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLecturers.map((lecturer, index) => {
                    const courseLabels = getCourseLabels(
                      Array.isArray(lecturer.courses)
                        ? lecturer.courses.map((c) =>
                            typeof c === "object" && c?._id ? c._id : c
                          )
                        : []
                    );
                    const displayCourses = courseLabels.slice(0, 2).join(", ");
                    const hasMore = courseLabels.length > 2;
                    
                    const deptNames = Array.isArray(lecturer.department)
                      ? lecturer.department.map(d => typeof d === "object" ? d.departmentName : d).filter(Boolean)
                      : [];
                    
                    return (
                      <motion.tr key={lecturer._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="flex items-center gap-1.5 sm:gap-3">
                            <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-[9px] sm:text-sm">
                              {(lecturer.fullname || "")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <span className="text-slate-900 font-medium text-[10px] sm:text-base block truncate max-w-[100px] sm:max-w-none">{lecturer.fullname}</span>
                              <span className="sm:hidden text-[9px] text-slate-500 block truncate max-w-[100px]">{lecturer.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 text-slate-600 text-[10px] sm:text-base hidden sm:table-cell">
                          <div className="truncate max-w-[150px]">{lecturer.email}</div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden md:table-cell">
                          <span className="inline-flex items-center gap-1 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium bg-blue-100 text-blue-900 border border-blue-200">
                            <Award size={10} className="sm:w-[14px] sm:h-[14px]" />
                            {lecturer.role}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden lg:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {deptNames.slice(0, 1).map((deptName, i) => (
                              <span key={i} className="text-[10px] sm:text-xs text-slate-600 truncate max-w-[100px]">{deptName}</span>
                            ))}
                            {deptNames.length > 1 && (
                              <span className="text-[10px] sm:text-xs text-blue-600 font-medium">+{deptNames.length - 1} more</span>
                            )}
                            {deptNames.length === 0 && <span className="text-[10px] sm:text-xs text-gray-400 italic">No departments</span>}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="flex gap-1 sm:gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(lecturer)} className="p-1 sm:p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors">
                              <Edit2 size={12} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(lecturer)} className="p-1 sm:p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditingLecturer(null);
                setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: [], courses: [], role: "Lecturer" });
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingLecturer ? "Edit Lecturer" : "Add New Lecturer"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingLecturer(null);
                      setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: [], courses: [], role: "Lecturer" });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter lecturer name"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Departments</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {departments.map((dept) => (
                        <label key={dept._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.department.includes(dept._id)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                department: prev.department.includes(dept._id)
                                  ? prev.department.filter((id) => id !== dept._id)
                                  : [...prev.department, dept._id],
                              }));
                            }}
                            className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span className="text-sm text-slate-700">{dept.departmentName}</span>
                        </label>
                      ))}
                      {departments.length === 0 && (
                        <span className="text-xs text-gray-400 italic block p-2">No departments available</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Level</label>
                    <input
                      type="number"
                      value={formData.level || ""}
                      onChange={(e) => setFormData({ ...formData, level: Number(e.target.value) })}
                      min={100}
                      max={900}
                      step={100}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900"
                      placeholder="e.g. 100, 200, 300"
                    />
                  </div>

                  {/* Redesigned Course selection */}
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Assign Courses</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {allCourses.map((course) => (
                        <label key={course._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.courses.includes(course._id)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                courses: prev.courses.includes(course._id)
                                  ? prev.courses.filter((id) => id !== course._id)
                                  : [...prev.courses, course._id],
                              }));
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddLecturer} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      {editingLecturer ? "Update" : "Add"} Lecturer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingLecturer(null);
                        setFormData({ fullname: "", email: "", lecturerId: "", employeeId: "", department: [], courses: [], role: "Lecturer" });
                      }}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </div>
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
                  <h2 className="text-2xl font-bold text-slate-900">Bulk Upload Lecturers</h2>
                  <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-orange-500 transition-colors">
                    <Upload className="mx-auto mb-4 text-gray-400" size={48} />
                    <p className="text-slate-700 mb-2">Drop your CSV or PDF file here</p>
                    <p className="text-gray-500 text-sm mb-4">or click to browse</p>
                    <input type="file" accept=".csv,.pdf" onChange={handleFileUpload} className="hidden" id="file-upload-lecturer" />
                    <label htmlFor="file-upload-lecturer" className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium cursor-pointer transition-colors">
                      Choose File
                    </label>
                  </div>

                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <p className="text-slate-700 text-sm mb-2 font-medium">File Format Requirements:</p>
                    <ul className="text-slate-600 text-sm space-y-1">
                      <li>• CSV: name, email, role, department, courseId, status</li>
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
          setLecturerToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Lecturer"
        message="Are you sure you want to delete this lecturer?"
        itemName={lecturerToDelete?.fullname}
      />
    </div>
  );
};

export default LecturersManagement;
