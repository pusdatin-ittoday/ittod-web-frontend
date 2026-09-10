import React, { useEffect, useState } from 'react';
import { FiLoader } from 'react-icons/fi';
import { motion } from 'motion/react';

const rawApiBase = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_BASE = rawApiBase.endsWith('/') ? rawApiBase.slice(0, -1) : rawApiBase;

async function fetchResults(eventIdOrSlug) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventIdOrSlug}/results`);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch {
    return null;
  }
}

export default function CompetitionResultsBoard({ eventId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchResults(eventId).then((res) => {
      setData(res?.data || null);
      setLoading(false);
    });
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-[#313988]">
        <FiLoader className="animate-spin text-4xl" />
      </div>
    );
  }

  if (!data || !data.finalist_revealed) return null;

  const hasChampions = data.champion_revealed && data.champions?.length > 0;
  const hasFinalists = data.finalists?.length > 0;

  if (!hasChampions && !hasFinalists) return null;

  const t1 = hasChampions ? data.champions.find(t => t.rank === 1) : null;
  const t2 = hasChampions ? data.champions.find(t => t.rank === 2) : null;
  const t3 = hasChampions ? data.champions.find(t => t.rank === 3) : null;

  const getLeaderName = (team) => {
    if (!team || !team.members) return '';
    const leader = team.members.find(m => m.role === 'leader' || m.role === 'Ketua');
    return leader ? leader.name : (team.members[0]?.name || '');
  };

  const getDisplayName = (team) => {
    if (data.is_individual) return getLeaderName(team);
    return team.team_name;
  };

  const getSubTitle = (team) => {
    if (data.is_individual) return team.institution || 'IT TODAY 2026';
    return getLeaderName(team);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <motion.div 
      className="mt-16 w-full pb-8 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      {/* ═══ HEADER ═══ */}
      <motion.div variants={itemVariants} className="text-center mb-16">
        <h2 
          className="font-bebas text-5xl md:text-[5.5rem] leading-none uppercase text-[#111] transition-transform duration-300 hover:scale-105 cursor-default inline-block"
          style={{ textShadow: '-3px 3px 0 #FFD200, 2px -1px 0 #313988' }}
        >
          MEET OUR FINALISTS
        </h2>
        <p className="font-inter text-[#313988] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mt-4">
          The Best of IT Today 2026
        </p>
      </motion.div>

      {/* ═══ PODIUM (JUARA) ═══ */}
      {hasChampions && (
        <motion.div variants={itemVariants} className="flex items-end justify-center w-full max-w-4xl mx-auto mb-16">
          
          {/* Rank 2 */}
          {t2 && (
            <div className="w-[30%] flex flex-col border-[3px] border-black border-r-0 relative z-0 transition-transform duration-300 hover:-translate-y-4 hover:z-30 cursor-pointer group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border-[2px] border-black px-2 md:px-4 py-1 z-10 shadow-[4px_4px_0_#000] transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-inter font-black text-[10px] md:text-xs whitespace-nowrap text-black">2ND PLACE</span>
              </div>
              <div className="bg-[#313988] pt-12 pb-6 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[140px] transition-colors duration-300 group-hover:bg-[#3d46a3]">
                <h3 className="font-inter text-white font-black text-sm md:text-lg mb-2 uppercase break-words">{getDisplayName(t2)}</h3>
                <p className="font-inter text-[#999FFF] font-bold text-[9px] md:text-[10px] uppercase">
                  {getSubTitle(t2)}
                </p>
              </div>
              <div className="bg-[#dcdde5] h-28 md:h-36 flex items-center justify-center relative overflow-hidden">
                <span className="text-[6rem] md:text-[8rem] font-black text-black/10 absolute leading-none transition-transform duration-300 group-hover:scale-110">2</span>
              </div>
            </div>
          )}

          {/* Rank 1 */}
          {t1 && (
            <div className="w-[40%] flex flex-col border-[3px] border-black relative z-10 -mb-1 shadow-[4px_4px_0_#000] transition-transform duration-300 hover:-translate-y-6 hover:shadow-[8px_8px_0_#000] cursor-pointer group">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black border-[2px] border-white px-3 md:px-6 py-1.5 z-20 shadow-[4px_4px_0_#000] transition-transform duration-300 group-hover:-translate-y-2">
                <span className="font-inter font-black text-[#FFD200] text-xs md:text-sm whitespace-nowrap">CHAMPIONS</span>
              </div>
              <div className="bg-[#ffd200] pt-14 pb-8 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[180px] transition-colors duration-300 group-hover:bg-[#ffe033]">
                <h3 className="font-inter text-black font-black text-lg md:text-2xl mb-2 uppercase break-words">{getDisplayName(t1)}</h3>
                <p className="font-inter text-black font-bold text-[9px] md:text-xs uppercase">
                  {getSubTitle(t1)}
                </p>
              </div>
              <div className="bg-[#ebe4c9] h-40 md:h-48 flex items-center justify-center relative overflow-hidden">
                <span className="text-[8rem] md:text-[10rem] font-black text-black/10 absolute leading-none transition-transform duration-300 group-hover:scale-110">1</span>
              </div>
            </div>
          )}

          {/* Rank 3 */}
          {t3 && (
            <div className="w-[30%] flex flex-col border-[3px] border-black border-l-0 relative z-0 transition-transform duration-300 hover:-translate-y-4 hover:z-30 cursor-pointer group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black border-[2px] border-white px-2 md:px-4 py-1 z-10 shadow-[4px_4px_0_#000] transition-transform duration-300 group-hover:-translate-y-1">
                <span className="font-inter font-black text-white text-[10px] md:text-xs whitespace-nowrap">3RD PLACE</span>
              </div>
              <div className="bg-[#444444] pt-10 pb-5 px-2 text-center border-b-[3px] border-black flex flex-col justify-center min-h-[120px] transition-colors duration-300 group-hover:bg-[#555555]">
                <h3 className="font-inter text-white font-black text-sm md:text-base mb-2 uppercase break-words">{getDisplayName(t3)}</h3>
                <p className="font-inter text-gray-400 font-bold text-[9px] md:text-[10px] uppercase">
                  {getSubTitle(t3)}
                </p>
              </div>
              <div className="bg-[#dbdbdb] h-24 md:h-32 flex items-center justify-center relative overflow-hidden">
                <span className="text-[5rem] md:text-[7rem] font-black text-black/10 absolute leading-none transition-transform duration-300 group-hover:scale-110">3</span>
              </div>
            </div>
          )}
          
        </motion.div>
      )}

      {/* ═══ OTHER FINALISTS ═══ */}
      {hasFinalists && (
        <motion.div variants={itemVariants} className="border-[3px] md:border-[4px] border-black bg-white p-5 md:p-8 shadow-[6px_6px_0_#000] md:shadow-[10px_10px_0_#000] w-full max-w-4xl mx-auto">
          <h3 className="border-b-[3px] border-black inline-block pb-1 font-inter font-black text-sm md:text-lg mb-6 uppercase">
            Other Finalists
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
            {data.finalists.map((team, idx) => (
              <motion.div 
                key={team.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring', stiffness: 200 }}
                className="border-[2px] border-black p-4 rounded-md shadow-[3px_3px_0_#000] bg-white transition-all duration-300 hover:-translate-y-2 hover:shadow-[6px_6px_0_#000] cursor-pointer"
              >
                <h4 className="font-inter font-black text-black uppercase text-sm md:text-sm line-clamp-2">{getDisplayName(team)}</h4>
                <p className="font-inter text-[10px] font-bold text-gray-500 uppercase mt-2">
                  {getSubTitle(team)}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
