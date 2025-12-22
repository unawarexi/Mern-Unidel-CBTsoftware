import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, Database, FileText, Send, BarChart3, User, LogOut, ChevronDown, ChevronRight, Menu, X, GraduationCap, Eye, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthLogout } from "../../../store/auth-store";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  const { logout } = useAuthLogout();
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/lecturer/dashboard",
      subItems: [
        { title: "Assigned Courses", href: "/lecturer/dashboard/courses" },
        { title: "Active Exams", href: "/lecturer/dashboard/exams" },
        { title: "Submission Count", href: "/lecturer/dashboard/submissions" },
      ],
    },
    {
      id: "courses",
      title: "My Courses",
      icon: BookOpen,
      href: "/lecturer/courses",
      subItems: [
        { title: "Assigned Courses", href: "/lecturer/courses/assigned" },
        { title: "Department & Level", href: "/lecturer/courses/department" },
      ],
    },
    {
      id: "question-bank",
      title: "Question Bank",
      icon: Database,
      href: "/lecturer/questions",
      subItems: [
        { title: "Create/Edit Questions", href: "/lecturer/questions/manage" },
        { title: "Question Types", href: "/lecturer/questions/types" },
        { title: "Import/Export", href: "/lecturer/questions/import-export" },
      ],
    },
    {
      id: "exams",
      title: "Exams / Assessments",
      icon: FileText,
      href: "/lecturer/exams",
      subItems: [
        { title: "Create Exam", href: "/lecturer/exams/create" },
        { title: "Schedule Exam", href: "/lecturer/exams/schedule" },
        { title: "Activate/Deactivate", href: "/lecturer/exams/manage" },
      ],
    },
    {
      id: "submissions",
      title: "Submissions",
      icon: Send,
      href: "/lecturer/submissions",
      subItems: [
        { title: "Student Attempts", href: "/lecturer/submissions/attempts" },
        { title: "Auto-graded Scores", href: "/lecturer/submissions/auto-graded" },
        { title: "Manual Grading", href: "/lecturer/submissions/manual" },
      ],
    },
    {
      id: "reports",
      title: "Reports",
      icon: BarChart3,
      href: "/lecturer/reports",
      subItems: [
        { title: "Course Performance", href: "/lecturer/reports/performance" },
        { title: "Pass/Fail Distribution", href: "/lecturer/reports/distribution" },
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
        <div className="h-28 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 ">
          <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-md">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">UNIDEL</h1>
              <p className="text-xs text-gray-500">Lecturer Portal</p>
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
                onClick={() => item.subItems && toggleMenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-all group
                  ${expandedMenus[item.id] ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${expandedMenus[item.id] ? "text-orange-600" : "text-gray-500 group-hover:text-gray-700"}`} />
                  <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-medium text-sm truncate">
                    {item.title}
                  </motion.span>
                  {item.badge && (
                    <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="px-2 py-0.5 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                      {item.badge}
                    </motion.span>
                  )}
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
                        <a key={index} href={subItem.href} className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          {subItem.title}
                        </a>
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
          {bottomMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => (item.id === "logout" ? handleLogout() : item.subItems && toggleMenu(item.id))}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors
                  ${item.id === "logout" ? "text-red-600 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5" />
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

              {/* Profile Submenu */}
              <AnimatePresence>
                {item.subItems && expandedMenus[item.id] && !isCollapsed && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-8 mt-1 space-y-1 border-l-2 border-gray-200 pl-3">
                      {item.subItems.map((subItem, index) => (
                        <a key={index} href={subItem.href} className="block px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                          {subItem.title}
                        </a>
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
      <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={sidebarVariants} className="hidden lg:block" />
    </>
  );
};

export default Sidebar;
