import React from "react";
import Sidebar from "../container/Lecturer-sidebar";
import LecturerNavbar from "./Lecturer-navbar";
import Footer from "./Lecturer-footer";
import { Outlet } from "react-router-dom";

const LecturerDashboard = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      <aside className=" bg-white border-r border-gray-200">
        <Sidebar />
      </aside>

      <main className="w-full flex-1 min-h-screen flex flex-col">
        <LecturerNavbar />
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
};

export default LecturerDashboard;
