/**
 * Events Page
 * University events calendar
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import { CTABanner } from "../../components/landing/LandingComponents";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import ExportButton from "../../components/ExportButton";

const events = [
  {
    id: 1,
    title: "2026/2027 Matriculation Ceremony",
    date: "March 15, 2026",
    time: "10:00 AM",
    location: "University Auditorium",
    category: "Academic",
    description:
      "Formal induction of new students into the university community. All freshmen are required to attend in academic gown.",
    featured: true,
  },
  {
    id: 2,
    title: "International Conference on Sustainable Development",
    date: "April 15-17, 2026",
    time: "9:00 AM",
    location: "Conference Center",
    category: "Research",
    description:
      "A 3-day international conference featuring speakers from over 20 countries discussing sustainable development goals.",
    featured: true,
  },
  {
    id: 3,
    title: "Career Fair 2026",
    date: "April 25, 2026",
    time: "9:00 AM - 4:00 PM",
    location: "Sports Complex",
    category: "Career",
    description:
      "Annual career fair with over 100 employers from various industries. Bring your CV for on-the-spot interviews.",
    featured: true,
  },
  {
    id: 4,
    title: "Faculty of Science Research Symposium",
    date: "February 20, 2026",
    time: "2:00 PM",
    location: "Science Lecture Theatre",
    category: "Research",
    description:
      "Postgraduate students present their research findings. Open to all faculty and interested students.",
    featured: false,
  },
  {
    id: 5,
    title: "Student Union Week",
    date: "March 1-7, 2026",
    time: "Various",
    location: "Various Venues",
    category: "Student Life",
    description:
      "A week of activities including sports, cultural performances, debates, and social events organized by the Student Union.",
    featured: false,
  },
  {
    id: 6,
    title: "Open Day for Prospective Students",
    date: "May 10, 2026",
    time: "10:00 AM - 3:00 PM",
    location: "Campus-wide",
    category: "Admissions",
    description:
      "Campus tours, faculty presentations, and Q&A sessions for prospective students and parents.",
    featured: false,
  },
  {
    id: 7,
    title: "Convocation Ceremony",
    date: "July 20, 2026",
    time: "10:00 AM",
    location: "University Stadium",
    category: "Academic",
    description:
      "Annual graduation ceremony celebrating our graduating students. Honorary degrees will also be conferred.",
    featured: false,
  },
  {
    id: 8,
    title: "Alumni Homecoming Weekend",
    date: "November 15-17, 2026",
    time: "Various",
    location: "Campus-wide",
    category: "Alumni",
    description:
      "A weekend reunion for UNIDEL alumni featuring networking events, campus tours, and gala dinner.",
    featured: false,
  },
];

const categories = [
  "All",
  "Academic",
  "Research",
  "Career",
  "Student Life",
  "Admissions",
  "Alumni",
];

const categoryColors = {
  Academic: {
    bg: "bg-blue-500/20",
    text: "text-blue-400",
    bgLight: "bg-blue-100",
    textLight: "text-blue-700",
  },
  Research: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    bgLight: "bg-purple-100",
    textLight: "text-purple-700",
  },
  Career: {
    bg: "bg-green-500/20",
    text: "text-green-400",
    bgLight: "bg-green-100",
    textLight: "text-green-700",
  },
  "Student Life": {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    bgLight: "bg-orange-100",
    textLight: "text-orange-700",
  },
  Admissions: {
    bg: "bg-cyan-500/20",
    text: "text-cyan-400",
    bgLight: "bg-cyan-100",
    textLight: "text-cyan-700",
  },
  Alumni: {
    bg: "bg-pink-500/20",
    text: "text-pink-400",
    bgLight: "bg-pink-100",
    textLight: "text-pink-700",
  },
};

const Events = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredEvents = events.filter(
    (event) =>
      selectedCategory === "All" || event.category === selectedCategory,
  );

  const featuredEvents = filteredEvents.filter((e) => e.featured).slice(0, 3);
  const upcomingEvents = filteredEvents.filter((e) => !e.featured);

  return (
    <>
      <PageHeader
        subtitle="What's Happening"
        title="Events Calendar"
        description="Stay informed about academic events, research conferences, career fairs, and student activities. Don't miss out on opportunities to learn, network, and grow."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Student Life", href: "#" },
          { label: "Events" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <ExportButton
            type="events-report"
            title="University Academic Calendar & Events"
            className="!rounded-lg"
          />
        </div>
      </PageHeader>

      {/* Featured Events */}
      {featuredEvents.length > 0 && (
        <Section title="Featured Events" subtitle="Don't Miss">
          <div className="grid md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/events/${event.id}`}
                className={cn(
                  "group p-6 rounded-xl border transition-all hover:scale-[1.02]",
                  isDarkMode
                    ? "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 hover:border-orange-500/50"
                    : "bg-gradient-to-br from-white to-orange-50 border-gray-200 hover:shadow-lg",
                )}
              >
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded text-xs font-medium mb-3",
                    isDarkMode
                      ? categoryColors[event.category]?.bg +
                          " " +
                          categoryColors[event.category]?.text
                      : categoryColors[event.category]?.bgLight +
                          " " +
                          categoryColors[event.category]?.textLight,
                  )}
                >
                  {event.category}
                </span>
                <h3
                  className={cn(
                    "font-bold mb-3 group-hover:text-orange-500 transition-colors",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {event.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed mb-4 line-clamp-2",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {event.description}
                </p>
                <div
                  className={cn(
                    "space-y-2 text-sm",
                    isDarkMode ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* Filter */}
      <Section>
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-orange-500 to-red-600 text-white"
                  : isDarkMode
                    ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              className={cn(
                "flex flex-col sm:flex-row gap-4 p-5 rounded-xl border transition-all hover:scale-[1.01]",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 hover:border-orange-500/30"
                  : "bg-white border-gray-200 hover:shadow-md",
              )}
            >
              {/* Date Badge */}
              <div
                className={cn(
                  "w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex flex-col items-center justify-center flex-shrink-0",
                  isDarkMode ? "bg-slate-800" : "bg-orange-50",
                )}
              >
                <span
                  className={cn(
                    "text-xs uppercase",
                    isDarkMode ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  {event.date.split(" ")[0].slice(0, 3)}
                </span>
                <span
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  {event.date.split(" ")[1]?.replace(",", "") || "—"}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4
                    className={cn(
                      "font-bold",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {event.title}
                  </h4>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      isDarkMode
                        ? categoryColors[event.category]?.bg +
                            " " +
                            categoryColors[event.category]?.text
                        : categoryColors[event.category]?.bgLight +
                            " " +
                            categoryColors[event.category]?.textLight,
                    )}
                  >
                    {event.category}
                  </span>
                </div>
                <p
                  className={cn(
                    "text-sm mb-2 line-clamp-1",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {event.description}
                </p>
                <div
                  className={cn(
                    "flex flex-wrap gap-4 text-xs",
                    isDarkMode ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {event.location}
                  </span>
                </div>
              </div>

              <ArrowRight
                className={cn(
                  "w-5 h-5 self-center hidden sm:block",
                  isDarkMode ? "text-gray-600" : "text-gray-400",
                )}
              />
            </Link>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div
            className={cn(
              "text-center py-12",
              isDarkMode ? "text-gray-500" : "text-gray-400",
            )}
          >
            No events found for this category.
          </div>
        )}
      </Section>

      <CTABanner
        title="Have an Event to Share?"
        description="Submit your event for inclusion in the university calendar."
        primaryAction={{ label: "Submit Event", href: "/contact?topic=event" }}
        secondaryAction={{ label: "Subscribe to Updates", href: "/subscribe" }}
      />
    </>
  );
};

export default Events;
