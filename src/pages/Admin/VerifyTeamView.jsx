import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';

const AdminVerifyTeamView = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('HackToday');
  const [teams, setTeams] = useState([
    { id: 1, name: 'Team Alpha', contact: '1234567890', paymentProof: 'https://example.com/payment1.jpg', is_verified: false },
    { id: 2, name: 'Team Beta', contact: '0987654321', paymentProof: 'https://example.com/payment2.jpg', is_verified: true },
  ]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Azka', role: 'Leader', twibbon: 'https://example.com/twibbon1.jpg', kartu: 'https://example.com/kartu1.jpg' },
    { name: 'Calvin', role: 'Member', twibbon: 'https://example.com/twibbon2.jpg', kartu: 'https://example.com/kartu2.jpg' },
  ]);

  const handleVerify = (teamId) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_verified: true } : t));
  };

  const handleReject = (teamId) => {
    setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_verified: false } : t));
  };

  return (
    <SidebarAdmin>
      <h1 className="text-2xl font-bold mb-4 text-white">Verify Team View</h1>

      <select
        value={selectedCompetition}
        onChange={(e) => {
          setSelectedCompetition(e.target.value);
          setSelectedTeamId(null); // reset selected team
        }}
        className="mb-4 px-4 py-2 border border-black text-black bg-white rounded"
      >
        {['HackToday', 'GameToday', 'UxToday', 'MineToday'].map((comp) => (
          <option key={comp} value={comp}>{comp}</option>
        ))}
      </select>

      {/* Tabel Tim */}
      <table className="w-full bg-white text-black border border-black shadow mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2">Nama Tim</th>
            <th className="border border-black p-2">Kontak Ketua</th>
            <th className="border border-black p-2">Bukti Pembayaran</th>
            <th className="border border-black p-2">Status</th> {/* Kolom Status */}
            <th className="border border-black p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className={`text-center cursor-pointer hover:bg-blue-100 ${selectedTeamId === team.id ? 'bg-purple-300' : ''}`}
              onClick={() => setSelectedTeamId(team.id)}
            >
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
              <td className="border border-black p-2">
                {/* Status Verifikasi */}
                <span className={`font-bold ${team.is_verified ? 'text-green-500' : 'text-red-500'}`}>
                  {team.is_verified ? 'Verified' : 'Not Verified'}
                </span>
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

      {/* Tabel Anggota Tim */}
      {selectedTeamId && (
        <>
          <h2 className="text-xl font-semibold mb-2 text-white">Anggota Tim</h2>
          <table className="w-full bg-white text-black border border-black shadow">
            <thead className="bg-gray-200">
              <tr>
                <th className="border border-black p-2">Nama</th>
                <th className="border border-black p-2">Role</th>
                <th className="border border-black p-2">Twibbon</th>
                <th className="border border-black p-2">Kartu Mahasiswa</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member, i) => (
                <tr key={i} className="text-center">
                  <td className="border border-black p-2">{member.name}</td>
                  <td className="border border-black p-2">{member.role}</td>
                  <td className="border border-black p-2">
                    {member.twibbon && (
                      <a
                        href={member.twibbon}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat
                      </a>
                    )}
                  </td>
                  <td className="border border-black p-2">
                    {member.kartu && (
                      <a
                        href={member.kartu}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </SidebarAdmin>
  );
};

export default AdminVerifyTeamView;
