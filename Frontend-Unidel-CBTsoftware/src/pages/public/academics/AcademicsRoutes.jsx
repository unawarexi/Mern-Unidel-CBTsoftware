import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageTemplate from "../templates/LandingPageTemplate";
import {
  academicsHubData,
  programsData,
  resourcesData,
  departmentsData,
} from "../../../core/data/landing-content/academics-content";
import NotFound from "../../NotFound";

const AcademicsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPageTemplate data={academicsHubData} />}
      />
      <Route
        path="/programs"
        element={<LandingPageTemplate data={programsData} />}
      />
      <Route
        path="/resources"
        element={<LandingPageTemplate data={resourcesData} />}
      />
      <Route
        path="/departments"
        element={<LandingPageTemplate data={departmentsData} />}
      />
      {/* Fallback for sub-routes not explicitly defined */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AcademicsRoutes;
