import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import { FaWhatsapp, FaDiscord } from 'react-icons/fa';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import AgendaSidebar from '../components/ui/AgendaSidebar';
import GetInTouchSection from '../components/home/GetInTouchSection';
import { getEventBySlug } from '../services/eventService';
import { getJoinEvent } from '../utils/api/event';
import { checkIpbOrMinetoday } from '../api/user';
import LoadingState from '../components/ui/LoadingState';
import EventGallery from '../components/event/EventGallery';
import { getEventGalleryImages, getEventGalleryLabel } from '../data/eventGalleryData';

const formatWaLink = (num) => {
  if (!num) return '#';
  let clean = num.toString().replace(/[^0-9]/g, "");
  if (clean.startsWith("0")) {
    clean = "62" + clean.slice(1);
  }
  return `https://wa.me/${clean}`;
};

const cleanDisplayNumber = (num) => {
  if (!num) return '';
  return num.toString()
    .replace(/^(https?:\/\/)?(www\.)?wa\.me\//i, "")
    .trim();
};

/**
 * Event Detail Page — template tunggal, render berdasarkan :slug dari API.
 * Layout 2 kolom: AboutEventCard + EventInfoSidebar.
 */
const EventDetailPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [userWaLink, setUserWaLink] = useState("");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchEvent = async () => {
      const response = await getEventBySlug(slug);
      if (response.success && response.data) {
        // Map API fields to UI fields
        const apiData = response.data;
        if (apiData.title) {
          document.title = `${apiData.title} - IT TODAY 2026`;
        }
        const formattedEvent = {
          ...apiData,
          tagline: `${apiData.title.toUpperCase()} // 2026`,
          icon: apiData.logo_url,
        };
        setEvent(formattedEvent);

        // Check user registration status
        try {
          const [userRes, ipbRes] = await Promise.allSettled([
            getJoinEvent(),
            checkIpbOrMinetoday(),
          ]);

          let isIPB = false;
          if (ipbRes.status === "fulfilled" && ipbRes.value?.data) {
            isIPB = Boolean(ipbRes.value.data.isIPB);
          }

          if (userRes.status === "fulfilled") {
            const userEventsData = userRes.value?.data || userRes.value;
            const list = userEventsData?.data || userEventsData?.events || userEventsData;
            if (Array.isArray(list)) {
              const matched = list.find((ue) => {
                const ueId = (ue?.event_id || ue?.id || "").toString().toLowerCase();
                const ueSlug = (ue?.event?.slug || ue?.slug || "").toString().toLowerCase();
                const ueTitle = (ue?.event?.title || ue?.title || "").toString().toLowerCase();

                const curId = (apiData.id || "").toString().toLowerCase();
                const curSlug = (apiData.slug || slug || "").toString().toLowerCase();
                const curTitle = (apiData.title || "").toString().toLowerCase();

                if (ueId === curId || ueSlug === curId || (curSlug && (ueId === curSlug || ueSlug === curSlug))) return true;
                if (curTitle.includes("seminar") && ueTitle.includes("seminar")) return true;
                if (curTitle.includes("bootcamp") && ueTitle.includes("bootcamp")) return true;
                if (curTitle.includes("workshop") && ueTitle.includes("workshop")) return true;
                return false;
              });

              const isBootcamp = (apiData.title || "").toLowerCase().includes("bootcamp");
              const isFreeForUser = apiData.price === 0 || (isBootcamp && isIPB);
              const isAccepted = matched && (matched.payment_verification === "accepted" || isFreeForUser);
              const isPending = !!matched && !isAccepted;

              if (isAccepted) {
                setIsRegistered(true);
                setUserWaLink(matched.event?.whatsapp_group_link || "");
              } else if (isPending) {
                setIsPendingVerification(true);
              }
            }
          }
        } catch {
          // Ignore if user is not logged in or fails to fetch joined events
        }
      }
      setLoading(false);
      window.scrollTo(0, 0);
    };
    fetchEvent();
  }, [slug]);

  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  if (loading) {
    return <LoadingState />;
  }

  // 404 fallback
  if (!event) {
    return (
      <>
        <NavbarNeo />
        <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
          <div className="text-center px-4">
            <h1 className="font-bebas text-6xl text-black mb-4">EVENT NOT FOUND</h1>
            <p className="font-inter text-gray-600 mb-8">
              Event tidak ditemukan.
            </p>
            <Button variant="indigo-solid" href="/">
              ← Kembali ke Home
            </Button>
          </div>
        </main>
        <FooterNeo />
      </>
    );
  }

  const effectiveWaLink = userWaLink || event.whatsapp_group_link;

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-black">
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        {/* Banner */}
        <PageBanner
          icon={event.icon}
          title={event.title}
          subtitle={event.tagline}
          variant="event"
        />

        {/* 2-column layout */}
        <section className="w-full bg-[#f7f7f4] py-12 md:py-20">
          <div className="mx-auto max-w-6xl px-5 md:px-8">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(260px,0.72fr)]">
              {/* Left: About card */}
              <div>
                <div className="border-[3px] border-black bg-white p-6 shadow-[8px_8px_0_#111] transition-transform duration-300 hover:-translate-y-1 md:p-9">
                  <h2 className="mb-5 w-fit border-b-[4px] border-yellow-neo pb-2 font-inter text-2xl font-black uppercase leading-tight text-[#171918] md:text-4xl">
                    About The {event.title}
                  </h2>

                  <p className="mb-9 whitespace-pre-wrap font-inter text-sm leading-relaxed text-[#2e3238] md:text-base">
                    {event.description}
                  </p>

                  {/* CTA: WhatsApp Link if Registered / Pending State if Pending / Daftar Sekarang if Not */}
                  {isRegistered ? (
                    userWaLink ? (
                      <a
                        href={userWaLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex w-full items-center justify-center gap-2 border-[3px] border-black py-4 text-center font-inter text-sm font-black uppercase tracking-wider text-white shadow-[4px_4px_0_#111] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#111] md:text-base ${
                          userWaLink.toLowerCase().includes("discord")
                            ? "bg-[#5865F2]"
                            : "bg-[#18c964]"
                        }`}
                      >
                        {userWaLink.toLowerCase().includes("discord") ? (
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
                        href={`/daftar-event/${slug}`}
                        className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base"
                      >
                        <FaWhatsapp size={20} />
                        Grup WhatsApp
                      </Button>
                    )
                  ) : isPendingVerification ? (
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-center gap-2 border-[3px] border-black bg-[#ffd400] py-3.5 text-center font-inter text-sm font-black uppercase tracking-wider text-black shadow-[4px_4px_0_#111]">
                        <span>⌛</span> Menunggu Verifikasi Pembayaran
                      </div>
                      <Button
                        variant="transparent"
                        fullWidth
                        href={`/daftar-event/${slug}`}
                        className="flex items-center justify-center gap-2 py-3 text-xs uppercase tracking-wider md:text-sm"
                      >
                        Cek Status / Upload Bukti Pembayaran
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant={event.is_active ? "yellow-solid" : "transparent"}
                      fullWidth
                      href={event.is_active ? `/daftar-event/${slug}` : undefined}
                      disabled={!event.is_active}
                      className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base"
                    >
                      {event.is_active ? (
                        <>
                          <FiUserPlus size={20} />
                          Daftar Sekarang
                        </>
                      ) : (
                        <>Pendaftaran Ditutup/Belum Dibuka</>
                      )}
                    </Button>
                  )}

                  {/* Contact Person */}
                  {(event.contact_person1 || event.contact_person2) && (
                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <p className="font-inter text-xs font-black uppercase tracking-wider text-gray-400">
                        Contact Person
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {event.contact_person1 && (
                          <a
                            href={formatWaLink(event.contact_person1)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border-2 border-black bg-[#f7f7f4] px-3 py-1.5 font-inter text-xs font-black text-black shadow-[3px_3px_0_#000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] hover:bg-yellow-neo"
                          >
                            <FaWhatsapp size={14} className="text-[#25D366]" />
                            <span>{cleanDisplayNumber(event.contact_person1)}</span>
                          </a>
                        )}
                        {event.contact_person2 && (
                          <a
                            href={formatWaLink(event.contact_person2)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 border-2 border-black bg-[#f7f7f4] px-3 py-1.5 font-inter text-xs font-black text-black shadow-[3px_3px_0_#000] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_#000] hover:bg-yellow-neo"
                          >
                            <FaWhatsapp size={14} className="text-[#25D366]" />
                            <span>{cleanDisplayNumber(event.contact_person2)}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Gallery — di bawah About card, terbatas kolom kiri, tidak muncul untuk codetoday */}
                {slug !== 'codetoday' && slug !== 'code-today' && (() => {
                  const galleryImages = getEventGalleryImages(slug);
                  const galleryLabel = getEventGalleryLabel(slug);
                  return galleryImages ? (
                    <div className="mt-8 overflow-hidden">
                      <EventGallery
                        images={galleryImages}
                        title={`Dokumentasi ${galleryLabel}`}
                      />
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Right: Sidebar */}
              <div>
                <AgendaSidebar timelines={event.timelines} type="event" />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us banner */}
        <GetInTouchSection compact />
      </main>
      <FooterNeo />
    </div>
  );
};

export default EventDetailPage;
