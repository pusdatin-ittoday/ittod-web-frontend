import React from 'react';
import { FiCalendar, FiClock } from 'react-icons/fi';
import { parseWIB } from '../../utils/dateFormatter';

const formatAgendaDate = (startDateValue, endDateValue = null) => {
  if (!startDateValue) return { date: 'Tanggal menyusul', time: null };

  const parsedStartDate = parseWIB(startDateValue);
  if (!parsedStartDate || Number.isNaN(parsedStartDate.getTime())) {
    return { date: 'Tanggal menyusul', time: null };
  }

  const getLocalDateString = (d) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(d);

  const getMonthYearString = (d) =>
    new Intl.DateTimeFormat('id-ID', {
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(d);

  const getDayString = (d) =>
    new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(d);

  const formatTime = (d) =>
    new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(d);

  const formatDateSingle = (d) =>
    new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'Asia/Jakarta',
    }).format(d);

  if (endDateValue) {
    const parsedEndDate = parseWIB(endDateValue);
    if (parsedEndDate && !Number.isNaN(parsedEndDate.getTime())) {
      if (getLocalDateString(parsedStartDate) === getLocalDateString(parsedEndDate)) {
        // Same day
        const startTime = formatTime(parsedStartDate);
        const endTime = formatTime(parsedEndDate);
        
        return {
          date: formatDateSingle(parsedStartDate),
          time: startTime === endTime ? startTime : `${startTime} - ${endTime}`,
        };
      } else {
        // Different days
        let dateRangeStr = '';
        if (getMonthYearString(parsedStartDate) === getMonthYearString(parsedEndDate)) {
          dateRangeStr = `${getDayString(parsedStartDate)} - ${getDayString(parsedEndDate)} ${getMonthYearString(parsedStartDate)}`;
        } else {
          dateRangeStr = `${formatDateSingle(parsedStartDate)} - ${formatDateSingle(parsedEndDate)}`;
        }
        
        return {
          date: dateRangeStr,
          time: null,
        };
      }
    }
  }

  // Single date
  return {
    date: formatDateSingle(parsedStartDate),
    time: formatTime(parsedStartDate),
  };
};

/**
 * Agenda bersama untuk halaman detail event dan kompetisi.
 * Data bersumber dari event.timelines yang dikelola melalui Admin.
 */
const AgendaSidebar = ({ timelines = [], type = 'event' }) => {
  const isCompetition = type === 'competition';
  const accentColor = 'bg-yellow-neo';
  const sortedTimelines = [...timelines].sort(
    (first, second) => parseWIB(first.date).getTime() - parseWIB(second.date).getTime(),
  );

  return (
    <aside className="border-[3px] border-black bg-white shadow-[8px_8px_0_#111]">
      <div className={`${accentColor} border-b-[3px] border-black px-5 py-4`}>
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center border-2 border-black bg-white shadow-[3px_3px_0_#111]">
            <FiCalendar size={20} aria-hidden="true" />
          </div>
          <div>
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
              const formatted = formatAgendaDate(agenda.date, agenda.end_date);
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
