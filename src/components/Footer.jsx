import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="bg-[#111111] text-white py-12 md:py-16 w-full border-t border-black/10 select-none">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8">
          
          {/* Column 1: Branding / Identitas */}
          <div className="flex flex-col space-y-4">
            <h2 className="text-3xl font-black italic tracking-wide font-sans text-[#FBBF24] leading-tight">
              IT TODAY <br /> 2026
            </h2>
            <div className="text-[10px] md:text-xs font-bold tracking-widest text-gray-400 space-y-1 uppercase font-sans">
              <p>DEPARTEMEN ILMU KOMPUTER</p>
              <p>IPB UNIVERSITY</p>
            </div>
          </div>

          {/* Column 2: EVENTS */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-black tracking-widest text-white uppercase font-sans">
              EVENTS
            </h3>
            <ul className="flex flex-col space-y-2.5 font-sans">
              <li>
                <a
                  href="/event#national-seminar"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  National Seminar
                </a>
              </li>
              <li>
                <a
                  href="/event#workshop"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  Workshop
                </a>
              </li>
              <li>
                <a
                  href="/event#bootcamp"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  Bootcamp
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: COMPETITIONS */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-black tracking-widest text-white uppercase font-sans">
              COMPETITIONS
            </h3>
            <ul className="flex flex-col space-y-2.5 font-sans">
              <li>
                <a
                  href="/competition#game-today"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  Game Today
                </a>
              </li>
              <li>
                <a
                  href="/competition#hack-today"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  Hack Today
                </a>
              </li>
              <li>
                <a
                  href="/competition#ux-today"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  UX Today
                </a>
              </li>
              <li>
                <a
                  href="/competition#mine-today"
                  className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 font-medium"
                >
                  Mine Today
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: SOCIAL MEDIA */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-black tracking-widest text-white uppercase font-sans">
              SOCIAL MEDIA
            </h3>
            <div className="flex flex-row items-center gap-4">
              <a
                href="https://www.facebook.com/people/Ittoday-Ipb/pfbid023SS24sTjuCxJhY4Q61jr9FKxHfGEMvAQrpjBJWbj9LpdygyCtHwyhWxy7jMtcrCkl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FBBF24] text-xl transition-colors duration-200"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
              <a
                href="https://www.instagram.com/ittoday_ipb/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FBBF24] text-xl transition-colors duration-200"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.linkedin.com/company/ittoday/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FBBF24] text-xl transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a
                href="https://x.com/ittoday_ipb"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#FBBF24] text-xl transition-colors duration-200"
                aria-label="Twitter X"
              >
                <FaXTwitter />
              </a>
            </div>
          </div>

          {/* Column 5: KONTAK KAMI */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-black tracking-widest text-white uppercase font-sans">
              KONTAK KAMI
            </h3>
            <div className="flex flex-col space-y-2.5 font-sans">
              <a
                href="mailto:pr@ittoday.web.id"
                className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200 break-words"
              >
                pr@ittoday.web.id
              </a>
              <a
                href="https://wa.me/6281256518375"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs md:text-sm text-gray-400 hover:text-[#FBBF24] transition-colors duration-200"
              >
                +6281256518375
              </a>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
