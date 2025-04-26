import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const isBeranda = location.pathname === "/DashboardBeranda";
  const isIkutLomba = location.pathname === "/IkutLomba";

  const sharedSpanStyle = {
    color: '#FFF',
    textShadow: '0px 4px 8px rgba(255, 255, 255, 0.43)',
    fontFamily: 'DM Sans',
    fontSize: '25px',
    fontStyle: 'normal',
    fontWeight: '700',
    lineHeight: 'normal',
  };

  const activeClass = "bg-[linear-gradient(90deg,_#F97283_0%,_#B247B4_50%,_#9323C2_100%)] shadow-beranda";
  const inactiveClass = "bg-competition"; // transparan atau versi tidak aktif kamu

  return (
    <aside className="flex flex-col items-center gap-[37px] w-[253px] bg-[#302044] text-white p-8">
      <h2
        className="text-white text-[25px] font-dm-sans font-bold leading-normal uppercase text-center mt-6 ml-21"
        style={{
          textShadow: '0px 5px 10px rgba(172, 104, 113, 0.70)',
        }}
      >
        DASHBOARD
      </h2>

      <div className="flex flex-col justify-center items-center gap-[7px] w-[125px]">
      <Link
  to="/DashboardBeranda"
  className={`w-[225px] h-[55px] flex justify-center items-center gap-[10px] rounded-[10px] font-playfair font-semibold text-white ml-21 ${
    isBeranda ? activeClass : inactiveClass
  }`}> <span className="text-white text-shadow-md font-[DM Sans] text-[25px] font-bold leading-none">
  Beranda
</span>
</Link>

<Link
  to="/IkutLomba"
  className={`w-[225px] h-[55px] flex justify-center items-center gap-[10px] rounded-[10px] font-playfair font-semibold text-white ml-21 ${
    isIkutLomba ? activeClass : inactiveClass
  }`}
>
  <Link to="/IkutLomba">
  <span className="text-white text-shadow-lg font-[DM Sans] text-[24px] font-bold leading-none">
    Ikut Lomba
  </span>
</Link>
</Link>
      </div>
    </aside>
  );
};

export default Sidebar;
