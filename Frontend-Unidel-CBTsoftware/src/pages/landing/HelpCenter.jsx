/**
 * Help Center Page
 * Support resources and FAQs
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  Accordion,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  Search,
  HelpCircle,
  BookOpen,
  CreditCard,
  GraduationCap,
  Monitor,
  Users,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  ChevronRight,
  FileText,
  Home,
  Calendar,
} from "lucide-react";

const helpCategories = [
  {
    icon: GraduationCap,
    title: "Admissions",
    description:
      "Application process, requirements, deadlines, and admission status",
    link: "/help/admissions",
    articles: 24,
  },
  {
    icon: CreditCard,
    title: "Fees & Payments",
    description: "Tuition, payment methods, installments, and receipt issues",
    link: "/help/fees",
    articles: 18,
  },
  {
    icon: BookOpen,
    title: "Academic Support",
    description: "Course registration, exams, transcripts, and graduation",
    link: "/help/academic",
    articles: 32,
  },
  {
    icon: Monitor,
    title: "CBT & Technical",
    description:
      "Exam login, technical issues, password reset, and browser setup",
    link: "/help/technical",
    articles: 15,
  },
  {
    icon: Home,
    title: "Student Life",
    description: "Housing, dining, health services, and student organizations",
    link: "/help/student-life",
    articles: 21,
  },
  {
    icon: FileText,
    title: "Documents & Forms",
    description: "Request forms, letters, certificates, and verification",
    link: "/help/documents",
    articles: 12,
  },
];

const popularArticles = [
  {
    title: "How to reset my student portal password",
    category: "Technical",
    views: "15,230",
  },
  {
    title: "Checking my admission status",
    category: "Admissions",
    views: "12,450",
  },
  { title: "How to pay fees online", category: "Fees", views: "10,890" },
  {
    title: "Course registration deadline and process",
    category: "Academic",
    views: "9,750",
  },
  {
    title: "Accessing the CBT platform for exams",
    category: "Technical",
    views: "8,920",
  },
  {
    title: "Hostel allocation and room assignment",
    category: "Student Life",
    views: "7,340",
  },
];

const faqItems = [
  {
    question: "How do I reset my student portal password?",
    answer:
      "Go to the student portal login page and click 'Forgot Password'. Enter your registered email address, and you'll receive a password reset link. If you don't receive the email, check your spam folder or contact ICT support.",
  },
  {
    question: "When is the deadline for course registration?",
    answer:
      "Course registration typically opens 2 weeks before each semester and closes 4 weeks after the semester begins. Late registration attracts additional fees. Check the academic calendar for exact dates.",
  },
  {
    question: "How can I check my examination results?",
    answer:
      "Log in to your student portal, navigate to 'Academic Records' > 'Semester Results'. Results are usually published 4-6 weeks after the examination period. Contact the Registrar's office for any discrepancies.",
  },
  {
    question:
      "What should I do if I can't access the CBT platform during exams?",
    answer:
      "First, ensure you're using a supported browser (Chrome or Firefox). Clear your cache and cookies. If the problem persists, contact the invigilator immediately or reach out to the ICT help desk at the exam center.",
  },
  {
    question: "How do I apply for a transcript or certificate?",
    answer:
      "Visit the Academic Office or apply online through the student portal. Select the type of document, pay the required fee, and allow 2-4 weeks for processing. International transcripts may take longer.",
  },
  {
    question: "Can I defer my admission to the next session?",
    answer:
      "Yes, deferment is possible for valid reasons (medical, financial, etc.). Submit a formal deferment request to the Admissions Office within 4 weeks of receiving your admission letter. Deferment is granted for a maximum of one academic session.",
  },
];

const contactChannels = [
  {
    icon: Phone,
    title: "Phone Support",
    description: "Call our support line for immediate assistance",
    contact: "+234 801 234 5678",
    hours: "Mon-Fri: 8AM - 6PM",
  },
  {
    icon: Mail,
    title: "Email Support",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "support@unidel.edu.ng",
    hours: "24/7 (Response: 24hrs)",
  },
  {
    icon: MessageSquare,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Start Chat",
    hours: "Mon-Fri: 9AM - 5PM",
  },
];

const HelpCenter = () => {
  const { isDarkMode } = useThemeStore();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <PageHeader
        subtitle="We're Here to Help"
        title="Help Center"
        description="Find answers to your questions, browse helpful articles, or connect with our support team. We're committed to helping you succeed at UNIDEL."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Resources", href: "#" },
          { label: "Help Center" },
        ]}
      />

      {/* Search Section */}
      <Section>
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search
              className={cn(
                "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                isDarkMode ? "text-gray-500" : "text-gray-400",
              )}
            />
            <input
              type="text"
              placeholder="Search for help articles, FAQs, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-12 pr-4 py-4 rounded-xl border text-base focus:outline-none focus:ring-2",
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:ring-orange-500/50 focus:border-orange-500"
                  : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-orange-200 focus:border-orange-500",
              )}
            />
          </div>
          <p
            className={cn(
              "text-sm text-center mt-3",
              isDarkMode ? "text-gray-500" : "text-gray-500",
            )}
          >
            Popular searches: password reset, course registration, fee payment,
            transcript
          </p>
        </div>
      </Section>

      {/* Help Categories */}
      <Section
        title="Browse by Category"
        subtitle="Help Topics"
        description="Select a category to find relevant help articles and resources."
        background="alt"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {helpCategories.map((category, idx) => (
            <Link
              key={idx}
              to={category.link}
              className={cn(
                "group p-6 rounded-xl border transition-all hover:scale-[1.02]",
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
                <category.icon className="w-6 h-6" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2 group-hover:text-orange-500 transition-colors",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {category.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {category.description}
              </p>
              <span
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                {category.articles} articles
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Popular Articles & FAQ */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Popular Articles */}
          <div>
            <h3
              className={cn(
                "text-lg font-bold mb-6",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Popular Articles
            </h3>
            <div className="space-y-3">
              {popularArticles.map((article, idx) => (
                <Link
                  key={idx}
                  to={`/help/article/${idx}`}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all",
                    isDarkMode
                      ? "bg-slate-900 border-slate-700 hover:border-orange-500/30"
                      : "bg-white border-gray-200 hover:shadow-md",
                  )}
                >
                  <div>
                    <h4
                      className={cn(
                        "font-medium mb-1",
                        isDarkMode ? "text-white" : "text-gray-900",
                      )}
                    >
                      {article.title}
                    </h4>
                    <span
                      className={cn(
                        "text-xs",
                        isDarkMode ? "text-gray-500" : "text-gray-500",
                      )}
                    >
                      {article.category} • {article.views} views
                    </span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-5 h-5",
                      isDarkMode ? "text-gray-600" : "text-gray-400",
                    )}
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick FAQ */}
          <div>
            <h3
              className={cn(
                "text-lg font-bold mb-6",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Frequently Asked Questions
            </h3>
            <Accordion items={faqItems.slice(0, 4)} />
            <div className="mt-4">
              <Link
                to="/faq"
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-medium",
                  isDarkMode
                    ? "text-orange-400 hover:text-orange-300"
                    : "text-orange-600 hover:text-orange-700",
                )}
              >
                View all FAQs <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Contact Support */}
      <Section
        title="Still Need Help?"
        subtitle="Contact Support"
        description="Can't find what you're looking for? Our support team is ready to assist you."
        background="alt"
      >
        <div className="grid md:grid-cols-3 gap-6">
          {contactChannels.map((channel, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-xl border text-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4",
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-orange-100 text-orange-600",
                )}
              >
                <channel.icon className="w-7 h-7" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {channel.title}
              </h3>
              <p
                className={cn(
                  "text-sm mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {channel.description}
              </p>
              <p
                className={cn(
                  "font-medium mb-2",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {channel.contact}
              </p>
              <p
                className={cn(
                  "text-xs flex items-center justify-center gap-1",
                  isDarkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                <Clock className="w-3 h-3" /> {channel.hours}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner
        title="Can't Find Your Answer?"
        description="Submit a support ticket and we'll get back to you within 24 hours."
        primaryAction={{ label: "Submit Ticket", href: "/contact" }}
        secondaryAction={{ label: "Live Chat", href: "#chat" }}
      />
    </>
  );
};

export default HelpCenter;
