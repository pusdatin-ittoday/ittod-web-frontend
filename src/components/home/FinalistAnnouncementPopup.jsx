import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { FiAward, FiX, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { getAllCompetitionResults } from "../../services/eventService";

const POPUP_DISMISS_KEY = "ittod_finalist_popup_dismissed";

export default function FinalistAnnouncementPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [championRevealed, setChampionRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Cek apakah sudah pernah ditutup dalam sesi browser ini
    const isDismissed = sessionStorage.getItem(POPUP_DISMISS_KEY) === "true";
    if (isDismissed) return;

    let isMounted = true;
    getAllCompetitionResults().then((res) => {
      if (!isMounted) return;
      if (res.success && res.data) {
        // Hanya anggap juara tayang jika flag champion_revealed aktif DAN ada tim juara di data kompetisi
        const hasActualChampions = Boolean(
          res.data.champion_revealed &&
          res.data.competitions?.some((c) => c.champion_revealed && c.champions?.length > 0)
        );

        const hasRevealed = res.data.finalist_revealed || hasActualChampions;
        if (hasRevealed) {
          setChampionRevealed(hasActualChampions);
          // Delay sedikit agar transisi halaman awal mulus
          setTimeout(() => {
            if (isMounted) setIsOpen(true);
          }, 600);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleClose = () => {
    sessionStorage.setItem(POPUP_DISMISS_KEY, "true");
    setIsOpen(false);
  };

  const handleNavigate = () => {
    sessionStorage.setItem(POPUP_DISMISS_KEY, "true");
    setIsOpen(false);
    navigate("/finalist");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm">
          {/* Backdrop click to close */}
          <div className="absolute inset-0" onClick={handleClose} />

          {/* Modal Box Neo-Brutalist */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="relative w-full max-w-lg bg-white border-[4px] border-black shadow-[10px_10px_0_#000] p-6 sm:p-8 z-10 font-inter"
          >
            {/* Top Badge */}
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[#ffd200] border-[2px] border-black px-3 py-1 font-inter font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[2px_2px_0_#000]">
                <FiAward className="text-black text-sm" />
                PENGUMUMAN RESMI
              </span>

              <button
                onClick={handleClose}
                aria-label="Tutup pop-up"
                className="w-8 h-8 bg-gray-100 hover:bg-red-500 hover:text-white border-[2px] border-black flex items-center justify-center font-black transition-colors cursor-pointer"
              >
                <FiX className="text-lg" />
              </button>
            </div>

            {/* Title */}
            <h2
              className="font-bebas text-3xl sm:text-5xl uppercase tracking-wide leading-tight text-black mb-3"
              style={{ textShadow: "-2px 2px 0 #FFD200" }}
            >
              {championRevealed
                ? "SIAPAKAH PARA JUARA?"
                : "SIAPAKAH PARA FINALIS?"}
            </h2>

            {/* Description */}
            {championRevealed ?
              <p className="font-inter text-gray-700 text-xs sm:text-sm leading-relaxed mb-6">
                Selamat kepada seluruh tim yang berhasil menjuarai kompetisi! Daftar lengkap
                finalis dan juara dari setiap cabang kompetisi <strong>IT Today 2026</strong> kini
                dapat diakses pada halaman pengumuman <strong>Finalist</strong>.
              </p>
              :
              <p className="font-inter text-gray-700 text-xs sm:text-sm leading-relaxed mb-6">
                Selamat kepada seluruh tim yang berhasil melangkah ke babak selanjutnya! Daftar lengkap
                finalis dan juara dari setiap cabang kompetisi <strong>IT Today 2026</strong> kini
                dapat diakses pada halaman pengumuman <strong>Finalist</strong>.
              </p>
            }
            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3">
              <button
                onClick={handleNavigate}
                className="flex-1 bg-[#ffd200] hover:bg-yellow-400 text-black font-inter font-black text-xs sm:text-sm py-3.5 px-5 border-[2.5px] border-black shadow-[4px_4px_0_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lihat sekarang!</span>
                <FiArrowRight className="text-base" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
