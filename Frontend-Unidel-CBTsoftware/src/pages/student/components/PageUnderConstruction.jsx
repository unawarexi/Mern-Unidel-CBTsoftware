import React from "react";
import StudentPage from "./StudentPage";
import { StudentIcons } from "./icons";
import { Link } from "react-router-dom";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const PageUnderConstruction = ({ title, icon }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <StudentPage
      title={title}
      icon={icon || StudentIcons.Dashboard}
      subtitle="This section is currently being improved."
    >
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div
          className={cn(
            "w-24 h-24 rounded-full flex items-center justify-center mb-6",
            isDarkMode ? "bg-slate-800" : "bg-gray-50",
          )}
        >
          {icon ? (
            React.createElement(icon, { className: "w-10 h-10 text-gray-400" })
          ) : (
            <StudentIcons.Settings className="w-10 h-10 text-gray-400 rotate-90 animate-spin-slow" />
          )}
        </div>
        <h3
          className={cn(
            "text-xl font-bold mb-2",
            isDarkMode ? "text-white" : "text-gray-900",
          )}
        >
          Coming Soon
        </h3>
        <p className="text-gray-500 max-w-sm mb-8">
          We are working hard to bring you the best experience for this section.
          Please check back later.
        </p>
        <Link
          to="/student/dashboard"
          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-500/25 hover:scale-105 transition-transform"
        >
          Return to Dashboard
        </Link>
      </div>
    </StudentPage>
  );
};

export default PageUnderConstruction;
