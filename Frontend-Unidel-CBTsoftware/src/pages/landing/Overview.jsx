import React from "react";
import { motion } from "framer-motion";
import { Shield, Clock, BarChart3, Users, Award, TrendingUp, Target } from "../../constants/icons";
import OverviewCharts from "./Overview-charts";
import useThemeStore from "../../store/theme-store";
import { overviewValues, overviewMetrics } from "../../core/data/landing-mock-data";
import { colorMap } from "../../core/theme/colors";
import { containerVariants, itemVariants, slideDownVariants } from "../../core/animation/animations";

const Overview = () => {
  const { isDarkMode } = useThemeStore();

  const iconMap = { Shield, Clock, BarChart3, Users, Award, TrendingUp, Target };

  return (
    <section className={`${isDarkMode ? 'bg-gradient-to-br from-dark-950 via-accent-950 to-dark-900' : 'bg-white'} py-8 md:py-20 lg:py-24 transition-colors duration-300`}>
      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          variants={slideDownVariants} 
          initial="hidden" 
          whileInView="visible" 
          viewport={{ once: true }} 
          className="text-center mb-8 md:mb-16 lg:mb-20"
        >
          <h2 className={`text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 md:mb-4`}>Why Choose UNIDEL CBT Platform?</h2>
          <p className={`text-sm sm:text-base md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>Experience a modern, secure, and efficient examination system designed to enhance academic excellence and ensure transparent assessment processes.</p>
        </motion.div>

        {/* Value Propositions */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-8 md:mb-20">
          {overviewValues.map((value, index) => {
            const Icon = iconMap[value.icon];
            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ y: -5 }} className={`${isDarkMode ? 'bg-dark-800/50 border-dark-700 hover:border-primary-500/50' : 'bg-white border-gray-200 hover:border-primary-300'} rounded-lg p-4 md:p-6 border transition-all shadow-sm hover:shadow-md`}>
                <div className={`w-10 h-10 md:w-11 lg:w-12 md:h-11 lg:h-12 rounded-lg ${colorMap[value.color]} flex items-center justify-center mb-3 md:mb-4 transition-colors`}>
                  <Icon className="w-5 h-5 md:w-5.5 lg:w-6 md:h-5.5 lg:h-6" />
                </div>
                <h3 className={`text-base md:text-base lg:text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>{value.title}</h3>
                <p className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>{value.description}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Success Metrics */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-20">
          {overviewMetrics.map((metric, index) => {
            const Icon = iconMap[metric.icon];
            return (
              <motion.div key={index} variants={itemVariants} whileHover={{ scale: 1.05 }} className={`${isDarkMode ? 'bg-gradient-to-br from-primary-500/10 to-dark-800/50 border-primary-500/30' : 'bg-gradient-to-br from-primary-50 to-white border-primary-100'} rounded-lg p-4 md:p-6 border text-center`}>
                <Icon className="w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 text-primary-600 mx-auto mb-2 md:mb-3" />
                <div className={`text-xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1`}>{metric.value}</div>
                <div className={`text-xs sm:text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Overview Charts Component */}
        <OverviewCharts />
      </div>
    </section>
  );
};

export default Overview;
