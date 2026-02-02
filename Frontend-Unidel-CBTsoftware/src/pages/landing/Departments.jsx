/**
 * Departments Page
 * University departments directory
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  StatsBanner,
  LinkList,
} from "../../components/landing/LandingComponents";
import {
  FlaskConical,
  Calculator,
  Monitor,
  Briefcase,
  Palette,
  Globe,
  Heart,
  Scale,
  Building2,
  Users,
  BookOpen,
  Phone,
  Mail,
  ArrowRight,
  Search,
  GraduationCap,
} from "lucide-react";

const faculties = [
  {
    id: "sciences",
    name: "Faculty of Sciences",
    icon: FlaskConical,
    dean: "Prof. Adaeze Nnamdi-Okoro",
    color: "blue",
    description:
      "The Faculty of Sciences is dedicated to advancing scientific knowledge through rigorous research and innovative teaching methodologies. Our departments cover the full spectrum of natural sciences.",
    departments: [
      { name: "Physics", hod: "Dr. Ifeanyi Obi", programs: 4, students: 450 },
      { name: "Chemistry", hod: "Prof. Ngozi Eze", programs: 3, students: 380 },
      {
        name: "Biology",
        hod: "Dr. Chukwuemeka Alade",
        programs: 3,
        students: 520,
      },
      {
        name: "Mathematics",
        hod: "Dr. Fatima Bello",
        programs: 3,
        students: 290,
      },
      {
        name: "Microbiology",
        hod: "Dr. Amaka Okoli",
        programs: 2,
        students: 340,
      },
      {
        name: "Biochemistry",
        hod: "Prof. Oluwaseun Adeyemi",
        programs: 2,
        students: 310,
      },
      {
        name: "Statistics",
        hod: "Dr. Ibrahim Musa",
        programs: 2,
        students: 180,
      },
    ],
  },
  {
    id: "engineering",
    name: "Faculty of Engineering",
    icon: Calculator,
    dean: "Prof. Emeka Okonkwo",
    color: "orange",
    description:
      "The Faculty of Engineering produces world-class engineers equipped with both theoretical knowledge and practical skills to solve real-world problems.",
    departments: [
      {
        name: "Civil Engineering",
        hod: "Dr. Biodun Adeleke",
        programs: 3,
        students: 420,
      },
      {
        name: "Mechanical Engineering",
        hod: "Prof. Chinedu Nwachukwu",
        programs: 3,
        students: 380,
      },
      {
        name: "Electrical Engineering",
        hod: "Dr. Yusuf Abdullahi",
        programs: 4,
        students: 450,
      },
      {
        name: "Chemical Engineering",
        hod: "Prof. Grace Okafor",
        programs: 2,
        students: 280,
      },
      {
        name: "Petroleum Engineering",
        hod: "Dr. Friday Etuk",
        programs: 2,
        students: 340,
      },
      {
        name: "Computer Engineering",
        hod: "Dr. Olumide Fashola",
        programs: 3,
        students: 520,
      },
    ],
  },
  {
    id: "computing",
    name: "Faculty of Computing",
    icon: Monitor,
    dean: "Prof. Chinwe Nwosu",
    color: "green",
    description:
      "At the forefront of digital innovation, the Faculty of Computing prepares students for careers in software development, cybersecurity, data science, and IT management.",
    departments: [
      {
        name: "Computer Science",
        hod: "Dr. Tunde Bakare",
        programs: 5,
        students: 680,
      },
      {
        name: "Information Technology",
        hod: "Dr. Aminu Garba",
        programs: 3,
        students: 420,
      },
      {
        name: "Software Engineering",
        hod: "Prof. Kemi Akinwale",
        programs: 3,
        students: 380,
      },
      {
        name: "Cybersecurity",
        hod: "Dr. Uche Igwe",
        programs: 2,
        students: 260,
      },
      {
        name: "Data Science",
        hod: "Dr. Sarah Ogundimu",
        programs: 2,
        students: 220,
      },
    ],
  },
  {
    id: "arts",
    name: "Faculty of Arts",
    icon: Palette,
    dean: "Prof. Adeola Akintoye",
    color: "purple",
    description:
      "The Faculty of Arts nurtures critical thinking, creativity, and cultural awareness through the study of languages, literature, history, and philosophy.",
    departments: [
      {
        name: "English Language",
        hod: "Dr. Tola Oyelaran",
        programs: 3,
        students: 340,
      },
      {
        name: "History & Diplomatic Studies",
        hod: "Prof. Bala Usman",
        programs: 3,
        students: 280,
      },
      {
        name: "Philosophy",
        hod: "Dr. Chidi Amuta",
        programs: 2,
        students: 180,
      },
      {
        name: "Religious Studies",
        hod: "Dr. Hafsat Jimoh",
        programs: 2,
        students: 220,
      },
      {
        name: "French",
        hod: "Dr. Jean-Pierre Ade",
        programs: 2,
        students: 160,
      },
      {
        name: "Linguistics",
        hod: "Prof. Ngozi Okoro",
        programs: 2,
        students: 190,
      },
    ],
  },
  {
    id: "social-sciences",
    name: "Faculty of Social Sciences",
    icon: Users,
    dean: "Prof. Oluwatobi Adeyinka",
    color: "cyan",
    description:
      "The Faculty of Social Sciences examines human behavior, societal structures, and policy frameworks to produce graduates who can address complex social challenges.",
    departments: [
      {
        name: "Economics",
        hod: "Dr. Adebayo Ogunleye",
        programs: 4,
        students: 520,
      },
      {
        name: "Political Science",
        hod: "Prof. Uche Nwokocha",
        programs: 3,
        students: 380,
      },
      {
        name: "Sociology",
        hod: "Dr. Folake Solanke",
        programs: 3,
        students: 290,
      },
      {
        name: "Psychology",
        hod: "Dr. Emeka Nduka",
        programs: 3,
        students: 360,
      },
      {
        name: "Mass Communication",
        hod: "Prof. Titi Abubakar",
        programs: 3,
        students: 440,
      },
      {
        name: "Geography",
        hod: "Dr. Musa Danmusa",
        programs: 2,
        students: 210,
      },
    ],
  },
  {
    id: "management",
    name: "Faculty of Management Sciences",
    icon: Briefcase,
    dean: "Prof. Olumide Fernandez",
    color: "amber",
    description:
      "The Faculty of Management Sciences develops business leaders and entrepreneurs with the knowledge and skills to drive organizational success.",
    departments: [
      {
        name: "Accounting",
        hod: "Dr. Chinonso Eze",
        programs: 4,
        students: 580,
      },
      {
        name: "Business Administration",
        hod: "Prof. Shade Ogunbiyi",
        programs: 4,
        students: 620,
      },
      {
        name: "Banking & Finance",
        hod: "Dr. Kunle Adewale",
        programs: 3,
        students: 380,
      },
      {
        name: "Marketing",
        hod: "Dr. Amara Okechukwu",
        programs: 2,
        students: 290,
      },
      {
        name: "Public Administration",
        hod: "Prof. Mustapha Sani",
        programs: 3,
        students: 340,
      },
    ],
  },
  {
    id: "law",
    name: "Faculty of Law",
    icon: Scale,
    dean: "Prof. Aisha Mohammed",
    color: "red",
    description:
      "The Faculty of Law provides rigorous legal education, preparing students for distinguished careers in the legal profession and public service.",
    departments: [
      {
        name: "Private & Property Law",
        hod: "Dr. Chukwudi Anene",
        programs: 2,
        students: 420,
      },
      {
        name: "Public & International Law",
        hod: "Prof. Fatima Waziri",
        programs: 2,
        students: 280,
      },
      {
        name: "Business Law",
        hod: "Dr. Olu Fajemirokun",
        programs: 2,
        students: 240,
      },
    ],
  },
  {
    id: "health",
    name: "Faculty of Health Sciences",
    icon: Heart,
    dean: "Prof. Ngozi Eze-Nwosu",
    color: "pink",
    description:
      "The Faculty of Health Sciences trains healthcare professionals who combine clinical excellence with compassionate patient care.",
    departments: [
      {
        name: "Medical Laboratory Science",
        hod: "Dr. Bimpe Ojo",
        programs: 3,
        students: 340,
      },
      {
        name: "Nursing",
        hod: "Prof. Justina Udoh",
        programs: 3,
        students: 450,
      },
      {
        name: "Pharmacy",
        hod: "Dr. Emeka Onyebuchi",
        programs: 2,
        students: 280,
      },
      {
        name: "Public Health",
        hod: "Dr. Halima Suleiman",
        programs: 3,
        students: 260,
      },
    ],
  },
];

const deptStats = [
  { value: "8", label: "Faculties" },
  { value: "52", label: "Departments" },
  { value: "1,500+", label: "Faculty Members" },
  { value: "140+", label: "Programs Offered" },
];

const Departments = () => {
  const { isDarkMode } = useThemeStore();
  const [selectedFaculty, setSelectedFaculty] = useState(faculties[0].id);
  const [searchQuery, setSearchQuery] = useState("");

  const currentFaculty = faculties.find((f) => f.id === selectedFaculty);

  const filteredDepartments = currentFaculty?.departments.filter((dept) =>
    dept.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/20",
      text: "text-blue-400",
      border: "border-blue-500/30",
    },
    orange: {
      bg: "bg-orange-500/20",
      text: "text-orange-400",
      border: "border-orange-500/30",
    },
    green: {
      bg: "bg-green-500/20",
      text: "text-green-400",
      border: "border-green-500/30",
    },
    purple: {
      bg: "bg-purple-500/20",
      text: "text-purple-400",
      border: "border-purple-500/30",
    },
    cyan: {
      bg: "bg-cyan-500/20",
      text: "text-cyan-400",
      border: "border-cyan-500/30",
    },
    amber: {
      bg: "bg-amber-500/20",
      text: "text-amber-400",
      border: "border-amber-500/30",
    },
    red: {
      bg: "bg-red-500/20",
      text: "text-red-400",
      border: "border-red-500/30",
    },
    pink: {
      bg: "bg-pink-500/20",
      text: "text-pink-400",
      border: "border-pink-500/30",
    },
  };

  return (
    <>
      <PageHeader
        subtitle="Academic Structure"
        title="Departments Directory"
        description="Explore our 52 departments across 8 faculties. Each department is committed to excellence in teaching, research, and community service."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Academics", href: "#" },
          { label: "Departments" },
        ]}
      />

      <StatsBanner stats={deptStats} background="dark" />

      <Section>
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Faculty Sidebar */}
          <div className="lg:col-span-1">
            <div
              className={cn(
                "sticky top-24 p-5 rounded-xl border",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <h3
                className={cn(
                  "font-bold mb-4",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Faculties
              </h3>
              <nav className="space-y-1">
                {faculties.map((faculty) => (
                  <button
                    key={faculty.id}
                    onClick={() => setSelectedFaculty(faculty.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm transition-all",
                      selectedFaculty === faculty.id
                        ? isDarkMode
                          ? "bg-orange-500/20 text-orange-400"
                          : "bg-orange-50 text-orange-600"
                        : isDarkMode
                          ? "text-gray-400 hover:text-white hover:bg-slate-800"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                    )}
                  >
                    <faculty.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {faculty.name.replace("Faculty of ", "")}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Departments Content */}
          <div className="lg:col-span-3">
            {currentFaculty && (
              <>
                {/* Faculty Header */}
                <div
                  className={cn(
                    "p-6 rounded-xl mb-8 border",
                    isDarkMode
                      ? "bg-slate-900 border-slate-700"
                      : "bg-white border-gray-200",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                        isDarkMode
                          ? colorClasses[currentFaculty.color].bg
                          : "bg-gray-100",
                        isDarkMode
                          ? colorClasses[currentFaculty.color].text
                          : "text-gray-600",
                      )}
                    >
                      <currentFaculty.icon className="w-7 h-7" />
                    </div>
                    <div className="flex-1">
                      <h2
                        className={cn(
                          "text-xl font-bold mb-1",
                          isDarkMode ? "text-white" : "text-gray-900",
                        )}
                      >
                        {currentFaculty.name}
                      </h2>
                      <p
                        className={cn(
                          "text-sm mb-3",
                          isDarkMode ? "text-orange-400" : "text-orange-600",
                        )}
                      >
                        Dean: {currentFaculty.dean}
                      </p>
                      <p
                        className={cn(
                          "text-sm leading-relaxed",
                          isDarkMode ? "text-gray-400" : "text-gray-600",
                        )}
                      >
                        {currentFaculty.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Search */}
                <div className="mb-6">
                  <div className="relative">
                    <Search
                      className={cn(
                        "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5",
                        isDarkMode ? "text-gray-500" : "text-gray-400",
                      )}
                    />
                    <input
                      type="text"
                      placeholder="Search departments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={cn(
                        "w-full pl-12 pr-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 text-white placeholder-gray-500 focus:ring-orange-500/50 focus:border-orange-500"
                          : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-orange-200 focus:border-orange-500",
                      )}
                    />
                  </div>
                </div>

                {/* Departments Grid */}
                <div className="space-y-4">
                  {filteredDepartments?.map((dept, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-5 rounded-xl border transition-all hover:scale-[1.01]",
                        isDarkMode
                          ? "bg-slate-900 border-slate-700 hover:border-orange-500/30"
                          : "bg-white border-gray-200 hover:shadow-md",
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3
                            className={cn(
                              "font-bold mb-1",
                              isDarkMode ? "text-white" : "text-gray-900",
                            )}
                          >
                            Department of {dept.name}
                          </h3>
                          <p
                            className={cn(
                              "text-sm",
                              isDarkMode ? "text-gray-400" : "text-gray-600",
                            )}
                          >
                            Head: {dept.hod}
                          </p>
                        </div>
                        <div className="flex items-center gap-6 text-sm">
                          <div className="text-center">
                            <div
                              className={cn(
                                "font-bold",
                                isDarkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {dept.programs}
                            </div>
                            <div
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-gray-500" : "text-gray-500",
                              )}
                            >
                              Programs
                            </div>
                          </div>
                          <div className="text-center">
                            <div
                              className={cn(
                                "font-bold",
                                isDarkMode ? "text-white" : "text-gray-900",
                              )}
                            >
                              {dept.students}
                            </div>
                            <div
                              className={cn(
                                "text-xs",
                                isDarkMode ? "text-gray-500" : "text-gray-500",
                              )}
                            >
                              Students
                            </div>
                          </div>
                          <Link
                            to={`/departments/${currentFaculty.id}/${dept.name.toLowerCase().replace(/\s+/g, "-")}`}
                            className={cn(
                              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                              isDarkMode
                                ? "bg-slate-800 text-white hover:bg-slate-700"
                                : "bg-gray-100 text-gray-900 hover:bg-gray-200",
                            )}
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredDepartments?.length === 0 && (
                  <div
                    className={cn(
                      "text-center py-12",
                      isDarkMode ? "text-gray-500" : "text-gray-400",
                    )}
                  >
                    No departments found matching "{searchQuery}"
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Section>
    </>
  );
};

export default Departments;
