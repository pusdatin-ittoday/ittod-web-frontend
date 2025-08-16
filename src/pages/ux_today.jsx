import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimelineLomba from '../components/TimeLineLomba';
import PrizepoolSection from '../components/Prizepool';
import ContactUs from './ContactUs';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../api/user';
import { useRegisStatus } from '../hooks/useRegisStatus';

const Ux_Today = () => {
  const navigate = useNavigate();
  const isRegisOpen = useRegisStatus("uxtoday");

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

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

  const handleDaftarClick = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn === "true") {
      isRegisOpen ? navigate("/register-uxtoday") : navigate("/registration-unavailable");
    } else {
      navigate("/login?redirectTo=/dashboard/ikut-event");
    }
  };

  const handleGuidebook = () => {
    window.open("https://ipb.link/uxtoday-rulebook-2025", "_blank");
  };

  const timeline = [
    { title: 'Pendaftaran Batch 1', date: '27 Mei 2025 - 20 Juni 2025' },
    { title: 'Pendaftaran Batch 2', date: '25 Juni 2025 - 28 Juli 2025' },
    { title: 'Batas Submisi', date: '20 Agustus 2025' },
    { title: 'Pengumuman Finalis', date: '10 September 2025' },
    { title: 'Babak Final & Award', date: '27 September 2025' },
  ];

  return (
    <>
      <Navbar />
      <main className="w-full text-white pt-20 px-4 md:px-12 font-dm-sans">
        {/* SECTION: Home */}
        <section className="h-fit mb-0 pb-0">
          {/* Judul */}
          <h1 className="text-5xl md:text-5xl font-playfair font-bold text-center mb-6 drop-shadow-[0_0_10px_#ac6871]">UXTODAY</h1>

          {/* Logo */}
          <div className="flex justify-center mb-6 hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out">
            <img
              src="/logo-competition/UXTODAY.webp"
              alt="UxToday Logo"
              className="w-40 md:w-48 h-auto"
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-center gap-4 mb-8 md:mb-10">
            <button onClick={handleGuidebook} className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer">Guidebook</button>
            <button onClick={handleDaftarClick} className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
              Daftar Sekarang
            </button>
          </div>

          {/* Deskripsi */}
          <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 font-dm-sans mt-8 md:mt-20">
            <div className="max-w-7xl mx-auto bg-[#4D3159] rounded-3xl text-white shadow-[0_0_60px_#AC6871] py-8 md:py-12 px-4 md:px-6 mt-8 md:mt-12 mb-0 md:mb-20">
              <p className="text-base md:text-lg leading-relaxed text-justify text-pink-100 drop-shadow-[0_0_10px_#ffffff77]">
                UXToday merupakan kompetisi UI/UX dalam rangkaian IT Today 2025 yang menantang peserta untuk merancang antarmuka dan pengalaman pengguna yang inovatif, fungsional, dan berpusat pada kebutuhan pengguna, sesuai dengan tema
                yang diusung.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: Timeline */}
        <section className="h-fit mb-0 pb-0 md:mb-0 md:pb-0">
          <TimelineLomba items={timeline}/>
        </section>

        {/* SECTION: Prizepool */}
        <section className="h-fit mb-0 pb-0 md:mb-5 md:pb-5">
          <PrizepoolSection />
        </section>
      </main>
      <ContactUs />
      <Footer />
    </>
  );
};

export default Ux_Today;
