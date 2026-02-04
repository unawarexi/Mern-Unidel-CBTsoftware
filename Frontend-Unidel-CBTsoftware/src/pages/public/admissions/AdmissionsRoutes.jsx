import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageTemplate from "../templates/LandingPageTemplate";
import {
  admissionsHubData,
  requirementsData,
  feesData,
  scholarshipsData,
} from "../../../core/data/landing-content/admissions-content";
import NotFound from "../../NotFound";

const AdmissionsRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPageTemplate data={admissionsHubData} />}
      />
      <Route
        path="/requirements"
        element={<LandingPageTemplate data={requirementsData} />}
      />
      <Route path="/fees" element={<LandingPageTemplate data={feesData} />} />
      <Route
        path="/scholarships"
        element={<LandingPageTemplate data={scholarshipsData} />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AdmissionsRoutes;
