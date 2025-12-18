import React from "react";
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";

import MainLayout from "./layouts/MainLayout";
import HeroSection from "./pages/landing/Hero-section";
import Overview from "./pages/landing/Overview";
import SignIn from "./pages/auth/Sign-in";
import AdminSignIn from "./pages/auth/Admin-SignIn";
import AdminSignUp from "./pages/auth/Admin-SignUp";
import LecturerSignIn from "./pages/auth/Lecturer-SignIn";
import ForgotPassword from "./pages/auth/Forgot-password";
import ResetPassword from "./pages/auth/Reset-password";
// import Header from "./components/header/Header";
// import About from "./components/about/About";
// import Experience from "./components/experience/Experience";
// import Portfolio from "./components/portfolio/Portfolio";
// import Contact from "./components/contact/Contact";
// import PortfolioOverview from "./components/portfolio/PortfolioOverview";
// import TabbedForm from "./components/projects/TabbedForm";
// import Confirmation from "./auth/Confirmation";
// import SinglePortfolio from "./components/portfolio/SinglePortfolio";
// import { PortfolioProvider } from "./context/PortfolioContext";

// Scroll to hash component
// const ScrollToHash = () => {
//   const location = useLocation();

//   useEffect(() => {
//     // If there's a hash in the URL, scroll to that element
//     if (location.hash) {
//       const id = location.hash.substring(1); // Remove the # character
//       const element = document.getElementById(id);
//       if (element) {
//         element.scrollIntoView({ behavior: "smooth" });
//       }
//     } else {
//       // If no hash, scroll to top
//       window.scrollTo(0, 0);
//     }
//   }, [location]);

//   return null;
// };

// const ProtectedRoute = ({ children }) => {
//   const authData = JSON.parse(localStorage.getItem("authValid"));
//   const isAuthenticated = authData?.valid && Date.now() < authData.expiresAt;

//   return isAuthenticated ? children : <Navigate to="/auth" />;
// };

const App = () => {
  return (
    <Router basename="/">
      <Routes>
        {/* Auth routes rendered outside MainLayout (no header/footer) */}
        <Route path="/portal-signin" element={<SignIn />} />
        <Route path="/admin-signin" element={<AdminSignIn />} />
        <Route path="/admin-signup" element={<AdminSignUp />} />
        <Route path="/lecturer-signin" element={<LecturerSignIn />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Main layout wraps site pages (header/footer present) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<SectionsApp />} />
          {/* <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

const SectionsApp = () => {
  return (
    <div>
      {/* Sections with IDs for navigation */}
      <section id="home">
        <HeroSection />
      </section>
      <section id="about">
        <Overview />
      </section>
      {/* <section id="experience">
        <Experience />
      </section>
      <section id="portfolio">
        <Portfolio />
      </section>
      <section id="contact">
        <Contact />
      </section> */}
    </div>
  );
};

export default App;
