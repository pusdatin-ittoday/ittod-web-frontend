import React from 'react';

const HeroCard = ({ Logo }) => {
  // menggunakan destructuring untuk menerima prop Logo
  return (
    <div className="w-full max-w-xl mx-auto text-center p-8  text-white">
      <img
        src={Logo}
        alt="IT-TODAY Logo"
        className="mx-auto w-60 "
      />
      <p className="font-dm-sans mt-6 text-lg italic text-pink-200 drop-shadow-[0_0_10px_#ffffff77]">“Exploring Harmonious Connections In The Digital Universe”</p>
    </div>
  );
};

export default HeroCard;
