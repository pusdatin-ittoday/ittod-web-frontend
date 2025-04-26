import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="flex w-[1920px] h-[110px] px-[100px] py-[29px] items-center justify-between bg-[linear-gradient(0deg,_#4D3159_0%,_#4D3159_100%)] shadow-md">
      <div className="flex items-center space-x-[100px]">
        {/* Logo */}
        <img
          src="/images/DummyImg.jpg"
          className="w-30 h-20 rounded-[12px] object-cover "
          alt="Logo"
        />

        {/* Link Navigasi */}
      
        <div className="flex space-x-12">
  <Link
    to="/home"
    className="white-text-glow hover:text-purple-300 transition"
  >
    Home
  </Link>
  <Link
    to="/competition"
    className="white-text-glow hover:text-purple-300 transition"
  >
    Competition
  </Link>
  <Link
    to="/event"
    className="white-text-glow hover:text-purple-300 transition"
  >
    Event
  </Link>
  <Link
    to="/contact"
    className="white-text-glow hover:text-purple-300 transition"
  >
    Contact Us
  </Link>
</div>



    
      </div>

      {/* Logout Button */}
      <Link
        to="/logout" // Ganti sesuai route logout kamu
        className="w-[120px] h-[76px] flex-shrink-0 bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white rounded-[20px] font-bold flex items-center justify-center"
      >
        <span className="w-[102px] text-white text-center text-shadow-[0px_4px_8px_rgba(255,_255,_255,_0.49)] font-[800] text-[20px] font-[Playfair_Display] ">
          Logout
        </span>
      </Link>
    </nav>
  );
};

export default Navbar;