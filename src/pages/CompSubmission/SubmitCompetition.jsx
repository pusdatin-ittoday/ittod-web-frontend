import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useParams, useNavigate } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { upsertCompetitionFile } from "../../api/compeFile";
import { getUserCompetitions } from "../../api/user";
import { SUBMISSION_FIELDS } from "./SubmissionConfig";

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
  const [loading, setLoading] = useState(true);

  // Get fields configuration based on competitionId
  // Fallback to empty array if config is not defined
  const fieldsConfig = SUBMISSION_FIELDS[competitionId?.toLowerCase()] || [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    const emptyFields = [];

    // Validate required fields
    fieldsConfig.forEach(field => {
      if (!formData[field.name] || formData[field.name].trim() === "") {
        emptyFields.push(field.label);
      }
    });

    if (emptyFields.length > 0) {
      setIncompleteFields(emptyFields);
      setAlertMessage("Mohon lengkapi kolom berikut:");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    if (!teamId) {
      setAlertMessage(`Tidak dapat menemukan ID tim Anda untuk kompetisi ini`);
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionPayload = {
        team_id: teamId,
        submission_object: formData,
      };

      const result = await upsertCompetitionFile(submissionPayload);

      if (!result.success) {
        throw new Error(`Failed to submit: ${result.error}`);
      }

      console.log("Form Submitted Successfully!");

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
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        const result = await getUserCompetitions();
        if (result.success && result.data) {
          // Find the specific competition team data
          const team = result.data.find(
            (comp) => comp.competitionId === competitionId
          );

          if (team && team.teamID) {
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
        console.error("Error fetching team data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (competitionId) {
      fetchTeamData();
    }
  }, [competitionId]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <p className="text-white text-lg">Loading form...</p>
        </div>
      </>
    );
  }

  if (!fieldsConfig || fieldsConfig.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full text-center">
            <h2 className="text-xl font-bold mb-4">Form Submit Tidak Ditemukan</h2>
            <p>Konfigurasi submisi untuk kompetisi ini tidak tersedia.</p>
            <button 
              onClick={() => navigate("/dashboard/submit-lomba")}
              className="mt-6 custom-button-bg text-white px-4 py-2 rounded button-hover"
            >
              Kembali
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6 uppercase">
            Form Submit {competitionName}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-dm-sans">
            {fieldsConfig.map((field, idx) => (
              <div key={idx} className="mb-3 relative">
                <label htmlFor={field.name} className="block text-sm font-bold mb-2">
                  {field.label}
                </label>
                {field.icon && (
                  <field.icon className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                )}
                <input
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ""}
                  onChange={handleChange}
                  type="text"
                  placeholder={field.placeholder}
                  className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                />
              </div>
            ))}

            <div className="buttons flex flex-row justify-end mt-4">
              <a
                onClick={() => {
                  localStorage.setItem("activeTab", "submit-lomba");
                  window.location.href = "/dashboard/submit-lomba";
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer transition duration-300 hover:scale-105"
              >
                Batal
              </a>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`custom-button-bg text-white px-4 py-2 rounded cursor-pointer ${
                  isSubmitting
                    ? "opacity-75 cursor-not-allowed"
                    : "button-hover transition duration-300 ease-in-out hover:scale-105"
                }`}
              >
                {isSubmitting ? "Mengirim..." : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Alert Dialog */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
          <div
            className={`${
              alertType === "error" ? "bg-red-600/90" : "bg-green-600/90"
            } text-white px-6 py-4 rounded-lg shadow-xl max-w-md`}
          >
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="font-bold text-lg">
                <div className="flex items-center">
                  {alertType === "error" ? (
                    <>
                      <MdErrorOutline className="text-xl mr-2" />
                      Data belum lengkap!
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
                onClick={closeAlert}
                className={`${
                  alertType === "error"
                    ? "bg-red-700/85 hover:bg-red-800/85"
                    : "bg-green-700/85 hover:bg-green-800/85"
                } rounded-full p-1 transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-2">{alertMessage}</p>
            {alertType === "error" && incompleteFields.length > 0 && (
              <ul className="list-disc pl-5 text-sm space-y-1">
                {incompleteFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SubmitCompetition;
