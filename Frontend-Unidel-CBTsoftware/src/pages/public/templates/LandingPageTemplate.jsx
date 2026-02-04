import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, ChevronRight, Download } from "lucide-react";
import useThemeStore from "../../../store/theme-store";
import { cn } from "../../../core/lib/cn";

/**
 * LandingPageTemplate
 * A data-driven component to render diverse landing pages with a unified design system.
 */
const LandingPageTemplate = ({ data }) => {
  const { isDarkMode } = useThemeStore();

  if (!data) return null;

  return (
    <div
      className={cn(
        "min-h-screen transition-colors duration-300",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      {/* 1. Hero Section */}
      <section
        className={cn(
          "relative py-20 lg:py-32 overflow-hidden border-b",
          isDarkMode
            ? "bg-slate-900 border-slate-800"
            : "bg-slate-50 border-gray-200",
        )}
      >
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pattern-grid-lg text-gray-400"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "text-4xl lg:text-6xl font-black tracking-tight mb-6",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              <span
                className={cn(
                  "bg-clip-text text-transparent bg-gradient-to-r",
                  isDarkMode
                    ? "from-orange-400 to-red-500"
                    : "from-orange-600 to-red-600",
                )}
              >
                {data.hero.highlight}
              </span>{" "}
              {data.hero.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "text-lg lg:text-xl leading-relaxed mb-8",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              {data.hero.subtitle}
            </motion.p>
            {data.hero.cta && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  to={data.hero.cta.link}
                  className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20 flex items-center gap-2"
                >
                  {data.hero.cta.text} <ArrowRight className="w-5 h-5" />
                </Link>
                {data.hero.secondaryCta && (
                  <Link
                    to={data.hero.secondaryCta.link}
                    className={cn(
                      "px-8 py-4 border font-bold rounded-xl transition-all",
                      isDarkMode
                        ? "bg-slate-800 border-slate-700 hover:bg-slate-700 text-white"
                        : "bg-white border-gray-200 hover:bg-gray-50 text-gray-900",
                    )}
                  >
                    {data.hero.secondaryCta.text}
                  </Link>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Dynamic Sections */}
      {data.sections.map((section, idx) => (
        <SectionRenderer key={idx} section={section} index={idx} />
      ))}

      {/* 3. Global CTA */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to join UNIDEL?</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Take the next step in your academic journey. Applications are open
            for the upcoming session.
          </p>
          <Link
            to="/apply"
            className="inline-flex px-8 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors"
          >
            Apply Now
          </Link>
        </div>
      </section>
    </div>
  );
};

const SectionRenderer = ({ section, index }) => {
  const { isDarkMode } = useThemeStore();
  const isAlt = index % 2 !== 0;

  // Common container wrapper
  const Wrapper = ({ children, className = "" }) => (
    <div
      className={cn(
        "py-16 lg:py-24",
        isAlt ? (isDarkMode ? "bg-slate-900/50" : "bg-gray-50") : "",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {section.title && (
          <div className="mb-12 max-w-3xl">
            <h2
              className={cn(
                "text-3xl font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              {section.title}
            </h2>
            {section.subtitle && (
              <p
                className={cn(
                  "text-lg",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {section.subtitle}
              </p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );

  switch (section.type) {
    case "rich-text":
      return (
        <Wrapper>
          <div
            className={cn(
              "prose prose-lg max-w-4xl",
              isDarkMode ? "prose-invert text-gray-300" : "text-gray-600",
            )}
          >
            {/* If content is an array, render paragraphs, else render string */}
            {Array.isArray(section.content) ? (
              section.content.map((p, i) => (
                <p key={i} className="mb-4">
                  {p}
                </p>
              ))
            ) : (
              <div dangerouslySetInnerHTML={{ __html: section.content }} />
            )}
          </div>
        </Wrapper>
      );

    case "grid-cards":
      return (
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {section.items.map((item, i) => (
              <div
                key={i}
                className={cn(
                  "p-6 rounded-2xl border shadow-sm hover:shadow-md transition-shadow",
                  isDarkMode
                    ? "bg-slate-800 border-slate-700"
                    : "bg-white border-gray-100",
                )}
              >
                {item.icon && (
                  <div
                    className={cn(
                      "p-3 rounded-xl w-fit mb-4",
                      isDarkMode
                        ? "bg-orange-900/20 text-orange-600"
                        : "bg-orange-50 text-orange-600",
                    )}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                )}
                <h3
                  className={cn(
                    "text-xl font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {item.title}
                </h3>
                <p
                  className={cn(
                    "mb-4",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {item.description}
                </p>
                {item.link && (
                  <Link
                    to={item.link}
                    className="text-orange-600 font-medium flex items-center gap-1 text-sm hover:underline"
                  >
                    Learn more <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </Wrapper>
      );

    case "features-list":
      return (
        <Wrapper>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {section.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h4
                    className={cn(
                      "text-lg font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {item.title}
                  </h4>
                  <p
                    className={cn(
                      "mt-1",
                      isDarkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Wrapper>
      );

    case "documents-list":
      return (
        <Wrapper>
          <div
            className={cn(
              "border rounded-2xl overflow-hidden",
              isDarkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            {section.items.map((doc, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between p-6 border-b last:border-0 transition-colors",
                  isDarkMode
                    ? "border-slate-700 hover:bg-slate-700/50"
                    : "border-gray-100 hover:bg-gray-50",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      isDarkMode
                        ? "bg-blue-900/20 text-blue-600"
                        : "bg-blue-50 text-blue-600",
                    )}
                  >
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "font-semibold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {doc.title}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {doc.format} • {doc.size}
                    </p>
                  </div>
                </div>
                <button
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    isDarkMode
                      ? "text-blue-600 hover:bg-blue-900/20"
                      : "text-blue-600 hover:bg-blue-50",
                  )}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </Wrapper>
      );

    default:
      return null;
  }
};

export default LandingPageTemplate;
