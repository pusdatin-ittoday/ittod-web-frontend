import React, { useState, useRef } from "react"; // Import useRef
import { useNavigate } from "react-router-dom";
import { FaList, FaUser, FaUpload, FaImage, FaReceipt } from "react-icons/fa"; // Import FaImage, FaReceipt
import { MdErrorOutline } from "react-icons/md";

const CompList = ({ name, currentUser, competitions = {}, onVerify, onEditUser }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [twibbon, setTwibbon] = useState(null);
    const [pembayaran, setPembayaran] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    // Refs for file inputs
    const twibbonInputRef = useRef(null);
    const pembayaranInputRef = useRef(null);

    const handleVerifyClick = (compKey, anggotaIdx) => {
        // Reset file states when opening modal for a fresh upload attempt
        setTwibbon(null);
        setPembayaran(null);
        if (twibbonInputRef.current) twibbonInputRef.current.value = "";
        if (pembayaranInputRef.current) pembayaranInputRef.current.value = "";
        setShowUploadModal(true);
    };

    const handleUploadSubmit = () => {
        if (!twibbon || !pembayaran) {
            setAlertMessage("Harap upload twibbon dan bukti pembayaran");
            setShowAlert(true);
            return;
        }

        if (onVerify) {
            onVerify(twibbon, pembayaran); 
        }

        // Reset form dan tutup modal
        setTwibbon(null);
        setPembayaran(null);
        setShowUploadModal(false);
    };


    const handleEditUserClick = () => {
        // Cek apakah user sudah verifikasi (artinya verified === true)
        const isVerified = Object.values(competitions).some(comp =>
            comp.anggota.some(member =>
                member.nama === currentUser && member.verified
            )
        );

        if (!isVerified) {
            // Alert: belum verifikasi
            setAlertMessage("Verifikasi terlebih dahulu");
            setShowAlert(true);
            return;
        }

        // Udah verified, baru navigate (alert muncul setelah redirect)
        if (onEditUser) {
            onEditUser(); // ⬅️ ini yang trigger `navigate("/edit-profile")`
            // alertMessage "Lengkapi data" ditunda sampe navigate selesai
            setTimeout(() => {
                setAlertMessage("Lengkapi data");
                setShowAlert(true);
            }, 500); // kasih delay dikit biar muncul setelah redirect
        }
    };


    const renderCompetition = (key, data) => (
        <div key={key} className="mb-6 pb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-4 py-3 text-white hover:scale-101 hover:bg-white/20 transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-1">{data.jenisLomba}</h3>
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
                        {anggota.verified ? "✓ Verified" : "✗ Not Verified"}
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

    return (
        <div className="max-w-full lg:w-[650px] font-dm-sans p-6 bg-[#7b446c] rounded-lg shadow-md h-[500px] flex flex-col">
            <div className="border-b border-[#dfb4d7]/60 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-5">
                        <FaUser className="text-2xl text-white" />
                        <h2 className="text-3xl font-bold text-white tracking-wide transform transition duration-500 hover:scale-105">
                            Halo, {name}!
                        </h2>
                    </div>

                    {/* Tombol Verify & Edit Data */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => {
                                const unverifiedFound = Object.entries(competitions).some(([key, comp]) =>
                                    comp.anggota.some((member) => member.nama === currentUser && !member.verified)
                                );

                                if (!unverifiedFound) {
                                    setAlertMessage("Kamu sudah terverifikasi di semua lomba!");
                                    setShowAlert(true);
                                    return;
                                }

                                const exampleComp = Object.entries(competitions).find(([key, comp]) =>
                                    comp.anggota.some((member) => member.nama === currentUser && !member.verified)
                                );

                                if (exampleComp) {
                                    const [compKey, compData] = exampleComp;
                                    const idx = compData.anggota.findIndex((m) => m.nama === currentUser);
                                    handleVerifyClick(compKey, idx);
                                }
                            }}
                            className="cursor-pointer custom-button-bg px-3 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
                        >
                            <FaUpload className="inline mr-1" /> Verify
                        </button>

                        <button
                            onClick={handleEditUserClick}
                            className="cursor-pointer custom-button-bg px-3 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
                        >
                            Edit Data
                        </button>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white"> {/* Ensured text-white for h3 */}
                <FaList className="text-xl" /> Competition List
            </h3>

            <div className="overflow-y-auto flex-1 px-4 py-2 custom-scrollbar">
                {Object.entries(competitions).map(([key, data]) => renderCompetition(key, data))}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-[#7b446c]/95 border border-white/30 p-6 rounded-lg w-full max-w-md text-white">
                        <h3 className="text-xl font-bold mb-2 text-center">Upload Verification Files</h3>
                        <p className="text-sm mb-6 text-center text-gray-300"> {/* Ensured text-gray-300 for subtext */}
                            Mohon unggah bukti twibbon and pembayaran untuk verifikasi.
                        </p>

                        {/* Original space-y-4 for direct children of this div */}
                        <div className="space-y-4">
                            {/* Twibbon Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2"> {/* Label styling from previous good version */}
                                    Upload Twibbon
                                    <span className="text-xs text-gray-400 ml-1">(JPG/PNG, max 2MB)</span>
                                </label>
                                <div
                                    className="border-2 border-dashed border-pink-400 rounded-md p-4 text-center bg-white/10 hover:bg-white/20 transition duration-300 hover:scale-105 cursor-pointer w-full min-h-[80px] flex flex-col items-center justify-center gap-1 relative group"
                                    onClick={() => twibbonInputRef.current?.click()}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                            const file = e.dataTransfer.files[0];
                                            if (file.size > 2 * 1024 * 1024) {
                                                setAlertMessage("Ukuran file Twibbon maksimal 2MB.");
                                                setShowAlert(true);
                                                setTwibbon(null);
                                                if (twibbonInputRef.current) twibbonInputRef.current.value = "";
                                            } else {
                                                setTwibbon(file);
                                            }
                                        }
                                    }}
                                >
                                    <FaImage className={`text-2xl mb-1 ${twibbon ? 'text-green-400' : 'text-pink-300 group-hover:text-pink-200'}`} />
                                    <span className="truncate text-xs w-full px-2">
                                        {twibbon ? twibbon.name : "Drop file or click to select"}
                                    </span>
                                    <input
                                        type="file"
                                        ref={twibbonInputRef}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                if (file.size > 2 * 1024 * 1024) {
                                                    setAlertMessage("Ukuran file Twibbon maksimal 2MB.");
                                                    setShowAlert(true);
                                                    setTwibbon(null);
                                                    e.target.value = ""; // Reset file input
                                                } else {
                                                    setTwibbon(file);
                                                }
                                            }
                                        }}
                                        accept=".jpg,.jpeg,.png"
                                        style={{ display: "none" }}
                                    />
                                    {/* Original checkmark styling was: text-green-400 text-xs. Changed to text-lg for visibility with absolute positioning. */}
                                    {twibbon && <span className="absolute top-1 right-1 text-green-400 text-lg">✓</span>}
                                </div>
                            </div>

                            {/* Payment Proof Upload */}
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

                        {/* Original mt-6 for buttons */}
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="flex-1 py-2 text-black bg-gray-300 rounded hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                className="flex-1 py-2 custom-button-bg button-hover transition duration-300 ease-in-out hover:scale-105 rounded-lg"
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
    const [competitions, setCompetitions] = useState({
        hackToday: {
            jenisLomba: "HackToday",
            teamID: "HT2025-001",
            teamName: "CyberBoys",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ani", verified: false },
            ],
        },
        gameToday: {
            jenisLomba: "GameToday",
            teamID: "GT2025-009",
            teamName: "NoobHunter",
            anggota: [
                { nama: "Dodi", verified: true },
                { nama: "Eka", verified: true },
            ],
        },
        mineToday: {
            jenisLomba: "MineToday",
            teamID: "MT2025-777",
            teamName: "BlockBusters",
            anggota: [
                { nama: "Ali", verified: false },
                { nama: "Tina", verified: false },
            ],
        },
        uxToday: {
            jenisLomba: "UXToday",
            teamID: "UXX-03",
            teamName: "PixelPeepers",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ika", verified: true },
            ],
        },
    });

    const currentUser = "Budi";
    const navigate = useNavigate();

    const handleVerify = (twibbon, pembayaran) => {
        console.log("Twibbon:", twibbon.name);
        console.log("Pembayaran:", pembayaran.name);

        // Loop semua lomba dan anggotanya
        setCompetitions(prevCompetitions => {
            const updated = { ...prevCompetitions };

            for (const compKey in updated) {
                updated[compKey].anggota = updated[compKey].anggota.map((member) =>
                    member.nama === currentUser ? { ...member, verified: true } : member
                );
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
                name="Budi"
                currentUser={currentUser}
                competitions={competitions}
                onVerify={handleVerify}
                onEditUser={handleEditUser}
            />
        </div>
    );
};

export default CompListPage;