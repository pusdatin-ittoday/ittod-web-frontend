import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { IoArrowUndoCircle } from "react-icons/io5";
import { upsertCompetitionFile } from "../../api/compeFile";
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

  // Get fields configuration based on competitionId
  const [fieldsConfig, setFieldsConfig] = useState(SUBMISSION_FIELDS[competitionId?.toLowerCase()] || []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const emptyFields = [];
    fieldsConfig.forEach((field) => {
      if (!formData[field.name] || formData[field.name].trim() === "") {
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

    const submissionData = {
      submission_object: formData,
    };

    setIsSubmitting(true);
    try {
      const response = await upsertCompetitionFile(teamId, submissionData);

      if (!response.success) {
        throw new Error(response.error || "Gagal mengirim submission");
      }

      console.log("Submission sent successfully");

      // Save to sessionStorage
      sessionStorage.setItem("SubmissionData", JSON.stringify(formData));

      // Store active tab in localStorage
      localStorage.setItem("activeTab", "submit-lomba");

      setAlertType("success");
      setAlertMessage("Submission berhasil dikirim!");
      setShowAlert(true);

      setTimeout(() => {
        window.location.href = "/dashboard/submit-lomba";
      }, 2000);
    } catch (error) {
      console.error("Submission error:", error);
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
        if (eventResult.data.submission_fields && Array.isArray(eventResult.data.submission_fields) && eventResult.data.submission_fields.length > 0) {
          const mapped = eventResult.data.submission_fields.map(f => ({
            label: f.label,
            type: f.type || 'url',
            name: f.label, // Use label directly as name to prevent duplicates in Admin view
            placeholder: `Masukkan ${f.label}`
          }));
          setFieldsConfig(mapped);
        }

        if (teamResult.success && teamResult.data) {
          // Find the specific competition team data
          const team = teamResult.data.find(
            (comp) => comp.competitionId === competitionId
          );

          if (team && team.teamID) {
            const isApproved = team.isVerified === true || team.isVerified === 1 || team.isVerified === 'approved';
            if (!isApproved) {
              setAlertType("error");
              setAlertMessage("Pendaftaran tim Anda belum disetujui (Approved) oleh admin");
              setShowAlert(true);
              setTimeout(() => {
                navigate("/dashboard/submit-lomba");
              }, 2000);
              return;
            }

            setTeamId(team.teamID);
            setCompetitionName(team.competitionName || competitionId);

            // Populate existing submission data if available
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
                {eventDescription || "Silakan masukkan link karya terbaik Anda untuk kompetisi ini."}
              </p>

              <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-6">
                {fieldsConfig.map((field, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <label htmlFor={field.name} className="text-sm font-black uppercase tracking-wider text-gray-700">
                      {field.label}
                    </label>
                    <input
                      id={field.name}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      type="text"
                      placeholder={field.placeholder || "Masukkan Link"}
                      className="w-full border-[3px] border-black bg-[#F9F9F9] px-5 py-4 text-base font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400 focus:bg-[#fff6bf]"
                    />
                  </div>
                ))}

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
