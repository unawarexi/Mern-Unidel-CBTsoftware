import React, { useState, useEffect } from "react";
import { Search, Calendar, Flag, HelpCircle, Bell, MessageSquare, BarChart3, Maximize2, ChevronDown } from "lucide-react";
import useAuthStore from "../../../store/auth-store"; // Add this import

const AdminNavbar = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user } = useAuthStore(); // Get current user

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Left Section - Search */}
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1">
            <div className="relative w-full max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                <Search className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search"
                className="block w-full pl-8 sm:pl-10 pr-2 sm:pr-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>

          {/* Center Section - Date & Time */}
          <div className="hidden lg:flex items-center space-x-2 text-gray-700">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="text-center">
              <p className="text-xs text-gray-500 font-medium">Date & time</p>
              <p className="text-sm font-semibold">
                {dateStr} - {timeStr}
              </p>
            </div>
          </div>

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center justify-end space-x-1.5 sm:space-x-3 flex-1">
            <div className="hidden md:flex items-center space-x-0.5 sm:space-x-1">
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <Flag className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button className="p-1.5 sm:p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
                <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Profile Section */}
            <div className="relative ml-1 sm:ml-2">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-all">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-md">
                  <div className="w-full h-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                    {getInitials(user?.fullname)}
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 sm:w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 text-gray-700">
                  <div className="px-3 sm:px-4 py-2 sm:py-3 border-b border-gray-200">
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">{user?.fullname || "Administrator"}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">{user?.email || "admin@unidel.edu.ng"}</p>
                  </div>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">Profile Settings</a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">System Settings</a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">User Management</a>
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">Reports</a>
                  <hr className="my-2 border-gray-200" />
                  <a href="#" className="block px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 transition-all">Logout</a>
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
