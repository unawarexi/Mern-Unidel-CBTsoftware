import React, { useState, useEffect, useRef } from "react";
import { Search, Globe, Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import useThemeStore from "../store/theme-store";

const Navbar = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPagesDropdownOpen, setIsPagesDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPagesDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const pagesMenuItems = [
    { label: "About Us", href: "#about", isRoute: false },
    { label: "Contact", href: "#contact", isRoute: false },
    { label: "Courses", href: "#courses", isRoute: false },
    { label: "Student Portal", href: "/portal-signin", isRoute: true },
    { label: "Faculty", href: "#faculties", isRoute: false },
    { label: "Admissions", href: "#contact", isRoute: false },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsPagesDropdownOpen(false);
  };

  const togglePagesDropdown = () => {
    setIsPagesDropdownOpen(!isPagesDropdownOpen);
  };

  const handlePageItemClick = (item) => {
    if (item.isRoute) {
      navigate(item.href);
    }
    setIsPagesDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white'} shadow-sm sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="/" className="flex items-center space-x-2 group">
              <span className={`text-2xl md:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>UNIDEL CBT</span>
              <span className="w-2 h-2 md:w-2.5 md:h-2.5 bg-orange-500 rounded-full group-hover:scale-110 transition-transform"></span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a href="#home" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Home
            </a>
            <a href="#courses" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Our Courses
            </a>

            {/* Pages Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button onClick={togglePagesDropdown} className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Pages
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isPagesDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {isPagesDropdownOpen && (
                <div className={`absolute top-full left-0 mt-2 w-48 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-100'} rounded-lg shadow-lg border py-2 animate-in fade-in slide-in-from-top-2`}>
                  {pagesMenuItems.map((item, index) => (
                    item.isRoute ? (
                      <Link
                        key={index}
                        to={item.href}
                        className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-slate-700 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} transition-colors`}
                        onClick={() => setIsPagesDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        key={index}
                        href={item.href}
                        className={`block px-4 py-2 ${isDarkMode ? 'text-gray-300 hover:bg-slate-700 hover:text-orange-400' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'} transition-colors`}
                        onClick={() => setIsPagesDropdownOpen(false)}
                      >
                        {item.label}
                      </a>
                    )
                  ))}
                </div>
              )}
            </div>

            <a href="#team" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Our Team
            </a>
            <a href="#pricing" className={`${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} font-medium transition-colors`}>
              Pricing
            </a>
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3 md:space-x-4">
            {/* Search Icon */}
            <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-all`} aria-label="Search">
              <Search className="w-5 h-5" />
            </button>

            {/* Globe Icon */}
            <button className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-all`} aria-label="Language">
              <Globe className="w-5 h-5" />
            </button>

            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className={`p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-full transition-all`}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Join Us Link (desktop) */}
            <Link to="/portal-signin" className="hidden sm:inline-flex items-center px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">
              Join Us
            </Link>

            {/* Mobile Menu Button */}
            <button onClick={toggleMobileMenu} className={`lg:hidden p-2 ${isDarkMode ? 'text-gray-400 hover:text-white hover:bg-slate-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} rounded-lg transition-all`} aria-label="Toggle menu">
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={`lg:hidden py-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-100'} animate-in slide-in-from-top`}>
            <nav className="flex flex-col space-y-1">
              <a href="#home" className={`px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} font-medium rounded-lg transition-colors`} onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </a>
              <a href="#courses" className={`px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} font-medium rounded-lg transition-colors`} onClick={() => setIsMobileMenuOpen(false)}>
                Our Courses
              </a>

              {/* Mobile Pages Dropdown */}
              <div>
                <button onClick={togglePagesDropdown} className="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-gray-900 font-medium rounded-lg transition-colors">
                  <span className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                    Pages
                  </span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPagesDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {isPagesDropdownOpen && (
                  <div className="mt-1 ml-4 pl-4 border-l-2 border-orange-200 space-y-1">
                    {pagesMenuItems.map((item, index) => (
                      item.isRoute ? (
                        <Link
                          key={index}
                          to={item.href}
                          className="block px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          onClick={() => handlePageItemClick(item)}
                        >
                          {item.label}
                        </Link>
                      ) : (
                        <a
                          key={index}
                          href={item.href}
                          className="block px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                          onClick={() => handlePageItemClick(item)}
                        >
                          {item.label}
                        </a>
                      )
                    ))}
                  </div>
                )}
              </div>

              <a href="#team" className={`px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} font-medium rounded-lg transition-colors`} onClick={() => setIsMobileMenuOpen(false)}>
                Our Team
              </a>
              <a href="#pricing" className={`px-4 py-3 ${isDarkMode ? 'text-gray-300 hover:bg-slate-800 hover:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'} font-medium rounded-lg transition-colors`} onClick={() => setIsMobileMenuOpen(false)}>
                Pricing
              </a>

              {/* Mobile Join Us Button */}
              <div className="pt-3 sm:hidden">
                <Link
                  to="/portal-signin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                  Join Us
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
