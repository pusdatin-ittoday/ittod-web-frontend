import React from 'react';
import InfoSidebarCard from '../ui/InfoSidebarCard';
import { FiClock, FiDollarSign, FiAward } from 'react-icons/fi';

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

  return (
    <InfoSidebarCard
      headerTitle="Event Date"
      headerValue={event?.date || '26 SEP'}
      headerSubtitle="Informasi Menyusul"
      headerColor="bg-mustard"
      items={infoItems}
    />
  );
};

export default EventInfoSidebar;
