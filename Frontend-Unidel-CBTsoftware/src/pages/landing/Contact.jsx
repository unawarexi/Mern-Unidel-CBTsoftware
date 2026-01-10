/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, MessageSquare } from "lucide-react";
import useThemeStore from "../../store/theme-store";

const Contact = () => {
  const { isDarkMode } = useThemeStore();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["University of Delta", "Abraka, Delta State", "Nigeria"],
      color: "orange"
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+234 (0) 800 123 4567", "+234 (0) 800 765 4321", "Mon - Fri, 8AM - 5PM"],
      color: "blue"
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@unidel.edu.ng", "cbt@unidel.edu.ng", "Response within 24hrs"],
      color: "gray"
    }
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200" },
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    gray: { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200" },
  };

  return (
    <section className={`relative ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gray-50'} py-8 md:py-16 overflow-hidden transition-colors duration-300`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-0 left-0 w-96 h-96 ${isDarkMode ? 'bg-orange-500/30' : 'bg-orange-500'} rounded-full blur-3xl animate-glow-pulse`}></div>
      <div className={`absolute bottom-0 right-0 w-[450px] h-[450px] ${isDarkMode ? 'bg-blue-600/30' : 'bg-blue-950'} rounded-full blur-3xl animate-glow-pulse-delayed`}></div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] ${isDarkMode ? 'bg-slate-800/20' : 'bg-gray-900'} rounded-full blur-3xl animate-glow-pulse-slow`}></div>

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
            Get In Touch
          </h2>
          <p className={`text-sm sm:text-base md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Have questions about our CBT platform? We're here to help. Reach out to our support team.
          </p>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-4 md:gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`lg:col-span-2 ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-gray-200'} rounded-2xl border-2 p-4 md:p-8`}
          >
            <div className="flex items-center gap-3 mb-4 md:mb-6">
              <div className={`w-10 h-10 md:w-12 md:h-12 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} rounded-xl flex items-center justify-center`}>
                <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
              <div>
                <h3 className={`text-lg md:text-xl lg:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Send Us a Message</h3>
                <p className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fill out the form below and we'll get back to you</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
              <div className="grid md:grid-cols-2 gap-4 md:gap-5">
                <div>
                  <label htmlFor="name" className={`block text-xs md:text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 md:mb-2`}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-sm lg:text-base ${isDarkMode ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500 focus:ring-orange-500/20 focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-orange-100 focus:border-orange-500'} border-2 rounded-xl focus:outline-none focus:ring-4 transition-all`}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className={`block text-xs md:text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 md:mb-2`}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-sm lg:text-base ${isDarkMode ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500 focus:ring-orange-500/20 focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-orange-100 focus:border-orange-500'} border-2 rounded-xl focus:outline-none focus:ring-4 transition-all`}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className={`block text-xs md:text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 md:mb-2`}>
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-sm lg:text-base ${isDarkMode ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500 focus:ring-orange-500/20 focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-orange-100 focus:border-orange-500'} border-2 rounded-xl focus:outline-none focus:ring-4 transition-all`}
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className={`block text-xs md:text-xs lg:text-sm font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1 md:mb-2`}>
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your inquiry..."
                  rows="5"
                  className={`w-full px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-sm lg:text-base ${isDarkMode ? 'bg-slate-900/50 border-slate-600 text-white placeholder-gray-500 focus:ring-orange-500/20 focus:border-orange-500' : 'bg-gray-50 border-gray-200 text-gray-900 focus:ring-orange-100 focus:border-orange-500'} border-2 rounded-xl focus:outline-none focus:ring-4 transition-all resize-none`}
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white py-2.5 md:py-3.5 px-6 text-sm md:text-sm lg:text-base rounded-xl font-semibold hover:bg-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-200 transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
                Send Message
              </button>
            </form>
          </motion.div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
            {contactInfo.map((info, index) => {
              const colors = colorMap[info.color];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-' + colors.border.split('-')[1]} rounded-xl border-2 p-4 md:p-5 hover:shadow-lg transition-all`}
                >
                  <div className={`w-10 h-10 md:w-12 md:h-12 ${isDarkMode ? 'bg-' + colors.bg.split('-')[1] + '-500/10' : colors.bg} rounded-xl flex items-center justify-center mb-2 md:mb-3`}>
                    <info.icon className={`w-5 h-5 md:w-6 md:h-6 ${colors.text}`} />
                  </div>
                  <h3 className={`text-base md:text-base lg:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>{detail}</p>
                  ))}
                </motion.div>
              );
            })}

            {/* Support Hours Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} rounded-xl border-2 p-4 md:p-5 col-span-2 lg:col-span-1`}
            >
              <Clock className="w-8 h-8 md:w-10 md:h-10 text-blue-600 mb-2 md:mb-3" />
              <h3 className={`text-base md:text-base lg:text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-1 md:mb-2`}>Support Hours</h3>
              <p className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mb-2`}>Monday to Friday</p>
              <p className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>8:00 AM - 5:00 PM (WAT)</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
