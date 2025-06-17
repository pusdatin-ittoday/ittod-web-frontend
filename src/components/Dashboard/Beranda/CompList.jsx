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
    const [verifyWaitingText, setVerifyWaitingText] = useState("Menunggu Verifikasi");
    
    // Refs for file inputs
    const pembayaranInputRef = useRef(null);

    const handleVerifyClick = (compKey) => {
        // Reset file states when opening modal for a fresh upload attempt
        setPembayaran(null);
        if (pembayaranInputRef.current) pembayaranInputRef.current.value = "";
        setCurrentCompKey(compKey);
        setShowUploadModal(true);
    };

    // Jadikan async agar bisa menunggu hasil onVerify
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
                
                // Even though there's a server error, let's set pendingVerification state
                // This is a temporary workaround to fix the UI issue while backend is fixed
                if (result?.serverError && result.serverError.includes("prisma")) {
                    // Close the modal even with server error, as data was likely received
                    setPembayaran(null);
                    setShowUploadModal(false);
                    setCurrentCompKey(null);
                    
                    // Manually update local state
                    setCompetitions(prevCompetitions => {
                        const updated = { ...prevCompetitions };
                        if (updated[currentCompKey]) {
                            updated[currentCompKey] = {
                                ...updated[currentCompKey],
                                members: updated[currentCompKey].members.map(member =>
                                    member.fullName === currentUser
                                        ? { ...member, pendingVerification: true }
                                        : member
                                )
                            };
                        }
                        return updated;
                    });
                }
            }
        }
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
        // Check if current user is the team leader (first member)
        const isTeamLeader = data.members[0]?.fullName === currentUser;
        
        // Check verification status at team level
        const isTeamVerified = data.isVerified;
        const isPendingVerification = data.pendingVerification;
        
        // Only team leader can upload payment proof if team isn't verified
        const needsVerification = isTeamLeader && !isTeamVerified && !isPendingVerification;

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

                    {/* Verification status display with improved logic */}
                    <div className="flex-shrink-0">
                        {needsVerification && (
                            <button
                                onClick={() => handleVerifyClick(key)}
                                className="custom-button-bg px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm button-hover transition duration-300 hover:scale-105 w-full sm:w-auto"
                            >
                                <FaUpload className="inline mr-1" /> Verifikasi
                            </button>
                        )}
                        {isPendingVerification && (
                            <span className="px-3 py-1 rounded bg-yellow-400/20 text-yellow-300 text-xs sm:text-sm font-semibold flex items-center transition-all duration-300">
                                <span className="animate-pulse mr-1">⌛</span> 
                                {verifyWaitingText}
                            </span>
                        )}
                        {isTeamVerified && (
                            <span className="px-3 py-1 rounded bg-green-400/20 text-green-300 text-xs sm:text-sm font-semibold">
                                <span className="mr-1">✓</span> Sudah Diverifikasi
                            </span>
                        )}
                    </div>
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
                                {anggota.isRegistrationComplete ? "✓ Data Lengkap" : "✗ Data Belum Lengkap"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Team status */}
                <div className="mt-3 pt-2 border-t border-white/20">
                    <p className="text-xs sm:text-sm font-semibold">
                        Team Status:{" "}
                        <span className={isTeamVerified ? "text-green-400/90" : "text-red-400/90"}>
                            {isTeamVerified ? "Verified" : "Not Verified"}
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

    // Add this function to refresh competition data
    const refreshCompetitionData = async () => {
        try {
            setLoading(true);
            const competitionsResponse = await getUserCompetitions();
            
            // Log response untuk debugging
            console.log("API response:", competitionsResponse);
            
            if (competitionsResponse.success && competitionsResponse.data) {
                const processedCompetitions = {};
                
                Object.entries(competitionsResponse.data).forEach(([key, comp]) => {
                    // Log untuk memeriksa struktur data kompetisi
                    console.log(`Team ${comp.teamName} data:`, comp);
                    
                    // Cek apakah tim sudah terverifikasi
                    const isVerified = comp.isVerified;
                    
                    // Cek apakah tim sudah mengupload bukti pembayaran
                    // Periksa semua kemungkinan nama field untuk bukti pembayaran
                    const hasPaymentProof = comp.payment_proof_id 
                    
                    // Tim menunggu verifikasi jika sudah upload bukti tapi belum diverifikasi
                    const isPendingVerification = !isVerified && hasPaymentProof;
                    
                    console.log(`Team ${comp.teamName} verification status:`, {
                        isVerified, 
                        hasPaymentProof, 
                        isPendingVerification
                    });
                    
                    processedCompetitions[key] = {
                        ...comp,
                        pendingVerification: isPendingVerification
                    };
                });
                
                setCompetitions(processedCompetitions);
            }
        } catch (error) {
            console.error("Error refreshing competition data:", error);
        } finally {
            setLoading(false);
        }
    };

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
                    console.log("Initial competitions data:", competitionsResponse.data);
                    
                    const processedCompetitions = {};
                    
                    Object.entries(competitionsResponse.data).forEach(([key, comp]) => {
                        // PENTING: Gunakan logika yang sama dengan refreshCompetitionData
                        // untuk menghindari inkonsistensi
                        const isVerified = comp.isVerified;
                        
                        // Cek status pembayaran dengan cara yang sama
                        const hasPaymentProof = 
                            comp.payment_proof_id || 
                            comp.paymentProofId || 
                            comp.payment_status === 'PENDING' || 
                            comp.paymentStatus === 'PENDING';
                        
                        const isPendingVerification = !isVerified && hasPaymentProof;
                        
                        processedCompetitions[key] = {
                            ...comp,
                            pendingVerification: isPendingVerification
                        };
                    });
                    
                    setCompetitions(processedCompetitions);
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

    const handleVerify = async (compKey, pembayaran) => {
        try {
            setLoading(true);
            
            // Validate and format team_id
            let teamID = competitions[compKey]?.teamID;
            if (!teamID) {
                console.error("Missing team ID");
                return { success: false, message: "ID Tim tidak ditemukan" };
            }
            
            // Log the full competition object to see what we're working with
            console.log("Competition data:", competitions[compKey]);
            
            // Convert to string if it's not already (some APIs expect string)
            teamID = String(teamID);

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            if (!validTypes.includes(pembayaran.type)) {
                return { 
                    success: false, 
                    message: "Format file tidak didukung. Gunakan JPG atau PNG." 
                };
            }
            
            // Maximum file size (5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (pembayaran.size > maxSize) {
                return { 
                    success: false, 
                    message: "Ukuran file terlalu besar. Maksimum 5MB." 
                };
            }

            const formData = new FormData();
            formData.append("team_id", teamID);
            
            // Some servers are sensitive to file names - try with a safer name
            const safeFileName = pembayaran.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const safeFile = new File([pembayaran], safeFileName, { type: pembayaran.type });
            formData.append("image", safeFile);
            
            // Log what we're sending
            console.log("Sending payment verification:", {
                team_id: teamID,
                file_name: safeFileName,
                file_type: pembayaran.type,
                file_size: `${(pembayaran.size / 1024 / 1024).toFixed(2)}MB`
            });

            const result = await postCompePayment(formData);
            console.log("Upload payment result:", result);

            if (result.success) {
                // Segera update UI untuk menampilkan "Menunggu Verifikasi" tanpa menunggu refresh
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
                
                // Refresh data dari server setelah beberapa saat
                setTimeout(refreshCompetitionData, 2000);
                return result;
            }
            
            return result;
        } catch (error) {
            console.error("Error during verification:", error);
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
