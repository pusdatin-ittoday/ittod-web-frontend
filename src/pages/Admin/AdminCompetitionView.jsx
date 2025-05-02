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
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`/api/admin/competition/${selected}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Gagal mengambil data');
        const data = await res.json();
        setCompetitionData(data);
      } catch (err) {
        console.error("Gagal ambil data kompetisi:", err);
      }
    };

    fetchData();
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
              {competitionData.detail.guidebook && (
                <a href={competitionData.detail.guidebook} className="text-black underline" target="_blank" rel="noopener noreferrer">Link</a>
              )}
            </td>
            <td className="border border-black p-2">
              {competitionData.detail.contact && (
                <a href={competitionData.detail.contact} className="text-black underline" target="_blank" rel="noopener noreferrer">WA</a>
              )}
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
              <td className="border border-black p-2">{stage.date && formatDate(stage.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SidebarAdmin>
  );
};

export default AdminCompetitionView;
