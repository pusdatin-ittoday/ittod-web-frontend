import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimelineLomba from '../components/TimeLineLomba';
import PrizepoolSection from '../components/Prizepool';
import ContactUs from './ContactUs';
import { getCurrentUser } from '../api/user';
import { getPublicEventById } from '../api/eventPublic';
import { registerTeam } from '../api/compe';
import { useRegisStatus } from '../hooks/useRegisStatus';

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const isRegisOpen = useRegisStatus(eventId);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [eventId]);

  useEffect(() => {
    getCurrentUser()
      .then((response) => {
        if (response.success) {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userId', response.data.id);
        } else {
          localStorage.setItem('isLoggedIn', 'false');
        }
      })
      .catch((error) => {
        console.error('Error fetching current user:', error);
        localStorage.setItem('isLoggedIn', 'false');
      });
  }, []);

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      setError(null);
      const res = await getPublicEventById(eventId);
      if (res.success && res.data) {
        setEventData(res.data);
      } else {
        setError(res.error || 'Event not found');
      }
      setLoading(false);
    };

    fetchEventData();
  }, [eventId]);

  const handleGuidebook = () => {
    if (eventData?.guide_book_url) {
      window.open(eventData.guide_book_url, "_blank");
    }
  };

  const handleDaftarClick = async () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      if (isRegisOpen) {
        if (eventData?.type === 'competition') {
          if (eventData.participation_type === 'individual') {
            const confirmed = window.confirm(
              `Apakah kamu yakin ingin mendaftar ${eventData.title}? Pendaftaran ini bersifat individu dan tidak menggunakan tim.`
            );

            if (!confirmed) {
              return;
            }

            try {
              setIsRegistering(true);
              const response = await registerTeam({
                competition_id: eventData.id,
              });

              if (!response.success) {
                throw new Error(response.error || 'Gagal mendaftar');
              }

              alert('Pendaftaran individu berhasil!');
              navigate('/dashboard/ikut-lomba');
            } catch (registrationError) {
              alert(
                registrationError.message ||
                  'Terjadi kesalahan saat mendaftar kompetisi'
              );
            } finally {
              setIsRegistering(false);
            }
            return;
          }

          navigate(`/register-competition/${eventId}`);
        } else {
          navigate(`/daftar-event/${eventId}`);
        }
      } else {
        navigate("/registration-unavailable");
      }
    } else {
      const redirectPath =
        eventData?.type === 'competition'
          ? '/dashboard/ikut-lomba'
          : '/dashboard/ikut-event';
      navigate(`/login?redirectTo=${encodeURIComponent(redirectPath)}`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-white">
          <p>Loading...</p>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !eventData) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-white">
          <p>{error || 'Event not found'}</p>
        </main>
        <Footer />
      </>
    );
  }

  const timelineItems = (eventData.timelines || []).map(t => ({
    title: t.title,
    date: formatDate(t.date)
  }));

  return (
    <>
      <Navbar />
      <main className="w-full text-white pt-20 px-4 md:px-12 font-dm-sans min-h-screen">
        {/* SECTION: Home */}
        <section className="h-fit mb-0 pb-0">
          {/* Judul */}
          <h1 className="text-5xl md:text-5xl font-playfair font-bold text-center mb-6 drop-shadow-[0_0_10px_#ac6871] uppercase">
            {eventData.title}
          </h1>

          {/* Logo */}
          <div className="flex justify-center mb-6 hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out">
            <img
              src={eventData.logo_url || '/images/DummyImg2.jpeg'}
              alt={`${eventData.title} Logo`}
              className="w-40 md:w-48 h-auto"
              onError={(e) => {
                e.target.src = '/images/DummyImg2.jpeg';
              }}
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-center gap-4 mb-8 md:mb-10">
            {eventData.guide_book_url && (
              <button onClick={handleGuidebook} className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                Guidebook
              </button>
            )}
            <button
              onClick={handleDaftarClick}
              disabled={isRegistering}
              className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isRegistering ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </div>

          {/* Deskripsi */}
          {eventData.description && (
            <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 font-dm-sans mt-8 md:mt-20">
              <div className="max-w-7xl mx-auto bg-[#4D3159] rounded-3xl text-white shadow-[0_0_60px_#AC6871] py-8 md:py-12 px-4 md:px-6 mt-8 md:mt-12 mb-0 md:mb-20">
                <p className="text-base md:text-lg leading-relaxed text-justify text-pink-100 drop-shadow-[0_0_10px_#ffffff77] whitespace-pre-line">
                  {eventData.description}
                </p>
              </div>
            </div>
          )}
        </section>

        {/* SECTION: Timeline */}
        {timelineItems.length > 0 && (
          <section className="h-fit mb-0 pb-0 md:mb-0 md:pb-0">
            <TimelineLomba items={timelineItems}/>
          </section>
        )}

        {/* SECTION: Prizepool (Only for competition) */}
        {eventData.type === 'competition' && (
          <section className="h-fit mb-0 pb-0 md:mb-5 md:pb-5">
            <PrizepoolSection />
          </section>
        )}
      </main>
      <ContactUs />
      <Footer />
    </>
  );
};

export default EventDetail;
