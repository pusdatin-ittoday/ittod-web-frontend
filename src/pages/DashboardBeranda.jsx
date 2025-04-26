import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";

const DashboardBeranda = () => {
  return (
    <div className="main-container">
      <Navbar />
      <div className="flex">
        <Sidebar />

        {/* Konten utama */}
        <main className="flex flex-1 p-6">
          {/* Container utama dibungkus dan digeser ke kanan */}
          <div className="flex w-full ml-50 mt-[30px] gap-[31px] items-start justify-start">
            {/* KIRI: PROFIL + COMPETITION LIST */}
            <div className="flex flex-col gap-[16px]">
            <Card
  title="PROFIL DIRI, ID PESERTA, & KARTU INSTITUSI"
  editable
  customClass="flex flex-col items-start gap-[16px] h-[389px] w-[900px] p-[30px] rounded-[10px]"
  style={{
    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
                 url('/images/background.png') lightgray -4.466px -2.96px / 100.556% 225.45% no-repeat`
  }}
/>
             <Card
  title="COMPETITION LIST"
  titleIcon={
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 40 40" fill="none">
      <path d="M13 7H5.22222C4.63285 7 4.06762 7.23413 3.65087 7.65087C3.23413 8.06762 3 8.63285 3 9.22222V24.7778C3 25.3671 3.23413 25.9324 3.65087 26.3491C4.06762 26.7659 4.63285 27 5.22222 27H20.7778C21.3671 27 21.9324 26.7659 22.3491 26.3491C22.7659 25.9324 23 25.3671 23 24.7778V17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M24.1533 3.65998C24.5759 3.2374 25.1491 3 25.7467 3C26.3443 3 26.9174 3.2374 27.34 3.65998C27.7626 4.08256 28 4.6557 28 5.25332C28 5.85093 27.7626 6.42407 27.34 6.84665L17.2489 16.9378L13 18L14.0622 13.7511L24.1533 3.65998Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  }
  customClass="flex flex-col items-start gap-[16px] h-[400px] w-[900px] p-[30px] rounded-[10px]"
  style={{
    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), 
                 url('/images/background.png') lightgray -6.696px -334.274px / 100.763% 226.615% no-repeat`
  }}
  titleClass="competition-title"
/>
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

      {/* Floating Button */}
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
    textShadow: '0px 5px 10px rgba(172, 104, 113, 0.70)',
  }}
>
  ?
</span>

</button>
    </div>
  );
};

export default DashboardBeranda;
