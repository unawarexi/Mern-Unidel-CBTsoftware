/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, BookOpen, GraduationCap, Edit2, Trash2, Plus, X, Search, ChevronDown } from "lucide-react";
import {
  useGetAllDepartmentsAction,
  useGetDepartmentByIdAction,
  useUpdateDepartmentAction,
} from "../../../../store/department-store";
import {
  useGetAllLecturersAction,
  useUpdateLecturerAction,
  useGetAllStudentsAction,
  useUpdateStudentAction,
} from "../../../../store/user-store";
import { useGetAllCoursesAction } from "../../../../store/course-store";

const TabButton = ({ label, value, icon: Icon, count, activeTab, setActiveTab }) => (
  <button
    onClick={() => setActiveTab(value)}
    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === value ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"}`}
  >
    <Icon size={20} />
    {label}
    <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === value ? "bg-white/20" : "bg-slate-100"}`}>{count}</span>
  </button>
);

const Assignees = () => {
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
    const currentIds = (department[field] || []).map((item) => (typeof item === "string" ? item : item._id));
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
      [field]: (department[field] || []).map((item) => (typeof item === "string" ? item : item._id)).filter((itemId) => itemId !== id),
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
        return item.courseCode?.toLowerCase().includes(searchLower) || item.courseTitle?.toLowerCase().includes(searchLower);
      } else if (type === "lecturer" || type === "student") {
        return item.fullname?.toLowerCase().includes(searchLower) || item.email?.toLowerCase().includes(searchLower) || item.matricNumber?.toLowerCase().includes(searchLower);
      }
      return false;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-2xl p-8 mb-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Department Assignees</h1>
              <p className="text-blue-200">Manage courses, lecturers, and students</p>
            </div>
            <div className="relative">
              <select value={selectedDeptId} onChange={(e) => setSelectedDeptId(e.target.value)} className="appearance-none px-6 py-3 pr-12 bg-white border-2 border-orange-500 rounded-xl text-slate-900 font-semibold shadow-lg cursor-pointer hover:border-orange-600 transition-colors min-w-[250px]">
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-3 mb-6">
          <TabButton label="Courses" value="courses" icon={BookOpen} count={deptCourses.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Lecturers" value="lecturers" icon={UserPlus} count={deptLecturers.length} activeTab={activeTab} setActiveTab={setActiveTab} />
          <TabButton label="Students" value="students" icon={GraduationCap} count={deptStudents.length} activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Search and Add Bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-md border border-slate-200">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => openAddModal(activeTab === "courses" ? "course" : activeTab.slice(0, -1))}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
            >
              <Plus size={20} />
              Add {activeTab === "courses" ? "Course" : activeTab.slice(0, -1)}
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
          {/* Courses Table */}
          {activeTab === "courses" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Course Code</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Course Title</th>
                    <th className="py-4 px-6 text-right font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptCourses, "course").length === 0 ? (
                    <tr>
                      <td colSpan="3" className="py-12 text-center text-slate-400">
                        <BookOpen className="mx-auto mb-3 opacity-50" size={48} />
                        <p>No courses found</p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptCourses, "course").map((course, idx) => (
                      <motion.tr key={course._id || course} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-900">{course.courseCode || course}</td>
                        <td className="py-4 px-6 text-slate-700">{course.courseTitle || ""}</td>
                        <td className="py-4 px-6 text-right">
                          <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors inline-flex items-center justify-center" onClick={() => handleRemoveAssignee("course", course._id || course)} title="Remove course">
                            <Trash2 size={18} />
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
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Name</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Email</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Level</th>
                    <th className="py-4 px-6 text-right font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptLecturers, "lecturer").length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-slate-400">
                        <UserPlus className="mx-auto mb-3 opacity-50" size={48} />
                        <p>No lecturers found</p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptLecturers, "lecturer").map((lecturer, idx) => (
                      <motion.tr key={lecturer._id || lecturer} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-900">{lecturer.fullname || lecturer}</td>
                        <td className="py-4 px-6 text-slate-600">{lecturer.email || ""}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">{lecturer.level || "-"}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors" onClick={() => handleEditLevel("lecturer", lecturer)} title="Edit level">
                              <Edit2 size={18} />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" onClick={() => handleRemoveAssignee("lecturer", lecturer._id || lecturer)} title="Remove lecturer">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
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
                  <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Name</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Email</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Matric Number</th>
                    <th className="py-4 px-6 text-left font-bold text-slate-700">Level</th>
                    <th className="py-4 px-6 text-right font-bold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filterBySearch(deptStudents, "student").length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-slate-400">
                        <GraduationCap className="mx-auto mb-3 opacity-50" size={48} />
                        <p>No students found</p>
                      </td>
                    </tr>
                  ) : (
                    filterBySearch(deptStudents, "student").map((student, idx) => (
                      <motion.tr key={student._id || student} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className="border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
                        <td className="py-4 px-6 font-semibold text-blue-900">{student.fullname || student}</td>
                        <td className="py-4 px-6 text-slate-600">{student.email || ""}</td>
                        <td className="py-4 px-6 text-slate-700">{student.matricNumber || ""}</td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-semibold">{student.level || "-"}</span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-2 justify-end">
                            <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-900 transition-colors" onClick={() => handleEditLevel("student", student)} title="Edit level">
                              <Edit2 size={18} />
                            </button>
                            <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors" onClick={() => handleRemoveAssignee("student", student._id || student)} title="Remove student">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
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
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditData(null);
                setModalType("");
                setLevelInput("");
              }}
            >
              <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-8 w-full max-w-md border-2 border-slate-200 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-blue-900 bg-clip-text text-transparent">{editData ? `Edit Level` : `Add ${modalType.charAt(0).toUpperCase() + modalType.slice(1)}`}</h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditData(null);
                      setModalType("");
                      setLevelInput("");
                    }}
                    className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-lg"
                  >
                    <X size={24} />
                  </button>
                </div>

                {editData ? (
                  <div>
                    <label className="block mb-3 font-semibold text-slate-700">Level</label>
                    <input
                      type="number"
                      value={levelInput}
                      onChange={(e) => setLevelInput(e.target.value)}
                      min={100}
                      max={900}
                      step={100}
                      placeholder="Enter level (100-900)"
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <div className="flex gap-3 mt-6">
                      <button onClick={handleSaveLevel} className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg">
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          setEditData(null);
                          setLevelInput("");
                        }}
                        className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block mb-3 font-semibold text-slate-700">Select {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</label>
                    <select
                      className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent cursor-pointer"
                      onChange={async (e) => {
                        if (e.target.value) {
                          await handleAddAssignee(modalType, e.target.value);
                        }
                      }}
                      defaultValue=""
                    >
                      <option value="">Select...</option>
                      {(modalType === "course" ? courses : modalType === "lecturer" ? lecturers : students)
                        .filter((item) => {
                          const field = `${modalType}s`;
                          const assignedIds = (department?.[field] || []).map((i) => (typeof i === "string" ? i : i._id));
                          return !assignedIds.includes(item._id);
                        })
                        .map((item) => (
                          <option key={item._id} value={item._id}>
                            {modalType === "course" ? `${item.courseCode} - ${item.courseTitle}` : modalType === "lecturer" ? item.fullname : `${item.fullname} (${item.matricNumber})`}
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
