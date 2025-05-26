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
}