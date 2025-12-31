import React, { useState, useEffect } from "react";
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

const StudentsManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [filterLevel, setFilterLevel] = useState("All");
  const [filterCourse, setFilterCourse] = useState("All");
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    matricNumber: "",
    department: "",
    courses: "", // comma-separated
  });

  //   const courses = ["CS101", "CS102", "CS103", "CS104"];
  const departments = ["Computer Science", "Software Engineering", "Data Science", "Information Technology"];

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
    if (refetch) refetch();
  }, []);

  const handleAddStudent = async () => {
    // Ensure courses is always an array of course ObjectIds (not courseCode)
    let selectedCourseId = null;
    if (formData.courses) {
      // If courses is an array, take the first value; if string, use as is
      const selected = Array.isArray(formData.courses)
        ? formData.courses[0]
        : formData.courses;
      // Find the course object by courseCode
      const found = allCourses.find(
        (c) => c.courseCode === selected || c._id === selected
      );
      selectedCourseId = found ? found._id : null;
    }

    const payload = {
      fullname: formData.fullname,
      email: formData.email,
      matricNumber: formData.matricNumber || undefined,
      department: formData.department,
      courses: selectedCourseId ? [selectedCourseId] : [],
      level: formData.level,
    };

    try {
      if (editingStudent) {
        await updateStudent(editingStudent._id, payload);
      } else {
        await createStudent(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ fullname: "", email: "", matricNumber: "", department: "", courses: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      fullname: student.fullname || "",
      email: student.email || "",
      matricNumber: student.matricNumber || "",
      department: student.department || "",
      courses: Array.isArray(student.courses) ? student.courses.join(", ") : (student.courses || ""),
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to remove this student?")) {
      try {
        await deleteStudent(id);
        if (refetch) refetch();
      } catch (err) {
        console.error(err);
      }
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

  return (
    <div className="min-h-screen bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Students Management</h1>
          <p className="text-gray-600">Manage student accounts and enrollments</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-200">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(true)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <UserPlus size={20} />
                Add Student
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                <Upload size={20} />
                Bulk Upload
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search students..."
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
              <select value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900">
                <option>All</option>
                {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((lvl) => (
                  <option key={lvl} value={lvl}>{lvl}</option>
                ))}
              </select>
              <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)} className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900">
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
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Full Name</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Email</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Matric Number</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Department</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Level</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Courses</th>
                  <th className="text-left px-6 py-4 text-slate-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredStudents.map((student, index) => {
                    // Get course labels for this student
                    const courseLabels = getCourseLabels(
                      Array.isArray(student.courses)
                        ? student.courses.map((c) =>
                            typeof c === "object" && c?._id ? c._id : c
                          )
                        : []
                    );
                    // Limit display to 2 courses, show ... if more
                    const displayCourses = courseLabels.slice(0, 2).join(", ");
                    const hasMore = courseLabels.length > 2;
                    return (
                      <motion.tr key={student._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ delay: index * 0.05 }} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-slate-900 font-medium">{student.fullname}</td>
                        <td className="px-6 py-4 text-slate-600">{student.email}</td>
                        <td className="px-6 py-4 text-slate-600">{student.matricNumber}</td>
                        <td className="px-6 py-4 text-slate-600">{student.department}</td>
                        <td className="px-6 py-4 text-slate-600">{student.level || "-"}</td>
                        <td className="px-6 py-4 text-slate-600">
                          {courseLabels.length === 0 && <span className="text-xs text-gray-400 italic">No courses</span>}
                          {courseLabels.length > 0 && (
                            <>
                              {displayCourses}
                              {hasMore && <span className="text-xs text-blue-600 font-medium">&nbsp;... </span>}
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleEdit(student)} className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors">
                              <Edit2 size={18} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(student._id)} className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
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
                setEditingStudent(null);
                setFormData({ fullname: "", email: "", matricNumber: "", department: "", courses: "" });
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-xl p-6 w-full max-w-md border border-slate-200 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">{editingStudent ? "Edit Student" : "Add New Student"}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingStudent(null);
                      setFormData({ fullname: "", email: "", matricNumber: "", department: "", courses: "" });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Full Name</label>
                    <input
                      type="text"
                      value={formData.fullname}
                      onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter student full name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Matric Number</label>
                    <input
                      type="text"
                      value={formData.matricNumber}
                      onChange={(e) => setFormData({ ...formData, matricNumber: e.target.value })}
                      className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors"
                      placeholder="Enter matric number"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Department</label>
                    <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:border-blue-900 focus:ring-2 focus:ring-blue-900/20 transition-colors">
                      <option value="">Select department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Level</label>
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

                  <div>
                    <label className="block text-gray-300 mb-2 font-medium">Courses</label>
                    <div className="flex flex-col gap-2">
                      {allCourses.map((course) => (
                        <label key={course._id} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="student-course"
                            value={course.courseCode}
                            checked={
                              Array.isArray(formData.courses)
                                ? formData.courses.includes(course.courseCode)
                                : formData.courses === course.courseCode
                            }
                            onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                            className="accent-blue-900"
                          />
                          <span className="text-sm text-slate-700">{course.courseCode} - {course.courseTitle}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddStudent} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                      {editingStudent ? "Update" : "Add"} Student
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingStudent(null);
                        setFormData({ fullname: "", email: "", matricNumber: "", department: "", courses: "" });
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
    </div>
  );
};

export default StudentsManagement;
