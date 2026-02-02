import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  RefreshCw,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminStatCard, AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
// TODO: Add academic session and semester hooks to admin-content-store once backend is ready
// import {
//   useGetAllAcademicSessionsAction,
//   useGetAllSemestersAction,
// } from "../../../store/admin-content-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";

// Temporary mock hooks until backend integration is complete
const useGetAllAcademicSessionsAction = () => ({
  academicSessions: [],
  isLoading: false,
  refetch: () => Promise.resolve(),
});

const useGetAllSemestersAction = () => ({
  semesters: [],
  isLoading: false,
  refetch: () => Promise.resolve(),
});

const CurrentSession = () => {
  const { isDarkMode } = useThemeStore();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const {
    academicSessions = [],
    isLoading: loadingSessions,
    refetch: refetchSessions,
  } = useGetAllAcademicSessionsAction();

  const { semesters = [], isLoading: loadingSemesters } =
    useGetAllSemestersAction();

  const isLoading = loadingSessions || loadingSemesters;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refetchSessions();
    } finally {
      setRefreshing(false);
    }
  };

  const activeSession = academicSessions.find((s) => s.isActive);
  const activeSemester = semesters.find((s) => s.isActive || s.isCurrent);

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysRemaining = activeSession
    ? getDaysRemaining(activeSession.endDate)
    : null;

  const actions = (
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
  );

  return (
    <AdminPage
      title="Current Session"
      subtitle="Overview of the active academic session"
      icon={AdminIcons.Timer}
      actions={actions}
    >
      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={120}
                  borderRadius={16}
                  baseColor={isDarkMode ? "#1e293b" : "#f1f5f9"}
                  highlightColor={isDarkMode ? "#334155" : "#e2e8f0"}
                />
              ))}
          </div>
        </div>
      ) : !activeSession ? (
        <div
          className={cn(
            "text-center py-16 rounded-2xl",
            isDarkMode ? "bg-slate-800/30" : "bg-gray-50",
          )}
        >
          <AlertTriangle
            className={cn(
              "w-16 h-16 mx-auto mb-4",
              isDarkMode ? "text-amber-500" : "text-amber-400",
            )}
          />
          <h3
            className={cn(
              "text-xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            No Active Session
          </h3>
          <p
            className={cn(
              "mb-6",
              isDarkMode ? "text-slate-400" : "text-gray-500",
            )}
          >
            There is no active academic session. Please set one up.
          </p>
          <button
            onClick={() => navigate("/admin/sessions/academic-sessions")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            Manage Sessions
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <AdminStatCard
              label="Current Session"
              value={activeSession?.name || "N/A"}
              subtitle={`${activeSession?.year || ""}`}
              icon={Calendar}
              color="blue"
            />
            <AdminStatCard
              label="Semester"
              value={activeSemester?.name || activeSession?.semester || "N/A"}
              subtitle="Active semester"
              icon={Clock}
              color="purple"
            />
            <AdminStatCard
              label="Status"
              value={activeSession ? "Active" : "Inactive"}
              subtitle="Session status"
              icon={CheckCircle}
              color="green"
            />
            <AdminStatCard
              label="Days Left"
              value={daysRemaining !== null ? `${daysRemaining}` : "N/A"}
              subtitle="Until session ends"
              icon={Clock}
              trend={daysRemaining && daysRemaining < 30 ? "Ending soon" : ""}
              trendUp={false}
              color="orange"
            />
          </div>

          {/* Session Details */}
          <AdminCard title="Session Details" icon={Calendar}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Session Name
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {activeSession.name}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Academic Year
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {activeSession.year}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Semester
                  </span>
                  <span
                    className={cn(
                      "font-medium capitalize",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {activeSession.semester || activeSemester?.type || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Start Date
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {formatDate(activeSession.startDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    End Date
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {formatDate(activeSession.endDate)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-slate-200 dark:border-slate-700/50">
                  <span
                    className={isDarkMode ? "text-slate-400" : "text-gray-500"}
                  >
                    Status
                  </span>
                  <span className="flex items-center gap-2 text-emerald-500 font-medium">
                    <CheckCircle className="w-4 h-4" />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </AdminCard>

          {/* Progress */}
          <AdminCard title="Session Progress" icon={Clock}>
            {(() => {
              const start = new Date(activeSession.startDate);
              const end = new Date(activeSession.endDate);
              const now = new Date();
              const total = end - start;
              const elapsed = now - start;
              const progress = Math.min(
                Math.max((elapsed / total) * 100, 0),
                100,
              );

              return (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }
                    >
                      {Math.round(progress)}% Complete
                    </span>
                    <span
                      className={
                        isDarkMode ? "text-slate-400" : "text-gray-500"
                      }
                    >
                      {daysRemaining} days remaining
                    </span>
                  </div>
                  <div
                    className={cn(
                      "h-4 rounded-full overflow-hidden",
                      isDarkMode ? "bg-slate-700" : "bg-gray-200",
                    )}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={
                        isDarkMode ? "text-slate-500" : "text-gray-500"
                      }
                    >
                      {formatDate(activeSession.startDate)}
                    </span>
                    <span
                      className={
                        isDarkMode ? "text-slate-500" : "text-gray-500"
                      }
                    >
                      {formatDate(activeSession.endDate)}
                    </span>
                  </div>
                </div>
              );
            })()}
          </AdminCard>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/sessions/academic-sessions")}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
                  : "bg-white border-gray-100 hover:shadow-md",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-blue-100 text-blue-600",
                  )}
                >
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Manage Sessions
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    View and edit all sessions
                  </p>
                </div>
              </div>
              <ChevronRight
                className={isDarkMode ? "text-slate-500" : "text-gray-400"}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/admin/sessions/semesters")}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800"
                  : "bg-white border-gray-100 hover:shadow-md",
              )}
            >
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    "bg-purple-100 text-purple-600",
                  )}
                >
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Manage Semesters
                  </p>
                  <p
                    className={cn(
                      "text-sm",
                      isDarkMode ? "text-slate-500" : "text-gray-500",
                    )}
                  >
                    View and edit all semesters
                  </p>
                </div>
              </div>
              <ChevronRight
                className={isDarkMode ? "text-slate-500" : "text-gray-400"}
              />
            </motion.button>
          </div>
        </div>
      )}
    </AdminPage>
  );
};

export default CurrentSession;
