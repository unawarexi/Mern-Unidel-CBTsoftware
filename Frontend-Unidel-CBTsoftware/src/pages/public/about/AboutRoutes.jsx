import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageTemplate from "../templates/LandingPageTemplate";
import {
  aboutHubData,
  newsData,
  contactData,
} from "../../../core/data/landing-content/about-content";
import NotFound from "../../NotFound";

const AboutRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPageTemplate data={aboutHubData} />} />
      <Route path="/news" element={<LandingPageTemplate data={newsData} />} />
      <Route
        path="/contact"
        element={<LandingPageTemplate data={contactData} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AboutRoutes;
