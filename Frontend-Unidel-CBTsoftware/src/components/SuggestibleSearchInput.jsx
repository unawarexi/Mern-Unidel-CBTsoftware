import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "../core/lib/cn";
import useThemeStore from "../store/theme-store";

const SuggestibleSearchInput = ({
  value,
  onChange,
  suggestions = [],
  placeholder,
  label,
  disabled = false,
  className = "",
}) => {
  const { isDarkMode } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (value) {
      const filtered = suggestions.filter(
        (s) =>
          s.toLowerCase().includes(value.toLowerCase()) &&
          s.toLowerCase() !== value.toLowerCase(),
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions(suggestions);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {label && (
        <label
          className={cn(
            "block mb-1 sm:mb-2 font-medium text-xs sm:text-base",
            isDarkMode ? "text-slate-300" : "text-slate-700",
          )}
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={disabled}
          className={cn(
            "w-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base border rounded-lg focus:outline-none focus:ring-2 transition-colors pr-10",
            isDarkMode
              ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-orange-500/20"
              : "bg-white border-slate-300 text-slate-900 placeholder-gray-400 focus:border-blue-900 focus:ring-blue-900/20",
            disabled && "opacity-50 cursor-not-allowed",
          )}
          placeholder={placeholder}
        />
        <div
          className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          <ChevronDown
            size={16}
            className={cn(
              "transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
              isDarkMode ? "text-slate-500" : "text-gray-400",
            )}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && !disabled && filteredSuggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              "absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-lg border shadow-xl",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-slate-200",
            )}
          >
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-2 text-sm cursor-pointer transition-colors",
                  isDarkMode
                    ? "text-slate-300 hover:bg-slate-800 hover:text-white"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-900",
                )}
                onClick={() => {
                  onChange(suggestion);
                  setIsOpen(false);
                }}
              >
                {suggestion}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SuggestibleSearchInput;
