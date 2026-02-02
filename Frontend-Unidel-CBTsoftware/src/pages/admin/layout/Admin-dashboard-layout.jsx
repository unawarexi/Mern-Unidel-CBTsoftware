import React from "react";
import Sidebar from "../container/Admin-sidebar";
import AdminNavbar from "./Admin-navbar";
import Footer from "./Admin-footer";
import { Outlet } from "react-router-dom";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AdminDashboard = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col md:flex-row transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-gray-50",
      )}
    >
      {/* Sidebar - 100% width on mobile, 20% on md+ */}
      <aside
        className={cn(
          "border-r transition-colors duration-300",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200",
        )}
      >
        <Sidebar />
      </aside>

      {/* Main area now uses flex-1 so it fills remaining space */}
      <main className="w-full flex-1 min-h-screen flex flex-col">
        <AdminNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;
