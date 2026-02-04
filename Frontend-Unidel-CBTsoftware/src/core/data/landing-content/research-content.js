import {
  FlaskConical,
  Microscope,
  FileText,
  Award,
  Briefcase,
  Globe,
} from "lucide-react";

export const researchHubData = {
  hero: {
    title: "Research & Innovation",
    highlight: "Pioneering",
    subtitle:
      "Pushing the boundaries of knowledge to solve local and global challenges.",
    cta: { text: "Our Research", link: "/research/centers" },
  },
  sections: [
    {
      type: "rich-text",
      title: "Impact Driven",
      content: [
        "Unidel is committed to research that matters. Our strategic focus areas include renewable energy, health sciences, digital transformation, and sustainable agriculture.",
        "We collaborate with industry partners, government agencies, and international bodies to translate findings into tangible solutions.",
      ],
    },
    {
      type: "grid-cards",
      title: "Focus Areas",
      items: [
        {
          title: "Research Centers",
          description: "Specialized hubs for interdisciplinary study.",
          link: "/research/centers",
          icon: Microscope,
        },
        {
          title: "Laboratories",
          description: "State-of-the-art facilities.",
          link: "#",
          icon: FlaskConical,
        },
        {
          title: "Publications",
          description: "Recent journals and papers by our faculty.",
          link: "#",
          icon: FileText,
        },
        {
          title: "Grants & Funding",
          description: "Support for researchers.",
          link: "#",
          icon: Award,
        },
      ],
    },
  ],
};
