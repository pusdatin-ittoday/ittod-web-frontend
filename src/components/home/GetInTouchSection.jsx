import React from "react";
import { motion as Motion } from "motion/react";
import { DEFAULT_CONTACTS } from "../../data/contacts";
import { popIn, revealUp, tapPress, viewportOnce } from "../../lib/motion";

/**
 * Get In Touch Section - background hitam, heading kuning, tombol kontak.
 * Juga dipakai sebagai ContactUsBanner di EventDetailPage.
 */
const GetInTouchSection = ({ compact = false }) => {
  if (compact) {
    return (
      <Motion.section
        id="contact"
        className="w-full border-b-[5px] border-black bg-[#f7f7f4] px-5 py-14 md:px-8 md:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
      >
        <Motion.div
          variants={popIn}
          whileHover={{ y: -8, x: 4 }}
          className="group mx-auto grid max-w-4xl items-center gap-8 border-[4px] border-black bg-[#191b1a] p-8 shadow-[10px_10px_0_#3730A3] transition-shadow duration-300 ease-out hover:shadow-[15px_16px_0_#3730A3] md:grid-cols-[1fr_auto] md:p-12"
        >
          <Motion.div variants={revealUp}>
            <h2 className="mb-5 font-inter text-4xl font-black uppercase leading-none text-yellow-neo md:text-5xl">
              Contact Us
            </h2>
            <p className="max-w-xl font-inter text-sm leading-relaxed text-white md:text-base">
              We sincerely express our appreciation to our sponsor for their
              generous support and confidence in IT-TODAY 2026. Reach out for
              partnerships and inquiries.
            </p>
          </Motion.div>
          <Motion.a
            href={`https://wa.me/${DEFAULT_CONTACTS.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -5, x: 3 }}
            whileTap={tapPress}
            className="inline-flex items-center justify-center border-[3px] border-black bg-indigo-neo px-7 py-4 font-inter text-xs font-black uppercase tracking-wide text-white shadow-[5px_5px_0_#000] transition-colors duration-200 hover:bg-yellow-neo hover:text-black hover:shadow-[8px_8px_0_#000]"
          >
            Hubungi Kami <span className="ml-3 text-lg">-&gt;</span>
          </Motion.a>
        </Motion.div>
      </Motion.section>
    );
  }

  return (
    <Motion.section
      id="contact"
      className="w-full border-b-[5px] border-black bg-[#f7f7f4] py-16 md:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Motion.div
          variants={popIn}
          whileHover={{ x: -8, y: -10, rotate: 0.25 }}
          className="group flex flex-col items-center justify-between gap-10 border-[5px] border-black bg-[#191b1a] p-8 shadow-[12px_12px_0_#3730A3] transition-shadow duration-300 ease-out hover:shadow-[18px_22px_0_#3730A3] md:flex-row md:items-start md:p-14"
        >
          <Motion.div className="flex-1 text-left" variants={revealUp}>
            <h2 className="mb-6 font-bebas text-6xl leading-[0.9] tracking-wider text-yellow-neo md:text-[5.5rem]">
              GET IN
              <br />
              TOUCH
            </h2>
            <p className="max-w-xl font-inter text-base font-medium leading-relaxed text-gray-300 md:text-lg">
              Punya pertanyaan seputar kompetisi atau event? Tim kami siap
              membantumu kapanpun. Hubungi kami melalui kontak resmi atau
              temukan kami di media sosial.
            </p>
          </Motion.div>

          <div className="shrink-0 md:mt-12">
            <Motion.a
              href={`https://wa.me/${DEFAULT_CONTACTS.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 4, y: 4 }}
              whileTap={tapPress}
              className="inline-block border-[3px] border-black bg-yellow-neo px-8 py-4 font-inter text-sm font-black uppercase tracking-wide text-black shadow-[7px_7px_0_#fff] transition-shadow duration-150 hover:shadow-[3px_3px_0_#fff]"
            >
              Kontak Kami
            </Motion.a>
          </div>
        </Motion.div>
      </div>
    </Motion.section>
  );
};

export default GetInTouchSection;
