import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaList } from "react-icons/fa";
import { FaUser } from "react-icons/fa";

// ... (import sama seperti sebelumnya)

const CompList = ({ name, currentUser, competitions = {}, onVerify, onEditUser }) => {
    const handleVerifyClick = (compKey, anggotaIdx) => {
        if (onVerify) {
            onVerify(compKey, anggotaIdx);
        }
    };

    const renderCompetition = (key, data) => (
        <div key={key} className="mb-6 pb-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-md px-4 py-3 text-white hover:scale-101 hover:bg-white/20 transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold mb-1">{data.jenisLomba}</h3>
            <p className="text-sm mb-1">
                <span className="font-semibold">Team Name:</span> {data.teamName || "-"}
            </p>
            <p className="text-sm mb-3">
                <span className="font-semibold">Team ID:</span> {data.teamID || "-"}
            </p>

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
                        <span className="text-[#fff0f0]">Not Verified</span>
                    )}
                </div>
            ))}

            <p className="mt-2 font-semibold">
                Team Status:{" "}
                <span className={data.anggota.every((a) => a.verified) ? "text-[#82f5a4]" : "text-[#f23f3f]"}>
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

            <div className="overflow-y-auto flex-1 px-4 py-2 custom-scrollbar">
                {Object.entries(competitions).map(([key, data]) => renderCompetition(key, data))}
            </div>
        </div>
    );
};

const CompListPage = () => {
    const currentUser = "Budi";

    const competitions = {
        hackToday: {
            jenisLomba: "HackToday",
            teamID: "HT2025-001",
            teamName: "CyberBoys",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ani", verified: false },
            ],
        },
        gameToday: {
            jenisLomba: "GameToday",
            teamID: "GT2025-009",
            teamName: "NoobHunter",
            anggota: [
                { nama: "Dodi", verified: true },
                { nama: "Eka", verified: true },
            ],
        },
        mineToday: {
            jenisLomba: "MineToday",
            teamID: "MT2025-777",
            teamName: "BlockBusters",
            anggota: [
                { nama: "Ali", verified: false },
                { nama: "Tina", verified: false },
            ],
        },
        uxToday: {
            jenisLomba: "UXToday",
            teamID: "UXX-03",
            teamName: "PixelPeepers",
            anggota: [
                { nama: "Budi", verified: false },
                { nama: "Ika", verified: true },
            ],
        },
    };

    const navigate = useNavigate();

    const handleVerify = (compKey, anggotaIdx) => {
        console.log(`Verifying member ${competitions[compKey].anggota[anggotaIdx].nama} in ${competitions[compKey].jenisLomba}`);
        competitions[compKey].anggota[anggotaIdx].verified = true;
    };

    const handleEditUser = () => {
        navigate("/edit-profile");
    };

    return (
        <div className="w-full lg:w-[650px]">
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
