import React from "react";
import { BsCalendarEvent } from "react-icons/bs";
import { Link } from "react-router-dom";

import { getPublicEvents } from "../../../api/eventPublic";
import PaginationControls from "../PaginationControls";

const NEO_CARD_COLORS = ["bg-[#e8fbef]", "bg-[#ffe26b]", "bg-[#565bc5] text-white"];
const ITEMS_PER_PAGE = 4;

const IkutEvent = ({ title, description, image, isActive, eventId, variant = "default", colorIndex = 0 }) => {
  if (variant === "neobrutal") {
    return (
      <article
        className={`flex min-h-[190px] h-full flex-col border-[4px] border-[#191b1a] p-5 shadow-[7px_7px_0_#191b1a] sm:p-6 ${
          NEO_CARD_COLORS[colorIndex % NEO_CARD_COLORS.length]
        }`}
      >
        <h3 className="text-xl font-black uppercase leading-tight">{title}</h3>
        <p className="mt-4 text-sm font-medium leading-relaxed opacity-80">
          {description}
        </p>

        <div className="mt-auto pt-6">
          {!isActive ? (
            <div className="border-[3px] border-black bg-[#ff8c75] px-4 py-3 text-center text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a]">
              Pendaftaran Ditutup
            </div>
          ) : (
            <Link
              to={`/daftar-event/${eventId.toLowerCase()}`}
              className="block border-[3px] border-black bg-[#ffd400] px-4 py-3 text-center text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              Daftar Sekarang
            </Link>
          )}
        </div>
      </article>
    );
  }

  return (
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
};

const EventRegisCard = ({ variant = "default" }) => {
  const [eventsData, setEventsData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await getPublicEvents('non_competition');
      if (res.success && res.data) {
        setEventsData(res.data);
        setCurrentPage(0);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const totalPages = Math.ceil(eventsData.length / ITEMS_PER_PAGE);
  const visibleEvents = eventsData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  if (variant === "neobrutal") {
    return (
      <section className="border-[4px] border-[#191b1a] bg-white p-5 shadow-[8px_8px_0_#191b1a] sm:p-7 lg:p-8">
        <div className="border-b-2 border-dashed border-[#191b1a] pb-5">
          <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
            Event yang Tersedia
          </h1>
          <p className="mt-1 text-xs font-medium text-gray-600 sm:text-sm">
            Pilih dan daftar event sesuai minat kamu!
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[360px] items-center justify-center">
            <p className="border-[3px] border-black bg-[#ffd400] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#191b1a]">
              Loading...
            </p>
          </div>
        ) : eventsData.length === 0 ? (
          <div className="flex min-h-[360px] items-center justify-center text-center">
            <p className="max-w-sm border-[3px] border-black bg-[#e8fbef] px-5 py-4 text-sm font-black uppercase shadow-[5px_5px_0_#191b1a]">
              Belum ada event yang tersedia.
            </p>
          </div>
        ) : (
          <>
          <div className="grid grid-cols-1 gap-7 py-7 xl:grid-cols-2 xl:gap-8">
            {visibleEvents.map((event, idx) => {
              const isLastOdd =
                visibleEvents.length % 2 === 1 && idx === visibleEvents.length - 1;
              const absoluteIndex = currentPage * ITEMS_PER_PAGE + idx;

              return (
                <div
                  key={event.id}
                  className={
                    isLastOdd
                      ? "xl:col-span-2 xl:mx-auto xl:w-[52%]"
                      : ""
                  }
                >
                  <IkutEvent
                    title={event.title}
                    description={event.description}
                    image={event.logo_url || `/logo-event/${event.id.toUpperCase()}.webp`}
                    isActive={event.is_active}
                    eventId={event.id}
                    variant="neobrutal"
                    colorIndex={absoluteIndex}
                  />
                </div>
              );
            })}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
          </>
        )}
      </section>
    );
  }

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
            {eventsData.map((event) => {
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
