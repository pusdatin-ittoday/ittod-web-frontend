import React from 'react';

const PrizepoolSection = () => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-white font-dm-sans px-4 md:px-12">
      <h2 className="text-5xl md:text-5xl font-playfair font-bold text-center mb-12 drop-shadow-[0_0_10px_#ac6871]">PRIZEPOOL</h2>

      <div className="flex flex-col items-center gap-10 md:gap-16">
        {/* Juara 1 */}
        <div className="bg-[#4D3159] rounded-2xl px-8 py-6 text-center shadow-[0_0_30px_#AC6871]">
          <h3 className="white-text-glow text-3xl md:text-5xl font-playfair font-bold mb-4">
            JUARA <span className="font-dm-sans text-1xl md:text-5xl">1</span>
          </h3>
          <p className="text-lg md:text-xl font-semibold">Rp. 5.000.000 + Sertifikat</p>
        </div>

        {/* Juara 2 dan 3 */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Juara 2 */}
          <div className="bg-[#4D3159] rounded-2xl px-8 py-6 text-center shadow-[0_0_30px_#AC6871]">
            <h3 className="white-text-glow text-2xl md:text-4xl font-playfair font-bold mb-4">
              JUARA <span className="font-dm-sans text-1xl md:text-5xl">2</span>
            </h3>
            <p className="text-lg md:text-xl font-semibold">Rp. 3.000.000 + Sertifikat</p>
          </div>

          {/* Juara 3 */}
          <div className="bg-[#4D3159] rounded-2xl px-8 py-6 text-center shadow-[0_0_30px_#AC6871]">
            <h3 className="white-text-glow text-2xl md:text-4xl font-playfair font-bold mb-4">
              JUARA <span className="font-dm-sans text-1xl md:text-5xl">3</span>
            </h3>
            <p className="text-lg md:text-xl font-semibold">Rp. 2.000.000 + Sertifikat</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrizepoolSection;
