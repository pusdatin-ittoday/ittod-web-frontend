import React from "react";

const events = [
    {
        title: "HACKTODAY",
        image: "/logo-competition/HACKTODAY.webp"
    },
    {
        title: "GAMETODAY",
        image: "/logo-competition/GAMETODAY.webp"


    },
    {
        title: "UXTODAY",
        image: "/logo-competition/UXTODAY.webp"

    },
    {
        title: "MINETODAY",
        image: "/logo-competition/MINETODAY.webp"

    },
];

const SubmitLomba = ({ title, description, image }) => (
    <div className="font-dm-sans flex flex-col items-center text-white">
        {/* Image Placeholder */}
        <div className="w-[200px] h-[220px]">
            {image?(
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover rounded-lg hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out"
                />
            ):(
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
                Submit
            </button>
        </div>
    </div>
);

const CompSubmitCard = () => (
    <div className=" h-[500px] w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-b border-[#dfb4d7]/60">
        {/* Header */}
        <div className="flex flex-row items-start mb-4 pb-2 gap-[45%] border-b border-[#dfb4d7]/60">
            <div>
                <h2 className="text-xl font-bold text-white">Kompetisi yang Diikuti</h2>
            </div>
        </div>

        {/* Grid Container with scrollable area if needed */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
                {events.map((event, idx) => (
                    <SubmitLomba
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

export default CompSubmitCard;