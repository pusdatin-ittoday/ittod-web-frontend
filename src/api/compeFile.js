import instance from "./axios";

/**
 * Submit competition file with title, file URL and team ID
 * @param {Object} data - Object containing title, url_file and team_id
 * @returns {Promise<Object>} Result of the submission
 */
export const submitCompetitionFile = async (data) => {
  try {
    const response = await instance.post('/api/file', data);
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

/**
 * Submit competition file with title, file URL and team ID
 * @param {Object} data - Object containing title, url_file and team_id
 * @returns {Promise<Object>} Result of the submission
 */
export const editCompetitionFile = async (data) => {
    try {
      const response = await instance.put('/api/file', data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error("Error editing competition file:", error);
      return {
        success: false,
        error: error.response?.data?.message || 
               error.response?.data?.error || 
               "Failed to submit competition file. Please try again."
      };
    }
  };