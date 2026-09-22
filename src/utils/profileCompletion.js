import { getCurrentUser } from "../api/user";

const REQUIRED_PROFILE_FIELDS = [
  ["full_name", "Nama Lengkap"],
  ["birth_date", "Tanggal Lahir"],
  ["phone_number", "Nomor HP"],
  ["jenis_kelamin", "Jenis Kelamin"],
  ["id_discord", "Username Discord"],
  ["id_instagram", "ID Instagram"],
  ["pendidikan", "Status Pendidikan"],
  ["nama_sekolah", "Nama Sekolah/Institusi"],
  ["ktm_key", "Kartu Institusi"],
];

export const getMissingProfileFields = (user = {}) =>
  REQUIRED_PROFILE_FIELDS.filter(([field]) => {
    const value = user[field];
    return value === null || value === undefined || String(value).trim() === "";
  }).map(([, label]) => label);

export const requireCompleteProfile = async (navigate, showAlert, redirectTo) => {
  const response = await getCurrentUser();

  if (!response.success || !response.data) {
    const isUnauthorized = Boolean(
      response.isUnauthorized ||
      response.status === 401 ||
      response.error?.toLowerCase().includes("unauthorized")
    );

    if (isUnauthorized) {
      const msg = "Sesi Anda telah berakhir atau belum masuk. Silakan login terlebih dahulu.";
      if (showAlert) {
        await showAlert({ message: msg });
      } else {
        window.alert(msg);
      }
      const target =
        redirectTo ||
        (typeof window !== "undefined"
          ? window.location.pathname + window.location.search
          : "/");
      navigate(`/login?redirectTo=${encodeURIComponent(target)}`);
      return false;
    }

    const errorMsg =
      "Data profil tidak dapat dimuat saat ini karena kendala jaringan atau server. Silakan coba beberapa saat lagi.";
    if (showAlert) {
      await showAlert({ message: errorMsg });
    } else {
      window.alert(errorMsg);
    }
    return false;
  }

  const missingFields = getMissingProfileFields(response.data);

  if (missingFields.length > 0) {
    const alertMsg = `Lengkapi Data Diri dan Data Institusi sebelum mendaftar lomba atau kegiatan.\n\nData yang belum lengkap:\n- ${missingFields.join("\n- ")}`;
    if (showAlert) {
      await showAlert({ message: alertMsg });
    } else {
      window.alert(alertMsg);
    }
    navigate("/edit-profile");
    return false;
  }

  return true;
};
