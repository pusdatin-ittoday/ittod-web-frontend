import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
import { getCurrentUser, getUserCompetitions, getAnnouncements } from "../../../api/user";
import { postCompePayment } from "../../../api/compeFile";
import CompCardNeo from "./CompCardNeo";

const CompListNeo = () => {
    const [competitions, setCompetitions] = useState({});
    const [userData, setUserData] = useState({ name: "Crew" });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState("Crew");
    const [announcements, setAnnouncements] = useState([]);
    const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);
    const navigate = useNavigate();

    const processCompetitionsData = (data, currentUserName = null, isCurrentUserDataComplete = false) => {
        const processedCompetitions = {};

        Object.entries(data).forEach(([key, comp]) => {
            const isVerified = comp.is_verified === 'approved' || comp.isVerified === 'approved';
            const hasPaymentProof = Boolean(comp.paymentProofID);
            const hasVerificationError = comp.verification_error && comp.verification_error.trim() !== "";
            const isRejected = hasVerificationError || comp.is_verified === 'rejected' || comp.isVerified === 'rejected';

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
        window.open("https://www.twibbonize.com/twibbon-ittoday-2025", "_blank");
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setLoadingAnnouncements(true);
            try {
                const [userResponse, competitionsResponse, announcementsResponse] = await Promise.all([
                    getCurrentUser(),
                    getUserCompetitions(),
                    getAnnouncements()
                ]);

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

                const resultData = announcementsResponse.data || {};
                if (announcementsResponse.success && Array.isArray(resultData) && resultData.length > 0) {
                    setAnnouncements(resultData);
                } else if (announcementsResponse.success && typeof resultData.data === 'object' && Object.keys(resultData.data).length > 0) {
                    setAnnouncements(Object.values(resultData.data));
                } else {
                    setAnnouncements([]);
                }
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
                setLoadingAnnouncements(false);
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
            <div className="flex-1 w-full border-[4px] border-[#191b1a] bg-white p-5 sm:p-7 lg:p-8 shadow-[8px_8px_0_#191b1a] flex flex-col gap-6">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-dashed border-[#191b1a] pb-6">
                    <div className="space-y-1">
                        <p className="font-bold text-[10px] sm:text-xs tracking-[0.15em] text-[#34399F] uppercase">
                            WELCOME BACK, CREW
                        </p>
                        <h1 className="text-3xl sm:text-4xl font-black text-black leading-tight tracking-tight">
                            Halo, <span className="text-[#34399F]">{userData.name}!</span>
                        </h1>
                    </div>

                    <div className="flex gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <button
                            onClick={handleTwibbonClick}
                            className="flex-1 sm:flex-initial border-[3px] border-black bg-[#34399F] px-4 py-2.5 text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            Twibbon
                        </button>
                        <button
                            onClick={handleEditUser}
                            className="flex-1 sm:flex-initial border-[3px] border-black bg-[#E8E8E8] px-4 py-2.5 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            Edit Data
                        </button>
                    </div>
                </div>

                <div className="border-[4px] border-[#191b1a] bg-[#F3F3F3] p-4 sm:p-6 shadow-none flex flex-col gap-5">
                    <div className="flex items-center gap-2 border-b-2 border-dashed border-[#191b1a] pb-3">
                        <FaList className="text-xl text-[#34399F]" />
                        <h2 className="text-lg sm:text-xl font-black uppercase text-black tracking-tight">
                            KOMPETISI SAYA
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <p className="border-[3px] border-black bg-[#ffd400] px-4 py-2.5 text-xs font-black uppercase shadow-[4px_4px_0_#191b1a]">
                                    Loading...
                                </p>
                            </div>
                        ) : filteredCompetitions.length > 0 ? (
                            filteredCompetitions.map(([key, data]) => (
                                <CompCardNeo
                                    key={key}
                                    compKey={key}
                                    data={data}
                                    currentUser={currentUser}
                                    onVerify={handleVerify}
                                />
                            ))
                        ) : (
                            <div className="border-[3px] border-black bg-white p-6 text-center text-xs font-black uppercase shadow-[4px_4px_0_#191b1a]">
                                Kamu belum mengikuti kompetisi apa pun.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <aside className="w-full xl:w-[360px] border-[4px] border-[#191b1a] bg-[#FCD400] p-5 sm:p-7 shadow-[8px_8px_0_#191b1a] flex flex-col gap-5 flex-shrink-0 self-stretch xl:self-auto">
                <div className="flex items-center gap-2.5 border-b-2 border-[#191b1a] pb-3">
                    <div className="bg-black rounded-full p-2 flex items-center justify-center">
                        <GrAnnounce className="text-lg text-[#FCD400]" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#1A1C1C] tracking-tight leading-none">
                        Announcements
                    </h2>
                </div>

                <div className="space-y-5 overflow-y-auto max-h-[600px] px-3 py-2 custom-scrollbar">
                    {loadingAnnouncements ? (
                        <div className="text-center font-bold text-black py-4">Loading...</div>
                    ) : announcements.length === 0 ? (
                        <div className="border-[3px] border-[#191b1a] bg-white p-4 shadow-[4px_4px_0_#191b1a] text-center font-bold text-xs">
                            Belum ada pengumuman.
                        </div>
                    ) : (
                        announcements.map((announcement, idx) => {
                            const tilt = idx % 2 === 0 ? "-rotate-[0.5deg]" : "rotate-[0.6deg]";
                            const cardBg = idx % 2 === 0 ? "bg-white" : "bg-[#E2E2E2]";
                            
                            return (
                                <div
                                    key={announcement.id}
                                    className={`border-[3px] border-[#191b1a] p-4 shadow-[4px_4px_0_#191b1a] transform ${tilt} ${cardBg} transition duration-300`}
                                >
                                    <h4 className="text-base sm:text-lg font-black uppercase leading-tight text-black mb-1">
                                        {announcement.title}
                                    </h4>
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 opacity-60 mb-2">
                                        <span>Kategori</span>
                                        <span>•</span>
                                        <span>
                                            {announcement.updated_at
                                                ? new Date(announcement.updated_at).toLocaleDateString()
                                                : ""}
                                        </span>
                                    </div>
                                    <p className="text-xs font-semibold leading-relaxed text-[#464652]">
                                        {announcement.description}
                                    </p>
                                </div>
                            );
                        })
                    )}
                </div>

                <div className="mt-auto pt-4 border-t-2 border-dashed border-[#191b1a] text-center">
                    <button
                        onClick={() => navigate('/dashboard/pengumuman')}
                        className="w-full border-[3px] border-black bg-white px-4 py-2.5 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        View All Broadcasts
                    </button>
                </div>
            </aside>
        </div>
    );
};

export default CompListNeo;
