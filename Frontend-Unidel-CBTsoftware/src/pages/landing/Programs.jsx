/**
 * Programs Section
 * Academic programs listing for the university landing page
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { Section } from "../../containers/PageLayout";
import {
  InfoGrid,
  StatsBanner,
  TabbedContent,
  Accordion,
  QuoteBlock,
} from "../../components/landing/LandingComponents";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  Award,
  Globe,
  Monitor,
  FlaskConical,
  Calculator,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

// Program data
const undergraduatePrograms = [
  {
    icon: FlaskConical,
    title: "Bachelor of Science (B.Sc.)",
    description:
      "Comprehensive science programs covering Physics, Chemistry, Biology, Microbiology, Biochemistry, and more.",
    duration: "4 years",
    seats: "500",
  },
  {
    icon: Monitor,
    title: "Bachelor of Technology (B.Tech.)",
    description:
      "Industry-focused technology programs in Computer Science, Software Engineering, and Cybersecurity.",
    duration: "4 years",
    seats: "400",
  },
  {
    icon: Calculator,
    title: "Bachelor of Engineering (B.Eng.)",
    description:
      "Accredited engineering programs in Civil, Mechanical, Electrical, Chemical, and Petroleum Engineering.",
    duration: "5 years",
    seats: "350",
  },
  {
    icon: Briefcase,
    title: "Bachelor of Arts (B.A.)",
    description:
      "Humanities and social sciences programs including English, History, Philosophy, and Economics.",
    duration: "4 years",
    seats: "300",
  },
  {
    icon: Users,
    title: "Bachelor of Science in Education (B.Sc.Ed.)",
    description:
      "Teacher education programs combining subject expertise with pedagogical training.",
    duration: "4 years",
    seats: "200",
  },
  {
    icon: Award,
    title: "Bachelor of Law (LL.B.)",
    description:
      "Rigorous legal education covering Nigerian and international law with moot court experience.",
    duration: "5 years",
    seats: "150",
  },
];

const graduatePrograms = [
  {
    icon: GraduationCap,
    title: "Master of Science (M.Sc.)",
    description:
      "Advanced research-focused programs across all science disciplines with experienced supervisors.",
  },
  {
    icon: BookOpen,
    title: "Master of Business Administration (MBA)",
    description:
      "Executive MBA programs with specializations in Finance, Marketing, and Entrepreneurship.",
  },
  {
    icon: FlaskConical,
    title: "Doctor of Philosophy (Ph.D.)",
    description:
      "Doctoral research programs emphasizing original contribution to knowledge.",
  },
  {
    icon: Award,
    title: "Postgraduate Diploma (PGD)",
    description:
      "Bridge programs for career changers seeking additional qualifications.",
  },
];

const professionalPrograms = [
  {
    icon: Monitor,
    title: "Certificate in Data Science",
    description:
      "Industry-recognized certification covering Python, Machine Learning, and Big Data Analytics.",
  },
  {
    icon: Globe,
    title: "Certificate in Project Management",
    description:
      "PMP-aligned curriculum covering project planning, execution, and agile methodologies.",
  },
  {
    icon: Briefcase,
    title: "Executive Leadership Program",
    description:
      "Designed for senior managers covering strategic thinking and change management.",
  },
];

const programStats = [
  { value: "75+", label: "Undergraduate Programs" },
  { value: "50+", label: "Postgraduate Programs" },
  { value: "15+", label: "Professional Certificates" },
  { value: "95%", label: "Graduate Employment Rate" },
];

const faqItems = [
  {
    question: "What are the admission requirements?",
    answer:
      "Requirements include 5 O'Level credits, UTME score of 180+, and satisfactory post-UTME screening.",
  },
  {
    question: "Can I transfer credits?",
    answer:
      "Yes, credit transfer is evaluated case-by-case. Courses with grade C or better may be transferred.",
  },
  {
    question: "Are scholarships available?",
    answer:
      "Yes, we offer merit-based, need-based, and special scholarships. Visit our Scholarships section.",
  },
];

const Programs = () => {
  const { isDarkMode } = useThemeStore();

  const tabContent = [
    {
      title: "Undergraduate",
      content: (
        <div className="space-y-6">
          <p
            className={cn(
              "text-base leading-relaxed mb-8",
              isDarkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Our undergraduate programs provide a solid foundation while
            developing critical thinking and leadership skills.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {undergraduatePrograms.map((program, idx) => (
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
                  <program.icon className="w-6 h-6" />
                </div>
                <h3
                  className={cn(
                    "font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {program.title}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-4 leading-relaxed",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {program.description}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      isDarkMode ? "text-gray-500" : "text-gray-500",
                    )}
                  >
                    <Clock className="w-3.5 h-3.5" /> {program.duration}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-1",
                      isDarkMode ? "text-gray-500" : "text-gray-500",
                    )}
                  >
                    <Users className="w-3.5 h-3.5" /> {program.seats} seats
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: "Graduate",
      content: (
        <div className="space-y-6">
          <p
            className={cn(
              "text-base leading-relaxed mb-8",
              isDarkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Graduate programs emphasize advanced knowledge, research skills, and
            professional development.
          </p>
          <InfoGrid items={graduatePrograms} columns={2} />
        </div>
      ),
    },
    {
      title: "Professional",
      content: (
        <div className="space-y-6">
          <p
            className={cn(
              "text-base leading-relaxed mb-8",
              isDarkMode ? "text-gray-300" : "text-gray-600",
            )}
          >
            Short-term, intensive programs providing practical,
            industry-relevant training.
          </p>
          <InfoGrid items={professionalPrograms} columns={3} />
        </div>
      ),
    },
  ];

  return (
    <>
      {/* Stats Banner */}
      <StatsBanner stats={programStats} background="gradient" />

      {/* Programs Section */}
      <Section
        title="Explore Our Programs"
        subtitle="Academic Offerings"
        description="Choose from undergraduate, graduate, and professional programs designed to prepare you for success."
      >
        <TabbedContent tabs={tabContent} />
      </Section>

      {/* Why Choose Us */}
      <Section
        title="Why Choose UNIDEL?"
        subtitle="Your Success, Our Mission"
        background="alt"
      >
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            {[
              "NUC-accredited programs with industry-aligned curricula",
              "State-of-the-art laboratories and research facilities",
              "Experienced faculty with academic and industry expertise",
              "Strong industry partnerships for internships",
              "Comprehensive student support services",
              "Active alumni network across all sectors",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
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
                  {item}
                </span>
              </div>
            ))}
          </div>
          <QuoteBlock
            quote="My time at UNIDEL transformed my career. The rigorous training combined with practical exposure prepared me for leadership roles."
            author="Dr. Chidinma Okonkwo"
            role="Alumni, Class of 2018"
          />
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Frequently Asked Questions" subtitle="Have Questions?">
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>
    </>
  );
};

export default Programs;
