import instance from "./axios";

/**
 * POST /api/event/semnas/register
 * Mendaftarkan user ke Seminar Nasional dengan kuesioner + bukti follow IG.
 */
export const registerSemnas = async (formData) => {
    const res = await instance.post("/api/event/semnas/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
