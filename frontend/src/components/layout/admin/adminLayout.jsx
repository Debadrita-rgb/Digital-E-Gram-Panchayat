import React from 'react'
import AdminNavbar from "./adminNAvbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AdminNavbar />
      <main className="flex-1 p-4 mx-auto w-full max-w-screen-2xl md:p-6">
        <Outlet />
      </main>
    </div>
  );
}

