/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Briefcase, Beaker, Palette, Calculator, Globe, Users, Building, ArrowRight } from "lucide-react";

const Faculties = () => {
  const faculties = [
    {
      name: "Engineering",
      icon: Calculator,
      departments: 8,
      students: 3200,
      color: "orange",
      description: "Innovative programs in mechanical, electrical, civil, and computer engineering"
    },
    {
      name: "Sciences",
      icon: Beaker,
      departments: 6,
      students: 2800,
      color: "blue",
      description: "Physics, chemistry, biology, and environmental science programs"
    },
    {
      name: "Arts & Humanities",
      icon: Palette,
      departments: 7,
      students: 2400,
      color: "gray",
      description: "Literature, languages, history, and creative arts disciplines"
    },
    {
      name: "Management",
      icon: Briefcase,
      departments: 5,
      students: 2000,
      color: "orange",
      description: "Business administration, accounting, and entrepreneurship programs"
    },
    {
      name: "Social Sciences",
      icon: Users,
      departments: 6,
      students: 1800,
      color: "blue",
      description: "Psychology, sociology, political science, and economics"
    },
    {
      name: "Education",
      icon: BookOpen,
      departments: 4,
      students: 1500,
      color: "gray",
      description: "Teacher training and educational leadership programs"
    },
    {
      name: "Law",
      icon: Building,
      departments: 3,
      students: 1200,
      color: "orange",
      description: "Legal studies, jurisprudence, and international law"
    },
    {
      name: "Environmental Studies",
      icon: Globe,
      departments: 4,
      students: 1100,
      color: "blue",
      description: "Sustainability, conservation, and environmental management"
    }
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", hover: "hover:border-orange-300" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", hover: "hover:border-blue-300" },
    gray: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", hover: "hover:border-gray-300" },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      {/* Enhanced Decorative Background Elements - Dark Blue & Orange */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-glow-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-[500px] h-[500px] bg-blue-900 rounded-full blur-3xl animate-glow-pulse-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-slate-900 rounded-full blur-3xl animate-glow-pulse-slow"></div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Faculties
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Diverse academic programs across multiple faculties, fostering excellence in education and research
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {[
            { label: "Total Faculties", value: "8" },
            { label: "Departments", value: "43+" },
            { label: "Students Enrolled", value: "16,000+" },
            { label: "Academic Programs", value: "150+" }
          ].map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-xl border-2 border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Faculties Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {faculties.map((faculty, index) => {
            const colors = colorMap[faculty.color];
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all hover:shadow-lg`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <faculty.icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Faculty Name */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">{faculty.name}</h3>

                {/* Description */}
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {faculty.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{faculty.departments}</div>
                    <div className="text-xs text-gray-600">Departments</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200"></div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{faculty.students.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Students</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Updated CTA - Text and Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-col md:flex-row items-center justify-between bg-orange-50 rounded-2xl border-2 border-orange-200 p-8 gap-6"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Explore Academic Excellence</h3>
            <p className="text-gray-600">
              Discover comprehensive programs tailored to shape future leaders across diverse fields of study. Join our vibrant academic community today.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all whitespace-nowrap">
            View All Programs
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Faculties;

<style jsx>{`
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }
  .animate-blob { animation: blob 7s infinite; }
  .animation-delay-2000 { animation-delay: 2s; }
`}</style>