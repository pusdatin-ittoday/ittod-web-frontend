import React from 'react';

/**
 * Get In Touch Section — background hitam, heading kuning, tombol "Kontak Kami" → WhatsApp.
 * Juga dipakai sebagai ContactUsBanner di EventDetailPage.
 */
const GetInTouchSection = ({ compact = false }) => {
  return (
    <section
      id="contact"
      className={`w-full border-b-[5px] border-black bg-[#f7f7f4] ${
        compact ? 'py-12' : 'py-16 md:py-24'
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="flex flex-col items-center justify-between gap-10 border-[5px] border-black bg-[#191b1a] p-8 shadow-[12px_12px_0_#3730A3] md:flex-row md:items-start md:p-14">
          
          <div className="flex-1 text-left">
            <h2 className="mb-6 font-bebas text-6xl leading-[0.9] tracking-wider text-yellow-neo md:text-[5.5rem]">
              GET IN<br />TOUCH
            </h2>
            <p className="max-w-xl font-inter text-base font-medium leading-relaxed text-gray-300 md:text-lg">
              {compact
                ? 'We sincerely express our appreciation to our sponsor for their generous support and confidence in IT-TODAY 2026.'
                : 'Punya pertanyaan seputar kompetisi atau event? Tim kami siap membantumu kapanpun. Hubungi kami melalui kontak resmi atau temukan kami di media sosial.'}
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
