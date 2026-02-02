import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, BookOpen, GraduationCap, 
  UserPlus, FileText, Upload, Settings,
  ClipboardList, PenTool, CheckCircle, BarChart3,
  ArrowRight, Calendar, Users, Award
} from "../../constants/icons";
import useThemeStore from "../../store/theme-store";
import { roles, workflows, platformFeatures } from "../../core/data/landing-mock-data";
import { colorMap } from "../../core/theme/colors";
import { headerAnimation, workflowTransition, contentSlideUp } from "../../core/animation/animations";

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState("student");
  const { isDarkMode } = useThemeStore();

  const iconMap = { Shield, BookOpen, GraduationCap, UserPlus, FileText, Upload, Settings, ClipboardList, PenTool, CheckCircle, BarChart3, Calendar, Users, Award };

  return (
    <section className={`relative bg-gradient-to-br from-dark-900/95 via-accent-900/90 to-dark-900/95 py-8 md:py-16 overflow-hidden ${isDarkMode ? '' : 'rounded-tr-[100px]'}`}>
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500 rounded-full blur-3xl animate-glow-pulse opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-accent-400 rounded-full blur-3xl animate-glow-pulse-delayed opacity-30"></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          {...headerAnimation}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-2xl sm:text-3xl md:text-3xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base md:text-base lg:text-lg text-gray-200 max-w-3xl mx-auto">
            Streamlined workflows designed for administrators, lecturers, and students to ensure seamless examination management
          </p>
        </motion.div>

        {/* Role Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-10">
          {roles.map((role) => {
            const RoleIcon = iconMap[role.icon];
            return (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 text-sm md:text-sm lg:text-base rounded-xl font-semibold transition-all ${
                  activeRole === role.id
                    ? `${role.bg} ${role.color} border-2 border-current shadow-md`
                    : "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:border-white/40"
                }`}
              >
                <RoleIcon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{role.name}</span>
              </button>
            );
          })}
        </div>

        {/* Workflow Steps */}
        <motion.div
          key={activeRole}
          {...workflowTransition}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-12"
        >
          {workflows[activeRole].map((step, index) => {
            const colors = colorMap[step.color];
            const StepIcon = iconMap[step.icon];
            return (
              <div
                key={index}
                className={`relative bg-white/95 backdrop-blur-sm rounded-xl border-2 ${colors.border} ${colors.hover} p-4 md:p-6 transition-all hover:shadow-lg`}
              >
                {/* Step Number Badge */}
                <div className={`absolute -top-3 md:-top-4 -left-3 md:-left-4 w-8 h-8 md:w-10 md:h-10 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center font-bold text-base md:text-base lg:text-lg border-2 ${colors.border}`}>
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 md:w-13 lg:w-14 md:h-13 lg:h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
                  <StepIcon className={`w-6 h-6 md:w-6.5 lg:w-7 md:h-6.5 lg:h-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-base md:text-base lg:text-lg font-bold text-gray-900 mb-1 md:mb-2">{step.title}</h3>
                <p className="text-xs md:text-xs lg:text-sm text-gray-600 leading-relaxed">{step.description}</p>

                {/* Arrow (except for last item) */}
                {index < workflows[activeRole].length - 1 && (
                  <div className="hidden lg:block absolute -right-8 top-1/2 -translate-y-1/2">
                    <ArrowRight className={`w-6 h-6 ${colors.text}`} />
                  </div>
                )}
              </div>
            );
          })}
        </motion.div>

        {/* Features Grid */}
        <motion.div
          {...contentSlideUp}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-4 md:p-8"
        >
          <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white text-center mb-4 md:mb-6">
            Platform Features
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {platformFeatures.map((feature, index) => {
              const colors = colorMap[feature.color];
              const FeatureIcon = iconMap[feature.icon];
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-12 h-12 md:w-14 lg:w-16 md:h-14 lg:h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-3 md:mb-4`}>
                    <FeatureIcon className={`w-6 h-6 md:w-7 lg:w-8 md:h-7 lg:h-8 ${colors.text}`} />
                  </div>
                  <p className="font-semibold text-gray-900 text-xs md:text-sm lg:text-base">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;