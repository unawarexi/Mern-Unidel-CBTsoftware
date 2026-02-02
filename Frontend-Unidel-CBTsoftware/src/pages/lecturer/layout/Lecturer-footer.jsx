import React from "react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Footer = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <footer
      className={cn(
        "body-font transition-colors duration-300",
        isDarkMode ? "bg-slate-950 text-white" : "bg-[#072146] text-white",
      )}
    >
      <div className="container px-3 sm:px-5 py-3 sm:py-4 mx-auto flex items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-2 sm:mr-3",
              isDarkMode ? "bg-orange-600" : "bg-indigo-600",
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 sm:w-6 sm:h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2L2 7l10 5 10-5-10-5z"
              />
            </svg>
          </div>
          <span className="ml-2 sm:ml-3 text-base sm:text-xl font-semibold">
            UNIDEL - Lecturer
          </span>
        </div>

        <p
          className={cn(
            "text-xs sm:text-sm sm:ml-4 sm:pl-4 sm:py-2 sm:mt-0 mt-3",
            isDarkMode
              ? "text-slate-400 sm:border-l sm:border-slate-700"
              : "text-slate-300 sm:border-l sm:border-slate-700",
          )}
        >
          {new Date().getFullYear()} UNIDEL —{" "}
          <span
            className={
              isDarkMode ? "text-slate-400 ml-1" : "text-slate-300 ml-1"
            }
          >
            Faculty Portal
          </span>
        </p>

        <div className="inline-flex sm:ml-auto sm:mt-0 mt-3 justify-center sm:justify-start space-x-3 sm:space-x-4 text-xs sm:text-sm">
          <a
            href="#"
            className={cn(
              "transition-colors",
              isDarkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-300 hover:text-white",
            )}
          >
            Facebook
          </a>
          <a
            href="#"
            className={cn(
              "transition-colors",
              isDarkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-300 hover:text-white",
            )}
          >
            Twitter
          </a>
          <a
            href="#"
            className={cn(
              "transition-colors",
              isDarkMode
                ? "text-slate-400 hover:text-white"
                : "text-slate-300 hover:text-white",
            )}
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
