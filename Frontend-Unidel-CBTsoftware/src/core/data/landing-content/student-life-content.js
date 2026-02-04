import {
  MapPin,
  Home,
  Coffee,
  Building2,
  Users,
  PartyPopper,
  Award,
  Globe,
  HelpCircle,
  Briefcase,
} from "lucide-react";

export const studentLifeHubData = {
  hero: {
    title: "Student Life",
    highlight: "Vibrant",
    subtitle:
      "University is more than just lectures. Discover a community where you can grow, lead, and explore your passions.",
    cta: { text: "Campus Tour", link: "/student-life/campus" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Life on Campus",
      items: [
        {
          title: "Campus Facilities",
          description: "Modern lecture halls, labs, and recreation centers.",
          link: "/student-life/campus",
          icon: MapPin,
        },
        {
          title: "Housing",
          description: "Safe and comfortable hostels.",
          link: "/student-life/housing",
          icon: Home,
        },
        {
          title: "Dining",
          description: "Cafeterias offering local and continental dishes.",
          link: "#",
          icon: Coffee,
        },
        {
          title: "Clubs & Societies",
          description: "Join over 20+ student organizations.",
          link: "/student-life/organizations",
          icon: Users,
        },
      ],
    },
    {
      type: "rich-text",
      title: "A Community of Excellence",
      content: [
        "At UNIDEL, we believe in holistic development. Our campus is buzzing with activities ranging from academic debates to cultural festivals, sports competitions, and leadership summits.",
        "We are committed to providing a safe, inclusive, and stimulating environment for all students.",
      ],
    },
  ],
};

export const campusData = {
  hero: {
    title: "Our Campus",
    highlight: "Agbor",
    subtitle:
      "Located in the heart of Delta State, our main campus combines serene nature with modern architecture.",
    cta: { text: "Virtual Map", link: "#" },
  },
  sections: [
    {
      type: "features-list",
      title: "Key Landmarks",
      items: [
        {
          title: "The Senate Building",
          description: "The administrative hub of the university.",
        },
        {
          title: "University Library",
          description: "A multi-story complex with digital resource centers.",
        },
        {
          title: "Sports Complex",
          description: "Football pitch, tennis courts, and indoor gym.",
        },
        {
          title: "Innovation Hub",
          description: "Tech workspace for student entrepreneurs.",
        },
      ],
    },
  ],
};

export const organizationsData = {
  hero: {
    title: "Organizations",
    highlight: "Student",
    subtitle: "Lead, serve, and network through our student bodies.",
    cta: { text: "Register Club", link: "#" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Active Bodies",
      items: [
        {
          title: "Student Union Govt",
          description: "The official representative body of students.",
          icon: Users,
        },
        {
          title: "Press Club",
          description: "Campus journalism and media.",
          icon: Globe,
        },
        {
          title: "MSSN / FCS",
          description: "Religious fellowships.",
          icon: Users,
        },
        {
          title: "Tech Community",
          description: "Google DSC and other tech groups.",
          icon: Globe,
        },
      ],
    },
  ],
};
