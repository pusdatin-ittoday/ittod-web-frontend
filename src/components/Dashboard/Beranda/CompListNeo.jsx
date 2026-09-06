import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaDiscord } from "react-icons/fa";
import { getCurrentUser, getUserCompetitions } from "../../../api/user";
import { postCompePayment } from "../../../api/compeFile";
import CompCardNeo from "./CompCardNeo";
import { requireCompleteProfile } from "../../../utils/profileCompletion";
import { getCompetitionTimelines } from "../../../api/eventPublic";
import TextWithLinks from "../../../utils/TextWithLinks";
import { useAlert } from "../../../context/AlertContext";
import CalendarWidget from "./CalendarWidget";



const BentoListIcon = () => (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 29 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.59351 15.6218V12.9717H18.975V15.6218H6.59351ZM6.59351 9.62177V6.97174H18.975V9.62177H6.59351ZM6.59351 3.62177V0.971738H18.975V3.62177H6.59351ZM2.29338 16.5935C1.66084 16.5935 1.12048 16.3683 0.672287 15.9178C0.224096 15.4674 0 14.9259 0 14.2934C0 13.6608 0.225221 13.1205 0.675663 12.6723C1.12611 12.2241 1.66759 12 2.30013 12C2.93267 12 3.47303 12.2252 3.92122 12.6757C4.36941 13.1261 4.59351 13.6676 4.59351 14.3001C4.59351 14.9327 4.36829 15.473 3.91785 15.9212C3.4674 16.3694 2.92591 16.5935 2.29338 16.5935ZM2.29338 10.5935C1.66084 10.5935 1.12048 10.3683 0.672287 9.91784C0.224096 9.4674 0 8.92591 0 8.29338C0 7.66084 0.225221 7.12048 0.675663 6.67229C1.12611 6.2241 1.66759 6 2.30013 6C2.93267 6 3.47303 6.22522 3.92122 6.67566C4.36941 7.12611 4.59351 7.66759 4.59351 8.30013C4.59351 8.93267 4.36829 9.47303 3.91785 9.92122C3.4674 10.3694 2.92591 10.5935 2.29338 10.5935ZM2.29338 4.59351C1.66084 4.59351 1.12048 4.36829 0.672287 3.91785C0.224096 3.4674 0 2.92591 0 2.29338C0 1.66084 0.225221 1.12048 0.675663 0.672287C1.12611 0.224096 1.66759 0 2.30013 0C2.93267 0 3.47303 0.225221 3.92122 0.675664C4.36941 1.12611 4.59351 1.6676 4.59351 2.30013C4.59351 2.93267 4.36829 3.47303 3.91785 3.92122C3.4674 4.36941 2.92591 4.59351 2.29338 4.59351Z" fill="#34399F" />
    </svg>
);

const CompListNeo = () => {
    const [competitions, setCompetitions] = useState({});
    const [userData, setUserData] = useState({ name: "Crew" });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState("Crew");

    const [globalCompTimelines, setGlobalCompTimelines] = useState([]);
    const navigate = useNavigate();
    const { showAlert } = useAlert();

    const handleJoinTeam = async () => {
        if (await requireCompleteProfile(navigate, showAlert)) {
            navigate("/dashboard/ikut-lomba", { state: { showJoinForm: true } });
        }
    };

    const processCompetitionsData = (data, currentUserName = null, isCurrentUserDataComplete = false) => {
        const processedCompetitions = {};
        const isApproved = (v) => v === 1 || v === true || v === 'approved';
        const isRejectedStatus = (v) => v === 0 || v === false || v === 'rejected';

        Object.entries(data).forEach(([key, comp]) => {
            const isVerified = isApproved(comp.is_verified) || isApproved(comp.isVerified);
            const hasPaymentProof = Boolean(comp.paymentProofID);
            const hasVerificationError = comp.verification_error && comp.verification_error.trim() !== "";
            const isRejected = hasVerificationError || isRejectedStatus(comp.is_verified) || isRejectedStatus(comp.isVerified);

            const isPendingVerification = !isVerified && hasPaymentProof && !isRejected;

            let updatedMembers = [];

            if (comp.members && typeof comp.members === 'object' && !Array.isArray(comp.members)) {
                updatedMembers = Object.entries(comp.members).map(([memberId, member]) => {
                    const isCurrentMember = member.fullName === currentUserName;
                    const memberIsComplete = isCurrentMember
                        ? isCurrentUserDataComplete
                        : (member.is_registration_complete || false);

                    return {
                        ...member,
                        id: memberId,
                        isRegistrationComplete: memberIsComplete
                    };
                });
            } else if (Array.isArray(comp.members)) {
                updatedMembers = comp.members.map(member => {
                    const isCurrentMember = member.fullName === currentUserName;
                    const memberIsComplete = isCurrentMember
                        ? isCurrentUserDataComplete
                        : (member.isRegistrationComplete || member.is_registration_complete || false);

                    return {
                        ...member,
                        isRegistrationComplete: memberIsComplete
                    };
                });
            }

            processedCompetitions[key] = {
                ...comp,
                isDocumentVerified: isApproved(comp.isDocumentVerified) ? 'approved' : comp.isDocumentVerified,
                members: updatedMembers,
                isVerified: isVerified,
                pendingVerification: isPendingVerification
            };
        });

        return processedCompetitions;
    };

    const refreshCompetitionData = async () => {
        try {
            const competitionsResponse = await getUserCompetitions();
            if (competitionsResponse.success && competitionsResponse.data) {
                setCompetitions(processCompetitionsData(
                    competitionsResponse.data,
                    currentUser,
                    userData.isRegistrationComplete
                ));
            }
        } catch (error) {
            console.error("Error refreshing competition data:", error);
        }
    };

    const handleVerify = async (compKey, pembayaran) => {
        try {
            let teamID = competitions[compKey]?.teamID;
            if (!teamID) {
                return { success: false, message: "ID Tim tidak ditemukan" };
            }

            teamID = String(teamID);

            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(pembayaran.type)) {
                return {
                    success: false,
                    message: "Format file tidak didukung. Gunakan JPG atau PNG"
                };
            }

            const maxSize = 2 * 1024 * 1024;
            if (pembayaran.size > maxSize) {
                return {
                    success: false,
                    message: "Ukuran file terlalu besar. Maksimum 2MB."
                };
            }

            const formData = new FormData();
            formData.append("team_id", teamID);

            const safeFileName = pembayaran.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const safeFile = new File([pembayaran], safeFileName, { type: pembayaran.type });
            formData.append("image", safeFile);

            const result = await postCompePayment(formData);

            if (result.success) {
                try {
                    const uploadedTeams = JSON.parse(localStorage.getItem('uploadedTeams') || '{}');
                    uploadedTeams[teamID] = true;
                    localStorage.setItem('uploadedTeams', JSON.stringify(uploadedTeams));
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                }

                setCompetitions(prev => {
                    const updated = { ...prev };
                    if (updated[compKey]) {
                        updated[compKey] = {
                            ...updated[compKey],
                            pendingVerification: true
                        };
                    }
                    return updated;
                });

                setTimeout(refreshCompetitionData, 3000);
                return result;
            } else {
                return {
                    success: false,
                    message: result.message || "Gagal mengunggah bukti pembayaran."
                };
            }
        } catch (error) {
            console.error("Error during verification:", error);
            return {
                success: false,
                message: error.message || "Terjadi kesalahan saat mengunggah bukti pembayaran"
            };
        }
    };

    const handleEditUser = () => {
        navigate("/edit-profile");
    };

    const handleTwibbonClick = () => {
        window.open("https://drive.google.com/drive/folders/1NlgIwLuzBk7ss4ALHBdGdT4EfOkL-JLR", "_blank");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [userResponse, competitionsResponse, compTimelineResponse] = await Promise.all([
                    getCurrentUser(),
                    getUserCompetitions(),
                    getCompetitionTimelines()
                ]);

                if (compTimelineResponse.success) {
                    setGlobalCompTimelines(compTimelineResponse.data);
                }

                let name = "Crew";
                let isUserDataComplete = false;
                if (userResponse.success && userResponse.data) {
                    const data = userResponse.data;
                    name = data.full_name || data.name || "Crew";
                    isUserDataComplete = data.is_registration_complete || false;
                    setUserData({
                        name: name,
                        isRegistrationComplete: isUserDataComplete
                    });
                    setCurrentUser(name);
                }

                if (competitionsResponse.success && competitionsResponse.data) {
                    setCompetitions(processCompetitionsData(
                        competitionsResponse.data,
                        name,
                        isUserDataComplete
                    ));
                }

                const flashMsg = sessionStorage.getItem("flash_success_message");
                if (flashMsg) {
                    sessionStorage.removeItem("flash_success_message");
                    showAlert({ message: flashMsg });
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        const interval = setInterval(refreshCompetitionData, 20000);
        return () => clearInterval(interval);
    }, []);

    const filteredCompetitions = Object.entries(competitions || {}).filter(([, data]) => {
        return data && data.members;
    });

    return (
        <div className="flex flex-col xl:flex-row gap-6 justify-center items-start w-full">
            <div className="flex-1 w-full flex flex-col gap-6">
                <div className="border-[4px] border-[#1A1C1C] bg-white p-5 sm:p-7 lg:p-8 shadow-[6px_6px_0_0_#1A1C1C] relative overflow-hidden flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <p className="font-space-grotesk text-[10px] sm:text-xs tracking-[0.15em] text-[#34399F] font-bold uppercase">
                                WELCOME BACK, CREW
                            </p>
                            <h1 className="break-words text-2xl font-extrabold uppercase text-[#1A1C1C] leading-tight tracking-tight sm:text-4xl">
                                Halo, <span className="text-[#34399F]">{userData.name}!</span>
                            </h1>
                        </div>

                        <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                            <button
                                onClick={handleTwibbonClick}
                                className="flex-1 sm:flex-initial border-[3px] border-[#1A1C1C] bg-[#34399F] px-4 py-2.5 text-xs font-bold uppercase text-white shadow-[4px_4px_0_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                Twibbon
                            </button>
                            <button
                                onClick={handleEditUser}
                                className="flex-1 sm:flex-initial border-[3px] border-[#1A1C1C] bg-[#E8E8E8] px-4 py-2.5 text-xs font-bold uppercase text-black shadow-[4px_4px_0_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#1A1C1C] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                Edit Data
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-[3px] border-[#1A1C1C] bg-[#F3F3F3] p-2.5 flex flex-col gap-5 sm:border-[4px] sm:p-6">
                    <div className="flex items-center gap-2">
                        <BentoListIcon />
                        <h2 className="text-lg sm:text-xl font-black uppercase text-[#1A1C1C] tracking-tight">
                            KOMPETISI/EVENT SAYA
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <p className="border-[3px] border-[#1A1C1C] bg-[#ffd400] px-4 py-2.5 text-xs font-black uppercase shadow-[4px_4px_0_0_#1A1C1C]">
                                    Loading...
                                </p>
                            </div>
                        ) : filteredCompetitions.length > 0 ? (
                            filteredCompetitions.map(([key, comp]) => (
                                <CompCardNeo
                                    key={key}
                                    compKey={key}
                                    data={{
                                        ...comp,
                                        timelines: globalCompTimelines.length > 0 ? globalCompTimelines : comp.timelines
                                    }}
                                    currentUser={currentUser}
                                    onVerify={handleVerify}
                                />
                            ))
                        ) : (
                            <div className="w-full border-[2.4px] border-dashed border-[#34399F] bg-white p-8 sm:p-12 flex flex-col justify-center items-center gap-6 text-center">
                                <div className="flex flex-col items-center gap-4">
                                    <h3 className="font-anybody text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1A1C1C]">
                                        BELUM ADA LOMBA
                                    </h3>
                                    <p className="font-space-grotesk text-sm sm:text-base text-gray-500 max-w-md">
                                        Kamu belum mendaftar ke lomba apapun. Yuk cari lomba dan mulai berkompetisi!
                                    </p>
                                </div>
                                <p className="font-space-grotesk text-xs sm:text-sm text-gray-400">
                                    Sudah punya join code? Masukkan dari halaman Daftar Lomba.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                    <button
                                        onClick={() => navigate("/dashboard/ikut-lomba")}
                                        className="w-full sm:w-[240px] border-[2.4px] border-black bg-[#34399F] py-3 text-sm font-space-grotesk font-bold uppercase text-white shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                                    >
                                        LIHAT DAFTAR LOMBA
                                    </button>
                                    <button
                                        onClick={handleJoinTeam}
                                        className="w-full sm:w-[257px] border-[2.4px] border-black bg-[#FCD400] py-3 text-sm font-space-grotesk font-bold uppercase text-[#6E5C00] shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                                    >
                                        BERGABUNG TIM
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6 w-full xl:w-[360px] flex-shrink-0 self-stretch xl:self-auto">
                <div className="w-full">
                    <CalendarWidget />
                </div>
            </div>
        </div>
    );
};

export default CompListNeo;
