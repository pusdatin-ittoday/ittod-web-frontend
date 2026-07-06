import React from 'react';

/**
 * Get In Touch Section — background hitam, heading kuning, tombol "Kontak Kami" → WhatsApp.
 * Juga dipakai sebagai ContactUsBanner di EventDetailPage.
 */
const GetInTouchSection = ({ compact = false }) => {
  if (compact) {
    return (
      <section id="contact" className="w-full border-b-[5px] border-black bg-[#f7f7f4] px-5 py-14 md:px-8 md:py-20">
        <div className="group mx-auto grid max-w-4xl items-center gap-8 border-[4px] border-black bg-[#191b1a] p-8 shadow-[10px_10px_0_#3730A3] transition-all duration-300 ease-out hover:-translate-y-2 hover:translate-x-1 hover:shadow-[15px_16px_0_#3730A3] md:grid-cols-[1fr_auto] md:p-12">
          <div className="transition-transform duration-300 group-hover:translate-x-1">
            <h2 className="mb-5 font-inter text-4xl font-black uppercase leading-none text-yellow-neo md:text-5xl">
              Contact Us
            </h2>
            <p className="max-w-xl font-inter text-sm leading-relaxed text-white md:text-base">
              We sincerely express our appreciation to our sponsor for their
              generous support and confidence in IT-TODAY 2026. Reach out for
              partnerships and inquiries.
            </p>
          </div>
          <a
            href="https://wa.me/6281256518375"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center border-[3px] border-black bg-indigo-neo px-7 py-4 font-inter text-xs font-black uppercase tracking-wide text-white shadow-[5px_5px_0_#000] transition-all duration-200 hover:-translate-y-1 hover:translate-x-1 hover:bg-yellow-neo hover:text-black hover:shadow-[8px_8px_0_#000]"
          >
            Hubungi Kami <span className="ml-3 text-lg">→</span>
          </a>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="group flex flex-col items-center justify-between gap-10 border-[5px] border-black bg-[#191b1a] p-8 shadow-[12px_12px_0_#3730A3] transition-all duration-300 ease-out hover:-translate-x-2 hover:-translate-y-3 hover:rotate-[0.25deg] hover:shadow-[18px_22px_0_#3730A3] md:flex-row md:items-start md:p-14">
          
          <div className="flex-1 text-left transition-transform duration-300 group-hover:translate-x-2">
            <h2 className="mb-6 font-bebas text-6xl leading-[0.9] tracking-wider text-yellow-neo md:text-[5.5rem]">
              GET IN<br />TOUCH
            </h2>
            <p className="max-w-xl font-inter text-base font-medium leading-relaxed text-gray-300 md:text-lg">
              Punya pertanyaan seputar kompetisi atau event? Tim kami siap
              membantumu kapanpun. Hubungi kami melalui kontak resmi atau
              temukan kami di media sosial.
            </p>
          </div>

          <div className="shrink-0 md:mt-12">
            <a 
              href="https://wa.me/6281256518375"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block border-[3px] border-black bg-yellow-neo px-8 py-4 font-inter text-sm font-black uppercase tracking-wide text-black shadow-[7px_7px_0_#fff] transition-all duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-[3px_3px_0_#fff]"
            >
              Kontak Kami
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GetInTouchSection;
