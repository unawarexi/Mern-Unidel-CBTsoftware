import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Edit2, Trash2, X, UserPlus, UserMinus, GraduationCap } from "lucide-react";
import { useCreateCourseAction, useGetAllCoursesAction, useUpdateCourseAction, useDeleteCourseAction, useAssignToCourseAction, useRemoveFromCourseAction } from "../../../../store/course-store";
import { useGetAllLecturersAction, useGetAllStudentsAction } from "../../../../store/user-store";
import { useGetAllDepartmentsAction } from "../../../../store/department-store";
import DeleteModal from "../../../../components/Delete-modal";

const CourseCreation = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAllPopup, setShowAllPopup] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popupType, setPopupType] = useState(""); // "students" or "lecturers"
  const [formData, setFormData] = useState({
    courseTitle: "",
    department: [], // <-- Changed to array
    lecturers: [],
  });
  const [assignData, setAssignData] = useState({
    lecturers: [],
    students: [],
  });

  const { departments = [] } = useGetAllDepartmentsAction();

  // Store hooks
  const { createCourse } = useCreateCourseAction();
  // eslint-disable-next-line no-unused-vars
  const { courses = [], refetch, isLoading: loadingCourses } = useGetAllCoursesAction();
  const { updateCourse } = useUpdateCourseAction();
  const { deleteCourse } = useDeleteCourseAction();
  const { assignToCourse } = useAssignToCourseAction();
  const { removeFromCourse } = useRemoveFromCourseAction();
  const { lecturers: availableLecturers = [] } = useGetAllLecturersAction();
  const { students: allStudents = [] } = useGetAllStudentsAction();

  useEffect(() => {
    if (refetch) refetch();
  }, []);

  const handleCreateCourse = async () => {
    const payload = {
      courseTitle: formData.courseTitle,
      department: formData.department, // <-- Now an array of department IDs
      lecturers: formData.lecturers,
    };

    try {
      if (editingCourse) {
        await updateCourse(editingCourse._id, payload);
      } else {
        await createCourse(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditingCourse(null);
      setFormData({ courseTitle: "", department: [], lecturers: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseTitle: course.courseTitle || "",
      department: Array.isArray(course.department)
        ? course.department.map(d => typeof d === "object" && d?._id ? d._id : d)
        : [],
      lecturers: course.lecturers?.map((l) => l._id) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (course) => {
    setCourseToDelete(course);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    try {
      await deleteCourse(courseToDelete._id);
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setCourseToDelete(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignLecturers = (course) => {
    setSelectedCourse(course);
    setAssignData({ lecturers: [], students: [] });
    setShowAssignModal(true);
  };

  const handleRemoveLecturers = (course) => {
    setSelectedCourse(course);
    setAssignData({ lecturers: [], students: [] });
    setShowRemoveModal(true);
  };

  const handleAssignSubmit = async () => {
    try {
      await assignToCourse(selectedCourse._id, assignData);
      if (refetch) refetch();
      setShowAssignModal(false);
      setSelectedCourse(null);
      setAssignData({ lecturers: [], students: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveSubmit = async () => {
    try {
      await removeFromCourse(selectedCourse._id, assignData);
      if (refetch) refetch();
      setShowRemoveModal(false);
      setSelectedCourse(null);
      setAssignData({ lecturers: [], students: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const toggleLecturerSelection = (lecturerId) => {
    setAssignData((prev) => ({
      ...prev,
      lecturers: prev.lecturers.includes(lecturerId)
        ? prev.lecturers.filter((id) => id !== lecturerId)
        : [...prev.lecturers, lecturerId],
    }));
  };

  const toggleStudentSelection = (studentId) => {
    setAssignData((prev) => ({
      ...prev,
      students: prev.students?.includes(studentId)
        ? prev.students.filter((id) => id !== studentId)
        : [...(prev.students || []), studentId],
    }));
  };

  const filteredCourses = (courses || []).filter((course) => {
    const matchesSearch = (course.courseTitle || "").toLowerCase().includes(searchTerm.toLowerCase()) || (course.courseCode || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDepartment === "All" ||
      (Array.isArray(course.department) &&
        course.department.some(dept => {
          const deptName = typeof dept === "object" ? dept.departmentName : dept;
          return deptName === filterDepartment;
        }));
    return matchesSearch && matchesDept;
  });

  const handleShowAll = (type, course) => {
    setPopupType(type);
    setPopupCourse(course);
    setShowAllPopup(true);
  };

  return (
    <div className="min-h-screen bg-white p-3 sm:p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">Course Management</h1>
          <p className="text-xs sm:text-base text-gray-600">Create and manage courses, assign lecturers</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex gap-2 sm:gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors">
                <BookOpen size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Course</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors">
                <option>All</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept.departmentName}>
                    {dept.departmentName}
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
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Course</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden md:table-cell">Departments</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden lg:table-cell">Lecturers</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base hidden sm:table-cell">Students</th>
                  <th className="text-left px-3 sm:px-6 py-2 sm:py-4 text-slate-700 font-semibold text-xs sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCourses.map((course, index) => {
                    const lecturersList = course.lecturers || [];
                    const studentsList = course.students || [];
                    const deptNames = Array.isArray(course.department)
                      ? course.department.map(d => typeof d === "object" ? d.departmentName : d).filter(Boolean)
                      : [];
                    
                    return (
                      <motion.tr key={course._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <span className="inline-flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-sm font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                            <BookOpen size={10} className="sm:w-4 sm:h-4" />
                            {course.courseCode}
                          </span>
                          <div className="text-[10px] sm:text-base text-slate-900 font-medium mt-0.5 sm:mt-1 truncate max-w-[120px] sm:max-w-none">{course.courseTitle}</div>
                          <div className="md:hidden text-[9px] text-slate-500 mt-0.5">
                            {deptNames.length > 0 ? deptNames[0] : "No dept"}
                            {deptNames.length > 1 && ` +${deptNames.length - 1}`}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {deptNames.slice(0, 2).map((deptName, i) => (
                              <span key={i} className="text-[10px] sm:text-xs text-slate-600 truncate max-w-[120px]">{deptName}</span>
                            ))}
                            {deptNames.length > 2 && (
                              <span className="text-[10px] sm:text-xs text-blue-600 font-medium">+{deptNames.length - 2} more</span>
                            )}
                            {deptNames.length === 0 && <span className="text-[10px] sm:text-xs text-gray-400 italic">No departments</span>}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden lg:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {lecturersList.slice(0, 1).map((lecturer) => (
                              <span key={lecturer._id} className="text-[10px] sm:text-xs text-slate-600 truncate max-w-[100px]">
                                {lecturer.fullname}
                              </span>
                            ))}
                            {lecturersList.length > 1 && (
                              <button
                                className="text-[10px] sm:text-xs text-blue-600 font-medium underline text-left"
                                onClick={() => handleShowAll("lecturers", course)}
                              >
                                +{lecturersList.length - 1} more
                              </button>
                            )}
                            {(!lecturersList || lecturersList.length === 0) && <span className="text-[10px] sm:text-xs text-gray-400 italic">No lecturers</span>}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                          <span className="inline-flex items-center gap-1 text-slate-600 text-[10px] sm:text-sm">
                            <GraduationCap size={10} className="sm:w-4 sm:h-4" />
                            {studentsList.length || 0}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="flex gap-1 sm:gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAssignLecturers(course)} className="p-1 sm:p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Assign">
                              <UserPlus size={12} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(course)} className="p-1 sm:p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors" title="Edit">
                              <Edit2 size={12} className="sm:w-[18px] sm:h-[18px]" />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(course)} className="p-1 sm:p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Delete">
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

        {/* Add/Edit Course Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
              onClick={() => {
                setShowModal(false);
                setEditingCourse(null);
                setFormData({ courseTitle: "", department: [], lecturers: [] });
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      setFormData({ courseTitle: "", department: [], lecturers: [] });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">Course Title</label>
                    <input
                      type="text"
                      value={formData.courseTitle}
                      onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter course title"
                    />
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
                    <label className="block text-slate-700 mb-2 font-medium">Assign Lecturers (Optional)</label>
                    <div className="max-h-40 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {availableLecturers.map((lecturer) => (
                        <label key={lecturer._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.lecturers.includes(lecturer._id)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                lecturers: prev.lecturers.includes(lecturer._id) ? prev.lecturers.filter((id) => id !== lecturer._id) : [...prev.lecturers, lecturer._id],
                              }));
                            }}
                            className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                          />
                          <span className="text-sm text-slate-700">{lecturer.fullname}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {!editingCourse && (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-blue-900 text-sm">
                        <strong>Note:</strong> Course code will be auto-generated based on the first selected department.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCreateCourse} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      {editingCourse ? "Update" : "Create"} Course
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingCourse(null);
                        setFormData({ courseTitle: "", department: [], lecturers: [] });
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

        {/* Assign/Remove Lecturers/Students Modal */}
        <AnimatePresence>
          {(showAssignModal || showRemoveModal) && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40" onClick={() => { setShowAssignModal(false); setShowRemoveModal(false); }}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {showAssignModal ? "Assign" : "Remove"} Lecturers/Students
                  </h2>
                  <button onClick={() => { setShowAssignModal(false); setShowRemoveModal(false); }} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-600">
                    Course:{" "}
                    <span className="font-semibold text-slate-900">
                      {selectedCourse?.courseCode} - {selectedCourse?.courseTitle}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Lecturers */}
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Select Lecturers to {showAssignModal ? "Assign" : "Remove"}
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {availableLecturers
                        .filter((lecturer) =>
                          showAssignModal
                            ? !selectedCourse?.lecturers?.some((l) => l._id === lecturer._id)
                            : selectedCourse?.lecturers?.some((l) => l._id === lecturer._id)
                        )
                        .map((lecturer) => (
                          <label key={lecturer._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assignData.lecturers.includes(lecturer._id)}
                              onChange={() => toggleLecturerSelection(lecturer._id)}
                              className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-slate-900 font-medium block">{lecturer.fullname}</span>
                              <span className="text-xs text-slate-600">{lecturer.email}</span>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                  {/* Students */}
                  <div>
                    <label className="block text-slate-700 mb-2 font-medium">
                      Select Students to {showAssignModal ? "Assign" : "Remove"}
                    </label>
                    <div className="max-h-60 overflow-y-auto border border-slate-300 rounded-lg p-2 bg-slate-50">
                      {allStudents
                        .filter((student) =>
                          showAssignModal
                            ? !selectedCourse?.students?.some((s) => s._id === student._id)
                            : selectedCourse?.students?.some((s) => s._id === student._id)
                        )
                        .map((student) => (
                          <label key={student._id} className="flex items-center gap-2 p-2 hover:bg-white rounded cursor-pointer">
                            <input
                              type="checkbox"
                              checked={assignData.students?.includes(student._id)}
                              onChange={() => toggleStudentSelection(student._id)}
                              className="rounded border-slate-300 text-green-700 focus:ring-green-700"
                            />
                            <div className="flex-1">
                              <span className="text-sm text-slate-900 font-medium block">{student.fullname}</span>
                              <span className="text-xs text-slate-600">{student.email}</span>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={showAssignModal ? handleAssignSubmit : handleRemoveSubmit}
                      disabled={assignData.lecturers.length === 0 && assignData.students.length === 0}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {showAssignModal ? "Assign" : "Remove"} ({assignData.lecturers.length + assignData.students.length})
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setShowAssignModal(false); setShowRemoveModal(false); }} className="flex-1 bg-gray-200 hover:bg-gray-300 text-slate-900 px-4 py-2 rounded-lg font-medium transition-colors">
                      Cancel
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* See All Popup */}
        <AnimatePresence>
          {showAllPopup && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40" onClick={() => setShowAllPopup(false)}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-lg border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">
                    {popupType === "lecturers" ? "All Lecturers" : "All Students"}
                  </h2>
                  <button onClick={() => setShowAllPopup(false)} className="text-gray-400 hover:text-slate-900 transition-colors">
                    <X size={24} />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left px-4 py-2">Name</th>
                        <th className="text-left px-4 py-2">Email</th>
                        <th className="text-left px-4 py-2">Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(popupType === "lecturers"
                        ? popupCourse?.lecturers || []
                        : popupCourse?.students || []
                      ).map((person) => (
                        <tr key={person._id}>
                          <td className="px-4 py-2">{person.fullname}</td>
                          <td className="px-4 py-2">{person.email}</td>
                          <td className="px-4 py-2">{person.level || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
          setCourseToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Course"
        message="Are you sure you want to delete this course?"
        itemName={courseToDelete?.courseTitle}
      />
    </div>
  );
};

export default CourseCreation;
