import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';

const AdminVerifyTeamView = () => {
  const [selectedCompetition, setSelectedCompetition] = useState('HackToday');
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const token = localStorage.getItem("adminToken");

  // Fetch teams when competition changes
  useEffect(() => {
    if (token) {
      fetch(`/api/admin/teams?competition=${selectedCompetition}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setTeams(data))
        .catch(error => console.error("Error fetching teams:", error));
    }
  }, [selectedCompetition, token]);

  // Fetch members when a team is selected
  useEffect(() => {
    if (selectedTeamId && token) {
      fetch(`/api/admin/teams/${selectedTeamId}/members`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => setTeamMembers(data))
        .catch(error => console.error("Error fetching team members:", error));
    }
  }, [selectedTeamId, token]);

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
        // refresh teams after verification
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_verified: true } : t));
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
        // refresh teams after rejection
        setTeams(prev => prev.map(t => t.id === teamId ? { ...t, is_verified: false } : t));
      })
      .catch(error => console.error("Error rejecting team:", error));
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
            <th className="border border-black p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
           <tr
           key={team.id}
           className={`text-center cursor-pointer hover:bg-blue-100 ${
             selectedTeamId === team.id ? 'bg-purple-300' : ''
           }`}
           onClick={() => setSelectedTeamId(team.id)}
         >
              <td
                className="border border-black p-2 cursor-pointer hover:bg-blue-100"
                onClick={() => setSelectedTeamId(team.id)}
              >
                {team.name}
              </td>
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
