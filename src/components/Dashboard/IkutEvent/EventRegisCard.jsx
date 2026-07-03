import React from "react";
import { BsCalendarEvent } from "react-icons/bs";
import { Link } from "react-router-dom";

import { getPublicEvents } from "../../../api/eventPublic";

const IkutEvent = ({ title, description, image, isActive, eventId }) => (
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
      {!isActive ? (
        <div className="mt-2 text-xs sm:text-sm button-hover bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer text-center">
          Pendaftaran Ditutup
        </div>
      ) : (
        <Link
          to={`/daftar-event/${eventId.toLowerCase()}`}
          className="mt-2 text-xs sm:text-sm button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer text-center"
        >
          Daftar Sekarang
        </Link>
      )}
    </div>
  </div>
);

const EventRegisCard = () => {
  const [eventsData, setEventsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await getPublicEvents('non_competition');
      if (res.success && res.data) {
        setEventsData(res.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
      <div className="flex flex-row items-start justify-between mb-4 pb-2 border-b border-[#dfb4d7]/60">
        <div className="flex flex-col">
          <div className="flex items-center mb-1.5">
            <BsCalendarEvent className="text-sm sm:text-2xl input-text-glow drop-shadow-[0_1px_6px_#FFE6FC] text-white mr-2" />
            <h2 className="text-sm sm:text-xl font-bold text-white input-text-glow drop-shadow-[0_1px_1px_#FFE6FC]">
              Event yang Tersedia
            </h2>
          </div>
          <p className="text-xs sm:text-sm pl-1 text-gray-300 ml-4 sm:ml-7">
            Pilih dan daftar event sesuai minat kamu!
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
            {eventsData.map((event, idx) => {
              const isWorkshop = event.title.toUpperCase() === "WORKSHOP";
              return (
                <div
                  key={event.id}
                  className={`${isWorkshop ? "col-span-2 justify-self-center" : ""}`}
                >
                  <IkutEvent
                    title={event.title}
                    description={event.description}
                    image={event.logo_url || `/logo-event/${event.id.toUpperCase()}.webp`}
                    isActive={event.is_active}
                    eventId={event.id}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegisCard;
