import React, { useState } from "react";
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
import { StudentIcons } from "../components/icons";
import RoleSwitcher from "../../../components/auth/RoleSwitcher";

const StudentNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useThemeStore();

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
          : "bg-white border-gray-100 shadow-sm",
      )}
    >
      <div className="max-w-[1600px] mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Left: Mobile Menu + Search */}
          <div className="flex items-center gap-4 flex-1">
            <div className="hidden md:flex flex-1 max-w-md relative group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <StudentIcons.Search
                  className={cn(
                    "h-4 w-4",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
              </div>
              <input
                type="text"
                placeholder="Search exams, courses..."
                className={cn(
                  "block w-full pl-10 pr-4 py-2 text-sm rounded-xl border transition-all outline-none",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-orange-500"
                    : "bg-gray-50 border-gray-100 text-gray-900 placeholder:text-gray-400 focus:border-orange-500 shadow-inner",
                )}
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            {/* Role Switcher */}
            <RoleSwitcher />

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

            {/* Notifications */}
            <button
              className={cn(
                "relative p-2 rounded-xl transition-all",
                isDarkMode
                  ? "bg-slate-800 text-slate-400 hover:text-white"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900",
              )}
            >
              <StudentIcons.Notifications className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-orange-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                3
              </span>
            </button>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={cn(
                  "flex items-center gap-3 p-1 pl-1 pr-3 rounded-xl transition-all",
                  isDarkMode
                    ? "hover:bg-slate-800"
                    : "hover:bg-gray-50 bg-gray-50/50",
                )}
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-orange-500/20">
                  {getInitials(user?.fullname)}
                </div>
                <div className="hidden lg:block text-left">
                  <p
                    className={cn(
                      "text-sm font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {user?.fullname?.split(" ")[0] || "Student"}
                  </p>
                  <p className="text-[10px] font-medium text-orange-500 uppercase tracking-wider">
                    Portal Active
                  </p>
                </div>
                <StudentIcons.ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    profileDropdownOpen && "rotate-180",
                    isDarkMode ? "text-slate-500" : "text-gray-400",
                  )}
                />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div
                  className={cn(
                    "absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border transition-all z-50 py-2",
                    isDarkMode
                      ? "bg-slate-900 border-slate-800"
                      : "bg-white border-gray-100",
                  )}
                >
                  <Link
                    to="/student/profile"
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-orange-50",
                    )}
                  >
                    Profile Settings
                  </Link>
                  <Link
                    to="/student/exams/history"
                    className={cn(
                      "block px-4 py-2.5 text-sm font-medium",
                      isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-orange-50",
                    )}
                  >
                    Exam History
                  </Link>
                  <hr
                    className={cn(
                      "my-2",
                      isDarkMode ? "border-slate-800" : "border-gray-100",
                    )}
                  />
                  <button className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors">
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

export default StudentNavbar;
