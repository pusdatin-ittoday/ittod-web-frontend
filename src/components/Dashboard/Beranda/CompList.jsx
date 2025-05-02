import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { GrAnnounce } from "react-icons/gr";
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
        <div className="font-dm-sans p-6 bg-[#7b446c] rounded-md shadow-md w-[650px] h-[500px] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold text-white tracking-wide transform transition duration-500 hover:scale-105">
                    {`Halo, ${name}!`}
                </h2>
                <button
                    onClick={onEditUser}
                    className="custom-button-bg px-4 py-1 rounded button-hover transition duration-300 hover:scale-105 font-semibold"
                >
                    Edit Data
                </button>
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
    const handleEditUser = () => {
        console.log("Editing user data...");
        // Misalnya, buka halaman edit user atau tampilkan modal untuk mengedit data
        alert("Edit Data User");
    };

    return (
        <div>
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
