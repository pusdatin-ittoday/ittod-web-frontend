import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';

const AdminCompetitionView = () => {
  const [selected, setSelected] = useState('HackToday');
  const [competitionData, setCompetitionData] = useState({
    detail: {},
    timeline: [],
  });

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    // TODO: Ganti dummy data ke fetch() dari backend setelah endpoint siap
    const dummyData = {
      HackToday: {
        detail: {
          title: 'HackToday 2025',
          description: 'Kompetisi hackathon untuk pelajar dan mahasiswa.',
          guidebook: 'https://example.com/hacktoday-guidebook.pdf',
          contact: 'https://wa.me/6281234567890',
        },
        timeline: [
          { name: 'Pendaftaran', date: '2025-06-01' },
          { name: 'Seleksi', date: '2025-06-10' },
          { name: 'Final', date: '2025-06-20' },
        ],
      },
      GameToday: {
        detail: {
          title: 'GameToday 2025',
          description: 'Turnamen game dan pembuatan game interaktif.',
          guidebook: 'https://example.com/gametoday-guidebook.pdf',
          contact: 'https://wa.me/6289876543210',
        },
        timeline: [
          { name: 'Registrasi', date: '2025-07-01' },
          { name: 'Penyisihan', date: '2025-07-10' },
        ],
      },
      UxToday: {
        detail: {
          title: 'UxToday 2025',
          description: 'Kompetisi desain antarmuka pengguna (UI/UX).',
          guidebook: 'https://example.com/uxtoday-guidebook.pdf',
          contact: 'https://wa.me/6281122334455',
        },
        timeline: [
          { name: 'Open Submission', date: '2025-08-01' },
          { name: 'Penjurian', date: '2025-08-15' },
        ],
      },
      MineToday: {
        detail: {
          title: 'MineToday 2025',
          description: 'Kompetisi inovasi pertambangan modern.',
          guidebook: 'https://example.com/minetoday-guidebook.pdf',
          contact: 'https://wa.me/6285566778899',
        },
        timeline: [
          { name: 'Kick-off', date: '2025-09-01' },
          { name: 'Presentasi', date: '2025-09-20' },
        ],
      },
    };

    setCompetitionData(dummyData[selected]);
  }, [selected]);

  return (
    <SidebarAdmin>
      <h1 className="text-2xl font-bold mb-4">Competition View</h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mb-4 px-4 py-2 border border-black text-black bg-white rounded"
      >
        {['HackToday', 'GameToday', 'UxToday', 'MineToday'].map((comp) => (
          <option key={comp} value={comp}>{comp}</option>
        ))}
      </select>

      <table className="w-full bg-white mb-6 text-black border border-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2">Judul</th>
            <th className="border border-black p-2">Deskripsi</th>
            <th className="border border-black p-2">Guidebook</th>
            <th className="border border-black p-2">Contact WA</th>
          </tr>
        </thead>
        <tbody>
          <tr className="text-center">
            <td className="border border-black p-2">{competitionData.detail.title}</td>
            <td className="border border-black p-2">{competitionData.detail.description}</td>
            <td className="border border-black p-2">
             <a
  href={competitionData.detail.guidebook}
  className="text-blue-600 underline hover:text-blue-800"
  target="_blank"
  rel="noopener noreferrer">
  Link
</a>
            </td>
            <td className="border border-black p-2">
             <a
  href={competitionData.detail.contact}
  className="text-blue-600 underline hover:text-blue-800"
  target="_blank"
  rel="noopener noreferrer"
>
  WA
</a>

            </td>
          </tr>
        </tbody>
      </table>

      <h2 className="text-lg font-semibold mb-2">Timeline</h2>
      <table className="w-full bg-white text-black border border-black">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2">Nama Tahap</th>
            <th className="border border-black p-2">Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {competitionData.timeline.map((stage, idx) => (
            <tr key={idx} className="text-center">
              <td className="border border-black p-2">{stage.name}</td>
              <td className="border border-black p-2">{formatDate(stage.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SidebarAdmin>
  );
};

export default AdminCompetitionView;
