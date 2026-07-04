import React from 'react';

const CATEGORY_STYLES = {
    important: {
        bg: 'bg-[#FCD400]',
        text: 'text-[#1A1C1C]',
        label: 'PENTING',
    },
    technical: {
        bg: 'bg-[#5E5E5E]',
        text: 'text-white',
        label: 'TEKNIKAL',
    },
    umum: {
        bg: 'bg-[#C7C5D4]',
        text: 'text-[#1A1C1C]',
        label: 'UMUM',
    },
};

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
};

const AnnouncementCard = ({ title, description, date, category, eventTitle }) => {
    const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.umum;
    const displayLabel = category === 'event' && eventTitle ? eventTitle.toUpperCase() : style.label;
    const badgeBg = category === 'event' ? 'bg-[#4D52B8]' : style.bg;
    const badgeText = category === 'event' ? 'text-white' : style.text;

    return (
        <article className="relative flex flex-col gap-3 border-[4px] border-[#1A1C1C] bg-white p-6 shadow-[6px_6px_0_#000] overflow-hidden">
            <div className="flex items-start justify-between gap-4">
                <span className={`inline-block border-[2px] border-[#1A1C1C] px-2 py-0.5 text-[11px] font-black uppercase tracking-wide ${badgeBg} ${badgeText}`}>
                    {displayLabel}
                </span>
                <span className="absolute top-0 right-0 border-b-[4px] border-l-[4px] border-[#1A1C1C] bg-[#34399F] px-5 py-1 text-[13px] font-normal text-white rotate-[2deg] translate-x-0.5 -translate-y-0.5">
                    {formatDate(date)}
                </span>
            </div>

            <h3 className="font-['Anybody'] text-2xl uppercase leading-tight text-[#1A1C1C] mt-2">
                {title}
            </h3>

            <p className="font-['Hanken_Grotesk'] text-sm leading-relaxed text-[#464652] pb-2">
                {description}
            </p>
        </article>
    );
};

export default AnnouncementCard;
