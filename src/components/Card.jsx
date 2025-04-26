import React from 'react';

const Card = ({ title, titleIcon, editable, customClass = "", titleClass = "", style = {} }) => {
  const isGroupedCard = title.includes("PROFIL DIRI");

  return (
    <div className={`p-4 ${customClass}`} style={style}>
      {/* Menampilkan judul jika ada dan bukan kartu "PROFIL DIRI" */}
      {title === "ANNOUNCEMENT" ? (
        <div className={`flex justify-start items-center gap-2 mb-4 ${titleClass}`}>
          {titleIcon && <span className="w-6 h-6">{titleIcon}</span>}
          <h3 className="font-bold text-sm text-white text-center" 
              style={{
                textShadow: "0px 5px 10px rgba(172, 104, 113, 0.70)", 
                fontFamily: "Rowdies", 
                fontSize: "30px", 
                fontStyle: "normal", 
                fontWeight: "700", 
                lineHeight: "normal", 
                textTransform: "uppercase"
              }}>
            {title}
          </h3>
        </div>
      ) : (
        !isGroupedCard && title && (
          <div className={`flex justify-start items-center gap-2 mb-4 ${titleClass}`}>
            {titleIcon && <span className="w-6 h-6">{titleIcon}</span>}
            <h3
  className="text-white"
  style={{
    width: '192px', // Width sesuai permintaan
    color: '#FFF', // Warna teks putih
    textAlign: 'center', // Teks berada di tengah
    fontFamily: 'Rowdies', // Menggunakan font Rowdies
    fontSize: '20px', // Ukuran font 20px
    fontStyle: 'normal', // Gaya font normal
    fontWeight: '400', // Berat font normal
    lineHeight: 'normal', // Tinggi baris normal
    textTransform: 'uppercase', // Mengubah semua huruf menjadi kapital
 
  }}
>
  {title}
</h3>

          </div>
        )
      )}

      {/* Konten untuk Profil Diri (khusus untuk kartu Profil) */}
      {isGroupedCard ? (
        <div className="space-y-4">
          {/* Profil Diri */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="28" viewBox="0 0 26 42" fill="none">
              <g filter="url(#filter0_d_1048605_516)">
                <path d="M13 9.5C15.2091 9.5 17 7.70914 17 5.5C17 3.29086 15.2091 1.5 13 1.5C10.7909 1.5 9 3.29086 9 5.5C9 7.70914 10.7909 9.5 13 9.5Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20.5 32.5V27.5C20.5 24.8478 20.1049 22.3043 19.4017 20.4289C18.6984 18.5536 17.7446 17.5 16.75 17.5H9.25C8.25544 17.5 7.30161 18.5536 6.59835 20.4289C5.89509 22.3043 5.5 24.8478 5.5 27.5V32.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </g>
              <defs>
                <filter id="filter0_d_1048605_516" x="-1" y="0.5" width="28" height="41" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                  <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                  <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                  <feOffset dy="4"/>
                  <feGaussianBlur stdDeviation="2"/>
                  <feComposite in2="hardAlpha" operator="out"/>
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1048605_516"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1048605_516" result="shape"/>
                </filter>
              </defs>
            </svg>
            <h4 className="glow-text">Profil Diri</h4>
            {editable && (
              <a
                href="/edit-profil"
                className="relative inline-flex items-center justify-center w-[150px] h-[58px] px-[20px] py-[7px] text-xs font-semibold text-white bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] rounded-[30px] gap-2 ml-134"
                style={{
                  boxShadow: '0px 4px 20px rgba(255, 255, 255, 0.5)' // shadow putih
                }}
              >
                <div className="relative inline-flex items-center justify-center ">
                  <span className="absolute inset-0 bg-gradient-to-r from-[#F97283] via-[#B247B4] to-[#9323C2] rounded-[30px] blur-[2px]"></span>
                  <span className="relative z-[15] text-white text-center font-rowdies text-[20px] font-semibold uppercase ">
                    Edit data
                  </span>
                </div>
              </a>
            )}
          </div>
          <hr className="border-gray-600" />
          
          {/* ID Peserta */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M3.33317 3.83333H16.6665C17.5832 3.83333 18.3332 4.58333 18.3332 5.5V15.5C18.3332 16.4167 17.5832 17.1667 16.6665 17.1667H3.33317C2.4165 17.1667 1.6665 16.4167 1.6665 15.5V5.5C1.6665 4.58333 2.4165 3.83333 3.33317 3.83333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.3332 5.5L9.99984 11.3333L1.6665 5.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4 className="glow-text">ID Peserta</h4>
          </div>
          <hr className="border-gray-500" />

          {/* Kartu Institusi */}
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
              <path d="M9.99984 18.8333C14.6022 18.8333 18.3332 15.1024 18.3332 10.5C18.3332 5.89763 14.6022 2.16667 9.99984 2.16667C5.39746 2.16667 1.6665 5.89763 1.6665 10.5C1.6665 15.1024 5.39746 18.8333 9.99984 18.8333Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7.5752 8C7.77112 7.44306 8.15782 6.97342 8.66682 6.67428C9.17583 6.37513 9.77427 6.26578 10.3562 6.36559C10.9381 6.46541 11.4659 6.76794 11.8461 7.21961C12.2263 7.67128 12.4344 8.24294 12.4335 8.83333C12.4335 10.5 9.93353 11.3333 9.93353 11.3333" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 14.6667H10.0083" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <h4 className="glow-text">Kartu Institusi</h4>
          </div>
        </div>
      ) : (
        <div className="h-24 text-sm text-gray-200"></div>
      )}
    </div>
  );
};

export default Card;
