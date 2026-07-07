import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaSchool, FaFileUpload } from "react-icons/fa";
import { MdCalendarMonth, MdErrorOutline } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { registerEvent, getJoinEvent } from "../utils/api/event";
import {
	checkIpbOrMinetoday,
	getCurrentUser,
	registerToBootcamp,
} from "../api/user";
import { uploadBootcampPayment } from "../api/user";
import { getPublicEvents } from "../api/eventPublic";
import FallbackEventCloseRegist from "./Fallback/FallbackCloseRegis";
import DashboardNeoHeader from "../components/Dashboard/DashboardNeoHeader";
import Sidebar from "../components/Dashboard/Sidebar";
import Footer from "../components/Footer";
import FallbackNotFound from "./Fallback/FallbackNotFound";
import { normalizeIndonesianPhoneNumber } from "../utils/phoneNumber";
import LoadingState from "../components/ui/LoadingState";

const workshopOptions = ["Cyber Security", "ui/ux", "Machine Learning"];

// Map route target names to display names
const targetDisplayName = {
	bootcamp: "Bootcamp",
	"national-seminar": "Seminar Nasional",
	seminar: "Seminar Nasional",
	workshop: "Workshop",
};

const eventIdMapping = {
	// Workshop mappings
	"Cyber Security": "Cyber Security", // Change to your production ID
	"ui/ux": "UI/UX", // Change to your production ID
	"Machine Learning": "Machine Learning", // Change to your production ID

	// Other event types
	bootcamp: "Bootcamp", // Change to your production ID
	seminar: "Seminar", // Change to your production ID
};

const bootcampBundlingMapping = {
	"Day 1": "day1",
	"Day 2": "day2",
	"Day 1 + Day 2": "day1_day2",
};

const EventRegistrationShell = ({ children }) => (
	<div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
		<DashboardNeoHeader />
		<div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[650px] lg:flex-row">
			<aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
				<Sidebar active="ikut-event" setActive={() => {}} variant="neobrutal" />
			</aside>
			<main className="flex min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
				{children}
			</main>
		</div>
		<Footer variant="neobrutal" />
	</div>
);

const DaftarEvent = () => {
	const { target } = useParams();
	const navigate = useNavigate();

	const [needsToPay, setNeedsToPay] = useState(false);
	const [institution, setInstitution] = useState("");
	const [dateOfBirth, setDateOfBirth] = useState("");
	const [whatsapp, setWhatsapp] = useState("");
	const [paymentFileName, setPaymentFileName] = useState("");
	const [paymentFile, setPaymentFile] = useState(null);
	const [submitted, setSubmitted] = useState(false);
	const [alreadyRegistered, setAlreadyRegistered] = useState(false);
	const [workshopChoice, setWorkshopChoice] = useState("");
	const [loading, setLoading] = useState(false);
	const [linkWhatsapp, setLinkWhatsapp] = useState("");
	const [showAlert, setShowAlert] = useState(false);
	const [incompleteFields, setIncompleteFields] = useState([]);
	const [error, setError] = useState("");
	const [hasCopied, setHasCopied] = useState({});
	const [bootcampBundling, setBootcampBundling] = useState("");
	const [isActive, setIsActive] = useState(true);
	const [checkingActive, setCheckingActive] = useState(true);
	const [exists, setExists] = useState(true);
	const displayName = targetDisplayName[target] || (target ? target.charAt(0).toUpperCase() + target.slice(1) : "Event");

	const paymentFileInputRef = useRef(null);

	// Fetch user data to pre-fill institution and whatsapp fields
	useEffect(() => {
		const initializeUserData = async () => {
			try {
				// Fetch user data
				const userResponse = await getCurrentUser();
				if (userResponse.data) {
					setInstitution(userResponse.data.nama_sekolah || "");
					// Convert ISO date to yyyy-MM-dd format
					const birthDate = userResponse.data.birth_date
						? new Date(userResponse.data.birth_date).toISOString().split("T")[0]
						: "";
					setDateOfBirth(birthDate);
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

	// Check if user already registered for Bootcamp or National Seminar on load
	useEffect(() => {
		const checkExistingRegistration = async () => {
			if (target !== "bootcamp" && target !== "national-seminar") return;
			try {
				const res = await getJoinEvent();
				const events = res?.data || res;
				const list = events?.data || events?.events || events;
				const isRegistered = Array.isArray(list)
					? list.some((e) => {
							const id = (e?.event_id || e?.id || e?.slug || "")
								.toString()
								.toLowerCase();
							const name = (e?.event_name || e?.name || e?.title || "")
								.toString()
								.toLowerCase();
							if (target === "bootcamp") {
								return id.includes("bootcamp") || name.includes("bootcamp");
							} else if (target === "national-seminar") {
								return id.includes("seminar") || name.includes("seminar");
							}
							return false;
					  })
					: false;
				if (isRegistered) {
					setAlreadyRegistered(true);
					setSubmitted(true);
				}
			} catch {
				// ignore; user might have no events yet
			}
		};

		checkExistingRegistration();
	}, [target]);

	// Fetch the current event configuration from Admin/database.
	useEffect(() => {
		const fetchEventConfiguration = async () => {
			if (target === "workshop" && !workshopChoice) {
				setExists(true);
				setLinkWhatsapp("");
				setCheckingActive(false);
				return;
			}

			setCheckingActive(true);
			try {
				const res = await getPublicEvents("non_competition");
				if (res.success && res.data) {
					const routeEventId =
						target === "workshop"
							? workshopChoice
							: (target === "national-seminar" || target === "seminar")
								? "seminar"
								: target;
					const eventId = eventIdMapping[routeEventId] || routeEventId;
					const event = res.data.find(e => e.id.toLowerCase() === eventId.toLowerCase());

					if (event) {
						setExists(true);
						if (event.is_active !== undefined) {
							setIsActive(event.is_active);
						}
						setLinkWhatsapp(event.whatsapp_group_link || "");
					} else {
						setExists(false);
						setLinkWhatsapp("");
					}
				} else {
					setExists(false);
				}
			} catch (e) {
				console.error("Error fetching event configuration:", e);
				setExists(false);
				setLinkWhatsapp("");
			}
			setCheckingActive(false);
		};

		fetchEventConfiguration();
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

	const handleCopyToClipboard = (text, key) => {
		navigator.clipboard.writeText(text).then(() => {
			setHasCopied((prev) => ({ ...prev, [key]: true }));
			setTimeout(
				() => setHasCopied((prev) => ({ ...prev, [key]: false })),
				2000
			);
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setShowAlert(false);

		const missingFields = [];
		if (!institution.trim()) missingFields.push({ label: "Institusi" });
		if (!dateOfBirth) missingFields.push({ label: "Tanggal Lahir" });
		if (!whatsapp.trim()) missingFields.push({ label: "Nomor WhatsApp" });
		if (target === "workshop" && !workshopChoice)
			missingFields.push({ label: "Bidang Workshop" });

		const normalizedWhatsapp = normalizeIndonesianPhoneNumber(whatsapp);
		if (whatsapp.trim() && !normalizedWhatsapp) {
			setIncompleteFields([
				{
					label:
						"Format Nomor WhatsApp tidak valid. Gunakan 08123456789, 628123456789, atau +628123456789.",
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

		setWhatsapp(normalizedWhatsapp);
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
				phoneNumber: normalizedWhatsapp,
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
						"Terjadi kesalahan saat mendaftar: " +
							(error.response?.data?.message ||
								error.response?.data?.error ||
								error.message ||
								"File gagal diunggah")
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
				phoneNumber: normalizedWhatsapp,
				dateOfBirth: dateOfBirth
					? new Date(dateOfBirth).toISOString().split("T")[0]
					: null,
			})
				.then(() => {
					setSubmitted(true);
				})
				.catch((error) => {
					setError(
						"Terjadi kesalahan saat mendaftar: " +
							(error.response?.data?.message ||
								error.response?.data?.error ||
								error.message ||
								"Gagal mendaftar")
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

	if (checkingActive) {
		return <LoadingState />;
	}

	if (!exists) {
		return <FallbackNotFound title="EVENT NOT FOUND" message="Event tidak ditemukan." />;
	}

	if (!isActive) {
		return <FallbackEventCloseRegist eventName={target} />;
	}

	return (
		<EventRegistrationShell>
			<div className="w-full max-w-5xl">
				{/* Form Pendaftaran */}
				<section className="border-[4px] border-black bg-[#f4f4f2] p-4 shadow-[8px_8px_0_#191b1a] sm:p-6 lg:p-8">
					<div className="border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#191b1a] sm:p-8 lg:p-10">
					<p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#3f46b8]">
						{displayName}
					</p>
					<h1 className="mt-3 text-2xl font-black sm:text-3xl">
						Form Pendaftaran
					</h1>
					{error && error.includes("You already registered in this event!") && (
						<div className="mt-5 border-[3px] border-black bg-[#ff8c75] px-6 py-3 text-center text-sm font-bold shadow-[5px_5px_0_#191b1a]">
							<span className="font-bold">{error}</span>
						</div>
					)}

					{submitted ? (
						<div className="mt-7 flex flex-col gap-5 text-center font-semibold">
							<div className="flex flex-col gap-5">
								<p className="text-base font-black sm:text-lg">
									{alreadyRegistered
										? "You're already registered."
										: "Terima kasih telah mendaftar. Silakan masuk ke grup WhatsApp event berikut:"}
								</p>
								<div className="flex flex-col gap-3 w-full items-center">
									{linkWhatsapp ? (
										<div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl justify-center items-center">
											<button
												onClick={() => window.open(linkWhatsapp, "_blank", "noopener,noreferrer")}
												className="w-full min-w-[180px] max-w-[320px] flex-1 cursor-pointer border-[3px] border-black bg-[#18c964] px-3 py-3 text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] sm:w-auto sm:text-sm"
											>
												<FaWhatsapp className="inline mr-1" /> Grup{" "}
												{displayName}
											</button>
											<button
												onClick={() => {
													handleCopyToClipboard(linkWhatsapp, "main");
												}}
												className="w-full min-w-[160px] flex-shrink-0 border-[3px] border-black bg-white px-4 py-3 text-xs font-black uppercase text-[#087a3d] shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 sm:w-auto sm:text-sm"
											>
												{hasCopied.main ? "Link Disalin!" : "Salin Link WhatsApp"}
											</button>
										</div>
									) : (
										<p className="border-[3px] border-black bg-[#ffe26b] px-5 py-3 text-sm font-bold shadow-[4px_4px_0_#191b1a]">
											Link grup WhatsApp belum tersedia. Silakan hubungi panitia.
										</p>
									)}
								</div>
							</div>
							<div className="flex flex-row justify-center gap-4">
								<button
									onClick={() => {
										navigate("/dashboard/ikut-event");
									}}
									className="cursor-pointer border-[3px] border-black bg-[#ffd400] px-6 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a]"
								>
									Kembali ke Dashboard
								</button>
							</div>
						</div>
					) : (
						<form onSubmit={handleSubmit} className="mt-7 space-y-5">
							<div>
								<label className="mb-2 block text-xs font-black uppercase tracking-wide">Institusi</label>
								<div className="flex items-center border-[3px] border-black bg-white px-4 py-3 focus-within:bg-[#fff6bf]">
									<FaSchool className="mr-3 shrink-0 text-[#4f5261]" size={21} />
									<input
										type="text"
										inputMode="text"
										autoComplete="organization"
										value={institution}
										onChange={(e) => setInstitution(e.target.value)}
										className="min-w-0 flex-1 bg-transparent font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400"
										placeholder="Nama Sekolah/Institusi"
									/>
								</div>
							</div>
							<div>
								<label className="mb-2 block text-xs font-black uppercase tracking-wide">Tanggal Lahir</label>
								<div className="flex items-center border-[3px] border-black bg-white px-4 py-3 focus-within:bg-[#fff6bf]">
									<MdCalendarMonth className="mr-3 shrink-0 text-[#4f5261]" size={23} />
									<input
										type="date"
										value={dateOfBirth}
										onChange={(e) => setDateOfBirth(e.target.value)}
										className="min-w-0 flex-1 bg-transparent font-bold text-black outline-none"
										required
									/>
								</div>
							</div>
							<div>
								<label className="mb-2 block text-xs font-black uppercase tracking-wide">Nomor WhatsApp</label>
								<div className="flex items-center border-[3px] border-black bg-white px-4 py-3 focus-within:bg-[#fff6bf]">
									<BiLogoWhatsapp className="mr-3 shrink-0 text-[#4f5261]" size={22} />
									<input
										type="tel"
										inputMode="tel"
										autoComplete="tel"
										value={whatsapp}
										onChange={(e) => setWhatsapp(e.target.value)}
										className="min-w-0 flex-1 bg-transparent font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400"
										placeholder="Nomor WhatsApp"
									/>
								</div>
							</div>

							{target === "workshop" && (
								<div>
									<label className="mb-2 block text-xs font-black uppercase tracking-wide">
										Pilih Bidang Workshop
									</label>
									<select
										value={workshopChoice}
										onChange={(e) => setWorkshopChoice(e.target.value)}
										className="w-full border-[3px] border-black bg-white px-4 py-3 font-bold text-black outline-none focus:bg-[#fff6bf]"
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
										<label className="mb-2 block text-xs font-black uppercase tracking-wide">Pilih Bundling</label>
										<select
											value={bootcampBundling}
											onChange={(e) => {
												setBootcampBundling(e.target.value);
												console.log("Selected Bundling:", e.target.value);
											}}
											className="w-full border-[3px] border-black bg-white px-4 py-3 font-bold text-black outline-none focus:bg-[#fff6bf]"
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
									<label className="mb-2 block text-xs font-black uppercase tracking-wide">
										Upload Bukti Pembayaran (jpg/png/pdf, max 2MB)
									</label>
									<div className="mb-4 sm:mb-6">
										<div className="mb-4 border-[3px] border-black bg-[#565bc5] px-4 py-4 text-white shadow-[5px_5px_0_#191b1a]">
											<div className="mb-3">
												<p className="text-xs sm:text-sm font-bold text-pink-300 mb-1">
													Informasi Rekening:
												</p>
											<div className="border-2 border-black bg-white px-3 py-3 font-mono text-xs text-black sm:text-sm">
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
									className="flex min-h-24 w-full cursor-pointer items-center justify-center border-[3px] border-dashed border-black bg-[#e8fbef] p-6 text-center font-bold text-black transition-transform hover:-translate-y-0.5"
										onDragOver={(e) => e.preventDefault()}
										onDrop={handlePaymentFileDrop}
										onClick={() =>
											paymentFileInputRef.current &&
											paymentFileInputRef.current.click()
										}
									>
										<FaFileUpload className="mr-2 text-xl text-[#3f46b8]" />
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
										<div className="mt-2 text-xs font-semibold text-gray-700">
											File terpilih:{" "}
											<span className="font-semibold">{paymentFileName}</span>
										</div>
									)}
								</div>
							)}

							<div className="flex flex-col gap-3 pt-2 sm:flex-row">
								<button
									type="button"
									onClick={() => navigate("/dashboard/ikut-event")}
									className="border-[3px] border-black bg-[#eeeeee] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
								>
									Batal
								</button>
								<button
									type="submit"
									disabled={loading}
									className="order-first border-[3px] border-black bg-[#ffd400] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:order-none"
								>
									Simpan
								</button>
							</div>
						</form>
					)}
					</div>
				</section>
				{/* Removed generic error message below the form. Error is now shown only in the styled alert below the title. */}
				{showAlert && (
					<div
						className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4"
						onMouseDown={(e) => e.stopPropagation()}
						onTouchStart={(e) => e.stopPropagation()}
					>
						<div className="w-full max-w-md border-[4px] border-black bg-[#ff8c75] px-6 py-5 text-black shadow-[8px_8px_0_#191b1a]">
						<div className="flex justify-between items-start mb-2 gap-5">
							<h3 className="font-bold text-lg">
								<div className="flex items-center">
									<MdErrorOutline className="text-xl mr-2" />
									Data belum lengkap!
								</div>
							</h3>
							<button
								onClick={closeAlert}
									className="border-2 border-black bg-white p-1 transition-transform hover:-translate-y-0.5"
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
					</div>
				)}
			</div>
		</EventRegistrationShell>
	);
};

export default DaftarEvent;
