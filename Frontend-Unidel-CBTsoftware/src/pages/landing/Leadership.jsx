/**
 * Leadership Page
 * University administration and governance
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  TeamGrid,
  QuoteBlock,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  Mail,
  Phone,
  Building2,
  Award,
  Users,
  Shield,
  GraduationCap,
  Briefcase,
} from "lucide-react";

const principalOfficers = [
  {
    name: "Prof. Emmanuel Adebayo, FNAS",
    role: "Vice-Chancellor",
    department: "Office of the Vice-Chancellor",
    email: "vc@unidel.edu.ng",
    image: null,
    bio: "Professor of Biochemistry with over 30 years of academic experience. Fellow of the Nigerian Academy of Science. Former Deputy Vice-Chancellor for Research and Innovation at a leading university.",
  },
  {
    name: "Prof. Ngozi Okonkwo, FCA",
    role: "Deputy Vice-Chancellor (Academic)",
    department: "Office of the DVC Academic",
    email: "dvc-academic@unidel.edu.ng",
    image: null,
    bio: "Distinguished Professor of Economics and Fellow of the Institute of Chartered Accountants. Oversees all academic programs, curriculum development, and quality assurance.",
  },
  {
    name: "Prof. Uche Mbadiwe, FNSE",
    role: "Deputy Vice-Chancellor (Administration)",
    department: "Office of the DVC Admin",
    email: "dvc-admin@unidel.edu.ng",
    image: null,
    bio: "Professor of Civil Engineering and Fellow of the Nigerian Society of Engineers. Responsible for administrative operations, human resources, and campus development.",
  },
  {
    name: "Chief Adamu Garba, mni",
    role: "Registrar",
    department: "Registry",
    email: "registrar@unidel.edu.ng",
    image: null,
    bio: "Seasoned administrator with over 25 years in university management. Member of the National Institute. Oversees student records, admissions, and academic registry functions.",
  },
  {
    name: "Barr. Aisha Kolawole",
    role: "University Librarian",
    department: "University Library",
    email: "librarian@unidel.edu.ng",
    image: null,
    bio: "Holds a doctorate in Library Science and a law degree. Leads the transformation of UNIDEL's library system into a modern digital learning hub.",
  },
  {
    name: "Alh. Ibrahim Dantata, FCA",
    role: "Bursar",
    department: "Bursary",
    email: "bursar@unidel.edu.ng",
    image: null,
    bio: "Fellow of the Institute of Chartered Accountants with extensive experience in public sector finance. Manages all financial operations and budgeting.",
  },
];

const proViceChancellors = [
  {
    name: "Prof. Olufemi Fajemisin",
    role: "Pro-Chancellor & Chairman of Council",
    department: "University Council",
    email: "council@unidel.edu.ng",
  },
  {
    name: "Chief (Mrs.) Foluke Akinwale, OFR",
    role: "Council Member",
    department: "University Council",
    email: "council@unidel.edu.ng",
  },
  {
    name: "Sen. Bala Mohammed, CON",
    role: "Council Member",
    department: "University Council",
    email: "council@unidel.edu.ng",
  },
  {
    name: "Prof. Amina Sambo, FNES",
    role: "Council Member",
    department: "University Council",
    email: "council@unidel.edu.ng",
  },
];

const deans = [
  {
    name: "Prof. Adaeze Nnamdi-Okoro",
    role: "Dean, Faculty of Sciences",
    department: "Sciences",
  },
  {
    name: "Prof. Emeka Okonkwo",
    role: "Dean, Faculty of Engineering",
    department: "Engineering",
  },
  {
    name: "Prof. Chinwe Nwosu",
    role: "Dean, Faculty of Computing",
    department: "Computing",
  },
  {
    name: "Prof. Adeola Akintoye",
    role: "Dean, Faculty of Arts",
    department: "Arts",
  },
  {
    name: "Prof. Oluwatobi Adeyinka",
    role: "Dean, Faculty of Social Sciences",
    department: "Social Sciences",
  },
  {
    name: "Prof. Olumide Fernandez",
    role: "Dean, Faculty of Management Sciences",
    department: "Management Sciences",
  },
  {
    name: "Prof. Aisha Mohammed",
    role: "Dean, Faculty of Law",
    department: "Law",
  },
  {
    name: "Prof. Ngozi Eze-Nwosu",
    role: "Dean, Faculty of Health Sciences",
    department: "Health Sciences",
  },
];

const Leadership = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Governance"
        title="University Leadership"
        description="Meet the distinguished individuals who guide UNIDEL's vision, strategy, and operations. Our leadership team brings together decades of academic excellence and administrative expertise."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Leadership" },
        ]}
      />

      {/* Principal Officers */}
      <Section
        title="Principal Officers"
        subtitle="Executive Leadership"
        description="The Principal Officers are responsible for the day-to-day management of the university and implementation of policies approved by the Governing Council."
      >
        <div className="grid lg:grid-cols-2 gap-6">
          {principalOfficers.map((officer, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-xl border transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="flex gap-5">
                {/* Avatar */}
                <div
                  className={cn(
                    "w-20 h-20 rounded-xl flex items-center justify-center flex-shrink-0 text-lg font-bold",
                    isDarkMode
                      ? "bg-slate-800 text-orange-400"
                      : "bg-orange-50 text-orange-600",
                  )}
                >
                  {officer.name
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3
                    className={cn(
                      "font-bold mb-1",
                      isDarkMode ? "text-white" : "text-gray-900",
                    )}
                  >
                    {officer.name}
                  </h3>
                  <p
                    className={cn(
                      "text-sm font-medium mb-1",
                      isDarkMode ? "text-orange-400" : "text-orange-600",
                    )}
                  >
                    {officer.role}
                  </p>
                  <p
                    className={cn(
                      "text-xs mb-3",
                      isDarkMode ? "text-gray-500" : "text-gray-500",
                    )}
                  >
                    {officer.department}
                  </p>
                  <p
                    className={cn(
                      "text-sm leading-relaxed mb-3",
                      isDarkMode ? "text-gray-400" : "text-gray-600",
                    )}
                  >
                    {officer.bio}
                  </p>
                  <a
                    href={`mailto:${officer.email}`}
                    className={cn(
                      "inline-flex items-center gap-2 text-sm",
                      isDarkMode
                        ? "text-gray-400 hover:text-white"
                        : "text-gray-500 hover:text-gray-900",
                    )}
                  >
                    <Mail className="w-4 h-4" />
                    {officer.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* VC Quote */}
      <Section background="alt">
        <div className="max-w-4xl mx-auto">
          <QuoteBlock
            quote="Leadership at UNIDEL is not about titles or positions—it is about service, vision, and the unwavering commitment to nurturing the next generation of leaders who will transform Nigeria and Africa. Together, we are building a university that will stand the test of time."
            author="Prof. Emmanuel Adebayo, FNAS"
            role="Vice-Chancellor, University of Delta"
          />
        </div>
      </Section>

      {/* Governing Council */}
      <Section
        title="Governing Council"
        subtitle="University Governance"
        description="The Governing Council is the highest policy-making body of the university, responsible for strategic direction and major policy decisions."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {proViceChancellors.map((member, idx) => (
            <div
              key={idx}
              className={cn(
                "p-5 rounded-xl border text-center transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 text-sm font-bold",
                  isDarkMode
                    ? "bg-slate-800 text-orange-400"
                    : "bg-gray-100 text-orange-600",
                )}
              >
                {member.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h4
                className={cn(
                  "font-bold text-sm mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {member.name}
              </h4>
              <p
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Deans */}
      <Section
        title="Faculty Deans"
        subtitle="Academic Leadership"
        description="Our Deans lead academic programs, research initiatives, and faculty development across the eight faculties."
        background="alt"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deans.map((dean, idx) => (
            <div
              key={idx}
              className={cn(
                "p-5 rounded-xl border text-center transition-all",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 text-sm font-bold",
                  isDarkMode
                    ? "bg-slate-800 text-blue-400"
                    : "bg-blue-50 text-blue-600",
                )}
              >
                {dean.name
                  .split(" ")
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h4
                className={cn(
                  "font-bold text-sm mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {dean.name}
              </h4>
              <p
                className={cn(
                  "text-xs mb-1",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              >
                {dean.role}
              </p>
              <Link
                to={`/faculties/${dean.department.toLowerCase().replace(/\s+/g, "-")}`}
                className={cn(
                  "text-xs",
                  isDarkMode
                    ? "text-gray-500 hover:text-white"
                    : "text-gray-500 hover:text-gray-900",
                )}
              >
                View Faculty →
              </Link>
            </div>
          ))}
        </div>
      </Section>

      {/* Organizational Structure */}
      <Section title="Organizational Structure" subtitle="How We're Organized">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Governing Council",
              description:
                "The highest policy-making body responsible for strategic direction, budget approval, and appointment of principal officers.",
            },
            {
              icon: GraduationCap,
              title: "Senate",
              description:
                "The supreme academic authority responsible for academic standards, curriculum, examinations, and award of degrees.",
            },
            {
              icon: Briefcase,
              title: "Management",
              description:
                "The executive arm led by the Vice-Chancellor, responsible for implementing policies and day-to-day administration.",
            },
          ].map((item, idx) => (
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
                  "w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-4",
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-orange-100 text-orange-600",
                )}
              >
                <item.icon className="w-7 h-7" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <CTABanner
        title="Connect With Us"
        description="Have questions about university governance or leadership? We're here to help."
        primaryAction={{ label: "Contact Us", href: "/contact" }}
        secondaryAction={{ label: "View Directory", href: "/staff-directory" }}
      />
    </>
  );
};

export default Leadership;
