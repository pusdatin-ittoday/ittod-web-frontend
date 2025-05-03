import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#452C4C]/60 text-white py-12 w-full">
      <div className="w-full px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center md:text-left">
          {/* BAGIAN KIRI */}
          <div className="flex flex-col items-center md:items-start justify-start space-y-1">
            <h2 className="text-xl font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">IT TODAY 2025</h2>
            <p className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer">Departemen Ilmu Komputer</p>
            <p className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer">IPB University</p>
          </div>

          {/* BAGIAN KANAN */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* EVENTS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a
                href="#event"
                className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair"
              >
                EVENTS
              </a>
              <Link
                to="/event/national_seminar"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                National Seminar
              </Link>
              <Link
                to="/event/workshop"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                Workshop
              </Link>
            </div>

            {/* COMPETITIONS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <a
                href="#competition"
                className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair"
              >
                COMPETITIONS
              </a>
              <Link
                to="/competition/game_today"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                Game Today
              </Link>
              <Link
                to="/competition/hack_today"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                Hack Today
              </Link>
              <Link
                to="/competition/ux_today"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                UX Today
              </Link>
              <Link
                to="/competition/mine_today"
                className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer"
              >
                Mine Today
              </Link>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <a
                href="#contact"
                className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair"
              >
                SOCIAL MEDIA
              </a>

              <div className="grid grid-cols-3 gap-4 justify-items-center">
                {[
                  { icon: 'facebook.svg', url: 'https://www.facebook.com/people/Ittoday-Ipb/pfbid023SS24sTjuCxJhY4Q61jr9FKxHfGEMvAQrpjBJWbj9LpdygyCtHwyhWxy7jMtcrCkl/' },
                  { icon: 'line.svg', url: 'https://line.me/R/ti/p/@ukd0443x' },
                  { icon: 'instagram.svg', url: 'https://www.instagram.com/ittoday_ipb/' },
                  { icon: 'linkedin.svg', url: 'https://www.linkedin.com/in/it-today-462b51188/' },
                  { icon: 'x.svg', url: 'https://x.com/ittoday_ipb' },
                  { icon: 'tiktok.svg', url: 'https://www.tiktok.com/@ittoday_ipb' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-center"
                  >
                    <a href={item.url}>
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
                className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair"
              >
                KONTAK KAMI
              </a>

              <p className="text-sm font-dm-sans hover:text-pink-400 cursor-pointer whitespace-nowrap">ittoday2025@gmail.com</p>

              <a
                href="https://wa.me/+6281210242743"
                className="font-dm-sans hover:text-pink-400 cursor-pointer text-sm"
              >
                +6281210242743
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
