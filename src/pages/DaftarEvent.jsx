import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaSchool, FaFileUpload } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { registerEvent } from "../utils/api/event";
import {
	checkIpbOrMinetoday,
	getCurrentUser,
	registerToBootcamp,
} from "../api/user";
import { uploadBootcampPayment } from "../api/user";

const workshopOptions = ["Cyber Security", "ui/ux", "Machine Learning"];

const whatsappLink = {
	cyberSec: "https://chat.whatsapp.com/GAiIjPTM31zDTPxr1M2YUg",
	uiux: "https://chat.whatsapp.com/IyLj86XgxZ19CFGigqnf3l",
	machineLearning: "https://chat.whatsapp.com/FbcLPUztaQEEm6qn1ZjZep",
	seminar: "https://chat.whatsapp.com/GrFDVvBC1weDWY4kA4MO7T",
	bootcamp: "https://chat.whatsapp.com/ED4bnW4VCJC7KRPYmUHRwN",
};

const eventIdMapping = {
	// Workshop mappings
	"Cyber Security": "Cyber Security", // Change to your production ID
	"ui/ux": "UI/UX", // Change to your production ID
	"Machine Learning": "Machine Learning", // Change to your production ID

	// Other event types
	bootcamp: "bootcamp", // Change to your production ID
	seminar: "seminar", // Change to your production ID
};

const bootcampBundlingMapping = {
	"Day 1": "day1",
	"Day 2": "day2",
	"Day 1 + Day 2": "day1_day2",
};

const DaftarEvent = () => {
	const { target } = useParams();
	const navigate = useNavigate();

	const [needsToPay, setNeedsToPay] = useState(false);
	const [institution, setInstitution] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [paymentFileName, setPaymentFileName] = useState("");
	const [paymentFile, setPaymentFile] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [workshopChoice, setWorkshopChoice] = useState("");
	const [loading, setLoading] = useState(false);
	const [linkWhatsapp, setLinkWhatsapp] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [incompleteFields, setIncompleteFields] = useState([]);
	const [error, setError] = useState("");
	const [hasCopied, setHasCopied] = useState(false);
	const [bootcampBundling, setBootcampBundling] = useState("");

	const paymentFileInputRef = useRef(null);

	// Fetch user data to pre-fill institution and whatsapp fields
	useEffect(() => {
		const initializeUserData = async () => {
			try {
				// Fetch user data
				const userResponse = await getCurrentUser();
				if (userResponse.data) {
					setInstitution(userResponse.data.nama_sekolah || "");
					setWhatsapp(userResponse.data.phone_number || "");
					setNeedsToPay(userResponse.data.needs_to_pay ?? true);
				}

				// Check IPB or MineToday status
				const ipbResponse = await checkIpbOrMinetoday();
				if (
					ipbResponse.data?.isIPB ||
					ipbResponse.data?.isRegisteredToMinetoday
				) {
					setNeedsToPay(false);
				}
			} catch (error) {
				console.error("Error initializing user data:", error);
			}
		};

		initializeUserData();
	}, []);

	useEffect(() => {
		if (target === "workshop") {
			if (workshopChoice === "Cyber Security") {
				setLinkWhatsapp(whatsappLink.cyberSec);
			} else if (workshopChoice === "UI/UX") {
				setLinkWhatsapp(whatsappLink.uiux);
			} else if (workshopChoice === "Machine Learning") {
				setLinkWhatsapp(whatsappLink.machineLearning);
			}
		} else if (target === "national-seminar") {
			setLinkWhatsapp(whatsappLink.seminar);
		} else if (target === "bootcamp") {
			setLinkWhatsapp(whatsappLink.bootcamp);
		}
	}, [target, workshopChoice]);

	// File handling methods similar to EditProfil
	const handlePaymentFileChange = (file) => {
		if (file && file.size <= 2 * 1024 * 1024) {
			// 2MB limit
			setPaymentFile(file);
			setPaymentFileName(file.name);
		} else if (file) {
			alert("Ukuran file maksimal 2MB.");
			setPaymentFile(null);
			setPaymentFileName("");
			if (paymentFileInputRef.current) {
				paymentFileInputRef.current.value = "";
			}
		}
	};

	const handlePaymentFileDrop = (e) => {
		e.preventDefault();
		const file = e.dataTransfer.files[0];
		handlePaymentFileChange(file);
	};

	const handlePaymentFileInputChange = (e) => {
		const file = e.target.files[0];
		handlePaymentFileChange(file);
	};

	const handleCopyToClipboard = (text) => {
		navigator.clipboard.writeText(text).then(() => {
			setHasCopied(true);
			setTimeout(() => setHasCopied(false), 2000); // Reset after 2 seconds
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setShowAlert(false);

		const missingFields = [];
		if (!institution.trim()) missingFields.push({ label: "Institusi" });
		if (!whatsapp.trim()) missingFields.push({ label: "Nomor WhatsApp" });
		if (target === "workshop" && !workshopChoice)
			missingFields.push({ label: "Bidang Workshop" });
		if (target === "bootcamp" && !paymentFile && !paymentFileName)
			missingFields.push({ label: "Bukti Pembayaran" });

		const internationalFormatRegex = /^\+\d+$/;
		if (whatsapp.trim() && !internationalFormatRegex.test(whatsapp)) {
			setIncompleteFields([
				{
					label:
						"Nomor WhatsApp harus dalam format internasional (misalnya: +628123456789).",
				},
			]);
			setShowAlert(true);
			return;
		}

		if (missingFields.length > 0) {
			setIncompleteFields(missingFields);
			setShowAlert(true);
			return;
		}

		setLoading(true);

		// Determine the event ID using the mapping
		let eventId;
		if (target === "workshop") {
			eventId = eventIdMapping[workshopChoice] || workshopChoice;
		} else {
			eventId =
				eventIdMapping[target === "national-seminar" ? "seminar" : target] ||
				target;
		}

		// Handle file upload for bootcamp
		if (target === "bootcamp" && paymentFile) {
			// First register to bootcamp
			registerToBootcamp({
				eventId: eventId,
				institutionName: institution,
				phoneNumber: whatsapp,
				bundling: bootcampBundling,
			})
				.then(() => {
					return uploadBootcampPayment(paymentFile);
				})
				.then(() => {
					setSubmitted(true);
				})
				.catch((error) => {
					setError(
						"Terjadi kesalahan saat mendaftar: " + error.message ||
							"File gagal diunggah"
					);
				})
				.finally(() => {
					setLoading(false);
				});
		} else {
			// Use existing registerEvent function for non-file uploads
			registerEvent({
				eventId: eventId,
				institutionName: institution,
				phoneNumber: whatsapp,
			})
				.then(() => {
					setSubmitted(true);
				})
				.catch((error) => {
					setError(
						"Terjadi kesalahan saat mendaftar: " + error.message ||
							"Gagal mendaftar"
					);
				})
				.finally(() => {
					setLoading(false);
				});
		}
	};

	const closeAlert = () => {
		setShowAlert(false);
	};

	return (
		<>
			<Navbar />
			<div className="min-h-screen w-full h-full pt-24 space-x-4 flex flex-row items-center justify-center p-6 background: linear-gradient(135deg, #5c3b5c, #2e263c, #a86b8290); text-white font-dm-sans">
				{/* Form Pendaftaran */}
				<div className="max-w-3xl w-full h-full bg-[#7b446c] rounded-lg shadow-lg p-6">
					<h2 className="text-2xl font-bold mb-4 text-center">
						Form Pendaftaran {target || "Event"}
					</h2>

					{submitted ? (
						<div className="flex flex-col text-center text-green-300 font-semibold gap-3">
							<p>
								Terima kasih telah mendaftar. Silahkan masuk ke grup whatsapp
								melalui link berikut:
							</p>
							<a
								href={linkWhatsapp}
								target="_blank"
								className="text-blue-400 mb-3"
							>
								Masuk ke Grup Whatsapp
							</a>
							<div className="flex flex-row justify-center gap-4">
								<button
									onClick={() => {
										handleCopyToClipboard(linkWhatsapp);
									}}
									className="bg-white text-blue-500 px-4 py-2 rounded hover:bg-neutral-300 transition duration-300"
								>
									{hasCopied ? "Link Disalin!" : "Salin Link Whatsapp"}
								</button>
								<button
									onClick={() => {
										navigate("/dashboard/ikut-event");
									}}
									className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
								>
									Kembali ke Dashboard
								</button>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="space-y-4">
							<div>
								<label className="block text-sm mb-1">Institusi</label>
								<div className="flex items-center bg-white rounded-md px-3 py-2">
									<FaSchool className="text-black mr-2" size={20} />
									<input
										type="text"
										value={institution}
										onChange={(e) => setInstitution(e.target.value)}
										className="flex-1 bg-white text-black outline-none"
										placeholder="Nama Institusi"
									/>
								</div>
							</div>
							<div>
								<label className="block text-sm mb-1">Nomor WhatsApp</label>
								<div className="flex items-center bg-white rounded-md px-3 py-2">
									<BiLogoWhatsapp className="text-black mr-2" size={20} />
									<input
										type="text"
										value={whatsapp}
										onChange={(e) => setWhatsapp(e.target.value)}
										className="flex-1 bg-white text-black outline-none"
										placeholder="Nomor WhatsApp"
									/>
								</div>
							</div>

							{target === "workshop" && (
								<div>
									<label className="block text-sm mb-1">
										Pilih Bidang Workshop
									</label>
									<select
										value={workshopChoice}
										onChange={(e) => setWorkshopChoice(e.target.value)}
										className="w-full px-3 py-2 rounded text-black bg-white"
										required
									>
										<option value="">-- Pilih Bidang --</option>
										{workshopOptions.map((option) => (
											<option key={option} value={option}>
												{option}
											</option>
										))}
									</select>
								</div>
							)}

							{target === "bootcamp" && needsToPay && (
								<div className="space-y-4">
									<div>
										<label className="block text-sm mb-1">Pilih Bundling</label>
										<select
											value={bootcampBundling}
											onChange={(e) => {
												setBootcampBundling(e.target.value);
												console.log("Selected Bundling:", e.target.value);
											}}
											className="w-full px-3 py-2 rounded text-black bg-white"
											required
										>
											<option value="">-- Pilih Bundling --</option>

											{Object.entries(bootcampBundlingMapping).map(
												([label, value]) => (
													<option key={value} value={value}>
														{label}
													</option>
												)
											)}
										</select>
									</div>
									<label className="block text-sm font-bold mb-2">
										Upload Bukti Pembayaran (jpg/png/pdf, max 2MB)
									</label>
									<div className="mb-4 sm:mb-6">
										<div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-3 sm:px-4 py-3 text-white">
											<div className="mb-3">
												<p className="text-xs sm:text-sm font-bold text-pink-300 mb-1">
													Informasi Rekening:
												</p>
												<div className="bg-[#7b446c]/60 rounded-lg px-3 py-2 text-xs sm:text-sm text-white/90 font-mono shadow-inner">
													Bank Mandiri
													<br />
													<div className="flex flex-row items-center">
														<span className="text-lg font-bold tracking-widest text-pink-100">
															<div className="flex items-center gap-4">
																1330032143554
																<button
																	className="border border-white rounded-xl py-1 px-2 text-xs "
																	onClick={() =>
																		handleCopyToClipboard("1330032143554")
																	}
																>
																	{hasCopied
																		? "Nomor Rekening telah disalin!"
																		: "Salin Nomor Rekening"}
																</button>
															</div>
														</span>
													</div>
													<br />
													<span className="text-xs sm:text-sm font-semibold text-pink-100">
														a/n M Althaf Faiz Rafianto
													</span>
												</div>
											</div>
											<div className="mb-3">
												<p className="text-xs sm:text-sm font-bold text-pink-300 mb-1">
													Kode Bayar:
												</p>
												<ul className="text-xs sm:text-sm text-white/90 grid grid-cols-2 gap-x-4 list-none pl-0">
													<li>
														<span className="font-bold text-pink-100">05</span>{" "}
														: Bootcamp
													</li>
												</ul>
											</div>
											<div className="mb-3">
												<p className="text-xs sm:text-sm text-white/90 mb-1">
													<b className="text-pink-100">
														Harga untuk Mahasiswa IPB:
													</b>{" "}
													Gratis
													<br />
													<br />
													<b className="text-pink-100">
														Harga untuk Peserta yang sudah mendaftar Minetoday:
													</b>{" "}
													Gratis
													<br />
													<br />
													<b className="text-pink-100">
														Harga untuk Peserta Umum:
													</b>
													<ul>
														<li>Day 1 : Rp. 100.000</li>
														<li>Day 2 : Rp. 100.000</li>
														<li>Day 1 + Day 2 : Rp. 150.000</li>
													</ul>
												</p>
											</div>
											<div className="bg-white/10 rounded-lg px-3 py-2 text-xs sm:text-sm text-white/80 italic shadow-inner text-justify">
												<span className="font-bold text-pink-100">Contoh:</span>{" "}
												Ryan harus bayar sebanyak{" "}
												<span className="font-bold text-pink-100">100.000</span>{" "}
												rupiah jika Ryan ingin ikut{" "}
												<span className="font-bold text-pink-100">
													Day 1 Bootcamp. Ryan bukan mahasiswa IPB dan tidak
													mendaftar Minetoday.
												</span>{" "}
												Maka Ryan harus transfer{" "}
												<span className="font-bold text-pink-100">100.005</span>{" "}
												Rupiah ke Althaf Faiz Rafianto.
											</div>
										</div>
									</div>
									<div
										className="border-2 border-dashed border-pink-400 rounded-md p-6 text-center bg-white/10 hover:bg-white/20 transition duration-300 hover:scale-102 cursor-pointer w-full min-h-24 flex items-center justify-center"
										onDragOver={(e) => e.preventDefault()}
										onDrop={handlePaymentFileDrop}
										onClick={() =>
											paymentFileInputRef.current &&
											paymentFileInputRef.current.click()
										}
									>
										<FaFileUpload className="mr-2 text-xl text-pink-300" />
										<div className="w-full overflow-hidden text-ellipsis">
											<p className="truncate">
												{paymentFile
													? paymentFile.name
													: paymentFileName
													? paymentFileName
													: "Drop file di sini atau klik untuk pilih file"}
											</p>
										</div>
										<input
											type="file"
											name="paymentProof"
											accept=".jpg,.jpeg,.png,.pdf"
											ref={paymentFileInputRef}
											onChange={handlePaymentFileInputChange}
											style={{ display: "none" }}
										/>
									</div>
									{paymentFileName && (
										<div className="text-xs text-gray-200 mt-1">
											File terpilih:{" "}
											<span className="font-semibold">{paymentFileName}</span>
										</div>
									)}
								</div>
							)}

							<div className="buttons flex flex-row justify-end">
								<a
									onClick={() => navigate("/dashboard/ikut-event")}
									className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-4 py-2 rounded mr-2 cursor-pointer"
								>
									Batal
								</a>
								<button
									type="submit"
									disabled={loading}
									className="custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer"
								>
									Simpan
								</button>
							</div>
						</form>
					)}
				</div>
				{error && <p className="text-red-500 text-sm mt-2">{error}</p>}
				{showAlert && (
					<div
						className="bg-red-600/80 text-white px-6 py-4 rounded-lg shadow-xl max-w-md"
						onMouseDown={(e) => e.stopPropagation()}
						onTouchStart={(e) => e.stopPropagation()}
					>
						<div className="flex justify-between items-start mb-2 gap-5">
							<h3 className="font-bold text-lg">
								<div className="flex items-center">
									<MdErrorOutline className="text-xl mr-2" />
									Data belum lengkap!
								</div>
							</h3>
							<button
								onClick={closeAlert}
								className="bg-red-700/85 hover:bg-red-800/85 rounded-full p-1 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>
						</div>
						<p className="text-sm mb-2">Mohon untuk lengkapi data diri Anda:</p>
						<ul className="list-disc pl-5 text-sm space-y-1">
							{incompleteFields.map((field, index) => (
								<li key={index}>{field.label}</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</>
	);
};

export default DaftarEvent;
