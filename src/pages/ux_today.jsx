import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TimelineLomba from '../components/TimeLineLomba';
import PrizepoolSection from '../components/Prizepool';
import ContactUs from './ContactUs';

const Ux_Today = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <main className="w-full text-white pt-20 px-4 md:px-12 font-dm-sans">
        {/* SECTION: Home */}
        <section className="min-h-screen mb-0 pb-0">
          {/* Judul */}
          <h1 className="text-5xl md:text-5xl font-playfair font-bold text-center mb-6 drop-shadow-[0_0_10px_#ac6871]">UXTODAY</h1>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src="/logo-competition/UXTODAY.webp"
              alt="UxToday Logo"
              className="w-40 md:w-48 h-auto"
            />
          </div>

          {/* Tombol */}
          <div className="flex justify-center gap-4 mb-8 md:mb-10">
            <button className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer">Guidebook</button>
            <button className="font-dm-sans font-bold bg-gradient-to-r custom-button-bg text-white py-3 px-4 rounded-lg custom-button-shadow button-hover hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
              Daftar Sekarang
            </button>
          </div>

          {/* Deskripsi */}
          <div className="w-full px-4 sm:px-6 md:px-10 lg:px-12 xl:px-16 font-dm-sans mt-8 md:mt-20">
            <div className="max-w-7xl mx-auto bg-[#4D3159] rounded-3xl text-white shadow-[0_0_60px_#AC6871] py-8 md:py-12 px-4 md:px-6 mt-8 md:mt-12 mb-0 md:mb-20">
              <p className="text-base md:text-lg leading-relaxed text-justify text-pink-100 drop-shadow-[0_0_10px_#ffffff77]">
                  UXToday merupakan kompetisi UI/UX dalam rangkaian IT Today 2025 yang menantang peserta untuk merancang antarmuka dan pengalaman pengguna yang inovatif, fungsional, dan berpusat pada kebutuhan pengguna, sesuai dengan tema yang diusung.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: Timeline */}
        <section className="min-h-screen mb-0 pb-0 md:mb-0 md:pb-0">
          <TimelineLomba />
        </section>

        {/* SECTION: Prizepool */}
        <section className="min-h-screen mb-0 pb-0 md:mb-20 md:pb-20">
          <PrizepoolSection />
        </section>
      </main>
      <ContactUs />
      <Footer />
    </>
  );
};

export default Ux_Today;
