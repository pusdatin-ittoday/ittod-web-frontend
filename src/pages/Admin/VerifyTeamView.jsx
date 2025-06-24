import React, { useState, useEffect } from 'react';
import SidebarAdmin from '../../components/SidebarAdmin';
import {
  getCompetitionList,
  getTeamListByCompetition,
  getTeamDetail,
  verifyTeam,
  rejectTeam,
  updateMemberStatus,
} from '../../api/admin';

const AdminVerifyTeamView = () => {
  const [competitionList, setCompetitionList] = useState([]);
  const [selectedCompetition, setSelectedCompetition] = useState('');
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const res = await getCompetitionList();
        const list = res.data.data;
        setCompetitionList(list);
        if (list.length > 0) {
          setSelectedCompetition(list[0].title);
        }
      } catch (err) {
        console.error('Gagal ambil daftar kompetisi:', err);
      }
    };
    fetchCompetitions();
  }, []);

  useEffect(() => {
    if (!selectedCompetition) return;
    const fetchTeams = async () => {
      try {
        const res = await getTeamListByCompetition(selectedCompetition);
        setTeams(res.data.data);
      } catch (err) {
        console.error('Gagal ambil tim:', err);
      }
    };
    fetchTeams();
  }, [selectedCompetition]);

  const handleTeamClick = async (teamId) => {
    try {
      const res = await getTeamDetail(teamId);
      setSelectedTeamId(teamId);
      setTeamMembers(res.data.data.members);
    } catch (err) {
      console.error('Gagal ambil detail tim:', err);
    }
  };

  const handleVerify = async (teamId) => {
    try {
      await verifyTeam(teamId);
      setTeams((prev) => prev.map(t => t.id === teamId ? { ...t, is_verified: true } : t));
    } catch (err) {
      console.error('Gagal verifikasi tim:', err);
    }
  };

  const handleReject = async (teamId) => {
    try {
      await rejectTeam(teamId, 'Ditolak oleh admin');
      setTeams((prev) => prev.map(t => t.id === teamId ? { ...t, is_verified: false } : t));
    } catch (err) {
      console.error('Gagal tolak tim:', err);
    }
  };

  const toggleComplete = async (memberId, currentStatus) => {
    try {
      await updateMemberStatus(memberId, !currentStatus);
      setTeamMembers((prev) =>
        prev.map((m) => m.id === memberId ? { ...m, is_complete: !m.is_complete } : m)
      );
    } catch (err) {
      console.error('Gagal ubah status anggota:', err);
    }
  };

  return (
    <SidebarAdmin>
      <h1 className="text-2xl font-bold mb-4 text-white">Verify Team View</h1>

      <select
        value={selectedCompetition}
        onChange={(e) => {
          setSelectedCompetition(e.target.value);
          setSelectedTeamId(null);
          setTeamMembers([]);
        }}
        className="mb-4 px-4 py-2 border border-black text-black bg-white rounded"
      >
        {competitionList.map((comp) => (
          <option key={comp.id} value={comp.title}>{comp.title}</option>
        ))}
      </select>

      <table className="w-full bg-white text-black border border-black shadow mb-6">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-black p-2">Nama Tim</th>
            <th className="border border-black p-2">Kontak Ketua</th>
            <th className="border border-black p-2">Bukti Pembayaran</th>
            <th className="border border-black p-2">Status</th>
            <th className="border border-black p-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              className={`text-center cursor-pointer hover:bg-blue-100 ${selectedTeamId === team.id ? 'bg-purple-300' : ''}`}
              onClick={() => handleTeamClick(team.id)}
            >
              <td className="border border-black p-2">{team.name}</td>
              <td className="border border-black p-2">{team.contact}</td>
              <td className="border border-black p-2">
                {team.payment_proof && (
                  <a href={team.payment_proof} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                    Lihat Bukti
                  </a>
                )}
              </td>
              <td className="border border-black p-2">
                <span className={`font-bold ${team.is_verified ? 'text-green-500' : 'text-red-500'}`}>
                  {team.is_verified ? 'Verified' : 'Not Verified'}
                </span>
              </td>
              <td className="border border-black p-2 space-x-2">
                <button className="bg-green-600 text-white px-3 py-1 rounded" onClick={() => handleVerify(team.id)}>Verify</button>
                <button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleReject(team.id)}>Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
                <th className="border border-black p-2">Status</th>
                <th className="border border-black p-2">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="text-center">
                  <td className="border border-black p-2">{member.name}</td>
                  <td className="border border-black p-2">{member.role}</td>
                  <td className="border border-black p-2">
                    {member.twibbon && (
                      <a href={member.twibbon} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat</a>
                    )}
                  </td>
                  <td className="border border-black p-2">
                    {member.kartu && (
                      <a href={member.kartu} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat</a>
                    )}
                  </td>
                  <td className="border border-black p-2">
                    <span className={`font-semibold ${member.is_complete ? 'text-green-500' : 'text-red-500'}`}>
                      {member.is_complete ? 'Complete' : 'Not Complete'}
                    </span>
                  </td>
                  <td className="border border-black p-2">
                    <button
                      onClick={() => toggleComplete(member.id, member.is_complete)}
                      className={`px-3 py-1 rounded ${member.is_complete ? 'bg-red-600' : 'bg-green-600'} text-white`}
                    >
                      {member.is_complete ? 'Incomplete' : 'Complete'}
                    </button>
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
