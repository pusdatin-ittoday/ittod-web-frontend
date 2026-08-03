import React, { useState } from 'react';
import { PiTargetBold } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { getCurrentUser, joinTeam } from "../../../api/user";
import { getPublicEvents } from "../../../api/eventPublic";
import { registerTeam } from "../../../api/compe";
import PaginationControls from "../PaginationControls";
import { requireCompleteProfile } from "../../../utils/profileCompletion";
import { useAlert } from "../../../context/AlertContext";
import { FiUserPlus } from 'react-icons/fi';

const NEO_CARD_COLORS = [
  "bg-[#e8fbef] text-[#156b3b]",
  "bg-[#565bc5] text-white",
  "bg-[#ffe26b] text-[#191b1a]",
  "bg-[#555563] text-white",
];
const ITEMS_PER_PAGE = 4;

const getLogoFallback = (title, image) => {
  if (image) return image;
  if (!title) return null;
  const t = title.toLowerCase();
  if (t.includes("code")) return "/logo-competition/CODETODAY.webp";
  if (t.includes("game")) return "/logo-competition/GAMETODAY.webp";
  if (t.includes("hack")) return "/logo-competition/HACKTODAY.webp";
  if (t.includes("mine")) return "/logo-competition/MINETODAY.webp";
  if (t.includes("ux")) return "/logo-competition/UXTODAY.webp";
  if (t.includes("workshop")) return "/logo-event/WORKSHOP.webp";
  if (t.includes("bootcamp")) return "/logo-event/BOOTCAMP.webp";
  if (t.includes("seminar")) return "/logo-event/SEMINAR-NASIONAL.webp";
  return null;
};

const getShortDescription = (title, description) => {
  if (!description) return "";
  const t = (title || "").toLowerCase();
  if (t.includes("mine")) {
    return "MineToday adalah salah satu kompetisi dalam IT Today 2026 yang bertujuan untuk menguji kemampuan peserta dalam data mining, analisis data, dan pemodelan prediktif.";
  }
  if (description.length > 200) {
    return description.substring(0, 195).trim() + "...";
  }
  return description;
};

const IkutLomba = ({ title, description, image, isActive, eventId, participationType, maxParticipants, onRegisterIndividual, onRegisterTeam, loadingRegister, variant = "default", colorIndex = 0 }) => {
  if (variant === "neobrutal") {
    const actionClass =
      "block w-full border-[3px] border-black bg-[#ffd400] px-4 py-3 text-center text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60";

    const logoSrc = getLogoFallback(title, image);
    const shortDesc = getShortDescription(title, description);

    return (
      <article
        className={`flex min-h-[210px] h-full flex-col border-[4px] border-[#191b1a] p-5 shadow-[7px_7px_0_#191b1a] sm:p-6 ${NEO_CARD_COLORS[colorIndex % NEO_CARD_COLORS.length]
          }`}
      >
        <div className="flex items-center gap-3.5">
          {logoSrc && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border-[3px] border-black bg-white p-1 shadow-[3px_3px_0_#191b1a]">
              <img
                src={logoSrc}
                alt={title}
                className="max-h-full max-w-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <h3 className="text-xl font-black uppercase leading-tight">{title}</h3>
        </div>
        <p className="mt-4 text-sm font-medium leading-relaxed opacity-80">
          {shortDesc}
        </p>
        {participationType === "team" ? (
          maxParticipants && (
            <p className="mt-2 text-xs font-bold uppercase tracking-wide opacity-90">
              Maksimal Anggota Tim: {maxParticipants} Orang
            </p>
          )
        ) : participationType === "individual" ? (
          <p className="mt-2 text-xs font-bold uppercase tracking-wide opacity-90">
            Kategori: Individu
          </p>
        ) : null}

        <div className="mt-auto pt-6">
          {!isActive ? (
            <>
              <div className="border-[3px] border-black px-4 py-3 text-center text-xs font-black uppercase text-black shadow-[4px_4px_0_#191b1a] opacity-50 pointer-events-none cursor-not-allowed">
                Pendaftaran Ditutup/Belum Dibuka
              </div>
            </>
          ) : participationType === "individual" ? (
            <button
              type="button"
              disabled={loadingRegister}
              onClick={() => onRegisterIndividual(eventId, title)}
              className={actionClass}
            >
              {loadingRegister ? "Mendaftar..." : "Daftar Sekarang"}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRegisterTeam(eventId)}
              className={actionClass}
            >
              <div className="flex justify-center items-center gap-2">
                <FiUserPlus size={20} />
                Daftar Sekarang
              </div>
            </button>
          )}
        </div>
      </article>
    );
  }

  return (

    <div className="font-dm-sans flex flex-col items-center justify-between w-full max-w-[220px] min-h-[340px] text-white">
      <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[1/1] flex-shrink-0">
        <img
          src={image || '/images/DummyImg2.jpeg'}
          alt={title}
          className="w-full h-full object-cover rounded-lg hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out"
          onError={(e) => {
            e.target.src = '/images/DummyImg2.jpeg';
          }}
        />
      </div>
      <div className="flex-1 flex flex-col justify-start items-center gap-4 w-full">
        <div className="flex flex-col justify-between items-center w-full h-[140px] py-4">
          <div className="text-center w-full flex flex-col justify-start mb-1 sm:mb-4">
            <h3 className="decoration-white/50 leading-tight font-playfair text-sm sm:text-xl lg:text-xl mb-1 sm:mb-2 font-bold text-glow-beranda">{title}</h3>
            <p className="text-xs sm:text-sm leading-relaxed">{description}</p>
            {participationType === "team" ? (
              maxParticipants && (
                <p className="text-pink-300 font-semibold text-xs mt-1 uppercase tracking-wide">
                  Maksimal Anggota Tim: {maxParticipants} Orang
                </p>
              )
            ) : participationType === "individual" ? (
              <p className="text-pink-300 font-semibold text-xs mt-1 uppercase tracking-wide">
                Kategori: Individu
              </p>
            ) : null}
          </div>

          <div className="w-full flex justify-center mt-auto">
            {!isActive ? (
              <div className="text-xs sm:text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg font-medium text-center opacity-50 pointer-events-none cursor-not-allowed">
                Pendaftaran Ditutup/Belum Dibuka
              </div>
            ) : participationType === 'individual' ? (
              <button
                type="button"
                disabled={loadingRegister}
                onClick={() => onRegisterIndividual(eventId, title)}
                className="text-xs sm:text-sm button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60">
                {loadingRegister ? 'Mendaftar...' : 'Daftar Sekarang'}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onRegisterTeam(eventId)}
                className="text-xs sm:text-sm button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer">
                Daftar Sekarang
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

const CompRegisCard = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showAlert } = useAlert();
  const [showForm, setShowForm] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [loadingJoin, setLoadingJoin] = useState(false);

  React.useEffect(() => {
    if (location.state?.showJoinForm) {
      setShowForm(true);
    }
  }, [location.state]);

  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const handleRegisterIndividual = async (eventId, eventTitle) => {
    if (loadingRegister) return;
    if (!(await requireCompleteProfile(navigate, showAlert))) {
      return;
    }

    const confirmed = await showAlert({
      message: `Apakah kamu yakin ingin mendaftar ${eventTitle}? Pendaftaran ini bersifat individu dan tidak menggunakan tim.`,
      isConfirm: true
    });

    if (!confirmed) {
      return;
    }

    try {
      setLoadingRegister(true);
      const userRes = await getCurrentUser();
      if (!userRes.success || !userRes.data) {
        await showAlert({ message: "Gagal mendapatkan data user" });
        return;
      }
      const user = userRes.data;

      const res = await registerTeam({
        competition_id: eventId,
        team_name: user.name || user.email.split('@')[0]
      });

      if (res.success) {
        await showAlert({ message: "Pendaftaran berhasil!" });
        window.location.href = "/dashboard/ikut-lomba";
      } else {
        await showAlert({ message: res.error || "Gagal mendaftar" });
      }
    } catch {
      await showAlert({ message: "Terjadi kesalahan sistem saat mendaftar" });
    } finally {
      setLoadingRegister(false);
    }
  };

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await getPublicEvents('competition');
      if (res.success && res.data) {
        setEventsData(res.data);
        setCurrentPage(0);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const totalPages = Math.ceil(eventsData.length / ITEMS_PER_PAGE);
  const visibleEvents = eventsData.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handleRegisterTeam = async (eventId) => {
    if (!(await requireCompleteProfile(navigate, showAlert))) {
      return;
    }

    navigate(`/register-competition/${eventId.toLowerCase()}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loadingJoin) return;

    if (!(await requireCompleteProfile(navigate, showAlert))) {
      return;
    }

    setLoadingJoin(true);

    try {
      await joinTeam(teamId);
      await showAlert({ message: "Berhasil bergabung dengan tim!" });
      setTeamId('');
      setShowForm(false);
      navigate('/dashboard/beranda');
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error || error.message || "Gagal bergabung dengan tim. Pastikan kode tim benar.";
      await showAlert({ message: errorMsg });
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleJoinTeamClick = async () => {
    if (showForm) {
      setShowForm(false);
      return;
    }

    if (!(await requireCompleteProfile(navigate, showAlert))) {
      return;
    }

    setShowForm(true);
  };

  if (variant === "neobrutal") {
    if (showForm) {
      return (
        <section className="min-h-[500px] border-[4px] border-[#191b1a] bg-[#f4f4f2] p-4 shadow-[8px_8px_0_#191b1a] sm:p-6 lg:p-8">
          <div className="border-[3px] border-black bg-white p-6 shadow-[7px_7px_0_#191b1a] sm:p-8 lg:p-10">
            <h1 className="text-2xl font-black sm:text-3xl">
              Join Existing Team
            </h1>
            <p className="mt-2 text-sm font-semibold text-[#806400] sm:text-base">
              Pastikan anda sudah yakin. Jika ada kesalahan, hubungi admin.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-5">
              <label htmlFor="join-team-code" className="sr-only">
                Join Code Tim
              </label>
              <input
                id="join-team-code"
                type="text"
                value={teamId}
                onChange={(e) => setTeamId(e.target.value)}
                placeholder="Masukkan Join Code Tim"
                className="w-full border-[3px] border-black bg-white px-5 py-4 text-base font-bold text-black outline-none placeholder:font-medium placeholder:text-gray-400 focus:bg-[#fff6bf]"
                required
              />

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={loadingJoin}
                  className="order-1 border-[3px] border-black bg-[#ffd400] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-50 sm:order-none"
                >
                  {loadingJoin ? "Submitting..." : "Submit"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTeamId("");
                    setShowForm(false);
                  }}
                  className="border-[3px] border-black bg-[#eeeeee] px-7 py-3 text-sm font-black uppercase text-black shadow-[5px_5px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[7px_7px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </section>
      );
    }

    return (
      <section className="border-[4px] border-[#191b1a] bg-white p-5 shadow-[8px_8px_0_#191b1a] sm:p-7 lg:p-8">
        <div className="flex flex-col gap-4 border-b-2 border-dashed border-[#191b1a] pb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight sm:text-2xl">
              Kompetisi yang Tersedia
            </h1>
            <p className="mt-1 text-xs font-medium text-gray-600 sm:text-sm">
              Pilih dan daftar kompetisi sesuai minat kamu!
            </p>
          </div>

          <button
            type="button"
            onClick={handleJoinTeamClick}
            className="flex items-center justify-center gap-2 border-[3px] border-black bg-[#3f46b8] px-5 py-3 text-xs font-black uppercase text-white shadow-[4px_4px_0_#191b1a] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_#191b1a] active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            <FaUsers />
            Join Team
          </button>
        </div>

        {loading ? (
          <div className="flex min-h-[420px] items-center justify-center">
            <p className="border-[3px] border-black bg-[#ffd400] px-5 py-3 text-sm font-black uppercase shadow-[4px_4px_0_#191b1a]">
              Loading...
            </p>
          </div>
        ) : eventsData.length === 0 ? (
          <div className="flex min-h-[420px] items-center justify-center text-center">
            <p className="max-w-sm border-[3px] border-black bg-[#e8fbef] px-5 py-4 text-sm font-black uppercase shadow-[5px_5px_0_#191b1a]">
              Belum ada kompetisi yang tersedia.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-7 py-7 md:grid-cols-2 lg:gap-8">
              {visibleEvents.map((event, idx) => (
                <IkutLomba
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  image={event.logo_url}
                  isActive={event.is_active}
                  eventId={event.id}
                  participationType={event.participation_type}
                  maxParticipants={event.max_member}
                  onRegisterIndividual={handleRegisterIndividual}
                  onRegisterTeam={handleRegisterTeam}
                  loadingRegister={loadingRegister}
                  variant="neobrutal"
                  colorIndex={currentPage * ITEMS_PER_PAGE + idx}
                />
              ))}
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </section>
    );
  }

  return (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-4 sm:p-6 border-[#dfb4d7]/60">
      {/* Header */}
      <div className="border-b border-[#dfb4d7]/60 mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-2">
          <div className='flex flex-col gap-1'>
            <div className="flex items-center gap-2 sm:gap-3">
              <PiTargetBold className="text-lg sm:text-xl lg:text-2xl input-text-glow drop-shadow-[0_1px_6px_#FFE6FC] text-white" />
              <h2 className="text-sm sm:text-xl font-bold text-white input-text-glow drop-shadow-[0_1px_1px_#FFE6FC]">
                Kompetisi yang Tersedia
              </h2>
            </div>
            <p className="text-xs sm:text-sm pl-1 text-gray-300 ml-5.5 sm:ml-7">
              Pilih dan daftar kompetisi sesuai minat kamu!
            </p>
          </div>
          <div className="flex items-center">
            <button
              onClick={handleJoinTeamClick}
              className="custom-button-bg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded button-hover transition duration-300 hover:scale-105 font-semibold cursor-pointer w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <FaUsers className="text-xs sm:text-sm" />
              Join Team
            </button>
          </div>
        </div>


      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md p-4 text-white">
          <h3 className="text-sm sm:text-base font-bold mb-2">Join Existing Team</h3>
          <p className="text-xs sm:text-sm text-red-300 mb-3">
            Pastikan anda sudah yakin. Jika ada kesalahan, hubungi admin.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              placeholder="Masukkan Join Code Tim"
              className="w-full px-3 py-2 rounded text-black bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
              required
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loadingJoin}
                className="custom-button-bg px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded button-hover transition duration-300 hover:scale-105 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingJoin ? 'Submitting...' : 'Submit'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setTeamId('');
                  setShowForm(false);
                }}
                className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid daftar lomba dengan scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-1 sm:px-2 py-2">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-white">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 sm:gap-x-8 gap-y-6 justify-items-center">
            {eventsData.map((event) => (
              <IkutLomba
                key={event.id}
                title={event.title}
                description={event.description}
                image={event.logo_url}
                isActive={event.is_active}
                eventId={event.id}
                participationType={event.participation_type}
                onRegisterIndividual={handleRegisterIndividual}
                onRegisterTeam={handleRegisterTeam}
                loadingRegister={loadingRegister}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompRegisCard;
