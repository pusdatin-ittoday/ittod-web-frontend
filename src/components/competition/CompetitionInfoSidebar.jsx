import React from 'react';
import { FiUsers, FiDollarSign, FiAward } from 'react-icons/fi';

/**
 * Competition Info Sidebar — sidebar kanan halaman CompetitionDetail.
 * Menampilkan deadline registrasi + info detail (team size, biaya, prize pool).
 */
const CompetitionInfoSidebar = ({ competition }) => {
  const infoItems = [
    { label: 'Team Size', value: competition?.teamSize || '1 - 3 Members', icon: <FiUsers size={14} /> },
    { label: 'Registration Fee', value: competition?.registrationFee || 'FREE / GRATIS', icon: <FiDollarSign size={14} /> },
    { label: 'Total Prize Pool', value: competition?.prizePool || 'Rp 25,000,000', icon: <FiAward size={14} /> },
  ];

  return (
    <div className="space-y-5">
      <div className="rotate-1 border-[3px] border-black bg-[#807000] px-5 py-5 shadow-[7px_7px_0_#111] transition-transform duration-300 hover:rotate-0 hover:-translate-y-1">
        <p className="mb-1 font-inter text-[10px] font-bold uppercase tracking-wider text-black">
          Registration Deadline
        </p>
        <p className="font-inter text-3xl font-black uppercase leading-none text-white md:text-4xl">
          {competition?.registrationDeadline || 'TBA'}
        </p>
        <p className="mt-3 font-inter text-[10px] font-medium text-white/80">
          Before the gate closes at 23:59 GMT+7
        </p>
      </div>

      <div className="border-[3px] border-black bg-white p-5 shadow-[7px_7px_0_#111]">
        <h3 className="mb-5 border-b-2 border-black pb-3 font-inter text-xs font-black uppercase tracking-wider text-black">
          Competition Info
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

export default CompetitionInfoSidebar;
