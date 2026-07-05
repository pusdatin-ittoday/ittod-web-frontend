import React from 'react';

/**
 * Sidebar info box — dipakai di EventDetail & CompetitionDetail.
 * Terdiri dari header berwarna (mustard/custom) dan list info di bawahnya.
 *
 * Props:
 * - headerTitle: teks header (mis. "Event Date", "Registration Deadline")
 * - headerValue: nilai yang ditampilkan besar di header (mis. "14 September 2026")
 * - headerColor: warna background header (default: mustard)
 * - items: array { label, value } untuk ditampilkan sebagai list info
 */
const InfoSidebarCard = ({
  headerTitle,
  headerValue,
  headerSubtitle,
  headerColor = 'bg-mustard',
  items = [],
}) => {
  return (
    <div className="border-[3px] border-black shadow-[6px_6px_0px_#000] bg-white relative">
      {/* Header */}
      <div className={`${headerColor} px-6 py-4 border-b-[3px] border-black`}>
        <p className="font-inter font-semibold text-[10px] text-black uppercase tracking-wider mb-1">
          {headerTitle}
        </p>
        <p className="font-bebas text-4xl md:text-5xl text-black tracking-wide leading-none mb-1">
          {headerValue}
        </p>
        {headerSubtitle && (
          <p className="font-inter text-xs text-black/70">
            {headerSubtitle}
          </p>
        )}
      </div>

      {/* Info list */}
      <div className="px-6 py-5">
        <h3 className="font-inter font-bold text-xs text-black border-b-[3px] border-black pb-2 mb-4 uppercase tracking-wider">
          {headerTitle.includes('Deadline') ? 'Competition Info' : 'Event Info'}
        </h3>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="flex gap-3 items-center">
              {item.icon && (
                <div className="shrink-0 p-1 border-[1.5px] border-black rounded shadow-[2px_2px_0px_#000]">
                  {item.icon}
                </div>
              )}
              <div className="flex flex-col">
                <span className="font-inter text-[9px] text-gray-500 font-bold uppercase tracking-wider leading-tight">
                  {item.label}
                </span>
                <span className="font-inter text-sm text-black font-semibold">
                  {item.value}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InfoSidebarCard;
