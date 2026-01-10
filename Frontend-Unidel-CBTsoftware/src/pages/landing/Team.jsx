/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useThemeStore from "../../store/theme-store";

const Team = () => {
  const { isDarkMode } = useThemeStore();

  const teamMembers = [
    {
      name: "Prof. Emmanuel Obi",
      role: "Chief Technology Officer",
      department: "Computer Science",
      image: "https://ui-avatars.com/api/?name=Emmanuel+Obi&size=200&background=f97316&color=fff"
    },
    {
      name: "Dr. Sarah Adeleke",
      role: "Academic Director",
      department: "Educational Technology",
      image: "https://ui-avatars.com/api/?name=Sarah+Adeleke&size=200&background=3b82f6&color=fff"
    },
    {
      name: "Engr. Michael Eze",
      role: "Platform Architect",
      department: "Software Engineering",
      image: "https://ui-avatars.com/api/?name=Michael+Eze&size=200&background=6b7280&color=fff"
    },
    {
      name: "Dr. Amina Hassan",
      role: "Assessment Specialist",
      department: "Measurement & Evaluation",
      image: "https://ui-avatars.com/api/?name=Amina+Hassan&size=200&background=f97316&color=fff"
    },
    {
      name: "Mr. David Okafor",
      role: "Security Lead",
      department: "Cybersecurity",
      image: "https://ui-avatars.com/api/?name=David+Okafor&size=200&background=3b82f6&color=fff"
    },
    {
      name: "Mrs. Grace Nwankwo",
      role: "User Experience Lead",
      department: "Design & Innovation",
      image: "https://ui-avatars.com/api/?name=Grace+Nwankwo&size=200&background=6b7280&color=fff"
    },
    {
      name: "Prof. Chidi Okeke",
      role: "Quality Assurance",
      department: "Educational Standards",
      image: "https://ui-avatars.com/api/?name=Chidi+Okeke&size=200&background=f97316&color=fff"
    },
    {
      name: "Dr. Fatima Bello",
      role: "Research Lead",
      department: "Data Analytics",
      image: "https://ui-avatars.com/api/?name=Fatima+Bello&size=200&background=3b82f6&color=fff"
    },
    {
      name: "Engr. James Okonkwo",
      role: "Infrastructure Manager",
      department: "Cloud Services",
      image: "https://ui-avatars.com/api/?name=James+Okonkwo&size=200&background=6b7280&color=fff"
    }
  ];

  return (
    <section className={`relative ${isDarkMode ? 'bg-gradient-to-br from-blue-950/95 via-slate-900/90 to-blue-950/95' : 'bg-white'} py-8 md:py-16 overflow-hidden transition-colors duration-300`}>
      {/* Enhanced Decorative Background Elements */}
      <div className={`absolute top-10 right-10 w-[450px] h-[450px] ${isDarkMode ? 'bg-blue-500/30' : 'bg-blue-900'} rounded-full blur-3xl animate-glow-pulse`}></div>
      <div className={`absolute bottom-10 left-10 w-96 h-96 ${isDarkMode ? 'bg-orange-600/30' : 'bg-orange-600'} rounded-full blur-3xl animate-glow-pulse-delayed`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDarkMode ? 'bg-slate-800/20' : 'bg-gray-100'} rounded-full blur-3xl animate-glow-pulse-slow`}></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} rounded-lg border p-3 md:p-4 text-center hover:shadow-lg transition-all`}
            >
              <img
                src={member.image}
                alt={member.name}
                className={`w-12 h-12 md:w-14 lg:w-16 md:h-14 lg:h-16 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} object-cover object-center rounded-full mx-auto mb-2 md:mb-3`}
              />
              <h2 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium text-xs md:text-xs lg:text-sm mb-1`}>{member.name}</h2>
              <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs`}>{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Updated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={`flex flex-col md:flex-row items-center justify-between ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'} rounded-2xl border-2 p-4 md:p-8 gap-4 md:gap-6`}
        >
          <div className="flex-1">
            <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>Join Our Growing Team</h3>
            <p className={`text-xs md:text-sm lg:text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We're always looking for talented and passionate individuals to help shape the future of education technology. Explore exciting career opportunities with us.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-sm lg:text-base rounded-xl font-semibold hover:bg-orange-700 transition-all whitespace-nowrap">
            View Positions
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
