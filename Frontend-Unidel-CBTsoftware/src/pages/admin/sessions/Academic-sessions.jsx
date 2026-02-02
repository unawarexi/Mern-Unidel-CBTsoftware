import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Search,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle,
  Clock,
  X,
  AlertCircle,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
// TODO: Add academic session hooks to admin-content-store once backend is ready
// import {
//   useGetAllAcademicSessionsAction,
//   useCreateAcademicSessionAction,
//   useUpdateAcademicSessionAction,
//   useDeleteAcademicSessionAction,
//   useSetActiveSessionAction,
// } from "../../../store/admin-content-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import DeleteModal from "../../../components/Delete-modal";

// Temporary mock hooks until backend integration is complete
const useGetAllAcademicSessionsAction = () => ({
  academicSessions: [],
  isLoading: false,
  refetch: () => Promise.resolve(),
});

const useCreateAcademicSessionAction = () => ({
  createSession: async (data) => {
    console.log("TODO: Implement createSession", data);
    return data;
  },
});

const useUpdateAcademicSessionAction = () => ({
  updateSession: async (id, data) => {
    console.log("TODO: Implement updateSession", { id, data });
    return data;
  },
});

const useDeleteAcademicSessionAction = () => ({
  deleteSession: async (id) => {
    console.log("TODO: Implement deleteSession", id);
    return true;
  },
});

const useSetActiveSessionAction = () => ({
  setActiveSession: async (id) => {
    console.log("TODO: Implement setActiveSession", id);
    return true;
  },
});

const AcademicSessions = () => {
  const { isDarkMode } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    year: new Date().getFullYear(),
    semester: "first",
    startDate: "",
    endDate: "",
  });

  const {
    academicSessions = [],
    isLoading,
    refetch,
  } = useGetAllAcademicSessionsAction();

  const { createSession } = useCreateAcademicSessionAction();
  const { updateSession } = useUpdateAcademicSessionAction();
  const { deleteSession } = useDeleteAcademicSessionAction();
  const { setActiveSession } = useSetActiveSessionAction();

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
      if (editingSession) {
        await updateSession(editingSession._id, formData);
      } else {
        await createSession(formData);
      }
      setShowModal(false);
      setEditingSession(null);
      setFormData({
        name: "",
        year: new Date().getFullYear(),
        semester: "first",
        startDate: "",
        endDate: "",
      });
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (session) => {
    setEditingSession(session);
    setFormData({
      name: session.name || "",
      year: session.year || new Date().getFullYear(),
      semester: session.semester || "first",
      startDate: session.startDate?.split("T")[0] || "",
      endDate: session.endDate?.split("T")[0] || "",
    });
    setShowModal(true);
  };

  const handleDelete = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sessionToDelete) return;
    try {
      await deleteSession(sessionToDelete._id);
      setDeleteModalOpen(false);
      setSessionToDelete(null);
      refetch();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSetActive = async (sessionId) => {
    try {
      await setActiveSession(sessionId);
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

  const activeSession = academicSessions.find((s) => s.isActive);

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
        <span className="hidden sm:inline">Add Session</span>
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
      title="Academic Sessions"
      subtitle="Manage academic semesters and sessions"
      icon={AdminIcons.Calendar}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AdminStatCard
            label="Total Sessions"
            value={academicSessions.length}
            subtitle="All time"
            icon={Calendar}
            color="blue"
          />
          <AdminStatCard
            label="Active Session"
            value={activeSession?.name || "None"}
            subtitle="Currently active"
            icon={CheckCircle}
            color="green"
          />
          <AdminStatCard
            label="Current Year"
            value={activeSession?.year || new Date().getFullYear()}
            subtitle="Academic year"
            icon={Clock}
            color="purple"
          />
          <AdminStatCard
            label="Semester"
            value={
              activeSession?.semester?.charAt(0).toUpperCase() +
                activeSession?.semester?.slice(1) || "N/A"
            }
            subtitle="Current semester"
            icon={Calendar}
            color="orange"
          />
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {isLoading ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={100}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))
          ) : academicSessions.length === 0 ? (
            <div
              className={cn(
                "text-center py-16 rounded-2xl",
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
                No academic sessions found
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-orange-500 hover:text-orange-600 font-medium"
              >
                Create your first session
              </button>
            </div>
          ) : (
            academicSessions.map((session, idx) => (
              <motion.div
                key={session._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "p-5 rounded-2xl border transition-all",
                  session.isActive
                    ? isDarkMode
                      ? "bg-orange-500/10 border-orange-500/30"
                      : "bg-orange-50 border-orange-200"
                    : isDarkMode
                      ? "bg-slate-800/30 border-slate-700/50"
                      : "bg-white border-gray-100",
                )}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center",
                        session.isActive
                          ? "bg-orange-500 text-white"
                          : isDarkMode
                            ? "bg-slate-700 text-slate-400"
                            : "bg-gray-100 text-gray-500",
                      )}
                    >
                      <Calendar className="w-7 h-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3
                          className={cn(
                            "font-semibold text-lg",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {session.name}
                        </h3>
                        {session.isActive && (
                          <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full font-medium">
                            Active
                          </span>
                        )}
                      </div>
                      <p
                        className={cn(
                          "text-sm",
                          isDarkMode ? "text-slate-400" : "text-gray-500",
                        )}
                      >
                        {session.year} •{" "}
                        {session.semester?.charAt(0).toUpperCase() +
                          session.semester?.slice(1)}{" "}
                        Semester
                      </p>
                      <p
                        className={cn(
                          "text-xs mt-1",
                          isDarkMode ? "text-slate-500" : "text-gray-400",
                        )}
                      >
                        {formatDate(session.startDate)} -{" "}
                        {formatDate(session.endDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!session.isActive && (
                      <button
                        onClick={() => handleSetActive(session._id)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all",
                          isDarkMode
                            ? "bg-slate-700 text-white hover:bg-slate-600"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        )}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Set Active
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(session)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-700 text-slate-400 hover:text-white"
                          : "hover:bg-gray-100 text-gray-500 hover:text-gray-700",
                      )}
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(session)}
                      className={cn(
                        "p-2 rounded-lg transition-colors",
                        isDarkMode
                          ? "hover:bg-red-500/20 text-slate-400 hover:text-red-400"
                          : "hover:bg-red-100 text-gray-500 hover:text-red-600",
                      )}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
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
              setEditingSession(null);
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
                  {editingSession ? "Edit Session" : "Add Session"}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingSession(null);
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
                    Session Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., 2024/2025 First Semester"
                    required
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className={cn(
                        "block text-sm font-medium mb-2",
                        isDarkMode ? "text-slate-300" : "text-gray-700",
                      )}
                    >
                      Year
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          year: parseInt(e.target.value),
                        })
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
                      Semester
                    </label>
                    <select
                      value={formData.semester}
                      onChange={(e) =>
                        setFormData({ ...formData, semester: e.target.value })
                      }
                      className={cn(
                        "w-full px-4 py-2 rounded-xl border transition-all",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-white border-gray-200 text-gray-900",
                      )}
                    >
                      <option value="first">First</option>
                      <option value="second">Second</option>
                    </select>
                  </div>
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
                    {editingSession ? "Update" : "Create"} Session
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingSession(null);
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
          setSessionToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Session"
        message="Are you sure you want to delete this academic session?"
        itemName={sessionToDelete?.name}
      />
    </AdminPage>
  );
};

export default AcademicSessions;
