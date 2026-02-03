/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import {
  useCreateDepartmentAction,
  useGetAllDepartmentsAction,
  useDeleteDepartmentAction,
} from "../../../store/department-store";
import DeleteModal from "../../../components/Delete-modal";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import SuggestibleSearchInput from "../../../components/SuggestibleSearchInput";
import { faculties } from "../../../core/data/faculty-mock-data";
import {
  departmentsByFaculty,
  allDepartments,
} from "../../../core/data/department-mock-data";

const initialForm = {
  departmentName: "",
  departmentCode: "",
  departmentId: "",
  faculty: "",
  description: "",
  levels: "",
};

const CreateDepartment = () => {
  const { isDarkMode } = useThemeStore();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editing, setEditing] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState(null);

  const { createDepartment } = useCreateDepartmentAction();
  const { departments = [], refetch, isLoading } = useGetAllDepartmentsAction();
  const { deleteDepartment } = useDeleteDepartmentAction();

  useEffect(() => {
    if (refetch) refetch();
  }, []);

  const handleAddOrEdit = async () => {
    const payload = {
      ...formData,
      levels: formData.levels
        ? formData.levels.split(",").map((l) => ({
            level: parseInt(l.trim()),
            description: `${l.trim()} Level`,
          }))
        : [],
    };
    try {
      if (editing) {
        // Editing handled in EditDepartment page
      } else {
        await createDepartment(payload);
      }
      if (refetch) refetch();
      setShowModal(false);
      setEditing(null);
      setFormData(initialForm);
    } catch (err) {
      // error handled by store
    }
  };

  const handleEdit = (dept) => {
    setEditing(dept);
    setFormData({
      departmentName: dept.departmentName || "",
      departmentCode: dept.departmentCode || "",
      departmentId: dept.departmentId || "",
      faculty: dept.faculty || "",
      description: dept.description || "",
      levels: Array.isArray(dept.levels)
        ? dept.levels.map((l) => l.level).join(", ")
        : "",
    });
    setShowModal(true);
  };

  const handleDelete = async (dept) => {
    setDeptToDelete(dept);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deptToDelete) return;
    try {
      await deleteDepartment(deptToDelete._id);
      if (refetch) refetch();
      setDeleteModalOpen(false);
      setDeptToDelete(null);
    } catch (err) {
      // error handled by store
    }
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
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <div className="mb-4 sm:mb-8">
          <h1
            className={cn(
              "text-xl sm:text-3xl font-bold mb-1 sm:mb-2",
              isDarkMode ? "text-white" : "text-slate-900",
            )}
          >
            Departments Management
          </h1>
          <p
            className={cn(
              "text-xs sm:text-base",
              isDarkMode ? "text-slate-400" : "text-gray-600",
            )}
          >
            Create and manage academic departments
          </p>
        </div>

        {/* Actions Bar */}
        <div
          className={cn(
            "rounded-xl p-2 sm:p-4 mb-4 sm:mb-6 border flex items-center justify-between",
            isDarkMode
              ? "bg-slate-900/50 border-slate-800"
              : "bg-slate-50 border-slate-200",
          )}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setShowModal(true);
              setEditing(null);
              setFormData(initialForm);
            }}
            className="flex items-center gap-1 sm:gap-2 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors"
          >
            <Plus size={16} className="sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Add Department</span>
            <span className="sm:hidden">Add</span>
          </motion.button>
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
                    Name
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden sm:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Code
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden md:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    ID
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Faculty
                  </th>
                  <th
                    className={cn(
                      "text-left px-3 sm:px-6 py-2 sm:py-4 font-semibold text-xs sm:text-base hidden lg:table-cell",
                      isDarkMode ? "text-slate-300" : "text-slate-700",
                    )}
                  >
                    Levels
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
                {departments.map((dept) => (
                  <tr
                    key={dept._id}
                    className={cn(
                      "border-b transition-colors",
                      isDarkMode
                        ? "border-slate-800 hover:bg-slate-800/30"
                        : "border-slate-100 hover:bg-slate-50",
                    )}
                  >
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div
                        className={cn(
                          "font-medium text-[10px] sm:text-base max-w-[100px] sm:max-w-none truncate",
                          isDarkMode ? "text-white" : "text-slate-900",
                        )}
                      >
                        {dept.departmentName}
                      </div>
                      <div
                        className={cn(
                          "sm:hidden text-[9px] mt-0.5",
                          isDarkMode ? "text-slate-400" : "text-slate-500",
                        )}
                      >
                        {dept.departmentCode}
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-2 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-base hidden sm:table-cell",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      {dept.departmentCode}
                    </td>
                    <td
                      className={cn(
                        "px-2 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-base hidden md:table-cell",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      {dept.departmentId}
                    </td>
                    <td
                      className={cn(
                        "px-2 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-base hidden lg:table-cell",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      <div className="max-w-[120px] truncate">
                        {dept.faculty}
                      </div>
                    </td>
                    <td
                      className={cn(
                        "px-2 sm:px-6 py-2 sm:py-4 text-[10px] sm:text-base hidden lg:table-cell",
                        isDarkMode ? "text-slate-400" : "text-slate-600",
                      )}
                    >
                      {Array.isArray(dept.levels)
                        ? dept.levels.map((l) => l.level).join(", ")
                        : ""}
                    </td>
                    <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <div className="flex gap-1 sm:gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleEdit(dept)}
                          className={cn(
                            "p-1 sm:p-2 rounded-lg transition-colors",
                            isDarkMode
                              ? "hover:bg-blue-500/20 text-blue-400"
                              : "hover:bg-blue-100 text-blue-900",
                          )}
                        >
                          <Edit2
                            size={14}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(dept)}
                          className={cn(
                            "p-1 sm:p-2 rounded-lg transition-colors",
                            isDarkMode
                              ? "hover:bg-red-500/20 text-red-400"
                              : "hover:bg-red-100 text-red-600",
                          )}
                        >
                          <Trash2
                            size={14}
                            className="sm:w-[18px] sm:h-[18px]"
                          />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                ))}
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
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-3 sm:p-4 z-50"
              onClick={() => {
                setShowModal(false);
                setEditing(null);
                setFormData(initialForm);
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  "rounded-xl p-4 sm:p-6 w-full max-w-md border shadow-xl max-h-[90vh] overflow-y-auto",
                  isDarkMode
                    ? "bg-slate-900 border-slate-800"
                    : "bg-white border-slate-200",
                )}
              >
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2
                    className={cn(
                      "text-lg sm:text-2xl font-bold",
                      isDarkMode ? "text-white" : "text-slate-900",
                    )}
                  >
                    {editing ? "Edit Department" : "Add New Department"}
                  </h2>
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditing(null);
                      setFormData(initialForm);
                    }}
                    className="text-gray-400 hover:text-slate-900 transition-colors"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  <SuggestibleSearchInput
                    label="Department Name"
                    value={formData.departmentName}
                    onChange={(val) =>
                      setFormData({
                        ...formData,
                        departmentName: val,
                      })
                    }
                    suggestions={
                      formData.faculty
                        ? departmentsByFaculty[formData.faculty] || []
                        : allDepartments
                    }
                    placeholder="Enter or select department name"
                  />
                  <div>
                    <label
                      className={cn(
                        "block mb-1 sm:mb-2 font-medium text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Department Code
                      <span className="ml-2 text-xs text-gray-400">
                        (auto-generated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.departmentCode}
                      disabled
                      className={cn(
                        "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg cursor-not-allowed",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700 text-slate-500"
                          : "bg-gray-100 border-slate-300 text-slate-400",
                      )}
                      placeholder="Will be generated"
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block mb-1 sm:mb-2 font-medium text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Department ID
                      <span className="ml-2 text-xs text-gray-400">
                        (auto-generated)
                      </span>
                    </label>
                    <input
                      type="text"
                      value={formData.departmentId}
                      disabled
                      className={cn(
                        "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg cursor-not-allowed",
                        isDarkMode
                          ? "bg-slate-800/50 border-slate-700 text-slate-500"
                          : "bg-gray-100 border-slate-300 text-slate-400",
                      )}
                      placeholder="Will be generated"
                    />
                  </div>
                  <SuggestibleSearchInput
                    label="Faculty"
                    value={formData.faculty}
                    onChange={(val) =>
                      setFormData({ ...formData, faculty: val })
                    }
                    suggestions={faculties}
                    placeholder="e.g. Science"
                  />
                  <div>
                    <label
                      className={cn(
                        "block mb-1 sm:mb-2 font-medium text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Levels
                    </label>
                    <input
                      type="text"
                      value={formData.levels}
                      onChange={(e) =>
                        setFormData({ ...formData, levels: e.target.value })
                      }
                      className={cn(
                        "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                      placeholder="e.g. 100, 200, 300, 400"
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block mb-1 sm:mb-2 font-medium text-xs sm:text-base",
                        isDarkMode ? "text-slate-300" : "text-slate-700",
                      )}
                    >
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className={cn(
                        "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
                          : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
                      )}
                      placeholder="Department description"
                    />
                  </div>
                  <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddOrEdit}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors"
                    >
                      {editing ? "Update" : "Add"}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setShowModal(false);
                        setEditing(null);
                        setFormData(initialForm);
                      }}
                      className={cn(
                        "flex-1 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-base font-medium transition-colors",
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
      </motion.div>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeptToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Department"
        message="Are you sure you want to delete this department?"
        itemName={deptToDelete?.departmentName}
      />
    </div>
  );
};

export default CreateDepartment;
