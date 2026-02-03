import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Dashboard
import Overview from "./dashboard/Overview";
import Results from "./dashboard/Results";
import Notices from "./dashboard/Notices";

// Courses
import Enrollments from "./courses/Enrollments";
import Materials from "./courses/Materials";
import Lecturers from "./courses/Lecturers";

// Exams
import ActiveExams from "./exams/Active";
import UpcomingExams from "./exams/Upcoming";
import TakeExam from "./exams/TakeExam";
import CompletedExams from "./exams/Completed";
import ExamHistory from "./exams/History";

// Results
import AllResults from "./results/AllResults";
import CourseResults from "./results/CourseResults";
import PerformanceAnalytics from "./results/Analytics";

// Documents
import DocumentUploads from "./documents/Uploads";
import ExamAttachments from "./documents/Attachments";

// Notifications
import Reminders from "./notifications/Reminders";
import SystemMessages from "./notifications/SystemMessages";
import Announcements from "./notifications/Announcements";

// Support
import IntegrityPolicy from "./support/Integrity";
import HelpSupport from "./support/Help";
import SupportPage from "../shared/SupportPage";

// Profile
import AccountInfo from "./profile/AccountInfo";
import ChangePassword from "./profile/ChangePassword";
import ProfileSettings from "./profile/Settings";

export default function StudentRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/student/dashboard" replace />} />

      {/* Dashboard */}
      <Route path="dashboard" element={<Overview />} />
      <Route path="dashboard/overview" element={<Overview />} />
      <Route path="dashboard/active" element={<ActiveExams />} />
      <Route path="dashboard/results" element={<Results />} />
      <Route path="dashboard/notices" element={<Notices />} />

      {/* Courses */}
      <Route
        path="courses"
        element={<Navigate to="/student/courses/enrolled" replace />}
      />
      <Route path="courses/enrolled" element={<Enrollments />} />
      <Route path="courses/materials" element={<Materials />} />
      <Route path="courses/lecturers" element={<Lecturers />} />

      {/* Exams */}
      <Route
        path="exams"
        element={<Navigate to="/student/exams/active" replace />}
      />
      <Route path="exams/upcoming" element={<UpcomingExams />} />
      <Route path="exams/active" element={<ActiveExams />} />
      <Route path="exams/take/:examId" element={<TakeExam />} />
      <Route path="exams/completed" element={<CompletedExams />} />
      <Route path="exams/history" element={<ExamHistory />} />

      {/* Results & Analytics */}
      <Route
        path="results"
        element={<Navigate to="/student/results/all" replace />}
      />
      <Route path="results/all" element={<AllResults />} />
      <Route path="results/courses" element={<CourseResults />} />
      <Route path="results/analytics" element={<PerformanceAnalytics />} />

      {/* Documents */}
      <Route
        path="documents"
        element={<Navigate to="/student/documents/uploads" replace />}
      />
      <Route path="documents/uploads" element={<DocumentUploads />} />
      <Route path="documents/attachments" element={<ExamAttachments />} />

      {/* Notifications */}
      <Route
        path="notifications"
        element={<Navigate to="/student/notifications/reminders" replace />}
      />
      <Route path="notifications/reminders" element={<Reminders />} />
      <Route path="notifications/system" element={<SystemMessages />} />
      <Route path="notifications/announcements" element={<Announcements />} />

      {/* Support & Integrity */}
      <Route
        path="support"
        element={<Navigate to="/student/support/integrity" replace />}
      />
      <Route path="support/integrity" element={<IntegrityPolicy />} />
      <Route path="support/help" element={<HelpSupport />} />
      <Route path="support/tickets" element={<SupportPage />} />

      {/* Profile & Settings */}
      <Route
        path="profile"
        element={<Navigate to="/student/profile/info" replace />}
      />
      <Route path="profile/info" element={<AccountInfo />} />
      <Route path="profile/password" element={<ChangePassword />} />
      <Route path="profile/settings" element={<ProfileSettings />} />

      {/* Logout handled by parent or specific component if needed */}
      <Route path="logout" element={<Navigate to="/auth/sign-in" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
    </Routes>
  );
}
