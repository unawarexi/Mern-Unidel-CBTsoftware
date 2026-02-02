/**
 * Fees Page
 * Tuition and fees information
 */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  TabbedContent,
  Accordion,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  CreditCard,
  Calculator,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Download,
  Phone,
  Calendar,
} from "lucide-react";
import ExportButton from "../../components/ExportButton";

const undergraduateFees = {
  sciences: [
    {
      program: "Computer Science",
      tuition: 450000,
      acceptance: 50000,
      registration: 25000,
    },
    {
      program: "Physics",
      tuition: 380000,
      acceptance: 50000,
      registration: 25000,
    },
    {
      program: "Chemistry",
      tuition: 380000,
      acceptance: 50000,
      registration: 25000,
    },
    {
      program: "Biology",
      tuition: 380000,
      acceptance: 50000,
      registration: 25000,
    },
    {
      program: "Mathematics",
      tuition: 350000,
      acceptance: 50000,
      registration: 25000,
    },
  ],
  engineering: [
    {
      program: "Civil Engineering",
      tuition: 550000,
      acceptance: 75000,
      registration: 30000,
    },
    {
      program: "Mechanical Engineering",
      tuition: 550000,
      acceptance: 75000,
      registration: 30000,
    },
    {
      program: "Electrical Engineering",
      tuition: 550000,
      acceptance: 75000,
      registration: 30000,
    },
    {
      program: "Petroleum Engineering",
      tuition: 650000,
      acceptance: 100000,
      registration: 35000,
    },
  ],
  arts: [
    {
      program: "English",
      tuition: 300000,
      acceptance: 40000,
      registration: 20000,
    },
    {
      program: "History",
      tuition: 300000,
      acceptance: 40000,
      registration: 20000,
    },
    {
      program: "Economics",
      tuition: 320000,
      acceptance: 45000,
      registration: 20000,
    },
    {
      program: "Mass Communication",
      tuition: 350000,
      acceptance: 50000,
      registration: 25000,
    },
  ],
  law: [
    {
      program: "Law (LL.B)",
      tuition: 600000,
      acceptance: 100000,
      registration: 35000,
    },
  ],
};

const otherFees = [
  { name: "Library Fee", amount: 15000, frequency: "Per Session" },
  { name: "ICT Fee", amount: 20000, frequency: "Per Session" },
  { name: "Medical Fee", amount: 10000, frequency: "Per Session" },
  { name: "Sports Fee", amount: 5000, frequency: "Per Session" },
  { name: "Examination Fee", amount: 25000, frequency: "Per Session" },
  { name: "Student Union Dues", amount: 5000, frequency: "Per Session" },
  { name: "ID Card", amount: 3000, frequency: "One-time" },
  { name: "Course Registration", amount: 10000, frequency: "Per Session" },
];

const paymentMethods = [
  {
    icon: CreditCard,
    title: "Online Payment",
    description:
      "Pay securely via debit/credit card through our student portal. All major cards accepted.",
  },
  {
    icon: DollarSign,
    title: "Bank Transfer",
    description:
      "Transfer directly to UNIDEL's designated bank accounts. Use your application/matric number as reference.",
  },
  {
    icon: Calculator,
    title: "Installment Plan",
    description:
      "Pay in two installments: 60% before registration, 40% before mid-semester exams.",
  },
];

const feesFaq = [
  {
    question: "When are fees due?",
    answer:
      "All fees must be paid before the end of the registration period each semester. Late payment attracts a penalty of 5% of outstanding amount per month.",
  },
  {
    question: "Can I pay in installments?",
    answer:
      "Yes, we offer a flexible payment plan. You can pay 60% of your fees before registration and the remaining 40% before mid-semester examinations. There's no additional charge for using the installment plan.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "No, all fees are clearly stated. The fees listed include tuition, acceptance fee, and registration fee. Other fees such as library, ICT, and examination fees are also mandatory and listed separately.",
  },
  {
    question: "What happens if I can't pay on time?",
    answer:
      "Students who cannot pay on time should contact the Bursary department immediately. Failure to pay fees may result in denial of access to the portal, inability to write exams, and withholding of results.",
  },
  {
    question: "Is the acceptance fee refundable?",
    answer:
      "No, the acceptance fee is non-refundable. It secures your admission offer and covers administrative processing. Please ensure you're ready to enroll before paying.",
  },
];

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
};

const Fees = () => {
  const { isDarkMode } = useThemeStore();

  const FeeTable = ({ fees }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr
            className={cn(
              "border-b",
              isDarkMode ? "border-slate-700" : "border-gray-200",
            )}
          >
            <th
              className={cn(
                "text-left py-3 px-4 font-semibold text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Program
            </th>
            <th
              className={cn(
                "text-right py-3 px-4 font-semibold text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Tuition
            </th>
            <th
              className={cn(
                "text-right py-3 px-4 font-semibold text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Acceptance
            </th>
            <th
              className={cn(
                "text-right py-3 px-4 font-semibold text-sm",
                isDarkMode ? "text-gray-400" : "text-gray-600",
              )}
            >
              Registration
            </th>
            <th
              className={cn(
                "text-right py-3 px-4 font-semibold text-sm",
                isDarkMode ? "text-orange-400" : "text-orange-600",
              )}
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee, idx) => {
            const total = fee.tuition + fee.acceptance + fee.registration;
            return (
              <tr
                key={idx}
                className={cn(
                  "border-b",
                  isDarkMode ? "border-slate-800" : "border-gray-100",
                )}
              >
                <td
                  className={cn(
                    "py-3 px-4 font-medium",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {fee.program}
                </td>
                <td
                  className={cn(
                    "py-3 px-4 text-right text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {formatCurrency(fee.tuition)}
                </td>
                <td
                  className={cn(
                    "py-3 px-4 text-right text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {formatCurrency(fee.acceptance)}
                </td>
                <td
                  className={cn(
                    "py-3 px-4 text-right text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {formatCurrency(fee.registration)}
                </td>
                <td
                  className={cn(
                    "py-3 px-4 text-right font-bold",
                    isDarkMode ? "text-orange-400" : "text-orange-600",
                  )}
                >
                  {formatCurrency(total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const tabContent = [
    {
      title: "Sciences",
      content: <FeeTable fees={undergraduateFees.sciences} />,
    },
    {
      title: "Engineering",
      content: <FeeTable fees={undergraduateFees.engineering} />,
    },
    {
      title: "Arts & Social Sciences",
      content: <FeeTable fees={undergraduateFees.arts} />,
    },
    {
      title: "Law",
      content: <FeeTable fees={undergraduateFees.law} />,
    },
  ];

  return (
    <>
      <PageHeader
        subtitle="Financial Information"
        title="Tuition & Fees"
        description="Transparent breakdown of all fees for the 2026/2027 academic session. UNIDEL is committed to making quality education accessible and affordable."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Admissions", href: "#" },
          { label: "Fees" },
        ]}
      >
        <div className="flex flex-wrap gap-4 mt-6">
          <a
            href="/documents/fee-schedule-2026.pdf"
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium border transition-all",
              isDarkMode
                ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
            )}
          >
            <Download className="w-4 h-4" /> Download Fee Schedule (PDF)
          </a>
          <ExportButton
            type="fees-report"
            title="University Fee Structure 2026/2027"
            className="!rounded-lg"
          />
        </div>
      </PageHeader>

      {/* Important Notice */}
      <Section>
        <div
          className={cn(
            "p-5 rounded-xl border flex items-start gap-4",
            isDarkMode
              ? "bg-orange-500/10 border-orange-500/30"
              : "bg-orange-50 border-orange-200",
          )}
        >
          <AlertCircle
            className={cn(
              "w-6 h-6 flex-shrink-0 mt-0.5",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          />
          <div>
            <h4
              className={cn(
                "font-bold mb-1",
                isDarkMode ? "text-orange-400" : "text-orange-700",
              )}
            >
              Important Notice
            </h4>
            <p
              className={cn(
                "text-sm",
                isDarkMode ? "text-gray-300" : "text-gray-700",
              )}
            >
              Fees are subject to annual review by the Governing Council. The
              fees shown here are for the 2026/2027 academic session. Returning
              students should check the portal for any updates before payment.
            </p>
          </div>
        </div>
      </Section>

      {/* Undergraduate Fees */}
      <Section
        title="Undergraduate Fees"
        subtitle="2026/2027 Session"
        description="Select a faculty to view the fee structure for each program. All amounts are in Nigerian Naira (₦)."
      >
        <div
          className={cn(
            "p-6 rounded-xl border",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          <TabbedContent tabs={tabContent} />
        </div>
      </Section>

      {/* Other Fees */}
      <Section
        title="Other Mandatory Fees"
        subtitle="Additional Charges"
        background="alt"
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherFees.map((fee, idx) => (
            <div
              key={idx}
              className={cn(
                "p-4 rounded-xl border text-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "text-2xl font-bold mb-1",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {formatCurrency(fee.amount)}
              </div>
              <div
                className={cn(
                  "font-medium text-sm mb-1",
                  isDarkMode ? "text-gray-300" : "text-gray-700",
                )}
              >
                {fee.name}
              </div>
              <div
                className={cn(
                  "text-xs",
                  isDarkMode ? "text-gray-500" : "text-gray-500",
                )}
              >
                {fee.frequency}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Payment Methods */}
      <Section
        title="Payment Methods"
        subtitle="How to Pay"
        description="We offer multiple convenient payment options. Choose the method that works best for you."
      >
        <div className="grid md:grid-cols-3 gap-6">
          {paymentMethods.map((method, idx) => (
            <div
              key={idx}
              className={cn(
                "p-6 rounded-xl border text-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4",
                  isDarkMode
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-orange-100 text-orange-600",
                )}
              >
                <method.icon className="w-7 h-7" />
              </div>
              <h3
                className={cn(
                  "font-bold mb-2",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                {method.title}
              </h3>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                {method.description}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section title="Fees FAQ" subtitle="Common Questions" background="alt">
        <div className="max-w-3xl mx-auto">
          <Accordion items={feesFaq} />
        </div>
      </Section>

      {/* Contact */}
      <Section>
        <div className="text-center">
          <Phone
            className={cn(
              "w-10 h-10 mx-auto mb-4",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          />
          <h3
            className={cn(
              "text-lg font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Questions About Fees?
          </h3>
          <p
            className={cn(
              "text-sm mb-4",
              isDarkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Contact the Bursary Department for clarifications or payment
            assistance.
          </p>
          <p
            className={cn(
              "text-sm",
              isDarkMode ? "text-gray-300" : "text-gray-700",
            )}
          >
            Email:{" "}
            <a href="mailto:bursary@unidel.edu.ng" className="text-orange-500">
              bursary@unidel.edu.ng
            </a>{" "}
            | Phone:{" "}
            <a href="tel:+2348012345679" className="text-orange-500">
              +234 801 234 5679
            </a>
          </p>
        </div>
      </Section>

      <CTABanner
        title="Ready to Enroll?"
        description="Start your application today and take the first step towards your future."
        primaryAction={{ label: "Apply Now", href: "/apply" }}
        secondaryAction={{ label: "View Scholarships", href: "/scholarships" }}
      />
    </>
  );
};

export default Fees;
