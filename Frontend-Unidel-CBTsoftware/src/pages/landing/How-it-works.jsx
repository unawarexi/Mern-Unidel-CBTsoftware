/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, BookOpen, GraduationCap, 
  UserPlus, FileText, Upload, Settings,
  ClipboardList, PenTool, CheckCircle, BarChart3,
  ArrowRight, Calendar, Users, Award
} from "lucide-react";

const HowItWorks = () => {
  const [activeRole, setActiveRole] = useState("student");

  const roles = [
    { id: "admin", name: "Administrator", icon: Shield, color: "text-orange-600", bg: "bg-orange-50" },
    { id: "lecturer", name: "Lecturer", icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "student", name: "Student", icon: GraduationCap, color: "text-gray-600", bg: "bg-gray-50" },
  ];

  const workflows = {
    admin: [
      {
        step: 1,
        title: "System Setup",
        description: "Configure platform settings, academic sessions, and security parameters",
        icon: Settings,
        color: "orange"
      },
      {
        step: 2,
        title: "User Management",
        description: "Create and manage accounts for lecturers and students across departments",
        icon: UserPlus,
        color: "orange"
      },
      {
        step: 3,
        title: "Course Assignment",
        description: "Assign courses to lecturers and enroll students in respective programs",
        icon: ClipboardList,
        color: "orange"
      },
      {
        step: 4,
        title: "Monitor & Report",
        description: "Track system usage, generate reports, and ensure platform integrity",
        icon: BarChart3,
        color: "orange"
      }
    ],
    lecturer: [
      {
        step: 1,
        title: "Question Bank",
        description: "Create and organize comprehensive question banks for your courses",
        icon: FileText,
        color: "blue"
      },
      {
        step: 2,
        title: "Exam Setup",
        description: "Schedule exams, set duration, and configure assessment parameters",
        icon: Calendar,
        color: "blue"
      },
      {
        step: 3,
        title: "Upload Questions",
        description: "Import questions, set marking schemes, and randomize question order",
        icon: Upload,
        color: "blue"
      },
      {
        step: 4,
        title: "Review Results",
        description: "Access detailed analytics, review student performance, and export reports",
        icon: BarChart3,
        color: "blue"
      }
    ],
    student: [
      {
        step: 1,
        title: "Register & Login",
        description: "Access your personalized dashboard using your student credentials",
        icon: UserPlus,
        color: "gray"
      },
      {
        step: 2,
        title: "View Schedule",
        description: "Check upcoming exams, exam duration, and course information",
        icon: Calendar,
        color: "gray"
      },
      {
        step: 3,
        title: "Take Exam",
        description: "Complete your assessment in a secure, monitored environment",
        icon: PenTool,
        color: "gray"
      },
      {
        step: 4,
        title: "Instant Results",
        description: "Receive immediate feedback and view detailed performance analytics",
        icon: Award,
        color: "gray"
      }
    ]
  };

  const features = [
    { icon: CheckCircle, text: "Real-time Monitoring", color: "orange" },
    { icon: Shield, text: "Secure Environment", color: "blue" },
    { icon: Users, text: "Multi-user Support", color: "gray" },
    { icon: BarChart3, text: "Advanced Analytics", color: "orange" },
  ];

  const colorMap = {
    orange: { border: "border-orange-200", bg: "bg-orange-50", text: "text-orange-600", hover: "hover:border-orange-300" },
    blue: { border: "border-blue-200", bg: "bg-blue-50", text: "text-blue-600", hover: "hover:border-blue-300" },
    gray: { border: "border-gray-200", bg: "bg-gray-50", text: "text-gray-600", hover: "hover:border-gray-300" },
  };

  return (
    <section className="relative bg-gradient-to-br from-slate-900/95 via-blue-900/90 to-slate-900/95 py-12 md:py-16 overflow-hidden rounded-tr-[100px]">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-glow-pulse opacity-30"></div>
      <div className="absolute bottom-20 left-20 w-[450px] h-[450px] bg-blue-400 rounded-full blur-3xl animate-glow-pulse-delayed opacity-30"></div>

      <div className="max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-200 max-w-3xl mx-auto">
            Streamlined workflows designed for administrators, lecturers, and students to ensure seamless examination management
          </p>
        </motion.div>

        {/* Role Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setActiveRole(role.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all ${
                activeRole === role.id
                  ? `${role.bg} ${role.color} border-2 border-current shadow-md`
                  : "bg-white/10 backdrop-blur-sm text-white border-2 border-white/20 hover:border-white/40"
              }`}
            >
              <role.icon className="w-5 h-5" />
              <span>{role.name}</span>
            </button>
          ))}
        </div>

        {/* Workflow Steps */}
        <motion.div
          key={activeRole}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {workflows[activeRole].map((step, index) => {
            const colors = colorMap[step.color];
            return (
              <div
                key={index}
                className={`relative bg-white/95 backdrop-blur-sm rounded-xl border-2 ${colors.border} ${colors.hover} p-6 transition-all hover:shadow-lg`}
              >
                {/* Step Number Badge */}
                <div className={`absolute -top-4 -left-4 w-10 h-10 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center font-bold text-lg border-2 ${colors.border}`}>
                  {step.step}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <step.icon className={`w-7 h-7 ${colors.text}`} />
                </div>

                {/* Content */}
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-8"
        >
          <h3 className="text-2xl font-bold text-white text-center mb-6">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const colors = colorMap[feature.color];
              return (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-16 h-16 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <p className="font-semibold text-gray-900">{feature.text}</p>
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