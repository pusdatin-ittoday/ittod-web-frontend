import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ active, setActive }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: "beranda", label: "Beranda" },
        { id: "ikut-lomba", label: "Ikut Lomba" },
        { id: "ikut-event", label: "Ikut Event" },
    ];

    return (
        <div className="font-dm-sans w-60 p-4 justify-center flex flex-col gap-3">
            <h2 className="text-center glow-dashboard-text text-lg font-bold">DASHBOARD</h2>
            <div className="flex flex-col gap-3">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={(event) => {
                            setActive(item.id);
                            navigate(`/${item.id}`);
                        }}
                        className={`px-4 py-2 rounded-md font-medium text-left button-hover transition duration-300 ease-in-out cursor-pointer
                            ${
                                active === item.id
                                    ? "custom-button-bg"
                                    : "bg-[#3a2b5a] custom-button-bg-2 transition duration-300 ease-in-out"
                            }`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;
