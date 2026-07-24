/**
 * eventGalleryData.js
 *
 * Mapping dari slug URL → folder gambar di /public/images/events/.
 * Setiap acara memiliki 3 foto dokumentasi: doc-1.jpg, doc-2.jpg, doc-3.jpg.
 *
 * Untuk menambah acara baru, cukup tambahkan entry baru di object ini
 * dan pastikan folder serta foto tersedia di public/images/events/<folder>/.
 *
 * Acara yang tidak ada di sini TIDAK akan menampilkan galeri.
 * (codetoday sengaja dikecualikan — kondisi dihandle di EventDetailPage)
 */

const EVENT_GALLERY_MAP = {
  'seminar-nasional-it-today': {
    folder: 'national-seminar',
    label: 'Seminar Nasional IT Today',
  },
  workshop: {
    folder: 'workshop',
    label: 'Workshop',
  },
  bootcamp: {
    folder: 'bootcamp',
    label: 'Bootcamp',
  },
  uxtoday: {
    folder: 'uxtoday',
    label: 'UX Today',
  },
  'ux-today': {
    folder: 'uxtoday',
    label: 'UX Today',
  },
  gametoday: {
    folder: 'gametoday',
    label: 'Game Today',
  },
  'game-today': {
    folder: 'gametoday',
    label: 'Game Today',
  },
  minetoday: {
    folder: 'minetoday',
    label: 'Mine Today',
  },
  'mine-today': {
    folder: 'minetoday',
    label: 'Mine Today',
  },
  hacktoday: {
    folder: 'hacktoday',
    label: 'Hack Today',
  },
  'hack-today': {
    folder: 'hacktoday',
    label: 'Hack Today',
  },
  // 'codetoday' sengaja tidak didaftarkan di sini
  // agar galeri tidak ditampilkan untuk acara ini.
};

/**
 * Mengembalikan array 3 path gambar untuk slug tertentu,
 * atau `null` jika slug tidak ditemukan / dikecualikan.
 *
 * @param {string} slug - Slug URL acara (misal: 'national-seminar')
 * @returns {string[] | null}
 */
export function getEventGalleryImages(slug) {
  const entry = EVENT_GALLERY_MAP[slug];
  if (!entry) return null;

  const base = `/images/events/${entry.folder}`;
  return [
    `${base}/doc-1.webp`,
    `${base}/doc-2.webp`,
    `${base}/doc-3.webp`,
  ];
}

/**
 * Mengembalikan label galeri untuk slug tertentu.
 *
 * @param {string} slug
 * @returns {string}
 */
export function getEventGalleryLabel(slug) {
  return EVENT_GALLERY_MAP[slug]?.label ?? 'Acara';
}

export default EVENT_GALLERY_MAP;
