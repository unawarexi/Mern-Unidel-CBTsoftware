import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageTemplate from "../templates/LandingPageTemplate";
import { researchHubData } from "../../../core/data/landing-content/research-content";
import NotFound from "../../NotFound";

const ResearchRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPageTemplate data={researchHubData} />}
      />
      <Route
        path="/centers"
        element={<LandingPageTemplate data={researchHubData} />}
      />{" "}
      {/* Reuse for now */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default ResearchRoutes;
