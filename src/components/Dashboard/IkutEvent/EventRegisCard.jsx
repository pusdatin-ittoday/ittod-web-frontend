import React from "react";
import { BsCalendarEvent } from "react-icons/bs";
import { Link } from "react-router-dom";

const events = [
    {
        title: "NATIONAL SEMINAR",
        description: "Wawasan menarik di bidang Teknologi Informasi!",
        image: "/logo-event/SEMINAR-NASIONAL.webp"
    },
    {
        title: "BOOTCAMP",
        description: "Asah kemampuanmu dalam bidang Teknologi Informasi!",
        image: "/logo-event/BOOTCAMP.webp"
    },
    {
        title: "WORKSHOP",
        description: "Asah kemampuanmu dalam bidang Teknologi Informasi!",
        image: "/logo-event/WORKSHOP.webp"
    },
];

// IkutEvent component remains unchanged
const IkutEvent = ({ title, description, image }) => (
    <div className="font-dm-sans flex flex-col items-center text-white">
        {/* Image Placeholder */}
        <div className="w-full max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[250px] aspect-[5/4]">
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
        <div className="text-center max-w-[250px] mt-2">
            <h3 className="decoration-white/50 white-text-glow text-2xl mb-5 font-bold">{title}</h3>
            <p className="text-sm">{description}</p>
        </div>

        {/* Button */}
        <div className="flex gap-5">
            <Link
                to="/daftar-event"
                className="mt-4 button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 text-sm inline-block text-center"
            >
                Daftar Sekarang
            </Link>
        </div>
    </div>
);

const EventRegisCard = () => (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
        {/* Header */}
        <div className="flex flex-row items-start justify-between mb-4 pb-2 border-b border-[#dfb4d7]/60">
            <div className="flex flex-col">
                <div className="flex items-center mb-1">
                    <BsCalendarEvent className="text-2xl text-white mr-2" />
                    <h2 className="text-xl font-bold text-white">Event yang Tersedia</h2>
                </div>
                <p className="text-sm pl-1 text-gray-300 ml-7">Pilih dan daftar kompetisi sesuai minat kamu!</p>
            </div>
        </div>

        {/* Grid Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            {/* The grid container remains grid-cols-2 */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
                {events.map((event, idx) => {
                    // Check if the current event is the one to be centered ('WORKSHOP')
                    const isWorkshop = event.title === "WORKSHOP";

                    // Apply specific grid item classes conditionally
                    // We wrap IkutEvent in a div to apply grid item positioning
                    return (
                        <div
                            key={idx} // Key should be on the outermost element in map
                            className={`${isWorkshop ? 'col-span-2 justify-self-center' : '' // Span 2 columns and center itself if it's Workshop
                                }`}
                        >
                            <IkutEvent
                                title={event.title}
                                description={event.description}
                                image={event.image}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

export default EventRegisCard;