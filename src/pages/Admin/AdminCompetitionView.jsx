import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import { getCompetitionList, getCompetitionById } from '../../api/admin';

const AdminCompetitionView = () => {
  const [competitionList, setCompetitionList] = useState([]);
  const [selected, setSelected] = useState('');
  const [competitionData, setCompetitionData] = useState(null);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${d.getFullYear()}`;
  };

  useEffect(() => {
    const fetchList = async () => {
      try {
        const res = await getCompetitionList();
        setCompetitionList(res.data); // expect: [{id, title}]
        if (res.data.length > 0) {
          setSelected(res.data[0].id); // default pilih yang pertama
        }
      } catch (err) {
        console.error('Gagal ambil daftar kompetisi:', err);
      }
    };
    fetchList();
  }, []);

  useEffect(() => {
    if (!selected) return;
    const fetchData = async () => {
      try {
        const res = await getCompetitionById(selected);
        setCompetitionData(res.data); // expect: {title, description, ...}
      } catch (err) {
        console.error('Gagal ambil data kompetisi:', err);
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
        {competitionList.map((comp) => (
          <option key={comp.id} value={comp.id}>
            {comp.title}
          </option>
        ))}
      </select>

      {competitionData && (
        <>
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
                <td className="border border-black p-2">{competitionData.title}</td>
                <td className="border border-black p-2">{competitionData.description}</td>
                <td className="border border-black p-2">
                  <a
                    href={competitionData.guide_book_url}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link
                  </a>
                </td>
                <td className="border border-black p-2">
                  <a
                    href={`https://wa.me/${competitionData.contact_person1}`}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WA 1
                  </a>
                  <br />
                  <a
                    href={`https://wa.me/${competitionData.contact_person2}`}
                    className="text-blue-600 underline hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WA 2
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
              {competitionData.timeline.map((stage) => (
                <tr key={stage.id} className="text-center">
                  <td className="border border-black p-2">{stage.title}</td>
                  <td className="border border-black p-2">{formatDate(stage.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </SidebarAdmin>
  );
};

export default AdminCompetitionView;
