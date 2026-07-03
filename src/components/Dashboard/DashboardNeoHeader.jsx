import React from "react";
import { logoutUser } from "../../api/user";

const DashboardNeoHeader = () => {
  const handleLogout = async () => {
    await logoutUser();
    window.location.replace("/login");
  };

  return (
    <header className="border-b-4 border-black bg-[#3f46b8] text-white">
      <div className="mx-auto flex min-h-24 w-full max-w-[1600px] items-center justify-between gap-6 px-5 py-4 md:px-10">
        <a href="/" aria-label="Kembali ke beranda" className="shrink-0">
          <img
            src="/LOGO_ITTODAY_2025.webp"
            alt="IT Today"
            className="h-auto w-24 md:w-28"
          />
        </a>

        <nav className="hidden items-center gap-8 text-xs font-black uppercase tracking-wide md:flex lg:gap-12">
          <a href="/" className="transition-transform hover:-translate-y-0.5">
            Home
          </a>
          <a href="/#event" className="transition-transform hover:-translate-y-0.5">
            Event
          </a>
          <a
            href="/#competition"
            className="transition-transform hover:-translate-y-0.5"
          >
            Competition
          </a>
          <a
            href="/#contact"
            className="transition-transform hover:-translate-y-0.5"
          >
            Contact Us
          </a>
        </nav>

        <button
          type="button"
          onClick={handleLogout}
          className="border-[3px] border-black bg-[#ff2020] px-5 py-2 text-xs font-black uppercase text-white shadow-[5px_5px_0_#111] transition-transform hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none md:px-7"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default DashboardNeoHeader;
