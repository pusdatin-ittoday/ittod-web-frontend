import React from 'react';
import { Link } from 'react-router-dom';

const LandingEventCard = ({ title, description, imageSrc, linkHref }) => {
  return (
    <div className="flex lg:gap-5 gap-2 justify-center items-center flex-col w-72 h-[400px] lg:h-[550px] bg-[#4D3159] backdrop-blur-md px-3 lg:px-6 py-6 lg:py-8 rounded-2xl shadow-xl text-center text-white [box-shadow:0_0_15px_5px_#AC6871,_0_0_75px_5px_#AC6871_inset] ">
      <h2 className="text-white lg:text-3xl text-2xl text-center font-semibold font-playfair leading-12 [text-shadow:0_4px_10px_#ac6871] truncate">{title}</h2>

      <div className="lg:w-60 w-40 lg:h-60 h-40 rounded-full overflow-hidden">
        <img
          src={imageSrc}
          className="object-cover"
        />
      </div>

      <div className='h-[20%] flex items-center justify-center'>
        <p className="text-sm lg:text-lg mb-6 font-playfair text-white max-w-full text-center [text-shadow:0_4px_10px_#ac6871]">{description}</p>
      </div>

      {/* perlu diganti jadi component button */}
      <Link
        to={linkHref}
        className="font-dm-sans font-bold text-sm lg:text-lg button-hover bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-3 px-4 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out truncate"
      >
        Lihat Lebih Lanjut
      </Link>
    </div>
  );
};

export default LandingEventCard;
