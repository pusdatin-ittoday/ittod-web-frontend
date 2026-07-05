/**
 * Data statis kompetisi — meniru bentuk response API.
 * Nanti diganti dengan fetch dari services/competitionService.js saat backend siap.
 */

const competitions = [
  {
    slug: "hack-today",
    title: "Hack Today",
    tagline: "CYBERSECURITY CAPTURE THE FLAG // 2026",
    shortDescription:
      "Kompetisi Capture The Flag (CTF) berskala nasional yang menguji kemampuan di bidang keamanan siber.",
    description:
      "Hack Today adalah kompetisi Capture The Flag (CTF) berskala nasional yang diselenggarakan oleh IT Today 2026. Kompetisi ini menguji kemampuan peserta dalam berbagai aspek keamanan siber, termasuk web exploitation, reverse engineering, cryptography, forensics, dan binary exploitation. Peserta akan menghadapi tantangan-tantangan yang dirancang oleh para ahli keamanan siber untuk mengasah keterampilan hacking secara etis dan legal.",
    registrationDeadline: "15 Agustus 2026",
    teamSize: "1-3 orang",
    registrationFee: "Rp 100.000 / tim",
    prizePool: "Rp 15.000.000",
    categories: [
      {
        name: "Web Exploitation",
        icon: "🌐",
        description: "Eksploitasi kerentanan pada aplikasi web",
      },
      {
        name: "Reverse Engineering",
        icon: "🔧",
        description: "Analisis dan dekompilasi program",
      },
      {
        name: "Cryptography",
        icon: "🔐",
        description: "Pemecahan algoritma enkripsi",
      },
      {
        name: "Forensics",
        icon: "🔍",
        description: "Investigasi digital dan analisis bukti",
      },
    ],
    guidebookUrl: "#",
    icon: "/logo-competition/HACKTODAY.webp",
  },
  {
    slug: "mine-today",
    title: "Mine Today",
    tagline: "DATA MINING COMPETITION // 2026",
    shortDescription:
      "Kompetisi data mining nasional yang menguji kemampuan analisis data dan machine learning.",
    description:
      "Mine Today adalah kompetisi data mining berskala nasional yang menantang peserta untuk mengolah, menganalisis, dan mengekstrak informasi berharga dari dataset kompleks. Peserta akan menggunakan teknik-teknik machine learning, statistical analysis, dan data visualization untuk menyelesaikan permasalahan nyata. Kompetisi ini merupakan wadah bagi para data enthusiast untuk menunjukkan kemampuan mereka dalam mengubah data mentah menjadi insight yang bermakna.",
    registrationDeadline: "15 Agustus 2026",
    teamSize: "2-3 orang",
    registrationFee: "Rp 100.000 / tim",
    prizePool: "Rp 15.000.000",
    categories: [
      {
        name: "Data Preprocessing",
        icon: "📊",
        description: "Pembersihan dan transformasi data",
      },
      {
        name: "Machine Learning",
        icon: "🤖",
        description: "Pemodelan dan prediksi data",
      },
      {
        name: "Data Visualization",
        icon: "📈",
        description: "Visualisasi insight dari data",
      },
      {
        name: "Statistical Analysis",
        icon: "📐",
        description: "Analisis statistik mendalam",
      },
    ],
    guidebookUrl: "#",
    icon: "/logo-competition/MINETODAY.webp",
  },
  {
    slug: "ux-today",
    title: "UX Today",
    tagline: "UI/UX DESIGN COMPETITION // 2026",
    shortDescription:
      "Kompetisi desain UI/UX yang mengajak peserta menciptakan solusi digital yang user-centered.",
    description:
      "UX Today adalah kompetisi desain UI/UX berskala nasional yang mengajak peserta untuk merancang solusi digital yang inovatif dan berpusat pada pengguna. Peserta akan ditantang untuk melakukan riset pengguna, membuat wireframe, merancang prototype interaktif, dan mempresentasikan desain mereka di hadapan juri profesional. Kompetisi ini merupakan kesempatan emas bagi para desainer muda untuk membuktikan kemampuan mereka dalam menciptakan pengalaman pengguna yang luar biasa.",
    registrationDeadline: "15 Agustus 2026",
    teamSize: "2-3 orang",
    registrationFee: "Rp 100.000 / tim",
    prizePool: "Rp 15.000.000",
    categories: [
      {
        name: "User Research",
        icon: "👤",
        description: "Riset kebutuhan dan perilaku pengguna",
      },
      {
        name: "Wireframing",
        icon: "🖼️",
        description: "Pembuatan kerangka layout",
      },
      {
        name: "Prototyping",
        icon: "⚡",
        description: "Prototype interaktif high-fidelity",
      },
      {
        name: "Usability Testing",
        icon: "✅",
        description: "Pengujian kegunaan desain",
      },
    ],
    guidebookUrl: "#",
    icon: "/logo-competition/UXTODAY.webp",
  },
  {
    slug: "game-today",
    title: "Game Today",
    tagline: "GAME DEVELOPMENT COMPETITION // 2026",
    shortDescription:
      "Kompetisi pengembangan game yang mengajak peserta menciptakan game inovatif dan kreatif.",
    description:
      "Game Today adalah kompetisi pengembangan game berskala nasional yang menantang peserta untuk menciptakan game digital yang inovatif, kreatif, dan menarik. Peserta akan mengembangkan game dari konsep hingga produk jadi, mencakup aspek game design, programming, art, dan audio. Kompetisi ini terbuka untuk berbagai platform dan engine, memberikan kebebasan kreativitas bagi para game developer muda untuk menunjukkan karya terbaik mereka.",
    registrationDeadline: "15 Agustus 2026",
    teamSize: "2-4 orang",
    registrationFee: "Rp 100.000 / tim",
    prizePool: "Rp 15.000.000",
    categories: [
      {
        name: "Game Design",
        icon: "🎮",
        description: "Perancangan mekanik dan gameplay",
      },
      {
        name: "Game Art",
        icon: "🎨",
        description: "Desain visual dan aset game",
      },
      {
        name: "Game Programming",
        icon: "💻",
        description: "Pengembangan logika dan sistem game",
      },
      {
        name: "Game Audio",
        icon: "🎵",
        description: "Desain suara dan musik game",
      },
    ],
    guidebookUrl: "#",
    icon: "/logo-competition/GAMETODAY.webp",
  },
];

/**
 * Helper: cari kompetisi berdasarkan slug
 */
export const getCompetitionBySlug = (slug) => {
  return competitions.find((c) => c.slug === slug) || null;
};

/**
 * Helper: ambil semua kompetisi
 */
export const getAllCompetitions = () => competitions;

export default competitions;
