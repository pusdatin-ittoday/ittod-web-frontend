import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import CardCompetition from "../components/CardCompetition"; // import komponen barumu

const IkutLomba = () => {
    const competitions = [
        {
          title: "Hacktoday",
          description: "Acara seru banget aduhai ayo join ittod tahun ini",
          imgSrc: "/logo-competition/HACKTODAY.webp",
        },
        {
          title: "Uxtoday",
          description: "Acara seru banget aduhai ayo join ittod tahun ini",
          imgSrc: "/logo-competition/UXTODAY.webp",
        },
        {
          title: "Gametoday",
          description: "Acara seru banget aduhai ayo join ittod tahun ini",
          imgSrc: "/logo-competition/GAMETODAY.webp",
        },
        {
          title: "Minetoday",
          description: "Acara seru banget aduhai ayo join ittod tahun ini",
          imgSrc: "/logo-competition/MINETODAY.webp",
        },
      ];
      

  return (
    <div className="main-container">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex flex-1 p-6">
          <div className="flex w-full ml-50 mt-[30px] gap-[31px] items-start justify-start">
            {/* KIRI: COMPETITION LIST */}
            <div className="flex flex-col gap-6">
              <CardCompetition competitions={competitions} />
            </div>

            {/* KANAN: ANNOUNCEMENT */}
            <div className="flex">
              <Card
                title="ANNOUNCEMENT"
                customClass="flex flex-col items-center gap-[10px] w-[438px] h-[807px] p-[30px] rounded-[10px] 
                  bg-[url('/images/background.png')] bg-cover bg-no-repeat bg-center bg-black/20"
                  style={{
                    background: `linear-gradient(0deg, rgba(130, 79, 79, 0.20) 0%, rgba(130, 79, 79, 0.20) 100%), url('/images/background.png') lightgray -360.817px 1px`,
                  }}
              />
            </div>
          </div>
        </main>
      </div>

      <button
  className="fixed bottom-6 left-6 flex justify-center items-center w-[141px] h-[138.208px] p-[13.96px] gap-[13.96px] flex-shrink-0 rounded-full bg-[url('/images/background.png')] bg-no-repeat bg-cover"
  style={{
    borderRadius: '279.208px',
    backgroundImage: `
      linear-gradient(0deg, rgba(0, 0, 0, 0.10), rgba(0, 0, 0, 0.10)),
      linear-gradient(0deg, rgba(48, 32, 68, 0.30), rgba(48, 32, 68, 0.30)),
      url('/images/background.png')
    `,
    backgroundPosition: '-0.718px -1.052px',
    backgroundSize: '100% 225.45%',
    backgroundRepeat: 'no-repeat',
    backgroundBlendMode: 'normal',
    boxShadow:
      '0px 1px 6.5px 0px #FF9BA8 inset, 0px 5px 10px 0px rgba(172, 104, 113, 0.70)',
  }}
>
<span
  className="text-white text-[67.01px] font-roboto font-normal text-center leading-none"
  style={{
    // Glow-WhiteText Effect
    textShadow: '0px 5px 10px rgba(172, 104, 113, 0.70)',
  }}
>
  ?
</span>
</button>
    </div>
  );
};

export default IkutLomba;