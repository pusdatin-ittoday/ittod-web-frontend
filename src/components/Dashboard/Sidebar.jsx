import React from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: "beranda", label: "Beranda", icon: <MdHomeFilled className="text-lg sm:text-xl" /> },
        { id: "ikut-lomba", label: "Ikut Lomba", icon: <GiTrophy className="text-lg sm:text-xl" /> },
        { id: "ikut-event", label: "Ikut Event", icon: <MdEvent className="text-lg sm:text-xl" /> },
        { id: "submit-lomba", label: "Submit Lomba", icon: <FaFileUpload className="text-lg sm:text-xl" /> }
    ];

    return (
        <div className="font-dm-sans lg:w-60 w-full p-2 sm:p-3 md:p-4 flex flex-col gap-2 sm:gap-3 items-center lg:items-start">
            <h2 className="text-center glow-dashboard-text text-base sm:text-lg font-bold">DASHBOARD</h2>
            <div className="flex flex-row lg:flex-col gap-3 sm:gap-6 md:gap-8 lg:gap-4 justify-center w-full">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={(event) => {
                            setActive(item.id);
                            navigate(`/${item.id}`);
                        }}
                        className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm md:text-base 
                            rounded-md lg:font-medium text-left button-hover transition duration-300 ease-in-out cursor-pointer
                            lg:w-full w-auto flex items-center gap-1 sm:gap-2
                            ${active === item.id
                                ? "custom-button-bg"
                                : "bg-[#3a2b5a] custom-button-bg-2 transition duration-300 ease-in-out"
                            }`}
                    >
                        {item.icon}
                        <span className="whitespace-nowrap">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;