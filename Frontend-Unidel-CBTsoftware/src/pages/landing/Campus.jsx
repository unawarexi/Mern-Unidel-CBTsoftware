/**
 * Campus Page
 * Campus tour and facilities information
 */
import React from "react";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/theme-store";
import { cn } from "../../core/lib/cn";
import { PageHeader, Section } from "../../containers/PageLayout";
import {
  InfoGrid,
  StatsBanner,
  CTABanner,
} from "../../components/landing/LandingComponents";
import {
  MapPin,
  Building2,
  BookOpen,
  FlaskConical,
  Utensils,
  Coffee,
  Home,
  Dumbbell,
  Stethoscope,
  Wifi,
  Car,
  Trees,
  GraduationCap,
  Users,
} from "lucide-react";

const campusFacilities = [
  {
    icon: BookOpen,
    title: "University Library",
    description:
      "A modern 5-floor library housing over 500,000 volumes, digital archives, quiet study zones, and 24/7 access during exam periods.",
  },
  {
    icon: FlaskConical,
    title: "Science Complex",
    description:
      "State-of-the-art laboratories for Physics, Chemistry, Biology, and specialized research. Equipped with latest scientific instruments.",
  },
  {
    icon: Building2,
    title: "Lecture Theatres",
    description:
      "15 air-conditioned lecture theatres with capacities ranging from 100 to 2,000 seats, all equipped with modern audio-visual systems.",
  },
  {
    icon: Dumbbell,
    title: "Sports Complex",
    description:
      "Olympic-sized swimming pool, gymnasium, football stadium, basketball courts, tennis courts, and indoor sports hall.",
  },
  {
    icon: Stethoscope,
    title: "University Health Center",
    description:
      "24-hour medical facility with qualified doctors, nurses, pharmacy, dental clinic, and ambulance service for emergencies.",
  },
  {
    icon: Wifi,
    title: "ICT Center",
    description:
      "High-speed internet coverage across campus, computer labs with 500+ workstations, and dedicated CBT examination centers.",
  },
  {
    icon: Utensils,
    title: "Cafeterias & Food Court",
    description:
      "Multiple dining options including a main cafeteria, food court with diverse cuisines, and refreshment spots across campus.",
  },
  {
    icon: Home,
    title: "Student Hostels",
    description:
      "Well-maintained hostels for male and female students with modern amenities, security, and proximity to academic buildings.",
  },
  {
    icon: Car,
    title: "Transportation",
    description:
      "Campus shuttle service, designated parking areas, and easy access to public transportation links to major cities.",
  },
];

const campusStats = [
  { value: "500+", label: "Acres of Land" },
  { value: "120+", label: "Buildings" },
  { value: "15", label: "Lecture Theatres" },
  { value: "8", label: "Hostels" },
];

const virtualTourHighlights = [
  {
    title: "Main Gate & Administration",
    description:
      "The iconic university entrance and the Senate Building, home to the administration.",
    image: "/images/campus/main-gate.jpg",
  },
  {
    title: "Academic Area",
    description:
      "Faculty buildings, lecture theatres, and the central library complex.",
    image: "/images/campus/academic.jpg",
  },
  {
    title: "Student Village",
    description:
      "Hostels, cafeterias, and recreational facilities for student life.",
    image: "/images/campus/village.jpg",
  },
  {
    title: "Sports Complex",
    description:
      "Athletic facilities including the stadium, swimming pool, and courts.",
    image: "/images/campus/sports.jpg",
  },
];

const Campus = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <>
      <PageHeader
        subtitle="Explore UNIDEL"
        title="Our Campus"
        description="Spread across 500 acres of lush greenery, the UNIDEL campus is designed to inspire learning, foster community, and provide world-class facilities for academic and personal development."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Student Life", href: "#" },
          { label: "Campus" },
        ]}
      />

      <StatsBanner stats={campusStats} background="gradient" />

      {/* Virtual Tour Section */}
      <Section
        title="Take a Virtual Tour"
        subtitle="Explore Our Campus"
        description="Can't visit in person? Explore our campus from the comfort of your home with our interactive virtual tour."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {virtualTourHighlights.map((highlight, idx) => (
            <div
              key={idx}
              className={cn(
                "group rounded-xl overflow-hidden border transition-all hover:scale-[1.02]",
                isDarkMode
                  ? "bg-slate-900 border-slate-700"
                  : "bg-white border-gray-200",
              )}
            >
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-orange-200 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Trees
                    className={cn(
                      "w-16 h-16",
                      isDarkMode ? "text-orange-400" : "text-orange-500",
                    )}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-sm font-medium">
                    View Tour →
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3
                  className={cn(
                    "font-bold mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  {highlight.title}
                </h3>
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  {highlight.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <a
            href="https://tour.unidel.edu.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
          >
            Launch Full Virtual Tour
          </a>
        </div>
      </Section>

      {/* Campus Facilities */}
      <Section
        title="Campus Facilities"
        subtitle="What We Offer"
        description="Our campus is equipped with everything you need for a fulfilling academic experience."
        background="alt"
      >
        <InfoGrid items={campusFacilities} columns={3} />
      </Section>

      {/* Location */}
      <Section title="Location & Directions" subtitle="Find Us">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="flex items-start gap-4 mb-6">
              <MapPin
                className={cn(
                  "w-6 h-6 flex-shrink-0 mt-1",
                  isDarkMode ? "text-orange-400" : "text-orange-600",
                )}
              />
              <div>
                <h4
                  className={cn(
                    "font-bold mb-1",
                    isDarkMode ? "text-white" : "text-gray-900",
                  )}
                >
                  Main Campus
                </h4>
                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    isDarkMode ? "text-gray-400" : "text-gray-600",
                  )}
                >
                  University of Delta
                  <br />
                  Oleh-Isoko Road, Oleh
                  <br />
                  Delta State, Nigeria
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h4
                className={cn(
                  "font-bold",
                  isDarkMode ? "text-white" : "text-gray-900",
                )}
              >
                Getting Here
              </h4>
              <div
                className={cn(
                  "text-sm leading-relaxed space-y-3",
                  isDarkMode ? "text-gray-400" : "text-gray-600",
                )}
              >
                <p>
                  <strong>By Air:</strong> Fly into Benin City Airport (BNI) or
                  Warri Airport. From there, take a taxi or bus to campus
                  (approximately 1-2 hours).
                </p>
                <p>
                  <strong>By Road:</strong> The campus is accessible via the
                  Oleh-Isoko expressway. Look for the UNIDEL signage at the main
                  junction.
                </p>
                <p>
                  <strong>By Bus:</strong> Commercial buses run regularly from
                  major cities including Lagos, Benin City, and Port Harcourt to
                  Oleh.
                </p>
              </div>
            </div>
          </div>
          <div
            className={cn(
              "aspect-video rounded-xl overflow-hidden border",
              isDarkMode
                ? "bg-slate-900 border-slate-700"
                : "bg-gray-100 border-gray-200",
            )}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin
                  className={cn(
                    "w-12 h-12 mx-auto mb-2",
                    isDarkMode ? "text-gray-600" : "text-gray-400",
                  )}
                />
                <p
                  className={cn(
                    "text-sm",
                    isDarkMode ? "text-gray-500" : "text-gray-500",
                  )}
                >
                  Interactive Map
                </p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Schedule a Visit */}
      <Section background="alt">
        <div
          className={cn(
            "p-8 rounded-2xl border text-center",
            isDarkMode
              ? "bg-slate-900 border-slate-700"
              : "bg-white border-gray-200",
          )}
        >
          <GraduationCap
            className={cn(
              "w-12 h-12 mx-auto mb-4",
              isDarkMode ? "text-orange-400" : "text-orange-600",
            )}
          />
          <h3
            className={cn(
              "text-xl font-bold mb-2",
              isDarkMode ? "text-white" : "text-gray-900",
            )}
          >
            Schedule a Campus Visit
          </h3>
          <p
            className={cn(
              "text-sm mb-6 max-w-lg mx-auto",
              isDarkMode ? "text-gray-400" : "text-gray-600",
            )}
          >
            Nothing beats experiencing our campus in person. Schedule a guided
            tour with our admissions team and see firsthand why UNIDEL is the
            right choice for you.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact?topic=campus-visit"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all"
            >
              Schedule Visit
            </Link>
            <a
              href="tel:+2348012345680"
              className={cn(
                "inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold border transition-all",
                isDarkMode
                  ? "bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                  : "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200",
              )}
            >
              Call Us
            </a>
          </div>
        </div>
      </Section>

      <CTABanner
        title="Ready to Call UNIDEL Home?"
        description="Begin your application today and become part of our vibrant campus community."
        primaryAction={{ label: "Apply Now", href: "/apply" }}
        secondaryAction={{ label: "Explore Housing", href: "/housing" }}
      />
    </>
  );
};

export default Campus;
