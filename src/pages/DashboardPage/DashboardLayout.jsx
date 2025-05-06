import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";
import SubmitLomba from "../../components/Dashboard/SubmitLomba/SubmitLomba";

const DashboardLayout = () => {
  const [active, setActive] = useState(() => {
    // Try to get the active state from local storage on initial load
    const storedActive = localStorage.getItem("activeTab");
    return storedActive ? storedActive : "beranda";
  });

  useEffect(() => {
    // Update local storage whenever the active state changes
    localStorage.setItem("activeTab", active);
  }, [active]);

  const renderContent = () => {
    switch (active) {
      case "ikut-lomba":
        return <IkutLomba />;
      case "ikut-event":
        return <IkutEvent />;
      case "submit-lomba":
        return <SubmitLomba />;
      default:
        return <Beranda />;
    }
  };

  return (
    <div className="bg-[#302044] h-full w-full text-white font-dm-sans">
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Wrapper: Sidebar + Main Content sejajar */}
      <div className="flex">
        <aside className="mt-20 ml-6">
          {/* Sidebar */}
          <Sidebar active={active} setActive={setActive} />
        </aside>

        {/* Main Content */}
        <main className="flex-1 px-6 py-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;