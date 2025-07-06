// components/AdminsOnly.js
import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminsOnly = () => {
  const isAdmin = localStorage.getItem("adminToken");
  return isAdmin ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminsOnly;
