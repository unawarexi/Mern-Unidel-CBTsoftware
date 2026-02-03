import React from "react";
import Sidebar from "../container/Agent-sidebar";
import AgentNavbar from "./Agent-navbar";
import Footer from "./Agent-footer";
import { Outlet } from "react-router-dom";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AgentDashboardLayout = () => {
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
          "border-r transition-colors duration-300",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200",
        )}
      >
        <Sidebar />
      </aside>

      <main className="w-full flex-1 min-h-screen flex flex-col">
        <AgentNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default AgentDashboardLayout;
