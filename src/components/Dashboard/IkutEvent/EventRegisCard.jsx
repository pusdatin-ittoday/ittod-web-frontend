import React from "react";
import Button from "../../ui/Button";
import { FiUserPlus } from "react-icons/fi";

import { getPublicEvents } from "../../../api/eventPublic";
import PaginationControls from "../PaginationControls";

const NEO_CARD_COLORS = ["bg-[#e8fbef]", "bg-[#ffe26b]", "bg-[#565bc5] text-white"];
const ITEMS_PER_PAGE = 4;

const IkutEvent = ({ title, description, isActive, eventId, colorIndex = 0 }) => {
  return (
    <article
      className={`flex min-h-[190px] h-full flex-col border-[4px] border-[#191b1a] p-5 shadow-[7px_7px_0_#191b1a] sm:p-6 ${NEO_CARD_COLORS[colorIndex % NEO_CARD_COLORS.length]
        }`}
    >
      <h3 className="text-xl font-black uppercase leading-tight">{title}</h3>
      <p className="mt-4 text-sm font-medium leading-relaxed opacity-80">
        {description}
      </p>
      <div className="mt-auto pt-6">
        <Button
          variant={isActive ? "yellow-solid" : "transparent"}
          fullWidth
          href={isActive ? `/daftar-event/${eventId}` : undefined}
          disabled={!isActive}
          className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base"
        >
          {isActive ?
            <>
              <FiUserPlus size={20} />
              Daftar Sekarang
            </>
            :
            <>
              Pendaftaran Ditutup/Belum Dibuka
            </>}
        </Button>
      </div>

    </article>
  );
};

const EventRegisCard = () => {
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
                    image={event.logo_url}
                    isActive={event.is_active}
                    eventId={event.id}
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
};

export default EventRegisCard;
