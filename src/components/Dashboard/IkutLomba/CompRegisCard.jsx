import React from "react";
import { PiTargetBold } from "react-icons/pi";

const events = [
    {
        title: "HACKTODAY",
        description: "Acara seru banget aduhai ayo join ittod yang tahun ini",
        image: "/logo-competition/HACKTODAY.webp"
    },
    {
        title: "GAMETODAY",
        description: "Acara seru banget aduhai ayo join ittod yang tahun ini",
        image: "/logo-competition/GAMETODAY.webp"
    },
    {
        title: "UXTODAY",
        description: "Acara seru banget aduhai ayo join ittod yang tahun ini",
        image: "/logo-competition/UXTODAY.webp"
    },
    {
        title: "MINETODAY",
        description: "Acara seru banget aduhai ayo join ittod yang tahun ini",
        image: "/logo-competition/MINETODAY.webp"
    },
];

const IkutLomba = ({ title, description, image }) => (
    <div className="font-dm-sans flex flex-col items-center text-white">
        {/* Image Placeholder */}
        <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[1/1]">
            {image ? (
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out"
                />
            ) : (
                <div className="w-full h-full bg-black"></div>
            )}
        </div>

        {/* Text */}
        <div className="text-center max-w-[200px]">
            <h3 className="decoration-white/50 white-text-glow text-2xl mb-5 font-bold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>

        {/* Button */}
        <div className="flex gap-5">
            <button className="mt-4 button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 text-sm">
                Daftar Sekarang
            </button>
        </div>
    </div>
);

const CompRegisCard = () => (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
        {/* Header */}
        <div className="flex flex-row items-start justify-between mb-4 pb-2 border-b border-[#dfb4d7]/60">
            <div className="flex flex-col">
                <div className="flex items-center mb-1">
                    <PiTargetBold className="text-2xl text-white mr-2" />
                    <h2 className="text-xl font-bold text-white">Kompetisi yang Tersedia</h2>
                </div>
                <p className="text-sm pl-1 text-gray-300 ml-7">Pilih dan daftar kompetisi sesuai minat kamu!</p>
            </div>
            <button className="custom-button-bg px-4 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold mb-4">
                Join Team
            </button>
        </div>

        {/* Grid Container with scrollable area if needed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
                {events.map((event, idx) => (
                    <IkutLomba
                        key={idx}
                        title={event.title}
                        description={event.description}
                        image={event.image}
                    />
                ))}
            </div>
        </div>
    </div>
);

export default CompRegisCard;