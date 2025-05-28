import React from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import { FaFileUpload } from "react-icons/fa";

const Sidebar = ({ active, setActive }) => {
    const navigate = useNavigate();

    const menuItems = [
        { id: "beranda", label: "Beranda", icon: <MdHomeFilled className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "ikut-lomba", label: "Ikut Lomba", icon: <GiTrophy className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "ikut-event", label: "Ikut Event", icon: <MdEvent className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "submit-lomba", label: "Submit Lomba", icon: <FaFileUpload className="text-sm sm:text-base lg:text-lg xl:text-xl" /> }
    ];

    return (
        <div className="font-dm-sans w-full p-1 sm:p-2 md:p-3 lg:p-4 flex flex-col gap-2 sm:gap-3 items-center lg:items-start">
            <h2 className="text-center glow-dashboard-text text-sm sm:text-base lg:text-lg font-bold mb-1 sm:mb-2">
                DASHBOARD
            </h2>
            
            {/* Grid layout for small screens (2 columns), flex for larger screens */}
            <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row lg:flex-col sm:gap-3 md:gap-4 lg:gap-3 xl:gap-4 justify-center w-full">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={(event) => {
                            setActive(item.id);
                            navigate(`/dashboard/${item.id}`);
                        }}
                        className={`px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 lg:py-2 xl:py-3
                            text-xs sm:text-sm md:text-base lg:text-sm xl:text-base
                            rounded-md lg:font-medium text-center sm:text-left button-hover 
                            transition duration-300 ease-in-out cursor-pointer
                            w-full flex flex-col sm:flex-row items-center justify-center sm:justify-start
                            gap-1 sm:gap-2 min-h-[3rem] sm:min-h-0
                            ${active === item.id
                                ? "custom-button-bg text-white"
                                : "bg-[#3a2b5a] custom-button-bg-2 transition duration-300 ease-in-out text-white/90 hover:text-white"
                            }`}
                    >
                        <span className="flex-shrink-0">{item.icon}</span>
                        <span className="whitespace-nowrap text-center sm:text-left leading-tight">
                            {item.label}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Sidebar;