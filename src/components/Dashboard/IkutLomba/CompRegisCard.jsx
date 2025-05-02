import React from "react";

const events = [
    { title: "HACKTODAY", description: "Acara seru banget aduhai ayo join ittod yang tahun ini" },
    { title: "GAMETODAY", description: "Acara seru banget aduhai ayo join ittod yang tahun ini" },
    { title: "UXTODAY", description: "Acara seru banget aduhai ayo join ittod yang tahun ini" },
    { title: "GAMETODAY", description: "Acara seru banget aduhai ayo join ittod yang tahun ini" },
];

const IkutLomba = ({ title, description }) => (
    <div className="font-dm-sans flex flex-col items-center text-white space-y-3">
        {/* Image Placeholder */}
        <div className="w-[120px] h-[150px] bg-black rounded-lg shadow-md"></div>

        {/* Text */}
        <div className="text-center max-w-[150px]">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm mt-1">{description}</p>
        </div>

        {/* Button */}
        <button className="mt-2 bg-gradient-to-r from-pink-400 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg font-semibold hover:scale-105 transition-all duration-300">
            Daftar Sekarang
        </button>
    </div>
);

const CompRegisCard = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#4b294f] to-[#321c3a] flex items-center justify-center py-10 px-4">
        <div className="grid grid-cols-2 gap-x-12 gap-y-10">
            {events.map((event, idx) => (
                <IkutLomba key={idx} title={event.title} description={event.description} />
            ))}
        </div>
    </div>
);

export default CompRegisCard;
