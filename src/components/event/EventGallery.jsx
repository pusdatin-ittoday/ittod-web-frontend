import React, { useState } from 'react';

/**
 * EventGallery — Komponen galeri foto dokumentasi acara.
 *
 * Menampilkan tepat 3 foto dengan gaya neo-brutalisme:
 * border hitam tebal, shadow solid, layout flex-row di desktop,
 * flex-col di mobile.
 *
 * @param {string[]} images - Array berisi 3 path gambar (dari /public).
 * @param {string}   title  - Judul seksi galeri (opsional).
 */
const EventGallery = ({ images = [], title = 'Dokumentasi' }) => {
  const [lightbox, setLightbox] = useState(null);

  if (!images || images.length === 0) return null;

  // Pastikan selalu ada 3 slot; slot kosong diisi placeholder
  const slots = [...images].slice(0, 3);

  return (
    <div className="mb-7">
      {/* Section title */}
      <h3 className="mb-4 w-fit border-b-[3px] border-yellow-neo pb-1 font-inter text-sm font-black uppercase tracking-widest text-[#171918]">
        {title}
      </h3>

      {/* Gallery grid */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        {slots.map((src, index) => (
          <button
            key={src || index}
            type="button"
            onClick={() => setLightbox(src)}
            className="
              group relative flex-1 overflow-hidden
              border-[3px] border-black
              shadow-[4px_4px_0_0_black]
              transition-all duration-200
              hover:-translate-y-1 hover:shadow-[6px_6px_0_0_black]
              focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-neo
            "
            aria-label={`Lihat foto dokumentasi ${index + 1}`}
          >
            {/* Aspect-ratio wrapper */}
            <div className="aspect-[4/3] w-full bg-[#e5e5e3]">
              <img
                src={src}
                alt={`Foto dokumentasi ${index + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  // Fallback ke warna kosong jika gambar tidak ditemukan
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement.classList.add(
                    'flex',
                    'items-center',
                    'justify-center',
                  );
                  if (!e.currentTarget.parentElement.querySelector('.img-fallback')) {
                    const span = document.createElement('span');
                    span.className =
                      'img-fallback font-inter text-xs font-black uppercase text-gray-400';
                    span.textContent = 'Foto Menyusul';
                    e.currentTarget.parentElement.appendChild(span);
                  }
                }}
              />
            </div>

            {/* Hover overlay */}
            <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-200 group-hover:bg-black/10" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lightbox foto"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-h-[90vh] max-w-4xl border-[3px] border-black shadow-[8px_8px_0_0_black]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt="Foto dokumentasi (diperbesar)"
              className="block max-h-[85vh] w-auto object-contain"
            />
            <button
              type="button"
              onClick={() => setLightbox(null)}
              className="
                absolute -right-3 -top-3
                flex h-8 w-8 items-center justify-center
                border-2 border-black bg-yellow-neo
                font-inter text-sm font-black shadow-[3px_3px_0_0_black]
                transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_black]
              "
              aria-label="Tutup lightbox"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventGallery;
