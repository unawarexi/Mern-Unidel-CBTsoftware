import {
  FileText,
  Calendar,
  DollarSign,
  Award,
  Users,
  Globe,
  HelpCircle,
} from "lucide-react";

export const admissionsHubData = {
  hero: {
    title: "Admissions",
    highlight: "Join Us",
    subtitle:
      "Begin your journey at the University of Delta. We welcome students from all backgrounds who are eager to learn, innovate, and lead.",
    cta: { text: "Apply Now", link: "/apply" },
    secondaryCta: { text: "Requirements", link: "/admissions/requirements" },
  },
  sections: [
    {
      type: "rich-text",
      title: "Your Future Starts Here",
      content: [
        "Admission into UNIDEL is strictly by merit and open to all candidates who meet the statutory requirements.",
        "Whether you are a fresh secondary school graduate, a transfer student, or seeking postgraduate qualification, our admission process is transparent, efficient, and digital.",
      ],
    },
    {
      type: "grid-cards",
      title: "Information Categories",
      items: [
        {
          title: "How to Apply",
          description: "Step-by-step guide to our application portal.",
          link: "/admissions/how-to-apply",
          icon: FileText,
        },
        {
          title: "Requirements",
          description: "Check eligibility for your desired program.",
          link: "/admissions/requirements",
          icon: FileText,
        },
        {
          title: "Tuition & Fees",
          description: "Understand the financial commitment.",
          link: "/admissions/fees",
          icon: DollarSign,
        },
        {
          title: "Scholarships",
          description: "Financial aid opportunities.",
          link: "/admissions/scholarships",
          icon: Award,
        },
      ],
    },
  ],
};

export const requirementsData = {
  hero: {
    title: "Requirements",
    highlight: "Admission",
    subtitle:
      "General and specific requirements for undergraduate and postgraduate studies.",
    cta: { text: "Download Brochure", link: "#" },
  },
  sections: [
    {
      type: "rich-text",
      title: "Undergraduate Requirements",
      content: [
        "<strong>UTME Candidates:</strong> Must possess a minimum of five (5) credit passes in WAEC/NECO/NABTEB including English Language and Mathematics at not more than two sittings. Must hit the JAMB cut-off mark.",
        "<strong>Direct Entry:</strong> Candidates must possess A-Level passes, JUPEB, or National Diploma (ND) with Upper Credit in relevant fields.",
      ],
    },
    {
      type: "documents-list",
      title: "Checklists",
      items: [
        {
          title: "Undergraduate Eligibility Checklist",
          format: "PDF",
          size: "500 KB",
        },
        {
          title: "Postgraduate Eligibility Checklist",
          format: "PDF",
          size: "600 KB",
        },
      ],
    },
  ],
};

export const feesData = {
  hero: {
    title: "Tuition & Fees",
    highlight: "Financials",
    subtitle:
      "Transparent fee structure for all programs. Invest in your future.",
    cta: { text: "Make Payment", link: "/portal-signin" },
  },
  sections: [
    {
      type: "features-list",
      title: "Payment Information",
      items: [
        {
          title: "Acceptance Fee",
          description: "Non-refundable fee paid upon admission offer.",
        },
        {
          title: "School Fees",
          description:
            "Paid per session. Installment options available for returning students.",
        },
        {
          title: "Hostel Fee",
          description: "Optional accommodation fee for campus residency.",
        },
        {
          title: "Other Charges",
          description:
            "ICT, Library, and Medical fees are included in the breakdown.",
        },
      ],
    },
  ],
};

export const scholarshipsData = {
  hero: {
    title: "Scholarships",
    highlight: "Aid &",
    subtitle:
      "UNIDEL offers various scholarships to support meritorious and indigent students.",
    cta: { text: "Apply for Aid", link: "/portal-signin" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Available Schemes",
      items: [
        {
          title: "Merit Scholarship",
          description: "For students with CGPA 4.5+.",
          icon: Award,
        },
        {
          title: "Indigent Student Fund",
          description: "Support for financially challenged students.",
          icon: Users,
        },
        {
          title: "Sports Scholarship",
          description: "For exceptional athletes representing the university.",
          icon: Award,
        },
      ],
    },
  ],
};
