import React from "react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Footer = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <footer
      className={cn(
        "border-t transition-colors duration-300",
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-white"
          : "bg-slate-900 border-slate-800 text-white",
      )}
    >
      <div className="container px-3 sm:px-5 py-3 sm:py-4 mx-auto flex items-center justify-between flex-col sm:flex-row">
        <div className="flex items-center">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-2 sm:mr-3 shadow-lg shadow-orange-500/20">
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
          <span className="ml-2 sm:ml-3 text-base sm:text-xl font-bold">
            UNIDEL
          </span>
        </div>

        <p className="text-xs sm:text-sm text-slate-400 sm:ml-4 sm:pl-4 sm:border-l sm:border-slate-700 sm:py-2 sm:mt-0 mt-3">
          © {new Date().getFullYear()} UNIDEL —{" "}
          <span className="text-slate-300 ml-1">Secure CBT Platform</span>
        </p>

        <div className="inline-flex sm:ml-auto sm:mt-0 mt-3 justify-center sm:justify-start space-x-3 sm:space-x-4 text-xs sm:text-sm">
          <a
            href="#"
            className="text-slate-400 hover:text-orange-400 transition-colors"
          >
            Facebook
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-orange-400 transition-colors"
          >
            Twitter
          </a>
          <a
            href="#"
            className="text-slate-400 hover:text-orange-400 transition-colors"
          >
            Instagram
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
