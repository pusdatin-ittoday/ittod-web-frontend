import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../../services/eventService';

/**
 * Footer Neo-Brutalisme — background hitam, border-top kuning, 4 kolom.
 */


const socialLinks = [
  { icon: '/instagram.svg', url: 'https://www.instagram.com/ittoday_ipb/', label: 'Instagram' },
  { icon: '/linkedin.svg', url: 'https://www.linkedin.com/company/ittoday/', label: 'LinkedIn' },
  { icon: '/x.svg', url: 'https://x.com/ittoday_ipb', label: 'X' },
  { icon: '/tiktok.svg', url: 'https://www.tiktok.com/@ittoday_ipb', label: 'TikTok' },
  { icon: '/facebook.svg', url: 'https://www.facebook.com/people/Ittoday-Ipb/', label: 'Facebook' },
  { icon: '/line.svg', url: 'https://line.me/R/ti/p/@ukd0443x', label: 'LINE' },
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
    <footer className="bg-[#1a1a1a] border-t-0 text-white pb-6 pt-16">
      <div className="max-w-[85rem] mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <h2 className="font-bebas italic text-4xl text-yellow-neo tracking-wider leading-[0.9] mb-6">
              IT TODAY<br />2026
            </h2>
            <div className="font-inter text-sm text-gray-300 space-y-1.5">
              <p>Departemen Ilmu Komputer</p>
              <p>IPB University</p>
            </div>
          </div>

          {/* Events Column */}
          <div>
            <h3 className="font-bebas text-xl text-yellow-neo tracking-wider mb-6">EVENTS</h3>
            <ul className="space-y-4">
              {footerEvents.map((item) => (
                <li key={item.id}>
                  <Link to={`/event/${item.id}`} className="font-inter text-[13px] text-gray-300 hover:text-white transition-colors duration-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Competitions Column */}
          <div>
            <h3 className="font-bebas text-xl text-yellow-neo tracking-wider mb-6">COMPETITIONS</h3>
            <ul className="space-y-4">
              {footerCompetitions.map((item) => (
                <li key={item.id}>
                  <Link to={`/competition/${item.id}`} className="font-inter text-[13px] text-gray-300 hover:text-white transition-colors duration-200">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Column */}
          <div>
            <h3 className="font-bebas text-xl text-yellow-neo tracking-wider mb-6">SOCIAL MEDIA</h3>
            <div className="flex gap-4">
              {socialLinks.slice(0, 4).map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-6 h-6 flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
                  aria-label={item.label}
                >
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-full h-full object-contain invert brightness-0"
                  />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-bebas text-xl text-yellow-neo tracking-wider mb-6">KONTAK KAMI</h3>
            <div className="flex flex-col gap-3 font-inter text-[13px] text-gray-300">
              <a href="mailto:pr@ittoday.web.id" className="hover:text-white transition-colors">
                pr@ittoday.web.id
              </a>
              <a href="tel:+6281256518375" className="hover:text-white transition-colors">
                +6281256518375
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#333] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-inter text-[10px] text-gray-500 uppercase tracking-widest font-bold">
          <p>© 2026 MODERN BRUTALIST ZINE</p>
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
