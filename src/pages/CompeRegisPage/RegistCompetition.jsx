import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { registerTeam } from "../../api/compe.js";
import { getPublicEvents } from "../../api/eventPublic.js";
import DashboardNeoHeader from "../../components/Dashboard/DashboardNeoHeader.jsx";
import Sidebar from "../../components/Dashboard/Sidebar.jsx";
import Footer from "../../components/Footer.jsx";

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
        <div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
            <DashboardNeoHeader />

            <div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[650px] lg:flex-row">
                <aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
                    <Sidebar
                        active="ikut-lomba"
                        setActive={() => {}}
                        variant="neobrutal"
                    />
                </aside>

                <main className="flex min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
                    <section className="w-full max-w-5xl border-[4px] border-black bg-[#f4f4f2] p-4 shadow-[8px_8px_0_#191b1a] sm:p-6 lg:p-8">
                        <div className="border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#191b1a] sm:p-8 lg:p-10">
                            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#3f46b8]">
                                {isLoading ? "Memuat kompetisi..." : competitionTitle}
                            </p>
                            <h1 className="mt-3 text-2xl font-black sm:text-3xl">
                                {participationType === "individual" ? "Daftar Individu" : "Buat Tim"}
                            </h1>
                            <p className="mt-2 text-sm font-semibold text-[#806400] sm:text-base">
                                {participationType === "individual"
                                    ? "Pendaftaran ini bersifat individu dan tidak menggunakan tim."
                                    : "Kamu akan secara otomatis menjadi ketua tim."}
                            </p>

                            <form
                                onSubmit={handleSubmit}
                                className="mt-7 flex flex-col gap-5"
                            >
                                <label htmlFor="NamaTim" className="sr-only">
                                    {participationType === "individual" ? "Nama Pendaftar" : "Nama Tim"}
                                </label>
                                <input
                                    value={NamaTim}
                                    onChange={handleChange}
                                    id="NamaTim"
                                    name="NamaTim"
                                    type="text"
                                    placeholder={participationType === "individual" ? "Masukkan Nama Pendaftar" : "Masukkan Nama Tim"}
                                    className="w-full border-[3px] border-black bg-white px-5 py-4 text-base font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400 focus:bg-[#fff6bf]"
                                />

                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting || !competitionId || isLoading}
                                        className="order-1 border-[3px] border-black bg-[#ffd400] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:order-none"
                                    >
                                        {isSubmitting
                                            ? "Mendaftar..."
                                            : participationType === "individual"
                                              ? "Daftar"
                                              : "Submit"}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => navigate("/dashboard/ikut-lomba")}
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

            <Footer variant="neobrutal" />
        </div>
    );
};

export default RegistCompetition;
