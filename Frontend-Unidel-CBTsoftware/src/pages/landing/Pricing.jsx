/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "Free",
      description: "Perfect for small-scale assessments",
      features: [
        "Up to 100 students per exam",
        "Basic question types",
        "Standard reporting",
        "Email support",
        "30-day data retention"
      ],
      color: "gray",
      popular: false
    },
    {
      name: "Professional",
      price: "₦50,000",
      period: "/semester",
      description: "Ideal for departments and faculties",
      features: [
        "Up to 500 students per exam",
        "Advanced question types",
        "Detailed analytics",
        "Priority support",
        "1-year data retention",
        "Custom branding"
      ],
      color: "orange",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For university-wide deployment",
      features: [
        "Unlimited students",
        "All question types",
        "Advanced analytics & AI insights",
        "24/7 dedicated support",
        "Unlimited data retention",
        "Custom integrations",
        "On-premise deployment option"
      ],
      color: "blue",
      popular: false
    }
  ];

  const colorMap = {
    gray: { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", button: "bg-gray-600 hover:bg-gray-700" },
    orange: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-600", button: "bg-orange-600 hover:bg-orange-700" },
    blue: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-600", button: "bg-blue-600 hover:bg-blue-700" }
  };

  return (
    <section className="relative bg-gradient-to-bl from-slate-950/95 via-blue-950/90 to-slate-950/95 py-12 md:py-16 overflow-hidden rounded-br-[100px]">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600 rounded-full blur-3xl animate-glow-pulse opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-blue-500 rounded-full blur-3xl animate-glow-pulse-delayed opacity-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-glow-pulse-slow"></div>

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
            Flexible Pricing Plans
          </h2>
          <p className="text-base sm:text-lg text-gray-200 max-w-3xl mx-auto">
            Choose the perfect plan for your institution's needs. All plans include our core CBT features.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {plans.map((plan, index) => {
            const colors = colorMap[plan.color];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className={`relative bg-white rounded-2xl border-2 ${colors.border} p-8 transition-all hover:shadow-xl ${
                  plan.popular ? "shadow-lg" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                      <Star className="w-4 h-4" fill="white" />
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600">{plan.period}</span>}
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`w-5 h-5 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className={`w-3 h-3 ${colors.text}`} />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full ${colors.button} text-white py-3 px-6 rounded-xl font-semibold transition-all`}>
                  Get Started
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-sm rounded-2xl border-2 border-white/20 p-8 gap-6"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Need a Custom Solution?</h3>
            <p className="text-gray-200">
              Contact our sales team for custom pricing and features tailored to your institution's specific needs
            </p>
          </div>
          <button className="flex items-center gap-2 bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all whitespace-nowrap">
            Contact Sales
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Pricing;