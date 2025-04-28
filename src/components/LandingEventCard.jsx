import React from 'react';

const LandingEventCard = ({ title, description, imageSrc }) => {
  return (
    <div className="flex lg:gap-5 gap-2 justify-center items-center flex-col w-72 h-[450px] lg:h-[550px] bg-[#4D3159] backdrop-blur-md px-3 lg:px-6 py-6 lg:py-8 rounded-2xl shadow-xl text-center text-white [box-shadow:0_0_15px_5px_#AC6871,_0_0_75px_5px_#AC6871_inset] ">
      <h2 className="text-white lg:text-3xl text-2xl text-center font-semibold font-playfair leading-12 [text-shadow:0_4px_10px_#ac6871]">{title}</h2>
      
          <div className="w-60 h-60 rounded-full overflow-hidden">
            <img src={imageSrc} className="w-full h-full object-contain" />
          </div>

      <p className="text-lg lg:text-xl mb-6 font-playfair text-white [text-shadow:0_4px_10px_#ac6871]">
        {description}
      </p>
      
      {/* perlu diganti jadi component button */}
      <button className="font-dm-sans font-bold text-sm lg:text-lg bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-3 px-4 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out">
        Lihat Lebih Lanjut
      </button>
    </div>
  );
};

export default LandingEventCard;
