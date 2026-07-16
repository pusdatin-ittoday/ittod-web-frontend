/**
 * Data statis event (non-kompetisi) — meniru bentuk response API.
 * Nanti diganti dengan fetch dari services/eventService.js saat backend siap.
 */

const events = [
  {
    slug: "national-seminar",
    title: "National Seminar",
    tagline: "NATIONAL SEMINAR // 2026",
    shortDescription:
      "Seminar nasional menghadirkan pembicara terkemuka dari industri teknologi untuk berbagi insight terbaru tentang perkembangan dunia IT.",
    description:
      "National Seminar IT Today 2026 merupakan acara seminar berskala nasional yang menghadirkan pembicara-pembicara terkemuka dari berbagai bidang teknologi informasi. Acara ini bertujuan untuk memberikan wawasan mendalam mengenai tren teknologi terkini, inovasi digital, serta peluang karir di dunia IT. Peserta akan mendapatkan kesempatan untuk berdiskusi langsung dengan para ahli dan memperluas jaringan profesional mereka.",
    date: "14 September 2026",
    time: "09:00 - 16:00 WIB",
    registrationFee: "Gratis",
    benefits: [
      "Sertifikat peserta",
      "Materi seminar eksklusif",
      "Networking session",
      "Doorprize menarik",
    ],
    icon: "/logo-event/SEMINAR-NASIONAL.webp",
  },
  {
    slug: "bootcamp",
    title: "Bootcamp",
    tagline: "INTENSIVE BOOTCAMP // 2026",
    shortDescription:
      "Program pelatihan intensif selama 2 hari untuk mengasah keterampilan teknis di bidang teknologi informasi.",
    description:
      "Bootcamp IT Today 2026 adalah program pelatihan intensif yang dirancang untuk membekali peserta dengan keterampilan praktis di bidang teknologi informasi. Selama 2 hari, peserta akan belajar langsung dari praktisi berpengalaman melalui hands-on workshop, studi kasus nyata, dan proyek mini. Program ini cocok bagi mahasiswa dan profesional muda yang ingin meningkatkan kompetensi teknis mereka secara signifikan.",
    date: "24 & 31 Agustus 2026",
    time: "08:00 - 17:00 WIB",
    registrationFee: "Rp 50.000",
    benefits: [
      "Sertifikat kelulusan",
      "Akses materi selamanya",
      "Hands-on project experience",
      "Mentoring pribadi",
    ],
    icon: "/logo-event/BOOTCAMP.webp",
  },
  {
    slug: "workshop",
    title: "Workshop",
    tagline: "HANDS-ON WORKSHOP // 2026",
    shortDescription:
      "Workshop praktis dengan tema teknologi terkini, dipandu oleh instruktur profesional dari industri.",
    description:
      "Workshop IT Today 2026 merupakan sesi pelatihan praktis yang berfokus pada penerapan teknologi terkini dalam dunia nyata. Dipandu oleh instruktur profesional dari industri, workshop ini memberikan pengalaman belajar hands-on yang intensif. Peserta akan mengerjakan proyek langsung dan mendapatkan feedback real-time untuk meningkatkan keterampilan mereka dalam berbagai bidang teknologi.",
    date: "7 September 2026",
    time: "09:00 - 15:00 WIB",
    registrationFee: "Rp 35.000",
    benefits: [
      "Sertifikat peserta",
      "Kit workshop",
      "Akses recording",
      "Komunitas alumni",
    ],
    icon: "/logo-event/WORKSHOP.webp",
  },
];

/**
 * Data statistik landing page
 */
export const landingStats = [
  { count: "2100+", label: "Event Participants" },
  { count: "6500+", label: "Competition Participants" },
  { count: "30+", label: "Exhibitors" },
  { count: "50+", label: "Media Partners" },
];

/**
 * Timeline items untuk landing page
 */
export const timelineEvents = [
  { title: "Bootcamp", date: "5 & 12 September 2026", type: "event" },
  { title: "Workshop", date: "19 September 2026", type: "event" },
  { title: "Seminar Nasional", date: "20 September 2026", type: "event" },
  { title: "Final & Awarding", date: "27 September 2026", type: "event" },
];

export const timelineCompetitions = [
  { title: "Pendaftaran Batch Pertama", date: "17 - 30 Juli 2026", type: "competition" },
  { title: "Pendaftaran Batch Kedua", date: "31 Juli - 10 Agustus 2026", type: "competition" },
  { title: "Pengumuman Finalis", date: "20 September 2026", type: "competition" },
  { title: "Final & Awarding", date: "3 Oktober 2026", type: "competition" },
];

/**
 * Helper: cari event berdasarkan slug
 */
export const getEventBySlug = (slug) => {
  return events.find((e) => e.slug === slug) || null;
};

/**
 * Helper: ambil semua event
 */
export const getAllEvents = () => events;

export default events;
