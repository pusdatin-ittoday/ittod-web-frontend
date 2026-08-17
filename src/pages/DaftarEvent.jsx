import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaSchool, FaFileUpload, FaUserEdit, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import { MdCalendarMonth, MdErrorOutline } from "react-icons/md";
import { FaWhatsapp, FaDiscord } from "react-icons/fa";
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
import { useAlert } from "../context/AlertContext";
import { requireCompleteProfile } from "../utils/profileCompletion";

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
				<Sidebar active="ikut-event" setActive={() => { }} variant="neobrutal" />
			</aside>
			<main className="flex min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
				{children}
			</main>
		</div>
		<Footer variant="neobrutal" />
	</div>
);

const isRekening = true;

const DaftarEvent = () => {
	const { target } = useParams();
	const navigate = useNavigate();
	const { showAlert: showGlobalAlert } = useAlert();

	const [needsToPay, setNeedsToPay] = useState(false);
	const [isIPB, setIsIPB] = useState(false);
	const [isRegisteredToMinetoday, setIsRegisteredToMinetoday] = useState(false);
	const [isMineTodayPending, setIsMineTodayPending] = useState(false);
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
	const [isActive, setIsActive] = useState(true);
	const [checkingActive, setCheckingActive] = useState(true);
	const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);
	const [exists, setExists] = useState(true);
	const [currentEvent, setCurrentEvent] = useState(null);
	const [isCheckingProfile, setIsCheckingProfile] = useState(true);
	const [currentUserProfile, setCurrentUserProfile] = useState(null);
	const [showIntelligoModal, setShowIntelligoModal] = useState(false);
	const [hasOpenedIntelligo, setHasOpenedIntelligo] = useState(() => {
		return localStorage.getItem("hasOpenedIntelligo") === "true";
	});
	const displayName = targetDisplayName[target] || (target ? target.charAt(0).toUpperCase() + target.slice(1) : "Event");

	const paymentFileInputRef = useRef(null);

	const isCurrentIPB = isIPB || /(ipb|institut pertanian bogor)/i.test(institution);
	const effectiveIsIPB = isCurrentIPB;
	const effectiveIsMineToday = !isCurrentIPB && isRegisteredToMinetoday;

	// Guard profile completion on mount
	useEffect(() => {
		const guardRegistration = async () => {
			const isComplete = await requireCompleteProfile(navigate, showGlobalAlert);
			if (isComplete) {
				setIsCheckingProfile(false);
			}
		};
		guardRegistration();
	}, [navigate, showGlobalAlert]);

	// Fetch user data to pre-fill institution and whatsapp fields
	useEffect(() => {
		const initializeUserData = async () => {
			try {
				// Fetch user data
				const userResponse = await getCurrentUser();
				let userInst = "";
				if (userResponse.data) {
					setCurrentUserProfile(userResponse.data);
					userInst = userResponse.data.nama_sekolah || "";
					setInstitution(userInst);
					// Convert ISO date to yyyy-MM-dd format
					const birthDate = userResponse.data.birth_date
						? new Date(userResponse.data.birth_date).toISOString().split("T")[0]
						: "";
					setDateOfBirth(birthDate);
					setWhatsapp(userResponse.data.phone_number || "");
				}

				// Check IPB or MineToday status
				const ipbResponse = await checkIpbOrMinetoday();
				const ipbData = ipbResponse.data || {};
				const detectedIPB = Boolean(
					ipbData.isIPB ||
					/(ipb|institut pertanian bogor)/i.test(userInst)
				);
				const detectedMinetodayVerified = Boolean(
					ipbData.isMineTodayPaymentVerified ||
					ipbData.paymentStatus
				);
				const detectedMinetodayPending = Boolean(ipbData.isRegisteredToMinetoday) && !detectedMinetodayVerified;

				setIsIPB(detectedIPB);
				setIsRegisteredToMinetoday(detectedMinetodayVerified);
				setIsMineTodayPending(detectedMinetodayPending);
				setNeedsToPay(!detectedIPB);
			} catch (error) {
				console.error("Error initializing user data:", error);
			}
		};

		initializeUserData();
	}, []);

	// Check if user already registered for event on load
	useEffect(() => {
		const checkExistingRegistration = async () => {
			try {
				const res = await getJoinEvent();
				const events = res?.data || res;
				const list = events?.data || events?.events || events;
				const currentTarget = (target === "workshop" && workshopChoice ? workshopChoice : target || "").toLowerCase();

				const matched = Array.isArray(list)
					? list.find((e) => {
						const eId = (e?.event_id || e?.id || "").toString().toLowerCase();
						const eSlug = (e?.event?.slug || e?.slug || "").toString().toLowerCase();
						const eTitle = (e?.event?.title || e?.event_name || e?.name || e?.title || "").toString().toLowerCase();

						if (!currentTarget) return false;

						if (eId === currentTarget || eSlug === currentTarget) return true;

						if (currentTarget.includes("bootcamp")) {
							return eId.includes("bootcamp") || eSlug.includes("bootcamp") || eTitle.includes("bootcamp");
						}
						if (currentTarget.includes("seminar")) {
							return eId.includes("seminar") || eSlug.includes("seminar") || eTitle.includes("seminar");
						}
						if (currentTarget.includes("workshop") || currentTarget.includes("cyber") || currentTarget.includes("ux") || currentTarget.includes("learning")) {
							return eId.includes("workshop") || eSlug.includes("workshop") || eTitle.includes("workshop") ||
								(workshopChoice && (eTitle.includes(workshopChoice.toLowerCase()) || eSlug.includes(workshopChoice.toLowerCase())));
						}
						return eId.includes(currentTarget) || eSlug.includes(currentTarget) || eTitle.includes(currentTarget);
					})
					: null;

				if (matched) {
					setAlreadyRegistered(true);
					setSubmitted(true);
					if (matched.payment_verification === "accepted" && matched.event?.whatsapp_group_link) {
						setLinkWhatsapp(matched.event.whatsapp_group_link);
					} else {
						setLinkWhatsapp("");
					}
				}
			} catch {
				// ignore; user might have no events yet
			} finally {
				setIsCheckingRegistration(false);
			}
		};

		checkExistingRegistration();
	}, [target, workshopChoice]);

	// Fetch the current event configuration from Admin/database.
	useEffect(() => {
		const fetchEventConfiguration = async () => {
			if (target === "workshop" && !workshopChoice) {
				setExists(true);
				setCheckingActive(false);
				return;
			}

			setCheckingActive(true);
			try {
				const res = await getPublicEvents("non_competition");
				if (res.success && res.data) {
					const rawTarget = (target === "workshop" ? workshopChoice : target || "").toLowerCase().trim();

					// 1. Direct match by id or slug
					let event = res.data.find(e =>
						(e.id && e.id.toLowerCase() === rawTarget) ||
						(e.slug && e.slug.toLowerCase() === rawTarget)
					);

					// 2. Mapped query match
					if (!event) {
						const routeEventId =
							target === "workshop"
								? workshopChoice
								: (target === "national-seminar" || target === "seminar" || target === "seminar-nasional")
									? "seminar"
									: target;
						const mappedId = eventIdMapping[routeEventId] || routeEventId;
						event = res.data.find(e =>
							(e.id && e.id.toLowerCase() === mappedId.toLowerCase()) ||
							(e.slug && e.slug.toLowerCase() === mappedId.toLowerCase())
						);
					}

					// 3. Substring title/slug/id match
					if (!event) {
						event = res.data.find(e => {
							const title = (e.title || "").toLowerCase();
							const slug = (e.slug || "").toLowerCase();
							const id = (e.id || "").toLowerCase();

							if (rawTarget.includes("seminar") || rawTarget.includes("national")) {
								return title.includes("seminar") || slug.includes("seminar") || id.includes("seminar");
							}
							if (rawTarget.includes("bootcamp")) {
								return title.includes("bootcamp") || slug.includes("bootcamp") || id.includes("bootcamp");
							}
							if (rawTarget.includes("workshop")) {
								return title.includes("workshop") || slug.includes("workshop") || id.includes("workshop");
							}
							return title.includes(rawTarget) || slug.includes(rawTarget) || id.includes(rawTarget);
						});
					}

					if (event) {
						setCurrentEvent(event);
						setExists(true);
						if (event.is_active !== undefined) {
							setIsActive(event.is_active);
						}
					} else {
						setCurrentEvent(null);
						setExists(false);
					}
				} else {
					setCurrentEvent(null);
					setExists(false);
				}
			} catch (e) {
				console.error("Error fetching event configuration:", e);
				setCurrentEvent(null);
				setExists(false);
			}
			setCheckingActive(false);
		};

		fetchEventConfiguration();
	}, [target, workshopChoice]);

	// File handling methods similar to EditProfil
	const handlePaymentFileChange = async (file) => {
		if (file && file.size <= 2 * 1024 * 1024) {
			// 2MB limit
			setPaymentFile(file);
			setPaymentFileName(file.name);
		} else if (file) {
			await showGlobalAlert({ message: "Ukuran file maksimal 2MB." });
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

	const handleOpenIntelligoLink = async () => {
		const isComplete = await requireCompleteProfile(navigate, showGlobalAlert);
		if (!isComplete) return;
		setShowIntelligoModal(true);
	};

	const handleConfirmIntelligo = async () => {
		setShowIntelligoModal(false);
		setLoading(true);
		setError("");
		try {
			const eventId = currentEvent?.id || currentEvent?.slug || "Bootcamp";
			await registerToBootcamp({
				eventId,
				institutionName: currentUserProfile?.nama_sekolah || institution,
				phoneNumber: currentUserProfile?.phone_number || whatsapp,
				bundling: "intelligo_gateway",
			});
			setSubmitted(true);
			setHasOpenedIntelligo(true);
			localStorage.setItem("hasOpenedIntelligo", "true");
			window.open("https://bit.ly/ai-bootcamp-ittoday", "_blank", "noopener,noreferrer");
		} catch (err) {
			const errorMsg =
				err.response?.data?.message ||
				err.response?.data?.error ||
				err.message ||
				"Gagal mencatat pendaftaran.";
			setError(errorMsg);
			await showGlobalAlert({
				title: "Gagal Mendaftar",
				message: errorMsg,
				variant: "danger",
			});
		} finally {
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		setError("");
		setShowAlert(false);

		const isBootcamp = target === "bootcamp";
		const currentInst = (institution || currentUserProfile?.nama_sekolah || "").trim();
		const currentBirth = dateOfBirth || (currentUserProfile?.birth_date ? new Date(currentUserProfile.birth_date).toISOString().split("T")[0] : "");
		const currentPhone = (whatsapp || currentUserProfile?.phone_number || "").trim();

		const missingFields = [];
		if (!currentInst) missingFields.push({ label: isBootcamp ? "Asal Institusi/Sekolah (Silakan lengkapi di Edit Profil)" : "Institusi" });
		if (!currentBirth && !isBootcamp) missingFields.push({ label: "Tanggal Lahir" });
		if (!currentPhone) missingFields.push({ label: isBootcamp ? "Nomor WhatsApp (Silakan lengkapi di Edit Profil)" : "Nomor WhatsApp" });
		if (target === "workshop" && !workshopChoice)
			missingFields.push({ label: "Bidang Workshop" });

		const isMineTodayParticipant = isBootcamp && !isCurrentIPB && isRegisteredToMinetoday;

		if (isMineTodayParticipant && !paymentFile) {
			missingFields.push({ label: "Bukti Pembayaran (Transfer Bank)" });
		}

		const normalizedWhatsapp = normalizeIndonesianPhoneNumber(currentPhone);
		if (currentPhone && !normalizedWhatsapp) {
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

		setInstitution(currentInst);
		setDateOfBirth(currentBirth);
		setWhatsapp(normalizedWhatsapp);
		setLoading(true);

		// Determine the event ID using currentEvent if available, or mapping fallback
		let eventId = currentEvent?.id || currentEvent?.slug;
		if (!eventId) {
			if (target === "workshop") {
				eventId = eventIdMapping[workshopChoice] || workshopChoice;
			} else {
				eventId =
					eventIdMapping[target === "national-seminar" || target === "seminar" ? "seminar" : target] ||
					target;
			}
		}

		// Handle file upload for bootcamp
		if (isBootcamp && paymentFile) {
			// First register to bootcamp
			registerToBootcamp({
				eventId: eventId,
				institutionName: institution,
				phoneNumber: normalizedWhatsapp,
				bundling: bootcampBundling || "",
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
		} else if (isBootcamp) {
			// Register to bootcamp without payment file (IPB free or General)
			registerToBootcamp({
				eventId: eventId,
				institutionName: institution,
				phoneNumber: normalizedWhatsapp,
				bundling: bootcampBundling || "",
			})
				.then(() => {
					setSubmitted(true);
				})
				.catch((error) => {
					// Fallback to registerEvent
					return registerEvent({
						eventId: eventId,
						institutionName: institution,
						phoneNumber: normalizedWhatsapp,
						date_of_birth: dateOfBirth
							? new Date(dateOfBirth).toISOString().split("T")[0]
							: null,
					})
						.then(() => {
							setSubmitted(true);
						})
						.catch((err) => {
							setError(
								"Terjadi kesalahan saat mendaftar: " +
								(err.response?.data?.message ||
									err.response?.data?.error ||
									err.message ||
									"Gagal mendaftar")
							);
						});
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
				date_of_birth: dateOfBirth
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

	if (checkingActive || isCheckingProfile || isCheckingRegistration) {
		return <LoadingState />;
	}

	if (!exists) {
		return <FallbackNotFound title="EVENT NOT FOUND" message="Event tidak ditemukan." />;
	}

	if (!isActive && !alreadyRegistered && !submitted) {
		return <FallbackEventCloseRegist eventName={target} />;
	}

	return (
		<div className="min-h-screen bg-[#f4f4f2] font-dm-sans text-[#191b1a]">
			<DashboardNeoHeader />

			<div className="mx-auto flex w-full max-w-[1600px] flex-col lg:min-h-[650px] lg:flex-row">
				<aside className="shrink-0 border-b-4 border-black bg-white lg:w-[310px] lg:border-b-0 lg:border-r-4">
					<Sidebar
						active="ikut-event"
						setActive={() => { }}
						variant="neobrutal"
					/>
				</aside>

				<main className="flex min-w-0 flex-1 items-start justify-center px-4 py-8 sm:px-7 lg:px-10 lg:py-10">
					<div className="w-full max-w-3xl border-[4px] border-black bg-white p-6 shadow-[8px_8px_0_#191b1a] sm:p-8">
				{/* Header Section */}
				<div className="border-b-4 border-black pb-5">
					<div className="flex flex-wrap items-center justify-between gap-2">
						<span className="inline-block border-2 border-black bg-[#1E3A8A] px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0_#191b1a]">
							{displayName}
						</span>
						{target === "bootcamp" && effectiveIsIPB && (
							<span className="inline-block border-2 border-black bg-[#18c964] px-3 py-1 text-xs font-black uppercase text-white shadow-[2px_2px_0_#191b1a]">
								Mahasiswa IPB • Gratis
							</span>
						)}
						{target === "bootcamp" && !effectiveIsIPB && effectiveIsMineToday && (
							<div className="inline-flex items-center gap-1.5 border-2 border-black bg-[#ffd400] px-2.5 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0_#191b1a]">
								<span>Peserta MineToday:</span>
								<span className="line-through text-gray-700 text-[11px]">Rp 499.000</span>
								<span className="text-black">Rp 50.000</span>
							</div>
						)}
						{target === "bootcamp" && !effectiveIsIPB && !effectiveIsMineToday && (
							<div className="inline-flex items-center gap-1.5 border-2 border-black bg-[#ffd400] px-2.5 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0_#191b1a]">
								<span>Peserta Umum:</span>
								<span className="line-through text-gray-700 text-[11px]">Rp 499.000</span>
								<span className="text-black">Rp 99.000</span>
							</div>
						)}
					</div>
					<h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-black sm:text-3xl">
						{target === "bootcamp"
							? "Pendaftaran Bootcamp Offline Artificial Intelligence"
							: `Form Pendaftaran ${displayName}`}
					</h1>
					<p className="mt-1.5 text-xs sm:text-sm font-bold text-gray-600">
						{target === "bootcamp"
							? "IT TODAY IPB × INTELLIGO ID"
							: "Lengkapi data pendaftaran kegiatan di bawah ini."}
					</p>
				</div>

				{error && (
					<div className="mt-5 border-[3px] border-black bg-[#ff8c75] px-6 py-3 text-center text-sm font-bold text-black shadow-[5px_5px_0_#191b1a]">
						<span className="font-bold">{error}</span>
					</div>
				)}

				{submitted ? (
					<div className="mt-7 flex flex-col gap-6 text-center font-semibold">
						<div className="border-[3px] border-black bg-[#e8fbef] p-6 shadow-[5px_5px_0_#191b1a]">
							<div className="mx-auto flex h-14 w-14 items-center justify-center border-2 border-black bg-[#18c964] text-white shadow-[3px_3px_0_#191b1a]">
								<FaCheckCircle size={32} />
							</div>
							<h2 className="mt-4 text-xl font-black uppercase tracking-tight text-black sm:text-2xl">
								{alreadyRegistered ? "Anda Sudah Terdaftar!" : "Pendaftaran Berhasil!"}
							</h2>
							<p className="mt-2 text-xs font-medium text-gray-800 sm:text-sm">
								{target === "bootcamp" && effectiveIsMineToday
									? "Bukti pembayaran Bootcamp Anda telah berhasil dikirim dan sedang dalam proses verifikasi oleh panitia IT Today 2026."
									: target === "bootcamp" && !effectiveIsIPB && !effectiveIsMineToday
									? "Data pendaftaran Bootcamp Anda telah tercatat. Silakan selesaikan transaksi melalui portal Intelligo ID di bawah, kemudian lakukan konfirmasi ke panitia."
									: target === "bootcamp"
									? "Data pendaftaran Bootcamp Anda telah berhasil dicatat pada sistem IT Today 2026."
									: "Terima kasih telah mendaftar pada kegiatan IT Today 2026."}
							</p>
						</div>

						{/* Khusus Bootcamp Peserta Umum: Tombol Intelligo & Konfirmasi WhatsApp Panitia */}
						{target === "bootcamp" && !effectiveIsIPB && !effectiveIsMineToday && (
							<div className="space-y-4">
								<div className="border-[3px] border-black bg-white p-5 shadow-[4px_4px_0_#191b1a] text-center">
									<p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E3A8A] mb-1.5">
										Portal Pendaftaran & Pembayaran Intelligo ID:
									</p>
									<p className="text-xs font-medium text-gray-700 mb-3.5">
										Jika Anda belum menyelesaikan transaksi atau ingin membuka kembali portal pembayaran Intelligo ID (Rp 99.000):
									</p>
									<a
										href="https://bit.ly/ai-bootcamp-ittoday"
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center gap-2 border-[3px] border-black bg-[#ffd400] px-6 py-3 text-xs sm:text-sm font-black uppercase text-black shadow-[3px_3px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b]"
									>
										Buka Portal Pembayaran Intelligo ID
									</a>
								</div>

								<div className="border-[3px] border-black bg-[#FFF6BF] p-5 text-left text-black shadow-[4px_4px_0_#191b1a]">
									<div className="flex items-center gap-2">
										<FaWhatsapp className="text-[#087a3d]" size={18} />
										<p className="text-xs font-black uppercase tracking-wider text-[#1E3A8A]">
											Konfirmasi Pembayaran ke WhatsApp Panitia:
										</p>
									</div>
									<p className="mt-2 text-xs text-gray-800 font-medium">
										Setelah menyelesaikan pembayaran melalui Intelligo ID (Rp 99.000), silakan lakukan konfirmasi dengan mengirimkan bukti transaksi ke salah satu kontak panitia berikut:
									</p>
									<div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
										<a
											href="https://wa.me/6281212258550?text=Halo%20kak%20Arafah,%20saya%20sudah%20mendaftar%20dan%20membayar%20Bootcamp%20AI%20via%20Intelligo"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2.5 text-xs font-black uppercase text-[#087a3d] shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
										>
											<FaWhatsapp size={16} /> 081212258550 (Arafah)
										</a>
										<a
											href="https://wa.me/6285135453902?text=Halo%20kak%20Wisnu,%20saya%20sudah%20mendaftar%20dan%20membayar%20Bootcamp%20AI%20via%20Intelligo"
											target="_blank"
											rel="noopener noreferrer"
											className="flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2.5 text-xs font-black uppercase text-[#087a3d] shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
										>
											<FaWhatsapp size={16} /> 085135453902 (Wisnu)
										</a>
									</div>
								</div>
							</div>
						)}

						{/* Grup WhatsApp / Discord Event */}
						{linkWhatsapp ? (
							<div className="border-[3px] border-black bg-white p-5 shadow-[4px_4px_0_#191b1a]">
								<p className="text-xs font-black uppercase tracking-wider text-black mb-3">
									Grup Resmi Kegiatan:
								</p>
								<div className="flex flex-col sm:flex-row gap-3 w-full max-w-xl mx-auto justify-center items-center">
									<button
										onClick={() => window.open(linkWhatsapp, "_blank", "noopener,noreferrer")}
										className={`w-full min-w-[180px] max-w-[320px] flex-1 cursor-pointer border-[3px] border-black px-4 py-3 text-xs font-black uppercase text-white shadow-[3px_3px_0_#191b1a] transition-all hover:-translate-y-0.5 sm:text-sm ${linkWhatsapp?.toLowerCase().includes("discord") ? "bg-[#5865F2]" : "bg-[#18c964]"}`}
									>
										{linkWhatsapp?.toLowerCase().includes("discord") ? (
											<><FaDiscord className="inline mr-1" /> Gabung Discord</>
										) : (
											<><FaWhatsapp className="inline mr-1" /> Gabung Grup WhatsApp</>
										)}
									</button>
								</div>
							</div>
						) : (
							<div className="border-[3px] border-black bg-[#ffd400] p-5 text-left text-black shadow-[4px_4px_0_#191b1a]">
								<p className="text-xs font-black uppercase tracking-wider text-black">
									⌛ Menunggu Verifikasi Panitia
								</p>
								<p className="mt-1.5 text-xs text-gray-900 font-medium">
									Data berkas identitas Anda sedang dalam antrean verifikasi oleh panitia IT Today. Tautan grup WhatsApp kegiatan akan otomatis muncul di halaman ini setelah berkas Anda disetujui panitia.
								</p>
							</div>
						)}

						<div className="flex flex-row justify-center pt-2">
							<button
								onClick={() => navigate("/dashboard/ikut-event")}
								className="cursor-pointer border-[3px] border-black bg-[#ffd400] px-8 py-3.5 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a]"
							>
								Kembali ke Dashboard
							</button>
						</div>
					</div>
				) : (
					<div className="mt-7 space-y-6">
						{/* Regular form for non-bootcamp events */}
						{target !== "bootcamp" && (
							<form onSubmit={handleSubmit} className="space-y-5">
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

						{/* Clean, Non-Nested Bootcamp Flow */}
						{target === "bootcamp" && (
							<div className="space-y-6">
								{/* Case 1: Mahasiswa IPB (Free) */}
								{effectiveIsIPB && (
									<div className="space-y-6">
										<div className="border-[3px] border-black bg-white p-6 shadow-[5px_5px_0_#191b1a] text-center sm:p-8">
											{/* Intelligo Logo Container */}
											<div className="mb-5 flex items-center justify-center">
												<div className="flex h-32 w-full max-w-xs items-center justify-center border-2 border-black bg-[#f8f9fa] p-4 shadow-[4px_4px_0_#191b1a]">
													<img
														src="/sponsors/Logo-Intelligo.png"
														alt="Intelligo.id Logo"
														className="max-h-full max-w-full object-contain"
														onError={(e) => {
															e.currentTarget.style.display = "none";
															if (e.currentTarget.parentElement) {
																e.currentTarget.parentElement.innerHTML = "<span class='text-lg font-black tracking-wider text-[#1E3A8A]'>INTELLIGO.ID</span>";
															}
														}}
													/>
												</div>
											</div>

											<h3 className="text-base font-black uppercase sm:text-lg text-black">
												Bootcamp Offline Artificial Intelligence
											</h3>

											<div className="my-3 inline-block border-2 border-black bg-[#18c964] px-3.5 py-1 text-xs sm:text-sm font-black uppercase text-white shadow-[2px_2px_0_#191b1a]">
												Khusus Mahasiswa IPB: 100% Gratis
											</div>

											<p className="mx-auto mt-2 max-w-lg text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
												Sebagai mahasiswa aktif IPB University, Anda berhak mengikuti kegiatan <b>Bootcamp Offline Artificial Intelligence</b> hasil kolaborasi resmi <b>IT Today IPB × Intelligo ID</b> secara <b>GRATIS</b>.
											</p>
										</div>

										<div>
											<button
												type="button"
												onClick={async () => {
													const isComplete = await requireCompleteProfile(navigate, showGlobalAlert);
													if (!isComplete) return;
													setLoading(true);
													registerToBootcamp({
														eventId: currentEvent?.id || currentEvent?.slug || "Bootcamp",
														institutionName: currentUserProfile?.nama_sekolah || institution,
														phoneNumber: currentUserProfile?.phone_number || whatsapp,
														bundling: "",
													})
														.then(() => setSubmitted(true))
														.catch((err) => {
															setError(err.response?.data?.message || err.message || "Gagal mendaftar");
														})
														.finally(() => setLoading(false));
												}}
												disabled={loading}
												className="w-full cursor-pointer border-[3px] border-black bg-[#ffd400] px-7 py-4 text-sm sm:text-base font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
											>
												{loading ? "Memproses..." : "Daftar Bootcamp (Gratis)"}
											</button>
										</div>
									</div>
								)}

								{/* Case 2: Peserta Lomba MineToday (1 Pintu Pembayaran ke Panitia) */}
								{!effectiveIsIPB && effectiveIsMineToday && (
									<div className="space-y-5">
										<div className="border-[3px] border-black bg-[#FFF6BF] p-5 shadow-[4px_4px_0_#191b1a]">
											<p className="text-sm font-bold text-amber-950 leading-relaxed">
												Anda telah terdaftar pada kompetisi <b>MineToday</b>. Khusus peserta MineToday, Anda mendapatkan harga spesial untuk mengikuti <b>Bootcamp Offline Artificial Intelligence</b>:
											</p>

											{/* Pricing Highlight */}
											<div className="mt-3 flex flex-wrap items-center gap-2">
												<span className="text-sm sm:text-base font-bold text-gray-400 line-through">
													Rp 499.000
												</span>
												<span className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">
													Rp 50.000
												</span>
												<span className="border-2 border-black bg-[#ffd400] px-2.5 py-0.5 text-[11px] sm:text-xs font-black uppercase text-black shadow-[2px_2px_0_#191b1a]">
													Khusus Peserta MineToday
												</span>
											</div>

											<p className="mt-3 text-xs text-amber-900 font-medium">
												Pembayaran dilakukan secara 1 pintu langsung ditransfer ke rekening panitia IT Today.
											</p>
										</div>

										{/* Box Informasi Rekening Panitia */}
										<div className="border-[3px] border-black bg-[#1E3A8A] p-5 text-white shadow-[4px_4px_0_#191b1a]">
											<p className="text-xs font-bold uppercase tracking-wider text-[#ffd400] mb-2">
												Informasi Rekening Panitia:
											</p>
											<div className="border-2 border-black bg-white p-3 font-mono text-xs text-black sm:text-sm shadow-[2px_2px_0_#000]">
												<p className="font-bold text-gray-700">Bank SeaBank</p>
												<div className="mt-1 flex flex-wrap items-center justify-between gap-2">
													<span className="text-base sm:text-lg font-black tracking-widest text-[#1E3A8A]">
														901429379205
													</span>
													<button
														type="button"
														className="cursor-pointer border-2 border-black bg-[#ffd400] px-3 py-1 text-xs font-black uppercase text-black shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5"
														onClick={() => handleCopyToClipboard("901429379205", "rekening")}
													>
														{hasCopied.rekening ? "Disalin!" : "Salin No. Rekening"}
													</button>
												</div>
												<p className="mt-1 text-xs font-bold text-gray-600">
													a/n Asty Athetha Loethan
												</p>
											</div>
											<div className="mt-3 text-xs sm:text-sm text-white/95 space-y-1">
												<p>• Total Pembayaran: <b className="text-[#ffd400] font-black">Rp 50.005</b> (Biaya Rp 50.000 + Kode Unik 05)</p>
											</div>
										</div>

										{/* Upload Bukti Pembayaran */}
										<div>
											<label className="mb-2 block text-xs font-black uppercase tracking-wide">
												Upload Bukti Pembayaran (JPG/PNG/PDF, Maks 2MB) <span className="text-red-500">*</span>
											</label>
											<div
												className="flex min-h-24 w-full cursor-pointer items-center justify-center border-[3px] border-dashed border-black bg-[#f4f4f2] p-6 text-center font-bold text-black transition-transform hover:-translate-y-0.5"
												onDragOver={(e) => e.preventDefault()}
												onDrop={handlePaymentFileDrop}
												onClick={() =>
													paymentFileInputRef.current &&
													paymentFileInputRef.current.click()
												}
											>
												<FaFileUpload className="mr-2 text-xl text-[#1E3A8A]" />
												<div className="w-full overflow-hidden text-ellipsis">
													<p className="truncate text-xs sm:text-sm">
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
													<span className="font-bold text-black">{paymentFileName}</span>
												</div>
											)}
										</div>

										<div>
											<button
												type="button"
												onClick={async () => {
													const isComplete = await requireCompleteProfile(navigate, showGlobalAlert);
													if (!isComplete) return;
													if (!paymentFile) {
														setIncompleteFields([{ label: "Bukti Pembayaran (Transfer Bank)" }]);
														setShowAlert(true);
														return;
													}
													setLoading(true);
													setError("");
													try {
														const eventId = currentEvent?.id || currentEvent?.slug || "Bootcamp";
														try {
															await registerToBootcamp({
																eventId,
																institutionName: currentUserProfile?.nama_sekolah || institution,
																phoneNumber: currentUserProfile?.phone_number || whatsapp,
																bundling: "",
															});
														} catch (regErr) {
															console.log("Registration note:", regErr);
														}

														const uploadRes = await uploadBootcampPayment(paymentFile);
														if (uploadRes && uploadRes.success === false) {
															throw new Error(uploadRes.error || "Gagal mengunggah bukti pembayaran.");
														}

														setSubmitted(true);
														await showGlobalAlert({
															title: "Berhasil!",
															message: "Bukti pembayaran Bootcamp Anda berhasil dikirim dan sedang diverifikasi panitia.",
															variant: "success",
														});
													} catch (err) {
														const errorMsg =
															err.response?.data?.message ||
															err.response?.data?.error ||
															err.message ||
															"Gagal mengirim bukti pembayaran.";
														setError(errorMsg);
														await showGlobalAlert({
															title: "Gagal Mengirim",
															message: errorMsg,
															variant: "danger",
														});
													} finally {
														setLoading(false);
													}
												}}
												disabled={loading}
												className="w-full sm:w-auto cursor-pointer border-[3px] border-black bg-[#ffd400] px-7 py-3.5 text-sm font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b] active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50"
											>
												{loading ? "Mengirim Bukti Pembayaran..." : "Kirim Bukti Pembayaran"}
											</button>
										</div>
									</div>
								)}

								{/* Case 3: Peserta Umum Non-IPB & Non-MineToday (Intelligo ID Gateway) */}
								{!effectiveIsIPB && !effectiveIsMineToday && (
									<div className="space-y-6">
										{/* MineToday pending notice if user is registered in MineToday but payment not yet approved */}
										{isMineTodayPending && (
											<div className="border-[3px] border-black bg-[#FFF6BF] p-5 text-black shadow-[4px_4px_0_#191b1a]">
												<div className="flex items-center gap-2">
													<FaInfoCircle className="text-[#1E3A8A] text-lg shrink-0" />
													<p className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1E3A8A]">
														Informasi Khusus Peserta MineToday:
													</p>
												</div>
												<p className="mt-2 text-xs sm:text-sm text-gray-900 font-medium leading-relaxed">
													Kamu terdaftar di kompetisi <b>MineToday</b>. Setelah pembayaran tim MineToday kamu <b>diverifikasi & disetujui oleh panitia</b>, kamu otomatis berhak mendapatkan <b>harga khusus Bootcamp Rp 50.000</b> (diskon dari Rp 99.000).
												</p>
												<p className="mt-1.5 text-xs text-gray-800 font-medium">
													Jika kamu ingin langsung mendaftar Bootcamp sekarang sebelum verifikasi pembayaran MineToday disetujui, pendaftaran dapat dilakukan dengan tarif umum (Rp 99.000) melalui portal Intelligo ID di bawah.
												</p>
											</div>
										)}

										{/* Big Dedicated Registration Card */}
										<div className="border-[3px] border-black bg-white p-6 shadow-[5px_5px_0_#191b1a] text-center sm:p-8">
											{/* Big Intelligo Logo Container */}
											<div className="mb-5 flex items-center justify-center">
												<div className="flex h-32 w-full max-w-xs items-center justify-center border-2 border-black bg-[#f8f9fa] p-4 shadow-[4px_4px_0_#191b1a]">
													<img
														src="/sponsors/Logo-Intelligo.png"
														alt="Intelligo.id Logo"
														className="max-h-full max-w-full object-contain"
														onError={(e) => {
															e.currentTarget.style.display = "none";
															if (e.currentTarget.parentElement) {
																e.currentTarget.parentElement.innerHTML = "<span class='text-lg font-black tracking-wider text-[#1E3A8A]'>INTELLIGO.ID</span>";
															}
														}}
													/>
												</div>
											</div>

											<h3 className="text-base font-black uppercase sm:text-lg text-black">
												Portal Pendaftaran & Pembayaran Intelligo ID
											</h3>

											{/* Pricing Highlight */}
											<div className="mt-3 flex flex-wrap items-center justify-center gap-2">
												<span className="text-sm sm:text-base font-bold text-gray-400 line-through">
													Rp 499.000
												</span>
												<span className="text-2xl sm:text-3xl font-black text-[#1E3A8A]">
													Rp 99.000
												</span>
												<span className="border-2 border-black bg-[#ffd400] px-2.5 py-0.5 text-[11px] sm:text-xs font-black uppercase text-black shadow-[2px_2px_0_#191b1a]">
													Khusus IT TODAY IPB
												</span>
											</div>

											<p className="mx-auto mt-3 max-w-lg text-xs sm:text-sm font-medium text-gray-700 leading-relaxed">
												Pendaftaran dan pembayaran <b>Bootcamp Offline Artificial Intelligence</b> untuk kategori peserta umum seharga <b className="text-[#1E3A8A]">Rp 99.000</b> (khusus pendaftar melalui IT TODAY IPB) dilakukan secara 1 pintu melalui portal resmi <b>Intelligo ID</b>.
											</p>
										</div>

										<div>
											<button
												type="button"
												onClick={handleOpenIntelligoLink}
												className="w-full cursor-pointer border-[3px] border-black bg-[#ffd400] px-6 py-4 text-sm sm:text-base font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b] active:translate-x-0.5 active:translate-y-0.5"
											>
												Buka Link Pendaftaran
											</button>
										</div>

										{/* Dynamic WhatsApp Card: Muncul dinamis setelah klik Buka Link Pendaftaran */}
										{hasOpenedIntelligo && (
											<div className="border-[3px] border-black bg-[#FFF6BF] p-5 text-black shadow-[4px_4px_0_#191b1a] animate-fade-in">
												<div className="flex items-center gap-2">
													<FaWhatsapp className="text-[#087a3d]" size={18} />
													<p className="text-xs font-black uppercase tracking-wider text-[#1E3A8A]">
														Konfirmasi Pendaftaran ke WhatsApp Panitia:
													</p>
												</div>
												<p className="mt-2 text-xs text-gray-800 font-medium">
													Setelah menyelesaikan pendaftaran dan pembayaran di Intelligo ID, silakan konfirmasi ke salah satu kontak panitia:
												</p>
												<div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
													<a
														href="https://wa.me/6281212258550?text=Halo%20kak%20Arafah,%20saya%20sudah%20mendaftar%20Bootcamp%20AI%20via%20Intelligo"
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2.5 text-xs font-black uppercase text-[#087a3d] shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
													>
														<FaWhatsapp size={16} /> 081212258550 (Arafah)
													</a>
													<a
														href="https://wa.me/6285135453902?text=Halo%20kak%20Wisnu,%20saya%20sudah%20mendaftar%20Bootcamp%20AI%20via%20Intelligo"
														target="_blank"
														rel="noopener noreferrer"
														className="flex items-center justify-center gap-2 border-2 border-black bg-white px-3 py-2.5 text-xs font-black uppercase text-[#087a3d] shadow-[2px_2px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-emerald-50"
													>
														<FaWhatsapp size={16} /> 085135453902 (Wisnu)
													</a>
												</div>
											</div>
										)}
									</div>
								)}
							</div>
						)}
					</div>
				)}

				{showIntelligoModal && (
					<div
						className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
						onMouseDown={(e) => e.stopPropagation()}
						onTouchStart={(e) => e.stopPropagation()}
					>
						<div className="w-full max-w-lg border-[4px] border-black bg-white p-6 shadow-[8px_8px_0_#191b1a] sm:p-7">
							<div className="flex items-center gap-2 border-b-2 border-black pb-3">
								<FaInfoCircle className="text-2xl text-[#1E3A8A] shrink-0" />
								<h3 className="text-base font-black uppercase tracking-tight text-black sm:text-lg">
									Konfirmasi Pendaftaran Intelligo ID
								</h3>
							</div>

							<div className="py-4 space-y-3 text-xs sm:text-sm leading-relaxed text-gray-800">
								{isMineTodayPending ? (
									<div className="border-2 border-black bg-[#FFF6BF] p-3 text-amber-950 font-medium">
										⚠️ <b>Perhatian Khusus Peserta MineToday</b>:
										<p className="mt-1">
											Status pembayaran tim MineToday kamu saat ini masih <b>menunggu verifikasi panitia</b>. Jika menunggu sampai disetujui, kamu berhak mendapatkan <b>harga khusus Bootcamp Rp 50.000</b>.
										</p>
										<p className="mt-1.5 text-xs text-amber-900 font-bold">
											Apakah kamu yakin ingin tetap melanjutkan pendaftaran sekarang dengan tarif umum Rp 99.000 via Intelligo ID?
										</p>
									</div>
								) : (
									<p className="font-bold text-black">
										Kamu akan dialihkan ke portal resmi <b>Intelligo ID</b> untuk pendaftaran dan pembayaran Bootcamp seharga:
									</p>
								)}

								<div className="flex items-center justify-between border-2 border-black bg-[#f4f4f2] px-4 py-2.5 font-bold">
									<span>Total Biaya Bootcamp (Tarif Umum)</span>
									<span className="text-lg font-black text-[#1E3A8A]">Rp 99.000</span>
								</div>

								<p className="text-gray-600 text-[11px] sm:text-xs leading-relaxed">
									• Data pendaftaran akan dicatat dan setelah menyelesaikan transaksi di Intelligo ID, silakan lakukan konfirmasi ke WhatsApp panitia. Tautan grup WhatsApp resmi akan aktif setelah diverifikasi oleh panitia.
								</p>
							</div>

							<div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
								<button
									type="button"
									onClick={() => setShowIntelligoModal(false)}
									className="flex-1 cursor-pointer border-[3px] border-black bg-[#eeeeee] px-4 py-3 text-xs font-black uppercase text-black shadow-[3px_3px_0_#191b1a] transition-all hover:bg-white"
								>
									{isMineTodayPending ? "Batal (Tunggu MineToday)" : "Batal"}
								</button>
								<button
									type="button"
									onClick={handleConfirmIntelligo}
									className="flex-1 cursor-pointer border-[3px] border-black bg-[#ffd400] px-4 py-3 text-xs font-black uppercase text-black shadow-[3px_3px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-[#ffe26b]"
								>
									Ya, Lanjut ke Intelligo ID
								</button>
							</div>
						</div>
					</div>
				)}

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
				</main>
			</div>
			<Footer variant="neobrutal" />
		</div>
	);
};

export default DaftarEvent;
