import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaFileUpload, FaCheckCircle, FaInstagram, FaExternalLinkAlt } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { registerSemnas } from "../api/semnas";
import { useAlert } from "../context/AlertContext";

export const SEMNAS_INSTAGRAM_ACCOUNTS = [
	{ username: "sentralkomputer_id", url: "https://www.instagram.com/sentralkomputer_id/", label: "Sentral Komputer" },
	{ username: "sentralkomputer_bogor", url: "https://www.instagram.com/sentralkomputer_bogor/", label: "Sentral Komputer Bogor" },
	{ username: "acerid", url: "https://www.instagram.com/acerid/", label: "Acer Indonesia" },
	{ username: "predatorgamingindonesia", url: "https://www.instagram.com/predatorgamingindonesia/", label: "Predator Gaming Indonesia" },
	{ username: "nvidiageforceid", url: "https://www.instagram.com/nvidiageforceid/", label: "NVIDIA GeForce Indonesia" },
];

const SemnasRegistrationForm = ({ eventId, onSuccess }) => {
	const navigate = useNavigate();
	const { showAlert } = useAlert();

	const [kenalSentralKomputer, setKenalSentralKomputer] = useState("");
	const [sumberKenalSentral, setSumberKenalSentral] = useState("");
	const [kenalAcer, setKenalAcer] = useState("");
	const [kenalNvidia, setKenalNvidia] = useState("");
	const [kenalMicrosoft, setKenalMicrosoft] = useState("");

	const [proofFile, setProofFile] = useState(null);
	const [proofFileName, setProofFileName] = useState("");

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");

	const proofFileInputRef = useRef(null);

	const handleFileChange = async (file) => {
		if (file && file.size <= 5 * 1024 * 1024) {
			if (file.type === "application/pdf" || file.type.startsWith("image/")) {
				setProofFile(file);
				setProofFileName(file.name);
			} else {
				await showAlert({ message: "File harus berupa PDF atau gambar." });
			}
		} else if (file) {
			await showAlert({ message: "Ukuran file maksimal 5MB." });
			setProofFile(null);
			setProofFileName("");
			if (proofFileInputRef.current) {
				proofFileInputRef.current.value = "";
			}
		}
	};

	const handleFileDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		handleFileChange(file);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!kenalSentralKomputer || !kenalAcer || !kenalNvidia || !kenalMicrosoft) {
			setError("Mohon jawab semua pertanyaan Ya/Tidak.");
			return;
		}

		if (kenalSentralKomputer === "true" && !sumberKenalSentral) {
			setError("Mohon pilih dari mana Anda mengenal Sentral Komputer.");
			return;
		}

		if (!proofFile) {
			setError("Mohon upload bukti follow IG narasumber.");
			return;
		}

		setLoading(true);
		setError("");

		try {
			const formData = new FormData();
			formData.append("event_id", eventId);
			formData.append("kenal_sentral_komputer", kenalSentralKomputer);
			formData.append("sumber_kenal_sentral", sumberKenalSentral);
			formData.append("kenal_acer", kenalAcer);
			formData.append("kenal_nvidia", kenalNvidia);
			formData.append("kenal_microsoft", kenalMicrosoft);
			formData.append("ig_follow_proof", proofFile);

			const res = await registerSemnas(formData);
			if (res.success) {
				await showAlert({
					message: "Pendaftaran Seminar Nasional Berhasil!",
					type: "success"
				});
				if (onSuccess) onSuccess();
			}
		} catch (err) {
			setError(err.response?.data?.message || "Terjadi kesalahan saat mendaftar.");
		} finally {
			setLoading(false);
		}
	};

	const sumberOptions = [
		"Media sosial",
		"Rekomendasi",
		"Kegiatan Roadshow kampus/sekolah",
		"Iklan",
		"Belum tau"
	];

	return (
		<div className="mx-auto w-full max-w-2xl">
			<div className="border-[3px] border-black bg-white p-6 shadow-[6px_6px_0_#191b1a] sm:p-10">
				<div className="mb-6 border-b-4 border-black pb-4 text-center">
					<h2 className="text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
						Kuesioner Seminar Nasional
					</h2>
					<p className="mt-2 text-sm font-medium text-gray-700">
						Silakan jawab pertanyaan di bawah ini untuk melanjutkan pendaftaran.
					</p>
				</div>

				{error && (
					<div className="mb-6 flex animate-shake items-center gap-3 border-[3px] border-black bg-[#ffccd5] p-4 shadow-[4px_4px_0_#191b1a]">
						<MdErrorOutline className="text-xl text-[#d90429] shrink-0" />
						<p className="text-sm font-bold text-[#d90429]">{error}</p>
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-6">
					{/* Kenal Sentral Komputer */}
					<div className="space-y-3 border-l-4 border-black pl-4">
						<label className="block text-base font-black text-black">
							1. Apakah sebelumnya sudah mengenal Sentral Komputer? <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-4">
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="sentral"
									value="true"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalSentralKomputer === "true"}
									onChange={(e) => setKenalSentralKomputer(e.target.value)}
								/>
								<span className="text-sm font-bold">Ya</span>
							</label>
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="sentral"
									value="false"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalSentralKomputer === "false"}
									onChange={(e) => {
										setKenalSentralKomputer(e.target.value);
										setSumberKenalSentral("");
									}}
								/>
								<span className="text-sm font-bold">Tidak</span>
							</label>
						</div>
					</div>

					{/* Sumber Sentral Komputer - Hanya muncul jika Ya */}
					{kenalSentralKomputer === "true" && (
						<div className="space-y-3 border-l-4 border-black pl-4 ml-4 bg-gray-50 p-3 animate-fade-in">
							<label className="block text-sm font-black text-black">
								Darimanakah anda mengenal Sentral Komputer? <span className="text-red-500">*</span>
							</label>
							<div className="flex flex-col gap-2">
								{sumberOptions.map((opt, idx) => (
									<label key={idx} className="flex cursor-pointer items-center gap-2">
										<input
											type="radio"
											name="sumber"
											value={opt}
											className="h-4 w-4 accent-[#18c964]"
											checked={sumberKenalSentral === opt}
											onChange={(e) => setSumberKenalSentral(e.target.value)}
										/>
										<span className="text-sm font-medium">{opt}</span>
									</label>
								))}
							</div>
						</div>
					)}

					{/* Kenal Acer */}
					<div className="space-y-3 border-l-4 border-black pl-4">
						<label className="block text-base font-black text-black">
							2. Apakah sebelumnya sudah mengenal Acer? <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-4">
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="acer"
									value="true"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalAcer === "true"}
									onChange={(e) => setKenalAcer(e.target.value)}
								/>
								<span className="text-sm font-bold">Ya</span>
							</label>
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="acer"
									value="false"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalAcer === "false"}
									onChange={(e) => setKenalAcer(e.target.value)}
								/>
								<span className="text-sm font-bold">Tidak</span>
							</label>
						</div>
					</div>

					{/* Kenal NVIDIA */}
					<div className="space-y-3 border-l-4 border-black pl-4">
						<label className="block text-base font-black text-black">
							3. Apakah sebelumnya sudah mengenal NVIDIA? <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-4">
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="nvidia"
									value="true"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalNvidia === "true"}
									onChange={(e) => setKenalNvidia(e.target.value)}
								/>
								<span className="text-sm font-bold">Ya</span>
							</label>
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="nvidia"
									value="false"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalNvidia === "false"}
									onChange={(e) => setKenalNvidia(e.target.value)}
								/>
								<span className="text-sm font-bold">Tidak</span>
							</label>
						</div>
					</div>

					{/* Kenal Microsoft */}
					<div className="space-y-3 border-l-4 border-black pl-4">
						<label className="block text-base font-black text-black">
							4. Apakah sebelumnya sudah mengenal Microsoft? <span className="text-red-500">*</span>
						</label>
						<div className="flex gap-4">
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="microsoft"
									value="true"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalMicrosoft === "true"}
									onChange={(e) => setKenalMicrosoft(e.target.value)}
								/>
								<span className="text-sm font-bold">Ya</span>
							</label>
							<label className="flex cursor-pointer items-center gap-2">
								<input
									type="radio"
									name="microsoft"
									value="false"
									className="h-4 w-4 accent-[#18c964]"
									checked={kenalMicrosoft === "false"}
									onChange={(e) => setKenalMicrosoft(e.target.value)}
								/>
								<span className="text-sm font-bold">Tidak</span>
							</label>
						</div>
					</div>

					{/* Upload Bukti */}
					<div className="space-y-3 border-l-4 border-black pl-4">
						<label className="block text-base font-black text-black">
							5. Upload Bukti Follow IG Narasumber <span className="text-red-500">*</span>
						</label>
						
						{/* Daftar Akun Instagram untuk di-follow */}
						<div className="border-2 border-black bg-[#fafafa] p-3 sm:p-4 shadow-[2px_2px_0_#191b1a] space-y-2.5">
							<p className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wide text-black">
								<FaInstagram className="text-base text-[#E1306C]" />
								Silakan follow akun Instagram berikut:
							</p>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
								{SEMNAS_INSTAGRAM_ACCOUNTS.map((acc) => (
									<a
										key={acc.username}
										href={acc.url}
										target="_blank"
										rel="noopener noreferrer"
										className="group flex items-center justify-between border-2 border-black bg-white px-3 py-2 text-xs font-bold text-black shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#fff9db] hover:shadow-[3px_3px_0_#191b1a] active:translate-x-0.5 active:translate-y-0.5"
									>
										<div className="flex items-center gap-2 overflow-hidden">
											<div className="flex h-7 w-7 shrink-0 items-center justify-center border border-black bg-[#fbe7ec] text-[#E1306C] shadow-[1px_1px_0_#000]">
												<FaInstagram className="text-sm group-hover:scale-110 transition-transform" />
											</div>
											<div className="truncate">
												<span className="block truncate font-extrabold text-black">@{acc.username}</span>
												<span className="block truncate text-[10px] font-semibold text-gray-500">{acc.label}</span>
											</div>
										</div>
										<span className="flex items-center gap-1 shrink-0 ml-1.5 text-[10px] font-black uppercase text-[#1E3A8A] group-hover:underline">
											Follow <FaExternalLinkAlt className="text-[8px]" />
										</span>
									</a>
								))}
							</div>
						</div>

						<p className="text-xs font-medium text-gray-600">Upload bukti screenshot follow akun di atas (Format PDF / Gambar, maks 5MB):</p>
						<div
							className="group relative flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-gray-400 bg-gray-50 p-6 transition-all hover:border-black hover:bg-gray-100"
							onDragOver={(e) => e.preventDefault()}
							onDrop={handleFileDrop}
							onClick={() => proofFileInputRef.current?.click()}
						>
							<input
								type="file"
								ref={proofFileInputRef}
								onChange={(e) => handleFileChange(e.target.files[0])}
								accept=".pdf,image/*"
								className="hidden"
							/>
							<div className="flex flex-col items-center space-y-3 text-center">
								<div className="rounded-full bg-white p-3 shadow-[2px_2px_0_#191b1a] transition-transform group-hover:scale-110">
									<FaFileUpload className="text-2xl text-black" />
								</div>
								{proofFileName ? (
									<div className="flex flex-col items-center gap-1">
										<p className="text-sm font-black text-[#087a3d]">
											File terpilih:
										</p>
										<p className="max-w-[200px] truncate text-xs font-bold text-black sm:max-w-xs">
											{proofFileName}
										</p>
									</div>
								) : (
									<div className="space-y-1">
										<p className="text-sm font-bold text-gray-700">
											<span className="text-[#1E3A8A]">Klik untuk upload</span> atau drag & drop
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="pt-6">
						<button
							type="submit"
							disabled={loading}
							className="w-full flex items-center justify-center gap-2 cursor-pointer border-[3px] border-black bg-[#ffd400] px-6 py-4 text-base font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{loading ? (
								<span className="flex items-center gap-2">
									<svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
									Menyimpan...
								</span>
							) : (
								<>
									<FaCheckCircle className="text-xl" />
									Simpan Pendaftaran
								</>
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SemnasRegistrationForm;
