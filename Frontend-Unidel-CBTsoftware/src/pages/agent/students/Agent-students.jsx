import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  UserPlus,
  Mail,
  Phone,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useAgentStudents,
  useCreateAgentStudent,
  useUpdateAgentStudent,
  useDeleteAgentStudent,
} from "../../../hooks/useAgent";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import SuggestibleSearchInput from "../../../components/SuggestibleSearchInput";
import { allFaculties } from "../../../core/data/faculty-mock-data";
import {
  departmentsByFaculty,
  allDepartments,
} from "../../../core/data/department-mock-data";
import DeleteModal from "../../../components/Delete-modal";
import { toast } from "react-hot-toast";

const AgentStudents = () => {
  const { isDarkMode } = useThemeStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    faculty: "",
    department: "",
  });

  const { data: students = [], isLoading } = useAgentStudents();
  const createMutation = useCreateAgentStudent();
  const updateMutation = useUpdateAgentStudent();
  const deleteMutation = useDeleteAgentStudent();

  const filteredStudents = students.filter(
    (s) =>
      s.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenAddModal = () => {
    setFormData({
      fullname: "",
      email: "",
      phoneNumber: "",
      password: "",
      faculty: "",
      department: "",
    });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleOpenEditModal = (student) => {
    setSelectedStudent(student);
    setFormData({
      fullname: student.fullname,
      email: student.email,
      phoneNumber: student.phoneNumber || "",
      password: "", // Don't show password
      faculty: student.faculty || "",
      department: student.department || "",
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          id: selectedStudent._id,
          data: formData,
        });
        toast.success("Student updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Student recruited successfully");
      }
      setShowModal(false);
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(studentToDelete._id);
      toast.success("Student removed successfully");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete student");
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-[1600px] mx-auto">
        <header className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-1",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Student Recruitment
            </h1>
            <p
              className={cn(
                "text-sm sm:text-base",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            >
              Add and manage students you've recruited.
            </p>
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <UserPlus size={18} />
            <span>Recruit New Student</span>
          </button>
        </header>

        <div
          className={cn(
            "mb-6 relative max-w-md",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search recruits..."
            className={cn(
              "w-full pl-10 pr-4 py-2 rounded-xl border outline-none transition-all",
              isDarkMode
                ? "bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-blue-500"
                : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500",
            )}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div
          className={cn(
            "rounded-2xl border shadow-sm overflow-hidden",
            isDarkMode
              ? "bg-slate-900 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr
                  className={cn(
                    "border-b",
                    isDarkMode
                      ? "bg-slate-800/50 border-slate-800"
                      : "bg-gray-50/50 border-gray-100",
                  )}
                >
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Full Name
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Faculty/Dept
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                {isLoading ? (
                  Array(5)
                    .fill(0)
                    .map((_, idx) => (
                      <tr key={idx}>
                        <td colSpan="4" className="px-6 py-4">
                          <Skeleton
                            height={24}
                            baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                          />
                        </td>
                      </tr>
                    ))
                ) : filteredStudents.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No students found. Start recruiting!
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student._id}
                      className={cn(
                        "transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800/30"
                          : "hover:bg-gray-50",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {student.fullname}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.phoneNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-400">
                        {student.email}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.faculty}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.department}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(student)}
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => {
                              setStudentToDelete(student);
                              setShowDeleteModal(true);
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recruitment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={cn(
                "w-full max-w-2xl rounded-2xl shadow-2xl p-6",
                isDarkMode ? "bg-slate-900" : "bg-white",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {isEditing ? "Edit Recruit Info" : "Recruit New Student"}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? "text-slate-400" : "text-gray-700",
                      )}
                    >
                      Full Name
                    </label>
                    <input
                      required
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border outline-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900",
                      )}
                      value={formData.fullname}
                      onChange={(e) =>
                        setFormData({ ...formData, fullname: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? "text-slate-400" : "text-gray-700",
                      )}
                    >
                      Email Address
                    </label>
                    <input
                      required
                      type="email"
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border outline-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900",
                      )}
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-1",
                        isDarkMode ? "text-slate-400" : "text-gray-700",
                      )}
                    >
                      Phone Number
                    </label>
                    <input
                      className={cn(
                        "w-full px-4 py-2 rounded-lg border outline-none",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200 text-gray-900",
                      )}
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  {!isEditing && (
                    <div>
                      <label
                        className={cn(
                          "block text-sm font-medium mb-1",
                          isDarkMode ? "text-slate-400" : "text-gray-700",
                        )}
                      >
                        Account Password
                      </label>
                      <input
                        required
                        type="password"
                        className={cn(
                          "w-full px-4 py-2 rounded-lg border outline-none",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-gray-50 border-gray-200 text-gray-900",
                        )}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SuggestibleSearchInput
                    label="Faculty"
                    value={formData.faculty}
                    onChange={(val) =>
                      setFormData({ ...formData, faculty: val, department: "" })
                    }
                    suggestions={allFaculties}
                  />
                  <SuggestibleSearchInput
                    label="Department"
                    value={formData.department}
                    onChange={(val) =>
                      setFormData({ ...formData, department: val })
                    }
                    suggestions={
                      formData.faculty
                        ? departmentsByFaculty[formData.faculty] || []
                        : allDepartments
                    }
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className={cn(
                      "px-6 py-2 rounded-lg font-medium",
                      isDarkMode
                        ? "text-white hover:bg-slate-800"
                        : "text-gray-700 hover:bg-gray-100",
                    )}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending || updateMutation.isPending
                    }
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isEditing ? "Save Changes" : "Recruit Student"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Remove Recruit"
        message={`Are you sure you want to remove ${studentToDelete?.fullname} from your recruits? This will not delete their account, but you will no longer manage them.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
};

export default AgentStudents;
