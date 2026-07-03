import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar.jsx";
import { MdGroups } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { registerTeam } from "../../api/compe.js";
import { getPublicEvents } from "../../api/eventPublic.js";

const RegistCompetition = () => {
    const navigate = useNavigate();
    const { competitionSlug } = useParams(); // e.g. "gametoday", "hacktoday"

    const [NamaTim, setNamaTim] = useState("");
    const [competitionId, setCompetitionId] = useState(null);
    const [competitionTitle, setCompetitionTitle] = useState("");
    const [participationType, setParticipationType] = useState("team");
    
    // UI reactivity states
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("error"); // "error" or "success"
    const [incompleteFields, setIncompleteFields] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCompetitionInfo = async () => {
            setIsLoading(true);
            const res = await getPublicEvents("competition");
            if (res.success && res.data) {
                const normalizedSlug = decodeURIComponent(
                    competitionSlug || ""
                ).toLowerCase();
                const event = res.data.find(
                    (e) => e.id.toLowerCase() === competitionSlug?.toLowerCase()
                );
                if (event) {
                    setCompetitionId(event.id);
                    setCompetitionTitle(event.title);
                    setParticipationType(event.participation_type || "team");
                } else {
                    // Fallback to title casing the slug for display if event not found
                    setCompetitionTitle(
                        competitionSlug ? 
                        competitionSlug.charAt(0).toUpperCase() + competitionSlug.slice(1) : 
                        "Kompetisi"
                    );
                }
            }
            setIsLoading(false);
        };
        fetchCompetitionInfo();
    }, [competitionSlug]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "NamaTim") {
            setNamaTim(value);
        } 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Prevent multiple submissions
        if (isSubmitting) return;

        const emptyFields = [];
        const isIndividual = participationType === "individual";

        const fieldLabels = {
            NamaTim: isIndividual ? "Nama pendaftar" : "Nama tim",
        };

        const fieldsToValidate = {
            NamaTim,
        };

        for (const key in fieldsToValidate) {
            if (
                !fieldsToValidate[key] ||
                (typeof fieldsToValidate[key] === "string" &&
                    fieldsToValidate[key].trim() === "")
            ) {
                emptyFields.push(fieldLabels[key]);
            }
        }

        if (emptyFields.length > 0) {
            // Replace alert with custom alert
            setIncompleteFields(emptyFields);
            setAlertMessage("Mohon lengkapi kolom berikut:");
            setAlertType("error");
            setShowAlert(true);
            return;
        }

        setIsSubmitting(true);

        if (!competitionId) {
            setAlertType("error");
            setAlertMessage("Data kompetisi tidak ditemukan. Silakan muat ulang halaman.");
            setShowAlert(true);
            setIsSubmitting(false);
            return;
        }

        const submissionData = {
            "competition_id": competitionId,
            ...(participationType === "team"
                ? { "team_name": NamaTim.trim() }
                : {}),
        };

        try {
            const response = await registerTeam(submissionData);
            
            if (!response.success) {
                throw new Error(response.error || "Failed to register team");
            }
            
            console.log("Form Submitted Successfully!");
            console.log("Submitted Data:", submissionData);

            // Save to sessionStorage
            sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));

            // Reset form
            setNamaTim("");
            
            // Show success message and redirect
            setAlertType("success");
            setAlertMessage(
                participationType === "individual"
                    ? "Pendaftaran individu berhasil!"
                    : "Pendaftaran tim berhasil!"
            );
            setShowAlert(true);
            
            // Redirect after showing success message
            setTimeout(() => {
                window.location.href = "/dashboard/ikut-lomba"; 
            }, 2000);
            
        } catch (error) {
            console.error("Registration error:", error);
            setAlertType("error");
            setAlertMessage(`Gagal mendaftar: ${error.message}`);
            setShowAlert(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeAlert = () => {
        setShowAlert(false);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
                    <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">
                        {isLoading ? "Memuat..." : `Form Daftar ${competitionTitle}`}
                    </h2>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 font-dm-sans"
                    >
                        <div className="mb-3 relative">
                            <label htmlFor="NamaTim" className="block text-sm font-bold mb-2">
                                {participationType === "individual" ? "Nama Pendaftar" : "Nama Tim"}
                            </label>
                            <MdGroups className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
                            <input
                                value={NamaTim}
                                onChange={handleChange}
                                id="NamaTim"
                                name="NamaTim"
                                type="text"
                                placeholder={participationType === "individual" ? "nama pendaftar" : "nama tim"}
                                className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
                            />
                        </div>

                        <div className="buttons flex flex-row justify-end">
                            <a
                                onClick={() => navigate("/dashboard/ikut-lomba")}
                                type="cancel"
                                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer transition duration-300 hover:scale-105"
                            >
                                Batal
                            </a>
                            <button
                                type="submit"
                                disabled={isSubmitting || !competitionId || isLoading}
                                className={`custom-button-bg text-white px-4 py-2 rounded cursor-pointer ${isSubmitting || !competitionId || isLoading ? 'opacity-75 cursor-not-allowed' : 'button-hover transition duration-300 ease-in-out hover:scale-105'}`}
                            >
                                {isSubmitting
                                    ? "Mendaftar..."
                                    : participationType === "individual"
                                      ? "Daftar"
                                      : "Submit"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Custom Alert Dialog */}
            {showAlert && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
                    <div className={`${alertType === 'error' ? 'bg-red-600/90' : 'bg-green-600/90'} text-white px-6 py-4 rounded-lg shadow-xl max-w-md`}>
                        <div className="flex justify-between items-start mb-2 gap-5">
                            <h3 className="font-bold text-lg">
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
                                onClick={closeAlert}
                                className={`${alertType === 'error' ? 'bg-red-700/85 hover:bg-red-800/85' : 'bg-green-700/85 hover:bg-green-800/85'} rounded-full p-1 transition-colors`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-sm mb-2">{alertMessage}</p>
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
        </>
    );
};

export default RegistCompetition;
