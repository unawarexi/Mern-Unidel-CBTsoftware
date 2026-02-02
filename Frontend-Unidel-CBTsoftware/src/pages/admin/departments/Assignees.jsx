/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus,
  BookOpen,
  GraduationCap,
  Edit2,
  Trash2,
  Plus,
  X,
  Search,
  ChevronDown,
} from "lucide-react";
import {
  useGetAllDepartmentsAction,
  useGetDepartmentByIdAction,
  useUpdateDepartmentAction,
} from "../../../store/department-store";
import {
  useGetAllLecturersAction,
  useUpdateLecturerAction,
  useGetAllStudentsAction,
  useUpdateStudentAction,
} from "../../../store/user-store";
import { useGetAllCoursesAction } from "../../../store/course-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const TabButton = ({
  label,
  value,
  icon: Icon,
  count,
  activeTab,
  setActiveTab,
}) => {
  const { isDarkMode } = useThemeStore();
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        "flex items-center gap-1 sm:gap-2 px-2 sm:px-6 py-1.5 sm:py-3 rounded-lg text-xs sm:text-base font-semibold transition-all",
        activeTab === value
          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
          : isDarkMode
            ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200",
      )}
    >
      <Icon size={14} className="sm:w-5 sm:h-5" />
      <span className="hidden xs:inline">{label}</span>
      <span className="xs:hidden">{label.slice(0, 3)}</span>
      <span
        className={cn(
          "px-1 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs",
          activeTab === value
            ? "bg-white/20 text-white"
            : isDarkMode
              ? "bg-slate-700 text-slate-300"
              : "bg-slate-100 text-slate-600",
        )}
      >
        {count}
      </span>
    </button>
  );
};

const Assignees = () => {
  const { isDarkMode } = useThemeStore();
  const { departments = [] } = useGetAllDepartmentsAction();
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [editData, setEditData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("courses");
  const [levelInput, setLevelInput] = useState("");

  const { department } = useGetDepartmentByIdAction(selectedDeptId);
  const { updateDepartment } = useUpdateDepartmentAction();
  const { lecturers = [] } = useGetAllLecturersAction();
  const { updateLecturer } = useUpdateLecturerAction();
  const { students = [] } = useGetAllStudentsAction();
  const { updateStudent } = useUpdateStudentAction();
  const { courses = [] } = useGetAllCoursesAction();

  useEffect(() => {
    if (departments.length > 0 && !selectedDeptId) {
      setSelectedDeptId(departments[0]._id);
    }
  }, [departments, selectedDeptId]);

  // Get full objects for department assignees
  const getFullAssignees = (ids, all) =>
    (ids || []).map((item) => {
      if (typeof item === "object" && item._id) return item;
      return all.find((a) => a._id === item) || { _id: item };
    });

  const deptCourses = getFullAssignees(department?.courses, courses);
  const deptLecturers = getFullAssignees(department?.lecturers, lecturers);
  const deptStudents = getFullAssignees(department?.students, students);

  // Add course/lecturer/student to department
  const handleAddAssignee = async (type, id) => {
    if (!department || !id) return;
    const field = `${type}s`;
    const currentIds = (department[field] || []).map((item) =>
      typeof item === "string" ? item : item._id,
    );
    if (currentIds.includes(id)) {
      alert(`This ${type} is already assigned to this department.`);
      return;
    }
    const updates = { [field]: [...currentIds, id] };
    await updateDepartment(department._id, updates);
    setShowModal(false);
    setModalType("");
  };

  // Remove course/lecturer/student from department
  const handleRemoveAssignee = async (type, id) => {
    if (!department) return;
    const field = `${type}s`;
    const updates = {
      [field]: (department[field] || [])
        .map((item) => (typeof item === "string" ? item : item._id))
        .filter((itemId) => itemId !== id),
    };
    await updateDepartment(department._id, updates);
  };

  // Edit level for lecturer/student
  const handleEditLevel = (type, data) => {
    setModalType(type);
    setEditData(data);
    setLevelInput(data.level || "");
    setShowModal(true);
  };

  const handleSaveLevel = async () => {
    const level = Number(levelInput);
    if (!level || level < 100 || level > 900 || level % 100 !== 0) {
      alert("Please enter a valid level (100-900, in increments of 100)");
      return;
    }
    if (modalType === "lecturer") {
      await updateLecturer(editData._id, { level });
    } else if (modalType === "student") {
      await updateStudent(editData._id, { level });
    }
    setShowModal(false);
    setEditData(null);
    setLevelInput("");
  };

  const openAddModal = (type) => {
    setModalType(type);
    setEditData(null);
    setShowModal(true);
  };

  const filterBySearch = (items, type) => {
    if (!searchTerm) return items;
    return items.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      if (type === "course") {
        return (
          item.courseCode?.toLowerCase().includes(searchLower) ||
          item.courseTitle?.toLowerCase().includes(searchLower)
        );
      } else if (type === "lecturer" || type === "student") {
        return (
          item.fullname?.toLowerCase().includes(searchLower) ||
          item.email?.toLowerCase().includes(searchLower) ||
          item.matricNumber?.toLowerCase().includes(searchLower)
        );
      }
      return false;
    });
  };

  return (
    <div
      className={cn(
        "min-h-screen p-2 sm:p-6 transition-colors duration-300",
        isDarkMode
          ? "bg-slate-950 text-slate-100"
          : "bg-gradient-to-br from-slate-50 to-slate-100 text-slate-900",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl p-3 sm:p-8 mb-3 sm:mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
            <div>
              <h1 className="text-lg sm:text-3xl font-bold text-white mb-1 sm:mb-2">
                Department Assignees
              </h1>
              <p className="text-xs sm:text-base text-blue-200">
                Manage courses, lecturers, and students
              </p>
            </div>
            <div className="relative">
              <select
                value={selectedDeptId}
                onChange={(e) => setSelectedDeptId(e.target.value)}
                className={cn(
                  "appearance-none px-3 sm:px-6 py-2 sm:py-3 pr-8 sm:pr-12 text-xs sm:text-base border-2 rounded-lg sm:rounded-xl font-semibold shadow-lg cursor-pointer transition-all",
                  isDarkMode
                    ? "bg-slate-800 border-orange-500/50 text-white hover:border-orange-500"
                    : "bg-white border-orange-500 text-slate-900 hover:border-orange-600",
                )}
              >
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={16}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-1.5 sm:gap-3 mb-3 sm:mb-6">
          <TabButton
            label="Courses"
            value="courses"
            icon={BookOpen}
            count={deptCourses.length}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            label="Lecturers"
            value="lecturers"
            icon={UserPlus}
            count={deptLecturers.length}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <TabButton
            label="Students"
            value="students"
            icon={GraduationCap}
            count={deptStudents.length}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Search and Add Bar */}
        <div
          className={cn(
            "rounded-lg sm:rounded-xl p-2 sm:p-4 mb-3 sm:mb-6 shadow-md border transition-colors",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200",
          )}
        >
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search
                className={cn(
                  "absolute left-2 sm:left-4 top-1/2 -translate-y-1/2",
                  isDarkMode ? "text-slate-500" : "text-slate-400",
                )}
                size={14}
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn(
                  "w-full pl-7 sm:pl-12 pr-2 sm:pr-4 py-1.5 sm:py-3 text-xs sm:text-base border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                    : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400",
                )}
              />
            </div>
            <button
              onClick={() =>
                openAddModal(
                  activeTab === "courses" ? "course" : activeTab.slice(0, -1),
                )
              }
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-3 text-xs sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap w-full sm:w-auto justify-center"
            >
              <Plus size={14} className="sm:w-5 sm:h-5" />
              <span className="hidden xs:inline">
                Add{" "}
                {activeTab === "courses" ? "Course" : activeTab.slice(0, -1)}
              </span>
              <span className="xs:hidden">Add</span>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={cn(
            "rounded-lg sm:rounded-xl shadow-lg border overflow-hidden transition-colors",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-slate-200",
          )}
        >
          {/* Courses Table */}
          {activeTab === "courses" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={cn(
                      "border-b transition-colors",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200",
                    )}
                  >
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Course Code
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden sm:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Course Title
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-right font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptCourses, "course").length === 0 ? (
                    <tr>
                      <td
                        colSpan="3"
                        className="py-8 sm:py-12 text-center text-slate-400"
                      >
                        <BookOpen
                          className="mx-auto mb-2 sm:mb-3 opacity-50"
                          size={32}
                        />
                        <p className="text-xs sm:text-base">No courses found</p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptCourses, "course").map((course, idx) => (
                      <motion.tr
                        key={course._id || course}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className={cn(
                          "border-b transition-colors",
                          isDarkMode
                            ? "border-slate-800 hover:bg-slate-800/50"
                            : "border-slate-100 hover:bg-orange-50/30",
                        )}
                      >
                        <td className="py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-base font-semibold">
                          <div
                            className={
                              isDarkMode ? "text-orange-400" : "text-blue-900"
                            }
                          >
                            {course.courseCode || course}
                          </div>
                          <div
                            className={cn(
                              "sm:hidden text-[10px] mt-0.5",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {course.courseTitle || ""}
                          </div>
                        </td>
                        <td
                          className={cn(
                            "py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-base hidden sm:table-cell",
                            isDarkMode ? "text-slate-300" : "text-slate-700",
                          )}
                        >
                          {course.courseTitle || ""}
                        </td>
                        <td className="py-2 sm:py-4 px-2 sm:px-6 text-right">
                          <button
                            className={cn(
                              "p-1 sm:p-2 rounded-lg transition-colors inline-flex items-center justify-center",
                              isDarkMode
                                ? "text-red-400 hover:bg-red-500/20"
                                : "text-red-600 hover:bg-red-50",
                            )}
                            onClick={() =>
                              handleRemoveAssignee(
                                "course",
                                course._id || course,
                              )
                            }
                            title="Remove course"
                          >
                            <Trash2
                              size={14}
                              className="sm:w-[18px] sm:h-[18px]"
                            />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Lecturers Table */}
          {activeTab === "lecturers" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={cn(
                      "border-b transition-colors",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200",
                    )}
                  >
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Name
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden md:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Email
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden sm:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Level
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-right font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptLecturers, "lecturer").length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 sm:py-12 text-center text-slate-400"
                      >
                        <UserPlus
                          className="mx-auto mb-2 sm:mb-3 opacity-50"
                          size={32}
                        />
                        <p className="text-xs sm:text-base">
                          No lecturers found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptLecturers, "lecturer").map(
                      (lecturer, idx) => (
                        <motion.tr
                          key={lecturer._id || lecturer}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "border-b transition-colors",
                            isDarkMode
                              ? "border-slate-800 hover:bg-slate-800/50"
                              : "border-slate-100 hover:bg-orange-50/30",
                          )}
                        >
                          <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-xs sm:text-base">
                            <div
                              className={
                                isDarkMode ? "text-orange-400" : "text-blue-900"
                              }
                            >
                              {lecturer.fullname || lecturer}
                            </div>
                            <div
                              className={cn(
                                "md:hidden text-[10px] mt-0.5 truncate max-w-[120px]",
                                isDarkMode
                                  ? "text-slate-400"
                                  : "text-slate-500",
                              )}
                            >
                              {lecturer.email || ""}
                            </div>
                          </td>
                          <td
                            className={cn(
                              "py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-base hidden md:table-cell truncate max-w-[150px]",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {lecturer.email || ""}
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-6 hidden sm:table-cell">
                            <span
                              className={cn(
                                "inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold transition-colors",
                                isDarkMode
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-orange-100 text-orange-800",
                              )}
                            >
                              {lecturer.level || "-"}
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-6 text-right">
                            <div className="flex gap-1 sm:gap-2 justify-end">
                              <button
                                className={cn(
                                  "p-1 sm:p-2 rounded-lg transition-colors",
                                  isDarkMode
                                    ? "text-blue-400 hover:bg-blue-500/20"
                                    : "text-blue-900 hover:bg-blue-50",
                                )}
                                onClick={() =>
                                  handleEditLevel("lecturer", lecturer)
                                }
                                title="Edit level"
                              >
                                <Edit2
                                  size={14}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                              <button
                                className={cn(
                                  "p-1 sm:p-2 rounded-lg transition-colors",
                                  isDarkMode
                                    ? "text-red-400 hover:bg-red-500/20"
                                    : "text-red-600 hover:bg-red-50",
                                )}
                                onClick={() =>
                                  handleRemoveAssignee(
                                    "lecturer",
                                    lecturer._id || lecturer,
                                  )
                                }
                                title="Remove lecturer"
                              >
                                <Trash2
                                  size={14}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Students Table */}
          {activeTab === "students" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr
                    className={cn(
                      "border-b transition-colors",
                      isDarkMode
                        ? "bg-slate-800/50 border-slate-700"
                        : "bg-gradient-to-r from-slate-100 to-slate-50 border-slate-200",
                    )}
                  >
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Name
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden lg:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Email
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden md:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Matric Number
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-left font-bold text-xs sm:text-base hidden sm:table-cell",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Level
                    </th>
                    <th
                      className={cn(
                        "py-2 sm:py-4 px-2 sm:px-6 text-right font-bold text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptStudents, "student").length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 sm:py-12 text-center text-slate-400"
                      >
                        <GraduationCap
                          className="mx-auto mb-2 sm:mb-3 opacity-50"
                          size={32}
                        />
                        <p className="text-xs sm:text-base">
                          No students found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptStudents, "student").map(
                      (student, idx) => (
                        <motion.tr
                          key={student._id || student}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={cn(
                            "border-b transition-colors",
                            isDarkMode
                              ? "border-slate-800 hover:bg-slate-800/50"
                              : "border-slate-100 hover:bg-orange-50/30",
                          )}
                        >
                          <td className="py-2 sm:py-4 px-2 sm:px-6 font-semibold text-xs sm:text-base">
                            <div
                              className={
                                isDarkMode ? "text-orange-400" : "text-blue-900"
                              }
                            >
                              {student.fullname || student}
                            </div>
                            <div
                              className={cn(
                                "lg:hidden text-[10px] mt-0.5 truncate max-w-[100px]",
                                isDarkMode
                                  ? "text-slate-400"
                                  : "text-slate-500",
                              )}
                            >
                              {student.email || ""}
                            </div>
                          </td>
                          <td
                            className={cn(
                              "py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-base hidden lg:table-cell truncate max-w-[150px]",
                              isDarkMode ? "text-slate-400" : "text-slate-600",
                            )}
                          >
                            {student.email || ""}
                          </td>
                          <td
                            className={cn(
                              "py-2 sm:py-4 px-2 sm:px-6 text-xs sm:text-base hidden md:table-cell",
                              isDarkMode ? "text-slate-300" : "text-slate-700",
                            )}
                          >
                            {student.matricNumber || ""}
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-6 hidden sm:table-cell">
                            <span
                              className={cn(
                                "inline-block px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm font-semibold transition-colors",
                                isDarkMode
                                  ? "bg-orange-500/20 text-orange-400"
                                  : "bg-orange-100 text-orange-800",
                              )}
                            >
                              {student.level || "-"}
                            </span>
                          </td>
                          <td className="py-2 sm:py-4 px-2 sm:px-6 text-right">
                            <div className="flex gap-1 sm:gap-2 justify-end">
                              <button
                                className={cn(
                                  "p-1 sm:p-2 rounded-lg transition-colors",
                                  isDarkMode
                                    ? "text-blue-400 hover:bg-blue-500/20"
                                    : "text-blue-900 hover:bg-blue-50",
                                )}
                                onClick={() =>
                                  handleEditLevel("student", student)
                                }
                                title="Edit level"
                              >
                                <Edit2
                                  size={14}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                              <button
                                className={cn(
                                  "p-1 sm:p-2 rounded-lg transition-colors",
                                  isDarkMode
                                    ? "text-red-400 hover:bg-red-500/20"
                                    : "text-red-600 hover:bg-red-50",
                                )}
                                onClick={() =>
                                  handleRemoveAssignee(
                                    "student",
                                    student._id || student,
                                  )
                                }
                                title="Remove student"
                              >
                                <Trash2
                                  size={14}
                                  className="sm:w-[18px] sm:h-[18px]"
                                />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ),
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditData(null);
                setModalType("");
                setLevelInput("");
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl sm:rounded-2xl p-4 sm:p-8 w-full max-w-md border-2 shadow-2xl transition-colors",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent">
                    {editData
                      ? `Edit Level`
                      : `Add ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditData(null);
                      setModalType("");
                      setLevelInput("");
                    }}
                    className={cn(
                      "transition-colors p-1 rounded-lg",
                      isDarkMode
                        ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                        : "text-slate-400 hover:text-slate-900 hover:bg-slate-100",
                    )}
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>

                {editData ? (
                  <div>
                    <label
                      className={cn(
                        "block mb-2 sm:mb-3 font-semibold text-sm sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Level
                    </label>
                    <input
                      type="number"
                      value={levelInput}
                      onChange={(e) => setLevelInput(e.target.value)}
                      min={100}
                      max={900}
                      step={100}
                      placeholder="Enter level (100-900)"
                      className={cn(
                        "w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500"
                          : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400",
                      )}
                    />
                    <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
                      <button
                        onClick={handleSaveLevel}
                        className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg sm:rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setEditData(null);
                          setLevelInput("");
                        }}
                        className={cn(
                          "px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-xl font-semibold transition-colors",
                          isDarkMode
                            ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                        )}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      className={cn(
                        "block mb-2 sm:mb-3 font-semibold text-sm sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Select{" "}
                      {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
                    </label>
                    <select
                      className={cn(
                        "w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-slate-50 border-slate-200 text-slate-900",
                      )}
                      onChange={async (e) => {
                        if (e.target.value) {
                          await handleAddAssignee(modalType, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">Select...</option>
                      {(modalType === "course"
                        ? courses
                        : modalType === "lecturer"
                          ? lecturers
                          : students
                      )
                        .filter((item) => {
                          const field = `${modalType}s`;
                          const assignedIds = (department?.[field] || []).map(
                            (i) => (typeof i === "string" ? i : i._id),
                          );
                          return !assignedIds.includes(item._id);
                        })
                        .map((item) => (
                          <option key={item._id} value={item._id}>
                            {modalType === "course"
                              ? `${item.courseCode} - ${item.courseTitle}`
                              : modalType === "lecturer"
                                ? item.fullname
                                : `${item.fullname} (${item.matricNumber})`}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Assignees;
