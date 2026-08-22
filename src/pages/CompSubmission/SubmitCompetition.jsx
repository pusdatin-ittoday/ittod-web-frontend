import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline, MdCloudUpload, MdInsertDriveFile, MdDelete, MdOpenInNew } from "react-icons/md";
import { IoArrowUndoCircle } from "react-icons/io5";
import { upsertCompetitionFile, uploadSubmissionFile } from "../../api/compeFile";
import { getUserCompetitions } from "../../api/user";
import { getPublicEventById } from "../../api/eventPublic";
import { SUBMISSION_FIELDS } from "./SubmissionConfig";
import DashboardNeoHeader from "../../components/Dashboard/DashboardNeoHeader";
import Sidebar from "../../components/Dashboard/Sidebar";
import Footer from "../../components/Footer";
import LoadingState from "../../components/ui/LoadingState";
import FallbackNotFound from "../Fallback/FallbackNotFound";

const SubmitCompetition = () => {
  const { competitionId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [competitionName, setCompetitionName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [competitionExists, setCompetitionExists] = useState(true);

  // Uploading state per field
  const [uploadingFields, setUploadingFields] = useState({});

  // Get fields configuration based on competitionId
  const [fieldsConfig, setFieldsConfig] = useState(SUBMISSION_FIELDS[competitionId?.toLowerCase()] || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = async (fieldName, file) => {
    if (!file) return;

    const allowedExts = ["pdf", "jpg", "jpeg", "png"];
    const ext = file.name.split(".").pop().toLowerCase();
    if (!allowedExts.includes(ext)) {
      setIncompleteFields([]);
      setAlertType("error");
      setAlertMessage(`Format file ".${ext}" tidak didukung! Format yang diterima: PDF, JPG, PNG.`);
      setShowAlert(true);
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      setIncompleteFields([]);
      setAlertType("error");
      setAlertMessage("Ukuran file melebihi batas maksimum 20MB!");
      setShowAlert(true);
      return;
    }

    setUploadingFields((prev) => ({ ...prev, [fieldName]: true }));
    try {
      const result = await uploadSubmissionFile(file);
      if (!result.success) {
        throw new Error(result.error || "Gagal mengunggah file.");
      }
      setFormData((prev) => ({
        ...prev,
        [fieldName]: result.url,
      }));
    } catch (err) {
      console.error("Upload file error:", err);
      setIncompleteFields([]);
      setAlertType("error");
      setAlertMessage(`Gagal mengunggah file: ${err.message}`);
      setShowAlert(true);
    } finally {
      setUploadingFields((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleRemoveFile = (fieldName) => {
    setFormData((prev) => {
      const updated = { ...prev };
      delete updated[fieldName];
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const emptyFields = [];
    fieldsConfig.forEach((field) => {
      if (!formData[field.name] || (typeof formData[field.name] === "string" && formData[field.name].trim() === "")) {
        emptyFields.push(field.label);
      }
    });

    if (emptyFields.length > 0) {
      setIncompleteFields(emptyFields);
      setAlertType("error");
      setAlertMessage("Data belum lengkap! Mohon untuk mengisi field berikut:");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await upsertCompetitionFile({
        team_id: teamId,
        submission_object: formData,
      });

      if (!response.success) {
        throw new Error(response.error || "Gagal mengirim submission");
      }

      console.log("Submission sent successfully");

      sessionStorage.setItem("SubmissionData", JSON.stringify(formData));
      localStorage.setItem("activeTab", "submit-lomba");

      setAlertType("success");
      setAlertMessage("Submission berhasil dikirim!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.href = "/dashboard/submit-lomba";
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
      setIncompleteFields([]);
      setAlertType("error");
      setAlertMessage(`Gagal mengirim submission: ${error.message}`);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeAlert = () => setShowAlert(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [teamResult, eventResult] = await Promise.all([
          getUserCompetitions(),
          getPublicEventById(competitionId)
        ]);

        if (!eventResult.success || !eventResult.data) {
          setCompetitionExists(false);
          setLoading(false);
          return;
        }

        setCompetitionExists(true);
        setEventDescription(eventResult.data.description || "");

        // Populate dynamic fields from DB if present
        let rawFields = eventResult.data.submission_fields;
        if (typeof rawFields === "string") {
          try {
            rawFields = JSON.parse(rawFields);
          } catch (e) {
            console.error("Failed to parse submission_fields JSON", e);
          }
        }
        if (rawFields && Array.isArray(rawFields) && rawFields.length > 0) {
          const mapped = rawFields.map(f => ({
            label: f.label,
            type: f.type || 'url',
            name: f.label,
            placeholder: f.type === 'file' ? `Upload ${f.label} (PDF, JPG, PNG max 20MB)` : `Masukkan ${f.label}`
          }));
          setFieldsConfig(mapped);
        }

        if (teamResult.success && teamResult.data) {
          const team = teamResult.data.find(
            (comp) => comp.competitionId === competitionId
          );

          if (team && team.teamID) {
            const isPaymentApproved = team.isVerified === true || team.isVerified === 1 || team.isVerified === 'approved';
            const isDocumentApproved = team.isDocumentVerified === true || team.isDocumentVerified === 1 || team.isDocumentVerified === 'approved';
            const isFullyApproved = isPaymentApproved && isDocumentApproved;

            if (!isFullyApproved) {
              const reason = !isPaymentApproved
                ? "Pembayaran tim Anda belum diverifikasi oleh admin."
                : "Berkas tim Anda belum diverifikasi oleh panitia lomba.";
              setAlertType("error");
              setAlertMessage(`Akses ditolak: ${reason} Jika ada kesalahan, silakan hubungi panitia.`);
              setShowAlert(true);
              setTimeout(() => {
                navigate("/dashboard/submit-lomba");
              }, 2000);
              return;
            }

            setTeamId(team.teamID);
            setCompetitionName(team.competitionName || competitionId);

            if (team.submissionData && typeof team.submissionData.submission_object === 'string') {
              try {
                const parsedData = JSON.parse(team.submissionData.submission_object);
                setFormData(parsedData);
              } catch (e) {
                console.error("Failed to parse submission JSON string", e);
              }
            } else if (team.submissionData && typeof team.submissionData.submission_object === 'object') {
              setFormData(team.submissionData.submission_object);
            }
          } else {
            console.error("No team found for this competition");
            setAlertType("error");
            setAlertMessage("Anda belum terdaftar di lomba ini");
            setShowAlert(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchData();
    }
  }, [competitionId, navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (!competitionExists) {
    return <FallbackNotFound title="COMPETITION NOT FOUND" message="Kompetisi tidak ditemukan." />;
  }

  if (!fieldsConfig || fieldsConfig.length === 0) {
    return (
      <div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
        <DashboardNeoHeader />
        <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[760px] lg:flex-row">
          <aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
            <Sidebar active="submit-lomba" variant="neobrutal" />
          </aside>
          <main className="min-w-0 flex-1 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col gap-5 items-center justify-center max-w-lg w-full bg-white border-[4px] border-black p-8 shadow-[8px_8px_0_#191b1a] text-center">
              <h1 className="font-dm-sans text-pink-500 text-5xl font-black uppercase tracking-wider">Waduh!</h1>
              <div className="text-center">
                <p className="font-dm-sans text-base md:text-lg font-bold leading-relaxed text-black mb-3">
                  Formulir pengumpulan untuk <span className="font-black text-pink-500 border-b-2 border-pink-500">{competitionName || "Kompetisi"}</span> belum tersedia nih!
                </p>
                <p className="font-dm-sans text-sm md:text-base font-semibold text-gray-600">
                  Kok kamu bisa masuk ke sini sih? Silakan hubungi panitia atau kembali ke halaman sebelumnya.
                </p>
              </div>
              <button
                className="flex items-center gap-2 border-[3px] border-black bg-[#eeeeee] px-6 py-2.5 text-sm font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                onClick={() => navigate("/dashboard/submit-lomba")}
              >
                <IoArrowUndoCircle className="w-5 h-5 text-gray-700" />
                <span>Kembali ke Beranda</span>
              </button>
            </div>
          </main>
        </div>
        <Footer variant="neobrutal" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
      <DashboardNeoHeader />

      <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[760px] lg:flex-row">
        <aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
          <Sidebar
            active="submit-lomba"
            variant="neobrutal"
          />
        </aside>

        <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
          <section className="w-full max-w-5xl border-[4px] border-black bg-[#f4f4f2] p-4 shadow-[8px_8px_0_#191b1a] sm:p-6 lg:p-8">
            <div className="border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#191b1a] sm:p-8 lg:p-10">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#3f46b8]">
                {competitionName}
              </p>
              <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                Submit Karyamu
              </h1>
              <p className="mt-2 text-sm font-semibold text-[#806400] sm:text-base">
                {eventDescription || "Silakan masukkan link/berkas karya terbaik Anda untuk kompetisi ini."}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
                {fieldsConfig.map((field, idx) => {
                  const isFileType = field.type === "file";
                  const fileUrl = formData[field.name];
                  const isUploading = uploadingFields[field.name];

                  return (
                    <div key={idx} className="flex flex-col gap-2">
                      <label htmlFor={field.name} className="text-sm font-black uppercase tracking-wider text-gray-700 flex items-center gap-2">
                        <span>{field.label}</span>
                        {isFileType && <span className="text-xs font-semibold text-[#3f46b8] normal-case">(Upload File PDF, JPG, PNG - Maks 20MB)</span>}
                      </label>

                      {isFileType ? (
                        fileUrl ? (
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-[3px] border-black bg-[#eef2ff] p-4 shadow-[4px_4px_0_#191b1a]">
                            <div className="flex items-center gap-3 min-w-0">
                              <MdInsertDriveFile className="text-3xl text-[#3f46b8] shrink-0" />
                              <div className="min-w-0 flex-1">
                                <p className="font-bold text-sm text-black truncate">{field.label} (Telah Diunggah)</p>
                                <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-[#3f46b8] font-bold hover:underline inline-flex items-center gap-1">
                                  Buka File <MdOpenInNew className="text-xs" />
                                </a>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(field.name)}
                              className="flex items-center gap-1 border-2 border-black bg-[#ff8c75] px-3 py-1.5 text-xs font-bold uppercase text-black shadow-[2px_2px_0_#191b1a] transition-all hover:bg-red-400 cursor-pointer"
                            >
                              <MdDelete className="text-base" /> Hapus / Ganti
                            </button>
                          </div>
                        ) : (
                          <div className="relative border-[3px] border-dashed border-black bg-[#F9F9F9] p-6 text-center hover:bg-[#fff6bf] transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                            <input
                              id={field.name}
                              name={field.name}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              disabled={isUploading}
                              onChange={(e) => {
                                if (e.target.files && e.target.files[0]) {
                                  handleFileChange(field.name, e.target.files[0]);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            {isUploading ? (
                              <div className="flex flex-col items-center gap-2">
                                <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                                <p className="font-bold text-sm text-black">Mengunggah file (Maks 20MB)...</p>
                              </div>
                            ) : (
                              <>
                                <MdCloudUpload className="text-4xl text-[#3f46b8]" />
                                <p className="font-black text-sm text-black uppercase">Klik atau Drag File ke Sini</p>
                                <p className="font-semibold text-xs text-gray-500">PDF, JPG, atau PNG (Maksimal 20MB)</p>
                              </>
                            )}
                          </div>
                        )
                      ) : (
                        <input
                          id={field.name}
                          name={field.name}
                          value={formData[field.name] || ""}
                          onChange={handleChange}
                          type="text"
                          placeholder={field.placeholder || `Masukkan ${field.label}`}
                          className="w-full border-[3px] border-black bg-[#F9F9F9] px-5 py-4 text-base font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400 focus:bg-[#fff6bf]"
                        />
                      )}
                    </div>
                  );
                })}

                <div className="flex flex-col gap-3 sm:flex-row mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="order-1 border-[3px] border-black bg-[#ffd400] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:order-none"
                  >
                    {isSubmitting ? "Mengirim..." : "Submit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.setItem("activeTab", "submit-lomba");
                      window.location.href = "/dashboard/submit-lomba";
                    }}
                    className="border-[3px] border-black bg-[#eeeeee] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </section>
        </main>
      </div>

      <Footer variant="neobrutal" />

      {/* Custom Alert Dialog */}
      {showAlert && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4">
          <div className={`w-full max-w-md border-[4px] border-black px-6 py-5 text-black shadow-[8px_8px_0_#191b1a] ${alertType === 'error' ? 'bg-[#ff8c75]' : 'bg-[#b8f2cf]'}`}>
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="text-lg font-black uppercase">
                <div className="flex items-center">
                  {alertType === 'error' ? (
                    <>
                      <MdErrorOutline className="text-xl mr-2" />
                      Pendaftaran Gagal!
                    </>
                  ) : (
                    <>
                      <MdCheckCircleOutline className="text-xl mr-2" />
                      Berhasil!
                    </>
                  )}
                </div>
              </h3>
              <button
                type="button"
                onClick={closeAlert}
                className="border-2 border-black bg-white p-1 transition-transform hover:-translate-y-0.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="mb-2 text-sm font-semibold">{alertMessage}</p>
            {alertType === 'error' && incompleteFields.length > 0 && (
              <ul className="list-disc pl-5 text-sm space-y-1">
                {incompleteFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitCompetition;
