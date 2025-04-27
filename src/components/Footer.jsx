import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#452C4C] text-white py-12 w-full">
      <div className="w-full px-5 md:px-8 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-center md:text-left">
          {/* BAGIAN KIRI */}
          <div className="flex flex-col items-center md:items-start justify-start space-y-1">
            <h2 className="text-2xl font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">IT TODAY 2025</h2>
            <p className="font-dm-sans hover:text-pink-400 cursor-pointer">Departemen Ilmu Komputer</p>
            <p className="font-dm-sans hover:text-pink-400 cursor-pointer">IPB University</p>
          </div>

          {/* BAGIAN KANAN */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* EVENTS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <h3 className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">EVENTS</h3>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">National Seminar</p>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">Workshop</p>
            </div>

            {/* COMPETITIONS */}
            <div className="flex flex-col items-center md:items-start space-y-2">
              <h3 className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">COMPETITIONS</h3>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">Game Today</p>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">Hack Today</p>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">UX Today</p>
              <p className="font-dm-sans hover:text-pink-400 cursor-pointer">Mine Today</p>
            </div>

            <div className="flex flex-col items-center md:items-start space-y-4">
              <h3 className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">SOCIAL MEDIA</h3>

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
                      <div className="w-12 h-12 flex items-center justify-center rounded-md hover:scale-105 transition duration-300 ease-in-out">
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
              <h3 className="text-lg font-bold hover:text-pink-400 cursor-pointer font-dm-playfair">KONTAK KAMI</h3>

              <p className="font-dm-sans hover:text-pink-400 cursor-pointer whitespace-nowrap">ittoday2025@gmail.com</p>

              <a
                href="tel:+6281210242743"
                className="font-dm-sans hover:text-pink-400 cursor-pointer"
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
