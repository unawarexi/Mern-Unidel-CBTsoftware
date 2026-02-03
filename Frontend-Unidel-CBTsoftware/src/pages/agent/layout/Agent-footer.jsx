import React from "react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AgentFooter = () => {
  const { isDarkMode } = useThemeStore();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "py-4 sm:py-6 px-4 sm:px-8 border-t transition-colors duration-300",
        isDarkMode
          ? "bg-slate-900 border-slate-800 text-slate-400"
          : "bg-white border-gray-200 text-gray-500",
      )}
    >
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs sm:text-sm order-2 sm:order-1">
          © {currentYear} UNIDEL CBT Software. All rights reserved.
        </p>
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm order-1 sm:order-2">
          <a href="/support" className="hover:text-blue-500 transition-colors">
            Support
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-blue-500 transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="/terms-of-service"
            className="hover:text-blue-500 transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AgentFooter;
