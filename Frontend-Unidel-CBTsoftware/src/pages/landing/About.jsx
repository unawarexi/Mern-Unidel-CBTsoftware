/**
 * About Page
 * University history, mission, and values
 */
import React from "react";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  Timeline,
  StatsBanner,
  InfoGrid,
  QuoteBlock,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  Target,
  Eye,
  Heart,
  Shield,
  Users,
  Award,
  Globe,
  BookOpen,
  Lightbulb,
  Building2,
} from "lucide-react";

const historyEvents = [
  {
    year: "1985",
    title: "Foundation Year",
    description:
      "The University of Delta was established by the Federal Government of Nigeria as part of the third generation of federal universities, with a mandate to serve the educational needs of the Niger Delta region.",
  },
  {
    year: "1992",
    title: "First Graduation Ceremony",
    description:
      "UNIDEL celebrated its first convocation ceremony, graduating 342 students across 5 faculties. This milestone marked the beginning of a proud tradition of academic excellence.",
  },
  {
    year: "2001",
    title: "Postgraduate School Established",
    description:
      "The university expanded its academic offerings with the establishment of the School of Postgraduate Studies, opening doors for advanced research and specialized training.",
  },
  {
    year: "2010",
    title: "NUC Full Accreditation",
    description:
      "All academic programs received full accreditation from the National Universities Commission (NUC), cementing UNIDEL's reputation for quality education.",
  },
  {
    year: "2018",
    title: "CBT Platform Launch",
    description:
      "UNIDEL pioneered computer-based testing in the region, becoming one of the first Nigerian universities to fully digitize its examination system.",
  },
  {
    year: "2024",
    title: "Global Recognition",
    description:
      "UNIDEL ranked among the top 50 universities in Africa and established partnerships with institutions across Europe, America, and Asia.",
  },
];

const coreValues = [
  {
    icon: Target,
    title: "Excellence",
    description:
      "We pursue the highest standards in teaching, research, and community service. Mediocrity has no place in our institution.",
  },
  {
    icon: Shield,
    title: "Integrity",
    description:
      "We uphold honesty, transparency, and ethical behavior in all our academic and administrative activities.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "We embrace creativity and forward-thinking approaches to solve contemporary challenges and prepare students for the future.",
  },
  {
    icon: Users,
    title: "Inclusivity",
    description:
      "We celebrate diversity and ensure equal opportunities for all students regardless of background, gender, or ability.",
  },
  {
    icon: Heart,
    title: "Service",
    description:
      "We are committed to using our knowledge and resources to serve our community, nation, and humanity at large.",
  },
  {
    icon: Globe,
    title: "Global Outlook",
    description:
      "We prepare students to thrive in an interconnected world through international collaborations and global perspectives.",
  },
];

const aboutStats = [
  { value: "40+", label: "Years of Excellence" },
  { value: "25,000+", label: "Students Enrolled" },
  { value: "85,000+", label: "Alumni Worldwide" },
  { value: "8", label: "Faculties" },
];

const About = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Est. 1985"
        title="About UNIDEL"
        description="For nearly four decades, the University of Delta has been at the forefront of higher education in Nigeria, producing leaders, innovators, and change-makers who have transformed communities across the globe."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        size="lg"
      />

      <StatsBanner stats={aboutStats} background="gradient" />

      {/* Vision & Mission */}
      <Section background="alt">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          <div
            className={cn(
              "p-8 rounded-2xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                isDarkMode
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-orange-100 text-orange-600",
              )}
            >
              <Eye className="w-7 h-7" />
            </div>
            <h2
              className={cn(
                "text-2xl font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Our Vision
            </h2>
            <p
              className={cn(
                "text-base leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              To be a world-class university recognized for excellence in
              teaching, research, and innovation, producing graduates who are
              globally competitive, ethically grounded, and committed to
              transforming society.
            </p>
          </div>
          <div
            className={cn(
              "p-8 rounded-2xl border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-white border-gray-200",
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center mb-6",
                isDarkMode
                  ? "bg-blue-500/20 text-blue-400"
                  : "bg-blue-100 text-blue-600",
              )}
            >
              <Target className="w-7 h-7" />
            </div>
            <h2
              className={cn(
                "text-2xl font-bold mb-4",
                isDarkMode ? "text-white" : "text-gray-900",
              )}
            >
              Our Mission
            </h2>
            <p
              className={cn(
                "text-base leading-relaxed",
                isDarkMode ? "text-gray-300" : "text-gray-600",
              )}
            >
              To provide quality, accessible, and affordable education that
              equips students with knowledge, skills, and values to excel in
              their chosen fields; to conduct cutting-edge research that
              addresses societal challenges; and to engage with communities to
              drive sustainable development.
            </p>
          </div>
        </div>
      </Section>

      {/* History Timeline */}
      <Section
        title="Our History"
        subtitle="Journey Through Time"
        description="From humble beginnings to becoming one of Nigeria's premier institutions, explore the milestones that have shaped our university."
      >
        <Timeline events={historyEvents} />
      </Section>

      {/* Core Values */}
      <Section
        title="Our Core Values"
        subtitle="What We Stand For"
        description="These principles guide everything we do at UNIDEL, from curriculum design to administrative decisions, from research priorities to community engagement."
        background="alt"
      >
        <InfoGrid items={coreValues} columns={3} />
      </Section>

      {/* VC Message */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <QuoteBlock
            quote="At the University of Delta, we don't just educate students—we nurture future leaders who will shape the destiny of Nigeria and Africa. Our commitment to excellence, innovation, and service remains unwavering as we prepare the next generation to tackle global challenges with confidence and integrity."
            author="Prof. Emmanuel Adebayo, FNAS"
            role="Vice-Chancellor, University of Delta"
          />
        </div>
      </Section>

      {/* Quick Facts */}
      <Section
        title="UNIDEL at a Glance"
        subtitle="Quick Facts"
        background="alt"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Building2, label: "Faculties", value: "8" },
            { icon: BookOpen, label: "Academic Programs", value: "140+" },
            { icon: Users, label: "Faculty Members", value: "1,500+" },
            { icon: Award, label: "Research Publications", value: "5,000+" },
            { icon: Globe, label: "International Partners", value: "75+" },
            { icon: Target, label: "Research Centers", value: "12" },
            { icon: Shield, label: "NUC Accredited Programs", value: "100%" },
            { icon: Heart, label: "Community Projects", value: "200+" },
          ].map((fact, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-4 p-5 rounded-xl border",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0",
                  isDarkMode
                    ? "bg-slate-800 text-orange-400"
                    : "bg-orange-50 text-orange-600",
                )}
              >
                <fact.icon className="w-6 h-6" />
              </div>
              <div>
                <div
                  className={cn(
                    "text-2xl font-bold",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {fact.value}
                </div>
                <div
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {fact.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner
        title="Become Part of Our Legacy"
        description="Join a community of scholars, innovators, and leaders. Your journey to excellence starts here."
        primaryAction={{ label: "Apply Now", href: "/apply" }}
        secondaryAction={{ label: "Schedule a Visit", href: "/campus" }}
      />
    </>
  );
};

export default About;
