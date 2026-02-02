import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Calendar,
  CalendarDays,
  CalendarRange,
  BookOpen,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
// TODO: Add semester hooks to admin-content-store once backend is ready
// import {
//   useGetAllSemestersAction,
//   useCreateSemesterAction,
//   useUpdateSemesterAction,
//   useDeleteSemesterAction,
// } from "../../../store/admin-content-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import DeleteModal from "../../../components/Delete-modal";

// Temporary mock hooks until backend integration is complete
const useGetAllSemestersAction = () => ({
  semesters: [],
  isLoading: false,
  refetch: () => Promise.resolve(),
});

const useCreateSemesterAction = () => ({
  createSemester: async (data) => {
    console.log("TODO: Implement createSemester", data);
    return data;
  },
});

const useUpdateSemesterAction = () => ({
  updateSemester: async (id, data) => {
    console.log("TODO: Implement updateSemester", { id, data });
    return data;
  },
});

const useDeleteSemesterAction = () => ({
  deleteSemester: async (id) => {
    console.log("TODO: Implement deleteSemester", id);
    return true;
  },
});

const Semesters = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSemester, setEditingSemester] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [semesterToDelete, setSemesterToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    session: "",
    type: "first",
    startDate: "",
    endDate: "",
  });

  const { semesters = [], isLoading, refetch } = useGetAllSemestersAction();

  const { createSemester } = useCreateSemesterAction();
  const { updateSemester } = useUpdateSemesterAction();
  const { deleteSemester } = useDeleteSemesterAction();

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSemester) {
        await updateSemester(editingSemester._id, formData);
      } else {
        await createSemester(formData);
      }
      setShowModal(false);
      setEditingSemester(null);
      setFormData({
        name: "",
        session: "",
        type: "first",
        startDate: "",
        endDate: "",
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (semester) => {
    setEditingSemester(semester);
    setFormData({
      name: semester.name || "",
      session: semester.session || "",
      type: semester.type || "first",
      startDate: semester.startDate?.split("T")[0] || "",
      endDate: semester.endDate?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleDelete = (semester) => {
    setSemesterToDelete(semester);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!semesterToDelete) return;
    try {
      await deleteSemester(semesterToDelete._id);
      setDeleteModalOpen(false);
      setSemesterToDelete(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const activeSemester = semesters.find((s) => s.isActive || s.isCurrent);
  const firstSemesters = semesters.filter((s) => s.type === "first");
  const secondSemesters = semesters.filter((s) => s.type === "second");

  const actions = (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowModal(true)}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
          "bg-orange-500 text-white hover:bg-orange-600",
        )}
      >
        <Plus className="w-4 h-4" />
        <span className="hidden sm:inline">Add Semester</span>
      </button>
      <button
        onClick={handleRefresh}
        disabled={refreshing}
        className={cn(
          "p-2 rounded-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-slate-400 hover:text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200",
        )}
      >
        <RefreshCw className={cn("w-5 h-5", refreshing && "animate-spin")} />
      </button>
    </div>
  );

  return (
    <AdminPage
      title="Semesters"
      subtitle="Manage academic semesters"
      icon={AdminIcons.Calendar}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Semesters"
            value={semesters.length}
            subtitle="All time"
            icon={CalendarRange}
            color="blue"
          />
          <AdminStatCard
            label="Active"
            value={activeSemester?.name || "None"}
            subtitle="Current semester"
            icon={CheckCircle}
            color="green"
          />
          <AdminStatCard
            label="First Semesters"
            value={firstSemesters.length}
            subtitle="First semester count"
            icon={CalendarDays}
            color="purple"
          />
          <AdminStatCard
            label="Second Semesters"
            value={secondSemesters.length}
            subtitle="Second semester count"
            icon={CalendarDays}
            color="orange"
          />
        </div>

        {/* Semesters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={150}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))
          ) : semesters.length === 0 ? (
            <div
              className={cn(
                "col-span-full text-center py-16 rounded-2xl",
                isDarkMode ? "bg-slate-800/30" : "bg-gray-50",
              )}
            >
              <Calendar
                className={cn(
                  "w-12 h-12 mx-auto mb-4",
                  isDarkMode ? "text-slate-600" : "text-gray-300",
                )}
              />
              <p className={isDarkMode ? "text-slate-400" : "text-gray-500"}>
                No semesters found
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
              >
                Create your first semester
              </button>
            </div>
          ) : (
            semesters.map((semester, idx) => (
              <motion.div
                key={semester._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all relative overflow-hidden",
                  semester.isActive || semester.isCurrent
                    ? isDarkMode
                      ? "bg-orange-500/10 border-orange-500/30"
                      : "bg-orange-50 border-orange-200"
                    : isDarkMode
                      ? "bg-slate-800/30 border-slate-700/50"
                      : "bg-white border-gray-100",
                )}
              >
                {(semester.isActive || semester.isCurrent) && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full font-medium">
                      Active
                    </span>
                  </div>
                )}

                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                      semester.type === "first"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-purple-100 text-purple-600",
                    )}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={cn(
                        "font-semibold truncate",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {semester.name}
                    </h3>
                    <p
                      className={cn(
                        "text-sm capitalize",
                        isDarkMode ? "text-slate-400" : "text-gray-500",
                      )}
                    >
                      {semester.type} Semester
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-2",
                        isDarkMode ? "text-slate-500" : "text-gray-400",
                      )}
                    >
                      {formatDate(semester.startDate)} -{" "}
                      {formatDate(semester.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(semester)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                      isDarkMode
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700",
                    )}
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(semester)}
                    className={cn(
                      "p-2 rounded-xl transition-colors",
                      isDarkMode
                        ? "hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                        : "hover:bg-red-100 text-gray-500 hover:text-red-600",
                    )}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

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
              setEditingSemester(null);
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={cn(
                "w-full max-w-md rounded-2xl p-6 shadow-xl",
                isDarkMode
                  ? "bg-slate-900 border border-slate-800"
                  : "bg-white",
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <h2
                  className={cn(
                    "text-xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {editingSemester ? "Edit Semester" : "Add Semester"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSemester(null);
                  }}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isDarkMode
                      ? "hover:bg-slate-800 text-slate-400"
                      : "hover:bg-gray-100 text-gray-500",
                  )}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Semester Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., First Semester 2024/2025"
                    required
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  />
                </div>

                <div>
                  <label
                    className={cn(
                      "block text-sm font-medium mb-2",
                      isDarkMode ? "text-slate-300" : "text-gray-700",
                    )}
                  >
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  >
                    <option value="first">First Semester</option>
                    <option value="second">Second Semester</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-slate-300" : "text-gray-700",
                      )}
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border transition-all",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-200 text-gray-900",
                      )}
                    />
                  </div>
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-slate-300" : "text-gray-700",
                      )}
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border transition-all",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-200 text-gray-900",
                      )}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-colors"
                  >
                    {editingSemester ? "Update" : "Create"} Semester
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSemester(null);
                    }}
                    className={cn(
                      "flex-1 px-4 py-2 rounded-xl font-medium transition-colors",
                      isDarkMode
                        ? "bg-slate-800 text-white hover:bg-slate-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                    )}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSemesterToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Semester"
        message="Are you sure you want to delete this semester?"
        itemName={semesterToDelete?.name}
      />
    </AdminPage>
  );
};

export default Semesters;
