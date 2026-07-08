import { getCurrentUser } from "../api/user";

const REQUIRED_PROFILE_FIELDS = [
  ["full_name", "Nama Lengkap"],
  ["birth_date", "Tanggal Lahir"],
  ["phone_number", "Nomor HP"],
  ["jenis_kelamin", "Jenis Kelamin"],
  ["id_discord", "ID Discord"],
  ["id_instagram", "ID Instagram"],
  ["pendidikan", "Status Pendidikan"],
  ["nama_sekolah", "Nama Sekolah/Institusi"],
  ["ktm_key", "Kartu Institusi"],
  ["twibbon_key", "Twibbon"],
];

export const getMissingProfileFields = (user = {}) =>
  REQUIRED_PROFILE_FIELDS.filter(([field]) => {
    const value = user[field];
    return value === null || value === undefined || String(value).trim() === "";
  }).map(([, label]) => label);

export const requireCompleteProfile = async (navigate) => {
  const response = await getCurrentUser();

  if (!response.success || !response.data) {
    window.alert(
      "Data profil belum dapat diperiksa. Silakan coba lagi beberapa saat."
    );
    navigate("/edit-profile");
    return false;
  }

  const missingFields = getMissingProfileFields(response.data);

  if (missingFields.length > 0) {
    window.alert(
      `Lengkapi Data Diri dan Data Institusi sebelum mendaftar lomba atau bergabung dengan tim.\n\nData yang belum lengkap:\n- ${missingFields.join(
        "\n- "
      )}`
    );
    navigate("/edit-profile");
    return false;
  }

  return true;
};
