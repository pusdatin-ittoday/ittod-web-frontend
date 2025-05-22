import React from "react";
import { Navigate } from "react-router-dom";

const PrivateAdmin = ({ children }) => {
  const token = localStorage.getItem("adminToken");
  const user = JSON.parse(localStorage.getItem("adminUser"));

  if (!token || user?.role !== "admin") {
    return <Navigate to="/AdminLogin" replace />;
  }

  return children;
};

export default PrivateAdmin;