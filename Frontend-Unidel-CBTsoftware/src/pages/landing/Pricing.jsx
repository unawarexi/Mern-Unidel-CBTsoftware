import React from "react";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "../../constants/icons";
import useThemeStore from "../../store/theme-store";
import { pricingPlans } from "../../core/data/landing-mock-data";
import { colorMap } from "../../core/theme/colors";
import { headerAnimation, pricingCardAnimation, pricingCardHover, ctaAnimation } from "../../core/animation/animations";

const Pricing = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <section className={`relative bg-gradient-to-bl from-dark-950/95 via-accent-950/90 to-dark-950/95 py-8 md:py-16 overflow-hidden ${isDarkMode ? '' : 'rounded-br-[100px]'}`}>
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600 rounded-full blur-3xl animate-glow-pulse opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-accent-500 rounded-full blur-3xl animate-glow-pulse-delayed opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-glow-pulse-slow"></div>

      <div className="max-w-[90%] md:max-w-[80%] mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          {...headerAnimation}
          className="text-center mb-6 md:mb-10"
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-4">
            Flexible Pricing Plans
          </h2>
          <p className="text-sm sm:text-lg text-gray-200 max-w-3xl mx-auto">
            Choose the perfect plan for your institution's needs. All plans include our core CBT features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-10">
          {pricingPlans.map((plan, index) => {
            const colors = colorMap[plan.color];
            return (
              <motion.div
                key={index}
                {...pricingCardAnimation(index)}
                {...pricingCardHover}
                className={`relative bg-white rounded-2xl border-2 ${colors.border} p-4 md:p-8 transition-all hover:shadow-xl ${
                  plan.popular ? "shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-bold flex items-center gap-1">
                      <Star className="w-3 h-3 md:w-4 md:h-4" fill="white" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-4 md:mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">{plan.name}</h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">{plan.description}</p>
                  <div className="mb-1 md:mb-2">
                    <span className="text-2xl md:text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-sm md:text-base text-gray-600">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-2 md:space-y-3 mb-6 md:mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 md:gap-3">
                      <div className={`w-4 h-4 md:w-5 md:h-5 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-2.5 h-2.5 md:w-3 md:h-3 ${colors.text}`} />
                      </div>
                      <span className="text-xs md:text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full ${colors.button} text-white py-2.5 md:py-3 px-6 text-sm md:text-base rounded-xl font-semibold transition-all`}>
                  Get Started
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          {...ctaAnimation}
          className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-4 md:p-8 gap-4 md:gap-6"
        >
          <div className="flex-1">
            <h3 className="text-lg md:text-2xl font-bold text-white mb-1 md:mb-2">Need a Custom Solution?</h3>
            <p className="text-xs md:text-base text-gray-200">
              Contact our sales team for custom pricing and features tailored to your institution's specific needs
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-gray-900 px-4 md:px-6 py-2.5 md:py-3 text-sm md:text-base rounded-xl font-semibold hover:bg-gray-100 transition-all whitespace-nowrap">
            Contact Sales
            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;