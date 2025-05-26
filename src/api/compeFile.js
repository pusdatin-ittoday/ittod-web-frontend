import instance from "./axios";

/**
 * Submit or update competition file with team ID and submission object
 * @param {Object} data - Object containing team_id and submission_object
 * @returns {Promise<Object>} Result of the submission
 */
export const upsertCompetitionFile = async (data) => {
  try {
    const response = await instance.put("/api/competition/submission", data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error("Error submitting competition file:", error);
    return {
      success: false,
      error: error.response?.data?.message || 
             error.response?.data?.error || 
             "Failed to submit competition file. Please try again."
    };
  }
};