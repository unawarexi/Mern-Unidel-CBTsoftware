import React from 'react'
import Sidebar from '../container/Student-sidebar'
import Navbar from './Student-navbar'
import Footer from './Student-footer'
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
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
  )
}

export default DashboardLayout