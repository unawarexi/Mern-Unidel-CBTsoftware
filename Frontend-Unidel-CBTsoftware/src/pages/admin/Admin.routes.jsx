import React from "react";
import { Routes, Route } from "react-router-dom";
// Use the shared NotAvailableYet component for every route (until real screens exist).
import NotAvailableYet from "../../components/Not-available";
import AdminDashboard from "./presentation/dashboard/Admin-overview";
import StudentsManagement from "./presentation/users-management/Students-management";
import LecturersManagement from "./presentation/users-management/Lecturers-management";
import AdminsManagement from "./presentation/users-management/Admins-management";
import CourseCreation from "./presentation/courses/Course-creation";
import CreateDepartment from "./presentation/departments/Create-department";
import Assignees from "./presentation/departments/Assignees";
import ManageQuestionBanks from "./presentation/question-bank/Manage-question-banks";
import PendingApprovals from "./presentation/question-bank/Pending-approvals";


// Main user routes based on UserLeftContainer menuItems
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="dashboard/activity" element={<NotAvailableYet />} />
      <Route path="dashboard/health" element={<NotAvailableYet />} />

      {/* User Management */}
      <Route path="users" element={<StudentsManagement />} /> {/* Show students management by default */}
      <Route path="users/students" element={<StudentsManagement />} />
      <Route path="users/lecturers" element={<LecturersManagement />} />
      <Route path="users/admins" element={<AdminsManagement />} />

      {/* Departments & Faculties */}
      <Route path="departments" element={<CreateDepartment />} /> {/* Show manage departments by default */}
      <Route path="departments/manage" element={<CreateDepartment />} />
      <Route path="departments/courses" element={<Assignees />} />

      {/* Courses */}
      <Route path="courses" element={<CourseCreation />} /> {/* Show course creation by default */}
      <Route path="courses/create" element={<CourseCreation />} />
      <Route path="courses/assign" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/scheduled" element={<NotAvailableYet />} />
      <Route path="exams/active" element={<NotAvailableYet />} />
      <Route path="exams/ended" element={<NotAvailableYet />} />
      <Route path="exams/results" element={<NotAvailableYet />} />
      <Route path="exams/analytics" element={<NotAvailableYet />} />

      {/* Question Bank */}
      <Route path="question-bank" element={<ManageQuestionBanks />} /> {/* Show manage question banks by default */}
      <Route path="question-bank/manage" element={<ManageQuestionBanks />} />
      <Route path="question-bank/approvals" element={<PendingApprovals />} />

      {/* CBT Sessions */}
      <Route path="sessions" element={<NotAvailableYet />} />
      <Route path="settings/session" element={<NotAvailableYet />} />
      <Route path="settings/exam-rules" element={<NotAvailableYet />} />

      {/* Audit & Logs */}
      <Route path="audit" element={<NotAvailableYet />} />
      <Route path="audit/logins" element={<NotAvailableYet />} />
      <Route path="audit/submissions" element={<NotAvailableYet />} />
      <Route path="audit/security" element={<NotAvailableYet />} />

      {/* Uploads & Documents */}
      <Route path="uploads" element={<NotAvailableYet />} />
      <Route path="uploads/student-ids" element={<NotAvailableYet />} />
      <Route path="uploads/attachments" element={<NotAvailableYet />} />
      <Route path="uploads/evidence" element={<NotAvailableYet />} />

      {/* System Settings */}
      <Route path="settings" element={<NotAvailableYet />} />
      <Route path="settings/timezone" element={<NotAvailableYet />} />
      <Route path="settings/general" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<NotAvailableYet />} />

      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
