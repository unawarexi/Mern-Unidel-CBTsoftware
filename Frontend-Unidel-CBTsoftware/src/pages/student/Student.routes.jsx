import React from "react";
import { Routes, Route } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<NotAvailableYet />} />
      <Route path="dashboard/overview" element={<NotAvailableYet />} />
      <Route path="dashboard/upcoming" element={<NotAvailableYet />} />
      <Route path="dashboard/active" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<NotAvailableYet />} />
      <Route path="courses/enrolled" element={<NotAvailableYet />} />
      <Route path="courses/details" element={<NotAvailableYet />} />
      <Route path="courses/exams" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/available" element={<NotAvailableYet />} />
      <Route path="exams/completed" element={<NotAvailableYet />} />
      <Route path="exams/history" element={<NotAvailableYet />} />

      {/* Results */}
      <Route path="results" element={<NotAvailableYet />} />
      <Route path="results/all" element={<NotAvailableYet />} />
      <Route path="results/courses" element={<NotAvailableYet />} />
      <Route path="results/breakdown" element={<NotAvailableYet />} />

      {/* Notifications */}
      <Route path="notifications" element={<NotAvailableYet />} />
      <Route path="notifications/reminders" element={<NotAvailableYet />} />
      <Route path="notifications/system" element={<NotAvailableYet />} />
      <Route path="notifications/announcements" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<NotAvailableYet />} />
      <Route path="profile/info" element={<NotAvailableYet />} />
      <Route path="profile/password" element={<NotAvailableYet />} />
      <Route path="logout" element={<NotAvailableYet />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
