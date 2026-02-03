import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Database,
  FileText,
  Send,
  BarChart3,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Eye,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthLogout } from "../../../store/auth-store";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

const Sidebar = () => {
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
      href: "/lecturer/dashboard",
      subItems: [
        { title: "Overview", href: "/lecturer/dashboard/overview" },
        { title: "Active Exams", href: "/lecturer/dashboard/exams" },
        { title: "Recent Results", href: "/lecturer/dashboard/results" },
        { title: "System Notices", href: "/lecturer/dashboard/notices" },
      ],
    },
    {
      id: "courses",
      title: "Courses & Materials",
      icon: BookOpen,
      href: "/lecturer/courses",
      subItems: [
        { title: "Assigned Courses", href: "/lecturer/courses/assigned" },
        { title: "Department & Level", href: "/lecturer/courses/department" },
        { title: "Course Materials", href: "/lecturer/courses/materials" },
        { title: "Upload Materials", href: "/lecturer/courses/upload" },
        { title: "Student Enrollments", href: "/lecturer/courses/enrollments" },
        { title: "Lecturer Info", href: "/lecturer/courses/lecturers" },
      ],
    },
    {
      id: "question-bank",
      title: "Question Bank",
      icon: Database,
      href: "/lecturer/questions/manage",
      subItems: [
        { title: "Create/Edit Questions", href: "/lecturer/questions/manage" },
        { title: "Import/Export", href: "/lecturer/questions/import-export" },
        { title: "Uploaded Docs", href: "/lecturer/questions/docs" },
        { title: "Approval", href: "/lecturer/questions/approval" },
      ],
    },
    {
      id: "exams",
      title: "Exams & Assessments",
      icon: FileText,
      href: "/lecturer/exams",
      subItems: [
        { title: "Create Exam", href: "/lecturer/exams/create" },
        { title: "Schedule Exam", href: "/lecturer/exams/schedule" },
        { title: "Manage Exams", href: "/lecturer/exams/manage" },
        { title: "Exam Results", href: "/lecturer/exams/results" },
        { title: "Exam Analytics", href: "/lecturer/exams/analytics" },
        { title: "Exam Attachments", href: "/lecturer/exams/attachments" },
      ],
    },
    {
      id: "submissions",
      title: "Submissions & Grading",
      icon: Send,
      href: "/lecturer/submissions",
      subItems: [
        { title: "Student Attempts", href: "/lecturer/submissions/attempts" },
        {
          title: "Auto-graded Scores",
          href: "/lecturer/submissions/auto-graded",
        },
        { title: "Manual Grading", href: "/lecturer/submissions/manual" },
        { title: "Submission History", href: "/lecturer/submissions/history" },
      ],
    },
    {
      id: "reports",
      title: "Reports & Analytics",
      icon: BarChart3,
      href: "/lecturer/reports",
      subItems: [
        { title: "Course Performance", href: "/lecturer/reports/performance" },
        {
          title: "Pass/Fail Distribution",
          href: "/lecturer/reports/distribution",
        },
        { title: "Exam Statistics", href: "/lecturer/reports/statistics" },
        { title: "Export Reports", href: "/lecturer/reports/export" },
      ],
    },
    {
      id: "monitoring",
      title: "Exam Monitoring",
      icon: Eye,
      href: "/lecturer/monitoring",
      badge: "Live",
      subItems: [
        { title: "Real-time Monitoring", href: "/lecturer/monitoring/live" },
        { title: "Integrity Logs", href: "/lecturer/monitoring/integrity" },
      ],
    },
    {
      id: "support",
      title: "Support & Integrity",
      icon: ShieldCheck,
      href: "/lecturer/support",
      subItems: [
        { title: "Exam Integrity Policy", href: "/lecturer/support/integrity" },
        { title: "Help Center", href: "/lecturer/support/help" },
        { title: "Support Tickets", href: "/lecturer/support/tickets" },
        { title: "Announcements", href: "/lecturer/support/announcements" },
        { title: "System Messages", href: "/lecturer/support/system" },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      href: "/lecturer/profile",
      subItems: [
        { title: "Account Settings", href: "/lecturer/profile/settings" },
        { title: "Change Password", href: "/lecturer/profile/password" },
      ],
    },
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
      navigate("/lecturer-signin", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className={cn(
          "lg:hidden fixed top-3 sm:top-4 left-3 sm:left-4 z-50 p-1.5 sm:p-2 rounded-lg shadow-lg",
          isDarkMode ? "bg-slate-800 text-white" : "bg-gray-900 text-white",
        )}
      >
        {isMobileOpen ? (
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        ) : (
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
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
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
          "fixed left-0 top-0 h-screen z-40 flex flex-col transition-transform duration-300 border-r",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          isDarkMode
            ? "bg-slate-950 border-slate-800"
            : "bg-white border-gray-200",
        )}
      >
        {/* Logo Section */}
        <div
          className={cn(
            "h-20 sm:h-28 border-b flex items-center justify-between px-3 sm:px-4",
            isDarkMode
              ? "border-slate-800 bg-slate-900"
              : "border-gray-200 bg-gray-50",
          )}
        >
          <motion.div
            animate={isCollapsed ? "collapsed" : "expanded"}
            variants={contentVariants}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div
              className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md",
                isDarkMode
                  ? "bg-gradient-to-br from-orange-600 to-orange-700"
                  : "bg-gradient-to-br from-orange-500 to-orange-600",
              )}
            >
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
                Lecturer Portal
              </p>
            </div>
          </motion.div>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "hidden lg:flex p-2 rounded-lg transition-colors",
              isDarkMode ? "hover:bg-slate-800" : "hover:bg-gray-200",
            )}
          >
            <ChevronRight
              className={cn(
                "w-5 h-5 transition-transform duration-300",
                !isCollapsed && "rotate-180",
                isDarkMode ? "text-slate-400" : "text-gray-600",
              )}
            />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3 space-y-0.5 sm:space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() =>
                  item.subItems ? toggleMenu(item.id) : navigate(item.href)
                }
                className={cn(
                  "w-full flex items-center justify-between px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-all group",
                  expandedMenus[item.id]
                    ? isDarkMode
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-orange-50 text-orange-600"
                    : isDarkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <item.icon
                    className={cn(
                      "w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0",
                      expandedMenus[item.id]
                        ? isDarkMode
                          ? "text-orange-400"
                          : "text-orange-600"
                        : isDarkMode
                          ? "text-slate-500 group-hover:text-slate-300"
                          : "text-gray-500 group-hover:text-gray-700",
                    )}
                  />
                  <motion.span
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="font-medium text-xs sm:text-sm truncate"
                  >
                    {item.title}
                  </motion.span>
                  {item.badge && (
                    <motion.span
                      animate={isCollapsed ? "collapsed" : "expanded"}
                      variants={contentVariants}
                      className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold bg-green-100 text-green-700 rounded-full"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                {item.subItems && (
                  <motion.div
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                  >
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200",
                        expandedMenus[item.id] && "rotate-180",
                      )}
                    />
                  </motion.div>
                )}
              </button>

              {/* Submenu */}
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
                        "ml-6 sm:ml-8 mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1 border-l-2 pl-2 sm:pl-3",
                        isDarkMode ? "border-slate-700" : "border-gray-200",
                      )}
                    >
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.href}
                          className={cn(
                            "block px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors",
                            isDarkMode
                              ? "text-slate-400 hover:text-orange-400 hover:bg-orange-500/10"
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
        </nav>

        {/* Bottom Menu */}
        <div
          className={cn(
            "border-t p-2 sm:p-3 space-y-0.5 sm:space-y-1",
            isDarkMode
              ? "border-slate-800 bg-slate-900"
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
                  "w-full flex items-center justify-between px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg transition-colors",
                  item.id === "logout"
                    ? "text-red-500 hover:bg-red-50"
                    : isDarkMode
                      ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-100",
                )}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <motion.span
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                    className="font-medium text-xs sm:text-sm"
                  >
                    {item.title}
                  </motion.span>
                </div>
                {item.subItems && (
                  <motion.div
                    animate={isCollapsed ? "collapsed" : "expanded"}
                    variants={contentVariants}
                  >
                    <ChevronDown
                      className={cn(
                        "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-200",
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
                        "ml-6 sm:ml-8 mt-0.5 sm:mt-1 space-y-0.5 sm:space-y-1 border-l-2 pl-2 sm:pl-3",
                        isDarkMode ? "border-slate-700" : "border-gray-200",
                      )}
                    >
                      {item.subItems.map((subItem, index) => (
                        <Link
                          key={index}
                          to={subItem.href}
                          className={cn(
                            "block px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg transition-colors",
                            isDarkMode
                              ? "text-slate-400 hover:text-orange-400 hover:bg-orange-500/10"
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
