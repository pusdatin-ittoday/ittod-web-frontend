import React, { useState } from 'react';
import { PiTargetBold } from 'react-icons/pi';
import { FaUsers } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { joinTeam } from "../../../api/user";
import { getPublicEvents } from "../../../api/eventPublic";

const IkutLomba = ({ title, description, image, isActive, eventId }) => {
  return (

  <div className="font-dm-sans flex flex-col items-center justify-between w-full max-w-[220px] min-h-[340px] text-white">
    <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[1/1] flex-shrink-0">
      {image ? (
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover rounded-lg hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out"
        />
      ) : (
        <div className="w-full h-full bg-black"></div>
      )}
    </div>
    <div className="flex-1 flex flex-col justify-start items-center gap-4 w-full">
      <div className="flex flex-col justify-between items-center w-full h-[140px] py-4">
        <div className="text-center w-full flex flex-col justify-start mb-1 sm:mb-4">
          <h3 className="decoration-white/50 leading-tight font-playfair text-sm sm:text-xl lg:text-xl mb-1 sm:mb-2 font-bold text-glow-beranda">{title}</h3>
          <p className="text-xs sm:text-sm leading-relaxed">{description}</p>
        </div>

        <div className="w-full flex justify-center mt-auto">
          {!isActive ? (
            <div className="text-xs sm:text-sm button-hover bg-red-500 text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer text-center">
              Pendaftaran Ditutup
            </div>
          ) : (
            <Link to={`/register-competition/${eventId.toLowerCase()}`}>
              <button
                className="text-xs sm:text-sm button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 cursor-pointer">
                Daftar Sekarang
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  </div>
)};

const CompRegisCard = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [teamId, setTeamId] = useState('');
  const [loadingJoin, setLoadingJoin] = useState(false);
  
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const res = await getPublicEvents('competition');
      if (res.success && res.data) {
        setEventsData(res.data);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoadingJoin(true);
    joinTeam(teamId)
      .then((response) => {
        alert("Berhasil bergabung dengan tim!");
        setTeamId('');
        setShowForm(false);
        navigate('/dashboard/beranda');
      }).catch((error) => {
        console.error(error);
        const errorMsg = error.response?.data?.error || error.message || "Gagal bergabung dengan tim. Pastikan kode tim benar.";
        alert(errorMsg);
      }).finally(() => {
        setLoadingJoin(false);
      });
  };

  const handleJoinTeamClick = () => {
    setShowForm(!showForm);
  };

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
            {eventsData.map((event, idx) => (
              <IkutLomba
                key={event.id}
                title={event.title}
                description={event.description}
                image={`/logo-competition/${event.id.toUpperCase()}.webp`}
                isActive={event.is_active}
                eventId={event.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompRegisCard;
