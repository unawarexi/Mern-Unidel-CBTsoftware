import React, { useState } from "react";
import { Search, Settings, Bell, ChevronDown, Menu, X } from "lucide-react";

const LecturerNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">U</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-slate-800">UNIDEL CBT</h1>
              <p className="text-xs text-gray-500">Lecturer Portal</p>
            </div>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input type="text" placeholder="Search for students, classes, groups etc." className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm transition-all" />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Settings Icon */}
            <button className="hidden sm:flex p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              <Settings className="h-6 w-6" />
            </button>

            {/* Notification Bell with Badge */}
            <button className="hidden sm:flex relative p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 w-5 h-5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">2</span>
            </button>

            {/* Profile Section */}
            <div className="relative">
              <button onClick={() => setProfileDropdownOpen(!profileDropdownOpen)} className="flex items-center space-x-3 p-1 pr-3 rounded-lg hover:bg-gray-50 transition-all">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold shadow-md">AM</div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-slate-800">Anna Mironova</p>
                  <p className="text-xs text-gray-500">Teacher</p>
                </div>
                <ChevronDown className="hidden sm:block h-4 w-4 text-gray-600" />
              </button>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">Profile Settings</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">My Classes</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all">Test History</a>
                  <hr className="my-2 border-gray-200" />
                  <a href="#" className="block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-all">Logout</a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LecturerNavbar;
