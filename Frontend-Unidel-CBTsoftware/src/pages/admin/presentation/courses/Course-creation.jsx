import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Search, Edit2, Trash2, X, UserPlus, UserMinus, GraduationCap } from "lucide-react";
import { useCreateCourseAction, useGetAllCoursesAction, useUpdateCourseAction, useDeleteCourseAction, useAssignToCourseAction, useRemoveFromCourseAction } from "../../../../store/course-store";
import { useGetAllLecturersAction, useGetAllStudentsAction } from "../../../../store/user-store";

const CourseCreation = () => {
  const [showModal, setShowModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAllPopup, setShowAllPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popupType, setPopupType] = useState(""); // "students" or "lecturers"
  const [formData, setFormData] = useState({
    courseTitle: "",
    department: "",
    lecturers: [],
  });
  const [assignData, setAssignData] = useState({
    lecturers: [],
    students: [],
  });

  const departments = ["Computer Science", "Software Engineering", "Data Science", "Information Technology"];

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
      department: formData.department,
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
      setFormData({ courseTitle: "", department: "", lecturers: [] });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      courseTitle: course.courseTitle || "",
      department: course.department || "",
      lecturers: course.lecturers?.map((l) => l._id) || [],
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(id);
        if (refetch) refetch();
      } catch (err) {
        console.error(err);
      }
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
    const matchesDept = filterDepartment === "All" || course.department === filterDepartment;
    return matchesSearch && matchesDept;
  });

  const handleShowAll = (type, course) => {
    setPopupType(type);
    setPopupCourse(course);
    setShowAllPopup(true);
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Course Management</h1>
          <p className="text-gray-600">Create and manage courses, assign lecturers</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <BookOpen size={20} />
                Add Course
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-gray-400 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors">
                <option>All</option>
                {departments.map((dept) => (
                  <option key={dept}>{dept}</option>
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
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course Code</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Course Title</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Department</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Lecturers</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Students</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCourses.map((course, index) => {
                    const lecturersList = course.lecturers || [];
                    const studentsList = course.students || [];
                    return (
                      <motion.tr key={course._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold bg-blue-100 text-blue-900 border border-blue-200">
                            <BookOpen size={16} />
                            {course.courseCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-slate-900 font-medium">{course.courseTitle}</span>
                        </td>
                        <td className="px-6 py-4 text-slate-600">{course.department}</td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            {lecturersList.slice(0, 2).map((lecturer) => (
                              <span key={lecturer._id} className="text-xs text-slate-600">
                                {lecturer.fullname}
                              </span>
                            ))}
                            {lecturersList.length > 2 && (
                              <button
                                className="text-xs text-blue-600 font-medium underline"
                                onClick={() => handleShowAll("lecturers", course)}
                              >
                                See all ({lecturersList.length})
                              </button>
                            )}
                            {(!lecturersList || lecturersList.length === 0) && <span className="text-xs text-gray-400 italic">No lecturers</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 text-slate-600 text-sm">
                            <GraduationCap size={16} />
                            {studentsList.length || 0}
                            {studentsList.length > 2 && (
                              <button
                                className="ml-2 text-xs text-blue-600 font-medium underline"
                                onClick={() => handleShowAll("students", course)}
                              >
                                See all
                              </button>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleAssignLecturers(course)} className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors" title="Assign Lecturers">
                              <UserPlus size={18} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleRemoveLecturers(course)} className="p-2 hover:bg-amber-100 rounded-lg text-amber-600 transition-colors" title="Remove Lecturers">
                              <UserMinus size={18} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(course)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors" title="Edit Course">
                              <Edit2 size={18} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(course._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" title="Delete Course">
                              <Trash2 size={18} />
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditingCourse(null);
                setFormData({ courseTitle: "", department: "", lecturers: [] });
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingCourse ? "Edit Course" : "Add New Course"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      setFormData({ courseTitle: "", department: "", lecturers: [] });
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
                    <label className="block text-slate-700 mb-2 font-medium">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                    >
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
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
                        <strong>Note:</strong> Course code will be auto-generated based on the department.
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
                        setFormData({ courseTitle: "", department: "", lecturers: [] });
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => { setShowAssignModal(false); setShowRemoveModal(false); }}>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowAllPopup(false)}>
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
    </div>
  );
};

export default CourseCreation;
