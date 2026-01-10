import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";
import LecturerOverview from "./presentation/dashboard/Lecturer-Overview";

// Import question bank pages
import CreateQuestions from "./presentation/question-bank/Create-questions";
import ImportExport from "./presentation/question-bank/Import-export"; // added
import QuestionTypes from "./presentation/question-bank/Question-types"; // add this import
import UploadedDocs from "./presentation/question-bank/Uploaded-docs";
import Approval from "./presentation/question-bank/Approval";

// Import new course material pages
import AssignedCourses from "./presentation/courses-materials/Assigned-courses";
import DepartmentLevel from "./presentation/courses-materials/Department-level";
import CourseMaterials from "./presentation/courses-materials/Course-materials";
import UploadMaterials from "./presentation/courses-materials/Upload-materials";
import StudentEnrollments from "./presentation/courses-materials/student-enrollments";

// Import exam assessment pages
import CreateExam from "./presentation/exam-assessment/Create-exam";
import ScheduleExam from "./presentation/exam-assessment/Schedule-exam";
import ManageExams from "./presentation/exam-assessment/Manage-exams";

// Main user routes based on UserLeftContainer menuItems
export default function LecturerRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/lecturer/dashboard" replace />} />
      
      {/* Dashboard */}
      <Route path="dashboard" element={<LecturerOverview />} />
      <Route path="dashboard/overview" element={<LecturerOverview />} />
      <Route path="dashboard/exams" element={<NotAvailableYet />} />
      <Route path="dashboard/results" element={<NotAvailableYet />} />
      <Route path="dashboard/notices" element={<NotAvailableYet />} />

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
      <Route path="questions/manage" element={<CreateQuestions />} />
      <Route path="questions/types/:id" element={<QuestionTypes />} />
      <Route path="questions/import-export" element={<ImportExport />} />
      <Route path="questions/docs" element={<UploadedDocs />} />
      <Route path="questions/approval" element={<Approval />} />

      {/* Exams */}
      <Route path="exams" element={<CreateExam />} />
      <Route path="exams/create" element={<CreateExam />} />
      <Route path="exams/schedule" element={<ScheduleExam />} />
      <Route path="exams/manage" element={<ManageExams />} />
      <Route path="exams/results" element={<NotAvailableYet />} />
      <Route path="exams/analytics" element={<NotAvailableYet />} />
      <Route path="exams/attachments" element={<NotAvailableYet />} />

      {/* Submissions */}
      <Route path="submissions" element={<Navigate to="/lecturer/submissions/attempts" replace />} />
      <Route path="submissions/attempts" element={<NotAvailableYet />} />
      <Route path="submissions/auto-graded" element={<NotAvailableYet />} />
      <Route path="submissions/manual" element={<NotAvailableYet />} />
      <Route path="submissions/history" element={<NotAvailableYet />} />

      {/* Reports */}
      <Route path="reports" element={<Navigate to="/lecturer/reports/performance" replace />} />
      <Route path="reports/performance" element={<NotAvailableYet />} />
      <Route path="reports/distribution" element={<NotAvailableYet />} />
      <Route path="reports/statistics" element={<NotAvailableYet />} />
      <Route path="reports/export" element={<NotAvailableYet />} />

      {/* Monitoring */}
      <Route path="monitoring" element={<Navigate to="/lecturer/monitoring/live" replace />} />
      <Route path="monitoring/live" element={<NotAvailableYet />} />
      <Route path="monitoring/integrity" element={<NotAvailableYet />} />

      {/* Support */}
      <Route path="support" element={<Navigate to="/lecturer/support/integrity" replace />} />
      <Route path="support/integrity" element={<NotAvailableYet />} />
      <Route path="support/help" element={<NotAvailableYet />} />
      <Route path="support/announcements" element={<NotAvailableYet />} />
      <Route path="support/system" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<Navigate to="/lecturer/profile/settings" replace />} />
      <Route path="profile/settings" element={<NotAvailableYet />} />
      <Route path="profile/password" element={<NotAvailableYet />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
