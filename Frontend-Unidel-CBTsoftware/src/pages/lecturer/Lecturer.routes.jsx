import React from "react";
import { Routes, Route } from "react-router-dom";
import NotAvailableYet from "../../components/Not-available";
import CreateQuestions from "./presentation/question-bank/Create-questions";
import ImportExport from "./presentation/question-bank/Import-export"; // added
import QuestionTypes from "./presentation/question-bank/Question-types"; // add this import
import UploadedDocs from "./presentation/question-bank/Uploaded-docs";
import LecturerOverview from "./presentation/dashboard/Lecturer-Overview";

// Import new course material pages
import AssignedCourses from "./presentation/courses-materials/Assigned-courses";
import DepartmentLevel from "./presentation/courses-materials/Department-level";
import CourseMaterials from "./presentation/courses-materials/Course-materials";
import UploadMaterials from "./presentation/courses-materials/Upload-materials";
import StudentEnrollments from "./presentation/courses-materials/student-enrollments";

// Main user routes based on UserLeftContainer menuItems
export default function LecturerRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<NotAvailableYet />} />
      <Route path="dashboard/overview" element={<LecturerOverview />} />
      <Route path="dashboard/exams" element={<NotAvailableYet />} />
      <Route path="dashboard/results" element={<NotAvailableYet />} />
      <Route path="dashboard/notices" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<NotAvailableYet />} />
      <Route path="courses/assigned" element={<AssignedCourses />} />
      <Route path="courses/department" element={<DepartmentLevel />} />
      <Route path="courses/materials" element={<CourseMaterials />} />
      <Route path="courses/upload" element={<UploadMaterials />} />
      <Route path="courses/enrollments" element={<StudentEnrollments />} />
      <Route path="courses/lecturers" element={<NotAvailableYet />} />

      {/* Question Bank */}
      <Route path="questions" element={<NotAvailableYet />} />
      <Route path="questions/manage" element={<CreateQuestions />} />
      <Route path="questions/types/:id" element={<QuestionTypes />} />
      <Route path="questions/import-export" element={<ImportExport />} />
      <Route path="questions/docs" element={<UploadedDocs />} />
      {/* Add new question bank routes here if needed */}

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/create" element={<NotAvailableYet />} />
      <Route path="exams/schedule" element={<NotAvailableYet />} />
      <Route path="exams/manage" element={<NotAvailableYet />} />
      <Route path="exams/results" element={<NotAvailableYet />} />
      <Route path="exams/analytics" element={<NotAvailableYet />} />
      <Route path="exams/attachments" element={<NotAvailableYet />} />

      {/* Submissions */}
      <Route path="submissions" element={<NotAvailableYet />} />
      <Route path="submissions/attempts" element={<NotAvailableYet />} />
      <Route path="submissions/auto-graded" element={<NotAvailableYet />} />
      <Route path="submissions/manual" element={<NotAvailableYet />} />
      <Route path="submissions/history" element={<NotAvailableYet />} />

      {/* Reports */}
      <Route path="reports" element={<NotAvailableYet />} />
      <Route path="reports/performance" element={<NotAvailableYet />} />
      <Route path="reports/distribution" element={<NotAvailableYet />} />
      <Route path="reports/statistics" element={<NotAvailableYet />} />
      <Route path="reports/export" element={<NotAvailableYet />} />

      {/* Monitoring */}
      <Route path="monitoring" element={<NotAvailableYet />} />
      <Route path="monitoring/live" element={<NotAvailableYet />} />
      <Route path="monitoring/integrity" element={<NotAvailableYet />} />
      {/* Add new monitoring routes here if needed */}

      {/* Support */}
      <Route path="support" element={<NotAvailableYet />} />
      <Route path="support/integrity" element={<NotAvailableYet />} />
      <Route path="support/help" element={<NotAvailableYet />} />
      <Route path="support/announcements" element={<NotAvailableYet />} />
      <Route path="support/system" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<NotAvailableYet />} />
      <Route path="profile/settings" element={<NotAvailableYet />} />
      <Route path="profile/password" element={<NotAvailableYet />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
