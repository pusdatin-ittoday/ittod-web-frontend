import React from 'react';

const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const getDaysUntil = (dateStr) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const now = new Date();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    return diff;
};

const AnnouncementSidebar = ({ competitions }) => {
    const compEntries = Object.entries(competitions || {});

    const urgentItems = compEntries
        .map(([, comp]) => {
            const timelines = comp.timelines || [];
            const upcoming = timelines
                .filter(t => new Date(t.date) > new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            const next = upcoming[0];
            if (!next) return null;
            return {
                compName: comp.competitionName || comp.title || 'Event',
                timelineTitle: next.title,
                date: next.date,
                daysUntil: getDaysUntil(next.date),
            };
        })
        .filter(Boolean)
        .sort((a, b) => a.daysUntil - b.daysUntil);

    const closestDeadline = urgentItems[0];
    const isUrgent = closestDeadline && closestDeadline.daysUntil !== null && closestDeadline.daysUntil <= 7;

    const progressPct = isUrgent
        ? Math.max(0, Math.min(100, ((7 - closestDeadline.daysUntil) / 7) * 100))
        : 0;

    if (!closestDeadline) {
        return null;
    }

    return (
        <aside className="w-full xl:w-[340px] flex-shrink-0 flex flex-col gap-5">
            {isUrgent ? (
                <div className="border-[4px] border-[#1A1C1C] bg-[#FFDAD6] p-5 shadow-[6px_6px_0_#000] flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <svg width="23" height="20" viewBox="0 0 23 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 19.0791L11.762 0.0471897L21.9998 18.9847L0 19.0791ZM11.1202 16.0343C11.4036 16.0331 11.6449 15.9363 11.8443 15.744C12.0436 15.5517 12.149 15.3139 12.1603 15.0308C12.1717 14.7477 12.0854 14.5108 11.9014 14.3201C11.7174 14.1294 11.4838 14.0347 11.2004 14.0359C10.9171 14.0371 10.6758 14.1339 10.4764 14.3263C10.2771 14.5186 10.1717 14.7563 10.1603 15.0394C10.149 15.3225 10.2353 15.5594 10.4193 15.7501C10.6032 15.9408 10.8369 16.0355 11.1202 16.0343ZM10.2406 13.041L12.2405 13.0324L12.4411 8.03646L10.4411 8.04504L10.2406 13.041Z" fill="#93000A"/>
                        </svg>
                        <span className="font-['Space_Grotesk'] text-base uppercase text-[#93000A]">URGENT ALERT</span>
                    </div>
                    <div>
                        <p className="font-['Anybody'] text-xl text-[#93000A] uppercase leading-tight">
                            {closestDeadline.timelineTitle}
                        </p>
                        <p className="font-['Anybody'] text-xl text-[#93000A] uppercase">
                            DALAM {closestDeadline.daysUntil} HARI!
                        </p>
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="font-['Hanken_Grotesk'] text-[13px] text-[#93000A]">
                            Kompetisi: <strong>{closestDeadline.compName}</strong>
                        </p>
                        <p className="font-['Hanken_Grotesk'] text-[13px] text-[#93000A]">
                            Deadline: {formatDate(closestDeadline.date)}
                        </p>
                    </div>
                    <div className="relative h-2 border-[2px] border-[#1A1C1C] bg-white overflow-hidden">
                        <div
                            className="absolute left-0 top-0 h-full bg-[#BA1A1A] transition-all duration-500"
                            style={{ width: `${progressPct}%` }}
                        />
                    </div>
                </div>
            ) : (
                <div className="border-[4px] border-[#1A1C1C] bg-[#F0F0FF] p-5 shadow-[6px_6px_0_#000] flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="#34399F"/>
                        </svg>
                        <span className="font-['Space_Grotesk'] text-base uppercase text-[#34399F]">UPCOMING</span>
                    </div>
                    <p className="font-['Anybody'] text-lg text-[#34399F] uppercase leading-tight">
                        {closestDeadline.timelineTitle}
                    </p>
                    <p className="font-['Hanken_Grotesk'] text-[13px] text-[#464652]">
                        <strong>{closestDeadline.compName}</strong><br />
                        {formatDate(closestDeadline.date)} ({closestDeadline.daysUntil} hari lagi)
                    </p>
                </div>
            )}

            {urgentItems.length > 1 && (
                <div className="border-[4px] border-[#1A1C1C] bg-[#F4F4F2] p-5 shadow-[6px_6px_0_#000] flex flex-col gap-4">
                    <p className="font-['Space_Grotesk'] text-sm font-bold uppercase text-[#1A1C1C] tracking-wide">
                        Semua Deadline
                    </p>
                    <div className="flex flex-col gap-3">
                        {urgentItems.slice(0, 4).map((item, i) => (
                            <div key={i} className={`flex flex-col gap-0.5 pb-3 ${i < Math.min(urgentItems.length, 4) - 1 ? 'border-b border-[#1A1C1C]' : ''}`}>
                                <p className="font-['Hanken_Grotesk'] text-xs font-bold text-[#34399F] uppercase">
                                    {formatDate(item.date)}
                                </p>
                                <p className="font-['Space_Grotesk'] text-sm text-[#1A1C1C]">
                                    {item.timelineTitle} — {item.compName}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
};

export default AnnouncementSidebar;
