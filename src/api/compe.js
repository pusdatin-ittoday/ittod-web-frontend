import instance from "./axios";

export const registerTeam = async (data) => {
  try {
    const response = await instance.post("/api/competition/register", data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error registering team:", error);
    return {
      success: false,
      error: error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to register team. Please try again."
    };
  }
};

export const updateTeamName = async ({ team_id, team_name }) => {
  try {
    const response = await instance.put("/api/competition/team/name", {
      team_id,
      team_name,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating team name:", error);
    return {
      success: false,
      error: error.response?.data?.error ||
        error.response?.data?.message ||
        "Gagal mengupdate nama tim.",
    };
  }
};
