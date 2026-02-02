import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";
import useAuthStore from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const LecturerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Helper to get initials from fullname
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
        "sticky top-0 z-30 transition-colors duration-300 border-b",
        isDarkMode
          ? "bg-slate-900 border-slate-800 shadow-slate-950/20"
          : "bg-white border-gray-200 shadow-sm",
      )}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex-shrink-0">
              <div
                className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md",
                  isDarkMode
                    ? "bg-gradient-to-br from-orange-600 to-orange-700"
                    : "bg-gradient-to-br from-orange-500 to-orange-600",
                )}
              >
                <span className="text-white font-bold text-base sm:text-lg">
                  U
                </span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1
                className={cn(
                  "text-lg sm:text-xl font-bold",
                  isDarkMode ? "text-white" : "text-slate-800",
                )}
              >
                UNIDEL CBT
              </h1>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-slate-400" : "text-gray-500",
                )}
              >
                Lecturer Portal
              </p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search
                  className={cn(
                    "h-5 w-5",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
              </div>
              <input
                type="text"
                placeholder="Search for students, classes, groups etc."
                className={cn(
                  "block w-full pl-10 pr-3 py-2 border rounded-lg text-sm transition-all outline-none",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    : "bg-gray-50 border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent",
                )}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={cn(
                "p-2 rounded-xl transition-all",
                isDarkMode
                  ? "bg-slate-800 text-orange-400 hover:bg-slate-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200",
              )}
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Settings Icon */}
            <button
              className={cn(
                "hidden sm:flex p-2 rounded-lg transition-all",
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
              )}
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>

            {/* Notification Bell with Badge */}
            <button
              className={cn(
                "flex relative p-1.5 sm:p-2 rounded-lg transition-all",
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
              )}
            >
              <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-4 h-4 sm:w-5 sm:h-5 bg-orange-500 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center font-semibold">
                2
              </span>
            </button>

            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={cn(
                  "flex items-center space-x-2 sm:space-x-3 p-0.5 sm:p-1 pr-2 sm:pr-3 rounded-lg transition-all",
                  isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-50",
                )}
              >
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold text-xs sm:text-sm shadow-md">
                  {getInitials(user?.fullname)}
                </div>
                <div className="hidden lg:block text-left">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-semibold",
                      isDarkMode ? "text-white" : "text-slate-800",
                    )}
                  >
                    {user?.fullname || "Lecturer"}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] sm:text-xs",
                      isDarkMode ? "text-slate-400" : "text-gray-500",
                    )}
                  >
                    {user?.role
                      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
                      : "Teacher"}
                  </p>
                </div>
                <ChevronDown
                  className={cn(
                    "hidden sm:block h-4 w-4 transition-transform",
                    profileDropdownOpen && "rotate-180",
                    isDarkMode ? "text-slate-500" : "text-gray-600",
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className={cn(
                    "absolute right-0 mt-2 w-48 sm:w-56 rounded-lg shadow-lg border py-2 z-50",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-200",
                  )}
                >
                  <Link
                    to="/lecturer/profile/settings"
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/lecturer/courses/assigned"
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    My Classes
                  </Link>
                  <Link
                    to="/lecturer/exams/results"
                    className={cn(
                      "block px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-orange-50 hover:text-orange-600",
                    )}
                  >
                    Test History
                  </Link>
                  <hr
                    className={cn(
                      "my-2",
                      isDarkMode ? "border-slate-800" : "border-gray-200",
                    )}
                  />
                  <button
                    className={cn(
                      "w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition-all",
                      "text-red-600 hover:bg-red-50",
                    )}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "md:hidden p-2 rounded-lg transition-all",
                isDarkMode
                  ? "text-slate-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
              )}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LecturerNavbar;
