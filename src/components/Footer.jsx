import React from 'react';
import { Link } from 'react-router-dom';

const Footer = ({ variant = 'default' }) => {
  const isNeobrutal = variant === 'neobrutal';

  return (
    <footer
      id="contact"
      className={`w-full text-white ${
        isNeobrutal
          ? 'border-t-4 border-black bg-[#191b1a] py-10'
          : 'bg-[#452C4C]/60 py-12'
      }`}
    >
      <div className={`mx-auto w-full px-5 md:px-8 lg:px-10 ${isNeobrutal ? 'max-w-[1600px]' : ''}`}>
        <div className={`grid grid-cols-1 gap-10 text-center md:text-left ${isNeobrutal ? 'sm:grid-cols-2 lg:grid-cols-[1.15fr_4fr]' : 'md:grid-cols-2'}`}>
          {/* BAGIAN KIRI */}
          <div className="flex flex-col items-center md:items-start justify-start space-y-1">
            <a
              href="/"
              className={isNeobrutal ? 'text-2xl font-black italic leading-none text-[#ffd400]' : 'text-xl font-bold hover:text-pink-400 font-dm-playfair'}
            >
              IT TODAY {isNeobrutal ? <><br />2026</> : '2025'}
            </a>
            <p className={isNeobrutal ? 'mt-4 text-[10px] font-bold uppercase text-gray-300' : 'text-sm font-dm-sans hover:text-pink-400'}>
              Departemen Ilmu Komputer
            </p>
            <p className={isNeobrutal ? 'text-[10px] font-bold uppercase text-gray-300' : 'text-sm font-dm-sans hover:text-pink-400'}>
              IPB University
            </p>
          </div>

          {/* BAGIAN KANAN */}
          <div className={`grid grid-cols-1 gap-8 ${isNeobrutal ? 'sm:grid-cols-2 lg:grid-cols-4' : 'md:grid-cols-4'}`}>
            {/* EVENTS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a
                href="/#event"
                className={isNeobrutal ? 'text-xs font-black uppercase tracking-[0.14em]' : 'text-lg font-bold hover:text-pink-400 font-dm-playfair'}
              >
                EVENTS
              </a>
              <Link
                to="/event/Seminar"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                National Seminar
              </Link>
              <Link
                to="/event/Workshop"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                Workshop
              </Link>
              <Link
                to="/event/Bootcamp"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                Bootcamp
              </Link>
            </div>

            {/* COMPETITIONS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a
                href="/#competition"
                className={isNeobrutal ? 'text-xs font-black uppercase tracking-[0.14em]' : 'text-lg font-bold hover:text-pink-400 font-dm-playfair'}
              >
                COMPETITIONS
              </a>
              <Link
                to="/competition/GameToday"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                Game Today
              </Link>
              <Link
                to="/competition/HackToday"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                Hack Today
              </Link>
              <Link
                to="/competition/UXToday"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                UX Today
              </Link>
              <Link
                to="/competition/MineToday"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
              >
                Mine Today
              </Link>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <a
                href="#contact"
                className={isNeobrutal ? 'text-xs font-black uppercase tracking-[0.14em]' : 'text-lg font-bold hover:text-pink-400 font-dm-playfair'}
              >
                SOCIAL MEDIA
              </a>

              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {[
                  {
                    icon: "facebook.svg",
                    url: "https://www.facebook.com/people/Ittoday-Ipb/pfbid023SS24sTjuCxJhY4Q61jr9FKxHfGEMvAQrpjBJWbj9LpdygyCtHwyhWxy7jMtcrCkl/",
                  },
                  { icon: "line.svg", url: "https://line.me/R/ti/p/@ukd0443x" },
                  {
                    icon: "instagram.svg",
                    url: "https://www.instagram.com/ittoday_ipb/",
                  },
                  {
                    icon: "linkedin.svg",
                    url: "https://www.linkedin.com/company/ittoday/",
                  },
                  { icon: "x.svg", url: "https://x.com/ittoday_ipb" },
                  {
                    icon: "tiktok.svg",
                    url: "https://www.tiktok.com/@ittoday_ipb",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex justify-center">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Buka media sosial IT Today ${i + 1}`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center rounded-md hover:scale-155 transition duration-300 ease-in-out">
                        <img
                          src={`/${item.icon}`}
                          alt={`Social Icon ${i + 1}`}
                          className="w-6 h-6 object-contain"
                        />
                      </div>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* KONTAK KAMI */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a
                href="#contact"
                className={isNeobrutal ? 'text-xs font-black uppercase tracking-[0.14em]' : 'text-lg font-bold hover:text-pink-400 font-dm-playfair'}
              >
                KONTAK KAMI
              </a>

              <a
                href="mailto:pr@ittoday.web.id"
                className={`whitespace-nowrap ${isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}`}
              >
                pr@ittoday.web.id
              </a>

              <a
                href="https://wa.me/6281256518375"
                target="_blank"
                rel="noreferrer"
                className={isNeobrutal ? 'text-xs text-gray-300 hover:text-[#ffd400]' : 'text-sm font-dm-sans hover:text-pink-400'}
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
