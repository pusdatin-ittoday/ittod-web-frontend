import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutUser, getAnnouncements, getCurrentUser, markAnnouncementsAsRead } from "../../api/user";
import { FaBell } from "react-icons/fa";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Event", to: "/#event" },
  { label: "Competition", to: "/#competition" },
  { label: "Contact Us", to: "/#contact" },
];

const DashboardNeoHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const [result, userRes] = await Promise.all([
          getAnnouncements(),
          getCurrentUser()
        ]);
        if (result && result.success && result.data) {
          const dataArray = Array.isArray(result.data) ? result.data : Object.values(result.data);
          
          // Filter max 2: prioritize pinned, then latest
          const pinned = dataArray.filter(a => a.is_pinned);
          const unpinned = dataArray.filter(a => !a.is_pinned).sort((a,b) => new Date(b.created_at) - new Date(a.created_at));
          
          let displayAnnouncements = [];
          if (pinned.length > 0) {
            displayAnnouncements.push(pinned[0]);
            if (pinned.length > 1) {
              displayAnnouncements.push(pinned[1]);
            } else if (unpinned.length > 0) {
              displayAnnouncements.push(unpinned[0]);
            }
          } else {
            displayAnnouncements = unpinned.slice(0, 2);
          }
          
          setAnnouncements(displayAnnouncements);
          
          if (dataArray.length > 0) {
            const latest = dataArray.reduce((prev, current) => 
              new Date(current.created_at) > new Date(prev.created_at) ? current : prev
            );
            const lastRead = userRes?.data?.last_read_announcements_at;
            if (!lastRead || new Date(latest.created_at) > new Date(lastRead)) {
              setHasUnread(true);
            }
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const handleLogout = async () => {
    await logoutUser();
    window.location.replace("/login");
  };

  const handleNavClick = (e, link) => {
    if (link.to === "/") {
      if (isHomePage) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else if (link.to.startsWith("/#")) {
      const sectionId = link.to.replace("/#", "");
      if (isHomePage) {
        e.preventDefault();
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        e.preventDefault();
        sessionStorage.setItem("scrollToSectionId", sectionId);
        window.location.href = "/";
      }
    }
    setMobileOpen(false);
  };

  return (
    <header className="relative border-b-[5px] border-black bg-indigo-neo text-white">
        <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10 md:h-20">
          <Link to="/" aria-label="Kembali ke beranda" className="shrink-0">
            <img
              src="/logo-ittod.webp"
              alt="IT Today"
              className="h-14 w-14 object-contain transition-transform duration-200 hover:-rotate-3 hover:scale-105 md:h-20 md:w-20"
            />
          </Link>

          <nav className="hidden items-center gap-9 lg:flex xl:gap-12">
            <Link to="/" className="border-b-[3px] border-transparent py-2 font-inter text-sm font-extrabold tracking-wide text-white transition-colors duration-200 hover:border-yellow-neo hover:text-yellow-neo xl:text-base">
              Home
            </Link>
            <Link to="/#event" className="border-b-[3px] border-transparent py-2 font-inter text-sm font-extrabold tracking-wide text-white transition-colors duration-200 hover:border-yellow-neo hover:text-yellow-neo xl:text-base">
              Event
            </Link>
            <Link to="/#competition" className="border-b-[3px] border-transparent py-2 font-inter text-sm font-extrabold tracking-wide text-white transition-colors duration-200 hover:border-yellow-neo hover:text-yellow-neo xl:text-base">
              Competition
            </Link>
            <Link to="/#contact" className="border-b-[3px] border-transparent py-2 font-inter text-sm font-extrabold tracking-wide text-white transition-colors duration-200 hover:border-yellow-neo hover:text-yellow-neo xl:text-base">
              Contact Us
            </Link>
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            {/* Notification Bell (Desktop) */}
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                        if (!dropdownOpen && hasUnread) {
                            setHasUnread(false);
                            markAnnouncementsAsRead().catch(console.error);
                        }
                    }}
                    className="relative border-[3px] border-black bg-[#FCD400] text-black p-2 shadow-[4px_4px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 z-10 flex h-3 w-3 items-center justify-center rounded-full border border-black bg-red-600">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        </span>
                    )}
                    <FaBell className="text-xl" />
                </button>
                
                {/* Dropdown */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-80 border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000] z-[9999]">
                        <div className="bg-[#FCD400] border-b-[3px] border-black p-3">
                            <h3 className="font-space-grotesk font-black text-black uppercase text-sm">Announcements</h3>
                        </div>
                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                            {announcements.length > 0 ? (
                                announcements.map((ann, idx) => (
                                    <div key={idx} className={`p-3 text-black ${idx !== announcements.length - 1 ? 'border-b-2 border-black/10' : ''} hover:bg-gray-50 transition-colors`}>
                                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{ann.title}</h4>
                                        <p className="text-xs text-gray-600 line-clamp-2">{ann.description}</p>
                                        <div className="mt-2 text-[10px] text-gray-400 font-bold">
                                            {new Date(ann.created_at || ann.date).toLocaleDateString('id-ID')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm font-bold text-gray-500">
                                    Belum ada pengumuman
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => navigate("/dashboard/pengumuman")}
                            className="w-full bg-black text-white p-2 text-xs font-bold uppercase hover:bg-gray-800"
                        >
                            Lihat Semua
                        </button>
                    </div>
                )}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="border-[3px] border-black bg-red-600 px-5 py-2 font-inter text-sm font-black tracking-wider text-white shadow-[5px_5px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none lg:px-7"
            >
              LOGOUT
            </button>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex lg:hidden items-center gap-4">
            {/* Notification Bell (Mobile) */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => {
                        setDropdownOpen(!dropdownOpen);
                        if (!dropdownOpen && hasUnread) {
                            setHasUnread(false);
                            markAnnouncementsAsRead().catch(console.error);
                        }
                    }}
                    className="relative flex items-center justify-center border-[3px] border-black bg-[#FCD400] text-black w-[40px] h-[40px] p-1 shadow-[3px_3px_0_#111]"
                >
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 z-10 flex h-3 w-3 items-center justify-center rounded-full border border-black bg-red-600">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        </span>
                    )}
                    <FaBell className="text-xl" />
                </button>

                {/* Dropdown (Mobile) */}
                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000] z-[9999]">
                        <div className="bg-[#FCD400] border-b-[3px] border-black p-3">
                            <h3 className="font-space-grotesk font-black text-black uppercase text-sm">Announcements</h3>
                        </div>
                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                            {announcements.length > 0 ? (
                                announcements.map((ann, idx) => (
                                    <div key={idx} className={`p-3 text-black ${idx !== announcements.length - 1 ? 'border-b-2 border-black/10' : ''} hover:bg-gray-50 transition-colors`}>
                                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{ann.title}</h4>
                                        <p className="text-xs text-gray-600 line-clamp-2">{ann.description}</p>
                                        <div className="mt-2 text-[10px] text-gray-400 font-bold">
                                            {new Date(ann.created_at || ann.date).toLocaleDateString('id-ID')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center text-sm font-bold text-gray-500">
                                    Belum ada pengumuman
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/dashboard/pengumuman");
                            }}
                            className="w-full bg-black text-white p-2 text-xs font-bold uppercase hover:bg-gray-800"
                        >
                            Lihat Semua
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile hamburger */}
            <button
            className="flex cursor-pointer flex-col gap-1.5 border-2 border-black bg-yellow-neo p-2 shadow-[3px_3px_0_#111] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
          >
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-black transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
            </button>
          </div>
        </div>

      {/* Mobile menu */}
      <div
        className={`absolute top-full right-4 z-[9999] mt-2 w-60 border-[3px] border-black bg-indigo-neo shadow-[6px_6px_0_#000000] transition-all duration-200 lg:hidden ${
          mobileOpen
            ? 'visible opacity-100 translate-y-0'
            : 'invisible opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <ul className="space-y-2 px-5 py-5">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.to}
                onClick={(e) => handleNavClick(e, link)}
                className="block border-2 border-transparent px-3 py-2 font-inter font-bold text-white transition-colors duration-200 hover:border-black hover:bg-yellow-neo hover:text-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-3 border-t border-white/20">
            <div className="space-y-2">
              <Link
                to="/dashboard/beranda"
                onClick={() => setMobileOpen(false)}
                className="block border-[3px] border-black bg-[#22b64b] py-2.5 text-center font-inter font-black text-white shadow-[4px_4px_0_#111]"
              >
                PROFILE
              </Link>
              <button
                type="button"
                onClick={() => {
                  handleLogout();
                  setMobileOpen(false);
                }}
                className="block w-full border-[3px] border-black bg-red-600 py-2.5 text-center font-inter font-black text-white shadow-[4px_4px_0_#111] cursor-pointer"
              >
                LOGOUT
              </button>
            </div>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default DashboardNeoHeader;
