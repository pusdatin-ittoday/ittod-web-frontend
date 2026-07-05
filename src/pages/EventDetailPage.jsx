import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import PageBanner from '../components/ui/PageBanner';
import Button from '../components/ui/Button';
import EventInfoSidebar from '../components/event/EventInfoSidebar';
import GetInTouchSection from '../components/home/GetInTouchSection';
import { getEventBySlug } from '../services/eventService';

const getDefaultImage = (title) => {
  if (!title) return '/logo-event/SEMINAR-NASIONAL.webp';
  const t = title.toLowerCase();
  if (t.includes('bootcamp')) return '/logo-event/BOOTCAMP.webp';
  if (t.includes('workshop')) return '/logo-event/WORKSHOP.webp';
  return '/logo-event/SEMINAR-NASIONAL.webp';
};

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
        const mainDate = apiData.timelines && apiData.timelines.length > 0 
          ? new Date(apiData.timelines[0].date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'TBA';
        const formattedEvent = {
          ...apiData,
          tagline: `${apiData.title.toUpperCase()} // 2026`,
          icon: apiData.logo_url || getDefaultImage(apiData.title),
          date: mainDate,
          time: 'TBA',
          registrationFee: apiData.price > 0 ? `Rp ${apiData.price.toLocaleString('id-ID')}` : 'Gratis',
          benefits: []
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
    <>
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        {/* Banner */}
        <PageBanner icon={event.icon} title={event.title} subtitle={event.tagline} />

        {/* 2-column layout */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: About card */}
              <div className="lg:col-span-2">
                <div className="card-brutal-no-hover rounded-lg p-6 md:p-8">
                  <h2 className="font-bebas text-3xl md:text-4xl text-black tracking-wider mb-6 uppercase">
                    About The {event.title.split(' ').pop().toUpperCase()}
                  </h2>

                  <p className="font-inter text-base text-gray-700 leading-relaxed mb-8 whitespace-pre-wrap">
                    {event.description}
                  </p>

                  {/* CTA: Daftar Sekarang */}
                  <Button
                    variant="yellow-solid"
                    fullWidth
                    href={`/daftar-event/${slug}`}
                    className="text-lg py-4 flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <FiUserPlus size={20} /> Daftar Sekarang
                  </Button>
                </div>
              </div>

              {/* Right: Sidebar */}
              <div className="lg:col-span-1">
                <EventInfoSidebar event={event} />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Us banner */}
        <GetInTouchSection compact />
      </main>
      <FooterNeo />
    </>
  );
};

export default EventDetailPage;
