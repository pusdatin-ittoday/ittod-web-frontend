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

export const postCompePayment = async (formData) => {
  try {
    const response = await instance.post("/api/competition/payment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Make sure the auth token is included
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error uploading competition payment:", error);
    
    // Get more detailed error information
    const serverError = error.response?.data?.message || error.message;
    console.error("Server error details:", error.response?.data);
    
    // Return a user-friendly message based on error type
    if (error.response?.status === 500) {
      return { 
        success: false, 
        message: "Server error: Terjadi masalah pada sistem. Silakan hubungi admin.",
        serverError: serverError
      };
    }
    
    return { 
      success: false, 
      message: serverError || "Terjadi kesalahan saat mengunggah bukti pembayaran" 
    };
  }
};

/**
 * Upload a submission attachment file (PDF, JPG, PNG) up to 20MB
 * @param {File} file - The file to upload
 * @returns {Promise<Object>} Object with success flag and file URL
 */
export const uploadSubmissionFile = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await instance.post("/api/images/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const fileKey = response.data.key;
    const baseURL = instance.defaults.baseURL || import.meta.env.VITE_API_BASE_URL || window.location.origin;
    const cleanBaseURL = baseURL.replace(/\/+$/, "");
    const fileUrl = `${cleanBaseURL}/api/images/${fileKey}`;

    return {
      success: true,
      url: fileUrl,
      key: fileKey,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Gagal mengunggah file. Silakan coba lagi.",
    };
  }
};