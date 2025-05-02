import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const ContactUs = () => {
  return (
    <>
      <div className="flex flex-col lg:pt-15 pt-5 lg:pb-10 pb-5">
        {/* Konten utama */}
        <main className="flex flex-col flex-grow justify-end">
          <div className="w-full px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16">
            <div className="max-w-6xl mx-auto bg-[#4D3159] rounded-3xl text-white shadow-[0_0_60px_#AC6871] py-12 px-6 mb-6">
              {/* Judul */}
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-white drop-shadow-[0_0_10px_#ffffff77] text-center md:text-left font-dm-playfair">CONTACT US</h1>

              {/* Konten isi dan tombol */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6">
                {/* Paragraf */}
                <p className="font-dm-sans text-base md:text-lg leading-relaxed text-pink-200 drop-shadow-[0_0_10px_#ffffff77] max-w-3xl text-justify md:text-left">
                  We sincerely express our appreciation to our sponsor for their generous support and confidence in IT-TODAY 2025.
                </p>

                {/* Tombol */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center md:justify-end">
                  <a
                    href="https://wa.me/081210242743"
                    className="font-dm-sans font-bold bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-3 px-6 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out"
                  >
                    Kontak Kami
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ContactUs;
