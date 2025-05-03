import React from 'react';

const CardCompetition = ({ competitions = [] }) => {
  return (
    <div
      className="flex flex-col justify-center items-center gap-[53px] w-[900px] h-[807px] p-[30px] rounded-[10px]"
      style={{
        background: `linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), url('/images/background.png') lightgray -3px -138.45px / 102.851% 225.45% no-repeat`,
      }}
    >
      <div className="grid grid-cols-2 gap-12">
        {competitions.map((comp, index) => (
         <div
         key={index}
         className="flex items-center gap-6 p-6 rounded-lg h-[350px] transition-transform transform hover:scale-105"
       >
         {/* Gambar */}
         <img
           src={comp.imgSrc}
           alt="competition"
           className="w-[205px] h-[260px] rounded-lg"
         />
       
         {/* Text dan Button */}
         <div className="flex flex-col justify-between h-[200px] w-[225.788px] items-start">
           <div>
           <h3 className="text-white text-[30px] font-bold uppercase font-dm-sans leading-normal drop-shadow-custom-glow">
  {comp.title}
</h3>
           <p className="text-white text-justify text-[20px] font-normal leading-[140.625%] font-dm-sans drop-shadow-[0_0_15px_#AC6871]"> {comp.description}
            
           </p> </div>
           <button  className="px-6 py-2 w-[160.333px] h-[50.387px] flex-shrink-0 rounded-[20.433px] font-dm-sans text-[13px] font-bold text-white text-center shadow-[0px_1px_15px_0px_rgba(0,0,0,0.50),_inset_0px_0px_15px_1px_rgba(12,16,29,0.50)] drop-shadow-[0px_1px_15px_rgba(0,0,0,0.50)]" style={{
            background: "linear-gradient(90deg, #F97283 0%, #B247B4 50%, #9323C2 100%)"
  }}
>
  Daftar Sekarang
</button>
         </div>
       </div>
       
        ))}
      </div>
    </div>
  );
};

export default CardCompetition;
