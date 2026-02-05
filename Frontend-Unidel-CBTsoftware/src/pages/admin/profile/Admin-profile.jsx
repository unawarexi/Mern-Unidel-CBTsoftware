import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  RefreshCw,
  Edit2,
  CheckCircle,
  Shield,
  Clock,
  Key,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AdminPage, { AdminCard } from "../components/AdminPage";
import { AdminIcons } from "../components/icons";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AdminProfile = () => {
  const { isDarkMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Get user from localStorage (normally would come from auth store)
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [profile, setProfile] = useState({
    fullname: storedUser.fullname || "Admin User",
    email: storedUser.email || "admin@unidel.edu.ng",
    phone: storedUser.phone || "",
    role: storedUser.role || "admin",
  });

  const handleProfileUpdate = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSaveSuccess(true);
      setEditMode(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  // Activity history mock data
  const activityHistory = [
    { action: "Logged in", time: new Date(), ip: "192.168.1.1" },
    {
      action: "Updated exam settings",
      time: new Date(Date.now() - 3600000),
      ip: "192.168.1.1",
    },
    {
      action: "Created new course",
      time: new Date(Date.now() - 7200000),
      ip: "192.168.1.1",
    },
    {
      action: "Approved question bank",
      time: new Date(Date.now() - 86400000),
      ip: "192.168.1.1",
    },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const actions = (
    <div className="flex items-center gap-2">
      {saveSuccess && (
        <span className="flex items-center gap-2 text-emerald-500 text-sm">
          <CheckCircle className="w-4 h-4" />
          Saved!
        </span>
      )}
      {editMode ? (
        <>
          <button
            onClick={() => setEditMode(false)}
            className={cn(
              "px-4 py-2 rounded-xl font-medium transition-all",
              isDarkMode
                ? "bg-slate-800 text-white hover:bg-slate-700"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
            )}
          >
            Cancel
          </button>
          <button
            onClick={handleProfileUpdate}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save
          </button>
        </>
      ) : (
        <button
          onClick={() => setEditMode(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Edit Profile</span>
        </button>
      )}
    </div>
  );

  return (
    <AdminPage
      title="My Profile"
      subtitle="Manage your account settings and preferences"
      icon={AdminIcons.Admin}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div
          className={cn(
            "flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl",
            isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
          )}
        >
          <div className="relative">
            <div
              className={cn(
                "w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold",
                isDarkMode
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-orange-100 text-orange-600",
              )}
            >
              {profile.fullname?.charAt(0).toUpperCase() || "A"}
            </div>
            <button
              className={cn(
                "absolute -bottom-2 -right-2 p-2 rounded-xl",
                isDarkMode
                  ? "bg-slate-700 text-white"
                  : "bg-white text-gray-700 shadow",
              )}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <div className="text-center md:text-left">
            <h2
              className={cn(
                "text-2xl font-bold",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              {profile.fullname}
            </h2>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-slate-400" : "text-gray-500",
              )}
            >
              {profile.email}
            </p>
            <span
              className={cn(
                "inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium capitalize",
                "bg-orange-100 text-orange-600",
              )}
            >
              {profile.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <AdminCard title="Personal Information" icon={User}>
            <div className="space-y-4">
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.fullname}
                  onChange={(e) =>
                    setProfile({ ...profile, fullname: e.target.value })
                  }
                  disabled={!editMode}
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border transition-all disabled:opacity-60",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                    !editMode && "cursor-not-allowed",
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
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  disabled={!editMode}
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border transition-all disabled:opacity-60",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                    !editMode && "cursor-not-allowed",
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
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  disabled={!editMode}
                  placeholder="Enter phone number"
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border transition-all disabled:opacity-60",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                    !editMode && "cursor-not-allowed",
                  )}
                />
              </div>
            </div>
          </AdminCard>

          {/* Change Password */}
          <AdminCard title="Change Password" icon={Lock}>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={passwordForm.currentPassword}
                    onChange={(e) =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    className={cn(
                      "w-full px-4 py-2 rounded-xl border transition-all pr-10",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 text-white"
                        : "bg-white border-gray-200 text-gray-900",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label
                  className={cn(
                    "block text-sm font-medium mb-2",
                    isDarkMode ? "text-slate-300" : "text-gray-700",
                  )}
                >
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      newPassword: e.target.value,
                    })
                  }
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
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({
                      ...passwordForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={cn(
                    "w-full px-4 py-2 rounded-xl border transition-all",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white"
                      : "bg-white border-gray-200 text-gray-900",
                  )}
                />
              </div>
              <button
                type="submit"
                disabled={
                  saving ||
                  !passwordForm.currentPassword ||
                  !passwordForm.newPassword
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Key className="w-4 h-4" />
                )}
                Update Password
              </button>
            </form>
          </AdminCard>
        </div>

        {/* Activity History */}
        <AdminCard title="Recent Activity" icon={Clock}>
          <div className="space-y-3">
            {activityHistory.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl",
                  isDarkMode ? "bg-slate-800/50" : "bg-gray-50",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isDarkMode ? "bg-slate-700" : "bg-white",
                    )}
                  >
                    <Shield
                      className={cn(
                        "w-5 h-5",
                        isDarkMode ? "text-orange-400" : "text-orange-500",
                      )}
                    />
                  </div>
                  <div>
                    <p
                      className={cn(
                        "font-medium text-sm",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {activity.action}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-slate-500" : "text-gray-500",
                      )}
                    >
                      IP: {activity.ip}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "text-xs",
                    isDarkMode ? "text-slate-500" : "text-gray-500",
                  )}
                >
                  {formatDate(activity.time)}
                </span>
              </motion.div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminPage>
  );
};

export default AdminProfile;
