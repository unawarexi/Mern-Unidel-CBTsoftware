import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const footerSections = [
    {
      title: "QUICK LINKS",
      links: [
        { name: "About UNIDEL", href: "#about" },
        { name: "Admissions", href: "#admissions" },
        { name: "Academic Programs", href: "#programs" },
        { name: "Student Portal", href: "#portal" },
      ],
    },
    {
      title: "RESOURCES",
      links: [
        { name: "Course Materials", href: "#materials" },
        { name: "Study Guides", href: "#guides" },
        { name: "Practice Tests", href: "#practice" },
        { name: "Help Center", href: "#help" },
      ],
    },
    {
      title: "SUPPORT",
      links: [
        { name: "Contact Us", href: "#contact" },
        { name: "FAQs", href: "#faqs" },
        { name: "Technical Support", href: "#tech-support" },
        { name: "Feedback", href: "#feedback" },
      ],
    },
    {
      title: "POLICIES",
      links: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Exam Guidelines", href: "#guidelines" },
        { name: "Code of Conduct", href: "#conduct" },
      ],
    },
    {
      title: "CONNECT",
      links: [
        { name: "News & Updates", href: "#news" },
        { name: "Events", href: "#events" },
        { name: "Blog", href: "#blog" },
        { name: "Career Services", href: "#careers" },
      ],
    },
    {
      title: "DEPARTMENTS",
      links: [
        { name: "Engineering", href: "#engineering" },
        { name: "Sciences", href: "#sciences" },
        { name: "Arts & Humanities", href: "#arts" },
        { name: "Management", href: "#management" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Instagram, href: "#instagram", label: "Instagram" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-white text-gray-600 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-10">
          {footerSections.map((section, index) => (
            <div key={index} className="text-left">
              <h2 className="font-semibold text-gray-900 tracking-wide text-xs md:text-sm mb-3 md:mb-4">{section.title}</h2>
              <nav className="space-y-2 md:space-y-2.5">
                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex}>
                    <a href={link.href} className="text-sm text-gray-600 hover:text-orange-600 transition-colors inline-block">
                      {link.name}
                    </a>
                  </div>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
            {/* Newsletter Form */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-4 flex-1">
              <div className="w-full sm:w-64">
                <label htmlFor="newsletter" className="block text-sm text-gray-600 mb-1.5">
                  Subscribe to Newsletter
                </label>
                <input type="email" id="newsletter" name="newsletter" placeholder="Enter your email" className="w-full bg-gray-50 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-200 focus:border-orange-500 text-sm outline-none text-gray-700 py-2.5 px-4 transition-all" />
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm hover:shadow-md">Subscribe</button>
              <p className="text-gray-500 text-xs sm:text-sm md:ml-4">
                Stay updated with exam schedules
                <br className="hidden lg:block" />
                and important announcements
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 justify-start md:justify-end">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} aria-label={social.label} className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-full transition-all">
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs sm:text-sm">
            <div className="text-gray-500 text-left">
              <p>
                 {new Date().getFullYear()} University of Delta (UNIDEL) —{" "}
                <a href="#" className="text-gray-700 hover:text-orange-600 font-medium transition-colors">
                  Computer Based Test Platform
                </a>
              </p>
            </div>
            <div className="flex items-center gap-4 text-gray-500 text-left sm:text-right">
              <a href="#terms" className="hover:text-orange-600 transition-colors">
                Terms
              </a>
              <span className="text-gray-300">•</span>
              <a href="#privacy" className="hover:text-orange-600 transition-colors">
                Privacy
              </a>
              <span className="text-gray-300">•</span>
              <a href="#accessibility" className="hover:text-orange-600 transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="w-4 h-4" />
              <span>support@unidel.edu.ng</span>
            </div>
            <div className="text-gray-400">Need help? Contact our support team 24/7</div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
