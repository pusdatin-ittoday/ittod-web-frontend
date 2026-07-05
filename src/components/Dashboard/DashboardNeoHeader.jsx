import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../api/user";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Event", to: "/#event" },
  { label: "Competition", to: "/#competition" },
  { label: "Contact Us", to: "/#contact" },
];

const DashboardNeoHeader = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

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
    <>
      <header className="border-b-[5px] border-black bg-indigo-neo text-white">
        <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-10 md:h-20">
          <Link to="/" aria-label="Kembali ke beranda" className="shrink-0">
            <img
              src="/LOGO_ITTODAY_2025.webp"
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

          <button
            type="button"
            onClick={handleLogout}
            className="hidden border-[3px] border-black bg-red-600 px-5 py-2 font-inter text-sm font-black tracking-wider text-white shadow-[5px_5px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none lg:block lg:px-7"
          >
            LOGOUT
          </button>

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
      </header>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden border-t-[3px] border-black bg-indigo-neo transition-all duration-300 lg:hidden ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
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
    </>
  );
};

export default DashboardNeoHeader;
