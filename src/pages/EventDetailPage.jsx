import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import AgendaSidebar from '../components/ui/AgendaSidebar';
import GetInTouchSection from '../components/home/GetInTouchSection';
import { getEventBySlug } from '../services/eventService';

/**
 * Event Detail Page — template tunggal, render berdasarkan :slug dari API.
 * Layout 2 kolom: AboutEventCard + EventInfoSidebar.
 */
const EventDetailPage = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    const fetchEvent = async () => {
      const response = await getEventBySlug(slug);
      if (response.success && response.data) {
        // Map API fields to UI fields
        const apiData = response.data;
        const formattedEvent = {
          ...apiData,
          tagline: `${apiData.title.toUpperCase()} // 2026`,
          icon: apiData.logo_url,
        };
        setEvent(formattedEvent);
      }
      setLoading(false);
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <>
        <NavbarNeo />
        <main className="min-h-screen flex flex-col items-center justify-center bg-white pt-20">
          <div className="text-center px-4">
            <h1 className="font-bebas text-4xl text-black mb-4">Loading...</h1>
          </div>
        </main>
        <FooterNeo />
      </>
    );
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

                  {/* CTA: Daftar Sekarang */}
                  <Button
                    variant="yellow-solid"
                    fullWidth
                    href={`/daftar-event/${slug}`}
                    className="flex items-center justify-center gap-2 py-4 text-sm uppercase tracking-wider md:text-base"
                  >
                    <FiUserPlus size={20} /> Daftar Sekarang
                  </Button>
                </div>
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
