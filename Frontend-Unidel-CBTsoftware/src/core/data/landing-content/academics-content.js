import {
  BookOpen,
  GraduationCap,
  Users,
  Library,
  Calendar,
  Award,
  Globe,
  Building2,
  Microscope,
  FileText,
} from "lucide-react";

export const academicsHubData = {
  hero: {
    title: "Programs & Research",
    highlight: "World-Class",
    subtitle:
      "At UNIDEL, academic excellence is not just a goal, it's our tradition. Explore diverse disciplines, cutting-edge research, and programs designed to shape the future.",
    cta: { text: "Find a Program", link: "/academics/programs" },
  },
  sections: [
    {
      type: "rich-text",
      title: "Academic Excellence",
      content: [
        "The University of Delta (UNIDEL) offers a comprehensive range of academic programs designed to equip students with the knowledge, skills, and values needed to thrive in a rapidly evolving global landscape.",
        "Our curriculum fosters critical thinking, creativity, and innovation, ensuring that our graduates are not only job-ready but also capable of creating opportunities. From the sciences to the arts, our faculties are staffed by distinguished scholars and practitioners dedicated to mentorship and discovery.",
      ],
    },
    {
      type: "grid-cards",
      title: "Explore Our Offerings",
      items: [
        {
          title: "Undergraduate Programs",
          description: "Bachelor degrees across 50+ disciplines.",
          link: "/academics/programs",
          icon: BookOpen,
        },
        {
          title: "School of Postgraduate Studies",
          description: "Advanced Masters and PhD research programs.",
          link: "/academics/programs",
          icon: GraduationCap,
        },
        {
          title: "Academic Resources",
          description: "Libraries, labs, and digital learning tools.",
          link: "/academics/resources",
          icon: Library,
        },
        {
          title: "Faculties & Departments",
          description: "Meet our expert faculty members.",
          link: "/academics/departments",
          icon: Building2,
        },
      ],
    },
  ],
};

export const programsData = {
  hero: {
    title: "Academic Programs",
    highlight: "Diverse",
    subtitle:
      "Choose from over 80 undergraduate and postgraduate degree programs tailored to your career aspirations.",
    cta: { text: "Apply Now", link: "/apply" },
  },
  sections: [
    {
      type: "features-list",
      title: "Program Categories",
      items: [
        {
          title: "Undergraduate Degrees",
          description: "4-5 year Bachelor programs (B.Sc, B.A, B.Eng).",
        },
        {
          title: "Masters Degrees",
          description: "Professional and Academic Masters (M.Sc, M.A, MBA).",
        },
        {
          title: "Doctorate Degrees",
          description: "Research-intensive PhD programs.",
        },
        {
          title: "Diploma & Certificate",
          description: "Short-term professional development courses.",
        },
      ],
    },
    {
      type: "grid-cards",
      title: "Browse by Faculty",
      items: [
        {
          title: "Faculty of Science",
          description: "Computer Science, Microbiology, Physics...",
          link: "/academics/departments",
          icon: Microscope,
        },
        {
          title: "Faculty of Arts",
          description: "English, History, Theatre Arts...",
          link: "/academics/departments",
          icon: BookOpen,
        },
        {
          title: "Faculty of Engineering",
          description: "Civil, Mechanical, Electrical...",
          link: "/academics/departments",
          icon: Building2,
        },
        {
          title: "Faculty of Management",
          description: "Accounting, Banking, Business Admin...",
          link: "/academics/departments",
          icon: Users,
        },
      ],
    },
  ],
};

export const resourcesData = {
  hero: {
    title: "Resources",
    highlight: "Student",
    subtitle: "Tools and facilities to support your academic journey.",
    cta: { text: "Access Portal", link: "/portal-signin" },
  },
  sections: [
    {
      type: "grid-cards",
      title: "Academic Tools",
      items: [
        {
          title: "Academic Calendar",
          description: "Key dates, exams, and holidays.",
          link: "/academics/resources/calendar",
          icon: Calendar,
        },
        {
          title: "Digital Library",
          description: "Access thousands of journals and e-books.",
          link: "#",
          icon: Library,
        },
        {
          title: "Course Catalog",
          description: "Detailed guide to all courses offered.",
          link: "#",
          icon: BookOpen,
        },
        {
          title: "Study Guides",
          description: "Tips and materials for exam preparation.",
          link: "#",
          icon: FileText,
        },
      ],
    },
    {
      type: "documents-list",
      title: "Downloadable Materials",
      items: [
        { title: "Student Handbook 2025/2026", format: "PDF", size: "2.4 MB" },
        { title: "Examination Regulations", format: "PDF", size: "1.1 MB" },
        { title: "Project Writing Guide", format: "PDF", size: "850 KB" },
      ],
    },
  ],
};

export const departmentsData = {
  hero: {
    title: "Departments",
    highlight: "Faculties &",
    subtitle: "The academic powerhouses of UNIDEL.",
    cta: { text: "View Faculties", link: "#" },
  },
  sections: [
    {
      type: "rich-text",
      content: [
        "Our university is organized into several faculties, each housing specialized departments dedicated to specific fields of study. This structure ensures a focused delivery of curriculum and expert mentorship.",
      ],
    },
    {
      type: "grid-cards",
      title: "Key Faculties",
      items: [
        {
          title: "Faculty of Science",
          description: "Home to 8 departments including CS and Microbiology.",
          icon: Microscope,
        },
        {
          title: "Faculty of Engineering",
          description:
            "Driving innovation in Civil, Electrical and Mechanical Engineering.",
          icon: Building2,
        },
        {
          title: "Faculty of Education",
          description: "Training the next generation of teachers.",
          icon: Users,
        },
        {
          title: "Faculty of Law",
          description: "Upholding justice and legal excellence.",
          icon: Award,
        },
      ],
    },
  ],
};
