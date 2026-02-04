/**
 * MegaNavbar Component
 * Full-featured mega menu navigation for university landing pages
 */
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "../store/theme-store";
import { cn } from "../core/lib/cn";
import {
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  GraduationCap,
  Users,
  FlaskConical,
  Building2,
  UserPlus,
  BookOpen,
  Calendar,
  Library,
  Microscope,
  FileText,
  DollarSign,
  Award,
  Globe,
  MapPin,
  Home,
  Coffee,
  PartyPopper,
  Briefcase,
  HelpCircle,
  Newspaper,
  Shield,
  Phone,
  School,
} from "lucide-react";

// Mega menu data structure
const megaMenuData = {
  academics: {
    title: "Academics",
    icon: GraduationCap,
    description: "Explore our world-class academic programs",
    sections: [
      {
        title: "Programs",
        links: [
          {
            label: "Undergraduate Programs",
            href: "/academics/programs",
            icon: BookOpen,
          },
          {
            label: "Graduate Studies",
            href: "/academics/programs",
            icon: GraduationCap,
          },
          {
            label: "Professional Certificates",
            href: "/academics/programs",
            icon: Award,
          },
          {
            label: "Online Learning",
            href: "/academics/resources",
            icon: Globe,
          },
        ],
      },
      {
        title: "Academic Resources",
        links: [
          {
            label: "Academic Calendar",
            href: "/academics/resources",
            icon: Calendar,
          },
          {
            label: "Course Catalog",
            href: "/academics/resources",
            icon: FileText,
          },
          {
            label: "Digital Library",
            href: "/academics/resources",
            icon: Library,
          },
          {
            label: "Study Guides",
            href: "/academics/resources",
            icon: BookOpen,
          },
        ],
      },
      {
        title: "Departments",
        links: [
          {
            label: "All Departments",
            href: "/academics/departments",
            icon: Building2,
          },
          {
            label: "Faculty Directory",
            href: "/academics/departments",
            icon: Users,
          },
          {
            label: "Research Centers",
            href: "/research/centers",
            icon: Microscope,
          },
        ],
      },
    ],
  },
  admissions: {
    title: "Admissions",
    icon: UserPlus,
    description: "Begin your journey at UNIDEL",
    sections: [
      {
        title: "Apply",
        links: [
          { label: "Apply Now", href: "/auth/selection", icon: FileText },
          {
            label: "Admission Requirements",
            href: "/admissions/requirements",
            icon: FileText,
          },
          {
            label: "Application Deadlines",
            href: "/admissions/requirements",
            icon: Calendar,
          },
          {
            label: "Check Application Status",
            href: "/portal-signin",
            icon: HelpCircle,
          },
        ],
      },
      {
        title: "Financial Information",
        links: [
          {
            label: "Tuition & Fees",
            href: "/admissions/fees",
            icon: DollarSign,
          },
          {
            label: "Scholarships",
            href: "/admissions/scholarships",
            icon: Award,
          },
          {
            label: "Financial Aid",
            href: "/admissions/scholarships",
            icon: DollarSign,
          },
          {
            label: "Payment Plans",
            href: "/admissions/fees",
            icon: DollarSign,
          },
        ],
      },
      {
        title: "Special Programs",
        links: [
          {
            label: "International Students",
            href: "/admissions/requirements",
            icon: Globe,
          },
          {
            label: "Transfer Students",
            href: "/admissions/requirements",
            icon: Users,
          },
          {
            label: "Mature Students",
            href: "/admissions/requirements",
            icon: Users,
          },
        ],
      },
    ],
  },
  studentLife: {
    title: "Student Life",
    icon: Users,
    description: "Experience campus life at UNIDEL",
    sections: [
      {
        title: "Campus",
        links: [
          { label: "Campus Tour", href: "/student-life/campus", icon: MapPin },
          {
            label: "Housing & Accommodation",
            href: "/student-life/housing",
            icon: Home,
          },
          {
            label: "Dining Services",
            href: "/student-life/campus",
            icon: Coffee,
          },
          {
            label: "Campus Facilities",
            href: "/student-life/campus",
            icon: Building2,
          },
        ],
      },
      {
        title: "Activities",
        links: [
          {
            label: "Student Organizations",
            href: "/student-life/organizations",
            icon: Users,
          },
          {
            label: "Events & Activities",
            href: "/about/news",
            icon: PartyPopper,
          },
          {
            label: "Sports & Recreation",
            href: "/student-life/campus",
            icon: Award,
          },
          {
            label: "Cultural Programs",
            href: "/student-life/organizations",
            icon: Globe,
          },
        ],
      },
      {
        title: "Support",
        links: [
          {
            label: "Career Services",
            href: "/careers",
            icon: Briefcase,
          },
          { label: "Health Services", href: "/support", icon: HelpCircle },
          { label: "Counseling", href: "/support", icon: HelpCircle },
          {
            label: "Disability Services",
            href: "/support",
            icon: HelpCircle,
          },
        ],
      },
    ],
  },
  research: {
    title: "Research",
    icon: FlaskConical,
    description: "Pioneering research and innovation",
    sections: [
      {
        title: "Research Areas",
        links: [
          {
            label: "Research Centers",
            href: "/research/centers",
            icon: Microscope,
          },
          {
            label: "Laboratories",
            href: "/research/centers",
            icon: FlaskConical,
          },
          { label: "Publications", href: "/research", icon: FileText },
          { label: "Research Grants", href: "/research", icon: Award },
        ],
      },
      {
        title: "Innovation",
        links: [
          {
            label: "Innovation Hub",
            href: "/research/centers",
            icon: FlaskConical,
          },
          {
            label: "Industry Partnerships",
            href: "/research",
            icon: Briefcase,
          },
          {
            label: "Technology Transfer",
            href: "/research",
            icon: Globe,
          },
        ],
      },
    ],
  },
  about: {
    title: "About",
    icon: Building2,
    description: "Learn about our university",
    sections: [
      {
        title: "About UNIDEL",
        links: [
          { label: "Our History", href: "/about", icon: Building2 },
          { label: "Vision & Mission", href: "/about", icon: Award },
          { label: "Leadership", href: "/about", icon: Users },
          { label: "Accreditation", href: "/about", icon: Shield },
        ],
      },
      {
        title: "News & Media",
        links: [
          { label: "News & Updates", href: "/about/news", icon: Newspaper },
          { label: "Press Releases", href: "/about/news", icon: FileText },
          { label: "Photo Gallery", href: "/about/news", icon: Building2 },
          { label: "Media Contacts", href: "/contact", icon: Phone },
        ],
      },
      {
        title: "Contact",
        links: [
          { label: "Contact Us", href: "/contact", icon: Phone },
          { label: "Locations", href: "/contact", icon: MapPin },
          { label: "Help Center", href: "/support", icon: HelpCircle },
        ],
      },
    ],
  },
};

const MegaNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileActiveMenu, setMobileActiveMenu] = useState(null);
  const menuRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveMenu(null);
    setMobileActiveMenu(null);
  }, [location.pathname]);

  const handleMenuHover = (menuKey) => {
    setActiveMenu(menuKey);
  };

  const handleMenuLeave = () => {
    setActiveMenu(null);
  };

  const toggleMobileSubmenu = (menuKey) => {
    setMobileActiveMenu(mobileActiveMenu === menuKey ? null : menuKey);
  };

  return (
    <header
      ref={menuRef}
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isDarkMode
          ? "bg-slate-900/95 backdrop-blur-md border-b border-slate-800"
          : "bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm",
      )}
    >
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
              <School className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <span
                className={cn(
                  "text-xl lg:text-2xl font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                UNIDEL
              </span>
              <span className="text-orange-500 font-bold ml-1">CBT</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-3"
            onMouseLeave={handleMenuLeave}
          >
            {Object.entries(megaMenuData).map(([key, menu]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleMenuHover(key)}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-lg font-medium text-sm transition-all",
                    activeMenu === key
                      ? isDarkMode
                        ? "bg-slate-800 text-white"
                        : "bg-orange-50 text-orange-600"
                      : isDarkMode
                        ? "text-gray-300 hover:text-white hover:bg-slate-800"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                  )}
                >
                  <menu.icon className="w-4 h-4" />
                  {menu.title}
                  <ChevronDown
                    className={cn(
                      "w-3.5 h-3.5 transition-transform",
                      activeMenu === key && "rotate-180",
                    )}
                  />
                </button>
              </div>
            ))}

            {/* Direct Links */}
            <Link
              to="/portal-signin"
              className={cn(
                "px-4 py-2 rounded-lg font-medium text-sm transition-all",
                isDarkMode
                  ? "text-gray-300 hover:text-white hover:bg-slate-800"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              Student Portal
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              )}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* Login Split Button */}
            <div className="relative group flex items-center">
              <Link
                to="/auth/selection"
                className={cn(
                  "hidden sm:inline-flex items-center px-4 py-2 rounded-l-lg font-medium text-sm transition-all border-r border-gray-200 dark:border-slate-700",
                  activeMenu === "login"
                    ? isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-slate-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                Login
              </Link>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setActiveMenu(activeMenu === "login" ? null : "login");
                }}
                className={cn(
                  "hidden sm:inline-flex items-center px-2 py-2.5 rounded-r-lg font-medium text-sm transition-all",
                  activeMenu === "login"
                    ? isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900"
                    : isDarkMode
                      ? "text-gray-300 hover:text-white hover:bg-slate-800"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50",
                )}
              >
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    activeMenu === "login" && "rotate-180",
                  )}
                />
              </button>

              {/* Login Dropdown Content */}
              <AnimatePresence>
                {activeMenu === "login" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute right-0 top-full mt-2 w-56 rounded-xl border shadow-xl p-2 z-50",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <Link
                      to="/portal-signin"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <Users className="w-4 h-4 text-orange-500" /> Student
                      Portal
                    </Link>
                    <Link
                      to="/signin-agent"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <Globe className="w-4 h-4 text-purple-500" /> Agent Portal
                    </Link>
                    <Link
                      to="/lecturer-signin"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <GraduationCap className="w-4 h-4 text-indigo-500" />{" "}
                      Staff Portal
                    </Link>
                    <Link
                      to="/admin-signin"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <Shield className="w-4 h-4 text-red-500" /> Admin Portal
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Apply Dropdown */}
            <div className="relative group">
              <button
                onClick={() =>
                  setActiveMenu(activeMenu === "apply" ? null : "apply")
                }
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg shadow-orange-500/20"
              >
                Apply Now{" "}
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform",
                    activeMenu === "apply" && "rotate-180",
                  )}
                />
              </button>

              {/* Apply Dropdown Content */}
              <AnimatePresence>
                {activeMenu === "apply" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute right-0 top-full mt-2 w-64 rounded-xl border shadow-xl p-2 z-50",
                      isDarkMode
                        ? "bg-slate-900 border-slate-800"
                        : "bg-white border-gray-100",
                    )}
                  >
                    <Link
                      to="/apply"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600">
                        <UserPlus className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Student Admission</div>
                        <div className="text-xs text-gray-500">
                          Undergraduate & Postgrad
                        </div>
                      </div>
                    </Link>
                    <Link
                      to="/agent-signup"
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors mt-1",
                        isDarkMode
                          ? "hover:bg-slate-800 text-gray-300"
                          : "hover:bg-gray-50 text-gray-700",
                      )}
                    >
                      <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold">Become an Agent</div>
                        <div className="text-xs text-gray-500">
                          Partner with UNIDEL
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-lg transition-colors",
                isDarkMode
                  ? "text-gray-400 hover:text-white hover:bg-slate-800"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
              )}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && megaMenuData[activeMenu] && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute left-0 right-0 top-full z-50 border-t",
                isDarkMode
                  ? "bg-slate-900 border-slate-800"
                  : "bg-white border-gray-100 shadow-xl",
              )}
              onMouseEnter={() => setActiveMenu(activeMenu)}
              onMouseLeave={handleMenuLeave}
            >
              <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Menu Header */}
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-700">
                  <div>
                    <h3
                      className={cn(
                        "text-xl font-bold mb-1",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {megaMenuData[activeMenu].title}
                    </h3>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {megaMenuData[activeMenu].description}
                    </p>
                  </div>
                </div>

                {/* Menu Sections */}
                <div className="grid grid-cols-3 gap-8">
                  {megaMenuData[activeMenu].sections.map((section, idx) => (
                    <div key={idx}>
                      <h4
                        className={cn(
                          "text-xs font-bold uppercase tracking-wider mb-3",
                          isDarkMode ? "text-gray-500" : "text-gray-400",
                        )}
                      >
                        {section.title}
                      </h4>
                      <ul className="space-y-1">
                        {section.links.map((link, linkIdx) => (
                          <li key={linkIdx}>
                            <Link
                              to={link.href}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group",
                                isDarkMode
                                  ? "hover:bg-slate-800 text-gray-300 hover:text-white"
                                  : "hover:bg-orange-50 text-gray-700 hover:text-orange-600",
                              )}
                            >
                              <link.icon
                                className={cn(
                                  "w-5 h-5 transition-colors",
                                  isDarkMode
                                    ? "text-gray-500 group-hover:text-orange-400"
                                    : "text-gray-400 group-hover:text-orange-500",
                                )}
                              />
                              <span className="text-sm font-medium">
                                {link.label}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "lg:hidden border-t overflow-hidden",
              isDarkMode
                ? "bg-slate-900 border-slate-800"
                : "bg-white border-gray-100",
            )}
          >
            <div className="px-4 py-4 space-y-2 max-h-[70vh] overflow-y-auto">
              {Object.entries(megaMenuData).map(([key, menu]) => (
                <div key={key}>
                  <button
                    onClick={() => toggleMobileSubmenu(key)}
                    className={cn(
                      "flex items-center justify-between w-full px-4 py-3 rounded-lg font-medium text-left",
                      mobileActiveMenu === key
                        ? isDarkMode
                          ? "bg-slate-800 text-white"
                          : "bg-orange-50 text-orange-600"
                        : isDarkMode
                          ? "text-gray-300"
                          : "text-gray-700",
                    )}
                  >
                    <span className="flex items-center gap-3">
                      <menu.icon className="w-5 h-5" />
                      {menu.title}
                    </span>
                    <ChevronDown
                      className={cn(
                        "w-4 h-4 transition-transform",
                        mobileActiveMenu === key && "rotate-180",
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileActiveMenu === key && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pl-4 pt-2 pb-2 space-y-4">
                          {menu.sections.map((section, idx) => (
                            <div key={idx}>
                              <h5
                                className={cn(
                                  "text-xs font-bold uppercase tracking-wider mb-2 px-4",
                                  isDarkMode
                                    ? "text-gray-500"
                                    : "text-gray-400",
                                )}
                              >
                                {section.title}
                              </h5>
                              <ul className="space-y-1">
                                {section.links.map((link, linkIdx) => (
                                  <li key={linkIdx}>
                                    <Link
                                      to={link.href}
                                      className={cn(
                                        "flex items-center gap-3 px-4 py-2 rounded-lg text-sm",
                                        isDarkMode
                                          ? "text-gray-400 hover:text-white hover:bg-slate-800"
                                          : "text-gray-600 hover:text-orange-600 hover:bg-orange-50",
                                      )}
                                    >
                                      <link.icon className="w-4 h-4" />
                                      {link.label}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Mobile CTA */}
              <div className="pt-4 border-t border-gray-200 dark:border-slate-700">
                <Link
                  to="/auth/selection"
                  className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-lg"
                >
                  Apply Now
                </Link>
                <Link
                  to="/portal-signin"
                  className={cn(
                    "block w-full text-center px-4 py-3 mt-2 rounded-lg font-medium",
                    isDarkMode
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-900",
                  )}
                >
                  Student Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default MegaNavbar;
