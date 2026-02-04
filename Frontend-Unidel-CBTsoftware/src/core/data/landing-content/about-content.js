import {
  Building2,
  Award,
  Users,
  Shield,
  Newspaper,
  Phone,
  MapPin,
  FileText,
} from "lucide-react";

export const aboutHubData = {
  hero: {
    title: "About UNIDEL",
    highlight: "Discover",
    subtitle: "A legacy of excellence, a future of endless possibilities.",
    cta: { text: "Our History", link: "/about/history" },
  },
  sections: [
    {
      type: "rich-text",
      title: "Who We Are",
      content: [
        "The University of Delta is a premier institution dedicated to academic excellence and character formation. Established with a vision to be a pace-setter in higher education, we pride ourselves on a culture of integrity, hard work, and innovation.",
        "Our campuses are vibrant communities where students find their voice and purpose.",
      ],
    },
    {
      type: "grid-cards",
      title: "Learn More",
      items: [
        {
          title: "History",
          description: "Our journey from inception to date.",
          link: "/about/history",
          icon: Building2,
        },
        {
          title: "Vision & Mission",
          description: "What drives us.",
          link: "/about/vision",
          icon: Award,
        },
        {
          title: "Leadership",
          description: "The Governing Council and Management.",
          link: "/about/leadership",
          icon: Users,
        },
        {
          title: "Accreditation",
          description: "Our recognized status.",
          link: "/about/accreditation",
          icon: Shield,
        },
      ],
    },
  ],
};

export const newsData = {
  hero: {
    title: "News & Media",
    highlight: "Latest",
    subtitle: "Stay updated with happenings around the university.",
    cta: { text: "Press Releases", link: "/about/press" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Categories",
      items: [
        {
          title: "Campus News",
          description: "Events and updates from campus.",
          icon: Newspaper,
        },
        {
          title: "Press Releases",
          description: "Official statements.",
          icon: FileText,
        },
        {
          title: "Gallery",
          description: "Photos and videos.",
          icon: Building2,
        },
      ],
    },
  ],
};

export const contactData = {
  hero: {
    title: "Contact Us",
    highlight: "Get in Touch",
    subtitle: "We are here to answer your questions and guide you.",
    cta: { text: "Support", link: "/support" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Channels",
      items: [
        {
          title: "General Inquiry",
          description: "info@unidel.edu.ng",
          icon: Phone,
        },
        {
          title: "Admissions",
          description: "admissions@unidel.edu.ng",
          icon: Users,
        },
        {
          title: "Locations",
          description: "Agbor, Delta State.",
          icon: MapPin,
        },
      ],
    },
  ],
};
