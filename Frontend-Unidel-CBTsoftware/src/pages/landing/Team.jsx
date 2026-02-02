import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "../../constants/icons";
import useThemeStore from "../../store/theme-store";
import { teamMembers } from "../../core/data/landing-mock-data";
import { headerAnimation, teamMemberAnimation, ctaAnimation } from "../../core/animation/animations";

const Team = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <section className={`relative ${isDarkMode ? 'bg-gradient-to-br from-accent-950/95 via-dark-900/90 to-accent-950/95' : 'bg-white'} py-8 md:py-16 overflow-hidden transition-colors duration-300`}>
      {/* Enhanced Decorative Background Elements */}
      <div className={`absolute top-10 right-10 w-[450px] h-[450px] ${isDarkMode ? 'bg-accent-500/30' : 'bg-accent-900'} rounded-full blur-3xl animate-glow-pulse`}></div>
      <div className={`absolute bottom-10 left-10 w-96 h-96 ${isDarkMode ? 'bg-primary-600/30' : 'bg-primary-600'} rounded-full blur-3xl animate-glow-pulse-delayed`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDarkMode ? 'bg-dark-800/20' : 'bg-gray-100'} rounded-full blur-3xl animate-glow-pulse-slow`}></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          {...headerAnimation}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className={`text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2 md:mb-4`}>
            Meet Our Team
          </h2>
          <p className={`text-sm sm:text-base md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Dedicated professionals committed to revolutionizing academic assessments through innovative technology
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              {...teamMemberAnimation(index)}
              className={`${isDarkMode ? 'bg-dark-800/50 border-dark-700' : 'bg-white border-gray-200'} rounded-lg border p-3 md:p-4 text-center hover:shadow-lg transition-all`}
            >
              <img
                src={member.image}
                alt={member.name}
                className={`w-12 h-12 md:w-14 lg:w-16 md:h-14 lg:h-16 ${isDarkMode ? 'bg-dark-700' : 'bg-gray-100'} object-cover object-center rounded-full mx-auto mb-2 md:mb-3`}
              />
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs md:text-xs lg:text-sm mb-1`}>{member.name}</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Updated CTA */}
        <motion.div
          {...ctaAnimation}
          className={`flex flex-col md:flex-row items-center justify-between ${isDarkMode ? 'bg-primary-500/10 border-primary-500/30' : 'bg-primary-50 border-primary-200'} rounded-2xl border-2 p-4 md:p-8 gap-4 md:gap-6`}
        >
          <div className="flex-1">
            <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>Join Our Growing Team</h3>
            <p className={`text-xs md:text-sm lg:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're always looking for talented and passionate individuals to help shape the future of education technology. Explore exciting career opportunities with us.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-primary-600 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-sm lg:text-base rounded-xl font-semibold hover:bg-primary-700 transition-all whitespace-nowrap">
            View Positions
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
