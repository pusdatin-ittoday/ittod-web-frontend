import React, { useEffect, useState } from 'react';
import { FiAward, FiLoader, FiUsers } from 'react-icons/fi';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const RANK_META = {
  1: { emoji: '🥇', label: 'Juara 1', accent: 'bg-yellow-neo', dot: 'bg-yellow-neo' },
  2: { emoji: '🥈', label: 'Juara 2', accent: 'bg-[#C0C0C0]',  dot: 'bg-[#C0C0C0]' },
  3: { emoji: '🥉', label: 'Juara 3', accent: 'bg-[#CD7F32]',  dot: 'bg-[#CD7F32]' },
};

async function fetchResults(eventIdOrSlug) {
  try {
    const res = await fetch(`${API_BASE}/api/events/${eventIdOrSlug}/results`);
    if (!res.ok) throw new Error('fetch failed');
    return await res.json();
  } catch {
    return null;
  }
}

/** ═══ Champion Card (podium) — full neobrutalism ═══ */
function ChampionCard({ team }) {
  const meta = RANK_META[team.rank] || RANK_META[3];

  return (
    <div className="border-[3px] border-black bg-white shadow-[6px_6px_0_#111] transition-transform duration-200 hover:-translate-y-1">
      {/* Header accent bar */}
      <div className={`${meta.accent} border-b-[3px] border-black px-4 py-3 flex items-center gap-2`}>
        <span className="text-xl leading-none">{meta.emoji}</span>
        <span className="font-inter text-sm font-black uppercase tracking-wide text-black">
          {meta.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="font-inter text-lg font-black uppercase leading-tight text-black">
          {team.team_name}
        </h3>
        {team.institution && (
          <p className="mt-1 font-inter text-xs font-semibold text-gray-500 uppercase tracking-wide">
            🏫 {team.institution}
          </p>
        )}

        {team.members?.length > 0 && (
          <div className="mt-3 border-t-[2px] border-black pt-3">
            <p className="font-inter text-[10px] font-black uppercase tracking-wider text-gray-400 mb-2">
              Anggota
            </p>
            <ul className="space-y-1">
              {team.members.map((m, i) => (
                <li key={i} className="flex items-center gap-2">
                  <FiUsers size={11} className="flex-shrink-0 text-gray-400" />
                  <span className="font-inter text-xs font-semibold text-black">{m.name}</span>
                  {m.role === 'leader' && (
                    <span className="border border-black px-1.5 py-0.5 font-inter text-[9px] font-black uppercase tracking-wide text-black">
                      Ketua
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

/** ═══ Finalist Row Card — neobrutalism list item ═══ */
function FinalistCard({ team }) {
  return (
    <div className="flex items-stretch border-[2px] border-black bg-white shadow-[4px_4px_0_#111] transition-transform duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111]">
      {/* Content */}
      <div className="min-w-0 flex-1 px-5 py-4">
        <p className="font-inter text-sm font-black uppercase leading-tight text-black truncate">
          {team.team_name}
        </p>
        {team.institution && (
          <p className="mt-0.5 font-inter text-[11px] font-semibold uppercase tracking-wide text-gray-500">
            {team.institution}
          </p>
        )}
        {team.members?.length > 0 && (
          <p className="mt-1.5 font-inter text-[11px] font-semibold text-gray-500">
            {team.members.map((m) => m.name).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * CompetitionResultsBoard
 * Menampilkan daftar finalis dan juara dengan tema neobrutalism sesuai web IT TODAY.
 * Hanya render jika finalist_revealed = true dari API.
 */
export default function CompetitionResultsBoard({ eventId }) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) return;
    setLoading(true);
    fetchResults(eventId).then((res) => {
      if (res?.success) setData(res.data);
      setLoading(false);
    });
  }, [eventId]);

  if (loading) {
    return (
      <div className="mt-8 flex items-center justify-center gap-2 py-6 font-inter text-xs font-bold uppercase tracking-wide text-gray-400">
        <FiLoader className="animate-spin" size={14} />
        Memuat hasil kompetisi...
      </div>
    );
  }

  if (!data || !data.finalist_revealed) return null;

  const hasChampions = data.champion_revealed && data.champions?.length > 0;
  const hasFinalists = data.finalists?.length > 0;

  if (!hasChampions && !hasFinalists) return null;

  return (
    <div className="mt-10 space-y-10">

      {/* ═══ JUARA ═══ */}
      {hasChampions && (
        <div>
          {/* Section header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center border-[3px] border-black bg-yellow-neo shadow-[3px_3px_0_#111]">
              <FiAward size={20} className="text-black" />
            </div>
            <h2 className="border-b-[4px] border-black pb-1 font-inter text-2xl font-black uppercase leading-tight text-black">
              Daftar Juara
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...data.champions]
              .sort((a, b) => (a.rank ?? 99) - (b.rank ?? 99))
              .map((team) => (
                <ChampionCard key={team.id} team={team} />
              ))}
          </div>
        </div>
      )}

      {/* ═══ FINALIS ═══ */}
      {hasFinalists && (
        <div>
          {/* Section header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center border-[3px] border-black bg-[#f7f7f4] shadow-[3px_3px_0_#111]">
              <span className="text-lg leading-none">⭐</span>
            </div>
            <h2 className="border-b-[4px] border-black pb-1 font-inter text-2xl font-black uppercase leading-tight text-black">
              Daftar Finalis
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {data.finalists.map((team, i) => (
              <FinalistCard key={team.id} team={team} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
