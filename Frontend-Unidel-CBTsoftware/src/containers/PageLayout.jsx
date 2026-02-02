/**
 * PageLayout Component
 * Standard layout wrapper for landing pages
 */
import React from "react";
import { motion } from "framer-motion";
import useThemeStore from "../store/theme-store";
import { cn } from "../core/lib/cn";
import MegaNavbar from "./MegaNavbar";
import Footer from "./Footer";

const PageLayout = ({ children, className = "" }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <MegaNavbar />
      <main className={cn("flex-1", className)}>{children}</main>
      <Footer />
    </div>
  );
};

/**
 * PageHeader Component
 * Hero-style header for internal pages
 */
export const PageHeader = ({
  title,
  subtitle,
  description,
  breadcrumbs = [],
  backgroundImage,
  overlay = true,
  size = "md",
  children,
}) => {
  const { isDarkMode } = useThemeStore();

  const sizes = {
    sm: "py-12 lg:py-16",
    md: "py-16 lg:py-24",
    lg: "py-24 lg:py-32",
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden",
        sizes[size],
        backgroundImage
          ? "bg-cover bg-center"
          : isDarkMode
            ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
            : "bg-gradient-to-br from-gray-50 via-white to-orange-50",
      )}
      style={
        backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : {}
      }
    >
      {/* Background Overlay */}
      {backgroundImage && overlay && (
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-orange-900/80" />
      )}

      {/* Decorative Elements */}
      {!backgroundImage && (
        <>
          <div
            className={cn(
              "absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20",
              isDarkMode ? "bg-orange-600" : "bg-orange-200",
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-20",
              isDarkMode ? "bg-blue-600" : "bg-blue-200",
            )}
          />
        </>
      )}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs.length > 0 && (
          <nav className="mb-4">
            <ol className="flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  {idx > 0 && (
                    <span
                      className={
                        isDarkMode || backgroundImage
                          ? "text-gray-500"
                          : "text-gray-400"
                      }
                    >
                      /
                    </span>
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className={cn(
                        "hover:underline",
                        isDarkMode || backgroundImage
                          ? "text-gray-300 hover:text-white"
                          : "text-gray-600 hover:text-gray-900",
                      )}
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span
                      className={
                        isDarkMode || backgroundImage
                          ? "text-orange-400"
                          : "text-orange-600"
                      }
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Subtitle Badge */}
        {subtitle && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-4",
              isDarkMode || backgroundImage
                ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                : "bg-orange-100 text-orange-600 border border-orange-200",
            )}
          >
            {subtitle}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4",
            isDarkMode || backgroundImage ? "text-white" : "text-gray-900",
          )}
        >
          {title}
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={cn(
              "text-base sm:text-lg lg:text-xl max-w-3xl leading-relaxed",
              isDarkMode || backgroundImage ? "text-gray-300" : "text-gray-600",
            )}
          >
            {description}
          </motion.p>
        )}

        {/* Additional Content */}
        {children && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
};

/**
 * Section Component
 * Content section with optional heading
 */
export const Section = ({
  children,
  title,
  subtitle,
  description,
  className = "",
  id,
  background = "default",
}) => {
  const { isDarkMode } = useThemeStore();

  const backgrounds = {
    default: isDarkMode ? "bg-slate-950" : "bg-white",
    alt: isDarkMode ? "bg-slate-900" : "bg-gray-50",
    gradient: isDarkMode
      ? "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
      : "bg-gradient-to-br from-orange-50 via-white to-blue-50",
    dark: "bg-slate-900",
  };

  return (
    <section
      id={id}
      className={cn("py-16 lg:py-24", backgrounds[background], className)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle || description) && (
          <div className="max-w-3xl mb-12 lg:mb-16">
            {subtitle && (
              <span
                className={cn(
                  "inline-block text-xs font-bold uppercase tracking-wider mb-2",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {subtitle}
              </span>
            )}
            {title && (
              <h2
                className={cn(
                  "text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {title}
              </h2>
            )}
            {description && (
              <p
                className={cn(
                  "text-base lg:text-lg leading-relaxed",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {description}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

/**
 * Sidebar Layout
 * Two-column layout with sticky sidebar
 */
export const SidebarLayout = ({
  sidebar,
  children,
  sidebarPosition = "left",
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div
        className={cn(
          "grid lg:grid-cols-4 gap-8 lg:gap-12",
          sidebarPosition === "right" && "lg:grid-flow-col-dense",
        )}
      >
        {/* Sidebar */}
        <aside
          className={cn(
            "lg:col-span-1",
            sidebarPosition === "right" && "lg:col-start-4",
          )}
        >
          <div className="lg:sticky lg:top-24 space-y-6">{sidebar}</div>
        </aside>

        {/* Main Content */}
        <main
          className={cn(
            "lg:col-span-3",
            sidebarPosition === "right" && "lg:col-start-1 lg:col-end-4",
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;
