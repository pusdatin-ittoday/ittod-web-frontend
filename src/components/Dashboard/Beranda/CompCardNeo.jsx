import React, { useState, useRef } from "react";
import { FaUpload, FaReceipt, FaWhatsapp } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { MdErrorOutline } from "react-icons/md";

const CompCardNeo = ({ compKey, data, currentUser, onVerify }) => {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [pembayaran, setPembayaran] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [loadingUpload, setLoadingUpload] = useState(false);

    const pembayaranInputRef = useRef(null);

    const isIndividual = data.participationType === "individual";
    const membersArray = Array.isArray(data.members)
        ? data.members
        : Object.values(data.members || {});

    const isTeamLeader = membersArray[0]?.fullName === currentUser;

    const isTeamVerified = data.isVerified === true || data.isVerified === 'approved';
    const isDocumentVerified = data.isDocumentVerified === "approved";
    const isPendingVerification = data.pendingVerification;
    const hasTeamError = Boolean(data.verificationError && data.verificationError.trim() !== "");

    const membersWithErrors = membersArray.filter(m => m.verificationError && m.verificationError.trim() !== "");

    const hasTeamDocumentError = hasTeamError && !isDocumentVerified;
    const hasDocumentError = hasTeamDocumentError || membersWithErrors.length > 0;

    const documentErrorReason = hasDocumentError ?
        (hasTeamDocumentError ? data.verificationError.trim() : (membersWithErrors[0]?.verificationError || "Berkas ditolak")) :
        null;

    const hasTransactionError = hasTeamError && isDocumentVerified;
    const isRejected = hasTransactionError || hasDocumentError;

    const showPendingVerification = isDocumentVerified && isPendingVerification && !isRejected && !hasDocumentError;

    const needsVerification = isTeamLeader && isDocumentVerified && !isTeamVerified && !isPendingVerification && !hasTransactionError && !hasDocumentError;

    const linkWhatsapp = {
        gameToday: "https://chat.whatsapp.com/DZ7vHHwgC6J6SLgJmTD949?mode=r_c",
        uxToday: "https://chat.whatsapp.com/JVZ8EXWwCwf0YUdhxJYuEx",
        hackToday: "https://chat.whatsapp.com/IXSPAbcNk3hJUEafPUWMAS?mode=ac_t",
        mineToday: "https://chat.whatsapp.com/HBZ8a4VbYbi4v08b2t45h7?mode=r_c",
    };

    const competitionNameToKey = {
        "GameToday": "gameToday",
        "UXToday": "uxToday",
        "HackToday": "hackToday",
        "MineToday": "mineToday",
    };

    const handleWhatsappClick = () => {
        const key = competitionNameToKey[data.competitionName];
        if (!key || !linkWhatsapp[key]) {
            alert("Grup Whatsapp tidak ditemukan untuk kompetisi ini.");
            return;
        }
        window.open(linkWhatsapp[key], "_blank");
    };

    const handleVerifyClick = () => {
        setPembayaran(null);
        if (pembayaranInputRef.current) pembayaranInputRef.current.value = "";
        setShowUploadModal(true);
    };

    const handleUploadSubmit = async () => {
        if (!pembayaran) {
            setAlertMessage("Harap upload bukti pembayaran");
            setShowAlert(true);
            return;
        }

        setLoadingUpload(true);
        if (onVerify) {
            const result = await onVerify(compKey, pembayaran);
            if (result && result.success) {
                setPembayaran(null);
                setShowUploadModal(false);
            } else {
                setAlertMessage(result?.message || "Gagal upload bukti pembayaran. Coba lagi.");
                setShowAlert(true);
            }
        }
        setLoadingUpload(false);
    };

    return (
        <div className="w-full border-[4px] border-[#191b1a] bg-white p-4 sm:p-5 shadow-[6px_6px_0_#191b1a] flex flex-col gap-4">

            {/* Top row: Info & Status Badge */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-1">
                    <h3 className="text-xl sm:text-2xl font-black uppercase text-[#34399F] tracking-tight">
                        {data.competitionName}
                    </h3>

                    <div className="space-y-0.5 text-xs font-semibold text-gray-700">
                        {!isIndividual && (
                            <p className="flex items-center gap-2">
                                <span className="opacity-55 w-20">Team Name:</span>
                                <span>{data.teamName || "-"}</span>
                            </p>
                        )}
                        <p className="flex items-center gap-2">
                            <span className="opacity-55 w-20">
                                {isIndividual ? "Reg. Code:" : "Join Code:"}
                            </span>
                            <span className="font-mono bg-[#f0f0f0] border border-gray-300 px-2 py-0.5 text-[10px]">
                                {data.teamJoinCode || "-"}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Status Badges & WA Group */}
                <div className="flex flex-row sm:flex-col lg:flex-row items-stretch sm:items-end lg:items-center gap-2 w-full sm:w-auto">
                    {/* Sudah Terverifikasi */}
                    {isTeamVerified && (
                        <>
                            <button
                                onClick={handleWhatsappClick}
                                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-[3px] border-[#191b1a] bg-[#25D366] px-3 py-2 text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                <FaWhatsapp className="text-sm" />
                                WA Group
                            </button>
                            <div className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-[3px] border-[#191b1a] bg-[#4ADE80] px-3 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a]">
                                <RiVerifiedBadgeFill className="text-sm" />
                                Verified
                            </div>
                        </>
                    )}

                    {/* Menunggu Verifikasi */}
                    {showPendingVerification && (
                        <div className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-[3px] border-[#191b1a] bg-[#FCD400] px-3 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a]">
                            <span className="animate-spin text-xs">⌛</span>
                            Pending Verif
                        </div>
                    )}

                    {/* Belum Terverifikasi */}
                    {!isTeamVerified && !showPendingVerification && !isRejected && (
                        <div className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-[3px] border-[#191b1a] bg-[#ff8c75] px-3 py-2 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a]">
                            <MdErrorOutline className="text-sm" />
                            Unverified
                        </div>
                    )}

                    {/* Ditolak (Rejected) */}
                    {isRejected && (
                        <div className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 border-[3px] border-[#191b1a] bg-[#ef4444] px-3 py-2 text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a]">
                            <MdErrorOutline className="text-sm" />
                            Rejected
                        </div>
                    )}
                </div>
            </div>

            {/* Error message / Rejection feedback */}
            {isRejected && (
                <div className="border-[3px] border-[#191b1a] bg-[#fef2f2] p-3 text-xs font-bold text-red-700 shadow-[4px_4px_0_#191b1a]">
                    <span className="font-extrabold uppercase text-red-800">Alasan Penolakan:</span>{" "}
                    {documentErrorReason || data.verificationError || "Berkas / bukti pembayaran tidak valid"}
                </div>
            )}

            {/* Members Section */}
            <div className="border-[3px] border-[#191b1a] bg-[#EEEEEE] p-2.5 sm:p-3 flex flex-col gap-2">
                {membersArray.map((anggota, idx) => {
                    const hasMemberError = anggota.verificationError && anggota.verificationError.trim() !== "";
                    const isApproved = isDocumentVerified && !hasMemberError;

                    return (
                        <div
                            key={idx}
                            className={`flex items-center justify-between gap-3 p-2 bg-white border-2 border-[#191b1a] ${idx === 0 ? "border-l-[5px] border-l-[#FCD400]" : ""
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-base">{idx === 0 ? "👑" : "👤"}</span>
                                <div className="text-xs font-bold">
                                    <span className="opacity-55 mr-1">
                                        {isIndividual ? "Peserta:" : (idx === 0 ? "Ketua:" : "Anggota:")}
                                    </span>
                                    <span className={anggota.fullName === currentUser ? "text-[#34399F]" : ""}>
                                        {anggota.fullName}
                                    </span>
                                </div>
                            </div>

                            {/* Status Label */}
                            <div>
                                {hasMemberError ? (
                                    <div className="border border-black bg-red-100 text-red-700 px-2 py-0.5 text-[10px] font-black uppercase">
                                        Rejected
                                    </div>
                                ) : isApproved ? (
                                    <div className="border border-black bg-green-100 text-green-700 px-2 py-0.5 text-[10px] font-black uppercase">
                                        Approved
                                    </div>
                                ) : (
                                    <div className="border border-black bg-yellow-100 text-yellow-700 px-2 py-0.5 text-[10px] font-black uppercase">
                                        Pending
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Banners & Upload Actions */}
            <div className="mt-1">
                {/* 1. Document not verified yet */}
                {!isDocumentVerified && (
                    <div className="border-[3px] border-[#191b1a] bg-[#fffbeb] p-3 text-xs font-bold text-amber-700 shadow-[4px_4px_0_#191b1a] flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Lengkapi berkas agar panitia dapat memverifikasi tim Anda dan membuka menu pembayaran.</span>
                    </div>
                )}

                {/* 2. Team member reminder */}
                {!isTeamLeader && isDocumentVerified && !isTeamVerified && !isPendingVerification && !isRejected && (
                    <div className="border-[3px] border-[#191b1a] bg-[#fffbeb] p-3 text-xs font-bold text-amber-700 shadow-[4px_4px_0_#191b1a] flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Ingatkan ketua tim Anda untuk mengunggah bukti pembayaran agar pendaftaran selesai.</span>
                    </div>
                )}

                {/* 3. Transaction Rejected */}
                {isRejected && !hasDocumentError && isTeamLeader && (
                    <div className="border-[3px] border-[#191b1a] bg-[#fef2f2] p-3 text-xs font-bold text-red-700 shadow-[4px_4px_0_#191b1a] flex items-center gap-2 mb-3">
                        <span>⚠️</span>
                        <span>Silakan unggah kembali bukti pembayaran yang valid di bawah ini.</span>
                    </div>
                )}

                {/* 4. Action Button */}
                {(needsVerification || (isRejected && !hasDocumentError && isTeamLeader)) && (
                    <button
                        onClick={handleVerifyClick}
                        className="w-full border-[3px] border-[#191b1a] bg-[#34399F] px-4 py-3 text-center text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <FaUpload className="inline mr-2 text-xs" />
                        {isRejected ? "Upload Ulang Bukti Pembayaran" : "Upload Bukti Pembayaran"}
                    </button>
                )}
            </div>

            {/* Modal Upload */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2 sm:px-4">
                    <div className="border-[4px] border-[#191b1a] bg-white p-5 sm:p-6 rounded-none w-full max-w-md text-black shadow-[8px_8px_0_#191b1a] max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-lg font-black uppercase tracking-tight mb-4 text-[#34399F] text-center">
                            Upload Bukti Pembayaran
                        </h3>

                        <div className="mb-4 space-y-4">
                            <div className="border-[3px] border-[#191b1a] bg-yellow-50 p-3 font-semibold text-[11px] sm:text-xs text-black leading-relaxed">
                                <div className="mb-2">
                                    <p className="font-extrabold text-[#34399F] mb-0.5">Informasi Rekening:</p>
                                    <div className="border-2 border-[#191b1a] bg-white px-2.5 py-1.5 font-mono text-[10px] sm:text-xs">
                                        Blu by BCA DIGITAL<br />
                                        <span className="text-sm font-extrabold tracking-wide">0027 4625 4702</span><br />
                                        <span className="text-[10px] font-bold text-gray-700">a/n M Althaf Faiz Rafianto</span>
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <p className="font-extrabold text-[#34399F] mb-0.5">Kode Kompetisi:</p>
                                    <ul className="text-[10px] sm:text-[11px] list-disc pl-4 space-y-0.5">
                                        <li><span className="font-bold">01</span> : HackToday</li>
                                        <li><span className="font-bold">02</span> : GameToday</li>
                                        <li><span className="font-bold">03</span> : UXToday</li>
                                        <li><span className="font-bold">04</span> : Minetoday</li>
                                    </ul>
                                </div>
                                <div className="mb-2">
                                    <p className="text-[10px] sm:text-[11px] text-gray-800">
                                        <span className="line-through font-bold text-gray-400">Harga Batch 1: Rp 80.000</span><br />
                                        <span className="font-bold text-black">Harga Batch 2: Rp 100.000</span>
                                    </p>
                                </div>
                                <div className="border border-[#191b1a] bg-white px-2 py-1 text-[10px] sm:text-[11px] italic text-gray-600 text-justify leading-snug">
                                    <span className="font-bold text-black">Contoh:</span> Ryan transfer <span className="font-bold text-black">100.002</span> Rupiah jika mendaftar <span className="font-bold text-black">GameToday</span> (Batch 2).
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase mb-1.5">
                                    Pilih File Bukti Bayar
                                    <span className="text-[9px] text-gray-500 font-bold ml-1">(JPG/PNG, maks 2MB)</span>
                                </label>
                                <div
                                    className="border-3 border-dashed border-[#191b1a] rounded-none p-5 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer w-full flex flex-col items-center justify-center gap-1.5 relative transition duration-300"
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
                                    <FaReceipt className={`text-2xl ${pembayaran ? 'text-[#25D366]' : 'text-gray-400'}`} />
                                    <span className="truncate text-xs font-bold w-full px-2">
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
                                    {pembayaran && <span className="absolute top-2 right-2 text-green-500 font-bold text-base">✓</span>}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="flex-1 py-2.5 border-[3px] border-[#191b1a] bg-gray-200 text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                disabled={loadingUpload}
                                className="flex-1 py-2.5 border-[3px] border-[#191b1a] bg-[#ffd400] text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:opacity-50"
                            >
                                {loadingUpload ? "Mengunggah..." : "Submit"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Alert */}
            {showAlert && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] px-4">
                    <div className="border-[3px] border-[#191b1a] bg-white p-4 rounded-none max-w-xs w-full text-black shadow-[5px_5px_0_#191b1a]">
                        <div className="flex items-center gap-3 mb-4">
                            <MdErrorOutline className="text-2xl text-red-500" />
                            <h3 className="text-sm font-bold">{alertMessage}</h3>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full py-2 border-[3px] border-black bg-[#ffd400] font-black uppercase text-xs shadow-[4px_4px_0_#191b1a]"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompCardNeo;
