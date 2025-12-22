import React from "react";
import { Routes, Route } from "react-router-dom";
// Use the shared NotAvailableYet component for every route (until real screens exist).
import NotAvailableYet from "../../components/Not-available";
import StudentsManagement from "./presentation/users-management/Students-management";
import LecturersManagement from "./presentation/users-management/Lecturers-management";
import AdminsManagement from "./presentation/users-management/Admins-management";
import CourseCreation from "./presentation/courses/Course-creation";


// Main user routes based on UserLeftContainer menuItems
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Dashboard */}
      <Route path="dashboard" element={<NotAvailableYet />} />
      <Route path="dashboard/students" element={<NotAvailableYet />} />
      <Route path="dashboard/exams" element={<NotAvailableYet />} />
      <Route path="dashboard/activity" element={<NotAvailableYet />} />
      <Route path="dashboard/health" element={<NotAvailableYet />} />

      {/* Users Management */}
      <Route path="users" element={<NotAvailableYet />} />
      <Route path="users/students" element={<StudentsManagement />} />
      <Route path="users/lecturers" element={<LecturersManagement />} />
      <Route path="users/admins" element={<AdminsManagement />} />

      {/* Departments */}
      <Route path="departments" element={<NotAvailableYet />} />
      <Route path="departments/manage" element={<NotAvailableYet />} />
      <Route path="departments/courses" element={<NotAvailableYet />} />

      {/* Courses */}
      <Route path="courses" element={<NotAvailableYet />} />
      <Route path="courses/create" element={<CourseCreation />} />
      <Route path="courses/assign" element={<NotAvailableYet />} />

      {/* Exams */}
      <Route path="exams" element={<NotAvailableYet />} />
      <Route path="exams/overview" element={<NotAvailableYet />} />
      <Route path="exams/all" element={<NotAvailableYet />} />
      <Route path="exams/scheduled" element={<NotAvailableYet />} />
      <Route path="exams/active" element={<NotAvailableYet />} />
      <Route path="exams/ended" element={<NotAvailableYet />} />

      {/* Results & Analytics */}
      <Route path="results" element={<NotAvailableYet />} />
      <Route path="results/overall" element={<NotAvailableYet />} />
      <Route path="results/departments" element={<NotAvailableYet />} />
      <Route path="results/courses" element={<NotAvailableYet />} />

      {/* Uploads / Documents */}
      <Route path="uploads" element={<NotAvailableYet />} />
      <Route path="uploads/student-ids" element={<NotAvailableYet />} />
      <Route path="uploads/attachments" element={<NotAvailableYet />} />
      <Route path="uploads/evidence" element={<NotAvailableYet />} />

      {/* Audit Logs */}
      <Route path="audit" element={<NotAvailableYet />} />
      <Route path="audit/logins" element={<NotAvailableYet />} />
      <Route path="audit/submissions" element={<NotAvailableYet />} />
      <Route path="audit/security" element={<NotAvailableYet />} />

      {/* System Settings */}
      <Route path="settings" element={<NotAvailableYet />} />
      <Route path="settings/session" element={<NotAvailableYet />} />
      <Route path="settings/timezone" element={<NotAvailableYet />} />
      <Route path="settings/exam-rules" element={<NotAvailableYet />} />

      {/* Profile & Logout */}
      <Route path="profile" element={<NotAvailableYet />} />


      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
