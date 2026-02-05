import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  HelpCircle,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import useAuthStore, { useAuthLogout } from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const AgentSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { isDarkMode } = useThemeStore();

  const { logout } = useAuthLogout();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/agent/dashboard",
    },
    {
      id: "students",
      title: "Recruit Students",
      icon: Users,
      href: "/agent/students",
    },
    {
      id: "exams",
      title: "Exams Management",
      icon: FileText,
      href: "/agent/exams",
    },
    {
      id: "payments",
      title: "Payments & Subscription",
      icon: CreditCard,
      href: "/agent/payments",
    },
    {
      id: "support",
      title: "Support",
      icon: HelpCircle,
      href: "/agent/support",
    },
  ];

  const bottomMenuItems = [
    { id: "profile", title: "Profile", icon: User, href: "/agent/profile" },
    { id: "logout", title: "Logout", icon: LogOut, href: "/logout" },
  ];

  const toggleMenu = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  const sidebarVariants = {
    expanded: { width: "280px" },
    collapsed: { width: "80px" },
  };

  const contentVariants = {
    expanded: { opacity: 1, display: "block" },
    collapsed: { opacity: 0, transitionEnd: { display: "none" } },
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/signin-agent", { replace: true });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          "lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-50 p-1.5 sm:p-2 rounded-lg shadow-lg transition-colors",
          isDarkMode
            ? "bg-slate-800 text-white border border-slate-700"
            : "bg-gray-900 text-white",
        )}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        )}
      </button>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen z-40 flex flex-col border-r transition-colors duration-300",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300",
        )}
      >
        <div
          className={cn(
            "h-20 sm:h-28 border-b flex items-center justify-between px-3 sm:px-4 transition-colors",
            isDarkMode
              ? "border-slate-800 bg-slate-800/50"
              : "border-gray-200 bg-gray-50",
          )}
        >
          <motion.div
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={contentVariants}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1
                className={cn(
                  "font-bold text-base sm:text-lg",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                UNIDEL
              </h1>
              <p
                className={cn(
                  "text-[10px] sm:text-xs",
                  isDarkMode ? "text-slate-400" : "text-gray-500",
                )}
              >
                Agent Portal
              </p>
            </div>
          </motion.div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex p-2 rounded-lg transition-colors",
              isDarkMode
                ? "hover:bg-slate-700 text-slate-400"
                : "hover:bg-gray-200 text-gray-600",
            )}
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                !isCollapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3 space-y-0.5 sm:space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.subItems ? toggleMenu(item.id) : navigate(item.href)
                }
                className={cn(
                  "w-full flex items-center justify-between px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-all group",
                  expandedMenus[item.id]
                    ? isDarkMode
                      ? "bg-blue-500/10 text-blue-400"
                      : "bg-blue-50 text-blue-600"
                    : isDarkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <item.icon
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5",
                      expandedMenus[item.id]
                        ? "text-blue-500"
                        : isDarkMode
                          ? "text-slate-500 group-hover:text-slate-300"
                          : "text-gray-500 group-hover:text-gray-700",
                    )}
                  />
                  <motion.span
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="font-medium text-xs sm:text-sm"
                  >
                    {item.title}
                  </motion.span>
                </div>
              </button>
            </div>
          ))}
        </nav>

        <div
          className={cn(
            "border-t p-2 sm:p-3 space-y-0.5 sm:space-y-1 transition-colors",
            isDarkMode
              ? "border-slate-800 bg-slate-800/50"
              : "border-gray-200 bg-gray-50",
          )}
        >
          {bottomMenuItems.map((item) =>
            item.id === "logout" ? (
              <button
                key={item.id}
                onClick={handleLogout}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-colors w-full",
                  isDarkMode
                    ? "text-red-400 hover:bg-red-500/10"
                    : "text-red-600 hover:bg-red-50",
                )}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <motion.span
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  variants={contentVariants}
                  className="font-medium text-xs sm:text-sm"
                >
                  {item.title}
                </motion.span>
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className={cn(
                  "flex items-center gap-2 sm:gap-3 px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-xl transition-colors",
                  isDarkMode
                    ? "text-slate-400 hover:bg-slate-700 hover:text-white"
                    : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <motion.span
                  animate={isCollapsed ? "collapsed" : "expanded"}
                  variants={contentVariants}
                  className="font-medium text-xs sm:text-sm"
                >
                  {item.title}
                </motion.span>
              </Link>
            ),
          )}
        </div>
      </motion.aside>

      <motion.div
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="hidden lg:block"
      />
    </>
  );
};

export default AgentSidebar;
