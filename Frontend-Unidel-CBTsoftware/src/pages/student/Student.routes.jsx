import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";
import Overview from "./presentation/dashboard/Student-overview";
import ActiveExams from "./presentation/dashboard/Active-exams";
import AnswerQuestions from "./presentation/dashboard/Answer-questions";
import CompletedExams from "./presentation/exams-assessments/Completed-exams";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route path="dashboard" element={<Overview />} />
      <Route path="dashboard/overview" element={<Overview />} />
      <Route path="dashboard/active" element={<ActiveExams />} />
      <Route path="dashboard/results" element={<NotAvailableYet />} />
      <Route path="dashboard/notices" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<Navigate to="/student/courses/enrolled" replace />} />
      <Route path="courses/enrolled" element={<NotAvailableYet />} />
      <Route path="courses/materials" element={<NotAvailableYet />} />
      <Route path="courses/lecturers" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<ActiveExams />} />
      <Route path="exams/upcoming" element={<NotAvailableYet />} />
      <Route path="exams/active" element={<ActiveExams />} />
      <Route path="exams/take/:examId" element={<AnswerQuestions />} />
      <Route path="exams/completed" element={<CompletedExams />} />
      <Route path="exams/history" element={<NotAvailableYet />} />

      {/* Results & Analytics */}
      <Route path="results" element={<Navigate to="/student/results/all" replace />} />
      <Route path="results/all" element={<NotAvailableYet />} />
      <Route path="results/courses" element={<NotAvailableYet />} />
      <Route path="results/analytics" element={<NotAvailableYet />} />

      {/* Documents */}
      <Route path="documents" element={<Navigate to="/student/documents/uploads" replace />} />
      <Route path="documents/uploads" element={<NotAvailableYet />} />
      <Route path="documents/attachments" element={<NotAvailableYet />} />

      {/* Notifications */}
      <Route path="notifications" element={<Navigate to="/student/notifications/reminders" replace />} />
      <Route path="notifications/reminders" element={<NotAvailableYet />} />
      <Route path="notifications/system" element={<NotAvailableYet />} />
      <Route path="notifications/announcements" element={<NotAvailableYet />} />

      {/* Support & Integrity */}
      <Route path="support" element={<Navigate to="/student/support/integrity" replace />} />
      <Route path="support/integrity" element={<NotAvailableYet />} />
      <Route path="support/help" element={<NotAvailableYet />} />

      {/* Profile & Settings */}
      <Route path="profile" element={<Navigate to="/student/profile/info" replace />} />
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
