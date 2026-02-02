import React from "react";
import Sidebar from "../container/Lecturer-sidebar";
import LecturerNavbar from "./Lecturer-navbar";
import Footer from "./Lecturer-footer";
import { Outlet } from "react-router-dom";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const LecturerDashboard = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row transition-colors duration-300",
        isDarkMode ? "bg-slate-900" : "bg-gray-50",
      )}
    >
      <aside
        className={cn(
          "border-r transition-colors duration-300",
          isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-gray-200",
        )}
      >
        <Sidebar />
      </aside>

      <main className="w-full flex-1 min-h-screen flex flex-col">
        <LecturerNavbar />
        <div
          className={cn(
            "flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto transition-colors duration-300",
            isDarkMode ? "bg-slate-900" : "bg-gray-50",
          )}
        >
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default LecturerDashboard;
