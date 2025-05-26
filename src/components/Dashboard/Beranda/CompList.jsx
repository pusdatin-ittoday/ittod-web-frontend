import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaList, FaUser, FaUpload, FaImage, FaReceipt } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { getCurrentUser, getUserCompetitions } from "../../../api/user"; // Update imports to include getUserCompetitions

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

    const filteredCompetitions = Object.entries(competitions).filter(
        ([key, data]) => data.anggota.some(member => member.nama === currentUser)
    );


    const renderCompetition = (key, data) => {
        // Check if current user is in this competition and needs verification
        const currentMember = data.anggota.find(member => member.nama === currentUser);
        const needsVerification = currentMember && !currentMember.verified;

        return (
            <div key={key} className="mb-6 pb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-4 py-3 text-white hover:scale-101 hover:bg-white/20 transition duration-300 ease-in-out">
                <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold mb-1">{data.jenisLomba}</h3>

                    {/* Verification button inside each card */}
                    {needsVerification && (
                        <button
                            onClick={() => handleVerifyClick(key)}
                            className="custom-button-bg px-2 py-1 rounded text-sm button-hover transition duration-300 hover:scale-105"
                        >
                            <FaUpload className="inline mr-1" /> Verify
                        </button>
                    )}
                </div>

                <p className="text-sm mb-1">
                    <span className="font-semibold">Team Name:</span> {data.teamName || "-"}
                </p>
                <p className="text-sm mb-3">
                    <span className="font-semibold">Team ID:</span> {data.teamID || "-"}
                </p>

                {data.anggota.map((anggota, idx) => (
                    <div key={idx} className="flex items-center gap-4 mb-1">
                        <p className="flex-1">
                            {idx === 0 ? "👑 Ketua" : "👤 Anggota"}:{" "}
                            <span className={anggota.nama === currentUser ? "font-bold text-white" : ""}>
                                {anggota.nama}
                            </span>
                        </p>

                        <span className={`font-bold ${anggota.verified ? "text-green-400/90" : "text-red-400/90"}`}>
                            {anggota.verified ? "Verified" : "Not Verified"}
                        </span>
                    </div>
                ))}

                <p className="mt-2 font-semibold">
                    Team Status:{" "}
                    <span className={data.anggota.every((a) => a.verified) ? "text-green-400/90" : "text-red-400/90"}>
                        {data.anggota.every((a) => a.verified) ? "Verified" : "Not Verified"}
                    </span>
                </p>
            </div>
        );
    };

    return (
        <div className="max-w-full lg:w-[650px] font-dm-sans p-6 bg-[#7b446c] rounded-lg shadow-md h-[500px] flex flex-col">
            {/* Header section remains the same */}
            <div className="border-b border-[#dfb4d7]/60 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-5">
                        <FaUser className="text-2xl text-white" />
                        <h2 className="text-2xl font-bold text-white tracking-wide transform transition duration-500 hover:scale-105">
                            Halo, {name}!
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleEditUserClick}
                            className="cursor-pointer custom-button-bg px-3 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
                        >
                            Edit Data
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
                <FaList className="text-xl" /> My Competitions
            </h3>

            <div className="overflow-y-auto flex-1 px-4 py-2 custom-scrollbar">
                {filteredCompetitions.length > 0 ? (
                    filteredCompetitions.map(([key, data]) => renderCompetition(key, data))
                ) : (
                    <div className="text-center text-white/70 py-8">
                        <p>Kamu belum ikut kompetisi apapun.</p>
                    </div>
                )}
            </div>

            {/* Upload Modal - unchanged */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#7b446c]/95 border border-white/30 p-6 rounded-lg w-full max-w-md text-white">
                        <h3 className="text-xl font-bold mb-2 text-center">Upload Verification Files</h3>
                        <p className="text-sm mb-6 text-center text-gray-300">
                            Mohon unggah  pembayaran untuk verifikasi tim kamu.
                        </p>

                        <div className="space-y-4">
                            {/* Payment Proof Upload - unchanged */}
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Upload Bukti Pembayaran
                                    <span className="text-xs text-gray-400 ml-1">(JPG/PNG/PDF, max 2MB)</span>
                                </label>
                                <div
                                    className="border-2 border-dashed border-pink-400 rounded-md p-4 text-center bg-white/10 hover:bg-white/20 cursor-pointer w-full min-h-[80px] flex flex-col items-center justify-center gap-1 relative group transition duration-300 hover:scale-105"
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
                                    <FaReceipt className={`text-2xl mb-1 ${pembayaran ? 'text-green-400' : 'text-pink-300 group-hover:text-pink-200'}`} />
                                    <span className="truncate text-xs w-full px-2">
                                        {pembayaran ? pembayaran.name : "Drop file or click to select"}
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
                                                    e.target.value = ""; // Reset file input
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

                        {/* Buttons - unchanged */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="cursor-pointer flex-1 py-2 text-black bg-gray-300 rounded hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                className="cursor-pointer flex-1 py-2 custom-button-bg button-hover transition duration-300 ease-in-out hover:scale-105 rounded-lg"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert - unchanged */}
            {showAlert && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#7b446c]/95 border border-white/30 p-4 rounded-lg max-w-xs w-full text-white shadow-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <MdErrorOutline className="text-xl text-red-400" />
                            <h3 className="text-lg font-semibold">{alertMessage}</h3>
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


// Komponen CompListPage DIKEMBALIKAN KE VERSI ASLI ANDA
const CompListPage = () => {
    // Initialize competitions state properly
    const [competitions, setCompetitions] = useState({});
    const [userData, setUserData] = useState({ name: "" });
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState("User");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch both user profile and competitions in parallel
                const [userResponse, competitionsResponse] = await Promise.all([
                    getCurrentUser(),
                    getUserCompetitions()
                ]);
                
                // Process user data
                if (userResponse.success && userResponse.data) {
                    const fullName = userResponse.data.full_name || userResponse.data.name || "User";
                    setUserData({ name: fullName });
                    setCurrentUser(fullName);
                }
                
                // Process competitions data
                if (competitionsResponse.success && competitionsResponse.data) {
                    setCompetitions(competitionsResponse.data);
                } else {
                    console.error("Failed to fetch competitions:", competitionsResponse.error);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleVerify = (compKey, pembayaran) => {
        console.log("Verifying for competition:", compKey);
        console.log("Pembayaran:", pembayaran.name);

        // Update verification status in competitions
        setCompetitions(prevCompetitions => {
            const updated = { ...prevCompetitions };
            if (updated[compKey]) {
                updated[compKey] = {
                    ...updated[compKey],
                    anggota: updated[compKey].anggota.map(member =>
                        member.nama === currentUser ? { ...member, verified: true } : member
                    )
                };
            }
            return updated;
        });
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