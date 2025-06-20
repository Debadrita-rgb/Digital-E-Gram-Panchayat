import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../../components/userComponents/Navbar/Navbar";
import Footer from "../../../components/userComponents/Footer/Footer"; 

const UserLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default UserLayout;
