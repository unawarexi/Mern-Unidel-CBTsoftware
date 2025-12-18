import React from "react";
import NavBar from "../containers/Navbar";
import Footer from "../containers/Footer";
import { Outlet } from "react-router-dom";


const MainLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
