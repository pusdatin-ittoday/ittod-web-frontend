import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../ui/Button";
import { FiUserPlus } from "react-icons/fi";
import { FaWhatsapp, FaDiscord } from "react-icons/fa";

import { getPublicEvents } from "../../../api/eventPublic";
import { getJoinEvent } from "../../../utils/api/event";
import { checkIpbOrMinetoday, getUserCompetitions } from "../../../api/user";
import { requireCompleteProfile } from "../../../utils/profileCompletion";
import { useAlert } from "../../../context/AlertContext";
import PaginationControls from "../PaginationControls";

const NEO_CARD_COLORS = ["bg-[#e8fbef]", "bg-[#ffe26b]", "bg-[#565bc5] text-white"];
const ITEMS_PER_PAGE = 4;

const getLogoFallback = (title, image) => {
  if (image) return image;
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes("workshop")) return "/logo-event/WORKSHOP.webp";
  if (t.includes("bootcamp")) return "/logo-event/BOOTCAMP.webp";
  if (t.includes("seminar")) return "/logo-event/SEMINAR-NASIONAL.webp";
  if (t.includes("code")) return "/logo-competition/CODETODAY.webp";
  if (t.includes("game")) return "/logo-competition/GAMETODAY.webp";
  if (t.includes("hack")) return "/logo-competition/HACKTODAY.webp";
  if (t.includes("mine")) return "/logo-competition/MINETODAY.webp";
  if (t.includes("ux")) return "/logo-competition/UXTODAY.webp";
  return null;
};

const getShortDescription = (description) => {
  if (!description) return "";
  if (description.length > 200) {
    return description.substring(0, 195).trim() + "...";
  }
  return description;
};

const IkutEvent = ({
  title,
  description,
  image,
  isActive,
  eventId,
  eventSlug,
  isRegistered,
  isPending,
  waGroupLink,
  colorIndex = 0,
  isIPB = false,
}) => {
  const logoSrc = getLogoFallback(title, image);
  const shortDesc = getShortDescription(description);
  const isBootcamp = (title || "").toLowerCase().includes("bootcamp");

  const navigate = useNavigate();
  const { showAlert } = useAlert();

  return (
    <article
      className={`flex min-h-[190px] h-full flex-col border-[4px] border-[#191b1a] p-5 shadow-[7px_7px_0_#191b1a] sm:p-6 ${
        NEO_CARD_COLORS[colorIndex % NEO_CARD_COLORS.length]
      }`}
    >
      <div className="flex items-center gap-3.5">
        {logoSrc && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-black bg-white p-1 shadow-[3px_3px_0_#191b1a]">
            <img
              src={logoSrc}
              alt={title}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        )}
        <div>
          <h3 className="text-xl font-black uppercase leading-tight">{title}</h3>
          {isBootcamp && isIPB && (
            <div className="mt-1.5 inline-flex items-center gap-1 border-2 border-black bg-[#18c964] px-2 py-0.5 text-[10px] sm:text-[11px] font-black uppercase text-white shadow-[2px_2px_0_#191b1a]">
              <span>GRATIS UNTUK MAHASISWA IPB</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-4 text-sm font-medium leading-relaxed opacity-80">
        {shortDesc}
      </p>
      <div className="mt-auto pt-6">
        {isRegistered ? (
          waGroupLink ? (
            <a
              href={waGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center justify-center gap-2 border-[3px] border-black py-4 text-center text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] md:text-base ${
                waGroupLink.toLowerCase().includes("discord")
                  ? "bg-[#5865F2]"
                  : "bg-[#18c964]"
              }`}
            >
              {waGroupLink.toLowerCase().includes("discord") ? (
                <>
                  <FaDiscord size={20} /> Grup Discord
                </>
              ) : (
                <>
                  <FaWhatsapp size={20} /> Grup WhatsApp
                </>
              )}
            </a>
          ) : (
            <Button
              variant="yellow-solid"
              fullWidth
              href={`/daftar-event/${eventSlug || eventId}`}
              className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base"
            >
              Lihat Detail Pendaftaran
            </Button>
          )
        ) : isPending ? (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-center gap-2 border-[3px] border-black bg-[#ffd400] py-3 text-center text-xs font-black uppercase text-black shadow-[3px_3px_0_#191b1a] sm:text-sm">
              <span>⌛</span> Menunggu Verifikasi Berkas
            </div>
            <Button
              variant="transparent"
              fullWidth
              href={`/daftar-event/${eventSlug || eventId}`}
              className="flex items-center justify-center py-2.5 text-xs uppercase tracking-wider"
            >
              Cek Status Pendaftaran
            </Button>
          </div>
        ) : (
          <Button
            variant={isActive ? "yellow-solid" : "transparent"}
            fullWidth
            onClick={async (e) => {
              e.preventDefault();
              if (isActive) {
                const isComplete = await requireCompleteProfile(navigate, showAlert);
                if (isComplete) {
                  navigate(`/daftar-event/${eventSlug || eventId}`);
                }
              } else {
                navigate(`/daftar-event/${eventSlug || eventId}`);
              }
            }}
            className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base cursor-pointer"
          >
            {isActive ? (
              <>
                <FiUserPlus size={20} />
                Daftar Sekarang
              </>
            ) : (
              <>Cek Status / Info Pendaftaran</>
            )}
          </Button>
        )}
      </div>
    </article>
  );
};

const EventRegisCard = () => {
  const [eventsData, setEventsData] = React.useState([]);
  const [userEvents, setUserEvents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(0);
  const [isIPB, setIsIPB] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [publicRes, userRes, userCompRes, ipbRes] = await Promise.allSettled([
          getPublicEvents("non_competition"),
          getJoinEvent(),
          getUserCompetitions(),
          checkIpbOrMinetoday(),
        ]);

        if (
          publicRes.status === "fulfilled" &&
          publicRes.value?.success &&
          publicRes.value?.data
        ) {
          setEventsData(publicRes.value.data);
          setCurrentPage(0);
        }

        const combinedUserEvents = [];

        if (userRes.status === "fulfilled") {
          const res = userRes.value;
          const events = res?.data || res;
          const list = events?.data || events?.events || events;
          if (Array.isArray(list)) {
            combinedUserEvents.push(...list);
          }
        }

        if (userCompRes.status === "fulfilled") {
          const compData = userCompRes.value?.data || userCompRes.value;
          const compList = Array.isArray(compData) ? compData : compData?.data || [];
          if (Array.isArray(compList)) {
            compList.forEach((team) => {
              const compId = team?.competition_id || team?.competition?.id || "";
              const compTitle = team?.competition?.title || team?.competition_name || team?.team_name || "";
              combinedUserEvents.push({
                event_id: compId,
                payment_verification: team.is_verified === "approved" ? "accepted" : (team.is_verified || "pending"),
                payment_proof: team.payment_proof?.url || team.paymentProof?.url || null,
                has_payment_proof: Boolean(team.payment_proof || team.paymentProof || team.payment_proof_id),
                event: {
                  id: compId,
                  slug: team?.competition?.slug || (compId.toLowerCase().includes("bootcamp") ? "bootcamp" : compId),
                  title: compTitle,
                  whatsapp_group_link: team?.competition?.whatsapp_group_link || null,
                },
              });
            });
          }
        }

        setUserEvents(combinedUserEvents);

        if (ipbRes.status === "fulfilled" && ipbRes.value?.data) {
          setIsIPB(Boolean(ipbRes.value.data.isIPB));
        }
      } catch (err) {
        console.error("Error fetching event registration data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

              const userReg = userEvents.find((ue) => {
                const ueId = (ue?.event_id || ue?.id || "").toString().toLowerCase();
                const ueSlug = (ue?.event?.slug || ue?.slug || "").toString().toLowerCase();
                const ueTitle = (ue?.event?.title || ue?.title || "").toString().toLowerCase();

                const currentId = (event.id || "").toString().toLowerCase();
                const currentSlug = (event.slug || "").toString().toLowerCase();
                const currentTitle = (event.title || "").toString().toLowerCase();

                if (
                  ueId === currentId ||
                  ueSlug === currentId ||
                  (currentSlug && (ueId === currentSlug || ueSlug === currentSlug))
                ) {
                  return true;
                }

                if (
                  (currentTitle.includes("seminar") || currentSlug.includes("seminar") || currentId.includes("seminar")) &&
                  (ueTitle.includes("seminar") || ueSlug.includes("seminar") || ueId.includes("seminar"))
                ) {
                  return true;
                }
                if (
                  (currentTitle.includes("bootcamp") || currentSlug.includes("bootcamp") || currentId.includes("bootcamp")) &&
                  (ueTitle.includes("bootcamp") || ueSlug.includes("bootcamp") || ueId.includes("bootcamp"))
                ) {
                  return true;
                }
                if (
                  (currentTitle.includes("workshop") || currentSlug.includes("workshop") || currentId.includes("workshop")) &&
                  (ueTitle.includes("workshop") || ueSlug.includes("workshop") || ueId.includes("workshop"))
                ) {
                  return true;
                }

                return false;
              });

              const isAccepted = userReg?.payment_verification === "accepted";
              const isPending = !!userReg && !isAccepted;
              const waGroupLink = isAccepted ? (userReg?.event?.whatsapp_group_link || null) : null;
              const resolvedSlug = event.slug || (
                (event.title || "").toLowerCase().includes("bootcamp")
                  ? "bootcamp"
                  : (event.title || "").toLowerCase().includes("seminar")
                  ? "seminar"
                  : (event.title || "").toLowerCase().includes("workshop")
                  ? "workshop"
                  : event.id
              );

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
                    eventSlug={resolvedSlug}
                    isRegistered={isAccepted}
                    isPending={isPending}
                    waGroupLink={waGroupLink}
                    colorIndex={absoluteIndex}
                    isIPB={isIPB}
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
