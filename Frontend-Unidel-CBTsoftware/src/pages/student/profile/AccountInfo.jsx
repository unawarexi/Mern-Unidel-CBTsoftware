import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  GraduationCap,
  Award,
  Shield,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react";
import StudentPage from "../components/StudentPage";
import { StudentIcons } from "../components/icons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useAuthStore from "../../../store/auth-store";
import { useGetStudentDashboardStatsAction } from "../../../store/statistics-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { useNavigate } from "react-router-dom";
import ExportButton from "../../../components/ExportButton";

const AccountInfo = () => {
  const navigate = useNavigate();
  const { isDarkMode } = useThemeStore();
  const { user, isLoading: userLoading } = useAuthStore();

  // Fetch stats
  const { dashboardStats, isLoading: statsLoading } =
    useGetStudentDashboardStatsAction({});

  const isLoading = userLoading || statsLoading;

  const accountStats = [
    {
      label: "Enrolled Courses",
      value: dashboardStats?.overview?.enrolledCourses || 0,
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      label: "Exams Completed",
      value: dashboardStats?.overview?.completedExams || 0,
      icon: GraduationCap,
      color: "text-emerald-500",
    },
    {
      label: "Average Score",
      value: `${dashboardStats?.performance?.averageScore?.toFixed(0) || 0}%`,
      icon: Award,
      color: "text-orange-500",
    },
    {
      label: "Pass Rate",
      value: `${dashboardStats?.performance?.passRate?.toFixed(0) || 0}%`,
      icon: Shield,
      color: "text-purple-500",
    },
  ];

  const personalInfo = [
    { label: "Full Name", value: user?.fullname, icon: User },
    { label: "Email", value: user?.email, icon: Mail },
    { label: "Phone", value: user?.phone || "Not provided", icon: Phone },
    { label: "Address", value: user?.address || "Not provided", icon: MapPin },
    {
      label: "Date of Birth",
      value: user?.dob
        ? new Date(user.dob).toLocaleDateString()
        : "Not provided",
      icon: Calendar,
    },
  ];

  const academicInfo = [
    { label: "Student ID", value: user?.matricNo || user?._id?.slice(-8) },
    { label: "Department", value: user?.department?.name || "N/A" },
    { label: "Faculty", value: user?.department?.faculty || "N/A" },
    { label: "Level", value: user?.level || "N/A" },
    {
      label: "Account Status",
      value: user?.isActive ? "Active" : "Inactive",
      status: user?.isActive ? "active" : "inactive",
    },
  ];

  const actions = (
    <div className="flex items-center gap-2">
      <ExportButton type="account-report" title="My Account Summary" />
      <button
        onClick={() => navigate("/student/profile/settings")}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all",
          "bg-orange-500 text-white hover:bg-orange-600",
        )}
      >
        <Edit className="w-4 h-4" />
        Edit Profile
      </button>
    </div>
  );

  return (
    <StudentPage
      title="Account Information"
      subtitle="View and manage your personal details"
      icon={StudentIcons.Profile}
      actions={actions}
    >
      <div className="space-y-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "p-6 rounded-3xl border relative overflow-hidden",
            isDarkMode
              ? "bg-gradient-to-r from-orange-500/20 to-purple-500/20 border-orange-500/30"
              : "bg-gradient-to-r from-orange-50 to-purple-50 border-orange-200",
          )}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div
              className={cn(
                "w-24 h-24 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-lg",
                isDarkMode
                  ? "bg-orange-500/30 text-orange-400"
                  : "bg-orange-100 text-orange-600",
              )}
            >
              {user?.fullname?.charAt(0) || "S"}
            </div>
            <div className="text-center md:text-left">
              <h2
                className={cn(
                  "text-2xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {isLoading ? <Skeleton width={200} /> : user?.fullname}
              </h2>
              <p
                className={cn(
                  "text-sm",
                  isDarkMode ? "text-slate-400" : "text-gray-600",
                )}
              >
                {isLoading ? <Skeleton width={150} /> : user?.email}
              </p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    user?.isActive
                      ? "bg-emerald-500/20 text-emerald-500"
                      : "bg-red-500/20 text-red-500",
                  )}
                >
                  {user?.isActive ? "Active Account" : "Inactive"}
                </span>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium",
                    isDarkMode
                      ? "bg-slate-700 text-slate-300"
                      : "bg-gray-200 text-gray-700",
                  )}
                >
                  Student
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {accountStats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={cn(
                "p-4 rounded-2xl border text-center",
                isDarkMode
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <stat.icon className={cn("w-6 h-6 mx-auto mb-2", stat.color)} />
              <p
                className={cn(
                  "text-xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {isLoading ? <Skeleton width={40} /> : stat.value}
              </p>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Personal Information */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <User className="w-5 h-5 text-orange-500" />
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {personalInfo.map((info, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-xl",
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <info.icon
                    className={cn(
                      "w-5 h-5",
                      isDarkMode ? "text-slate-500" : "text-gray-400",
                    )}
                  />
                  <div>
                    <p
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      {info.label}
                    </p>
                    <p
                      className={cn(
                        "font-medium",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {isLoading ? <Skeleton width={120} /> : info.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Academic Information */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-white border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <GraduationCap className="w-5 h-5 text-orange-500" />
            Academic Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {academicInfo.map((info, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-4 rounded-xl",
                  isDarkMode ? "bg-slate-700/50" : "bg-gray-50",
                )}
              >
                <p
                  className={cn(
                    "text-xs mb-1",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  {info.label}
                </p>
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {isLoading ? <Skeleton width={80} /> : info.value}
                  </p>
                  {info.status && (
                    <CheckCircle
                      className={cn(
                        "w-4 h-4",
                        info.status === "active"
                          ? "text-emerald-500"
                          : "text-red-500",
                      )}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Account Activity */}
        <div
          className={cn(
            "p-6 rounded-3xl border",
            isDarkMode
              ? "bg-slate-800/30 border-slate-800"
              : "bg-gray-50 border-gray-100",
          )}
        >
          <h3
            className={cn(
              "font-bold mb-4 flex items-center gap-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            <Clock className="w-5 h-5 text-orange-500" />
            Account Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                Account Created
              </p>
              <p
                className={cn(
                  "font-medium",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
            <div>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                Last Updated
              </p>
              <p
                className={cn(
                  "font-medium",
                  isDarkMode ? "text-slate-300" : "text-gray-700",
                )}
              >
                {user?.updatedAt
                  ? new Date(user.updatedAt).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </StudentPage>
  );
};

export default AccountInfo;
