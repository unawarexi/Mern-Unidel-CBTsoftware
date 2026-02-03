import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FullPageSpinner } from "../../components/Spinners";

// Lazy load agent pages
const AgentOverview = React.lazy(() => import("./dashboard/Agent-overview"));
const AgentStudents = React.lazy(() => import("./students/Agent-students"));
const AgentExams = React.lazy(() => import("./exams/Agent-exams"));
const AgentPayments = React.lazy(() => import("./payments/Agent-payments"));
const AgentProfile = React.lazy(() => import("./profile/Agent-profile"));

const AgentRoutes = () => {
  return (
    <Suspense fallback={<FullPageSpinner message="Loading Agent Portal..." />}>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AgentOverview />} />
        <Route path="students" element={<AgentStudents />} />
        <Route path="exams" element={<AgentExams />} />
        <Route path="payments" element={<AgentPayments />} />
        <Route path="profile" element={<AgentProfile />} />

        {/* Placeholder for nested routes if needed */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AgentRoutes;
