import React, { useState } from "react";
import { ArrowRight, Play, GraduationCap, BookOpen, Clock, Award } from "lucide-react";
import { Images } from "../../constants/image-strings";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";

const HeroSection = () => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const { isDarkMode } = useThemeStore();

  const floatingBadges = [
    { name: "John Doe", color: "orange", position: "top-[15%] right-[8%]" },
    { name: "Mike Taylor", subtitle: "Top Student", color: "red", position: "top-[45%] right-[5%]" },
    { name: "Angela Taylor", color: "orange", position: "bottom-[20%] right-[10%]" },
  ];

  const features = [
    { icon: Clock, text: "Flexible Timing" },
    { icon: BookOpen, text: "Comprehensive Coverage" },
    { icon: Award, text: "Instant Results" },
  ];

  return (
    <section className={`relative ${isDarkMode ? 'bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900' : 'bg-gradient-to-br from-gray-50 via-white to-orange-50'} overflow-hidden transition-colors duration-300`}>
      {/* Decorative Background Elements */}
      <div className={`absolute top-20 right-20 w-72 h-72 ${isDarkMode ? 'bg-orange-600/30' : 'bg-orange-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob`}></div>
      <div className={`absolute top-40 left-20 w-72 h-72 ${isDarkMode ? 'bg-blue-600/30' : 'bg-blue-100'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000`}></div>
      <div className={`absolute -bottom-20 right-40 w-72 h-72 ${isDarkMode ? 'bg-orange-500/30' : 'bg-orange-200'} rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000`}></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 py-8 md:py-20 lg:py-28 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-14 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-4 lg:space-y-8">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-xs lg:text-sm ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600'} border rounded-full font-medium animate-fade-in`}>
              <GraduationCap className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">#1 CBT PLATFORM FOR ACADEMIC EXCELLENCE</span>
              <span className="sm:hidden">#1 CBT PLATFORM</span>
            </div>

            {/* Main Heading */}
            <h1 className={`text-2xl sm:text-4xl md:text-4xl lg:text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} leading-tight animate-slide-up`}>
              Secure & Reliable.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-500">Your Platform for High</span>
              <br />
              Value Assessments.
            </h1>

            {/* Description */}
            <p className={`text-sm md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed max-w-xl mx-auto lg:mx-0 animate-slide-up animation-delay-200`}>Experience seamless computer-based testing with UNIDEL's advanced platform. Schedule exams, take tests, and receive instant results—all in one secure environment.</p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-2 md:gap-4 text-xs md:text-xs lg:text-sm text-gray-600 animate-slide-up animation-delay-300">
              {features.map((feature, index) => (
                <div key={index} className={`flex items-center gap-1.5 md:gap-2 ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-gray-300' : 'bg-white text-gray-600'} px-2.5 md:px-4 py-1.5 md:py-2 rounded-lg shadow-sm border`}>
                  <feature.icon className="w-3 h-3 md:w-4 md:h-4 text-orange-600" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start animate-slide-up animation-delay-400">
              <Link to="/portal-signin" className="group inline-flex items-center justify-center gap-2 px-5 md:px-8 py-3 md:py-4 text-sm md:text-sm lg:text-base bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl hover:scale-105">
                Start Free Trial
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button onClick={() => setIsVideoPlaying(true)} className={`group inline-flex items-center justify-center gap-2 md:gap-3 px-5 md:px-8 py-3 md:py-4 text-sm md:text-sm lg:text-base ${isDarkMode ? 'bg-slate-800 text-white hover:bg-slate-700 border-slate-700' : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-200'} font-semibold rounded-xl transition-all shadow-md hover:shadow-lg border`}>
                <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 bg-orange-500 rounded-full group-hover:bg-orange-600 transition-colors">
                  <Play className="w-4 h-4 md:w-5 md:h-5 text-white ml-0.5" fill="white" />
                </div>
                How it Works
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 md:gap-8 justify-center lg:justify-start pt-2 md:pt-4 animate-slide-up animation-delay-500">
              <div>
                <div className={`text-2xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10,000+</div>
                <div className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Students Tested</div>
              </div>
              <div>
                <div className={`text-2xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>50+</div>
                <div className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Departments</div>
              </div>
              <div>
                <div className={`text-2xl md:text-2xl lg:text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>99.9%</div>
                <div className={`text-xs md:text-xs lg:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Content - Image with Floating Elements */}
          <div className="relative animate-fade-in animation-delay-600 flex justify-center lg:justify-end">
            {/* Circular Badge */}
            <div className="absolute -top-8 right-8 z-10 animate-float">
              <div className={`w-28 h-28 ${isDarkMode ? 'bg-slate-800 border-orange-500' : 'bg-white border-orange-500'} rounded-full shadow-xl flex items-center justify-center border-4`}>
                <div className="text-center">
                  <GraduationCap className="w-10 h-10 text-orange-600 mx-auto mb-1" />
                  <div className={`text-xs font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Best CBT</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Platform</div>
                </div>
              </div>
            </div>

            {/* Red Ribbon Badge */}
            <div className="absolute -top-4 -right-4 z-10 animate-float animation-delay-1000">
              <div className="relative">
                <div className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-xl transform rotate-12 hover:rotate-6 transition-transform">
                  <div className="text-sm font-bold">Saiful Tahukdar</div>
                  <div className="text-xs opacity-90">Top Achiever</div>
                </div>
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-orange-600 rounded-full"></div>
              </div>
            </div>

            {/* Main Image Container - constrained width so it doesn't force the grid to cram */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] lg:aspect-square w-full max-w-md sm:max-w-lg lg:max-w-xl">
              {/* Placeholder Image */}
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-50 to-orange-50">
               <img src={Images.heroImage} alt="Hero" className="object-cover w-full h-full" />
              </div>

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>

            {/* Floating User Badges */}
            {floatingBadges.map((badge, index) => (
              <div key={index} className={`absolute ${badge.position} hidden lg:block animate-float`} style={{ animationDelay: `${index * 500}ms` }}>
                <div className="bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 border-2 border-gray-100 hover:scale-110 transition-transform">
                  <div className={`w-3 h-3 bg-${badge.color}-500 rounded-full`}></div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-900">{badge.name}</div>
                    {badge.subtitle && <div className="text-xs text-gray-500">{badge.subtitle}</div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setIsVideoPlaying(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <button onClick={() => setIsVideoPlaying(false)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
              ✕
            </button>
            <div className="w-full h-full flex items-center justify-center text-white">
              <div className="text-center space-y-4">
                <Play className="w-20 h-20 mx-auto opacity-50" />
                <p className="text-lg">Video Player Placeholder</p>
                <p className="text-sm text-gray-400">Insert your video embed here</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
