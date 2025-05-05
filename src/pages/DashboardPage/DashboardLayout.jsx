import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";
import IkutEvent from "../../components/Dashboard/IkutEvent/IkutEvent";

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
      default:
        return <Beranda />;
    }
  };

  return (
    <div className="flex min-h-screen  text-white font-dm-sans">
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Wrapper: Sidebar + Main Content sejajar */}
      <div className="flex flex-col lg:flex-row  w-full ">
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