import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPageTemplate from "../templates/LandingPageTemplate";
import {
  studentLifeHubData,
  campusData,
  organizationsData,
} from "../../../core/data/landing-content/student-life-content";
import NotFound from "../../NotFound";

const StudentLifeRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPageTemplate data={studentLifeHubData} />}
      />
      <Route
        path="/campus"
        element={<LandingPageTemplate data={campusData} />}
      />
      <Route
        path="/organizations"
        element={<LandingPageTemplate data={organizationsData} />}
      />
      <Route
        path="/housing"
        element={<LandingPageTemplate data={campusData} />}
      />{" "}
      {/* Reuse campus data for housing for now */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default StudentLifeRoutes;
