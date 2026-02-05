import React from "react";
import Sidebar from "../container/Student-sidebar";
import StudentNavbar from "./Student-navbar";
import Footer from "./Student-footer";
import { Outlet } from "react-router-dom";

import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const StudentDashboard = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      <aside
        className={cn(
          "border-r",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-100",
        )}
      >
        <Sidebar />
      </aside>

      {/* Use flex-1 so navbar/footer stretch to remaining width automatically */}
      <main className="w-full flex-1 min-h-screen flex flex-col">
        <StudentNavbar />
        <div className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default StudentDashboard;
