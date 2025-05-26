import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaSchool } from "react-icons/fa";

const workshopOptions = [
    "Cyber Security",
    "UI/UX",
    "Machine Learning",
];

const DaftarEvent = () => {
    const { target } = useParams(); // ambil dari path parameter
    const navigate = useNavigate();

    const [institution, setInstitution] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [workshopChoice, setWorkshopChoice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!institution.trim() || !whatsapp.trim()) {
            alert("Mohon isi semua data terlebih dahulu.");
            return;
        }
        if (target === "workshop" && !workshopChoice) {
            alert("Mohon pilih jenis workshop.");
            return;
        }
        console.log("Data Pendaftaran:", { targetEvent: target, institution, whatsapp, workshopChoice });

        setSubmitted(true);

        setTimeout(() => {
            navigate("/dashboard");
        }, 2000);
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center p-6 background: linear-gradient(135deg, #5c3b5c, #2e263c, #a86b8290); text-white font-dm-sans">
                <div className="max-w-md w-full bg-[#7b446c] rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">
                        Form Pendaftaran {target || "Event"}
                    </h2>

                    {submitted ? (
                        <div className="text-center text-green-300 font-semibold">
                            Pendaftaran berhasil! Anda akan diarahkan kembali...
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

                            {/* Dropdown khusus untuk WORKSHOP */}
                            {target === "workshop" && (
                                <div>
                                    <label className="block text-sm mb-1">Pilih Bidang Workshop</label>
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


                            <div className="buttons flex flex-row justify-end">
                                <a onClick={() => navigate("/dashboard/ikut-event")} type='cancel' className='bg-gray-300 hover:bg-gray-400 transition duration-300 ease-in-out hover:scale-105 text-black px-4 py-2 rounded mr-2 cursor-pointer'>Batal</a>
                                <button type='submit' className='custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer'>Simpan</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
};

export default DaftarEvent;
