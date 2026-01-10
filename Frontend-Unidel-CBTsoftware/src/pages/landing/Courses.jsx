/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Clock, CheckCircle, ArrowRight, Wrench, FlaskConical, Users2, Briefcase } from "lucide-react";
import useThemeStore from "../../store/theme-store";

const Courses = () => {
  const { isDarkMode } = useThemeStore();
  const courseCategories = [
    {
      name: "Engineering",
      icon: Wrench,
      courses: [
        { code: "ENG 101", name: "Introduction to Engineering", students: 320 },
        { code: "ENG 201", name: "Circuit Analysis", students: 280 },
        { code: "ENG 301", name: "Digital Systems", students: 250 },
        { code: "ENG 401", name: "Control Systems", students: 200 }
      ],
      color: "orange"
    },
    {
      name: "Sciences",
      icon: FlaskConical,
      courses: [
        { code: "PHY 101", name: "General Physics", students: 350 },
        { code: "CHM 101", name: "General Chemistry", students: 320 },
        { code: "BIO 101", name: "General Biology", students: 300 },
        { code: "MTH 101", name: "Calculus I", students: 400 }
      ],
      color: "blue"
    },
    {
      name: "Social Sciences",
      icon: Users2,
      courses: [
        { code: "ECO 101", name: "Principles of Economics", students: 280 },
        { code: "PSY 101", name: "Introduction to Psychology", students: 250 },
        { code: "SOC 101", name: "Introduction to Sociology", students: 220 },
        { code: "POL 101", name: "Political Science", students: 200 }
      ],
      color: "gray"
    },
    {
      name: "Management",
      icon: Briefcase,
      courses: [
        { code: "MGT 101", name: "Principles of Management", students: 300 },
        { code: "ACC 101", name: "Financial Accounting", students: 280 },
        { code: "MKT 101", name: "Marketing Fundamentals", students: 260 },
        { code: "FIN 101", name: "Business Finance", students: 240 }
      ],
      color: "orange"
    }
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", icon: "bg-orange-100" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", icon: "bg-blue-100" },
    gray: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", icon: "bg-gray-100" }
  };

  return (
    <section className={`relative bg-gradient-to-br from-blue-950/90 via-slate-900/85 to-blue-950/90 py-8 md:py-16 overflow-hidden ${isDarkMode ? "" : "rounded-bl-[100px]"}`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-10 left-10 w-[450px] h-[450px] bg-blue-500 rounded-full blur-3xl animate-glow-pulse opacity-20"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-glow-pulse-delayed opacity-20"></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-6 md:mb-10">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">Available Courses</h2>
          <p className="text-sm sm:text-lg text-gray-200 max-w-3xl mx-auto">Browse through our comprehensive course catalog across all faculties. All courses utilize our advanced CBT platform for assessments.</p>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-10">
          {[
            { icon: BookOpen, label: "Total Courses", value: "500+" },
            { icon: Users, label: "Enrolled Students", value: "16,000+" },
            { icon: Clock, label: "Avg. Course Duration", value: "1 Semester" },
            { icon: CheckCircle, label: "Success Rate", value: "94%" },
          ].map((stat, index) => (
            <div key={index} className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-white/20 p-3 md:p-6 text-center">
              <stat.icon className="w-6 h-6 md:w-10 md:h-10 text-orange-600 mx-auto mb-2 md:mb-3" />
              <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Course Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-6 md:mb-10">
          {courseCategories.map((category, index) => {
            const colors = colorMap[category.color];
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className={`bg-white rounded-2xl border-2 ${colors.border} p-4 md:p-6 hover:shadow-lg transition-all`}>
                <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                  <div className={`w-10 h-10 md:w-14 md:h-14 ${colors.icon} rounded-xl flex items-center justify-center`}>
                    <category.icon className={`w-5 h-5 md:w-7 md:h-7 ${colors.text}`} />
                  </div>
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-gray-900">{category.name}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{category.courses.length} Courses Available</p>
                  </div>
                </div>

                <div className="space-y-2 md:space-y-3">
                  {category.courses.map((course, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-2.5 md:p-4 ${colors.bg} rounded-xl border ${colors.border} hover:shadow-md transition-all`}>
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className={`w-8 h-8 md:w-10 md:h-10 bg-white rounded-lg flex items-center justify-center`}>
                          <CheckCircle className={`w-4 h-4 md:w-5 md:h-5 ${colors.text}`} />
                        </div>
                        <div>
                          <div className="text-xs md:text-sm font-semibold text-gray-900">{course.code}</div>
                          <div className="text-xs text-gray-600">{course.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-xs md:text-sm font-bold ${colors.text}`}>{course.students}</div>
                        <div className="text-xs text-gray-600">Students</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Updated CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-4 md:p-8 gap-4 md:gap-6">
          <div className="flex-1">
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">Ready to Start Learning?</h3>
            <p className="text-xs md:text-base text-gray-200">Contact your department or faculty office for detailed course information and enrollment procedures. Our academic advisors are here to guide you.</p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-xl font-semibold hover:bg-orange-700 transition-all whitespace-nowrap">
            View Catalog
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Courses;