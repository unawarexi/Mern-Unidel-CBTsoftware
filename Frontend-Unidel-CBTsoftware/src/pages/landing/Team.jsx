/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const Team = () => {
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
    <section className="relative bg-white py-12 md:py-16 overflow-hidden">
      {/* Enhanced Decorative Background Elements - Blue, Orange & White Mix */}
      <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-blue-900 rounded-full blur-3xl animate-glow-pulse"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-600 rounded-full blur-3xl animate-glow-pulse-delayed"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gray-100 rounded-full blur-3xl animate-glow-pulse-slow"></div>

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
            Meet Our Team
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Dedicated professionals committed to revolutionizing academic assessments through innovative technology
          </p>
        </motion.div>

        {/* Team Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6 mb-10">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-lg transition-all"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-16 h-16 bg-gray-100 object-cover object-center rounded-full mx-auto mb-3"
              />
              <h2 className="text-gray-900 font-medium text-sm mb-1">{member.name}</h2>
              <p className="text-gray-500 text-xs">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Updated CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between bg-orange-50 rounded-2xl border-2 border-orange-200 p-8 gap-6"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Growing Team</h3>
            <p className="text-gray-600">
              We're always looking for talented and passionate individuals to help shape the future of education technology. Explore exciting career opportunities with us.
            </p>
          </div>
          <button className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all whitespace-nowrap">
            View Positions
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
