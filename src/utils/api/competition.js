import Api from "../Api";

export const joinTeam = async (teamCode) => {
    try {
        const res = await Api.post("/api/competition/join", {
            team_code: teamCode
        });

        return res;
    } catch (error) {
        // HandleNotifError(error);
        console.error("Error fetching data:", error);
        throw error;
    }
}