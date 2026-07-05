import React, { useState } from 'react';
import Button from '../ui/Button';

/**
 * Contact Form — form kontak (nama, email, pesan).
 * Saat backend belum siap, form hanya menampilkan alert submit berhasil.
 */
const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Ganti dengan API call ke services/contactService.js saat backend siap
    console.log('Contact form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: '', email: '', message: '' });
  };

  const inputBaseClass =
    'w-full px-4 py-3 font-inter text-sm text-black bg-white border-2 border-black rounded-md shadow-[3px_3px_0px_#000] focus:shadow-[5px_5px_0px_#000] focus:translate-x-[-2px] focus:translate-y-[-2px] focus:outline-none transition-all duration-200 placeholder:text-gray-400';

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div>
        <label htmlFor="contact-name" className="block font-inter font-bold text-sm text-black mb-2 uppercase tracking-wider">
          Nama
        </label>
        <input
          id="contact-name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Masukkan nama lengkap Anda"
          required
          className={inputBaseClass}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="contact-email" className="block font-inter font-bold text-sm text-black mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@example.com"
          required
          className={inputBaseClass}
        />
      </div>

      {/* Message */}
      <div>
        <label htmlFor="contact-message" className="block font-inter font-bold text-sm text-black mb-2 uppercase tracking-wider">
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tuliskan pesan Anda..."
          required
          rows={5}
          className={`${inputBaseClass} resize-none`}
        />
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <Button type="submit" variant="yellow-solid" className="min-w-[180px]">
          Kirim Pesan
        </Button>
        {submitted && (
          <span className="font-inter text-sm text-emerald-600 font-semibold animate-pulse">
            ✓ Pesan terkirim!
          </span>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
