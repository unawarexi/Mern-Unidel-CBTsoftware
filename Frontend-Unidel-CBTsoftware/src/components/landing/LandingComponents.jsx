/**
 * Landing Page Components
 * Reusable dense UI components for text-rich university pages
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import {
  ChevronDown,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Quote,
  Check,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";

// ============ TEXT BLOCK ============
/**
 * Rich text content block with proper typography
 */
export const TextBlock = ({ children, className = "", columns = 1 }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "prose prose-lg max-w-none",
        isDarkMode && "prose-invert",
        columns === 2 && "lg:columns-2 lg:gap-8",
        columns === 3 && "lg:columns-3 lg:gap-8",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-p:text-base",
        "prose-li:text-base prose-li:leading-relaxed",
        "prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline",
        isDarkMode ? "prose-p:text-gray-300" : "prose-p:text-gray-600",
        className,
      )}
    >
      {children}
    </div>
  );
};

// ============ INFO GRID ============
/**
 * Grid of information cards
 */
export const InfoGrid = ({ items, columns = 3, variant = "card" }) => {
  const { isDarkMode } = useThemeStore();

  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6", gridCols[columns])}>
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className={cn(
            "group",
            variant === "card" &&
              cn(
                "p-6 rounded-xl border transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-800 hover:border-orange-500/50"
                  : "bg-white border-gray-200 hover:border-orange-300 hover:shadow-lg",
              ),
            variant === "minimal" && "space-y-2",
          )}
        >
          {item.icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                isDarkMode
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-orange-100 text-orange-600",
              )}
            >
              <item.icon className="w-6 h-6" />
            </div>
          )}
          {item.label && (
            <span
              className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                isDarkMode ? "text-orange-400" : "text-orange-600",
              )}
            >
              {item.label}
            </span>
          )}
          <h3
            className={cn(
              "text-lg font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isDarkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {item.description}
          </p>
          {item.link && (
            <Link
              to={item.link}
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium mt-3 transition-colors",
                isDarkMode
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-orange-600 hover:text-orange-700",
              )}
            >
              Learn more <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ============ STATS BANNER ============
/**
 * Full-width statistics banner
 */
export const StatsBanner = ({ stats, background = "gradient" }) => {
  const { isDarkMode } = useThemeStore();

  const backgrounds = {
    gradient: "bg-gradient-to-r from-orange-600 to-red-600",
    dark: isDarkMode ? "bg-slate-800" : "bg-gray-900",
    light: isDarkMode ? "bg-slate-900" : "bg-gray-50",
  };

  const textColor =
    background === "light"
      ? isDarkMode
        ? "text-white"
        : "text-gray-900"
      : "text-white";
  const subColor =
    background === "light"
      ? isDarkMode
        ? "text-gray-400"
        : "text-gray-600"
      : "text-white/80";

  return (
    <section className={cn("py-12 lg:py-16", backgrounds[background])}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-center">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div
                className={cn(
                  "text-3xl sm:text-4xl lg:text-5xl font-bold mb-1",
                  textColor,
                )}
              >
                {stat.value}
              </div>
              <div className={cn("text-sm lg:text-base", subColor)}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============ TEAM GRID ============
/**
 * Staff/Faculty profile grid
 */
export const TeamGrid = ({ members, columns = 4 }) => {
  const { isDarkMode } = useThemeStore();

  const gridCols = {
    3: "sm:grid-cols-2 lg:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-6 lg:gap-8", gridCols[columns])}>
      {members.map((member, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className={cn(
            "group text-center p-6 rounded-xl transition-all",
            isDarkMode
              ? "bg-slate-900 border border-slate-800 hover:border-orange-500/50"
              : "bg-white border border-gray-200 hover:shadow-lg",
          )}
        >
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden bg-gradient-to-br from-orange-100 to-orange-200">
            {member.image ? (
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={cn(
                  "w-full h-full flex items-center justify-center text-2xl font-bold",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          <h3
            className={cn(
              "font-bold mb-1",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            {member.name}
          </h3>
          <p
            className={cn(
              "text-sm mb-2",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          >
            {member.role}
          </p>
          <p
            className={cn(
              "text-xs",
              isDarkMode ? "text-gray-400" : "text-gray-500",
            )}
          >
            {member.department}
          </p>
          {member.email && (
            <a
              href={`mailto:${member.email}`}
              className={cn(
                "inline-flex items-center gap-1 text-xs mt-3",
                isDarkMode
                  ? "text-gray-400 hover:text-white"
                  : "text-gray-500 hover:text-gray-900",
              )}
            >
              <Mail className="w-3 h-3" /> {member.email}
            </a>
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ============ TIMELINE ============
/**
 * Vertical timeline for history/events
 */
export const Timeline = ({ events }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative">
      {/* Vertical line */}
      <div
        className={cn(
          "absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2",
          isDarkMode ? "bg-slate-700" : "bg-gray-200",
        )}
      />

      <div className="space-y-8 lg:space-y-12">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className={cn(
              "relative grid lg:grid-cols-2 gap-4 lg:gap-8",
              idx % 2 === 0 ? "lg:text-right" : "",
            )}
          >
            {/* Timeline dot */}
            <div
              className={cn(
                "absolute left-4 lg:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-4",
                isDarkMode
                  ? "bg-orange-500 border-slate-900"
                  : "bg-orange-500 border-white",
              )}
              style={{ top: "0.5rem" }}
            />

            {/* Content - alternating sides on desktop */}
            <div
              className={cn(
                "pl-10 lg:pl-0",
                idx % 2 === 0 ? "lg:pr-12" : "lg:col-start-2 lg:pl-12",
              )}
            >
              <span
                className={cn(
                  "text-sm font-bold",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {event.year}
              </span>
              <h3
                className={cn(
                  "text-lg font-bold mt-1 mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {event.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {event.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============ ACCORDION ============
/**
 * Expandable FAQ/Content sections
 */
export const Accordion = ({ items }) => {
  const { isDarkMode } = useThemeStore();
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.05 }}
          className={cn(
            "border rounded-xl overflow-hidden",
            isDarkMode
              ? "border-slate-700 bg-slate-900"
              : "border-gray-200 bg-white",
          )}
        >
          <button
            onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            className={cn(
              "w-full flex items-center justify-between p-5 text-left font-medium transition-colors",
              isDarkMode
                ? "text-white hover:bg-slate-800"
                : "text-gray-900 hover:bg-gray-50",
            )}
          >
            <span>{item.question}</span>
            <ChevronDown
              className={cn(
                "w-5 h-5 transition-transform flex-shrink-0 ml-4",
                openIndex === idx && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {openIndex === idx && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={cn(
                    "px-5 pb-5 text-sm leading-relaxed",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {item.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

// ============ TABBED CONTENT ============
/**
 * Tabbed navigation for content sections
 */
export const TabbedContent = ({ tabs }) => {
  const { isDarkMode } = useThemeStore();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      {/* Tab Headers */}
      <div
        className={cn(
          "flex flex-wrap gap-2 border-b mb-8",
          isDarkMode ? "border-slate-700" : "border-gray-200",
        )}
      >
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveTab(idx)}
            className={cn(
              "px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === idx
                ? isDarkMode
                  ? "border-orange-500 text-orange-400"
                  : "border-orange-500 text-orange-600"
                : cn(
                    "border-transparent",
                    isDarkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-gray-600 hover:text-gray-900",
                  ),
            )}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {tabs[activeTab].content}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ============ QUOTE BLOCK ============
/**
 * Testimonial/Quote display
 */
export const QuoteBlock = ({ quote, author, role, image }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <blockquote
      className={cn(
        "relative p-8 rounded-2xl",
        isDarkMode
          ? "bg-slate-900 border border-slate-800"
          : "bg-orange-50 border border-orange-100",
      )}
    >
      <Quote
        className={cn(
          "absolute top-6 left-6 w-10 h-10 opacity-20",
          isDarkMode ? "text-orange-400" : "text-orange-500",
        )}
      />
      <p
        className={cn(
          "text-lg lg:text-xl leading-relaxed mb-6 relative z-10",
          isDarkMode ? "text-gray-200" : "text-gray-800",
        )}
      >
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        {image && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
            <img
              src={image}
              alt={author}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <div
            className={cn(
              "font-bold",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            {author}
          </div>
          <div
            className={cn(
              "text-sm",
              isDarkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            {role}
          </div>
        </div>
      </div>
    </blockquote>
  );
};

// ============ LINK LIST ============
/**
 * Dense list of links (for sidebars, etc.)
 */
export const LinkList = ({ title, links }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "p-5 rounded-xl border",
        isDarkMode
          ? "bg-slate-900 border-slate-700"
          : "bg-white border-gray-200",
      )}
    >
      {title && (
        <h4
          className={cn(
            "font-bold text-sm uppercase tracking-wider mb-4",
            isDarkMode ? "text-gray-400" : "text-gray-500",
          )}
        >
          {title}
        </h4>
      )}
      <ul className="space-y-2">
        {links.map((link, idx) => (
          <li key={idx}>
            <Link
              to={link.href}
              className={cn(
                "flex items-center gap-2 py-1.5 text-sm transition-colors",
                isDarkMode
                  ? "text-gray-300 hover:text-orange-400"
                  : "text-gray-700 hover:text-orange-600",
              )}
            >
              <ChevronRight className="w-3 h-3" />
              {link.label}
              {link.external && (
                <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ============ CTA BANNER ============
/**
 * Call-to-action banner
 */
export const CTABanner = ({
  title,
  description,
  primaryAction,
  secondaryAction,
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <section className="bg-gradient-to-r from-orange-600 to-red-600 py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {primaryAction && (
            <Link
              to={primaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
            >
              {primaryAction.label}
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
          {secondaryAction && (
            <Link
              to={secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:bg-white/10 transition-colors"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default {
  TextBlock,
  InfoGrid,
  StatsBanner,
  TeamGrid,
  Timeline,
  Accordion,
  TabbedContent,
  QuoteBlock,
  LinkList,
  CTABanner,
};
