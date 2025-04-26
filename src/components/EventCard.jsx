import React from 'react'

const EventCard = ({ title, description, imageSrc }) => {
  return (
    <div className="flex lg:gap-5 gap-2 justify-center items-center flex-col w-400px h-600px bg-[#4D3159] backdrop-blur-md px-3 lg:px-6 py-6 lg:py-8 rounded-2xl shadow-xl w-72 text-center text-white [box-shadow:0_0_15px_5px_#AC6871,_0_0_75px_5px_#AC6871_inset] ">
      <h2 className="text-white lg:text-3xl text-2xl text-center font-semibold font-playfair leading-12 white-text-glow">{title}</h2>
      <img src={imageSrc} className='max-w-full max-h-40 bg-black rounded-xl mb-4'/>
      <p className="text-lg lg:text-xl mb-6 font-playfair text-white white-text-glow">
        {description}
      </p>
      
      {/* perlu diganti jadi component button */}
      <button className="font-dm-sans font-bold text-sm lg:text-lg bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] text-white py-3 px-4 rounded-xl custom-button-shadow hover:scale-105 transition duration-300 ease-in-out">
        Daftar Sekarang
      </button>
    </div>
  );
};


export default EventCard