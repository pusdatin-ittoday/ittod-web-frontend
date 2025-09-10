import React from "react";
import { BsCalendarEvent } from "react-icons/bs";
import { Link } from "react-router-dom";

const events = [
    {
        title: "NATIONAL SEMINAR",
        description: "Wawasan menarik di bidang Teknologi Informasi!",
        image: "/logo-event/SEMINAR-NASIONAL.webp",
        closeRegistrationDate: new Date("2025-09-12T23:59:59"),
    },
    {
        title: "BOOTCAMP",
        description: "Asah kemampuanmu dalam bidang Teknologi Informasi!",
        image: "/logo-event/BOOTCAMP.webp",
        closeRegistrationDate: new Date("2025-08-23T10:00:00"),
    },
    {
        title: "WORKSHOP",
        description: "Temui dengan para ahli di berbagai bidang IT!",
        image: "/logo-event/WORKSHOP.webp",
        closeRegistrationDate: new Date("2025-09-05T23:59:59"),
    },
];

const IkutEvent = ({ title, description, image }) => (
	<div className="font-dm-sans flex flex-col items-center text-white">
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
		<div className="text-center max-w-[250px] mt-2">
			<h3 className="decoration-white/50 leading-tight font-playfair text-sm sm:text-xl lg:text-xl mb-1 sm:mb-2 font-bold text-glow-beranda">
				{title}
			</h3>
			<p className="text-xs sm:text-sm leading-relaxed">{description}</p>
		</div>
		<div className="flex gap-5">
			{new Date() > events.find((event) => event.title === title).closeRegistrationDate ? (
				<div
					className="mt-2 text-xs sm:text-sm button-hover bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer text-center"
				>
					Pendaftaran Ditutup
				</div>
			) : (
				<Link
					to={`/daftar-event/${title.toLowerCase().replace(/\s+/g, "-")}`}
					className="mt-2 text-xs sm:text-sm button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer text-center"
				>
					Daftar Sekarang
				</Link>
			)}
		</div>
	</div>
);

const EventRegisCard = () => (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
        <div className="flex flex-row items-start justify-between mb-4 pb-2 border-b border-[#dfb4d7]/60">
            <div className="flex flex-col">
                <div className="flex items-center mb-1.5">
                    <BsCalendarEvent className="text-sm sm:text-2xl input-text-glow drop-shadow-[0_1px_6px_#FFE6FC] text-white mr-2" />
                    <h2 className="text-sm sm:text-xl font-bold text-white input-text-glow drop-shadow-[0_1px_1px_#FFE6FC]">Event yang Tersedia</h2>
                </div>
                <p className="text-xs sm:text-sm pl-1 text-gray-300 ml-4 sm:ml-7">Pilih dan daftar event sesuai minat kamu!</p>
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
            <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
                {events.map((event, idx) => {
                    const isWorkshop = event.title === "WORKSHOP";
                    return (
                        <div
                            key={idx}
                            className={`${isWorkshop ? 'col-span-2 justify-self-center' : ''}`}
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