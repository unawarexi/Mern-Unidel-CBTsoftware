import React from "react";
import Sidebar from "../container/Student-sidebar";
import StudentNavbar from "./Student-navbar";
import Footer from "./Student-footer";
import { Outlet } from "react-router-dom";

const StudentDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className="bg-white border-r border-gray-200">
        <Sidebar />
      </aside>

      {/* Use flex-1 so navbar/footer stretch to remaining width automatically */}
      <main className="w-full flex-1 min-h-screen flex flex-col">
        <StudentNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default StudentDashboard;