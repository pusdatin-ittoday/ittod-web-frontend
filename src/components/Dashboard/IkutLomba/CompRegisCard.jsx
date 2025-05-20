import React, { useState } from 'react';
import { PiTargetBold } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const events = [
  {
    title: 'HACKTODAY',
    description: 'Acara seru banget aduhai ayo join ittod yang tahun ini',
    image: '/logo-competition/HACKTODAY.webp',
    registerLink: '/register-hacktoday',
  },
  {
    title: 'GAMETODAY',
    description: 'Acara seru banget aduhai ayo join ittod yang tahun ini',
    image: '/logo-competition/GAMETODAY.webp',
    registerLink: '/register-gametoday',
  },
  {
    title: 'UXTODAY',
    description: 'Acara seru banget aduhai ayo join ittod yang tahun ini',
    image: '/logo-competition/UXTODAY.webp',
    registerLink: '/register-uxtoday',
  },
  {
    title: 'MINETODAY',
    description: 'Acara seru banget aduhai ayo join ittod yang tahun ini',
    image: '/logo-competition/MINETODAY.webp',
    registerLink: '/register-minetoday',
  },
];

const IkutLomba = ({ title, description, image, registerLink }) => (
  <div className="font-dm-sans flex flex-col items-center text-white">
    <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[1/1]">
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
    <div className="text-center max-w-[200px]">
      <h3 className="decoration-white/50 white-text-glow text-2xl mb-5 font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
    <div className="flex gap-5">
      <Link to={registerLink}>
        <button
          className="mt-4 button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 text-sm">
          Daftar Sekarang
        </button>
      </Link>
    </div>
  </div>
);

const CompRegisCard = () => {
  const [showForm, setShowForm] = useState(false);
  const [teamId, setTeamId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Berhasil join team dengan ID: ${teamId}`);
    window.location.href = '/dashboard';
  };

  // logic dengan back end :
  // const handleSubmit = async (e) => {
  //     e.preventDefault();

  //     try {
  //       const response = await fetch(`/api/teams/validate?id=${teamId}`);
  //       const data = await response.json();

  //       if (data.valid) {
  //         alert(`Berhasil join team dengan ID: ${teamId}`);
  //         window.location.href = '/';
  //       } else {
  //         alert('ID Team tidak valid. Coba lagi atau hubungi admin.');
  //       }
  //     } catch (error) {
  //       console.error('Terjadi kesalahan saat validasi:', error);
  //       alert('Gagal memvalidasi ID Team. Coba lagi nanti.');
  //     }
  //   };

  return (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
      {/* Header */}
      <div className="flex flex-row items-start justify-between mb-4 pb-2 border-b border-[#dfb4d7]/60">
        <div className="flex flex-col">
          <div className="flex items-center mb-1">
            <PiTargetBold className="text-2xl text-white mr-2" />
            <h2 className="text-xl font-bold text-white">Kompetisi yang Tersedia</h2>
          </div>
          <p className="text-sm pl-1 text-gray-300 ml-7">Pilih dan daftar kompetisi sesuai minat kamu!</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="custom-button-bg px-4 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold mb-4"
        >
          Join Team
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="text-white mb-4 p-4 bg-[#302044] rounded-lg shadow-lg"
        >
          <p className="text-sm text-red-500 mb-2">Pastikan anda sudah yakin. Jika ada kesalahan, hubungi admin.</p>
          <input
            type="text"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            placeholder="Masukkan ID Team"
            className="w-full px-3 py-2 rounded text-black mb-3 bg-gray-100"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="text-white custom-button-bg px-4 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setTeamId('');
                setShowForm(false);
              }}
              className="bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-4 py-2 rounded mr-2"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Grid daftar lomba dengan scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
          {events.map((event, idx) => (
            <IkutLomba
              key={idx}
              title={event.title}
              description={event.description}
              image={event.image}
              registerLink={event.registerLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompRegisCard;
