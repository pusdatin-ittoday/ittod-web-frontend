import api from "./api";

/**
 * Competition Service — kerangka fungsi untuk nanti ganti data statis.
 * Saat ini tidak dipakai (halaman masih baca dari src/data/competitions.js).
 * Ganti src/data/competitions.js → service ini saat backend siap.
 */

export const getCompetitions = async () => {
  try {
    const response = await api.get("/competitions");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getCompetitionBySlug = async (slug) => {
  try {
    const response = await api.get(`/competitions/${slug}`);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
