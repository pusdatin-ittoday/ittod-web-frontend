import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#452C4C] text-white px-6 py-12 mt-auto">
      <div className="max-w-full grid grid-cols-1 md:grid-cols-5 gap-8 text-center md:text-left">
        <div className="md:col-span-1">
          <h2 className="text-2xl font-bold mb-2">IT TODAY 2025</h2>
          <p>
            Departemen Ilmu Komputer
            <br />
            IPB University
          </p>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">EVENTS</h3>
          <ul className="space-y-1">
            <li>National Seminar</li>
            <li>Workshop</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">COMPETITIONS</h3>
          <ul className="space-y-1">
            <li>Game Today</li>
            <li>Hack Today</li>
            <li>UX Today</li>
            <li>Mine Today</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">SOCIAL MEDIA</h3>
          <div className="flex justify-center md:justify-start gap-4">
            {[1, 2, 3, 4].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-300 rounded-sm"
              />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-2">KONTAK KAMI</h3>
          <p className="break-all">ittoday2025@gmail.com</p>
          <p>+6281234567890</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
