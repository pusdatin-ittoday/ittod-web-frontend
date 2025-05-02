import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Impor Link dari react-router-dom

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [scroll, setScroll] = useState(false);

  const handleClick = () => {
    setActive(!active);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScroll(true);
        setActive(false);
      } else {
        setScroll(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setActive(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  let scrollActive = scroll ? 'backdrop-blur-md py-4 bg-gray/30 shadow-md' : 'bg-transparent py-4';

  return (
    <div className={`navbar fixed w-full transition-all z-[999] ${scrollActive}`}>
      <div className="container mx-auto px-4">
        <div className="navbar-box relative flex items-center justify-between font-dm-sans">
          <div className="logo">
            <h1 className="font-dm-sans sm:text-2xl text-4xl font-bold cursor-pointer">IT-TODAY</h1>
          </div>
          <ul
            className={`flex lg:gap-12 flex-col gap-3 absolute top-full right-0 mt-1 z-[9999] w-36 px-4 py-4 rounded-lg shadow-lg bg-[#6a316c] font-bold text-white text-sm transition duration-300
            ${active ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'}
            md:opacity-100 md:visible md:pointer-events-auto md:static md:flex-row md:gap-12 md:shadow-none md:bg-transparent md:w-auto md:h-full md:p-0 md:text-black md:transition-none md:items-center md:mt-0`}
          >
            <li className="flex items-center">
              <Link
                to="/home"
                className="font-dm-playfair font-medium opacity-75 text-white hover:text-pink-400 cursor-pointer"
              >
                Home
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/competition"
                className="font-dm-playfair font-medium opacity-75 text-white hover:text-pink-400 cursor-pointer"
              >
                Competition
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/event"
                className="font-dm-playfair font-medium opacity-75 text-white hover:text-pink-400 cursor-pointer"
              >
                Event
              </Link>
            </li>
            <li className="flex items-center">
              <Link
                to="/ContactUs"
                className="font-dm-playfair font-medium opacity-75 text-white hover:text-pink-400 cursor-pointer"
              >
                ContactUs
              </Link>
            </li>
            <li className="block lg:hidden">
              <button className="font-dm-sans font-bold bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-3 px-4 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
                Login
              </button>
            </li>
          </ul>
          <div className="login hidden lg:block">
            <button className="font-dm-sans font-bold bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-2 px-7 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out cursor-pointer">
              Login
            </button>
          </div>
          <img
            src="/menu.svg"
            alt="Menu"
            className="w-[40px] h-[40px] md:hidden block cursor-pointer bg-transparent"
            onClick={handleClick}
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
