/**
 * Library Page
 * University library resources and services
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  InfoGrid,
  StatsBanner,
  Accordion,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  BookOpen,
  Search,
  Monitor,
  Users,
  Clock,
  Wifi,
  Download,
  FileText,
  GraduationCap,
  Newspaper,
  Database,
  Globe,
  Phone,
  Mail,
} from "lucide-react";

const libraryServices = [
  {
    icon: BookOpen,
    title: "Book Lending",
    description:
      "Borrow from over 500,000 volumes. Undergraduates: 3 books for 2 weeks. Postgraduates: 5 books for 4 weeks.",
  },
  {
    icon: Database,
    title: "E-Resources",
    description:
      "24/7 access to digital journals, e-books, and databases including JSTOR, ScienceDirect, and IEEE Xplore.",
  },
  {
    icon: Monitor,
    title: "Computer Lab",
    description:
      "500+ workstations with internet access, Microsoft Office, and research software for student use.",
  },
  {
    icon: Users,
    title: "Study Spaces",
    description:
      "Quiet study areas, group study rooms (bookable), and collaborative learning spaces across 5 floors.",
  },
  {
    icon: GraduationCap,
    title: "Research Support",
    description:
      "Librarians available for research consultations, citation assistance, and information literacy training.",
  },
  {
    icon: FileText,
    title: "Thesis Repository",
    description:
      "Access to past theses and dissertations from UNIDEL and partner institutions.",
  },
];

const libraryStats = [
  { value: "500,000+", label: "Volumes" },
  { value: "100,000+", label: "E-Books" },
  { value: "50+", label: "Database Subscriptions" },
  { value: "2,500", label: "Seating Capacity" },
];

const operatingHours = [
  { day: "Monday - Friday", hours: "8:00 AM - 10:00 PM" },
  { day: "Saturday", hours: "9:00 AM - 6:00 PM" },
  { day: "Sunday", hours: "12:00 PM - 6:00 PM" },
  { day: "Exam Period", hours: "24/7 Access" },
];

const databases = [
  { name: "JSTOR", type: "Multidisciplinary", access: "On-campus & Remote" },
  {
    name: "ScienceDirect",
    type: "Sciences & Medicine",
    access: "On-campus & Remote",
  },
  {
    name: "IEEE Xplore",
    type: "Engineering & Technology",
    access: "On-campus & Remote",
  },
  { name: "PubMed", type: "Biomedical Sciences", access: "Open Access" },
  { name: "LexisNexis", type: "Law & Legal Research", access: "On-campus" },
  { name: "EBSCO", type: "Business & Economics", access: "On-campus & Remote" },
];

const faqItems = [
  {
    question: "How do I get a library card?",
    answer:
      "All registered students automatically get library access. Simply visit the circulation desk with your student ID on your first visit to activate your account and receive your library PIN.",
  },
  {
    question: "How can I access e-resources from off-campus?",
    answer:
      "Use your student portal credentials to log in through our EZProxy system. Visit library.unidel.edu.ng and click 'Remote Access' to authenticate and access all subscribed databases.",
  },
  {
    question: "What are the late return penalties?",
    answer:
      "Late returns incur a fine of ₦50 per book per day. After 30 days, you'll be charged the replacement cost of the book plus a ₦2,000 processing fee. Clear all fines to avoid portal restrictions.",
  },
  {
    question: "Can I book a group study room?",
    answer:
      "Yes! Group study rooms can be booked online through the library portal. Each room accommodates 4-8 people and can be reserved for up to 3 hours per session. Book at least 24 hours in advance.",
  },
  {
    question: "Are there printing and copying services?",
    answer:
      "Yes, self-service printing and copying stations are available on every floor. Load credit to your student account online or at the circulation desk. Black & white: ₦20/page, Color: ₦100/page.",
  },
];

const Library = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Knowledge Gateway"
        title="University Library"
        description="The University of Delta Library is the intellectual hub of our campus, providing world-class resources and services to support teaching, learning, and research."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "#" },
          { label: "Library" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="https://library.unidel.edu.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all"
          >
            <Search className="w-4 h-4" /> Search Catalog
          </a>
          <Link
            to="/library/databases"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl border transition-all",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
            )}
          >
            <Database className="w-4 h-4" /> E-Resources
          </Link>
        </div>
      </PageHeader>

      <StatsBanner stats={libraryStats} background="gradient" />

      {/* Services */}
      <Section
        title="Library Services"
        subtitle="What We Offer"
        description="Our library provides comprehensive services to support your academic success."
      >
        <InfoGrid items={libraryServices} columns={3} />
      </Section>

      {/* Hours & Location */}
      <Section background="alt">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Operating Hours */}
          <div
            className={cn(
              "p-6 rounded-xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <Clock
                className={cn(
                  "w-6 h-6",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              />
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Operating Hours
              </h3>
            </div>
            <div className="space-y-3">
              {operatingHours.map((schedule, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex justify-between py-2 border-b last:border-0",
                    isDarkMode ? "border-slate-700" : "border-gray-100",
                  )}
                >
                  <span
                    className={isDarkMode ? "text-gray-300" : "text-gray-700"}
                  >
                    {schedule.day}
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  >
                    {schedule.hours}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div
            className={cn(
              "p-6 rounded-xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <div className="flex items-center gap-3 mb-6">
              <Phone
                className={cn(
                  "w-6 h-6",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              />
              <h3
                className={cn(
                  "text-lg font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Contact Us
              </h3>
            </div>
            <div className="space-y-4">
              <div>
                <h4
                  className={cn(
                    "font-medium mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Location
                </h4>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Main Library Building, Academic Area, UNIDEL Campus
                </p>
              </div>
              <div>
                <h4
                  className={cn(
                    "font-medium mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Phone
                </h4>
                <a
                  href="tel:+2348012345681"
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  +234 801 234 5681
                </a>
              </div>
              <div>
                <h4
                  className={cn(
                    "font-medium mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Email
                </h4>
                <a
                  href="mailto:library@unidel.edu.ng"
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  library@unidel.edu.ng
                </a>
              </div>
              <div>
                <h4
                  className={cn(
                    "font-medium mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  University Librarian
                </h4>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Barr. Aisha Kolawole
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* E-Resources */}
      <Section title="E-Resources & Databases" subtitle="Digital Collections">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr
                className={cn(
                  "border-b",
                  isDarkMode ? "border-slate-700" : "border-gray-200",
                )}
              >
                <th
                  className={cn(
                    "text-left py-3 px-4 font-semibold text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Database
                </th>
                <th
                  className={cn(
                    "text-left py-3 px-4 font-semibold text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Subject Area
                </th>
                <th
                  className={cn(
                    "text-left py-3 px-4 font-semibold text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  Access
                </th>
              </tr>
            </thead>
            <tbody>
              {databases.map((db, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "border-b",
                    isDarkMode ? "border-slate-800" : "border-gray-100",
                  )}
                >
                  <td
                    className={cn(
                      "py-3 px-4 font-medium",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {db.name}
                  </td>
                  <td
                    className={cn(
                      "py-3 px-4 text-sm",
                      isDarkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {db.type}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={cn(
                        "inline-block px-2 py-0.5 rounded text-xs font-medium",
                        db.access.includes("Remote")
                          ? isDarkMode
                            ? "bg-green-500/20 text-green-400"
                            : "bg-green-100 text-green-700"
                          : db.access === "Open Access"
                            ? isDarkMode
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-blue-100 text-blue-700"
                            : isDarkMode
                              ? "bg-slate-700 text-gray-300"
                              : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {db.access}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-center mt-6">
          <Link
            to="/library/databases"
            className={cn(
              "inline-flex items-center gap-1 text-sm font-medium",
              isDarkMode
                ? "text-orange-400 hover:text-orange-300"
                : "text-orange-600 hover:text-orange-700",
            )}
          >
            View all 50+ databases →
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Library FAQ" subtitle="Common Questions" background="alt">
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>

      <CTABanner
        title="Start Your Research Today"
        description="Access millions of resources to support your academic journey."
        primaryAction={{
          label: "Search Library Catalog",
          href: "https://library.unidel.edu.ng",
        }}
        secondaryAction={{
          label: "Book a Librarian",
          href: "/library/consultation",
        }}
      />
    </>
  );
};

export default Library;
