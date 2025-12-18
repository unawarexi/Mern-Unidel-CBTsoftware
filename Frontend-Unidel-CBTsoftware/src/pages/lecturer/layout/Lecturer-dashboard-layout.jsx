import React from "react";
import Sidebar from "../container/Lecturer-sidebar";
import Navbar from "./Lecturer-navbar";
import Footer from "./Lecturer-footer";
import { Outlet } from "react-router-dom";

const LecturerDashboard = () => {
  return (
    <div>
      <Sidebar />

      <div>
        {/* Navbar component can be added here */}
        <Navbar />
        {/* Main content can be added here */}
        <div>Main Content</div>
        <Footer />
      </div>
    </div>
  );
};

export default LecturerDashboard;
