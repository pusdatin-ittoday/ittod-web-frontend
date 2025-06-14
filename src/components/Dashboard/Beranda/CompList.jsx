import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaUser, FaUpload, FaImage, FaReceipt } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { getCurrentUser, getUserCompetitions } from "../../../api/user";
import { postCompePayment } from "../../../api/compeFile";

const CompList = ({ name, currentUser, competitions = {}, onVerify, onEditUser, loading }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [pembayaran, setPembayaran] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [currentCompKey, setCurrentCompKey] = useState(null);

    // Refs for file inputs
    const pembayaranInputRef = useRef(null);

    const handleVerifyClick = (compKey) => {
        // Reset file states when opening modal for a fresh upload attempt
        setPembayaran(null);
        if (pembayaranInputRef.current) pembayaranInputRef.current.value = "";
        setCurrentCompKey(compKey);
        setShowUploadModal(true);
    };

    const handleUploadSubmit = () => {
        if (!pembayaran) {
            setAlertMessage("Harap upload bukti pembayaran");
            setShowAlert(true);
            return;
        }

        if (onVerify && currentCompKey) {
            onVerify(currentCompKey, pembayaran);
        }

        // Reset form dan tutup modal
        setPembayaran(null);
        setShowUploadModal(false);
        setCurrentCompKey(null);
    };

    const handleEditUserClick = () => {
        if (onEditUser) {
            onEditUser();
        }
    };

    const filteredCompetitions = Object.entries(competitions || {}).filter(([, data]) => {
        if (!data || !data.members || !Array.isArray(data.members)) {
            return false;
        }
        return data.members.some(member => member && member.fullName === currentUser);
    });

    const renderCompetition = (key, data) => {
        // Check if current user is in this competition and needs verification
        const currentMember = data.members.find(member => member.fullName === currentUser);
        const needsVerification = currentMember && !currentMember.verified;

        return (
            <div key={key} className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-3 sm:px-4 py-3 text-white hover:scale-101 hover:bg-white/20 transition duration-300 ease-in-out">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 leading-tight">{data.competitionName}</h3>

                        <div className="space-y-1 text-xs sm:text-sm">
                            <p>
                                <span className="font-semibold">Team Name:</span> {data.teamName || "-"}
                            </p>
                            <p>
                                <span className="font-semibold">Team Join Code:</span> {data.teamJoinCode || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Verification button */}
                    {needsVerification && (
                        <div className="flex-shrink-0">
                            <button
                                onClick={() => handleVerifyClick(key)}
                                className="custom-button-bg px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm button-hover transition duration-300 hover:scale-105 w-full sm:w-auto"
                            >
                                <FaUpload className="inline mr-1" /> Verify
                            </button>
                        </div>
                    )}
                </div>

                {/* Members section */}
                <div className="mt-3 space-y-1">
                    {data.members.map((anggota, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-2 sm:gap-4">
                            <p className="text-xs sm:text-sm flex-1 min-w-0">
                                <span className="inline-block w-12 sm:w-16 lg:w-20 flex-shrink-0">
                                    {idx === 0 ? "👑 Ketua" : "👤 Anggota"}:
                                </span>
                                <span className={anggota.fullName === currentUser ? "font-bold text-white ml-1" : "ml-1"}>
                                    {anggota.fullName}
                                </span>
                            </p>

                            <span className={`text-xs sm:text-sm font-bold flex-shrink-0 ${anggota.isRegistrationComplete ? "text-green-400/90" : "text-red-400/90"}`}>
                                {anggota.isRegistrationComplete ? "✓ Verified" : "✗ Not Verified"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Team status */}
                <div className="mt-3 pt-2 border-t border-white/20">
                    <p className="text-xs sm:text-sm font-semibold">
                        Team Status:{" "}
                        <span className={data.isVerified ? "text-green-400/90" : "text-red-400/90"}>
                            {data.isVerified ? "Verified" : "Not Verified"}
                        </span>
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-full lg:w-[650px] font-dm-sans p-4 sm:p-6 bg-[#7b446c] rounded-lg shadow-md h-[400px] sm:h-[500px] flex flex-col">
            {/* Bagian Header */}
            <div className="border-b border-[#dfb4d7]/60 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <FaUser className="text-lg sm:text-xl lg:text-2xl input-text-glow text-white drop-shadow-[0_1px_6px_#FFE6FC]" />
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold input-text-glow tracking-wide transform transition duration-500 hover:scale-102 text-white drop-shadow-[0_1px_1px_#FFE6FC]">
                            Halo, {name}!
                        </h2>
                    </div>
                    <div className="flex items-center">
                        <button
                            onClick={handleEditUserClick}
                            className="custom-button-bg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded button-hover transition duration-300 hover:scale-105 font-semibold cursor-pointer w-full sm:w-auto"
                        >
                            Edit Data
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-3 flex items-center gap-2 text-white">
                <FaList className="text-sm sm:text-base lg:text-xl" /> Kompetisi Saya
            </h3>

            <div className="overflow-y-auto flex-1 px-1 sm:px-2 py-2 custom-scrollbar">
                {filteredCompetitions.length > 0 ? (
                    filteredCompetitions.map(([key, data]) => renderCompetition(key, data))
                ) : (
                    <div className="text-xs sm:text-sm text-center text-white/70 py-8">
                        <p>Kamu belum ikut kompetisi apapun.</p>
                    </div>
                )}
            </div>

            {/* Modal Upload */}
                        {showUploadModal && (
                            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                                <div className="bg-[#7b446c]/95 border border-white/30 p-4 sm:p-6 rounded-lg w-full max-w-md text-white">
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-center">
                                        Upload Bukti Pembayaran
                                    </h3>
                                    <p className="text-xs sm:text-sm mb-4 sm:mb-3 text-left text-gray-300">
                                        Silakan upload bukti pembayaran untuk verifikasi tim kamu.<br />
                                        <span className="font-semibold">Informasi Rekening:</span><br />
                                        Blu by BCA DIGITAL<br />
                                        <span className="font-mono">0027 4625 4702</span><br />
                                        a/n M Althaf Faiz Rafianto<br />
                                    </p>
                                    <div className="mb-4 sm:mb-6">
                                        <p className="text-xs sm:text-sm text-left text-gray-300 font-semibold mb-1">
                                            Kode Kompetisi:
                                        </p>
                                        <ul className="text-xs sm:text-sm text-left text-gray-300 list-disc list-inside ml-2">
                                            <li>01 : HackToday</li>
                                            <li>02 : GameToday</li>
                                            <li>03 : UXToday</li>
                                            <li>04 : Minetoday</li>
                                        </ul>
                                        <p className="text-xs sm:text-sm text-left text-gray-300 mb-1">
                                            <b>Harga Batch 1:</b> Rp 80.000<br />
                                            <b>Harga Batch 2:</b> Rp 100.000
                                        </p>
                                        <p className="text-xs sm:text-sm text-left text-gray-300 mb-1">
                                            Contoh: Ryan harus bayar sebanyak 80.000 rupiah jika Ryan ingin ikut GameToday pada Batch 1. Ryan harus transfer <b>80.002</b> Rupiah ke Althaf Faiz Rafianto.
                                        </p>
                                    </div>
                                    <div className="space-y-4">
                                        {/* Upload Bukti Pembayaran */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2">
                                    Upload Bukti Pembayaran
                                    <span className="text-xs text-gray-400 ml-1">(JPG/PNG/PDF, maks 2MB)</span>
                                </label>
                                <div
                                    className="border-2 border-dashed border-pink-400 rounded-md p-3 sm:p-4 text-center bg-white/10 hover:bg-white/20 cursor-pointer w-full min-h-[60px] sm:min-h-[80px] flex flex-col items-center justify-center gap-1 relative group transition duration-300 hover:scale-105"
                                    onClick={() => pembayaranInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            const file = e.dataTransfer.files[0];
                                            if (file.size > 2 * 1024 * 1024) {
                                                setAlertMessage("Ukuran file Pembayaran maksimal 2MB.");
                                                setShowAlert(true);
                                                setPembayaran(null);
                                                if (pembayaranInputRef.current) pembayaranInputRef.current.value = "";
                                            } else {
                                                setPembayaran(file);
                                            }
                                        }
                                    }}
                                >
                                    <FaReceipt className={`text-xl sm:text-2xl mb-1 ${pembayaran ? 'text-green-400' : 'text-pink-300 group-hover:text-pink-200'}`} />
                                    <span className="truncate text-xs w-full px-2">
                                        {pembayaran ? pembayaran.name : "Drop file atau klik untuk memilih"}
                                    </span>
                                    <input
                                        type="file"
                                        ref={pembayaranInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    setAlertMessage("Ukuran file Pembayaran maksimal 2MB.");
                                                    setShowAlert(true);
                                                    setPembayaran(null);
                                                    e.target.value = "";
                                                } else {
                                                    setPembayaran(file);
                                                }
                                            }
                                        }}
                                        accept=".jpg,.jpeg,.png,.pdf"
                                        style={{ display: "none" }}
                                    />
                                    {pembayaran && <span className="absolute top-1 right-1 text-green-400 text-lg">✓</span>}
                                </div>
                            </div>
                        </div>

                        {/* Tombol */}
                        <div className="flex gap-3 mt-4 sm:mt-6">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="cursor-pointer flex-1 py-2 text-black bg-gray-300 rounded hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                className="cursor-pointer flex-1 py-2 custom-button-bg button-hover transition duration-300 ease-in-out hover:scale-105 rounded-lg text-sm"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert */}
            {showAlert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#7b446c]/95 border border-white/30 p-4 rounded-lg max-w-xs w-full text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <MdErrorOutline className="text-lg sm:text-xl text-red-400" />
                            <h3 className="text-sm sm:text-lg font-semibold">{alertMessage}</h3>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full px-3 py-1 custom-button-bg rounded-lg button-hover text-sm transition mt-2 cursor-pointer"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const CompListPage = () => {
    const [competitions, setCompetitions] = useState({});
    const [userData, setUserData] = useState({ name: "" });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, competitionsResponse] = await Promise.all([
                    getCurrentUser(),
                    getUserCompetitions()
                ]);

                if (userResponse.success && userResponse.data) {
                    const fullName = userResponse.data.full_name || userResponse.data.name || "User";
                    setUserData({ name: fullName });
                    setCurrentUser(fullName);
                } else {
                    setUserData({ name: "User" });
                    setCurrentUser("User");
                }

                if (competitionsResponse.success && competitionsResponse.data) {
                    setCompetitions(competitionsResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setUserData({ name: "User" });
                setCurrentUser("User");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleVerify = async (compKey, pembayaran) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append("team_id", competitions[compKey]?.teamID || "");
            formData.append("image", pembayaran);

            const result = await postCompePayment(formData);

            if (result.success) {
                setCompetitions(prevCompetitions => {
                    const updated = { ...prevCompetitions };
                    if (updated[compKey]) {
                        updated[compKey] = {
                            ...updated[compKey],
                            members: updated[compKey].members.map(member =>
                                member.fullName === currentUser ? { ...member, verified: true } : member
                            )
                        };
                    }
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error during verification:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = () => {
        navigate("/edit-profile");
    };

    return (
        <div className="w-full lg:w-[650px]">
            <CompList
                name={userData.name}
                loading={loading}
                currentUser={currentUser}
                competitions={competitions}
                onVerify={handleVerify}
                onEditUser={handleEditUser}
            />
        </div>
    );
};

export default CompListPage;
