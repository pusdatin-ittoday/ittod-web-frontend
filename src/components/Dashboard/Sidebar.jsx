import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MdHomeFilled } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import { MdEvent } from "react-icons/md";
import { FaFileUpload, FaBell } from "react-icons/fa";

const participantQuotes = [
    "Jangan lupa tidur.",
    "Jangan lupa minum air putih.",
    "Push code dulu, tidur kemudian.",
    "Satu bug kelar, dua bug tumbuh.",
    "Git commit -m 'semoga jalan'.",
    "Ingat, localhost bukan production.",
    "Mandi dulu baru ngoding.",
    "Sakit pinggang? Waktunya stretching.",
    "Ctrl + S adalah penyelamatmu.",
    "Layar redupkan dikit, kasihan matamu.",
    "Koneksi internet aman, kan?",
    "Tarik napas, hembuskan, re-run.",
    "Maju terus pantang merge conflict.",
    "Jalankan dulu, rapikan nanti.",
    "Kurangi kopi, banyakin air putih.",
    "Error adalah jalan ninjamu.",
    "Bikin segelas teh dulu biar tenang.",
    "Koding secukupnya, istirahat seperlunya.",
    "Sudah push hari ini?",
    "Clean code is happy code.",
    "Fokus ke solusi, bukan bug-nya.",
    "Jangan sungkan tanya panitia.",
    "Ingat, kesehatanmu nomor satu.",
    "Kerja tim itu saling melengkapi.",
    "Tulis code seolah yang baca psikopat.",
    "Ada masalah? Coba restart dev server.",
    "Setiap baris kode adalah proses.",
    "Jangan lupa sarapan, energi itu penting.",
    "Breathe in, breathe out, debug.",
    "Semua akan compile pada waktunya.",
];

const Sidebar = ({ active, setActive, variant = "default" }) => {
    const navigate = useNavigate();
    const randomQuote = useMemo(
        () => participantQuotes[Math.floor(Math.random() * participantQuotes.length)],
        []
    );

    const menuItems = [
        { id: "beranda", label: "Beranda", icon: <MdHomeFilled className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "pengumuman", label: "Pengumuman", icon: <FaBell className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "ikut-lomba", label: "Ikut Lomba", icon: <GiTrophy className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "ikut-event", label: "Ikut Event", icon: <MdEvent className="text-sm sm:text-base lg:text-lg xl:text-xl" /> },
        { id: "submit-lomba", label: "Submit Lomba", icon: <FaFileUpload className="text-sm sm:text-base lg:text-lg xl:text-xl" /> }
    ];

    if (variant === "neobrutal") {
        const neoMenuItems = [
            menuItems[0],
            menuItems[1],
            { ...menuItems[3], label: "Daftar Event" },
            { ...menuItems[2], label: "Daftar Lomba" },
            menuItems[4],
        ];

        return (
            <div className="flex h-full flex-col px-4 py-6 sm:px-6 lg:min-h-[760px] lg:px-5">
                <div className="mb-6">
                    <h2 className="text-xl font-black uppercase text-[#333bb0]">
                        Dashboard
                    </h2>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        V.2026.Street
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
                    {neoMenuItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => {
                                if (setActive) setActive(item.id);
                                navigate(`/dashboard/${item.id}`);
                            }}
                            className={`flex min-h-14 items-center gap-3 border-[3px] border-black px-3 py-3 text-left text-xs font-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none sm:text-sm ${
                                active === item.id
                                    ? "bg-[#ffd400] text-[#191b1a]"
                                    : "bg-white text-[#191b1a]"
                            }`}
                        >
                            <span className="shrink-0 text-base">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-auto hidden border-[3px] border-[#4f58d0] bg-[#191b1a] p-4 text-white shadow-[5px_5px_0_#191b1a] lg:block">
                    <p className="text-base font-black leading-6 text-white">
                        {randomQuote}
                    </p>
                    <p className="mt-2 text-[11px] font-semibold leading-snug text-gray-300">
                        kasih author aja dari tim web pdi
                    </p>
                </div>
            </div>
        );
    }

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
                        onClick={() => {
                            if (setActive) setActive(item.id);
                            navigate(`/dashboard/${item.id}`);
                        }}
                        className={`px-4 sm:px-6 md:px-8 py-1 sm:py-2.5 md:py-3 lg:px-8 lg:text-start lg:py-2 xl:py-3 xl:px-10
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
