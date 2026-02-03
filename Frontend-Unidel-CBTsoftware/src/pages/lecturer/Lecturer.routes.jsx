import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";

// Dashboard pages
import LecturerOverview from "./dashboard/Overview";
import DashboardExams from "./dashboard/Exams";
import DashboardResults from "./dashboard/Results";
import DashboardNotices from "./dashboard/Notices";

// Course pages
import AssignedCourses from "./courses/Assigned-courses";
import DepartmentLevel from "./courses/Department-level";
import CourseMaterials from "./courses/Course-materials";
import UploadMaterials from "./courses/Upload-materials";
import StudentEnrollments from "./courses/Student-enrollments";

// Question bank pages
import CreateQuestions from "./questions/Create-questions";
import EditQuestions from "./questions/Edit-questions";
import ImportExport from "./questions/Import-export";
import QuestionTypes from "./questions/Question-types";
import UploadedDocs from "./questions/Uploaded-docs";
import Approval from "./questions/Approval";
import BulkUpload from "./questions/Bulk-upload";

// Exam pages
import CreateExam from "./exams/Create-exam";
import ScheduleExam from "./exams/Schedule-exam";
import ManageExams from "./exams/Manage-exams";
import ExamResults from "./exams/Results";
import ExamAnalytics from "./exams/Analytics";
import ExamAttachments from "./exams/Attachments";

// Submission pages
import SubmissionAttempts from "./submissions/Attempts";
import AutoGraded from "./submissions/AutoGraded";
import ManualGrading from "./submissions/Manual";
import SubmissionHistory from "./submissions/History";

// Reports pages
import Performance from "./reports/Performance";
import Distribution from "./reports/Distribution";
import Statistics from "./reports/Statistics";
import Export from "./reports/Export";

// Monitoring pages
import LiveMonitoring from "./monitoring/Live";
import IntegrityMonitoring from "./monitoring/Integrity";

// Support pages
import IntegrityPolicy from "./support/Integrity";
import Help from "./support/Help";
import Announcements from "./support/Announcements";
import SupportPage from "../shared/SupportPage";
import System from "./support/System";

// Profile pages
import ProfileSettings from "./profile/Settings";
import ChangePassword from "./profile/Password";

// Main user routes based on UserLeftContainer menuItems
export default function LecturerRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/lecturer/dashboard" replace />} />

      {/* Dashboard */}
      <Route path="dashboard" element={<LecturerOverview />} />
      <Route path="dashboard/overview" element={<LecturerOverview />} />
      <Route path="dashboard/exams" element={<DashboardExams />} />
      <Route path="dashboard/results" element={<DashboardResults />} />
      <Route path="dashboard/notices" element={<DashboardNotices />} />

      {/* Courses */}
      <Route path="courses" element={<AssignedCourses />} />
      <Route path="courses/assigned" element={<AssignedCourses />} />
      <Route path="courses/department" element={<DepartmentLevel />} />
      <Route path="courses/materials" element={<CourseMaterials />} />
      <Route path="courses/upload" element={<UploadMaterials />} />
      <Route path="courses/enrollments" element={<StudentEnrollments />} />
      <Route path="courses/lecturers" element={<NotAvailableYet />} />

      {/* Question Bank */}
      <Route path="questions" element={<CreateQuestions />} />
      <Route path="questions/create" element={<CreateQuestions />} />
      <Route path="questions/edit/:id" element={<EditQuestions />} />
      <Route path="questions/manage" element={<CreateQuestions />} />
      <Route path="questions/types/:id" element={<QuestionTypes />} />
      <Route path="questions/import-export" element={<ImportExport />} />
      <Route path="questions/bulk-upload" element={<BulkUpload />} />
      <Route path="questions/docs" element={<UploadedDocs />} />
      <Route path="questions/approval" element={<Approval />} />

      {/* Exams */}
      <Route path="exams" element={<CreateExam />} />
      <Route path="exams/create" element={<CreateExam />} />
      <Route path="exams/schedule" element={<ScheduleExam />} />
      <Route path="exams/manage" element={<ManageExams />} />
      <Route path="exams/results" element={<ExamResults />} />
      <Route path="exams/analytics" element={<ExamAnalytics />} />
      <Route path="exams/attachments" element={<ExamAttachments />} />

      {/* Submissions */}
      <Route
        path="submissions"
        element={<Navigate to="/lecturer/submissions/attempts" replace />}
      />
      <Route path="submissions/attempts" element={<SubmissionAttempts />} />
      <Route path="submissions/auto-graded" element={<AutoGraded />} />
      <Route path="submissions/manual" element={<ManualGrading />} />
      <Route path="submissions/history" element={<SubmissionHistory />} />

      {/* Reports */}
      <Route
        path="reports"
        element={<Navigate to="/lecturer/reports/performance" replace />}
      />
      <Route path="reports/performance" element={<Performance />} />
      <Route path="reports/distribution" element={<Distribution />} />
      <Route path="reports/statistics" element={<Statistics />} />
      <Route path="reports/export" element={<Export />} />

      {/* Monitoring */}
      <Route
        path="monitoring"
        element={<Navigate to="/lecturer/monitoring/live" replace />}
      />
      <Route path="monitoring/live" element={<LiveMonitoring />} />
      <Route path="monitoring/integrity" element={<IntegrityMonitoring />} />

      {/* Support */}
      <Route
        path="support"
        element={<Navigate to="/lecturer/support/integrity" replace />}
      />
      <Route path="support/integrity" element={<IntegrityPolicy />} />
      <Route path="support/help" element={<Help />} />
      <Route path="support/tickets" element={<SupportPage />} />
      <Route path="support/announcements" element={<Announcements />} />
      <Route path="support/system" element={<System />} />

      {/* Profile & Logout */}
      <Route
        path="profile"
        element={<Navigate to="/lecturer/profile/settings" replace />}
      />
      <Route path="profile/settings" element={<ProfileSettings />} />
      <Route path="profile/password" element={<ChangePassword />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
