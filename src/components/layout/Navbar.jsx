import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * Navbar Neo-Brutalisme — background indigo, auth-aware.
 * Menampilkan LOGIN (kuning) saat belum login, badge PROFILE (hijau) saat sudah login.
 */
const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Event', to: '/#event' },
  { label: 'Competition', to: '/#competition' },
  { label: 'Contact Us', to: '/#contact' },
];

const NavbarNeo = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const isHomePage = location.pathname === '/' || location.pathname === '/home';

  const handleNavClick = (e, link) => {
    if (link.to === '/') {
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else if (link.to.startsWith('/#')) {
      const sectionId = link.to.replace('/#', '');
      if (isHomePage) {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // Navigate to home, then scroll
        e.preventDefault();
        sessionStorage.setItem('scrollToSectionId', sectionId);
        window.location.href = '/';
      }
    }
    setMobileOpen(false);
  };

  return (
    <nav className="fixed w-full top-0 z-[999] bg-indigo-neo border-b-4 border-black shadow-[0_4px_0px_#000]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/LOGO_ITTODAY_2025.webp"
              alt="IT Today Logo"
              className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-110 transition-transform duration-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/56x56/3730A3/ffffff?text=IT';
              }}
            />
            <span className="font-bebas text-2xl md:text-3xl text-white tracking-wider hidden sm:block">
              IT TODAY
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className="font-inter font-semibold text-white hover:text-yellow-neo transition-colors duration-200 text-base tracking-wide"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth button */}
          <div className="hidden lg:flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                to="/dashboard/beranda"
                className="bg-[#00b14f] text-white font-inter font-bold px-8 py-2.5 rounded-sm border-2 border-black shadow-[4px_4px_0px_#000] hover:shadow-[6px_6px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200 tracking-wider"
              >
                PROFILE
              </Link>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 bg-yellow-neo text-black font-inter font-bold px-6 py-2.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all duration-200"
              >
                LOGIN
              </Link>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 cursor-pointer p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                mobileOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 border-t-2 border-black bg-indigo-neo ${
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <ul className="px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className="block font-inter font-semibold text-white hover:text-yellow-neo transition-colors duration-200 py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 border-t border-white/20">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard/beranda"
                  className="block text-center bg-emerald-500 text-white font-inter font-bold py-2.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000]"
                >
                  PROFILE
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="block w-full text-center text-white/70 hover:text-white font-inter font-medium py-2 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block text-center bg-yellow-neo text-black font-inter font-bold py-2.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000]"
              >
                LOGIN
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavbarNeo;
