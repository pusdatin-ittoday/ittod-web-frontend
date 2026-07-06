import React from 'react';
import { FiClock, FiDollarSign, FiAward, FiPhone } from 'react-icons/fi';

/**
 * Event Info Sidebar — sidebar kanan halaman EventDetail.
 * Menampilkan tanggal event + info detail (waktu, biaya, benefit).
 */
const EventInfoSidebar = ({ event }) => {
  const infoItems = [
    { label: 'Time', value: event?.time || 'Info Menyusul', icon: <FiClock size={14} /> },
    { label: 'Registration Fee', value: event?.registrationFee || 'Info Menyusul', icon: <FiDollarSign size={14} /> },
    {
      label: 'Benefits',
      value: event?.benefits && event.benefits.length > 0 ? (
        <ul className="list-disc list-inside space-y-0.5 text-xs mt-1">
          {event.benefits.map((benefit, i) => (
            <li key={i}>{benefit}</li>
          ))}
        </ul>
      ) : 'Info Menyusul',
      icon: <FiAward size={14} />
    },
  ];

  const formatWaLink = (num) => {
    if (!num) return '#';
    let clean = num.toString().replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) {
      clean = "62" + clean.slice(1);
    }
    return `https://wa.me/${clean}`;
  };

  const cleanDisplayNumber = (num) => {
    if (!num) return '';
    return num.toString()
      .replace(/^(https?:\/\/)?(www\.)?wa\.me\//i, "")
      .trim();
  };

  if (event?.contact_person1) {
    infoItems.push({
      label: 'Contact Person 1',
      value: (
        <a 
          href={formatWaLink(event.contact_person1)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-indigo-neo font-bold break-all"
        >
          {cleanDisplayNumber(event.contact_person1)}
        </a>
      ),
      icon: <FiPhone size={14} />
    });
  }

  if (event?.contact_person2) {
    infoItems.push({
      label: 'Contact Person 2',
      value: (
        <a 
          href={formatWaLink(event.contact_person2)}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline hover:text-indigo-neo font-bold break-all"
        >
          {cleanDisplayNumber(event.contact_person2)}
        </a>
      ),
      icon: <FiPhone size={14} />
    });
  }

  return (
    <div className="space-y-5">
      <div className="rotate-1 border-[3px] border-black bg-[#807000] px-5 py-5 shadow-[7px_7px_0_#111] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1">
        <p className="mb-1 font-inter text-[10px] font-bold uppercase tracking-wider text-black">
          Event Date
        </p>
        <p className="font-inter text-3xl font-black uppercase leading-none text-white md:text-4xl">
          {event?.date || 'TBA'}
        </p>
        <p className="mt-3 font-inter text-[10px] font-medium text-white/80">
          Informasi Menyusul
        </p>
      </div>

      <div className="border-[3px] border-black bg-white p-5 shadow-[7px_7px_0_#111]">
        <h3 className="mb-5 border-b-2 border-black pb-3 font-inter text-xs font-black uppercase tracking-wider text-black">
          Event Info
        </h3>
        <div className="space-y-5">
          {infoItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0_#111]">
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="font-inter text-[8px] font-bold uppercase tracking-wider text-gray-400">
                  {item.label}
                </p>
                <div className="font-inter text-xs font-semibold text-black md:text-sm">
                  {item.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventInfoSidebar;
