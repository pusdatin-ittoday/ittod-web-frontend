import React from 'react';
import InfoSidebarCard from '../ui/InfoSidebarCard';
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
    <InfoSidebarCard
      headerTitle="Registration Deadline"
      headerValue={competition?.registrationDeadline || 'OCT 15'}
      headerSubtitle="Before the gate closes at 23:59 GMT+7"
      headerColor="bg-mustard"
      items={infoItems}
    />
  );
};

export default CompetitionInfoSidebar;
