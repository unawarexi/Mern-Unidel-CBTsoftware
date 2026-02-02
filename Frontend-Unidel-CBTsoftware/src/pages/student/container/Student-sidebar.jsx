import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuthLogout } from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";
import { StudentIcons } from "../components/icons";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { isDarkMode } = useThemeStore();
  // Simulated notifications count
  const notificationsCount = 3;

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: StudentIcons.Dashboard,
      href: "/student/dashboard",
      subItems: [
        { title: "Overview", href: "/student/dashboard/overview" },
        { title: "Active Exams", href: "/student/dashboard/active" },
        { title: "Recent Results", href: "/student/dashboard/results" },
        { title: "System Notices", href: "/student/dashboard/notices" },
      ],
    },
    {
      id: "courses",
      title: "Courses",
      icon: StudentIcons.Courses,
      href: "/student/courses",
      subItems: [
        { title: "My Enrollments", href: "/student/courses/enrolled" },
        { title: "Course Materials", href: "/student/courses/materials" },
        { title: "Lecturer Info", href: "/student/courses/lecturers" },
      ],
    },
    {
      id: "exams",
      title: "Exams",
      icon: StudentIcons.Exams,
      href: "/student/exams",
      subItems: [
        { title: "Upcoming Exams", href: "/student/exams/upcoming" },
        { title: "Active Exams", href: "/student/exams/active" },
        { title: "Completed Exams", href: "/student/exams/completed" },
        { title: "Exam History", href: "/student/exams/history" },
      ],
    },
    {
      id: "results",
      title: "Results & Analytics",
      icon: StudentIcons.Analytics,
      href: "/student/results",
      subItems: [
        { title: "All Results", href: "/student/results/all" },
        { title: "By Course", href: "/student/results/courses" },
        { title: "Performance Analytics", href: "/student/results/analytics" },
      ],
    },
    {
      id: "documents",
      title: "Documents",
      icon: StudentIcons.Documents,
      href: "/student/documents",
      subItems: [
        { title: "My Uploads", href: "/student/documents/uploads" },
        { title: "Exam Attachments", href: "/student/documents/attachments" },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: StudentIcons.Notifications,
      href: "/student/notifications",
      badge: notificationsCount > 0 ? notificationsCount : null,
      subItems: [
        { title: "Reminders", href: "/student/notifications/reminders" },
        { title: "System Messages", href: "/student/notifications/system" },
        {
          title: "Announcements",
          href: "/student/notifications/announcements",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Integrity",
      icon: StudentIcons.Support,
      href: "/student/support",
      subItems: [
        { title: "Exam Integrity Policy", href: "/student/support/integrity" },
        { title: "Help & Support", href: "/student/support/help" },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: StudentIcons.Profile,
      href: "/student/profile",
      subItems: [
        { title: "Account Info", href: "/student/profile/info" },
        { title: "Change Password", href: "/student/profile/password" },
        { title: "Settings", href: "/student/profile/settings" },
      ],
    },
    {
      id: "logout",
      title: "Logout",
      icon: StudentIcons.Logout,
      href: "/logout",
    },
  ];

  const { logout } = useAuthLogout();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      navigate("/portal-signin", { replace: true });
    }
  };

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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all",
          isDarkMode
            ? "bg-slate-800 text-white"
            : "bg-gradient-to-br from-gray-900 to-gray-800 text-white",
        )}
      >
        {isMobileOpen ? (
          <StudentIcons.X className="w-5 h-5" />
        ) : (
          <StudentIcons.Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
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

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "fixed left-0 top-0 h-screen border-r z-40 flex flex-col transition-transform duration-300",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-gradient-to-b from-white to-gray-50 border-gray-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo Section with Modern Gradient */}
        <div
          className={cn(
            "h-24 border-b flex items-center justify-between px-4",
            isDarkMode
              ? "border-slate-800 bg-slate-900"
              : "border-gray-200 bg-orange-50/50",
          )}
        >
          <motion.div
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={contentVariants}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <StudentIcons.Logo className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1
                className={cn(
                  "font-bold text-lg",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                UNIDEL
              </h1>
              <p className="text-xs font-medium text-orange-600">
                Student Portal
              </p>
            </div>
          </motion.div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex p-2 rounded-lg transition-all shadow-sm hover:shadow",
              isDarkMode
                ? "hover:bg-slate-800 text-slate-400"
                : "hover:bg-white text-gray-600",
            )}
          >
            <StudentIcons.ChevronRight
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                !isCollapsed && "rotate-180",
              )}
            />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.subItems ? toggleMenu(item.id) : navigate(item.href)
                }
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group relative overflow-hidden",
                  expandedMenus[item.id]
                    ? isDarkMode
                      ? "bg-orange-500/10 text-orange-500"
                      : "bg-orange-50 text-orange-600 shadow-sm"
                    : isDarkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                  <div
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      expandedMenus[item.id]
                        ? isDarkMode
                          ? "bg-orange-500/20"
                          : "bg-orange-100"
                        : isDarkMode
                          ? "bg-slate-800 group-hover:bg-slate-700"
                          : "bg-gray-100 group-hover:bg-gray-200",
                    )}
                  >
                    <item.icon
                      className={cn(
                        "w-4 h-4",
                        expandedMenus[item.id]
                          ? "text-orange-500"
                          : isDarkMode
                            ? "text-slate-500 group-hover:text-slate-300"
                            : "text-gray-500 group-hover:text-gray-700",
                      )}
                    />
                  </div>
                  <motion.span
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="font-semibold text-sm truncate"
                  >
                    {item.title}
                  </motion.span>
                  {item.badge && (
                    <motion.span
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      variants={contentVariants}
                      className={cn(
                        "px-2 py-0.5 text-xs font-bold rounded-full",
                        typeof item.badge === "number"
                          ? "bg-orange-500 text-white"
                          : "bg-emerald-500/20 text-emerald-500",
                      )}
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                {item.subItems && (
                  <motion.div
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="relative z-10"
                  >
                    <StudentIcons.ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        expandedMenus[item.id] && "rotate-180",
                      )}
                    />
                  </motion.div>
                )}
              </button>

              {/* Submenu with Modern Design */}
              <AnimatePresence>
                {item.subItems && expandedMenus[item.id] && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "ml-8 mt-1.5 space-y-0.5 border-l-2 pl-3",
                        isDarkMode ? "border-slate-800" : "border-orange-100",
                      )}
                    >
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.href}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2.5 text-sm rounded-lg transition-all group",
                            isDarkMode
                              ? "text-slate-400 hover:text-orange-500 hover:bg-slate-800/50"
                              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                          )}
                        >
                          {/* {subItem.icon && <subItem.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-400 group-hover:text-orange-500" />} */}
                          <span>{subItem.title}</span>
                          {/* {subItem.badge && <span className="ml-auto px-1.5 py-0.5 text-[10px] sm:text-xs font-bold bg-green-100 text-green-700 rounded-full">{subItem.badge}</span>} */}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom Menu with Enhanced Design */}
        <div
          className={cn(
            "border-t p-3 space-y-1.5",
            isDarkMode
              ? "border-slate-800 bg-slate-900/50"
              : "border-gray-200 bg-gray-50",
          )}
        >
          {bottomMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.id === "logout"
                    ? handleLogout()
                    : item.subItems && toggleMenu(item.id)
                }
                className={cn(
                  "w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all",
                  item.id === "logout"
                    ? isDarkMode
                      ? "text-red-400 hover:bg-red-500/10"
                      : "text-red-600 hover:bg-red-50"
                    : isDarkMode
                      ? "text-slate-400 hover:bg-slate-800"
                      : "text-gray-600 hover:bg-white hover:shadow-sm",
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "p-1.5 rounded-lg transition-colors",
                      item.id === "logout"
                        ? isDarkMode
                          ? "bg-red-500/20"
                          : "bg-red-50"
                        : isDarkMode
                          ? "bg-slate-800"
                          : "bg-gray-200",
                    )}
                  >
                    <item.icon className="w-4 h-4" />
                  </div>
                  <motion.span
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="font-semibold text-sm"
                  >
                    {item.title}
                  </motion.span>
                </div>
                {item.subItems && (
                  <motion.div
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                  >
                    <StudentIcons.ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform duration-200",
                        expandedMenus[item.id] && "rotate-180",
                      )}
                    />
                  </motion.div>
                )}
              </button>

              {/* Profile Submenu */}
              <AnimatePresence>
                {item.subItems && expandedMenus[item.id] && !isCollapsed && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div
                      className={cn(
                        "ml-8 mt-1.5 space-y-0.5 border-l-2 pl-3",
                        isDarkMode ? "border-slate-800" : "border-gray-200",
                      )}
                    >
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.href}
                          className={cn(
                            "block px-3 py-2.5 text-sm rounded-lg transition-all",
                            isDarkMode
                              ? "text-slate-400 hover:text-orange-500 hover:bg-slate-800/50"
                              : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                          )}
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <motion.div
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        className="hidden lg:block"
      />
    </>
  );
};

export default Sidebar;
