// Hero Section Data
export const heroFeatures = [
  { icon: "Clock", text: "Flexible Timing" },
  { icon: "BookOpen", text: "Comprehensive Coverage" },
  { icon: "Award", text: "Instant Results" },
];

export const heroFloatingBadges = [
  { name: "John Doe", color: "primary", position: "top-[15%] right-[8%]" },
  { name: "Mike Taylor", subtitle: "Top Student", color: "red", position: "top-[45%] right-[5%]" },
  { name: "Angela Taylor", color: "primary", position: "bottom-[20%] right-[10%]" },
];

export const heroStats = [
  { value: "10,000+", label: "Students Tested" },
  { value: "50+", label: "Departments" },
  { value: "99.9%", label: "Uptime" },
];

// Overview Section Data
export const overviewValues = [
  {
    icon: "Shield",
    title: "Secure & Reliable",
    description: "Bank-grade encryption ensures exam integrity and prevents malpractice with real-time monitoring.",
    color: "orange",
  },
  {
    icon: "Clock",
    title: "Instant Results",
    description: "Automated grading provides immediate feedback, reducing wait times from weeks to minutes.",
    color: "blue",
  },
  {
    icon: "BarChart3",
    title: "Data-Driven Insights",
    description: "Comprehensive analytics help track performance trends and identify areas for improvement.",
    color: "green",
  },
  {
    icon: "Users",
    title: "User-Friendly Interface",
    description: "Intuitive design ensures smooth navigation for all users, regardless of technical expertise.",
    color: "purple",
  },
];

export const overviewMetrics = [
  { label: "Students Served", value: "25,000+", icon: "Users" },
  { label: "Exams Conducted", value: "500+", icon: "Award" },
  { label: "Success Rate", value: "94%", icon: "TrendingUp" },
  { label: "Uptime Guarantee", value: "99.9%", icon: "Target" },
];

// Overview Charts Data
export const examSuccessData = [
  { name: "Passed", value: 94, color: "#f97316" },
  { name: "Failed", value: 6, color: "#e5e7eb" },
];

export const monthlyPerformanceData = [
  { month: "Jan", exams: 45, success: 92 },
  { month: "Feb", exams: 52, success: 93 },
  { month: "Mar", exams: 48, success: 91 },
  { month: "Apr", exams: 55, success: 94 },
  { month: "May", exams: 60, success: 95 },
  { month: "Jun", exams: 58, success: 94 },
];

export const departmentData = [
  { dept: "Engineering", students: 320 },
  { dept: "Sciences", students: 280 },
  { dept: "Arts", students: 240 },
  { dept: "Management", students: 200 },
];

export const transparencyHighlights = [
  { label: "Real-Time Monitoring", value: "100% of exams tracked live" },
  { label: "Automated Grading", value: "Zero human bias in scoring" },
  { label: "Secure Platform", value: "Bank-grade encryption" },
  { label: "Instant Results", value: "Available within minutes" },
  { label: "Question Randomization", value: "Prevents exam malpractice" },
  { label: "Audit Trail", value: "Complete exam history logs" },
];

// How It Works Data
export const roles = [
  { id: "admin", name: "Administrator", icon: "Shield", color: "text-primary-600", bg: "bg-primary-50" },
  { id: "lecturer", name: "Lecturer", icon: "BookOpen", color: "text-accent-600", bg: "bg-accent-50" },
  { id: "student", name: "Student", icon: "GraduationCap", color: "text-gray-600", bg: "bg-gray-50" },
];

export const workflows = {
  admin: [
    {
      step: 1,
      title: "System Setup",
      description: "Configure platform settings, academic sessions, and security parameters",
      icon: "Settings",
      color: "primary"
    },
    {
      step: 2,
      title: "User Management",
      description: "Create and manage accounts for lecturers and students across departments",
      icon: "UserPlus",
      color: "primary"
    },
    {
      step: 3,
      title: "Course Assignment",
      description: "Assign courses to lecturers and enroll students in respective programs",
      icon: "ClipboardList",
      color: "primary"
    },
    {
      step: 4,
      title: "Monitor & Report",
      description: "Track system usage, generate reports, and ensure platform integrity",
      icon: "BarChart3",
      color: "primary"
    }
  ],
  lecturer: [
    {
      step: 1,
      title: "Question Bank",
      description: "Create and organize comprehensive question banks for your courses",
      icon: "FileText",
      color: "accent"
    },
    {
      step: 2,
      title: "Exam Setup",
      description: "Schedule exams, set duration, and configure assessment parameters",
      icon: "Calendar",
      color: "accent"
    },
    {
      step: 3,
      title: "Upload Questions",
      description: "Import questions, set marking schemes, and randomize question order",
      icon: "Upload",
      color: "accent"
    },
    {
      step: 4,
      title: "Review Results",
      description: "Access detailed analytics, review student performance, and export reports",
      icon: "BarChart3",
      color: "accent"
    }
  ],
  student: [
    {
      step: 1,
      title: "Register & Login",
      description: "Access your personalized dashboard using your student credentials",
      icon: "UserPlus",
      color: "gray"
    },
    {
      step: 2,
      title: "View Schedule",
      description: "Check upcoming exams, exam duration, and course information",
      icon: "Calendar",
      color: "gray"
    },
    {
      step: 3,
      title: "Take Exam",
      description: "Complete your assessment in a secure, monitored environment",
      icon: "PenTool",
      color: "gray"
    },
    {
      step: 4,
      title: "Instant Results",
      description: "Receive immediate feedback and view detailed performance analytics",
      icon: "Award",
      color: "gray"
    }
  ]
};

export const platformFeatures = [
  { icon: "CheckCircle", text: "Real-time Monitoring", color: "primary" },
  { icon: "Shield", text: "Secure Environment", color: "accent" },
  { icon: "Users", text: "Multi-user Support", color: "gray" },
  { icon: "BarChart3", text: "Advanced Analytics", color: "primary" },
];

// Courses Data
export const courseCategories = [
  {
    name: "Engineering",
    icon: "Wrench",
    courses: [
      { code: "ENG 101", name: "Introduction to Engineering", students: 320 },
      { code: "ENG 201", name: "Circuit Analysis", students: 280 },
      { code: "ENG 301", name: "Digital Systems", students: 250 },
      { code: "ENG 401", name: "Control Systems", students: 200 }
    ],
    color: "orange"
  },
  {
    name: "Sciences",
    icon: "FlaskConical",
    courses: [
      { code: "PHY 101", name: "General Physics", students: 350 },
      { code: "CHM 101", name: "General Chemistry", students: 320 },
      { code: "BIO 101", name: "General Biology", students: 300 },
      { code: "MTH 101", name: "Calculus I", students: 400 }
    ],
    color: "blue"
  },
  {
    name: "Social Sciences",
    icon: "Users2",
    courses: [
      { code: "ECO 101", name: "Principles of Economics", students: 280 },
      { code: "PSY 101", name: "Introduction to Psychology", students: 250 },
      { code: "SOC 101", name: "Introduction to Sociology", students: 220 },
      { code: "POL 101", name: "Political Science", students: 200 }
    ],
    color: "gray"
  },
  {
    name: "Management",
    icon: "Briefcase",
    courses: [
      { code: "MGT 101", name: "Principles of Management", students: 300 },
      { code: "ACC 101", name: "Financial Accounting", students: 280 },
      { code: "MKT 101", name: "Marketing Fundamentals", students: 260 },
      { code: "FIN 101", name: "Business Finance", students: 240 }
    ],
    color: "orange"
  }
];

export const courseStats = [
  { icon: "BookOpen", label: "Total Courses", value: "500+" },
  { icon: "Users", label: "Enrolled Students", value: "16,000+" },
  { icon: "Clock", label: "Avg. Course Duration", value: "1 Semester" },
  { icon: "CheckCircle", label: "Success Rate", value: "94%" },
];

// Faculties Data
export const faculties = [
  {
    name: "Engineering",
    icon: "Calculator",
    departments: 8,
    students: 3200,
    color: "orange",
    description: "Innovative programs in mechanical, electrical, civil, and computer engineering"
  },
  {
    name: "Sciences",
    icon: "Beaker",
    departments: 6,
    students: 2800,
    color: "blue",
    description: "Physics, chemistry, biology, and environmental science programs"
  },
  {
    name: "Arts & Humanities",
    icon: "Palette",
    departments: 7,
    students: 2400,
    color: "gray",
    description: "Literature, languages, history, and creative arts disciplines"
  },
  {
    name: "Management",
    icon: "Briefcase",
    departments: 5,
    students: 2000,
    color: "orange",
    description: "Business administration, accounting, and entrepreneurship programs"
  },
  {
    name: "Social Sciences",
    icon: "Users",
    departments: 6,
    students: 1800,
    color: "blue",
    description: "Psychology, sociology, political science, and economics"
  },
  {
    name: "Education",
    icon: "BookOpen",
    departments: 4,
    students: 1500,
    color: "gray",
    description: "Teacher training and educational leadership programs"
  },
  {
    name: "Law",
    icon: "Building",
    departments: 3,
    students: 1200,
    color: "orange",
    description: "Legal studies, jurisprudence, and international law"
  },
  {
    name: "Environmental Studies",
    icon: "Globe",
    departments: 4,
    students: 1100,
    color: "blue",
    description: "Sustainability, conservation, and environmental management"
  }
];

export const facultyStats = [
  { label: "Total Faculties", value: "8" },
  { label: "Departments", value: "43+" },
  { label: "Students Enrolled", value: "16,000+" },
  { label: "Academic Programs", value: "150+" }
];

// Team Data
export const teamMembers = [
  {
    name: "Prof. Emmanuel Obi",
    role: "Chief Technology Officer",
    department: "Computer Science",
    image: "https://ui-avatars.com/api/?name=Emmanuel+Obi&size=200&background=f97316&color=fff"
  },
  {
    name: "Dr. Sarah Adeleke",
    role: "Academic Director",
    department: "Educational Technology",
    image: "https://ui-avatars.com/api/?name=Sarah+Adeleke&size=200&background=3b82f6&color=fff"
  },
  {
    name: "Engr. Michael Eze",
    role: "Platform Architect",
    department: "Software Engineering",
    image: "https://ui-avatars.com/api/?name=Michael+Eze&size=200&background=6b7280&color=fff"
  },
  {
    name: "Dr. Amina Hassan",
    role: "Assessment Specialist",
    department: "Measurement & Evaluation",
    image: "https://ui-avatars.com/api/?name=Amina+Hassan&size=200&background=f97316&color=fff"
  },
  {
    name: "Mr. David Okafor",
    role: "Security Lead",
    department: "Cybersecurity",
    image: "https://ui-avatars.com/api/?name=David+Okafor&size=200&background=3b82f6&color=fff"
  },
  {
    name: "Mrs. Grace Nwankwo",
    role: "User Experience Lead",
    department: "Design & Innovation",
    image: "https://ui-avatars.com/api/?name=Grace+Nwankwo&size=200&background=6b7280&color=fff"
  },
  {
    name: "Prof. Chidi Okeke",
    role: "Quality Assurance",
    department: "Educational Standards",
    image: "https://ui-avatars.com/api/?name=Chidi+Okeke&size=200&background=f97316&color=fff"
  },
  {
    name: "Dr. Fatima Bello",
    role: "Research Lead",
    department: "Data Analytics",
    image: "https://ui-avatars.com/api/?name=Fatima+Bello&size=200&background=3b82f6&color=fff"
  },
  {
    name: "Engr. James Okonkwo",
    role: "Infrastructure Manager",
    department: "Cloud Services",
    image: "https://ui-avatars.com/api/?name=James+Okonkwo&size=200&background=6b7280&color=fff"
  }
];

// Pricing Data
export const pricingPlans = [
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

// Gallery Data
export const galleryImages = [
  { src: "heroImage", title: "Modern Campus", category: "Campus Life" },
  { src: "studentImage", title: "Student Excellence", category: "Students" },
  { src: "lecturerImage", title: "Expert Faculty", category: "Faculty" },
  { src: "adminImage", title: "Administrative Excellence", category: "Administration" },
  { src: "heroImage", title: "Learning Spaces", category: "Facilities" },
  { src: "studentImage", title: "Collaborative Learning", category: "Activities" },
];

// Contact Data
export const contactInfo = [
  {
    icon: "MapPin",
    title: "Visit Us",
    details: ["University of Delta", "Abraka, Delta State", "Nigeria"],
    color: "orange"
  },
  {
    icon: "Phone",
    title: "Call Us",
    details: ["+234 (0) 800 123 4567", "+234 (0) 800 765 4321", "Mon - Fri, 8AM - 5PM"],
    color: "blue"
  },
  {
    icon: "Mail",
    title: "Email Us",
    details: ["support@unidel.edu.ng", "cbt@unidel.edu.ng", "Response within 24hrs"],
    color: "gray"
  }
];

// Note: colorMap has been moved to src/core/theme/colors.js
