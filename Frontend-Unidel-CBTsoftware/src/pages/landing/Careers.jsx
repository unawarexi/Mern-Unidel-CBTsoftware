/**
 * Careers Page
 * Career services and job resources
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
  Briefcase,
  Users,
  FileText,
  Target,
  GraduationCap,
  Building2,
  Calendar,
  CheckCircle,
  ArrowRight,
  Star,
  Download,
} from "lucide-react";
import ExportButton from "../../components/ExportButton";

const careerServices = [
  {
    icon: Target,
    title: "Career Counseling",
    description:
      "One-on-one sessions with career advisors to help you identify career goals, explore options, and create action plans.",
  },
  {
    icon: FileText,
    title: "Resume & CV Review",
    description:
      "Professional feedback on your resume/CV to ensure it meets industry standards and effectively showcases your skills.",
  },
  {
    icon: Users,
    title: "Mock Interviews",
    description:
      "Practice your interview skills with experienced professionals. Get feedback on your responses, body language, and presentation.",
  },
  {
    icon: Briefcase,
    title: "Job Placement",
    description:
      "Access to our job portal with exclusive listings from partner companies actively recruiting UNIDEL graduates.",
  },
  {
    icon: Building2,
    title: "Internship Program",
    description:
      "Structured internship opportunities with leading organizations. Earn credits while gaining real-world experience.",
  },
  {
    icon: GraduationCap,
    title: "Skills Workshops",
    description:
      "Regular workshops on leadership, communication, project management, and technical skills to make you job-ready.",
  },
];

const careerStats = [
  { value: "95%", label: "Employment Rate" },
  { value: "200+", label: "Partner Companies" },
  { value: "5,000+", label: "Jobs Posted Annually" },
  { value: "₦2.5M", label: "Avg. Starting Salary" },
];

const upcomingEvents = [
  {
    title: "Career Fair 2026",
    date: "April 25, 2026",
    description: "100+ employers, on-the-spot interviews",
  },
  {
    title: "Resume Writing Workshop",
    date: "February 10, 2026",
    description: "Learn to craft winning resumes",
  },
  {
    title: "Tech Industry Panel",
    date: "March 5, 2026",
    description: "Insights from tech leaders",
  },
];

const topEmployers = [
  "Shell Nigeria",
  "MTN Nigeria",
  "Access Bank",
  "Dangote Group",
  "Microsoft Nigeria",
  "Google Africa",
  "PwC",
  "Deloitte",
  "NNPC",
  "GTBank",
  "Flutterwave",
  "Andela",
];

const faqItems = [
  {
    question: "When should I start using career services?",
    answer:
      "Start as early as possible! We recommend visiting the Career Center from your first year. Early engagement helps you explore career options, plan your coursework strategically, and pursue relevant internships.",
  },
  {
    question: "Are career services free for students?",
    answer:
      "Yes, all career services are completely free for enrolled UNIDEL students. Alumni can also access most services for up to 2 years after graduation.",
  },
  {
    question: "How do I find internship opportunities?",
    answer:
      "Log in to the Career Portal to view available internships. You can also visit the Career Center for personalized recommendations based on your major and interests.",
  },
  {
    question: "Can you help with graduate school applications?",
    answer:
      "Absolutely! We offer guidance on graduate school selection, application strategy, personal statements, and preparing for GRE/GMAT exams.",
  },
];

const Careers = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Your Future Starts Here"
        title="Career Services"
        description="The UNIDEL Career Center is dedicated to helping you achieve your professional goals. From career exploration to job placement, we're with you every step of the way."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Student Life", href: "#" },
          { label: "Career Services" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="https://careers.unidel.edu.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all"
          >
            Browse Jobs <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            to="/contact?topic=career-counseling"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 font-medium rounded-xl border transition-all",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
            )}
          >
            Book Appointment
          </Link>
          <ExportButton
            type="careers-report"
            title="University Career Services & Job Resources"
            className="!rounded-lg"
          />
        </div>
      </PageHeader>

      <StatsBanner stats={careerStats} background="gradient" />

      {/* Services */}
      <Section
        title="Our Services"
        subtitle="How We Help"
        description="Comprehensive career support from your first year through graduation and beyond."
      >
        <InfoGrid items={careerServices} columns={3} />
      </Section>

      {/* Upcoming Events & Top Employers */}
      <Section background="alt">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <div
            className={cn(
              "p-6 rounded-xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Upcoming Career Events
            </h3>
            <div className="space-y-4">
              {upcomingEvents.map((event, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-lg",
                    isDarkMode ? "bg-slate-800" : "bg-gray-50",
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                      isDarkMode
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-orange-100 text-orange-600",
                    )}
                  >
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4
                      className={cn(
                        "font-bold",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {event.title}
                    </h4>
                    <p
                      className={cn(
                        "text-sm",
                        isDarkMode ? "text-gray-400" : "text-gray-600",
                      )}
                    >
                      {event.description}
                    </p>
                    <p
                      className={cn(
                        "text-xs mt-1",
                        isDarkMode ? "text-orange-400" : "text-orange-600",
                      )}
                    >
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/events"
              className={cn(
                "inline-flex items-center gap-1 text-sm font-medium mt-4",
                isDarkMode
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-orange-600 hover:text-orange-700",
              )}
            >
              View all events <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Top Employers */}
          <div
            className={cn(
              "p-6 rounded-xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <h3
              className={cn(
                "text-lg font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Top Employers of UNIDEL Graduates
            </h3>
            <div className="flex flex-wrap gap-2">
              {topEmployers.map((employer, idx) => (
                <span
                  key={idx}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm",
                    isDarkMode
                      ? "bg-slate-800 text-gray-300"
                      : "bg-gray-100 text-gray-700",
                  )}
                >
                  {employer}
                </span>
              ))}
            </div>
            <p
              className={cn(
                "text-sm mt-4",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              And 200+ more companies actively recruiting UNIDEL graduates.
            </p>
          </div>
        </div>
      </Section>

      {/* Success Tips */}
      <Section title="Career Success Tips" subtitle="Get Ahead">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {[
              "Start early — visit the Career Center from Year 1",
              "Take advantage of internship opportunities during holidays",
              "Attend career fairs and networking events",
              "Build your LinkedIn profile and professional network",
              "Develop both technical and soft skills",
              "Seek mentorship from faculty and alumni",
            ].map((tip, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-gray-200",
                )}
              >
                <CheckCircle
                  className={cn(
                    "w-5 h-5 flex-shrink-0 mt-0.5",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                />
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-300" : "text-gray-700",
                  )}
                >
                  {tip}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        title="Frequently Asked Questions"
        subtitle="Quick Answers"
        background="alt"
      >
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>

      <CTABanner
        title="Ready to Launch Your Career?"
        description="Book an appointment with a career advisor today."
        primaryAction={{
          label: "Book Appointment",
          href: "/contact?topic=career",
        }}
        secondaryAction={{
          label: "Browse Jobs",
          href: "https://careers.unidel.edu.ng",
        }}
      />
    </>
  );
};

export default Careers;
