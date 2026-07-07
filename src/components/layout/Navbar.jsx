import React, { useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { tapPress } from "../../lib/motion";

/**
 * Navbar Neo-Brutalisme — background indigo, auth-aware.
 * Menampilkan LOGIN (kuning) saat belum login, badge PROFILE (hijau) saat sudah login.
 */
const navLinks = [
  { label: "Home", to: "/" },
  { label: "Event", to: "/#event" },
  { label: "Competition", to: "/#competition" },
  { label: "Contact Us", to: "/#contact" },
];

const MotionLink = Motion.create(Link);

const NavbarNeo = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === "/" || location.pathname === "/home";

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    await logout();
    setMobileOpen(false);
    navigate("/login", { replace: true });
    setIsLoggingOut(false);
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
        // Navigate to home, then scroll
        e.preventDefault();
        sessionStorage.setItem("scrollToSectionId", sectionId);
        window.location.href = "/";
      }
    }
    setMobileOpen(false);
  };

  return (
    <Motion.nav
      className="fixed inset-x-0 top-0 z-[999] border-b-[5px] border-black bg-indigo-neo text-white"
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    >
      <div className="mx-auto max-w-[1500px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <MotionLink
            to="/"
            className="group flex shrink-0 items-center"
            aria-label="IT Today Home"
            whileHover={{ rotate: -4, scale: 1.06 }}
            whileTap={tapPress}
          >
            <img
              src="/logo-ittod.webp"
              alt="IT Today Logo"
              className="h-14 w-14 object-contain transition-transform duration-200 group-hover:-rotate-3 group-hover:scale-105 md:h-20 md:w-20"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/80x80/3730A3/ffffff?text=IT";
              }}
            />
          </MotionLink>

          {/* Desktop menu */}
          <ul className="hidden items-center gap-9 lg:flex xl:gap-12">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={(e) => handleNavClick(e, link)}
                  className="border-b-[3px] border-transparent py-2 font-inter text-sm font-extrabold tracking-wide text-white transition-colors duration-200 hover:border-yellow-neo hover:text-yellow-neo xl:text-base"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop auth button */}
          <div className="hidden min-w-[150px] items-center justify-end lg:flex">
            {isAuthenticated ? (
              <MotionLink
                to="/dashboard/beranda"
                whileHover={{ x: -3, y: -3 }}
                whileTap={tapPress}
                className="border-[3px] border-black bg-[#22b64b] px-8 py-3 font-inter text-sm font-black tracking-wider text-white shadow-[6px_6px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                PROFILE
              </MotionLink>
            ) : (
              <MotionLink
                to="/login"
                whileHover={{ x: -3, y: -3 }}
                whileTap={tapPress}
                className="inline-flex items-center border-[3px] border-black bg-yellow-neo px-7 py-3 font-inter text-sm font-black tracking-wider text-black shadow-[6px_6px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                LOGIN
              </MotionLink>
            )}
          </div>

          {/* Mobile hamburger */}
          <Motion.button
            className="flex cursor-pointer flex-col gap-1.5 border-2 border-black bg-yellow-neo p-2 shadow-[3px_3px_0_#111] lg:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle Menu"
            whileTap={tapPress}
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
          </Motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <Motion.div
            className="absolute right-4 top-full z-[9999] mt-2 w-60 border-[3px] border-black bg-indigo-neo shadow-[6px_6px_0_#000000] lg:hidden"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 430, damping: 30 }}
          >
            <ul className="space-y-2 px-5 py-5">
              {navLinks.map((link, index) => (
                <Motion.li
                  key={link.label}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    to={link.to}
                    onClick={(e) => handleNavClick(e, link)}
                    className="block border-2 border-transparent px-3 py-2 font-inter font-bold text-white transition-colors duration-200 hover:border-black hover:bg-yellow-neo hover:text-black"
                  >
                    {link.label}
                  </Link>
                </Motion.li>
              ))}
              <li className="border-t border-white/20 pt-3">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/dashboard/beranda"
                      className="block border-[3px] border-black bg-[#22b64b] py-2.5 text-center font-inter font-black text-white shadow-[4px_4px_0_#111]"
                    >
                      PROFILE
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="block w-full cursor-pointer border-[3px] border-black bg-red-600 py-2.5 text-center font-inter font-black text-white shadow-[4px_4px_0_#111] disabled:cursor-wait disabled:opacity-70"
                    >
                      {isLoggingOut ? "LOGGING OUT..." : "LOGOUT"}
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block border-[3px] border-black bg-yellow-neo py-2.5 text-center font-inter font-black text-black shadow-[4px_4px_0_#111]"
                  >
                    LOGIN
                  </Link>
                )}
              </li>
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </Motion.nav>
  );
};

export default NavbarNeo;
