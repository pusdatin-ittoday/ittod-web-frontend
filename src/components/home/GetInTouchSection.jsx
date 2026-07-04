import React from 'react';
import Button from '../ui/Button';

/**
 * Get In Touch Section — background hitam, heading kuning, tombol "Kontak Kami" → /contact-us.
 * Juga dipakai sebagai ContactUsBanner di EventDetailPage.
 */
const GetInTouchSection = ({ compact = false }) => {
  return (
    <section
      id="contact"
      className={`w-full bg-white ${
        compact ? 'py-12' : 'py-16 md:py-24'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-[#1c1c1c] border-[6px] border-[#3b5998] shadow-[12px_12px_0px_#000] p-8 md:p-16 flex flex-col md:flex-row items-center md:items-start justify-between gap-10">
          
          <div className="flex-1 text-left">
            <h2 className="font-bebas text-6xl md:text-[5.5rem] text-yellow-neo tracking-wider leading-[0.9] mb-6">
              GET IN<br />TOUCH
            </h2>
            <p className="font-inter text-base md:text-lg text-gray-300 leading-relaxed max-w-xl">
              {compact
                ? 'We sincerely express our appreciation to our sponsor for their generous support and confidence in IT-TODAY 2026.'
                : 'Punya pertanyaan seputar kompetisi atau event? Tim kami siap membantumu kapanpun. Hubungi kami melalui kontak resmi atau temukan kami di media sosial.'}
            </p>
          </div>

          <div className="flex-shrink-0 md:mt-12">
            <a 
              href="/contact-us"
              className="inline-block bg-yellow-neo text-black font-inter font-bold px-8 py-4 shadow-[8px_8px_0px_#fff] hover:shadow-[4px_4px_0px_#fff] hover:translate-x-[4px] hover:translate-y-[4px] transition-all duration-200 uppercase tracking-wide"
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
