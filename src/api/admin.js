import axiosInstance from "./axios";
export const loginAdmin = (email, password) => {
  return axiosInstance.post("/api/admin/login", { email, password });
};

export const registerAdmin = (full_name, email, password) => {
  return axiosInstance.post("/api/auth/register", { full_name, email, password }); 
};

export const getCompetitionList = () => {
  return axiosInstance.get("/api/admin/competition-list");
};

export const getCompetitionById = (id) => {
  return axiosInstance.get(`/api/admin/competition-view/${id}`);
};


// 5. Dapatkan Daftar Tim Berdasarkan Kompetisi (dengan query)
export const getTeamListByCompetition = (competition, page = 1, limit = 10) => {
  return axiosInstance.get(`/api/admin/teams`, {
    params: { competition, page, limit },
  });
};

// 6. Dapatkan Detail Tim + Anggota
export const getTeamDetail = (teamId) => {
  return axiosInstance.get(`/api/admin/teams/${teamId}`);
};

// 7. Verifikasi Tim
export const verifyTeam = (teamId) => {
  return axiosInstance.post(`/api/admin/teams/${teamId}/verify`);
};

// 8. Tolak Tim
export const rejectTeam = (teamId, reason = "") => {
  return axiosInstance.post(`/api/admin/teams/${teamId}/reject`, {
    reason,
  });
};

// 9. Update Status Lengkap/Tidak Lengkap Anggota Tim
export const updateMemberStatus = (memberId, is_complete) => {
  return axiosInstance.patch(`/api/admin/members/${memberId}/status`, {
    is_complete,
  });
};