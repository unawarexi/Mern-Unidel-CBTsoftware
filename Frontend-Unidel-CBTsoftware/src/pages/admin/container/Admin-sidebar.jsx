import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  FileText,
  BarChart3,
  Upload,
  Shield,
  Settings,
  User,
  LogOut,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  Globe,
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
    // DASHBOARD
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin/dashboard",
      subItems: [
        { title: "Overview", href: "/admin/dashboard" },
        { title: "Live Activity Feed", href: "/admin/dashboard/activity" },
        { title: "System Health", href: "/admin/dashboard/health" },
      ],
    },
    // USER MANAGEMENT
    {
      id: "users",
      title: "User Management",
      icon: Users,
      href: "/admin/users",
      subItems: [
        { title: "Students", href: "/admin/users/students" },
        { title: "Lecturers", href: "/admin/users/lecturers" },
        { title: "Admins", href: "/admin/users/admins" },
        { title: "Agents", href: "/admin/users/agents" },
      ],
    },
    // DEPARTMENTS & FACULTIES
    {
      id: "departments",
      title: "Departments & Faculties",
      icon: Building2,
      href: "/admin/departments",
      subItems: [
        { title: "Manage Departments", href: "/admin/departments/manage" },
        { title: "Assign Courses", href: "/admin/departments/courses" },
      ],
    },
    // COURSES
    {
      id: "courses",
      title: "Courses",
      icon: BookOpen,
      href: "/admin/courses",
      subItems: [
        { title: "Course Creation", href: "/admin/courses/create" },
        { title: "Assign Lecturers/Students", href: "/admin/courses/assign" },
      ],
    },
    // EXAMS
    {
      id: "exams",
      title: "Exams",
      icon: FileText,
      href: "/admin/exams",
      subItems: [
        { title: "Scheduled Exams", href: "/admin/exams/scheduled" },
        { title: "Active Exams", href: "/admin/exams/active" },
        { title: "Ended Exams", href: "/admin/exams/ended" },
        { title: "Exam Results", href: "/admin/exams/results" },
        { title: "Exam Analytics", href: "/admin/exams/analytics" },
      ],
    },
    // QUESTION BANK
    {
      id: "question-bank",
      title: "Question Bank",
      icon: FileText,
      href: "/admin/question-bank",
      subItems: [
        { title: "Manage Question Banks", href: "/admin/question-bank/manage" },
        { title: "Pending Approvals", href: "/admin/question-bank/approvals" },
      ],
    },
    // CBT SESSIONS
    {
      id: "sessions",
      title: "CBT Sessions",
      icon: BarChart3,
      href: "/admin/sessions",
      subItems: [
        { title: "Academic Sessions", href: "/admin/sessions" },
        { title: "Session Settings", href: "/admin/settings/session" },
        { title: "Exam Rules", href: "/admin/settings/exam-rules" },
      ],
    },
    // AUDIT & LOGS
    {
      id: "audit",
      title: "Audit & Logs",
      icon: Shield,
      href: "/admin/audit",
      subItems: [
        { title: "Login Activity", href: "/admin/audit/logins" },
        { title: "Exam Submissions", href: "/admin/audit/submissions" },
        { title: "Security Events", href: "/admin/audit/security" },
      ],
    },
    // LANDING PAGE CONTENT
    {
      id: "content",
      title: "Landing Page Content",
      icon: Globe,
      href: "/admin/content",
      subItems: [
        { title: "Faculties", href: "/admin/content/faculties" },
        { title: "Scholarships", href: "/admin/content/scholarships" },
        { title: "Special Programs", href: "/admin/content/programs" },
        { title: "Governing Bodies", href: "/admin/content/governing-bodies" },
        { title: "Waitlist", href: "/admin/content/waitlist" },
        { title: "Support Tickets", href: "/admin/content/tickets" },
        {
          title: "Job Applications",
          href: "/admin/content/career-applications",
        },
      ],
    },
    // UPLOADS & DOCUMENTS
    {
      id: "uploads",
      title: "Uploads & Documents",
      icon: Upload,
      href: "/admin/uploads",
      subItems: [
        { title: "Student IDs", href: "/admin/uploads/student-ids" },
        { title: "Exam Attachments", href: "/admin/uploads/attachments" },
        { title: "Evidence Logs", href: "/admin/uploads/evidence" },
      ],
    },
    // SYSTEM SETTINGS
    {
      id: "settings",
      title: "System Settings",
      icon: Settings,
      href: "/admin/settings",
      subItems: [
        { title: "Timezone", href: "/admin/settings/timezone" },
        { title: "General Settings", href: "/admin/settings/general" },
      ],
    },
  ];

  const bottomMenuItems = [
    { id: "profile", title: "Profile", icon: User, href: "/admin/profile" },
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
      navigate("/admin-signin", { replace: true });
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
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
          "fixed left-0 top-0 h-screen z-40 flex flex-col border-r transition-colors duration-300",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-white border-gray-200",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          "transition-transform duration-300",
        )}
      >
        {/* Logo Section */}
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
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
                Admin Portal
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

        {/* Main Menu */}
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
                      ? "bg-orange-500/10 text-orange-400"
                      : "bg-orange-50 text-orange-600"
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
                        ? "text-orange-500"
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
