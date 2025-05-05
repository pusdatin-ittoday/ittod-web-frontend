import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

// Komponen utama yang menerima props dan menampilkan data lomba
const CompList = ({ name, currentUser, competitions = {}, onVerify, onEditUser }) => {
    const handleVerifyClick = (compKey, anggotaIdx) => {
        if (onVerify) {
            onVerify(compKey, anggotaIdx);
        }
    };

    const renderCompetition = (key, data) => (
        <div key={key} className="mb-6 pb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-4 py-3 text-white hover:scale-101 hover:bg-white/20 transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-2">{data.jenisLomba}</h3>
            {data.anggota.map((anggota, idx) => (
                <div key={idx} className="flex items-center gap-4 mb-1">
                    <p className="flex-1">
                        Anggota {idx + 1}: {anggota.nama}
                    </p>
                    {anggota.verified ? (
                        <span className="text-[#82f5a4] font-semibold">✔ Verified</span>
                    ) : anggota.nama === currentUser ? (
                        <button
                            onClick={() => handleVerifyClick(key, idx)}
                            className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            Verify
                        </button>
                    ) : (
                        <span className="text[#fff0f0]">Not Verified</span>
                    )}
                </div>
            ))}

            <p className="mt-2 font-semibold">
                Team Status:{" "}
                <span
                    className={data.anggota.every((a) => a.verified) ? "text-[#82f5a4]" : "text-[#f23f3f]"}
                >
                    {data.anggota.every((a) => a.verified) ? "Verified" : "Not Verified"}
                </span>
            </p>
        </div>
    );

    return (
        <div className="max-w-full lg:w-[650px] font-dm-sans p-6 bg-[#7b446c] rounded-lg shadow-md h-[500px] flex flex-col">
            <div className="border-b border-[#dfb4d7]/60 mb-4">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-5">
                        <FaUser className="text-2xl text-white" />
                        <h2 className="text-3xl font-bold text-white tracking-wide transform transition duration-500 hover:scale-105">
                            {`Halo, ${name}!`}
                        </h2>
                    </div>


                    <button
                        onClick={onEditUser}
                        className="custom-button-bg px-4 py-1 mb-4 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
                    >
                        Edit Data
                    </button>
                </div>
            </div>
            <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <FaList className="text-xl" /> Competition List
            </h3>

            {/* Scrollable content fills remaining height */}
            <div className="overflow-y-auto flex-1 px-4 py-2 custom-scrollbar">
                {Object.entries(competitions).map(([key, data]) => renderCompetition(key, data))}
            </div>
        </div>
    );
};

// Komponen untuk menampilkan halaman dengan data kompetisi dummy
const CompListPage = () => {
    const currentUser = "Budi"; // Simulasi pengguna yang sedang login

    // Data kompetisi dummy
    const competitions = {
        hackToday: {
            jenisLomba: "HackToday",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ani", verified: false },
            ],
        },
        gameToday: {
            jenisLomba: "GameToday",
            anggota: [
                { nama: "Dodi", verified: true },
                { nama: "Eka", verified: true },
            ],
        },
        mineToday: {
            jenisLomba: "MineToday",
            anggota: [
                { nama: "Ali", verified: false },
                { nama: "Tina", verified: false },
            ],
        },
        uxToday: {
            jenisLomba: "UXToday",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ika", verified: true },
            ],
        },
    };

    // Fungsi untuk verifikasi anggota
    const handleVerify = (compKey, anggotaIdx) => {
        console.log(`Verifying member ${competitions[compKey].anggota[anggotaIdx].nama} in ${competitions[compKey].jenisLomba}`);
        // Di sini kamu bisa simpan perubahan ke backend, misal dengan axios.
        competitions[compKey].anggota[anggotaIdx].verified = true;
    };

    // Fungsi untuk mengedit data user
    const navigate = useNavigate();

    const handleEditUser = () => {
        navigate("/edit-profile"); // Ganti dengan rute yang sesuai untuk mengedit data user
        // Misalnya, buka halaman edit user atau tampilkan modal untuk mengedit data
    };

    return (
        <div className="w-full lg:w-[650px]">
            {/* Kirim data dan fungsi handleVerify ke CompList */}
            <CompList
                name="Budi"
                currentUser={currentUser}
                competitions={competitions}
                onVerify={handleVerify}
                onEditUser={handleEditUser}
            />
        </div>
    );
};

export default CompListPage;