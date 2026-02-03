import React, { useState, useEffect } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  Edit2,
  Trash2,
  X,
  UserPlus,
  UserMinus,
  GraduationCap,
} from "lucide-react";
import {
  useCreateCourseAction,
  useGetAllCoursesAction,
  useUpdateCourseAction,
  useDeleteCourseAction,
  useAssignToCourseAction,
  useRemoveFromCourseAction,
} from "../../../store/course-store";
import {
  useGetAllLecturersAction,
  useGetAllStudentsAction,
} from "../../../store/user-store";
import { useGetAllDepartmentsAction } from "../../../store/department-store";
import DeleteModal from "../../../components/Delete-modal";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import SuggestibleSearchInput from "../../../components/SuggestibleSearchInput";
import {
  allCourses,
  coursesByDepartment,
} from "../../../core/data/courses-mock-data";

const CourseCreation = () => {
  const { isDarkMode } = useThemeStore();
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
  const {
    courses = [],
    refetch,
    isLoading: loadingCourses,
  } = useGetAllCoursesAction();
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
        ? course.department.map((d) =>
            typeof d === "object" && d?._id ? d._id : d,
          )
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
    const matchesSearch =
      (course.courseTitle || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (course.courseCode || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesDept =
      filterDepartment === "All" ||
      (Array.isArray(course.department) &&
        course.department.some((dept) => {
          const deptName =
            typeof dept === "object" ? dept.departmentName : dept;
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
    <div
      className={cn(
        "min-h-screen p-3 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1
            className={cn(
              "text-xl sm:text-3xl font-bold mb-1 sm:mb-2",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            Course Management
          </h1>
          <p
            className={cn(
              "text-xs sm:text-base",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Create and manage courses, assign lecturers
          </p>
        </div>

        {/* Actions Bar */}
        <div
          className={cn(
            "rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border",
            isDarkMode
              ? "bg-slate-900/50 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <div className="flex flex-wrap gap-2 sm:gap-4 items-center justify-between">
            <div className="flex gap-2 sm:gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors"
              >
                <BookOpen size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Add Course</span>
                <span className="sm:hidden">Add</span>
              </motion.button>
            </div>

            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className={cn(
                  "absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2",
                  isDarkMode ? "text-slate-500" : "text-gray-400",
                )}
                size={16}
              />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                    : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
                )}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2 sm:gap-3">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className={cn(
                  "px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white focus:border-orange-500 focus:ring-orange-500/20"
                    : "bg-white border-slate-300 text-slate-900 focus:border-blue-900 focus:ring-blue-900/20",
                )}
              >
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "rounded-xl border overflow-hidden shadow-sm",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-700"
                      : "bg-slate-50 border-slate-200",
                  )}
                >
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Course
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden md:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Departments
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Lecturers
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden sm:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Students
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredCourses.map((course, index) => {
                    const lecturersList = course.lecturers || [];
                    const studentsList = course.students || [];
                    const deptNames = Array.isArray(course.department)
                      ? course.department
                          .map((d) =>
                            typeof d === "object" ? d.departmentName : d,
                          )
                          .filter(Boolean)
                      : [];

                    return (
                      <motion.tr
                        key={course._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          "border-b transition-colors",
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800/30"
                            : "border-slate-100 hover:bg-slate-50",
                        )}
                      >
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 sm:gap-2 px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-sm font-semibold border",
                              isDarkMode
                                ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                : "bg-blue-100 text-blue-900 border-blue-200",
                            )}
                          >
                            <BookOpen size={10} className="sm:w-4 sm:h-4" />
                            {course.courseCode}
                          </span>
                          <div
                            className={cn(
                              "text-[10px] sm:text-base font-medium mt-0.5 sm:mt-1 truncate max-w-[120px] sm:max-w-none",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {course.courseTitle}
                          </div>
                          <div
                            className={cn(
                              "md:hidden text-[9px] mt-0.5",
                              isDarkMode ? "text-slate-400" : "text-slate-500",
                            )}
                          >
                            {deptNames.length > 0 ? deptNames[0] : "No dept"}
                            {deptNames.length > 1 &&
                              ` +${deptNames.length - 1}`}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden md:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {deptNames.slice(0, 2).map((deptName, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-[10px] sm:text-xs truncate max-w-[120px]",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600",
                                )}
                              >
                                {deptName}
                              </span>
                            ))}
                            {deptNames.length > 2 && (
                              <span
                                className={cn(
                                  "text-[10px] sm:text-xs font-medium",
                                  isDarkMode
                                    ? "text-blue-400"
                                    : "text-blue-600",
                                )}
                              >
                                +{deptNames.length - 2} more
                              </span>
                            )}
                            {deptNames.length === 0 && (
                              <span className="text-[10px] sm:text-xs text-gray-400 italic">
                                No departments
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden lg:table-cell">
                          <div className="flex flex-col gap-0.5">
                            {lecturersList.slice(0, 1).map((lecturer) => (
                              <span
                                key={lecturer._id}
                                className={cn(
                                  "text-[10px] sm:text-xs truncate max-w-[100px]",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600",
                                )}
                              >
                                {lecturer.fullname}
                              </span>
                            ))}
                            {lecturersList.length > 1 && (
                              <button
                                className={cn(
                                  "text-[10px] sm:text-xs font-medium underline text-left",
                                  isDarkMode
                                    ? "text-blue-400"
                                    : "text-blue-600",
                                )}
                                onClick={() =>
                                  handleShowAll("lecturers", course)
                                }
                              >
                                +{lecturersList.length - 1} more
                              </button>
                            )}
                            {(!lecturersList || lecturersList.length === 0) && (
                              <span className="text-[10px] sm:text-xs text-gray-400 italic">
                                No lecturers
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4 hidden sm:table-cell">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 text-[10px] sm:text-sm",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            <GraduationCap
                              size={10}
                              className="sm:w-4 sm:h-4"
                            />
                            {studentsList.length || 0}
                          </span>
                        </td>
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <div className="flex gap-1 sm:gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleAssignLecturers(course)}
                              className={cn(
                                "p-1 sm:p-2 rounded-lg transition-colors",
                                isDarkMode
                                  ? "hover:bg-green-500/20 text-green-400"
                                  : "hover:bg-green-100 text-green-600",
                              )}
                              title="Assign"
                            >
                              <UserPlus
                                size={12}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleEdit(course)}
                              className={cn(
                                "p-1 sm:p-2 rounded-lg transition-colors",
                                isDarkMode
                                  ? "hover:bg-blue-500/20 text-blue-400"
                                  : "hover:bg-blue-100 text-blue-900",
                              )}
                              title="Edit"
                            >
                              <Edit2
                                size={12}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(course)}
                              className={cn(
                                "p-1 sm:p-2 rounded-lg transition-colors",
                                isDarkMode
                                  ? "hover:bg-red-500/20 text-red-400"
                                  : "hover:bg-red-100 text-red-600",
                              )}
                              title="Delete"
                            >
                              <Trash2
                                size={12}
                                className="sm:w-[18px] sm:h-[18px]"
                              />
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
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-6 w-full max-w-md border shadow-xl max-h-[90vh] overflow-y-auto",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditingCourse(null);
                      setFormData({
                        courseTitle: "",
                        department: [],
                        lecturers: [],
                      });
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <SuggestibleSearchInput
                    label="Course Title"
                    value={formData.courseTitle}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        courseTitle: val,
                      })
                    }
                    suggestions={
                      formData.department.length > 0
                        ? Array.from(
                            new Set(
                              formData.department.flatMap((deptId) => {
                                const deptName = departments.find(
                                  (d) => d._id === deptId,
                                )?.departmentName;
                                return coursesByDepartment[deptName] || [];
                              }),
                            ),
                          )
                        : allCourses
                    }
                    placeholder="Enter course title"
                  />

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Departments
                    </label>
                    <div
                      className={cn(
                        "max-h-40 overflow-y-auto border rounded-lg p-2",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700"
                          : "bg-slate-50 border-slate-300",
                      )}
                    >
                      {departments.map((dept) => (
                        <label
                          key={dept._id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                            isDarkMode
                              ? "hover:bg-slate-700"
                              : "hover:bg-white",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={formData.department.includes(dept._id)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                department: prev.department.includes(dept._id)
                                  ? prev.department.filter(
                                      (id) => id !== dept._id,
                                    )
                                  : [...prev.department, dept._id],
                              }));
                            }}
                            className={cn(
                              "rounded border-slate-300",
                              isDarkMode
                                ? "bg-slate-700 text-orange-500 focus:ring-orange-500"
                                : "bg-white text-blue-900 focus:ring-blue-900",
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-slate-300" : "text-slate-700",
                            )}
                          >
                            {dept.departmentName}
                          </span>
                        </label>
                      ))}
                      {departments.length === 0 && (
                        <span className="text-xs text-gray-400 italic block p-2">
                          No departments available
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Assign Lecturers (Optional)
                    </label>
                    <div
                      className={cn(
                        "max-h-40 overflow-y-auto border rounded-lg p-2",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700"
                          : "bg-slate-50 border-slate-300",
                      )}
                    >
                      {availableLecturers.map((lecturer) => (
                        <label
                          key={lecturer._id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                            isDarkMode
                              ? "hover:bg-slate-700"
                              : "hover:bg-white",
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={formData.lecturers.includes(lecturer._id)}
                            onChange={() => {
                              setFormData((prev) => ({
                                ...prev,
                                lecturers: prev.lecturers.includes(lecturer._id)
                                  ? prev.lecturers.filter(
                                      (id) => id !== lecturer._id,
                                    )
                                  : [...prev.lecturers, lecturer._id],
                              }));
                            }}
                            className={cn(
                              "rounded border-slate-300",
                              isDarkMode
                                ? "bg-slate-700 text-orange-500 focus:ring-orange-500"
                                : "bg-white text-blue-900 focus:ring-blue-900",
                            )}
                          />
                          <span
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-slate-300" : "text-slate-700",
                            )}
                          >
                            {lecturer.fullname}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {!editingCourse && (
                    <div
                      className={cn(
                        "rounded-lg p-3 border",
                        isDarkMode
                          ? "bg-blue-500/10 border-blue-500/20"
                          : "bg-blue-50 border-blue-200",
                      )}
                    >
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-blue-400" : "text-blue-900",
                        )}
                      >
                        <strong>Note:</strong> Course code will be
                        auto-generated based on the first selected department.
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCreateCourse}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {editingCourse ? "Update" : "Create"} Course
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditingCourse(null);
                        setFormData({
                          courseTitle: "",
                          department: [],
                          lecturers: [],
                        });
                      }}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                        isDarkMode
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-slate-900",
                      )}
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
              onClick={() => {
                setShowAssignModal(false);
                setShowRemoveModal(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-6 w-full max-w-md border shadow-xl max-h-[90vh] overflow-y-auto",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {showAssignModal ? "Assign" : "Remove"} Lecturers/Students
                  </h2>
                  <button
                    onClick={() => {
                      setShowAssignModal(false);
                      setShowRemoveModal(false);
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="mb-4">
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-400" : "text-slate-600",
                    )}
                  >
                    Course:{" "}
                    <span
                      className={cn(
                        "font-semibold",
                        isDarkMode ? "text-white" : "text-slate-900",
                      )}
                    >
                      {selectedCourse?.courseCode} -{" "}
                      {selectedCourse?.courseTitle}
                    </span>
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Lecturers */}
                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Select Lecturers to{" "}
                      {showAssignModal ? "Assign" : "Remove"}
                    </label>
                    <div
                      className={cn(
                        "max-h-60 overflow-y-auto border rounded-lg p-2",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700"
                          : "bg-slate-50 border-slate-300",
                      )}
                    >
                      {availableLecturers
                        .filter((lecturer) =>
                          showAssignModal
                            ? !selectedCourse?.lecturers?.some(
                                (l) => l._id === lecturer._id,
                              )
                            : selectedCourse?.lecturers?.some(
                                (l) => l._id === lecturer._id,
                              ),
                        )
                        .map((lecturer) => (
                          <label
                            key={lecturer._id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                              isDarkMode
                                ? "hover:bg-slate-700"
                                : "hover:bg-white",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={assignData.lecturers.includes(
                                lecturer._id,
                              )}
                              onChange={() =>
                                toggleLecturerSelection(lecturer._id)
                              }
                              className={cn(
                                "rounded border-slate-300",
                                isDarkMode
                                  ? "bg-slate-700 text-orange-500 focus:ring-orange-500"
                                  : "bg-white text-blue-900 focus:ring-blue-900",
                              )}
                            />
                            <div className="flex-1">
                              <span
                                className={cn(
                                  "text-sm font-medium block",
                                  isDarkMode ? "text-white" : "text-slate-900",
                                )}
                              >
                                {lecturer.fullname}
                              </span>
                              <span
                                className={cn(
                                  "text-xs",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600",
                                )}
                              >
                                {lecturer.email}
                              </span>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                  {/* Students */}
                  <div>
                    <label
                      className={cn(
                        "block mb-2 font-medium",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Select Students to {showAssignModal ? "Assign" : "Remove"}
                    </label>
                    <div
                      className={cn(
                        "max-h-60 overflow-y-auto border rounded-lg p-2",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700"
                          : "bg-slate-50 border-slate-300",
                      )}
                    >
                      {allStudents
                        .filter((student) =>
                          showAssignModal
                            ? !selectedCourse?.students?.some(
                                (s) => s._id === student._id,
                              )
                            : selectedCourse?.students?.some(
                                (s) => s._id === student._id,
                              ),
                        )
                        .map((student) => (
                          <label
                            key={student._id}
                            className={cn(
                              "flex items-center gap-2 p-2 rounded cursor-pointer transition-colors",
                              isDarkMode
                                ? "hover:bg-slate-700"
                                : "hover:bg-white",
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={assignData.students?.includes(
                                student._id,
                              )}
                              onChange={() =>
                                toggleStudentSelection(student._id)
                              }
                              className={cn(
                                "rounded border-slate-300",
                                isDarkMode
                                  ? "bg-slate-700 text-green-500 focus:ring-green-500"
                                  : "bg-white text-green-700 focus:ring-green-700",
                              )}
                            />
                            <div className="flex-1">
                              <span
                                className={cn(
                                  "text-sm font-medium block",
                                  isDarkMode ? "text-white" : "text-slate-900",
                                )}
                              >
                                {student.fullname}
                              </span>
                              <span
                                className={cn(
                                  "text-xs",
                                  isDarkMode
                                    ? "text-slate-400"
                                    : "text-slate-600",
                                )}
                              >
                                {student.email}
                              </span>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={
                        showAssignModal
                          ? handleAssignSubmit
                          : handleRemoveSubmit
                      }
                      disabled={
                        assignData.lecturers.length === 0 &&
                        assignData.students.length === 0
                      }
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      {showAssignModal ? "Assign" : "Remove"} (
                      {assignData.lecturers.length + assignData.students.length}
                      )
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowAssignModal(false);
                        setShowRemoveModal(false);
                      }}
                      className={cn(
                        "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                        isDarkMode
                          ? "bg-slate-800 hover:bg-slate-700 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-slate-900",
                      )}
                    >
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40"
              onClick={() => setShowAllPopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-6 w-full max-w-lg border shadow-xl max-h-[90vh] overflow-y-auto",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2
                    className={cn(
                      "text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {popupType === "lecturers"
                      ? "All Lecturers"
                      : "All Students"}
                  </h2>
                  <button
                    onClick={() => setShowAllPopup(false)}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full">
                    <thead>
                      <tr
                        className={cn(
                          "border-b",
                          isDarkMode ? "border-slate-800" : "border-slate-200",
                        )}
                      >
                        <th
                          className={cn(
                            "text-left px-4 py-2",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          Name
                        </th>
                        <th
                          className={cn(
                            "text-left px-4 py-2",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          Email
                        </th>
                        <th
                          className={cn(
                            "text-left px-4 py-2",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          Level
                        </th>
                      </tr>
                    </thead>
                    <tbody
                      className={cn(
                        "divide-y",
                        isDarkMode ? "divide-slate-800" : "divide-slate-100",
                      )}
                    >
                      {(popupType === "lecturers"
                        ? popupCourse?.lecturers || []
                        : popupCourse?.students || []
                      ).map((person) => (
                        <tr key={person._id}>
                          <td
                            className={cn(
                              "px-4 py-2",
                              isDarkMode ? "text-white" : "text-slate-900",
                            )}
                          >
                            {person.fullname}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-2",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {person.email}
                          </td>
                          <td
                            className={cn(
                              "px-4 py-2",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {person.level || "-"}
                          </td>
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
