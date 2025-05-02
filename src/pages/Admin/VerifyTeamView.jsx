import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';

const AdminVerifyTeamView = () => {
  const [selected, setSelected] = useState('HackToday');
  const [teams, setTeams] = useState([]);
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (token) {
      fetch(`/api/admin/teams?competition=${selected}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setTeams(data))
        .catch(error => console.error("Error fetching teams:", error));
    }
  }, [selected, token]);

  const handleVerify = (teamId) => {
    fetch(`/api/admin/teams/${teamId}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Team verified:", data);
      })
      .catch(error => console.error("Error verifying team:", error));
  };

  const handleReject = (teamId) => {
    fetch(`/api/admin/teams/${teamId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("Team rejected:", data);
      })
      .catch(error => console.error("Error rejecting team:", error));
  };

  return (
    <SidebarAdmin>
      <h1 className="text-2xl font-bold mb-4 text-white">Verify Team View</h1>

      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="mb-4 px-4 py-2 border border-black text-black bg-white rounded"
      >
        {['HackToday', 'GameToday', 'UxToday', 'MineToday'].map((comp) => (
          <option key={comp} value={comp}>{comp}</option>
        ))}
      </select>

      <table className="w-full bg-white text-black border border-black shadow">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2">Nama Tim</th>
            <th className="border border-black p-2">Kontak Ketua</th>
            <th className="border border-black p-2">Bukti Pembayaran</th>
            <th className="border border-black p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, i) => (
            <tr key={i} className="text-center">
              <td className="border border-black p-2">{team.name}</td>
              <td className="border border-black p-2">{team.contact}</td>
              <td className="border border-black p-2">
                {team.paymentProof && (
                  <a
                    href={team.paymentProof}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    Lihat Bukti
                  </a>
                )}
              </td>
              <td className="border border-black p-2 space-x-2">
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => handleVerify(team.id)}
                >
                  Verify
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleReject(team.id)}
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SidebarAdmin>
  );
};

export default AdminVerifyTeamView;