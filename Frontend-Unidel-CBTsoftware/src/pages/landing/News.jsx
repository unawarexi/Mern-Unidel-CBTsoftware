/**
 * News Page
 * University news and announcements with dynamic data
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { usePublicNewsAction } from "../../store/public-store";
import { useLazySection } from "../../hooks/useIntersectionObserver";
import { CardSkeleton } from "../../components/ui/SectionSkeleton";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import { LinkList } from "../../components/landing/LandingComponents";
import {
  Calendar,
  Clock,
  ArrowRight,
  Tag,
  Search,
  ChevronRight,
  Newspaper,
  Bell,
  GraduationCap,
  Award,
  Users,
  FlaskConical,
} from "lucide-react";

const newsCategories = [
  { label: "All News", value: "all" },
  { label: "Announcements", value: "announcements" },
  { label: "Academic", value: "academic" },
  { label: "Research", value: "research" },
  { label: "Events", value: "events" },
  { label: "Sports", value: "sports" },
];

// Icon mapping for categories
const categoryIcons = {
  announcements: Award,
  academic: GraduationCap,
  research: FlaskConical,
  events: Users,
  sports: Award,
  default: Newspaper,
};

const quickLinks = [
  { label: "Academic Calendar", href: "/academic-calendar" },
  { label: "Examination Timetable", href: "/exams" },
  { label: "Registration Guide", href: "/registration" },
  { label: "Fee Payment", href: "/fees" },
  { label: "Contact Registrar", href: "/contact" },
];

const News = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch news from API
  const {
    news: apiNews,
    featured: apiFeatured,
    isLoading,
    pagination,
  } = usePublicNewsAction({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
  });

  // Transform API data for component use
  const newsArticles = apiNews.map((article) => ({
    id: article._id || article.id,
    title: article.title,
    excerpt: article.excerpt,
    category: article.category,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "",
    author: article.author || "",
    featured: article.isFeatured,
    icon: categoryIcons[article.category] || categoryIcons.default,
    slug: article.slug,
    featuredImage: article.featuredImage,
  }));

  const filteredNews = newsArticles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const featuredNews =
    apiFeatured.length > 0
      ? apiFeatured.map((article) => ({
          id: article._id || article.id,
          title: article.title,
          excerpt: article.excerpt,
          category: article.category,
          date: article.publishedAt
            ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "",
          icon: categoryIcons[article.category] || categoryIcons.default,
          slug: article.slug,
        }))
      : newsArticles.filter((article) => article.featured);

  const regularNews = filteredNews.filter(
    (article) => !article.featured || selectedCategory !== "all",
  );

  return (
    <>
      <PageHeader
        subtitle="Stay Informed"
        title="News & Announcements"
        description="Stay up to date with the latest happenings at the University of Delta. From academic updates to research breakthroughs and campus events."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "News" },
        ]}
      />

      <Section>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="lg:sticky lg:top-24 space-y-6">
              {/* Search */}
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4",
                    isDarkMode ? "text-gray-500" : "text-gray-400",
                  )}
                />
                <input
                  type="text"
                  placeholder="Search news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={cn(
                    "w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2",
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 text-white focus:ring-orange-500/50"
                      : "bg-white border-gray-200 text-gray-900 focus:ring-orange-200",
                  )}
                />
              </div>

              {/* Categories */}
              <div
                className={cn(
                  "p-4 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-gray-200",
                )}
              >
                <h4
                  className={cn(
                    "font-bold mb-3 text-sm",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Categories
                </h4>
                <nav className="space-y-1">
                  {newsCategories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-colors",
                        selectedCategory === cat.value
                          ? isDarkMode
                            ? "bg-orange-500/20 text-orange-400"
                            : "bg-orange-50 text-orange-600"
                          : isDarkMode
                            ? "text-gray-400 hover:text-white hover:bg-slate-800"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                      )}
                    >
                      {cat.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Quick Links */}
              <LinkList title="Quick Links" links={quickLinks} />

              {/* Subscribe */}
              <div
                className={cn(
                  "p-4 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-orange-50 border-orange-100",
                )}
              >
                <Bell
                  className={cn(
                    "w-8 h-8 mb-3",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                />
                <h4
                  className={cn(
                    "font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Get Updates
                </h4>
                <p
                  className={cn(
                    "text-xs mb-3",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Subscribe to receive news updates directly to your email.
                </p>
                <Link
                  to="/subscribe"
                  className={cn(
                    "block text-center text-sm font-medium py-2 rounded-lg transition-colors",
                    isDarkMode
                      ? "bg-orange-500/20 text-orange-400 hover:bg-orange-500/30"
                      : "bg-orange-100 text-orange-600 hover:bg-orange-200",
                  )}
                >
                  Subscribe
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            {/* Loading State */}
            {isLoading && (
              <div className="mb-10">
                <CardSkeleton count={4} layout="grid" />
              </div>
            )}

            {/* Featured News */}
            {!isLoading &&
              selectedCategory === "all" &&
              searchQuery === "" &&
              featuredNews.length > 0 && (
                <div className="mb-10">
                  <h3
                    className={cn(
                      "text-lg font-bold mb-4",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    Featured Stories
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {featuredNews.map((article) => (
                      <Link
                        key={article.id}
                        to={`/news/${article.id}`}
                        className={cn(
                          "group block p-6 rounded-xl border transition-all hover:scale-[1.02]",
                          isDarkMode
                            ? "bg-slate-900 border-slate-700 hover:border-orange-500/50"
                            : "bg-white border-gray-200 hover:shadow-lg",
                        )}
                      >
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                            isDarkMode
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-orange-100 text-orange-600",
                          )}
                        >
                          <article.icon className="w-6 h-6" />
                        </div>
                        <span
                          className={cn(
                            "inline-block px-2 py-0.5 rounded text-xs font-medium uppercase mb-2",
                            isDarkMode
                              ? "bg-slate-800 text-gray-300"
                              : "bg-gray-100 text-gray-600",
                          )}
                        >
                          {article.category}
                        </span>
                        <h4
                          className={cn(
                            "font-bold mb-2 group-hover:text-orange-500 transition-colors",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {article.title}
                        </h4>
                        <p
                          className={cn(
                            "text-sm leading-relaxed mb-3",
                            isDarkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {article.excerpt}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-4 text-xs",
                            isDarkMode ? "text-gray-500" : "text-gray-500",
                          )}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {article.date}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            {/* All News */}
            <div>
              <h3
                className={cn(
                  "text-lg font-bold mb-4",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {selectedCategory === "all"
                  ? "All News"
                  : newsCategories.find((c) => c.value === selectedCategory)
                      ?.label}
              </h3>

              {regularNews.length === 0 ? (
                <div
                  className={cn(
                    "text-center py-12",
                    isDarkMode ? "text-gray-500" : "text-gray-400",
                  )}
                >
                  No news articles found matching your criteria.
                </div>
              ) : (
                <div className="space-y-4">
                  {regularNews.map((article) => (
                    <Link
                      key={article.id}
                      to={`/news/${article.id}`}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01]",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 hover:border-orange-500/30"
                          : "bg-white border-gray-200 hover:shadow-md",
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                          isDarkMode
                            ? "bg-slate-800 text-gray-400"
                            : "bg-gray-100 text-gray-500",
                        )}
                      >
                        <article.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className={cn(
                            "font-bold mb-1 line-clamp-1 group-hover:text-orange-500",
                            isDarkMode ? "text-white" : "text-gray-900",
                          )}
                        >
                          {article.title}
                        </h4>
                        <p
                          className={cn(
                            "text-sm leading-relaxed line-clamp-2 mb-2",
                            isDarkMode ? "text-gray-400" : "text-gray-600",
                          )}
                        >
                          {article.excerpt}
                        </p>
                        <div
                          className={cn(
                            "flex items-center gap-3 text-xs",
                            isDarkMode ? "text-gray-500" : "text-gray-500",
                          )}
                        >
                          <span>{article.date}</span>
                          <span>•</span>
                          <span className="uppercase">{article.category}</span>
                        </div>
                      </div>
                      <ChevronRight
                        className={cn(
                          "w-5 h-5 flex-shrink-0",
                          isDarkMode ? "text-gray-600" : "text-gray-400",
                        )}
                      />
                    </Link>
                  ))}
                </div>
              )}

              {/* Load More */}
              <div className="text-center mt-8">
                <button
                  className={cn(
                    "px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors",
                    isDarkMode
                      ? "border-slate-700 text-white hover:bg-slate-800"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50",
                  )}
                >
                  Load More News
                </button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
};

export default News;
