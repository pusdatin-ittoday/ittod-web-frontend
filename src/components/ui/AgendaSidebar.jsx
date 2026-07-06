import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';

const formatAgendaDate = (value) => {
  if (!value) return { date: 'Tanggal menyusul', time: null };

  const parsedDate = new Date(value);
  if (Number.isNaN(parsedDate.getTime())) {
    return { date: 'Tanggal menyusul', time: null };
  }

  return {
    date: new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(parsedDate),
    time: new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(parsedDate),
  };
};

/**
 * Agenda bersama untuk halaman detail event dan kompetisi.
 * Data bersumber dari event.timelines yang dikelola melalui Admin.
 */
const AgendaSidebar = ({ timelines = [], type = 'event' }) => {
  const isCompetition = type === 'competition';
  const accentColor = isCompetition ? 'bg-indigo-neo' : 'bg-yellow-neo';
  const sortedTimelines = [...timelines].sort(
    (first, second) => new Date(first.date).getTime() - new Date(second.date).getTime(),
  );

  return (
    <aside className="border-[3px] border-black bg-white shadow-[8px_8px_0_#111]">
      <div className={`${accentColor} border-b-[3px] border-black px-5 py-4`}>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#111]">
            <FiCalendar size={20} aria-hidden="true" />
          </div>
          <div>
            <p className="font-inter text-[9px] font-black uppercase tracking-[0.2em] text-black/70">
              Dikelola Panitia
            </p>
            <h2 className="font-inter text-lg font-black uppercase leading-tight text-black">
              Agenda {isCompetition ? 'Kompetisi' : 'Event'}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-5">
        {sortedTimelines.length === 0 ? (
          <div className="border-2 border-dashed border-black bg-[#f7f7f4] px-4 py-8 text-center">
            <p className="font-inter text-sm font-black uppercase text-black">
              Agenda belum tersedia
            </p>
            <p className="mt-2 font-inter text-xs leading-relaxed text-gray-600">
              Panitia akan menambahkan jadwal kegiatan melalui Admin.
            </p>
          </div>
        ) : (
          <ol className="space-y-0">
            {sortedTimelines.map((agenda, index) => {
              const formatted = formatAgendaDate(agenda.date);
              const isLast = index === sortedTimelines.length - 1;

              return (
                <li key={agenda.id || `${agenda.title}-${agenda.date}`} className="relative flex gap-4">
                  <div className="flex w-5 shrink-0 flex-col items-center">
                    <span
                      className={`mt-1 size-4 shrink-0 rounded-full border-2 border-black ${accentColor}`}
                    />
                    {!isLast && <span className="min-h-10 w-[3px] grow bg-black" />}
                  </div>

                  <div className={`min-w-0 flex-1 ${isLast ? 'pb-0' : 'pb-6'}`}>
                    <h3 className="font-inter text-sm font-black uppercase leading-snug text-black">
                      {agenda.title}
                    </h3>
                    <p className="mt-1 font-inter text-xs font-semibold text-gray-600">
                      {formatted.date}
                    </p>
                    {formatted.time && (
                      <p className="mt-1 flex items-center gap-1.5 font-inter text-[11px] font-bold text-gray-500">
                        <FiClock size={12} aria-hidden="true" />
                        {formatted.time} WIB
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </aside>
  );
};

export default AgendaSidebar;
