import { lazy } from "react";

// Lazy load ALL landing sections for smooth performance
export const HeroSection = lazy(() => import("./Hero-section"));
export const Overview = lazy(() => import("./Overview"));
export const HowItWorks = lazy(() => import("./How-it-works"));
export const Faculties = lazy(() => import("./Faculties"));
export const Courses = lazy(() => import("./Courses"));
export const Gallery = lazy(() => import("./Gallery"));
export const Team = lazy(() => import("./Team"));
export const Pricing = lazy(() => import("./Pricing"));
export const Contact = lazy(() => import("./Contact"));
export const Programs = lazy(() => import("./Programs"));
export const About = lazy(() => import("./About"));
export const Departments = lazy(() => import("./Departments"));
export const Leadership = lazy(() => import("./Leadership"));
export const ApplyNow = lazy(() => import("./ApplyNow"));
export const Fees = lazy(() => import("./Fees"));
export const Scholarships = lazy(() => import("./Scholarships"));
export const Campus = lazy(() => import("./Campus"));
export const News = lazy(() => import("./News"));
export const HelpCenter = lazy(() => import("./HelpCenter"));
export const Research = lazy(() => import("./Research"));
export const Library = lazy(() => import("./Library"));
export const Events = lazy(() => import("./Events"));
export const Careers = lazy(() => import("./Careers"));
export const PrivacyPolicy = lazy(() => import("./PrivacyPolicy"));
export const TermsOfService = lazy(() => import("./TermsOfService"));
