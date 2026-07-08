import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';
import { DEFAULT_CONTACTS } from '../../data/contacts';

/**
 * Shared Footer Neo-Brutalisme — dipakai di seluruh halaman.
 * Data event dan kompetisi selalu mengikuti API.
 */


const socialLinks = [
  { icon: '/instagram.svg', url: 'https://www.instagram.com/ittoday_ipb/', label: 'Instagram' },
  { icon: '/linkedin.svg', url: 'https://www.linkedin.com/company/ittoday/', label: 'LinkedIn' },
  { icon: '/tiktok.svg', url: 'https://www.tiktok.com/@ittoday_ipb', label: 'TikTok' },
];

const FooterNeo = () => {
  const [footerEvents, setFooterEvents] = useState([]);
  const [footerCompetitions, setFooterCompetitions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, compsRes] = await Promise.all([
          getEvents('non_competition'),
          getEvents('competition')
        ]);
        
        if (eventsRes.success && eventsRes.data) {
          setFooterEvents(eventsRes.data);
        }
        if (compsRes.success && compsRes.data) {
          setFooterCompetitions(compsRes.data);
        }
      } catch (error) {
        console.error("Error fetching footer data:", error);
      }
    };
    
    fetchData();
  }, []);

  return (
    <footer className="border-t-[5px] border-black bg-[#171918] pb-6 pt-14 text-white">
      <div className="mx-auto max-w-[90rem] px-6 md:px-10">
        <div className="mb-16 grid grid-cols-1 gap-10 text-center md:grid-cols-5 md:gap-8 lg:gap-12 md:text-left">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="mb-6 font-bebas text-4xl italic leading-[0.9] tracking-wider text-yellow-neo">
              IT TODAY<br />2026
            </h2>
            <div className="space-y-1.5 font-inter text-sm font-medium text-gray-300">
              <p>Departemen Ilmu Komputer</p>
              <p>IPB University</p>
            </div>
          </div>

          {/* Events Column */}
          <div>
            <h3 className="mb-6 font-bebas text-xl tracking-wider text-yellow-neo">EVENTS</h3>
            <ul className="space-y-4">
              {footerEvents.map((item) => (
                <li key={item.id}>
                  <Link to={`/event/${item.id}`} className="font-inter text-[13px] font-medium text-gray-300 transition-colors duration-200 hover:text-yellow-neo">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitions Column */}
          <div>
            <h3 className="mb-6 font-bebas text-xl tracking-wider text-yellow-neo">COMPETITIONS</h3>
            <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-2">
              {footerCompetitions.map((item) => (
                <Link 
                  key={item.id} 
                  to={`/competition/${item.id}`} 
                  className="font-inter text-[13px] font-medium text-gray-300 transition-colors duration-200 hover:text-yellow-neo"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 className="mb-6 font-bebas text-xl tracking-wider text-yellow-neo">SOCIAL MEDIA</h3>
            <div className="grid w-fit grid-cols-3 gap-4 mx-auto md:mx-0">
              {socialLinks.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-7 w-7 items-center justify-center border-2 border-transparent p-1 transition-all duration-150 hover:border-yellow-neo"
                  aria-label={item.label}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-full w-full object-contain"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="mb-6 font-bebas text-xl tracking-wider text-yellow-neo">KONTAK KAMI</h3>
            <div className="flex flex-col gap-3 font-inter text-[13px] text-gray-300">
              <a href={`mailto:${DEFAULT_CONTACTS.email}`} className="hover:text-white transition-colors">
                {DEFAULT_CONTACTS.email}
              </a>
              <a href={`tel:+${DEFAULT_CONTACTS.phone}`} className="hover:text-white transition-colors">
                {DEFAULT_CONTACTS.formattedPhone}
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t-2 border-[#343735] pt-6 font-inter text-[10px] font-bold uppercase tracking-widest text-gray-500 md:flex-row">
          <p>© 2026 IT TODAY</p>
          <div className="flex items-center gap-8">
            <Link to="#" className="hover:text-gray-300 transition-colors">PRIVACY</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">TERMS</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">BRAND</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterNeo;
