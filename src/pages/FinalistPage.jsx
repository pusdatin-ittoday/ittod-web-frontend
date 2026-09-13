import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  FiChevronLeft, 
  FiChevronRight, 
  FiAward, 
  FiUsers, 
  FiLoader, 
  FiAlertCircle, 
  FiCheckCircle, 
  FiExternalLink 
} from "react-icons/fi";
import NavbarNeo from "../components/layout/Navbar";
import FooterNeo from "../components/layout/Footer";
import { getAllCompetitionResults } from "../services/eventService";

const getFallbackLogo = (comp) => {
  const name = (comp?.slug || comp?.title || "").toLowerCase();
  if (name.includes("hack")) return "/logo-competition/HACKTODAY.webp";
  if (name.includes("ux")) return "/logo-competition/UXTODAY.webp";
  if (name.includes("mine")) return "/logo-competition/MINETODAY.webp";
  if (name.includes("game") || name.includes("brain") || name.includes("code")) return "/logo-competition/GAMETODAY.webp";
  return "/logo-ittod.webp";
};

export default function FinalistPage() {
  const [loading, setLoading] = useState(true);
  const [competitions, setCompetitions] = useState([]);
  const [selectedCompId, setSelectedCompId] = useState(null);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    const loadResults = async () => {
      setLoading(true);
      try {
        const res = await getAllCompetitionResults();
        if (!isMounted) return;

        if (res.success && res.data?.competitions) {
          setCompetitions(res.data.competitions);
          // Prioritaskan kompetisi yang sudah revealed, atau pilih yang pertama
          const firstRevealed = res.data.competitions.find((c) => c.finalist_revealed);
          const defaultComp = firstRevealed || res.data.competitions[0];
          if (defaultComp) {
            setSelectedCompId(defaultComp.id);
          }
        } else {
          setError(res.error || "Gagal memuat data kompetisi");
        }
      } catch (err) {
        if (isMounted) setError("Terjadi kesalahan saat memuat data finalis.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadResults();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = 280;
    sliderRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const selectedComp = competitions.find((c) => c.id === selectedCompId) || competitions[0];

  const getLeaderName = (team) => {
    if (!team || !team.members) return "";
    const leader = team.members.find((m) => m.role === "leader" || m.role === "Ketua");
    return leader ? leader.name : team.members[0]?.name || "";
  };

  const getDisplayName = (team, isIndividual) => {
    if (isIndividual) return getLeaderName(team);
    return team.team_name;
  };

  const getSubTitle = (team, isIndividual) => {
    if (isIndividual) return team.institution || "IT TODAY 2026";
    return getLeaderName(team);
  };

  const hasChampions = selectedComp?.champion_revealed && selectedComp?.champions?.length > 0;
  const t1 = hasChampions ? selectedComp.champions.find((t) => t.rank === 1) : null;
  const t2 = hasChampions ? selectedComp.champions.find((t) => t.rank === 2) : null;
  const t3 = hasChampions ? selectedComp.champions.find((t) => t.rank === 3) : null;

  return (
    <div className="min-h-screen bg-[#FBFBF8] text-black flex flex-col font-inter selection:bg-[#ffd200] selection:text-black">
      <NavbarNeo />

      <main className="flex-1 pt-24 md:pt-28 pb-20 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
        {/* ═══ HERO / HEADER SECTION ═══ */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[#ffd200] border-[2.5px] border-black px-4 py-1.5 shadow-[3px_3px_0_#000] mb-4">
            <FiAward className="text-black text-lg animate-bounce" />
            <span className="font-inter font-black text-xs md:text-sm tracking-widest uppercase">
              OFFICIAL ANNOUNCEMENT
            </span>
          </div>

          <h1
            className="font-bebas text-5xl sm:text-6xl md:text-8xl leading-none uppercase tracking-wide text-[#111] transition-transform duration-300 cursor-default"
            style={{ textShadow: "-3px 3px 0 #FFD200, 3px -2px 0 #313988" }}
          >
            FINALISTS & CHAMPIONS
          </h1>

          <p className="font-inter text-gray-700 font-medium text-sm md:text-base max-w-2xl mx-auto mt-3">
            Inilah daftar tim dan peserta terbaik yang berhasil melangkah ke babak final dan menorehkan prestasi gemilang di IT Today 2026.
          </p>
        </div>

        {/* ═══ LOADING & ERROR STATE ═══ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 text-[#313988]">
            <FiLoader className="animate-spin text-5xl mb-4" />
            <span className="font-inter font-bold text-sm tracking-widest uppercase">
              Memuat Data Finalis...
            </span>
          </div>
        )}

        {error && !loading && (
          <div className="max-w-xl mx-auto bg-red-100 border-[3px] border-black p-6 shadow-[6px_6px_0_#000] text-center my-12">
            <FiAlertCircle className="text-4xl text-red-600 mx-auto mb-2" />
            <h3 className="font-inter font-black text-lg text-black uppercase mb-1">Gagal Memuat Data</h3>
            <p className="font-inter text-sm text-gray-700">{error}</p>
          </div>
        )}

        {!loading && !error && competitions.length > 0 && (
          <>
            {/* ═══ COMPETITION SELECTOR SLIDER (GESER KIRI-KANAN) ═══ */}
            <div className="relative mb-12">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-[#ffd200] border-[2px] border-black inline-block"></span>
                  <h2 className="font-inter font-black text-sm md:text-base tracking-wider uppercase">
                    Pilih Cabang Kompetisi
                  </h2>
                </div>

                {/* Tombol Geser Kiri / Kanan */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleScroll("left")}
                    aria-label="Geser ke kiri"
                    className="w-10 h-10 md:w-11 md:h-11 bg-white hover:bg-[#ffd200] border-[2.5px] border-black shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center font-black transition-all cursor-pointer"
                  >
                    <FiChevronLeft className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleScroll("right")}
                    aria-label="Geser ke kanan"
                    className="w-10 h-10 md:w-11 md:h-11 bg-white hover:bg-[#ffd200] border-[2.5px] border-black shadow-[3px_3px_0_#000] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center font-black transition-all cursor-pointer"
                  >
                    <FiChevronRight className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Slider Track */}
              <div
                ref={sliderRef}
                className="flex items-stretch gap-4 md:gap-5 overflow-x-auto pb-4 pt-1 px-1 scroll-smooth no-scrollbar"
                style={{ scrollSnapType: "x mandatory" }}
              >
                {competitions.map((comp) => {
                  const isSelected = comp.id === selectedComp?.id;
                  const logoSrc = comp.logo_url || getFallbackLogo(comp);

                  return (
                    <button
                      key={comp.id}
                      onClick={() => setSelectedCompId(comp.id)}
                      style={{ scrollSnapAlign: "start" }}
                      className={`flex-shrink-0 w-64 md:w-72 p-4 text-left border-[3px] border-black transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? "bg-[#ffd200] shadow-[6px_6px_0_#000] -translate-y-1.5 ring-2 ring-black"
                          : "bg-white shadow-[4px_4px_0_#000] hover:-translate-y-1 hover:shadow-[6px_6px_0_#000] hover:bg-yellow-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-white border-[2px] border-black p-1 flex-shrink-0 shadow-[2px_2px_0_#000] flex items-center justify-center overflow-hidden">
                          <img
                            src={logoSrc}
                            alt={comp.title}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getFallbackLogo(comp);
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-inter font-black text-base md:text-lg leading-tight uppercase truncate">
                            {comp.title}
                          </h3>
                          <span className="font-inter text-[10px] md:text-xs text-gray-700 font-bold uppercase tracking-wider block mt-0.5">
                            {comp.participation_type === "individual" ? "Individu" : "Tim"}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ═══ SELECTED COMPETITION DETAILS ═══ */}
            {selectedComp && (
              <div className="mt-4">
                {/* Lomba Header Banner */}
                <div className="bg-white border-[3.5px] border-black p-5 md:p-8 shadow-[8px_8px_0_#000] mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-4 md:gap-6">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-yellow-100 border-[3px] border-black p-2 shadow-[4px_4px_0_#000] flex items-center justify-center flex-shrink-0">
                      <img
                        src={selectedComp.logo_url || getFallbackLogo(selectedComp)}
                        alt={selectedComp.title}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getFallbackLogo(selectedComp);
                        }}
                      />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="bg-[#313988] text-white font-inter font-black text-[10px] md:text-xs px-2.5 py-0.5 uppercase tracking-wider">
                          CABANG KOMPETISI
                        </span>
                        {selectedComp.champion_revealed ? (
                          <span className="bg-[#ffd200] text-black font-inter font-black text-[10px] md:text-xs px-2.5 py-0.5 border border-black uppercase tracking-wider">
                            JUARA & FINALIS
                          </span>
                        ) : selectedComp.finalist_revealed ? (
                          <span className="bg-blue-100 text-[#313988] font-inter font-black text-[10px] md:text-xs px-2.5 py-0.5 border border-black uppercase tracking-wider">
                            FINALIS
                          </span>
                        ) : (
                          <span className="bg-gray-200 text-gray-600 font-inter font-black text-[10px] md:text-xs px-2.5 py-0.5 border border-black uppercase tracking-wider">
                            BELUM TAYANG
                          </span>
                        )}
                      </div>
                      <h2 className="font-bebas text-3xl md:text-5xl uppercase tracking-wide leading-none text-black">
                        {selectedComp.title}
                      </h2>
                      {selectedComp.description && (
                        <p className="font-inter text-xs md:text-sm text-gray-600 max-w-2xl mt-1 line-clamp-2">
                          {selectedComp.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <Link
                    to={`/competition/${selectedComp.slug || selectedComp.id}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#ffd200] hover:bg-yellow-400 text-black font-inter font-black text-xs md:text-sm px-5 py-3 border-[2.5px] border-black shadow-[4px_4px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase whitespace-nowrap self-start md:self-auto"
                  >
                    <span>Detail Lomba</span>
                    <FiExternalLink />
                  </Link>
                </div>

                {/* ═══ KONDISI 1: JIKA BELUM TAYANG ═══ */}
                {!selectedComp.finalist_revealed ? (
                  <div className="border-[3px] md:border-[4px] border-black bg-white p-8 md:p-14 shadow-[8px_8px_0_#000] text-center max-w-2xl mx-auto my-10">
                    <div className="w-16 h-16 bg-[#ffd200] border-[2px] border-black mx-auto flex items-center justify-center mb-4 shadow-[4px_4px_0_#000]">
                      <FiAlertCircle className="text-3xl text-black" />
                    </div>
                    <h3 className="font-bebas text-3xl md:text-4xl uppercase text-black mb-2 tracking-wide">
                      PENGUMUMAN BELUM TERSEDIA
                    </h3>
                    <p className="font-inter text-sm md:text-base text-gray-700 font-medium max-w-md mx-auto">
                      Pengumuman finalis untuk cabang kompetisi <strong>{selectedComp.title}</strong> belum resmi dirilis. Nantikan sesuai jadwal di timeline IT Today 2026.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* ═══ KONDISI 2: ELEMEN PODIUM JUARA (JIKA CHAMPION REVEALED) ═══ */}
                    {hasChampions && (
                      <div className="mb-20">
                        <div className="text-center mb-10">
                          <h3
                            className="font-bebas text-4xl md:text-6xl text-black uppercase tracking-wide leading-none"
                            style={{ textShadow: "-2px 2px 0 #FFD200" }}
                          >
                            CONGRATULATIONS!
                          </h3>
                        </div>

                        {/* Podium Board */}
                        <div className="flex items-end justify-center w-full max-w-4xl mx-auto mb-6 px-2">
                          {/* Rank 2 (Kiri) */}
                          {t2 && (
                            <div className="w-[31%] flex flex-col border-[3px] border-black border-r-0 relative z-0 transition-transform duration-300 hover:-translate-y-3 hover:z-30 cursor-pointer group">
                              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-white border-[2px] border-black px-2 md:px-4 py-0.5 md:py-1 z-10 shadow-[3px_3px_0_#000] group-hover:-translate-y-0.5 transition-transform">
                                <span className="font-inter font-black text-[9px] md:text-xs whitespace-nowrap text-black">
                                  2ND PLACE
                                </span>
                              </div>
                              <div className="bg-[#313988] pt-10 md:pt-12 pb-5 md:pb-6 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[130px] md:min-h-[150px]">
                                <h4 className="font-inter text-white font-black text-xs md:text-lg mb-1 uppercase break-words leading-tight">
                                  {getDisplayName(t2, selectedComp.is_individual)}
                                </h4>
                                <p className="font-inter text-[#999FFF] font-bold text-[8px] md:text-[10px] uppercase truncate">
                                  {getSubTitle(t2, selectedComp.is_individual)}
                                </p>
                              </div>
                              <div className="bg-[#dcdde5] h-24 md:h-36 flex items-center justify-center relative overflow-hidden">
                                <span className="text-[5rem] md:text-[8rem] font-black text-black/10 absolute leading-none">
                                  2
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Rank 1 (Tengah) */}
                          {t1 && (
                            <div className="w-[38%] flex flex-col border-[3px] border-black relative z-10 -mb-1 shadow-[5px_5px_0_#000] transition-transform duration-300 hover:-translate-y-4 hover:shadow-[8px_8px_0_#000] cursor-pointer group">
                              <div className="absolute -top-4 md:-top-5 left-1/2 -translate-x-1/2 bg-black border-[2px] border-white px-2.5 md:px-5 py-1 z-20 shadow-[3px_3px_0_#000] group-hover:-translate-y-1 transition-transform">
                                <span className="font-inter font-black text-[#FFD200] text-[10px] md:text-sm whitespace-nowrap tracking-wider">
                                  CHAMPION
                                </span>
                              </div>
                              <div className="bg-[#ffd200] pt-12 md:pt-16 pb-6 md:pb-8 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[160px] md:min-h-[190px]">
                                <h4 className="font-inter text-black font-black text-sm md:text-2xl mb-1 uppercase break-words leading-tight">
                                  {getDisplayName(t1, selectedComp.is_individual)}
                                </h4>
                                <p className="font-inter text-black font-bold text-[9px] md:text-xs uppercase truncate">
                                  {getSubTitle(t1, selectedComp.is_individual)}
                                </p>
                              </div>
                              <div className="bg-[#ebe4c9] h-36 md:h-52 flex items-center justify-center relative overflow-hidden">
                                <span className="text-[7rem] md:text-[10rem] font-black text-black/10 absolute leading-none">
                                  1
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Rank 3 (Kanan) */}
                          {t3 && (
                            <div className="w-[31%] flex flex-col border-[3px] border-black border-l-0 relative z-0 transition-transform duration-300 hover:-translate-y-3 hover:z-30 cursor-pointer group">
                              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-black border-[2px] border-white px-2 md:px-4 py-0.5 md:py-1 z-10 shadow-[3px_3px_0_#000] group-hover:-translate-y-0.5 transition-transform">
                                <span className="font-inter font-black text-white text-[9px] md:text-xs whitespace-nowrap">
                                  3RD PLACE
                                </span>
                              </div>
                              <div className="bg-[#444444] pt-9 md:pt-11 pb-5 md:pb-6 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[120px] md:min-h-[135px]">
                                <h4 className="font-inter text-white font-black text-xs md:text-base mb-1 uppercase break-words leading-tight">
                                  {getDisplayName(t3, selectedComp.is_individual)}
                                </h4>
                                <p className="font-inter text-gray-300 font-bold text-[8px] md:text-[10px] uppercase truncate">
                                  {getSubTitle(t3, selectedComp.is_individual)}
                                </p>
                              </div>
                              <div className="bg-[#dbdbdb] h-20 md:h-30 flex items-center justify-center relative overflow-hidden">
                                <span className="text-[4.5rem] md:text-[7rem] font-black text-black/10 absolute leading-none">
                                  3
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ═══ DAFTAR TIM FINALIS ═══ */}
                    <div className="border-[3.5px] border-black bg-white p-6 md:p-10 shadow-[8px_8px_0_#000]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-[3px] border-black pb-5 mb-8">
                        <div>
                          <span className="font-inter font-black text-xs text-[#313988] uppercase tracking-widest block mb-1">
                            {hasChampions ? "COMPETITORS" : "ALL FINALISTS"}
                          </span>
                          <h3 className="font-bebas text-3xl md:text-4xl text-black uppercase tracking-wide leading-none">
                            {hasChampions ? "FINALIS LAINNYA" : `DAFTAR FINALIS ${selectedComp.title}`}
                          </h3>
                        </div>

                        <div className="bg-[#ffd200] border-[2px] border-black px-4 py-1.5 shadow-[2px_2px_0_#000] self-start sm:self-auto font-inter font-black text-xs md:text-sm uppercase">
                          TOTAL: {selectedComp.finalists?.length || 0} TIM
                        </div>
                      </div>

                      {selectedComp.finalists && selectedComp.finalists.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                          {selectedComp.finalists.map((team, idx) => (
                            <div
                              key={team.id || idx}
                              className="border-[2.5px] border-black p-5 bg-[#FAF9F5] shadow-[4px_4px_0_#000] hover:-translate-y-1.5 hover:shadow-[7px_7px_0_#000] hover:bg-[#FFFDF0] transition-all flex flex-col justify-between"
                            >
                              <div>
                                <div className="flex items-center justify-between gap-2 mb-3">
                                  <span className="bg-[#313988] text-white font-inter font-black text-[9px] md:text-[10px] px-2 py-0.5 uppercase tracking-wider">
                                    FINALIS #{idx + 1}
                                  </span>
                                  {team.institution && (
                                    <span className="font-inter text-[10px] font-bold text-gray-500 uppercase truncate max-w-[150px]">
                                      {team.institution}
                                    </span>
                                  )}
                                </div>

                                <h4 className="font-inter font-black text-black text-base md:text-lg uppercase leading-tight mb-3 break-words">
                                  {getDisplayName(team, selectedComp.is_individual)}
                                </h4>
                              </div>

                              {/* Anggota / Ketua */}
                              {team.members && team.members.length > 0 && (
                                <div className="border-t-[1.5px] border-black/20 pt-3 mt-3">
                                  <div className="flex items-center gap-1.5 text-gray-700 mb-1.5">
                                    <FiUsers className="text-xs flex-shrink-0" />
                                    <span className="font-inter text-[10px] font-bold uppercase tracking-wider text-gray-500">
                                      Anggota Tim:
                                    </span>
                                  </div>
                                  <ul className="space-y-1">
                                    {team.members.map((m, mIdx) => (
                                      <li
                                        key={mIdx}
                                        className="font-inter text-xs font-semibold text-gray-800 flex items-center justify-between gap-2"
                                      >
                                        <span className="truncate">{m.name}</span>
                                        {m.role && (
                                          <span className="text-[9px] bg-gray-200 border border-black/40 px-1.5 py-0.2 rounded font-bold uppercase flex-shrink-0">
                                            {m.role}
                                          </span>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-12 text-center text-gray-500 font-inter">
                          <FiCheckCircle className="text-3xl mx-auto mb-2 text-gray-400" />
                          <p className="font-bold text-sm uppercase">
                            Belum ada finalis yang terdaftar pada kategori ini.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <FooterNeo />
    </div>
  );
}
