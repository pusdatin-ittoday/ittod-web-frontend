import api from "./api";

/**
 * Event Service — kerangka fungsi untuk nanti ganti data statis.
 * Saat ini tidak dipakai (halaman masih baca dari src/data/events.js).
 * Ganti src/data/events.js → service ini saat backend siap.
 */

export const getEvents = async (type) => {
  try {
    const url = type ? `/api/events?type=${type}` : "/api/events";
    const response = await api.get(url);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getEventBySlug = async (slug) => {
  try {
    const response = await api.get(`/api/events/${slug}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
