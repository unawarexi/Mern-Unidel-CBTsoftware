/**
 * Scholarships Page
 * Financial aid and scholarship information with dynamic data
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { usePublicScholarshipsAction } from "../../store/public-store";
import {
  CardSkeleton,
  StatsSkeleton,
} from "../../components/ui/SectionSkeleton";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  InfoGrid,
  StatsBanner,
  Accordion,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  Award,
  GraduationCap,
  Users,
  Globe,
  Heart,
  Target,
  CheckCircle,
  Calendar,
  FileText,
  ArrowRight,
  Download,
} from "lucide-react";
import ExportButton from "../../components/ExportButton";

// Icon mapping for scholarship types
const iconMap = {
  merit: Award,
  academic: GraduationCap,
  leadership: Users,
  international: Globe,
  need: Heart,
  stem: Target,
  default: Award,
};

// Default stats when loading
const defaultStats = [
  { value: "₦500M+", label: "Annual Scholarship Fund" },
  { value: "2,000+", label: "Beneficiaries Annually" },
  { value: "35%", label: "Students on Aid" },
  { value: "12", label: "Scholarship Programs" },
];

const applicationSteps = [
  {
    icon: FileText,
    title: "Check Eligibility",
    description:
      "Review the eligibility criteria for each scholarship to identify the ones you qualify for.",
  },
  {
    icon: Users,
    title: "Gather Documents",
    description:
      "Prepare required documents including academic transcripts, recommendation letters, and financial statements.",
  },
  {
    icon: GraduationCap,
    title: "Submit Application",
    description:
      "Complete the online scholarship application form through your student portal.",
  },
  {
    icon: CheckCircle,
    title: "Await Decision",
    description:
      "Applications are reviewed by the Scholarship Committee. Decisions are communicated via email.",
  },
];

const faqItems = [
  {
    question: "Can I apply for multiple scholarships?",
    answer:
      "Yes, you can apply for multiple scholarships as long as you meet the eligibility criteria for each. However, if awarded multiple scholarships, you may only accept the one with the highest value.",
  },
  {
    question: "When will I know if I've been awarded a scholarship?",
    answer:
      "Scholarship decisions are typically communicated within 4-6 weeks of the application deadline. For rolling admissions, expect to hear back within 4 weeks of submitting your application.",
  },
  {
    question: "Are scholarships renewable?",
    answer:
      "Most academic scholarships are renewable if you maintain the required CGPA (usually 3.5 or higher) and remain in good standing. Need-based aid requires annual reapplication.",
  },
  {
    question: "What if my application is not successful?",
    answer:
      "If your scholarship application is unsuccessful, you can reapply for the next cycle. We also recommend exploring our payment plans and work-study programs as alternatives.",
  },
  {
    question: "Can international students apply for scholarships?",
    answer:
      "Yes! We have specific scholarships for international students, plus they can apply for merit-based awards that are open to all students.",
  },
];

const Scholarships = () => {
  const { isDarkMode } = useThemeStore();

  // Fetch scholarships from API
  const {
    scholarships: apiScholarships,
    stats: apiStats,
    isLoading,
  } = usePublicScholarshipsAction();

  // Transform API data for component use
  const scholarships = apiScholarships.map((scholarship) => ({
    icon: iconMap[scholarship.type] || iconMap.default,
    title: scholarship.title,
    description: scholarship.description,
    eligibility: scholarship.eligibility,
    coverage: scholarship.coverage,
    deadline: scholarship.deadline || "Rolling",
  }));

  // Use API stats or defaults
  const scholarshipStats =
    apiStats && Object.keys(apiStats).length > 0
      ? [
          {
            value: apiStats.totalFund || "₦500M+",
            label: "Annual Scholarship Fund",
          },
          {
            value: apiStats.beneficiaries || "2,000+",
            label: "Beneficiaries Annually",
          },
          { value: apiStats.percentOnAid || "35%", label: "Students on Aid" },
          { value: apiStats.programs || "12", label: "Scholarship Programs" },
        ]
      : defaultStats;

  return (
    <>
      <PageHeader
        subtitle="Financial Aid"
        title="Scholarships & Grants"
        description="UNIDEL is committed to making quality education accessible. We offer over ₦500 million annually in scholarships and financial aid to deserving students."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "#" },
          { label: "Scholarships" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <ExportButton
            type="scholarships-report"
            title="University Scholarships & Grants 2026/2027"
            className="!rounded-lg"
          />
        </div>
      </PageHeader>

      <StatsBanner stats={scholarshipStats} background="gradient" />

      {/* Available Scholarships */}
      <Section
        title="Available Scholarships"
        subtitle="2026/2027 Session"
        description="Explore our range of scholarship opportunities. Click on any scholarship to learn more and apply."
      >
        {/* Loading State */}
        {isLoading && <CardSkeleton count={6} layout="grid" />}

        {/* Empty State */}
        {!isLoading && scholarships.length === 0 && (
          <div
            className={cn(
              "text-center py-12 rounded-xl",
              isDarkMode ? "bg-slate-900" : "bg-gray-50",
            )}
          >
            <Award
              className={cn(
                "w-12 h-12 mx-auto mb-4",
                isDarkMode ? "text-gray-600" : "text-gray-400",
              )}
            />
            <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
              Scholarship information coming soon
            </p>
          </div>
        )}

        {/* Scholarships Grid */}
        {!isLoading && scholarships.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarships.map((scholarship, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-6 rounded-xl border transition-all hover:scale-[1.02]",
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
                  <scholarship.icon className="w-6 h-6" />
                </div>
                <h3
                  className={cn(
                    "font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {scholarship.title}
                </h3>
                <p
                  className={cn(
                    "text-sm leading-relaxed mb-4",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {scholarship.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-500" : "text-gray-500"}
                    >
                      Coverage:
                    </span>
                    <span
                      className={cn(
                        "font-medium",
                        isDarkMode ? "text-orange-400" : "text-orange-600",
                      )}
                    >
                      {scholarship.coverage}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span
                      className={isDarkMode ? "text-gray-500" : "text-gray-500"}
                    >
                      Deadline:
                    </span>
                    <span
                      className={isDarkMode ? "text-white" : "text-gray-900"}
                    >
                      {scholarship.deadline}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "px-3 py-2 rounded-lg text-xs",
                    isDarkMode
                      ? "bg-slate-800 text-gray-300"
                      : "bg-gray-100 text-gray-700",
                  )}
                >
                  <strong>Eligibility:</strong> {scholarship.eligibility}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* How to Apply */}
      <Section
        title="How to Apply"
        subtitle="Application Process"
        description="Follow these steps to apply for scholarships. Most applications can be completed online."
        background="alt"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {applicationSteps.map((step, idx) => (
            <div key={idx} className="text-center">
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4",
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-orange-100 text-orange-600",
                )}
              >
                <step.icon className="w-7 h-7" />
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
                  "text-sm",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Tips for Success */}
      <Section title="Tips for a Successful Application" subtitle="Pro Tips">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {[
              "Start early — don't wait until the deadline to gather documents",
              "Write a compelling personal statement that highlights your achievements",
              "Get strong recommendation letters from teachers who know you well",
              "Be honest about your financial situation if applying for need-based aid",
              "Proofread your application carefully before submitting",
              "Follow up with the Scholarship Office if you haven't heard back",
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
        subtitle="Need Answers?"
        background="alt"
      >
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>

      <CTABanner
        title="Don't Let Finances Hold You Back"
        description="There's a scholarship opportunity for you. Apply today and invest in your future."
        primaryAction={{ label: "Apply for Scholarships", href: "/apply" }}
        secondaryAction={{ label: "Contact Financial Aid", href: "/contact" }}
      />
    </>
  );
};

export default Scholarships;
