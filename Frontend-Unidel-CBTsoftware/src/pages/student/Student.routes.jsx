import React from "react";
import { Routes, Route } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";
import Overview from "./presentation/dashboard/Overview";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<NotAvailableYet />} />
      <Route path="dashboard/overview" element={<Overview />} />
      <Route path="dashboard/active" element={<NotAvailableYet />} />
      <Route path="dashboard/results" element={<NotAvailableYet />} />
      <Route path="dashboard/notices" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<NotAvailableYet />} />
      <Route path="courses/enrolled" element={<NotAvailableYet />} />
      <Route path="courses/materials" element={<NotAvailableYet />} />
      <Route path="courses/lecturers" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/upcoming" element={<NotAvailableYet />} />
      <Route path="exams/active" element={<NotAvailableYet />} />
      <Route path="exams/completed" element={<NotAvailableYet />} />
      <Route path="exams/history" element={<NotAvailableYet />} />

      {/* Results & Analytics */}
      <Route path="results" element={<NotAvailableYet />} />
      <Route path="results/all" element={<NotAvailableYet />} />
      <Route path="results/courses" element={<NotAvailableYet />} />
      <Route path="results/analytics" element={<NotAvailableYet />} />

      {/* Documents */}
      <Route path="documents" element={<NotAvailableYet />} />
      <Route path="documents/uploads" element={<NotAvailableYet />} />
      <Route path="documents/attachments" element={<NotAvailableYet />} />

      {/* Notifications */}
      <Route path="notifications" element={<NotAvailableYet />} />
      <Route path="notifications/reminders" element={<NotAvailableYet />} />
      <Route path="notifications/system" element={<NotAvailableYet />} />
      <Route path="notifications/announcements" element={<NotAvailableYet />} />

      {/* Support & Integrity */}
      <Route path="support" element={<NotAvailableYet />} />
      <Route path="support/integrity" element={<NotAvailableYet />} />
      <Route path="support/help" element={<NotAvailableYet />} />

      {/* Profile & Settings */}
      <Route path="profile" element={<NotAvailableYet />} />
      <Route path="profile/info" element={<NotAvailableYet />} />
      <Route path="profile/password" element={<NotAvailableYet />} />
      <Route path="profile/settings" element={<NotAvailableYet />} />

      {/* Logout */}
      <Route path="logout" element={<NotAvailableYet />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
