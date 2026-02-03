import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Camera,
  Shield,
  Key,
  Save,
  CheckCircle,
} from "lucide-react";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { toast } from "react-hot-toast";

const AgentProfile = () => {
  const { isDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    toast.success("Profile updated successfully (Mock)");
    setIsEditing(false);
  };

  return (
    <div
      className={cn(
        "min-h-screen p-4 sm:p-6 transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1
              className={cn(
                "text-2xl sm:text-3xl font-bold mb-1",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              My Account
            </h1>
            <p
              className={cn(
                "text-sm sm:text-base",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            >
              Manage your personal information and security settings.
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={cn(
              "px-4 py-2 rounded-lg font-bold transition-all",
              isEditing
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20",
            )}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Avatar & Summary */}
          <div className="space-y-6">
            <div
              className={cn(
                "rounded-2xl p-8 border shadow-sm text-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl sm:text-4xl font-black shadow-2xl">
                  {user?.fullname?.charAt(0) || "A"}
                </div>
                <button className="absolute bottom-1 right-1 p-2 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 text-blue-500 hover:scale-110 transition-transform">
                  <Camera size={20} />
                </button>
              </div>
              <h3
                className={cn(
                  "text-xl font-bold mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {user?.fullname}
              </h3>
              <p className="text-sm text-blue-500 font-bold uppercase tracking-wider mb-4">
                Official Agent
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-green-500 font-bold bg-green-500/10 py-2 rounded-lg border border-green-500/20">
                <Shield size={14} />
                Account Verified
              </div>
            </div>

            <div
              className={cn(
                "rounded-2xl p-6 border shadow-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <h4
                className={cn(
                  "font-bold text-sm mb-4 uppercase tracking-widest text-gray-500",
                  isDarkMode ? "text-slate-400" : "text-gray-400",
                )}
              >
                Security Status
              </h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">2FA Status</span>
                  <span className="text-xs font-bold text-red-500">
                    Disabled
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Last Login</span>
                  <span className="text-xs font-medium text-gray-400">
                    2 hours ago
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <motion.div
              layout
              className={cn(
                "rounded-2xl p-8 border shadow-sm",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100",
              )}
            >
              <h3
                className={cn(
                  "text-lg font-bold mb-6 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                <User size={20} className="text-blue-500" />
                Personal Information
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <User size={18} />
                      </div>
                      <input
                        disabled={!isEditing}
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-gray-50 border-gray-200",
                        )}
                        value={formData.fullname}
                        onChange={(e) =>
                          setFormData({ ...formData, fullname: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                      </div>
                      <input
                        disabled={!isEditing}
                        type="email"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                          isDarkMode
                            ? "bg-slate-800 border-slate-700 text-white"
                            : "bg-gray-50 border-gray-200",
                        )}
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                      <Phone size={18} />
                    </div>
                    <input
                      disabled={!isEditing}
                      className={cn(
                        "w-full pl-10 pr-4 py-3 rounded-xl border outline-none transition-all",
                        isDarkMode
                          ? "bg-slate-800 border-slate-700 text-white"
                          : "bg-gray-50 border-gray-200",
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
                </div>

                {isEditing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pt-4 flex justify-end"
                  >
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/20 transition-all"
                    >
                      <Save size={18} />
                      Save Changes
                    </button>
                  </motion.div>
                )}
              </form>

              <hr
                className={cn(
                  "my-10",
                  isDarkMode ? "border-slate-800" : "border-gray-100",
                )}
              />

              <h3
                className={cn(
                  "text-lg font-bold mb-6 flex items-center gap-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                <Key size={20} className="text-blue-500" />
                Password & Security
              </h3>

              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Change your password to keep your account secure.
                </p>
                <button
                  className={cn(
                    "px-6 py-2 rounded-lg font-bold border transition-colors",
                    isDarkMode
                      ? "border-slate-800 text-white hover:bg-slate-800"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  )}
                >
                  Update Password
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
