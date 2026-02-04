import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
// Use the shared NotAvailableYet component for every route (until real screens exist).
import NotAvailableYet from "../../components/Not-available";
import AdminDashboard from "./dashboard/Admin-overview";
import StudentsManagement from "./users-management/Students-management";
import LecturersManagement from "./users-management/Lecturers-management";
import AdminsManagement from "./users-management/Admins-management";
import CourseCreation from "./courses/Course-creation";
import CreateDepartment from "./departments/Create-department";
import Assignees from "./departments/Assignees";
import ManageQuestionBanks from "./question-bank/Manage-question-banks";
import PendingApprovals from "./question-bank/Pending-approvals";

// Dashboard pages
import ActivityFeed from "./dashboard/Activity-feed";
import SystemHealth from "./dashboard/System-health";

// Exam pages
import ScheduledExams from "./exams/Scheduled-exams";
import ActiveExams from "./exams/Active-exams";
import EndedExams from "./exams/Ended-exams";
import ExamResults from "./exams/Exam-results";
import ExamAnalytics from "./exams/Exam-analytics";

// Session pages
import AcademicSessions from "./sessions/Academic-sessions";
import Semesters from "./sessions/Semesters";
import CurrentSession from "./sessions/Current-session";

// Audit pages
import LoginActivity from "./audit/Login-activity";
import ExamSubmissionsAudit from "./audit/Exam-submissions-audit";
import SecurityEvents from "./audit/Security-events";

// Settings pages
import ExamRules from "./settings/Exam-rules";
import GeneralSettings from "./settings/General-settings";

// Profile pages
import AdminProfile from "./profile/Admin-profile";

// Course pages
import LecturerAssignment from "./courses/Lecturer-assignment";

// Upload pages
import BulkUpload from "./uploads/Bulk-upload";
import QuestionUploads from "./uploads/Question-uploads";

// Content Management
import ManageFaculties from "./content-management/ManageFaculties";
import ManageScholarships from "./content-management/ManageScholarships";
import ManagePrograms from "./content-management/ManagePrograms";
import ManageGoverningBodies from "./content-management/ManageGoverningBodies";
import WaitlistManagement from "./content-management/WaitlistManagement";
import ApplicationsManagement from "./content-management/ApplicationsManagement";
import ManageTickets from "./content-management/ManageTickets";
import ManageCareerApplications from "./content-management/ManageCareerApplications";
import ManageAgents from "./content-management/ManageAgents";
import SupportPage from "../shared/SupportPage";

// Main user routes based on UserLeftContainer menuItems
export default function AdminRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      {/* Dashboard */}
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="dashboard/activity" element={<ActivityFeed />} />
      <Route path="dashboard/health" element={<SystemHealth />} />
      {/* User Management */}
      <Route path="users" element={<StudentsManagement />} />{" "}
      {/* Show students management by default */}
      <Route path="users/students" element={<StudentsManagement />} />
      <Route path="users/lecturers" element={<LecturersManagement />} />
      <Route path="users/admins" element={<AdminsManagement />} />
      <Route path="users/applications" element={<ApplicationsManagement />} />
      <Route path="users/agents" element={<ManageAgents />} />
      {/* Departments & Faculties */}
      <Route path="departments" element={<CreateDepartment />} />{" "}
      {/* Show manage departments by default */}
      <Route path="departments/manage" element={<CreateDepartment />} />
      <Route path="departments/courses" element={<Assignees />} />
      {/* Courses */}
      <Route path="courses" element={<CourseCreation />} />{" "}
      {/* Show course creation by default */}
      <Route path="courses/create" element={<CourseCreation />} />
      <Route path="courses/assign" element={<LecturerAssignment />} />
      {/* Exams */}
      <Route
        path="exams"
        element={<Navigate to="/admin/exams/scheduled" replace />}
      />
      <Route path="exams/scheduled" element={<ScheduledExams />} />
      <Route path="exams/active" element={<ActiveExams />} />
      <Route path="exams/ended" element={<EndedExams />} />
      <Route path="exams/results" element={<ExamResults />} />
      <Route path="exams/analytics" element={<ExamAnalytics />} />
      {/* Question Bank */}
      <Route path="question-bank" element={<ManageQuestionBanks />} />{" "}
      {/* Show manage question banks by default */}
      <Route path="question-bank/manage" element={<ManageQuestionBanks />} />
      <Route path="question-bank/approvals" element={<PendingApprovals />} />
      {/* Sessions */}
      <Route
        path="sessions"
        element={<Navigate to="/admin/sessions/current" replace />}
      />
      <Route path="sessions/current" element={<CurrentSession />} />
      <Route path="sessions/academic-sessions" element={<AcademicSessions />} />
      <Route path="sessions/semesters" element={<Semesters />} />
      {/* Audit & Logs */}
      <Route
        path="audit"
        element={<Navigate to="/admin/audit/logins" replace />}
      />
      <Route path="audit/logins" element={<LoginActivity />} />
      <Route path="audit/submissions" element={<ExamSubmissionsAudit />} />
      <Route path="audit/security" element={<SecurityEvents />} />
      {/* Uploads & Documents */}
      <Route
        path="uploads"
        element={<Navigate to="/admin/uploads/bulk" replace />}
      />
      <Route path="uploads/bulk" element={<BulkUpload />} />
      <Route path="uploads/questions" element={<QuestionUploads />} />
      {/* Content Management */}
      <Route path="content/faculties" element={<ManageFaculties />} />
      <Route path="content/scholarships" element={<ManageScholarships />} />
      <Route path="content/programs" element={<ManagePrograms />} />
      <Route
        path="content/governing-bodies"
        element={<ManageGoverningBodies />}
      />
      <Route path="content/waitlist" element={<WaitlistManagement />} />
      <Route path="content/tickets" element={<ManageTickets />} />
      <Route
        path="content/career-applications"
        element={<ManageCareerApplications />}
      />
      <Route path="support" element={<SupportPage />} />
      {/* System Settings */}
      <Route
        path="settings"
        element={<Navigate to="/admin/settings/general" replace />}
      />
      <Route path="settings/general" element={<GeneralSettings />} />
      <Route path="settings/exam-rules" element={<ExamRules />} />
      {/* Profile & Logout */}
      <Route path="profile" element={<AdminProfile />} />
      {/* Fallback */}
      <Route path="*" element={<NotAvailableYet />} />
    </Routes>
  );
}
