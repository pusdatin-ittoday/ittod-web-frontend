import React, { useState, useEffect } from "react";
import { FaUpload, FaTrash, FaComments, FaImage, FaCheckCircle, FaClock } from "react-icons/fa";
import { submitUserFeedback, getUserFeedbacks } from "../../../api/user";
import { useAlert } from "../../../context/AlertContext";

const FeedbackPage = () => {
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const { showAlert } = useAlert();

    const fetchHistory = async () => {
        setLoadingHistory(true);
        const res = await getUserFeedbacks();
        if (res.success && res.data) {
            setHistory(res.data);
        }
        setLoadingHistory(false);
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        const validFiles = [];
        const validPreviews = [];

        files.forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                showAlert({ message: `Ukuran file "${file.name}" melebihi batas 5MB.` });
                return;
            }
            if (!file.type.startsWith("image/")) {
                showAlert({ message: `File "${file.name}" harus berupa gambar (JPG, PNG).` });
                return;
            }
            if (selectedFiles.length + validFiles.length >= 5) {
                showAlert({ message: "Maksimal mengunggah 5 gambar screenshot." });
                return;
            }
            validFiles.push(file);
            validPreviews.push(URL.createObjectURL(file));
        });

        setSelectedFiles((prev) => [...prev, ...validFiles]);
        setPreviews((prev) => [...prev, ...validPreviews]);
    };

    const removeFile = (index) => {
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!subject.trim()) {
            showAlert({ message: "Silakan pilih atau isi topik / subjek feedback." });
            return;
        }
        if (!content.trim()) {
            showAlert({ message: "Silakan tuliskan isi feedback & saran Anda." });
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("subject", subject.trim());
            formData.append("content", content.trim());
            selectedFiles.forEach((file) => {
                formData.append("media", file);
            });

            const res = await submitUserFeedback(formData);
            if (res.success) {
                showAlert({ message: res.data.message || "Feedback berhasil dikirim!" });
                setSubject("");
                setContent("");
                setSelectedFiles([]);
                setPreviews([]);
                fetchHistory();
            } else {
                showAlert({ message: res.error || "Gagal mengirim feedback." });
            }
        } catch (err) {
            console.error(err);
            showAlert({ message: "Terjadi kesalahan saat mengirim feedback." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto pb-12">
            {/* Header Banner */}
            <div className="border-[4px] border-[#1A1C1C] bg-[#FFD600] p-6 sm:p-8 shadow-[6px_6px_0_0_#1A1C1C] flex flex-col gap-2">
                <p className="font-space-grotesk text-xs tracking-[0.2em] font-black uppercase text-[#1A1C1C]/70">
                    SUARA PESERTA IT TODAY
                </p>
                <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#1A1C1C] tracking-tight">
                    Feedback & Saran
                </h1>
                <p className="text-xs sm:text-sm font-bold text-[#1A1C1C]/80 leading-relaxed max-w-3xl">
                    Punya masukan, kendala teknis website, atau saran pengembangan untuk acara IT Today? Sampaikan langsung di bawah ini beserta bukti screenshot pendukung.
                </p>
            </div>

            {/* Form Section */}
            <div className="border-[4px] border-[#1A1C1C] bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#1A1C1C]">
                <div className="border-b-[3px] border-[#1A1C1C] pb-4 mb-6 flex items-center gap-3">
                    <div className="w-9 h-9 border-2 border-[#1A1C1C] bg-[#34399F] flex items-center justify-center text-white shadow-[3px_3px_0_#1A1C1C]">
                        <FaComments className="text-lg" />
                    </div>
                    <h2 className="text-lg sm:text-xl font-black uppercase text-[#1A1C1C]">
                        Kirim Umpan Balik Baru
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Topik / Subjek */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-[#1A1C1C]">
                            Topik / Subjek <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full border-[2.5px] border-[#1A1C1C] bg-[#F8F9FA] px-3.5 py-3 text-xs sm:text-sm font-bold text-[#1A1C1C] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#34399F]"
                            required
                        >
                            <option value="" disabled>-- Pilih Topik Feedback --</option>
                            <option value="Kendala Website & Sistem">Kendala Website & Sistem</option>
                            <option value="Saran Fitur Baru">Saran Fitur Baru</option>
                            <option value="Pelayanan & Respon Panitia">Pelayanan & Respon Panitia</option>
                            <option value="Kualitas Event & Lomba">Kualitas Event & Lomba</option>
                            <option value="Masukan Umum / Lainnya">Masukan Umum / Lainnya</option>
                        </select>
                    </div>

                    {/* Isi Feedback */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-[#1A1C1C]">
                            Isi Feedback & Saran <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Tuliskan feedback, kendala, atau saran Anda secara rinci di sini..."
                            rows={5}
                            className="w-full border-[2.5px] border-[#1A1C1C] bg-[#F8F9FA] p-3.5 text-xs sm:text-sm font-semibold text-[#1A1C1C] placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#34399F]"
                            required
                        />
                    </div>

                    {/* Multi-Image Upload Area */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-black uppercase tracking-wider text-[#1A1C1C] flex items-center justify-between">
                            <span>Upload Media / Screenshot (Opsional)</span>
                            <span className="text-[11px] font-semibold text-gray-500">Maks 5 Gambar (Max 5MB/file)</span>
                        </label>

                        <div className="border-[2.5px] border-dashed border-[#1A1C1C] bg-[#F8F9FA] p-5 text-center flex flex-col items-center justify-center gap-2 hover:bg-[#F3F4F6] transition-colors relative cursor-pointer">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/jpg"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                disabled={selectedFiles.length >= 5}
                            />
                            <FaUpload className="text-2xl text-[#34399F]" />
                            <p className="text-xs font-bold text-[#1A1C1C]">
                                Klik atau seret foto screenshot pendukung ke sini
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase font-bold">
                                Format: JPG, PNG, WEBP
                            </p>
                        </div>

                        {/* Previews List */}
                        {previews.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-2">
                                {previews.map((src, idx) => (
                                    <div key={idx} className="relative group border-2 border-[#1A1C1C] bg-black aspect-square overflow-hidden shadow-[3px_3px_0_#1A1C1C]">
                                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeFile(idx)}
                                            className="absolute top-1 right-1 bg-red-600 text-white text-xs p-1 rounded border border-black shadow hover:bg-red-700"
                                            title="Hapus gambar"
                                        >
                                            <FaTrash className="text-xs" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-2 w-full sm:w-auto self-start border-[3px] border-[#1A1C1C] bg-[#34399F] px-6 py-3 text-xs sm:text-sm font-black uppercase text-white shadow-[4px_4px_0_0_#1A1C1C] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#1A1C1C] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? "Mengirim..." : "Kirim Feedback & Saran"}
                    </button>
                </form>
            </div>

            {/* Riwayat Feedback Saya */}
            <div className="border-[4px] border-[#1A1C1C] bg-white p-6 sm:p-8 shadow-[8px_8px_0_0_#1A1C1C]">
                <div className="border-b-[3px] border-[#1A1C1C] pb-4 mb-6">
                    <h3 className="text-lg sm:text-xl font-black uppercase text-[#1A1C1C]">
                        Riwayat Masukan Saya
                    </h3>
                </div>

                {loadingHistory ? (
                    <p className="text-xs font-bold text-gray-500 animate-pulse">Memuat riwayat feedback...</p>
                ) : history.length === 0 ? (
                    <div className="border-2 border-dashed border-[#1A1C1C] bg-[#F8F9FA] p-6 text-center text-xs font-bold text-gray-500">
                        Belum ada feedback yang Anda kirim sebelumnya.
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {history.map((item) => (
                            <div key={item.id} className="border-[2.5px] border-[#1A1C1C] p-4 bg-[#F8F9FA] shadow-[4px_4px_0_0_#1A1C1C] flex flex-col gap-3">
                                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-300 pb-2">
                                    <span className="border border-[#1A1C1C] bg-[#34399F] text-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                                        {item.subject}
                                    </span>
                                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
                                        <FaClock className="text-xs text-gray-500" />
                                        <span>
                                            {new Date(item.created_at).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })} WIB
                                        </span>
                                    </div>
                                </div>

                                <p className="text-xs sm:text-sm font-semibold text-[#1A1C1C] leading-relaxed whitespace-pre-wrap">
                                    {item.content}
                                </p>

                                {item.media_urls && Array.isArray(item.media_urls) && item.media_urls.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {item.media_urls.map((img, i) => (
                                            <a
                                                key={i}
                                                href={img}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="w-14 h-14 border border-black rounded overflow-hidden shadow-sm hover:opacity-80 transition-opacity"
                                            >
                                                <img src={img} alt="Bukti" className="w-full h-full object-cover" />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeedbackPage;
