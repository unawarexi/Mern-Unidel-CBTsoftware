/**
 * Apply Now Page
 * Admissions application portal
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  StatsBanner,
  InfoGrid,
  Accordion,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  FileText,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  Users,
  ArrowRight,
  Download,
  HelpCircle,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react";

const applicationSteps = [
  {
    icon: FileText,
    title: "1. Create Account",
    description:
      "Register on our application portal with a valid email address. You'll receive a confirmation link to verify your account.",
  },
  {
    icon: CheckCircle,
    title: "2. Complete Application",
    description:
      "Fill in your personal details, educational background, and program preferences. Upload required documents including O'Level results and birth certificate.",
  },
  {
    icon: CreditCard,
    title: "3. Pay Application Fee",
    description:
      "Pay the non-refundable application fee of ₦10,000 through any of our secure payment channels: card, bank transfer, or USSD.",
  },
  {
    icon: Calendar,
    title: "4. Schedule Screening",
    description:
      "After successful payment, schedule your post-UTME screening test at a time convenient for you within the screening period.",
  },
  {
    icon: Users,
    title: "5. Attend Screening",
    description:
      "Take your computer-based screening test at our designated center. Bring your payment receipt, valid ID, and original credentials.",
  },
  {
    icon: CheckCircle,
    title: "6. Check Admission Status",
    description:
      "Results are typically released within 2 weeks. Check your application portal for admission status and next steps.",
  },
];

const admissionStats = [
  { value: "15,000+", label: "Applications Received" },
  { value: "3,500+", label: "Admitted Annually" },
  { value: "180+", label: "Minimum UTME Score" },
  { value: "85%", label: "Acceptance Rate" },
];

const programCategories = [
  {
    title: "Sciences & Technology",
    programs: [
      "Computer Science",
      "Physics",
      "Chemistry",
      "Biology",
      "Mathematics",
      "Software Engineering",
      "Cybersecurity",
    ],
    requirement: "UTME: 200+",
  },
  {
    title: "Engineering",
    programs: [
      "Civil Engineering",
      "Mechanical Engineering",
      "Electrical Engineering",
      "Chemical Engineering",
      "Petroleum Engineering",
    ],
    requirement: "UTME: 220+",
  },
  {
    title: "Arts & Social Sciences",
    programs: [
      "English",
      "History",
      "Economics",
      "Political Science",
      "Mass Communication",
      "Psychology",
    ],
    requirement: "UTME: 180+",
  },
  {
    title: "Management & Law",
    programs: [
      "Accounting",
      "Business Administration",
      "Banking & Finance",
      "Law",
    ],
    requirement: "UTME: 200+",
  },
];

const deadlines = [
  { event: "Application Opens", date: "January 15, 2026", status: "completed" },
  {
    event: "Early Decision Deadline",
    date: "March 31, 2026",
    status: "active",
  },
  {
    event: "Regular Decision Deadline",
    date: "May 31, 2026",
    status: "upcoming",
  },
  {
    event: "Post-UTME Screening",
    date: "June 15 - July 15, 2026",
    status: "upcoming",
  },
  {
    event: "Admission Letters Released",
    date: "August 1, 2026",
    status: "upcoming",
  },
  {
    event: "Registration Deadline",
    date: "September 30, 2026",
    status: "upcoming",
  },
];

const faqItems = [
  {
    question: "What UTME score do I need for admission?",
    answer:
      "Minimum UTME score requirements vary by program. Generally, Science and Engineering programs require 200+, while Arts and Social Sciences require 180+. However, meeting the minimum score doesn't guarantee admission as selection is competitive.",
  },
  {
    question: "Can I change my course after applying?",
    answer:
      "Yes, you can request a course change through your application portal before the screening deadline. Note that changing to a more competitive course may affect your chances if your score is borderline.",
  },
  {
    question: "What documents do I need for screening?",
    answer:
      "You'll need: Original O'Level result(s) or statement of result, UTME printout, payment receipt, valid government-issued ID (NIN, passport, or driver's license), and 2 passport photographs.",
  },
  {
    question: "Is accommodation guaranteed for all students?",
    answer:
      "Accommodation is available on a first-come, first-served basis. We strongly recommend applying for hostel allocation immediately after accepting your admission offer.",
  },
  {
    question: "Are there scholarship opportunities for freshmen?",
    answer:
      "Yes! UNIDEL offers merit-based scholarships for students with exceptional UTME scores (300+) and first-class O'Level results. Need-based scholarships are also available.",
  },
];

const ApplyNow = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Admissions 2026/2027"
        title="Apply to UNIDEL"
        description="Begin your journey to academic excellence. Our streamlined application process guides you every step of the way. Applications for the 2026/2027 academic session are now open."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "#" },
          { label: "Apply Now" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-8">
          <Link
            to="/auth/selection"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg text-sm"
          >
            Start Application <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/requirements"
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl border transition-all",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
            )}
          >
            View Requirements
          </Link>
        </div>
      </PageHeader>

      <StatsBanner stats={admissionStats} background="gradient" />

      {/* Application Steps */}
      <Section
        title="How to Apply"
        subtitle="Application Process"
        description="Follow these steps to complete your application. The entire process can be completed online in about 30 minutes."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationSteps.map((step, idx) => (
            <div
              key={idx}
              className={cn(
                "relative p-6 rounded-xl border transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
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
                <step.icon className="w-6 h-6" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {step.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Important Deadlines */}
      <Section
        title="Important Deadlines"
        subtitle="Key Dates"
        background="alt"
      >
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {deadlines.map((deadline, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-center justify-between p-4 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-gray-200",
                )}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full",
                      deadline.status === "completed" && "bg-green-500",
                      deadline.status === "active" &&
                        "bg-orange-500 animate-pulse",
                      deadline.status === "upcoming" &&
                        (isDarkMode ? "bg-slate-600" : "bg-gray-300"),
                    )}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      deadline.status === "completed" &&
                        (isDarkMode
                          ? "text-gray-500 line-through"
                          : "text-gray-400 line-through"),
                      deadline.status === "active" &&
                        (isDarkMode ? "text-orange-400" : "text-orange-600"),
                      deadline.status === "upcoming" &&
                        (isDarkMode ? "text-white" : "text-gray-900"),
                    )}
                  >
                    {deadline.event}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {deadline.date}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Programs & Requirements */}
      <Section
        title="Programs & Requirements"
        subtitle="What We Offer"
        description="Explore our diverse range of programs. Click on any category to see available options and specific requirements."
      >
        <div className="grid md:grid-cols-2 gap-6">
          {programCategories.map((category, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-xl border",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <h3
                  className={cn(
                    "font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {category.title}
                </h3>
                <span
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold",
                    isDarkMode
                      ? "bg-orange-500/20 text-orange-400"
                      : "bg-orange-100 text-orange-600",
                  )}
                >
                  {category.requirement}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.programs.map((program, pIdx) => (
                  <span
                    key={pIdx}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs",
                      isDarkMode
                        ? "bg-slate-800 text-gray-300"
                        : "bg-gray-100 text-gray-700",
                    )}
                  >
                    {program}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            to="/programs"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-medium",
              isDarkMode
                ? "text-orange-400 hover:text-orange-300"
                : "text-orange-600 hover:text-orange-700",
            )}
          >
            View all programs and detailed requirements{" "}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Section>

      {/* FAQ */}
      <Section
        title="Frequently Asked Questions"
        subtitle="Need Help?"
        background="alt"
      >
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>

      {/* Contact Support */}
      <Section>
        <div
          className={cn(
            "p-8 rounded-2xl border text-center",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-orange-50 border-orange-100",
          )}
        >
          <HelpCircle
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          />
          <h3
            className={cn(
              "text-xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Need Assistance?
          </h3>
          <p
            className={cn(
              "text-sm mb-6 max-w-lg mx-auto",
              isDarkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Our admissions team is here to help you through the application
            process. Contact us via any of the channels below.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="mailto:admissions@unidel.edu.ng"
              className={cn(
                "flex items-center gap-2 text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Mail className="w-4 h-4" /> admissions@unidel.edu.ng
            </a>
            <a
              href="tel:+2348012345678"
              className={cn(
                "flex items-center gap-2 text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              <Phone className="w-4 h-4" /> +234 801 234 5678
            </a>
          </div>
        </div>
      </Section>

      <CTABanner
        title="Ready to Join UNIDEL?"
        description="Take the first step towards your future. Start your application today."
        primaryAction={{
          label: "Apply Now",
          href: "/auth/selection",
        }}
        secondaryAction={{ label: "Schedule Campus Visit", href: "/campus" }}
      />
    </>
  );
};

export default ApplyNow;
