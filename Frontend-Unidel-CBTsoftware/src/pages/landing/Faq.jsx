import React from "react";
import { PageHeader, Section } from "../../containers/PageLayout";
import { Accordion } from "../../components/landing/LandingComponents";

const faqItems = [
  {
    question: "How do I apply for admission?",
    answer:
      "You can apply for admission by visiting our Admissions page and clicking on the 'Apply Now' button. Follow the instructions to create an account and submit your application.",
  },
  {
    question: "What are the school fees?",
    answer:
      "School fees vary depending on the program and level of study. Please visit the Fees page under the Admissions section for a detailed breakdown of the current fee schedule.",
  },
  {
    question: "Is there accommodation on campus?",
    answer:
      "Yes, the university provides hostel accommodation for students. Allocation is often on a first-come, first-served basis after acceptance of admission.",
  },
  {
    question: "How can I access the student portal?",
    answer:
      "You can access the student portal by clicking the 'Login' button at the top right of the website and selecting 'Student Portal'. Log in with your matriculation number and password.",
  },
];

const Faq = () => {
  return (
    <>
      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Common Questions"
        description="Find answers to the most common questions about admission, student life, and academics at UNIDEL."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
      />

      <Section>
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} />
        </div>
      </Section>
    </>
  );
};

export default Faq;
