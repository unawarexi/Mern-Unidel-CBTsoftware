import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, BookOpen, FileText, Trophy, User, LogOut, ChevronDown, ChevronRight, Menu, X, GraduationCap, Bell, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthLogout } from "../../../store/auth-store";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});

  // Simulated notifications count
  const notificationsCount = 3;

  const menuItems = [
    {
      id: "dashboard",
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/student/dashboard",
      subItems: [
        { title: "Exam Status Overview", href: "/student/dashboard/overview", icon: Clock },
        { title: "Upcoming Exams", href: "/student/dashboard/upcoming", icon: AlertCircle },
        { title: "Active Exams", href: "/student/dashboard/active", icon: Clock, badge: "Live" },
      ],
    },
    {
      id: "courses",
      title: "My Courses",
      icon: BookOpen,
      href: "/student/courses",
      subItems: [
        { title: "Enrolled Courses", href: "/student/courses/enrolled" },
        { title: "Course Details", href: "/student/courses/details" },
        { title: "Exam Availability", href: "/student/courses/exams" },
      ],
    },
    {
      id: "exams",
      title: "Exams / Assessments",
      icon: FileText,
      href: "/student/exams",
      subItems: [
        { title: "Available Exams", href: "/student/exams/available", icon: FileText },
        { title: "Completed Exams", href: "/student/exams/completed", icon: CheckCircle2 },
        { title: "Attempt History", href: "/student/exams/history" },
      ],
    },
    {
      id: "results",
      title: "Results",
      icon: Trophy,
      href: "/student/results",
      subItems: [
        { title: "All Scores", href: "/student/results/all" },
        { title: "Scores per Course", href: "/student/results/courses" },
        { title: "Exam Breakdown", href: "/student/results/breakdown" },
      ],
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: Bell,
      href: "/student/notifications",
      badge: notificationsCount > 0 ? notificationsCount : null,
      subItems: [
        { title: "Exam Reminders", href: "/student/notifications/reminders" },
        { title: "System Messages", href: "/student/notifications/system" },
        { title: "Announcements", href: "/student/notifications/announcements" },
      ],
    },
  ];

  const bottomMenuItems = [
    {
      id: "profile",
      title: "Profile",
      icon: User,
      href: "/student/profile",
      subItems: [
        { title: "Student Information", href: "/student/profile/info" },
        { title: "Change Password", href: "/student/profile/password" },
      ],
    },
    { id: "logout", title: "Logout", icon: LogOut, href: "/logout" },
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
      <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-xl shadow-lg hover:shadow-xl transition-all">
        {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>{isMobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileOpen(false)} className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />}</AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isCollapsed ? "collapsed" : "expanded"}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white to-gray-50 border-r border-gray-200  z-40 flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          transition-transform duration-300`}
      >
        {/* Logo Section with Modern Gradient */}
        <div className="h-28 border-b border-gray-200 flex items-center justify-between px-4 bg-gradient-to-r from-orange-50 to-orange-100/50">
          <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="flex items-center gap-3 ">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg">UNIDEL</h1>
              <p className="text-xs font-medium text-orange-600">Student Portal</p>
            </div>
          </motion.div>

          <button onClick={() => setIsCollapsed(!isCollapsed)} className="hidden lg:flex p-2 hover:bg-white rounded-lg transition-all shadow-sm hover:shadow">
            <ChevronRight className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${!isCollapsed ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* Main Menu */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => item.subItems && toggleMenu(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all group relative overflow-hidden
                  ${expandedMenus[item.id] ? "bg-gradient-to-r from-orange-50 to-orange-100 text-orange-600 shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1 relative z-10">
                  <div className={`p-1.5 rounded-lg ${expandedMenus[item.id] ? "bg-orange-200/50" : "bg-gray-100 group-hover:bg-gray-200"} transition-colors`}>
                    <item.icon className={`w-4 h-4 ${expandedMenus[item.id] ? "text-orange-600" : "text-gray-500 group-hover:text-gray-700"}`} />
                  </div>
                  <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-semibold text-sm truncate">
                    {item.title}
                  </motion.span>
                  {item.badge && (
                    <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className={`px-2 py-0.5 text-xs font-bold rounded-full ${typeof item.badge === "number" ? "bg-orange-500 text-white" : "bg-green-100 text-green-700"}`}>
                      {item.badge}
                    </motion.span>
                  )}
                </div>
                {item.subItems && (
                  <motion.div animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="relative z-10">
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expandedMenus[item.id] ? "rotate-180" : ""}`} />
                  </motion.div>
                )}
              </button>

              {/* Submenu with Modern Design */}
              <AnimatePresence>
                {item.subItems && expandedMenus[item.id] && !isCollapsed && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="ml-8 mt-1.5 space-y-0.5 border-l-2 border-orange-200 pl-3">
                      {item.subItems.map((subItem, index) => (
                        <a key={index} href={subItem.href} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group">
                          {subItem.icon && <subItem.icon className="w-3.5 h-3.5 text-gray-400 group-hover:text-orange-500" />}
                          <span>{subItem.title}</span>
                          {subItem.badge && <span className="ml-auto px-1.5 py-0.5 text-xs font-bold bg-green-100 text-green-700 rounded-full">{subItem.badge}</span>}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Bottom Menu with Enhanced Design */}
        <div className="border-t border-gray-200 p-3 space-y-1.5 bg-gradient-to-b from-gray-50 to-gray-100">
          {bottomMenuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => (item.id === "logout" ? handleLogout() : item.subItems && toggleMenu(item.id))}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl transition-all
                  ${item.id === "logout" ? "text-red-600 hover:bg-red-50 hover:shadow-sm" : "text-gray-600 hover:bg-white hover:shadow-sm"}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg ${item.id === "logout" ? "bg-red-50" : "bg-gray-200"} transition-colors`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <motion.span animate={isCollapsed ? "collapsed" : "expanded"} variants={contentVariants} className="font-semibold text-sm">
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
                    <div className="ml-8 mt-1.5 space-y-0.5 border-l-2 border-gray-300 pl-3">
                      {item.subItems.map((subItem, index) => (
                        <a key={index} href={subItem.href} className="block px-3 py-2.5 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all">
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
