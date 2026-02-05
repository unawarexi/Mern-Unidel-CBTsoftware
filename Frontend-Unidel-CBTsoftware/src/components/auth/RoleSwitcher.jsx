import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Shield, GraduationCap, Check } from "lucide-react";
import useAuthStore from "../../store/auth-store";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";

const RoleSwitcher = ({ variant = "default" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { user, activeRole, setActiveRole } = useAuthStore();
  const { isDarkMode } = useThemeStore();

  const roles = user?.roles || [];

  // Only show if user has multiple roles
  if (!roles || roles.length <= 1) return null;

  const handleSwitchRole = (role) => {
    setActiveRole(role);
    setIsOpen(false);

    // Redirect based on role
    switch (role) {
      case "admin":
      case "superadmin":
        navigate("/admin");
        break;
      case "student":
        navigate("/student");
        break;
      case "lecturer":
        navigate("/lecturer");
        break;
      default:
        navigate("/");
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return <Shield className="w-4 h-4" />;
      case "student":
        return <Users className="w-4 h-4" />;
      case "lecturer":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
      case "superadmin":
        return "Administrator";
      case "student":
        return "Student";
      case "lecturer":
        return "Lecturer";
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-xs font-medium border",
          isDarkMode
            ? "bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700"
            : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
          variant === "full" && "w-full justify-between",
        )}
      >
        <span className="flex items-center gap-2">
          {getRoleIcon(activeRole)}
          {getRoleLabel(activeRole)}
        </span>
        <span className="bg-orange-100 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
          Switch
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className={cn(
                "absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl p-1 z-50",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-100",
              )}
            >
              <div className="px-2 py-1.5 text-[10px] uppercase font-bold text-gray-500">
                Switch Role
              </div>
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleSwitchRole(role)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                    activeRole === role
                      ? isDarkMode
                        ? "bg-orange-500/10 text-orange-400"
                        : "bg-orange-50 text-orange-600"
                      : isDarkMode
                        ? "text-slate-300 hover:bg-slate-800"
                        : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className="flex items-center gap-2">
                    {getRoleIcon(role)}
                    {getRoleLabel(role)}
                  </span>
                  {activeRole === role && <Check className="w-3 h-3" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoleSwitcher;
