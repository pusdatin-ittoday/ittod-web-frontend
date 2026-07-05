import React from 'react';
import NavbarNeo from '../components/layout/Navbar';
import FooterNeo from '../components/layout/Footer';
import ContactForm from '../components/contact/ContactForm';

/**
 * Contact Us Page — gaya Neo-Brutalisme.
 * Background hitam + form kontak + info kontak langsung.
 */
const ContactUsPage = () => {
  return (
    <>
      <NavbarNeo />
      <main className="pt-16 md:pt-20">
        {/* Header */}
        <section className="w-full bg-dark-neo py-16 md:py-24 border-b-4 border-yellow-neo">
          <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
            <h1 className="font-bebas text-6xl md:text-7xl text-yellow-neo tracking-wider mb-4">
              Contact Us
            </h1>
            <p className="font-inter text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
              Punya pertanyaan, masukan, atau ingin berkolaborasi? Jangan ragu untuk menghubungi
              kami melalui form di bawah ini.
            </p>
          </div>
        </section>

        {/* Form + Info */}
        <section className="w-full bg-white py-12 md:py-16">
          <div className="max-w-6xl mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Contact Form */}
              <div className="lg:col-span-2">
                <div className="card-brutal-no-hover rounded-lg p-6 md:p-8">
                  <h2 className="font-bebas text-3xl text-black tracking-wider mb-6">
                    Kirim Pesan
                  </h2>
                  <ContactForm />
                </div>
              </div>

              {/* Right: Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Email */}
                <div className="border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] overflow-hidden">
                  <div className="bg-indigo-neo px-6 py-4 border-b-2 border-black">
                    <h3 className="font-bebas text-xl text-white tracking-wider">Email</h3>
                  </div>
                  <div className="bg-white px-6 py-4">
                    <a
                      href="mailto:pr@ittoday.web.id"
                      className="font-inter text-sm text-indigo-neo hover:text-yellow-neo font-medium transition-colors duration-200"
                    >
                      pr@ittoday.web.id
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] overflow-hidden">
                  <div className="bg-yellow-neo px-6 py-4 border-b-2 border-black">
                    <h3 className="font-bebas text-xl text-black tracking-wider">WhatsApp</h3>
                  </div>
                  <div className="bg-white px-6 py-4">
                    <a
                      href="https://wa.me/+6281256518375"
                      className="font-inter text-sm text-indigo-neo hover:text-yellow-neo font-medium transition-colors duration-200"
                    >
                      +6281256518375
                    </a>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-2 border-black rounded-lg shadow-[4px_4px_0px_#000] overflow-hidden">
                  <div className="bg-dark-neo px-6 py-4 border-b-2 border-black">
                    <h3 className="font-bebas text-xl text-yellow-neo tracking-wider">Social Media</h3>
                  </div>
                  <div className="bg-white px-6 py-4 space-y-3">
                    <a
                      href="https://www.instagram.com/ittoday_ipb/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-inter text-sm text-gray-700 hover:text-indigo-neo transition-colors duration-200"
                    >
                      <img src="/instagram.svg" alt="Instagram" className="w-5 h-5" />
                      @ittoday_ipb
                    </a>
                    <a
                      href="https://x.com/ittoday_ipb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-inter text-sm text-gray-700 hover:text-indigo-neo transition-colors duration-200"
                    >
                      <img src="/x.svg" alt="X" className="w-5 h-5" />
                      @ittoday_ipb
                    </a>
                    <a
                      href="https://www.tiktok.com/@ittoday_ipb"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 font-inter text-sm text-gray-700 hover:text-indigo-neo transition-colors duration-200"
                    >
                      <img src="/tiktok.svg" alt="TikTok" className="w-5 h-5" />
                      @ittoday_ipb
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <FooterNeo />
    </>
  );
};

export default ContactUsPage;
