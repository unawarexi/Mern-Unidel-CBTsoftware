import React from "react";
import { Routes, Route } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";

// Main user routes based on UserLeftContainer menuItems
export default function LecturerRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<NotAvailableYet />} />
      <Route path="dashboard/courses" element={<NotAvailableYet />} />
      <Route path="dashboard/exams" element={<NotAvailableYet />} />
      <Route path="dashboard/submissions" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<NotAvailableYet />} />
      <Route path="courses/assigned" element={<NotAvailableYet />} />
      <Route path="courses/department" element={<NotAvailableYet />} />

      {/* Question Bank */}
      <Route path="questions" element={<NotAvailableYet />} />
      <Route path="questions/manage" element={<NotAvailableYet />} />
      <Route path="questions/types" element={<NotAvailableYet />} />
      <Route path="questions/import-export" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/create" element={<NotAvailableYet />} />
      <Route path="exams/schedule" element={<NotAvailableYet />} />
      <Route path="exams/manage" element={<NotAvailableYet />} />

      {/* Submissions */}
      <Route path="submissions" element={<NotAvailableYet />} />
      <Route path="submissions/attempts" element={<NotAvailableYet />} />
      <Route path="submissions/auto-graded" element={<NotAvailableYet />} />
      <Route path="submissions/manual" element={<NotAvailableYet />} />

      {/* Reports */}
      <Route path="reports" element={<NotAvailableYet />} />
      <Route path="reports/performance" element={<NotAvailableYet />} />
      <Route path="reports/distribution" element={<NotAvailableYet />} />

      {/* Monitoring */}
      <Route path="monitoring" element={<NotAvailableYet />} />
      <Route path="monitoring/live" element={<NotAvailableYet />} />
      <Route path="monitoring/integrity" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<NotAvailableYet />} />
      <Route path="profile/settings" element={<NotAvailableYet />} />
      <Route path="profile/password" element={<NotAvailableYet />} />


      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
