import React from "react";
import MegaNavbar from "../containers/MegaNavbar";
import Footer from "../containers/Footer";
import { Outlet } from "react-router-dom";
import useThemeStore from "../store/theme-store";
import { cn } from "../core/lib/cn";

const MainLayout = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col",
        isDarkMode ? "bg-slate-950" : "bg-white",
      )}
    >
      <MegaNavbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
