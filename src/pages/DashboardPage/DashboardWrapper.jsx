// DashboardWrapper.js
import React from "react";
import { useLocation } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const DashboardWrapper = () => {
  const location = useLocation();
  const path = location.pathname.replace("/", ""); // e.g., "beranda", "ikut-lomba"

  // Fallback to beranda if no match or base /dashboard
  const validTabs = ["beranda", "ikut-lomba", "ikut-event"];
  const activeTab = validTabs.includes(path) ? path : "beranda";

  return <DashboardLayout activeTab={activeTab} />;
};

export default DashboardWrapper;
