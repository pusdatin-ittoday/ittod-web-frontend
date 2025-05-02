import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Dashboard/Sidebar";
import Beranda from "../../components/Dashboard/Beranda/Beranda";
import IkutLomba from "../../components/Dashboard/IkutLomba/IkutLomba";


const DashboardLayout = () => {
    const [active, setActive] = useState("beranda");

    const renderContent = () => {
        switch (active) {
            case "ikut-lomba":
                return <IkutLomba />;
            case "event":
                return <Event />;
            default:
                return <Beranda />;
        }
    };

    return (
        <div className="min-h-screen bg-[#302044] text-white font-dm-sans">
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