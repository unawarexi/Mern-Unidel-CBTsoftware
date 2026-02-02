/**
 * Research Page
 * University research centers and initiatives
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  InfoGrid,
  StatsBanner,
  TeamGrid,
  QuoteBlock,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  FlaskConical,
  Beaker,
  Microscope,
  Cpu,
  Leaf,
  Heart,
  Zap,
  Globe,
  BookOpen,
  Award,
  Users,
  FileText,
  ArrowRight,
} from "lucide-react";

const researchCenters = [
  {
    icon: Cpu,
    title: "Center for Artificial Intelligence & Robotics",
    description:
      "Pioneering AI research in machine learning, computer vision, natural language processing, and autonomous systems with industry partnerships.",
    director: "Prof. Adaobi Nwankwo",
    link: "/research/ai-robotics",
  },
  {
    icon: Zap,
    title: "Renewable Energy Research Institute",
    description:
      "Developing sustainable energy solutions including solar, wind, and biomass technologies tailored for African contexts.",
    director: "Prof. Emeka Okafor",
    link: "/research/renewable-energy",
  },
  {
    icon: Leaf,
    title: "Environmental Sciences Research Center",
    description:
      "Addressing climate change, biodiversity conservation, and sustainable agriculture in the Niger Delta region.",
    director: "Prof. Ngozi Eze",
    link: "/research/environmental",
  },
  {
    icon: Heart,
    title: "Public Health Research Institute",
    description:
      "Conducting research on tropical diseases, maternal health, epidemiology, and health systems strengthening.",
    director: "Prof. Fatima Usman",
    link: "/research/public-health",
  },
  {
    icon: Microscope,
    title: "Biotechnology & Genomics Center",
    description:
      "Advancing genomic medicine, agricultural biotechnology, and pharmaceutical development for African populations.",
    director: "Prof. Chukwudi Anene",
    link: "/research/biotech",
  },
  {
    icon: Globe,
    title: "African Development Studies Institute",
    description:
      "Multidisciplinary research on governance, economics, social development, and pan-African integration.",
    director: "Prof. Bala Mohammed",
    link: "/research/development-studies",
  },
];

const researchStats = [
  { value: "₦2.5B", label: "Annual Research Funding" },
  { value: "5,000+", label: "Publications" },
  { value: "12", label: "Research Centers" },
  { value: "150+", label: "Active Projects" },
];

const recentPublications = [
  {
    title:
      "Machine Learning Approaches to Early Detection of Cassava Mosaic Disease",
    authors: "Nwankwo, A., Obi, I., Eze, N.",
    journal: "Journal of Agricultural Informatics",
    year: "2025",
  },
  {
    title:
      "Solar Energy Potential Assessment for Rural Electrification in Delta State",
    authors: "Okafor, E., Adeyemi, O., Musa, I.",
    journal: "Renewable Energy Africa",
    year: "2025",
  },
  {
    title: "Prevalence of Malaria in Pregnant Women: A Meta-Analysis",
    authors: "Usman, F., Suleiman, H., Ojo, B.",
    journal: "African Journal of Public Health",
    year: "2025",
  },
  {
    title: "Deep Learning for Nigerian Language Processing",
    authors: "Nwankwo, A., Bakare, T., Akinwale, K.",
    journal: "Computational Linguistics Quarterly",
    year: "2024",
  },
];

const fundingOpportunities = [
  {
    icon: Award,
    title: "TETFund Research Grants",
    description:
      "Annual grants up to ₦20M for faculty-led research projects aligned with national development priorities.",
    deadline: "April 30, 2026",
  },
  {
    icon: Globe,
    title: "International Collaboration Fund",
    description:
      "Funding for joint research projects with international partner institutions. Travel and equipment support included.",
    deadline: "Rolling",
  },
  {
    icon: FlaskConical,
    title: "Graduate Research Fellowship",
    description:
      "Competitive fellowships for postgraduate students conducting original research with stipend and research allowance.",
    deadline: "February 28, 2026",
  },
];

const Research = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Innovation & Discovery"
        title="Research at UNIDEL"
        description="UNIDEL is at the forefront of research in Nigeria, addressing critical challenges facing Africa and contributing to global knowledge through innovative and impactful research."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Research", href: "#" },
          { label: "Overview" },
        ]}
      />

      <StatsBanner stats={researchStats} background="gradient" />

      {/* Research Centers */}
      <Section
        title="Research Centers"
        subtitle="Centers of Excellence"
        description="Our specialized research centers bring together multidisciplinary teams to tackle complex challenges and drive innovation."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchCenters.map((center, idx) => (
            <Link
              key={idx}
              to={center.link}
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
                <center.icon className="w-6 h-6" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2 group-hover:text-orange-500 transition-colors",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {center.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed mb-3",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {center.description}
              </p>
              <span
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                Director: {center.director}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Recent Publications */}
      <Section
        title="Recent Publications"
        subtitle="Our Research Output"
        background="alt"
      >
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {recentPublications.map((pub, idx) => (
              <div
                key={idx}
                className={cn(
                  "p-5 rounded-xl border",
                  isDarkMode
                    ? "bg-slate-900 border-slate-700"
                    : "bg-white border-gray-200",
                )}
              >
                <h4
                  className={cn(
                    "font-bold mb-2",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {pub.title}
                </h4>
                <p
                  className={cn(
                    "text-sm mb-1",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {pub.authors}
                </p>
                <div className="flex items-center gap-3 text-xs">
                  <span
                    className={cn(
                      "font-medium",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  >
                    {pub.journal}
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-500" : "text-gray-500"}
                  >
                    •
                  </span>
                  <span
                    className={isDarkMode ? "text-gray-500" : "text-gray-500"}
                  >
                    {pub.year}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/research/publications"
              className={cn(
                "inline-flex items-center gap-2 text-sm font-medium",
                isDarkMode
                  ? "text-orange-400 hover:text-orange-300"
                  : "text-orange-600 hover:text-orange-700",
              )}
            >
              View All Publications <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* Research Quote */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <QuoteBlock
            quote="Research at UNIDEL is driven by a commitment to solving real-world problems. Our researchers are not content with ivory tower scholarship—they're in the field, in the lab, and in communities, making a tangible difference in people's lives."
            author="Prof. Ngozi Okonkwo, FCA"
            role="Deputy Vice-Chancellor (Academic)"
          />
        </div>
      </Section>

      {/* Funding Opportunities */}
      <Section
        title="Funding Opportunities"
        subtitle="Support Your Research"
        description="We provide various funding mechanisms to support faculty and student research initiatives."
        background="alt"
      >
        <InfoGrid items={fundingOpportunities} columns={3} />
      </Section>

      {/* For Researchers */}
      <Section
        title="Resources for Researchers"
        subtitle="Support & Infrastructure"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: BookOpen,
              title: "Research Library",
              description:
                "Access to digital journals, databases, and archives",
            },
            {
              icon: FlaskConical,
              title: "Core Facilities",
              description: "Shared labs, equipment, and technical support",
            },
            {
              icon: Users,
              title: "Collaboration Hub",
              description: "Connect with researchers across disciplines",
            },
            {
              icon: FileText,
              title: "Grant Writing Support",
              description: "Workshops and review services for proposals",
            },
          ].map((resource, idx) => (
            <div
              key={idx}
              className={cn(
                "p-5 rounded-xl border text-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3",
                  isDarkMode
                    ? "bg-slate-800 text-orange-400"
                    : "bg-gray-100 text-orange-600",
                )}
              >
                <resource.icon className="w-6 h-6" />
              </div>
              <h4
                className={cn(
                  "font-bold mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {resource.title}
              </h4>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {resource.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner
        title="Partner With Us"
        description="Interested in research collaboration or industry partnership? Let's explore opportunities together."
        primaryAction={{
          label: "Contact Research Office",
          href: "/contact?topic=research",
        }}
        secondaryAction={{
          label: "View Opportunities",
          href: "/research/partnerships",
        }}
      />
    </>
  );
};

export default Research;
