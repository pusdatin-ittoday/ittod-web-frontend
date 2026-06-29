// DashboardWrapper.js
import React from "react";
import { useLocation, Outlet } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

const DashboardWrapper = () => {
  const location = useLocation();
  // Extract the last part of the path after /dashboard/
  const pathSegments = location.pathname.split('/');
  const path = pathSegments.length > 2 ? pathSegments[2] : "beranda"; 

  // Fallback to beranda if no match or base /dashboard
  const validTabs = ["beranda", "ikut-lomba", "ikut-event", "submit-lomba", "submit-gametoday", "submit-uxtoday", "submit-minetoday"];
  const activeTab = validTabs.includes(path) ? path : "beranda";

  return <DashboardLayout activeTab={activeTab} />; 
};

export default DashboardWrapper;