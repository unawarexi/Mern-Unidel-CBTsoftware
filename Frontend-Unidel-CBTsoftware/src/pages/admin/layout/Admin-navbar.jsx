import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Flag,
  HelpCircle,
  Bell,
  MessageSquare,
  BarChart3,
  Maximize2,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import RoleSwitcher from "../../../components/auth/RoleSwitcher";

const AdminNavbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/admin-signin", { replace: true });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const dateStr = date.toLocaleDateString("en-GB", options);
    const timeStr = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    return { dateStr, timeStr };
  };

  const { dateStr, timeStr } = formatDateTime(currentDateTime);

  const getInitials = (name) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-30 border-b transition-all duration-300",
        isDarkMode
          ? "bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-lg shadow-slate-900/50"
          : "bg-white border-gray-200 shadow-sm",
      )}
    >
      <div className="max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Section - Search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Search
                  className={cn(
                    "h-3.5 w-3.5 sm:h-4 sm:w-4",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className={cn(
                  "block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-xl border outline-none transition-all",
                  isDarkMode
                    ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                )}
              />
            </div>
          </div>

          {/* Center Section - Date & Time */}
          <div
            className={cn(
              "hidden lg:flex items-center space-x-2",
              isDarkMode ? "text-slate-300" : "text-gray-700",
            )}
          >
            <Calendar
              className={cn(
                "h-4 w-4",
                isDarkMode ? "text-slate-500" : "text-gray-500",
              )}
            />
            <div className="text-center">
              <p
                className={cn(
                  "text-xs font-medium",
                  isDarkMode ? "text-slate-500" : "text-gray-500",
                )}
              >
                Date & time
              </p>
              <p
                className={cn(
                  "text-sm font-semibold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {dateStr} - {timeStr}
              </p>
            </div>
          </div>

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center justify-end space-x-1.5 sm:space-x-3 flex-1">
            {/* Role Switcher */}
            <RoleSwitcher />

            <div className="hidden md:flex items-center space-x-0.5 sm:space-x-1">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                className={cn(
                  "p-1.5 sm:p-2 rounded-xl transition-all",
                  isDarkMode
                    ? "text-orange-400 hover:text-orange-300 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
                title={
                  isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
                }
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </button>

              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                className={cn(
                  "p-1.5 sm:p-2 rounded-lg transition-all",
                  isDarkMode
                    ? "text-slate-400 hover:text-orange-400 hover:bg-slate-800"
                    : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                )}
              >
                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="relative ml-1 sm:ml-2">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={cn(
                  "flex items-center space-x-2 p-1 rounded-lg transition-all",
                  isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50",
                )}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center overflow-hidden shadow-lg">
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {getInitials(user?.fullname)}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className={cn(
                    "absolute right-0 mt-2 w-48 sm:w-56 rounded-xl shadow-xl border py-2 z-50",
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 shadow-slate-900/50"
                      : "bg-white border-gray-200",
                  )}
                >
                  <div
                    className={cn(
                      "px-3 sm:px-4 py-2 sm:py-3 border-b",
                      isDarkMode ? "border-slate-700" : "border-gray-200",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs sm:text-sm font-semibold",
                        isDarkMode ? "text-white" : "text-slate-800",
                      )}
                    >
                      {user?.fullname || "Administrator"}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] sm:text-xs",
                        isDarkMode ? "text-slate-400" : "text-gray-500",
                      )}
                    >
                      {user?.email || "admin@unidel.edu.ng"}
                    </p>
                  </div>
                  <Link
                    to="/admin/profile"
                    onClick={() => setProfileDropdownOpen(false)}
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/admin/settings/general"
                    onClick={() => setProfileDropdownOpen(false)}
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    System Settings
                  </Link>
                  <Link
                    to="/admin/users/students"
                    onClick={() => setProfileDropdownOpen(false)}
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    User Management
                  </Link>
                  <Link
                    to="/admin/exams/results"
                    onClick={() => setProfileDropdownOpen(false)}
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-700 hover:text-orange-400"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    Reports
                  </Link>
                  <hr
                    className={cn(
                      "my-2",
                      isDarkMode ? "border-slate-700" : "border-gray-200",
                    )}
                  />
                  <button
                    onClick={handleLogout}
                    className={cn(
                      "block w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-red-400 hover:bg-red-500/10"
                        : "text-red-600 hover:bg-red-50",
                    )}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
