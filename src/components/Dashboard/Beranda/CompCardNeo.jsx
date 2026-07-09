import React, { useState, useRef, useEffect } from "react";
import { FaUpload, FaReceipt } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { getPublicEventById } from "../../../api/eventPublic";


const CheckIcon = ({ className = "w-3 h-3 text-[#1A1C1C]" }) => (
    <svg className={className} viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.28784 8.97392L9.51658 4.73039L8.47552 3.68473L5.28419 6.88722L3.71789 5.32637L2.68048 6.37565L5.28784 8.97392ZM6.13493 12.2378C5.28402 12.2393 4.4662 12.0805 3.7438 11.7613C3.00061 11.4422 2.35387 11.0084 1.80357 10.4601C1.25328 9.91167 0.817257 9.26645 0.495513 8.52439C0.17377 7.78232 0.0121553 6.98584 0.0106702 6.13493C0.0091851 5.28402 0.168018 4.48698 0.48717 3.7438C0.806321 3.00061 1.24009 2.35387 1.78847 1.80357C2.33685 1.25328 2.98207 0.817256 3.72413 0.495513C4.4662 0.173769 5.26268 0.0121553 6.11359 0.0106702C6.9645 0.0091851 7.76154 0.168018 8.50472 0.487169C9.24791 0.81725 9.89465 1.24009 10.4449 1.78847C10.9952 2.33685 11.4313 2.98207 11.753 3.72413C12.0748 4.4662 12.2364 5.26268 12.2378 6.11359C12.2393 6.9645 12.0805 7.76154 11.7614 8.50472C11.4422 9.24791 11.0084 9.89465 10.4601 10.4449C9.91167 10.9952 9.26645 11.4313 8.52439 11.753C7.78232 12.0747 6.98584 12.2364 6.13493 12.2378ZM6.13223 10.692C7.41303 10.6898 8.49374 10.2468 9.37439 9.36306C10.255 8.47934 10.6942 7.39708 10.692 6.11629C10.6898 4.83549 10.2468 3.75478 9.36306 2.87413C8.47934 1.99349 7.39708 1.55428 6.11629 1.55652C4.83549 1.55876 3.75478 2.00173 2.87413 2.88546C1.99349 3.76918 1.55428 4.85144 1.55652 6.13223C1.55876 7.41303 2.00173 8.49374 2.88546 9.37439C3.76918 10.255 4.85144 10.6942 6.13223 10.692Z" fill="currentColor" />
    </svg>
);

const WhatsappIcon = () => (
    <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2.68241 7.31604L7.34862 7.3812L7.36491 6.21465L2.6987 6.14949L2.68241 7.31604ZM2.70685 5.56622L9.70616 5.66395L9.72245 4.4974L2.72314 4.39966L2.70685 5.56622ZM2.73128 3.81639L9.73059 3.91412L9.74688 2.74757L2.74757 2.64984L2.73128 3.81639ZM0 12.226L0.149135 1.5457C0.155 1.115 0.310192 0.751803 0.614263 0.456107C0.918334 0.16041 1.28572 0.0155694 1.71642 0.0215835L10.851 0.149135C11.2817 0.155149 11.6449 0.310192 11.9406 0.614263C12.2363 0.918334 12.3811 1.28572 12.3751 1.71642L12.2802 8.51791C12.2741 8.94861 12.1191 9.31181 11.815 9.60751C11.511 9.90321 11.1436 10.048 10.7129 10.042L2.36568 9.92547L0 12.226ZM1.89148 8.37285L10.7345 8.49633L10.8294 1.69484L1.69484 1.56728L1.59588 8.65406L1.89148 8.37285ZM1.59986 8.36878L1.69484 1.56728L1.59986 8.36878Z" fill="white" />
    </svg>
);

const PremiumBadgeIcon = () => (
    <svg className="w-5 h-5 text-[#1A1C1C]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FCD400" stroke="#1A1C1C" strokeWidth="2" strokeLinejoin="round" />
    </svg>
);

const isRekening = true;

const CompCardNeo = ({ compKey, data, currentUser, onVerify }) => {
    const navigate = useNavigate();
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


    const isApproved = (v) => v === 1 || v === true || v === 'approved';
    const isTeamVerified = isApproved(data.isVerified);
    const isDocumentVerified = isApproved(data.isDocumentVerified);
    const isParagraphVerified = data.pendingVerification;
    const hasTeamError = Boolean(data.verificationError && data.verificationError.trim() !== "");

    const membersWithErrors = membersArray.filter(m => m.verificationError && m.verificationError.trim() !== "");

    const hasTeamDocumentError = hasTeamError && !isDocumentVerified;
    const hasDocumentError = hasTeamDocumentError || membersWithErrors.length > 0;

    const hasTransactionError = hasTeamError && isDocumentVerified;
    const isRejected = hasTransactionError || hasDocumentError;
    const showTeamErrorBox = hasTransactionError || hasTeamDocumentError;

    const showPendingVerification = isDocumentVerified && isParagraphVerified && !isRejected && !hasDocumentError;

    const needsVerification = isTeamLeader && isDocumentVerified && !isTeamVerified && !isParagraphVerified && !hasTransactionError && !hasDocumentError;

    const [whatsappLink, setWhatsappLink] = useState("");

    useEffect(() => {
        const fetchWhatsappLink = async () => {
            if (data.competitionId) {
                const res = await getPublicEventById(data.competitionId);
                if (res.success && res.data && res.data.whatsapp_group_link) {
                    setWhatsappLink(res.data.whatsapp_group_link.trim());
                }
            }
        };
        fetchWhatsappLink();
    }, [data.competitionId]);

    const handleWhatsappClick = () => {
        if (!whatsappLink) {
            alert("Grup Whatsapp tidak ditemukan untuk kompetisi ini.");
            return;
        }
        window.open(whatsappLink, "_blank");
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
        <div className="w-full min-w-0 border-[3px] border-[#1A1C1C] bg-white p-3 shadow-[4px_4px_0_0_#000] flex flex-col gap-4 sm:border-[4px] sm:p-6 sm:gap-5">

            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                    <h3 className="break-words text-xl font-bold uppercase text-[#34399F] tracking-tight sm:text-3xl">
                        {data.competitionName}
                    </h3>

                    <div className="space-y-1 text-sm font-space-grotesk text-gray-700">
                        {!isIndividual && (
                            <p className="flex flex-col gap-0.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2">
                                <span className="opacity-55">Team Name:</span>
                                <span className="font-extrabold text-[#1A1C1C]">{data.teamName || "-"}</span>
                            </p>
                        )}
                        <p className="flex flex-col gap-0.5 min-[420px]:flex-row min-[420px]:items-center min-[420px]:gap-2">
                            <span className="opacity-55">
                                {isIndividual ? "Reg. Code:" : "Join Code:"}
                            </span>
                            <span className="font-extrabold text-[#1A1C1C]">
                                {data.teamJoinCode || "-"}
                            </span>
                        </p>
                    </div>
                </div>

                <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:items-end lg:flex-row lg:items-center">
                    {isTeamVerified && (
                        <>
                            {whatsappLink && (
                                <button
                                    onClick={handleWhatsappClick}
                                    className="flex w-full items-center justify-center gap-2 border-2 border-[#1A1C1C] bg-[#25D366] px-4 py-2 text-sm font-space-grotesk text-white shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none sm:w-auto"
                                >
                                    <WhatsappIcon />
                                    Grup Whatsapp
                                </button>
                            )}
                            <div className="flex w-full items-center justify-center gap-2 border-2 border-[#1A1C1C] bg-[#4ADE80] px-4 py-2 text-sm font-space-grotesk font-bold text-black shadow-[4px_4px_0_0_#000] sm:w-auto">
                                <CheckIcon className="w-3.5 h-3.5 text-[#1A1C1C]" />
                                Sudah Terverifikasi
                            </div>
                        </>
                    )}

                    {showPendingVerification && (
                        <div className="flex w-full items-center justify-center gap-2 border-2 border-[#1A1C1C] bg-[#FCD400] px-4 py-2 text-sm font-space-grotesk font-bold text-black shadow-[4px_4px_0_0_#000] sm:w-auto">
                            <span className="animate-spin text-xs">⌛</span>
                            Pending Verif
                        </div>
                    )}

                    {!isTeamVerified && !showPendingVerification && !isRejected && (
                        <div className="flex w-full items-center justify-center gap-2 border-2 border-[#1A1C1C] bg-[#ff8c75] px-4 py-2 text-sm font-space-grotesk font-bold text-black shadow-[4px_4px_0_0_#000] sm:w-auto">
                            <MdErrorOutline className="text-base text-black" />
                            Unverified
                        </div>
                    )}

                    {isRejected && (
                        <div className="flex w-full items-center justify-center gap-2 border-2 border-[#1A1C1C] bg-[#ef4444] px-4 py-2 text-sm font-space-grotesk font-bold text-white shadow-[4px_4px_0_0_#000] sm:w-auto">
                            <MdErrorOutline className="text-base text-white" />
                            Rejected
                        </div>
                    )}
                </div>
            </div>

            {showTeamErrorBox && (
                <div className="break-words border-[3px] border-[#1A1C1C] bg-[#fef2f2] p-3 text-xs font-bold text-red-700 shadow-[4px_4px_0_0_#000] sm:p-4">
                    <span className="font-extrabold uppercase text-red-800">Alasan Penolakan:</span>{" "}
                    {data.verificationError || "Berkas / bukti pembayaran tidak valid"}
                </div>
            )}

            <div className="border-2 border-[#1A1C1C] bg-[#EEE] p-2.5 flex flex-col gap-2.5 sm:p-4">
                {membersArray.map((anggota, idx) => {
                    const hasMemberError = anggota.verificationError && anggota.verificationError.trim() !== "";
                    const isApproved = isDocumentVerified && !hasMemberError;

                    return (
                        <div
                            key={idx}
                            className={`flex flex-col items-stretch justify-between gap-3 p-3 bg-white border-2 border-[#1A1C1C] sm:flex-row sm:items-center sm:gap-4 ${idx === 0 ? "border-l-[5px] border-l-[#FCD400]" : ""
                                }`}
                        >
                            <div className="flex min-w-0 items-start gap-3 sm:items-center">
                                {idx === 0 ? (
                                    <div className="border border-[#1A1C1C] bg-[#FCD400] p-1 flex items-center justify-center">
                                        <PremiumBadgeIcon />
                                    </div>
                                ) : (
                                    <span className="text-lg">👤</span>
                                )}
                                <div className="min-w-0 text-sm font-space-grotesk">
                                    <span className="mr-1.5 block opacity-50 min-[420px]:inline">
                                        {isIndividual ? "Peserta:" : (idx === 0 ? "Ketua:" : "Anggota:")}
                                    </span>
                                    <span className={`break-words ${anggota.fullName === currentUser ? "text-[#34399F] font-bold" : "font-semibold"}`}>
                                        {anggota.fullName}
                                    </span>
                                </div>
                            </div>

                            <div className="flex shrink-0 items-center justify-end gap-1.5 self-end sm:self-auto">
                                {hasMemberError ? (
                                    <div className="flex max-w-full flex-col items-end gap-2">
                                        <div className="relative group cursor-help flex items-center gap-1">
                                            <MdErrorOutline className="text-red-600 text-sm" />
                                            <span className="text-red-600 font-hanken-grotesk font-extrabold text-[12px] border-b border-dashed border-red-400">REJECTED</span>

                                            {/* Hover Tooltip Neo-Brutalist */}
                                            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block z-50 w-64 p-3 bg-[#1A1C1C] text-white text-xs font-semibold rounded-md shadow-[4px_4px_0_0_#EF4444] border-2 border-red-500">
                                                <div className="relative">
                                                    <p className="font-space-grotesk leading-relaxed">{anggota.verificationError}</p>
                                                    {/* Tooltip Arrow */}
                                                    <div className="absolute top-full right-4 w-2.5 h-2.5 bg-[#1A1C1C] border-r-2 border-b-2 border-red-500 transform rotate-45 translate-y-1.5"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="max-w-[220px] break-words border-2 border-red-300 bg-red-50 px-3 py-2 text-justify font-space-grotesk text-xs font-semibold leading-relaxed text-red-700 shadow-[3px_3px_0_0_#EF4444] sm:hidden">
                                            {anggota.verificationError}
                                        </p>
                                    </div>
                                ) : isApproved ? (
                                    <>
                                        <CheckIcon className="w-3.5 h-3.5 text-[#166534]" />
                                        <span className="text-[#166534] font-hanken-grotesk font-extrabold text-[12px]">APPROVED</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-amber-600 animate-pulse">⌛</span>
                                        <span className="text-amber-600 font-hanken-grotesk font-extrabold text-[12px]">PENDING</span>
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-1">
                {!isDocumentVerified && (
                    isRejected && hasDocumentError ? (
                        <button
                            onClick={() => navigate("/edit-profile")}
                            className="w-full border-[3px] border-[#1A1C1C] bg-[#FFD600] px-4 py-3.5 text-center text-xs font-black uppercase text-black shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                        >
                            Edit Data
                        </button>
                    ) : (
                        <div className="border-[3px] border-[#1A1C1C] bg-[#fffbeb] p-4 text-xs font-bold text-amber-700 shadow-[4px_4px_0_0_#000] flex items-center gap-2">
                            <span>⚠️</span>
                            <span>Lengkapi berkas agar panitia dapat memverifikasi tim Anda dan membuka menu pembayaran.</span>
                        </div>
                    )
                )}

                {!isTeamLeader && isDocumentVerified && !isTeamVerified && !isParagraphVerified && !isRejected && (
                    <div className="border-[3px] border-[#1A1C1C] bg-[#fffbeb] p-4 text-xs font-bold text-amber-700 shadow-[4px_4px_0_0_#000] flex items-center gap-2">
                        <span>⚠️</span>
                        <span>Ingatkan ketua tim Anda untuk mengunggah bukti pembayaran agar pendaftaran selesai.</span>
                    </div>
                )}

                {isRejected && !hasDocumentError && isTeamLeader && (
                    <div className="border-[3px] border-[#1A1C1C] bg-[#fef2f2] p-4 text-xs font-bold text-red-700 shadow-[4px_4px_0_0_#000] flex items-center gap-2 mb-3">
                        <span>⚠️</span>
                        <span>Silakan unggah kembali bukti pembayaran yang valid di bawah ini.</span>
                    </div>
                )}

                {(needsVerification || (isRejected && !hasDocumentError && isTeamLeader)) && (
                    <button
                        onClick={handleVerifyClick}
                        className="w-full border-[3px] border-[#1A1C1C] bg-[#34399F] px-4 py-3.5 text-center text-xs font-black uppercase text-white shadow-[4px_4px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none"
                    >
                        <FaUpload className="inline mr-2 text-xs" />
                        {isRejected ? "Upload Ulang Bukti Pembayaran" : "Upload Bukti Pembayaran"}
                    </button>
                )}
            </div>

            {showUploadModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-2 sm:px-4">
                    <div className="border-[4px] border-[#1A1C1C] bg-white rounded-none w-full max-w-md text-black shadow-[8px_8px_0_#000] max-h-[90vh] flex flex-col overflow-hidden">

                        {/* Modal Header */}
                        <div className="border-b-[4px] border-[#1A1C1C] bg-[#3D45A0] px-5 py-4 text-left">
                            <h3 className="text-xl font-space-grotesk font-black uppercase text-white tracking-tight">
                                Upload Bukti Pembayaran
                            </h3>
                        </div>

                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto custom-scrollbar flex-1 flex flex-col gap-4 text-xs font-bold leading-relaxed">

                            {/* Bank Info Section */}
                            <div className="border-[2px] border-black bg-[#FFD600]/20 p-4 flex flex-col gap-2">
                                <p className="font-space-grotesk text-[10px] sm:text-xs tracking-wider text-[#3D45A0] font-black uppercase">
                                    Informasi Rekening:
                                </p>
                                {isRekening ? (
                                    <div className="space-y-1">
                                        <h4 className="text-sm sm:text-base font-space-grotesk font-black text-[#121212]">
                                            Seabank
                                        </h4>
                                        <p className="font-mono text-base sm:text-lg tracking-wider text-[#121212] font-extrabold select-all">
                                            901429379205
                                        </p>
                                        <p className="text-xs sm:text-sm font-space-grotesk font-bold text-[#121212]">
                                            a/n Asty Athetha Loethan
                                        </p>
                                    </div>
                                ) : (
                                    <div className="text-xs sm:text-sm font-space-grotesk font-bold text-[#121212] italic">
                                        Saat ini pembayaran belum dibuka. Mohon maaf atas gangguannya.
                                    </div>
                                )}
                            </div>

                            {/* Competition Codes & Pricing */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                {/* Kode Kompetisi */}
                                <div className="flex-1 border-[2px] border-black p-3.5 flex flex-col gap-2">
                                    <p className="font-space-grotesk text-[10px] tracking-wider text-gray-500 font-black uppercase">
                                        Kode Kompetisi:
                                    </p>
                                    <ul className="space-y-1 text-[10px] sm:text-xs text-[#121212] font-bold">
                                        <li>01 : HackToday</li>
                                        <li>02 : GameToday</li>
                                        <li>03 : UXToday</li>
                                        <li>04 : Minetoday</li>
                                    </ul>
                                </div>
                                {/* Harga */}
                                <div className="flex-1 border-[2px] border-black p-3.5 flex flex-col gap-2">
                                    <p className="font-space-grotesk text-[10px] tracking-wider text-gray-500 font-black uppercase">
                                        Harga:
                                    </p>
                                    <div className="space-y-1 text-[10px] sm:text-xs text-[#121212] font-bold">
                                        <p>Batch 1: <span className="text-[#3D45A0]">Rp 80.000</span></p>
                                        <p>Batch 2: <span className="text-[#3D45A0]">Rp 100.000</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Important Note */}
                            <div className="border-l-[4px] border-[#3D45A0] bg-gray-100 p-3.5 text-[10px] sm:text-xs text-justify">
                                <span className="text-black font-black uppercase mr-1">Contoh:</span>
                                <span className="text-[#121212]">
                                    Ryan harus bayar sebanyak 100.000 rupiah jika Ryan ingin ikut GameToday pada Batch-2. Ryan harus transfer <span className="text-[#3D45A0] font-black">100.002</span> Rupiah ke Asty Athetha Loethan.
                                </span>
                            </div>

                            {/* Upload Area */}
                            <div className="flex flex-col gap-2">
                                <label className="block font-space-grotesk text-[10px] tracking-wider text-gray-500 font-black uppercase">
                                    Upload Bukti Pembayaran (JPG/PNG, Maks 2MB)
                                </label>
                                <div
                                    className="border-[2px] border-dashed border-black rounded-none p-6 text-center bg-gray-50 hover:bg-gray-100 cursor-pointer w-full flex flex-col items-center justify-center gap-2 relative transition duration-300"
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
                                    <svg className="w-8 h-8 text-[#3D45A0]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                    <span className="truncate text-xs font-black uppercase w-full px-2 text-[#121212]">
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

                        {/* Modal Footer */}
                        <div className="border-t-[4px] border-[#1A1C1C] p-4 flex flex-col gap-4 bg-white min-[400px]:flex-row">
                            <button
                                onClick={() => setShowUploadModal(false)}
                                className="flex-1 py-3 border-[3px] border-[#1A1C1C] bg-[#E5E7EB] text-xs font-black uppercase text-[#121212] shadow-[3.5px_3.5px_0_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0_0_#1A1C1C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                disabled={loadingUpload}
                                className="flex-1 py-3 border-[3px] border-[#1A1C1C] bg-[#FFD600] text-xs font-black uppercase text-[#121212] shadow-[3.5px_3.5px_0_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0_0_#1A1C1C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50"
                            >
                                {loadingUpload ? "Mengunggah..." : "Submit"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {showAlert && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] px-4">
                    <div className="border-[3px] border-[#1A1C1C] bg-white p-4 rounded-none max-w-xs w-full text-black shadow-[5px_5px_0_0_#000]">
                        <div className="flex items-center gap-3 mb-4">
                            <MdErrorOutline className="text-2xl text-red-500" />
                            <h3 className="text-sm font-bold">{alertMessage}</h3>
                        </div>
                        <button
                            onClick={() => setShowAlert(false)}
                            className="w-full py-2 border-[3px] border-black bg-[#ffd400] font-black uppercase text-xs shadow-[4px_4px_0_0_#000]"
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
