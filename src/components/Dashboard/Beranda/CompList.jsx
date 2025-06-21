import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaUser, FaUpload, FaReceipt } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
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

    const handleUploadSubmit = async () => {
        if (!pembayaran) {
            setAlertMessage("Harap upload bukti pembayaran");
            setShowAlert(true);
            return;
        }

        if (onVerify && currentCompKey) {
            const result = await onVerify(currentCompKey, pembayaran);

            if (result && result.success) {
                // Reset form dan tutup modal jika upload sukses
                setPembayaran(null);
                setShowUploadModal(false);
                setCurrentCompKey(null);
            } else {
                // Display error message
                setAlertMessage(result?.message || "Gagal upload bukti pembayaran. Coba lagi.");
                setShowAlert(true);
            }
        }
    };

    const handleEditUserClick = () => {
        if (onEditUser) {
            onEditUser();
        }
    };

    // Perbaikan filter kompetisi untuk mendukung members sebagai objek
    const filteredCompetitions = Object.entries(competitions || {}).filter(([, data]) => {
        if (!data || !data.members) {
            return false;
        }

        // Handle members sebagai objek atau array
        if (Array.isArray(data.members)) {
            return data.members.some(member => member && member.fullName === currentUser);
        } else if (typeof data.members === 'object') {
            // Jika members adalah objek, periksa semua nilai
            return Object.values(data.members).some(
                member => member && member.fullName === currentUser
            );
        }
        return false;
    });

    const renderCompetition = (key, data) => {
        // Check dan pastikan members selalu dalam bentuk array untuk rendering
        const membersArray = Array.isArray(data.members)
            ? data.members
            : Object.values(data.members || {});

        // Check if current user is the team leader (first member)
        const isTeamLeader = membersArray[0]?.fullName === currentUser;

        // Check verification status at team level
        const isTeamVerified = data.isVerified;
        const isPendingVerification = data.pendingVerification;

        // Only team leader can upload payment proof if team isn't verified
        const needsVerification = isTeamLeader && !isTeamVerified && !isPendingVerification;

        return (
            <div key={key} className="mb-4 bg-gradient-to-br from-[#8a4d7b]/90 to-[#6b3a5c]/95 backdrop-blur-md border border-white/20 rounded-xl shadow-lg px-3 sm:px-4 py-3 text-white hover:scale-[1.01] hover:shadow-xl transition duration-300 ease-in-out">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div className="flex-1">
                        <h3 className="text-base sm:text-lg lg:text-xl font-semibold mb-1 leading-tight input-text-glow text-pink-100">{data.competitionName}</h3>

                        <div className="space-y-1 text-xs sm:text-sm">
                            <p className="flex items-center">
                                <span className="font-semibold text-white/80 inline-block w-28">Team Name:</span> 
                                <span className="bg-[#9e5a8d]/30 px-2 py-0.5 rounded-md">{data.teamName || "-"}</span>
                            </p>
                            <p className="flex items-center">
                                <span className="font-semibold text-white/80 inline-block w-28">Join Code:</span> 
                                <span className="font-mono bg-[#9e5a8d]/30 px-2 py-0.5 rounded-md">{data.teamJoinCode || "-"}</span>
                            </p>
                        </div>
                    </div>
                    
                    {/* Verification status with improved styling */}
                    <div className="flex-shrink-0">
                        {needsVerification && (
                            <button
                                onClick={() => handleVerifyClick(key)}
                                className="cursor-pointer custom-button-bg px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm button-hover transition duration-300 hover:scale-105 w-full sm:w-auto"
                            >
                                <FaUpload className="inline mr-1 " /> Verifikasi
                            </button>
                        )}
                        {isPendingVerification && (
                            <span className="px-3 py-2 rounded bg-yellow-400/20 text-yellow-300 text-xs sm:text-sm font-semibold flex items-center transition-all duration-300">
                                <span className="spin-with-pause mr-1">⌛</span>
                                Menunggu Verifikasi
                            </span>
                        )}
                        {isTeamVerified && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded bg-green-400/20 text-green-300 text-xs sm:text-sm font-semibold">
                                <RiVerifiedBadgeFill className="text-lg" />
                                <span className="rounded text-xs sm:text-sm font-semibold">
                                    Sudah Terverifikasi
                                </span>
                            </div>
                        )}
                        {/* Show status info for team members */}
                        {!isTeamLeader && !isTeamVerified && !isPendingVerification && (
                            <div className="flex items-center gap-2 px-3 py-2 rounded bg-red-400/30 text-red-300 text-xs sm:text-sm font-semibold">
                                <MdErrorOutline className="text-lg" />
                                <span className="rounded text-xs sm:text-sm font-semibold">
                                    Belum Terverifikasi
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Members section with improved styling */}
                <div className="mt-4 space-y-2 bg-[#6b3a5c]/40 rounded-lg p-2">
                    {membersArray.map((anggota, idx) => (
                        <div key={idx} className={`flex items-center justify-between gap-2 sm:gap-4 p-2 rounded-lg ${
                            idx === 0 ? "bg-gradient-to-r from-amber-500/20 to-amber-600/5 border-l-2 border-amber-400" : 
                            "bg-white/5 hover:bg-white/10 transition-all duration-200"
                        }`}>
                            {/* For the member section - with vertical layout on mobile */}
                            <div className="flex items-start sm:items-center gap-2 flex-1 min-w-0">
                                <div className={`w-7 h-7 flex items-center justify-center rounded-full ${
                                    idx === 0 ? "bg-amber-400/30 text-amber-200" : "bg-purple-400/20 text-white/70"
                                }`}>
                                    {idx === 0 ? "👑" : "👤"}
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center text-xs sm:text-sm">
                                    <span className="font-medium text-white/70 mb-0.5 sm:mb-0 sm:inline-block sm:w-16 sm:pr-2">
                                        {idx === 0 ? "Ketua:" : "Anggota:"}
                                    </span>
                                    <span className={anggota.fullName === currentUser ? 
                                        "font-bold text-pink-300" : 
                                        "text-white"}>
                                        {anggota.fullName}
                                    </span>
                                </div>
                            </div>

                            {/* Status with vertical layout on mobile */}
                            <div className={`text-xs sm:text-sm font-medium flex-shrink-0 flex flex-row items-center px-2 py-1.5 rounded-md ${
                                anggota.isRegistrationComplete 
                                ? "bg-green-500/20 text-green-300 border border-green-400/30" 
                                : "bg-red-500/20 text-red-300 border border-red-400/30"
                            }`}>
                                {anggota.isRegistrationComplete ? (
                                    <>
                                        <p className="flex flex-col sm:flex-row items-center gap-1">
                                            <RiVerifiedBadgeFill className="text-lg mb-1 sm:mb-0 sm:mr-1.5" />
                                            <span className="hidden sm:inline text-center text-xs sm:text-sm sm:text-left ">Data Lengkap</span>
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="flex flex-col sm:flex-row items-center gap-1">
                                            <MdErrorOutline className="text-lg mb-1 sm:mb-0 sm:mr-1.5" />
                                            <span className="hidden sm:inline text-center sm:text-left text-xs sm:text-sm">Data Belum</span>
                                            <span className="hidden sm:inline">Lengkap</span>
                                        </p>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Reminder for team members */}
                {!isTeamLeader && !isTeamVerified && !isPendingVerification && (
                    <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-600/10 border border-yellow-400/30 shadow-inner">
                        <p className="text-xs sm:text-sm text-yellow-300 flex items-center gap-2">
                            <span className="text-lg p-1 bg-yellow-400/20 rounded-full">⚠️</span>
                            <span>Ingatkan ketua tim untuk upload bukti pembayaran</span>
                        </p>
                    </div>
                )}
            </div>
        );
    };

    // Rendering komponen
    return (
        <div className="max-w-full lg:w-[650px] font-dm-sans p-4 sm:p-6 bg-[#7b446c] rounded-lg shadow-md h-[400px] sm:h-[500px] flex flex-col">
            {/* Bagian Header */}
            <div className="border-b border-[#dfb4d7]/60 mb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
                    <div className="flex items-center gap-3 sm:gap-5">
                        <FaUser className="text-lg sm:text-xl lg:text-2xl input-text-glow text-white drop-shadow-[0_1px_6px_#FFE6FC]" />
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold input-text-glow tracking-wide transform transition duration-500 hover:scale-102">
                            <span className="text-white drop-shadow-[0_1px_1px_#FFB6C1] input-text-glow">Halo, </span><span className="text-pink-300 drop-shadow-[0_1px_5px_#FF69B4]">{name}!</span>
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
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2 sm:px-4">
                    <div className="bg-[#7b446c]/95 p-4 sm:p-6 rounded-lg w-full max-w-md text-white max-h-[80vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-lg sm:text-xl font-bold mb-2 text-center input-text-glow tracking-wide transform transition duration-500 hover:scale-102">
                            Upload Bukti Pembayaran
                        </h3>
                        <div className="mb-4 sm:mb-6">
                            <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-3 sm:px-4 py-3 text-white">
                                <div className="mb-3">
                                    <p className="text-xs sm:text-sm font-bold text-pink-300 mb-1">Informasi Rekening:</p>
                                    <div className="bg-[#7b446c]/60 rounded-lg px-3 py-2 text-xs sm:text-sm text-white/90 font-mono shadow-inner">
                                        Blu by BCA DIGITAL<br />
                                        <span className="text-lg  font-bold tracking-widest text-pink-100">0027 4625 4702</span><br />
                                        <span className="text-xs sm:text-sm font-semibold text-pink-100">a/n M Althaf Faiz Rafianto</span>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <p className="text-xs sm:text-sm font-bold text-pink-300 mb-1">Kode Kompetisi:</p>
                                    <ul className="text-xs sm:text-sm text-white/90 grid grid-cols-2 gap-x-4 list-none pl-0">
                                        <li><span className="font-bold text-pink-100">01</span> : HackToday</li>
                                        <li><span className="font-bold text-pink-100">02</span> : GameToday</li>
                                        <li><span className="font-bold text-pink-100">03</span> : UXToday</li>
                                        <li><span className="font-bold text-pink-100">04</span> : Minetoday</li>
                                    </ul>
                                </div>
                                <div className="mb-3">
                                    <p className="text-xs sm:text-sm text-white/90 mb-1">
                                        <b className="text-pink-100">Harga Batch 1:</b> Rp 80.000<br />
                                        <b className="text-pink-100">Harga Batch 2:</b> Rp 100.000
                                    </p>
                                </div>
                                <div className="bg-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white/80 italic shadow-inner">
                                    <span className="font-bold text-pink-100">Contoh:</span> Ryan harus bayar sebanyak <span className="font-bold text-pink-100">80.000</span> rupiah jika Ryan ingin ikut <span className="font-bold text-pink-100">GameToday</span> pada Batch 1. Ryan harus transfer <span className="font-bold text-pink-100">80.002</span> Rupiah ke Althaf Faiz Rafianto.
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {/* Upload Bukti Pembayaran */}
                            <div>
                                <label className="block text-xs sm:text-sm font-medium mb-2">
                                    Upload Bukti Pembayaran
                                    <span className="text-xs text-gray-400 ml-1">(JPG/PNG, maks 2MB)</span>
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
                                        accept=".jpg,.jpeg,.png"
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

    // Fungsi untuk memproses data kompetisi dan status verifikasi
    const processCompetitionsData = (data, currentUserName = null, isCurrentUserDataComplete = false) => {
        const processedCompetitions = {};

        Object.entries(data).forEach(([key, comp]) => {
            // Simpan ID tim yang sudah upload untuk persistensi
            const teamID = comp.teamID;

            // Tambahkan local storage untuk menyimpan tim yang sudah upload
            const uploadedTeams = JSON.parse(localStorage.getItem('uploadedTeams') || '{}');

            // Cek status verifikasi dari berbagai sumber
            const isVerified = comp.is_verified || comp.isVerified;
            
            // Check if user upload payment proof through API through payment_proof_id
            const hasPaymentProof = Boolean(comp.paymentProofID);

            // Tim menunggu verifikasi jika:
            // 1. Belum terverifikasi, dan
            // 2. Sudah upload bukti pembayaran melalui API ATAU tercatat di localStorage
            const isPendingVerification = !isVerified && hasPaymentProof;

            let updatedMembers = [];

            // Jika members adalah object (bukan array)
            if (comp.members && typeof comp.members === 'object' && !Array.isArray(comp.members)) {
                // Convert object ke array
                updatedMembers = Object.entries(comp.members).map(([memberId, member]) => {
                    // Jika ini adalah pengguna saat ini, gunakan status dari getCurrentUser
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
            }
            // Jika members adalah array
            else if (Array.isArray(comp.members)) {
                updatedMembers = comp.members.map(member => {
                    // Jika ini adalah pengguna saat ini, gunakan status dari getCurrentUser
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

    // Fungsi untuk memperbarui data kompetisi
    const refreshCompetitionData = async () => {
        try {
            setLoading(true);
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
        } finally {
            setLoading(false);
        }
    };

    // Efek untuk mengambil data awal dan menyiapkan interval refresh
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userResponse, competitionsResponse] = await Promise.all([
                    getCurrentUser(),
                    getUserCompetitions()
                ]);
                
                if (userResponse.success && userResponse.data) {
                    const userData = userResponse.data;
                    const fullName = userData.full_name || userData.name || "User";
                    
                    // Gunakan is_registration_complete yang sudah dikonfirmasi berfungsi
                    const isUserDataComplete = userData.is_registration_complete || false;

                    setUserData({
                        name: fullName,
                        isRegistrationComplete: isUserDataComplete
                    });
                    setCurrentUser(fullName);

                    if (competitionsResponse.success && competitionsResponse.data) {
                        const processedData = processCompetitionsData(
                            competitionsResponse.data,
                            fullName,
                            isUserDataComplete
                        );
                        setCompetitions(processedData);
                    }
                } else {
                    setUserData({ name: "User", isRegistrationComplete: false });
                    setCurrentUser("User");

                    if (competitionsResponse.success && competitionsResponse.data) {
                        setCompetitions(processCompetitionsData(competitionsResponse.data));
                    }
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

        // Refresh setiap 20 detik untuk memeriksa status verifikasi
        const refreshInterval = setInterval(refreshCompetitionData, 20000);

        return () => clearInterval(refreshInterval);
    }, []);

    // Handle verifikasi dan upload bukti pembayaran
    const handleVerify = async (compKey, pembayaran) => {
        try {
            setLoading(true);

            let teamID = competitions[compKey]?.teamID;
            if (!teamID) {
                return { success: false, message: "ID Tim tidak ditemukan" };
            }

            // Convert to string if it's not already
            teamID = String(teamID);

            // Validasi file
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(pembayaran.type)) {
                return {
                    success: false,
                    message: "Format file tidak didukung. Gunakan JPG atau PNG"
                };
            }

            // Maximum file size (2MB)
            const maxSize = 2 * 1024 * 1024; // 2MB
            if (pembayaran.size > maxSize) {
                return {
                    success: false,
                    message: "Ukuran file terlalu besar. Maksimum 2MB."
                };
            }

            // Persiapkan data untuk dikirim
            const formData = new FormData();
            formData.append("team_id", teamID);

            // Normalisasi nama file
            const safeFileName = pembayaran.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const safeFile = new File([pembayaran], safeFileName, { type: pembayaran.type });
            formData.append("image", safeFile);

            // Kirim data ke API
            const result = await postCompePayment(formData);

            if (result.success) {
                // Simpan tim ke localStorage agar status tidak hilang
                try {
                    const uploadedTeams = JSON.parse(localStorage.getItem('uploadedTeams') || '{}');
                    uploadedTeams[teamID] = true;
                    localStorage.setItem('uploadedTeams', JSON.stringify(uploadedTeams));
                } catch (e) {
                    console.error("Error saving to localStorage:", e);
                }

                // Segera update UI untuk menampilkan "Menunggu Verifikasi"
                setCompetitions(prevCompetitions => {
                    const updated = { ...prevCompetitions };
                    if (updated[compKey]) {
                        updated[compKey] = {
                            ...updated[compKey],
                            pendingVerification: true
                        };
                    }
                    return updated;
                });

                // Delay refresh lebih lama untuk memberi waktu server memproses
                setTimeout(refreshCompetitionData, 5000);
                return result;
            } else {
                // Jika API gagal, kembalikan error yang lebih spesifik
                return {
                    success: false,
                    message: result.message || "Gagal mengunggah bukti pembayaran. Silakan coba lagi."
                };
            }

        } catch (error) {
            console.error("Error during verification:", error);
            
            // Handle network errors
            if (error.name === 'NetworkError' || !navigator.onLine) {
                return {
                    success: false,
                    message: "Koneksi internet bermasalah. Silakan cek koneksi dan coba lagi."
                };
            }
            
            // Handle timeout errors
            if (error.name === 'TimeoutError' || error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: "Waktu upload habis. Silakan coba lagi."
                };
            }
            
            return {
                success: false,
                message: error.message || "Terjadi kesalahan saat mengunggah bukti pembayaran"
            };
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
