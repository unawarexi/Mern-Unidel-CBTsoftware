import React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Shield, Clock, BarChart3, Users, Award, TrendingUp, Target } from "lucide-react";
import OverviewCharts from "./Overview-charts";
import useThemeStore from "../../store/theme-store";

const Overview = () => {
  const { isDarkMode } = useThemeStore();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Value propositions
  const values = [
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Bank-grade encryption ensures exam integrity and prevents malpractice with real-time monitoring.",
      color: "orange",
    },
    {
      icon: Clock,
      title: "Instant Results",
      description: "Automated grading provides immediate feedback, reducing wait times from weeks to minutes.",
      color: "blue",
    },
    {
      icon: BarChart3,
      title: "Data-Driven Insights",
      description: "Comprehensive analytics help track performance trends and identify areas for improvement.",
      color: "green",
    },
    {
      icon: Users,
      title: "User-Friendly Interface",
      description: "Intuitive design ensures smooth navigation for all users, regardless of technical expertise.",
      color: "purple",
    },
  ];

  // Success metrics
  const metrics = [
    { label: "Students Served", value: "25,000+", icon: Users },
    { label: "Exams Conducted", value: "500+", icon: Award },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "Uptime Guarantee", value: "99.9%", icon: Target },
  ];

  const colorMap = {
    orange: "bg-orange-50 text-orange-600 hover:bg-orange-100",
    blue: "bg-blue-50 text-blue-600 hover:bg-blue-100",
    green: "bg-green-50 text-green-600 hover:bg-green-100",
    purple: "bg-purple-50 text-purple-600 hover:bg-purple-100",
  };

  return (
    <section className={`${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-white'} py-8 md:py-20 lg:py-24 transition-colors duration-300`}>
      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-8 md:mb-16 lg:mb-20">
          <h2 className={`text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 md:mb-4`}>Why Choose UNIDEL CBT Platform?</h2>
          <p className={`text-sm sm:text-base md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>Experience a modern, secure, and efficient examination system designed to enhance academic excellence and ensure transparent assessment processes.</p>
        </motion.div>

        {/* Value Propositions */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-20">
          {values.map((value, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-orange-500/50' : 'bg-white border-gray-200 hover:border-orange-300'} rounded-lg p-4 md:p-6 border transition-all shadow-sm hover:shadow-md`}>
              <div className={`w-10 h-10 md:w-11 lg:w-12 md:h-11 lg:h-12 rounded-lg ${colorMap[value.color]} flex items-center justify-center mb-3 md:mb-4 transition-colors`}>
                <value.icon className="w-5 h-5 md:w-5.5 lg:w-6 md:h-5.5 lg:h-6" />
              </div>
              <h3 className={`text-base md:text-base lg:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>{value.title}</h3>
              <p className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Success Metrics */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-20">
          {metrics.map((metric, index) => (
            <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} className={`${isDarkMode ? 'bg-gradient-to-br from-orange-500/10 to-slate-800/50 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-white border-orange-100'} rounded-lg p-4 md:p-6 border text-center`}>
              <metric.icon className="w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-orange-600 mx-auto mb-2 md:mb-3" />
              <div className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{metric.value}</div>
              <div className={`text-xs sm:text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Overview Charts Component */}
        <OverviewCharts />
      </div>
    </section>
  );
};

export default Overview;
