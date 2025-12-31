import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Users, Building2, BookOpen, FileText, BarChart3, Upload, Shield, Settings, User, LogOut, ChevronDown, ChevronRight, Menu, X, GraduationCap } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthLogout } from "../../../store/auth-store";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

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
        { title: "All Exams", href: "/admin/exams/all" },
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
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-lg shadow-lg">
        {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 z-40" />}</AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-40 flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300`}
      >
        {/* Logo Section */}
        <div className="h-28 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50">
          <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">UNIDEL</h1>
              <p className="text-xs text-gray-500">Admin Portal</p>
            </div>
          </motion.div>

          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${!isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => (item.subItems ? toggleMenu(item.id) : navigate(item.href))}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all group
                  ${expandedMenus[item.id] ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className={`w-5 h-5 ${expandedMenus[item.id] ? "text-orange-600" : "text-gray-500 group-hover:text-gray-700"}`} />
                  <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-medium text-sm">
                    {item.title}
                  </motion.span>
                </div>
                {item.subItems && (
                  <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants}>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? "rotate-180" : ""}`} />
                  </motion.div>
                )}
              </button>

              {/* Submenu */}
              <AnimatePresence>
                {item.subItems && expandedMenus[item.id] && !isCollapsed && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                      {item.subItems.map((subItem, index) => (
                        <Link key={index} to={subItem.href} className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
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
        <div className="border-t border-gray-200 p-3 space-y-1 bg-gray-50">
          {bottomMenuItems.map((item) =>
            item.id === "logout" ? (
              <button
                key={item.id}
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-red-600 hover:bg-red-50"
              >
                <item.icon className="w-5 h-5" />
                <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-medium text-sm">
                  {item.title}
                </motion.span>
              </button>
            ) : (
              <Link
                key={item.id}
                to={item.href}
                className="flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5" />
                <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-medium text-sm">
                  {item.title}
                </motion.span>
              </Link>
            )
          )}
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={sidebarVariants} className="hidden lg:block" />
    </>
  );
};

export default Sidebar;
