import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar';
import { BiLogoWhatsapp } from "react-icons/bi";
import { FaSchool } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";
import { FaWhatsapp } from "react-icons/fa";
import { registerEvent } from "../utils/api/event";

const workshopOptions = [
    "Cyber Security",
    "ui/ux",
    "Machine Learning",
];

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
  "bootcamp": "bootcamp", // Change to your production ID
  "seminar": "seminar", // Change to your production ID
};

const DaftarEvent = () => {
    const { target } = useParams();
    const navigate = useNavigate();

    const [institution, setInstitution] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [workshopChoice, setWorkshopChoice] = useState("");
    const [loading, setLoading] = useState(false);
    const [linkWhatsapp, setLinkWhatsapp] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [incompleteFields, setIncompleteFields] = useState([]);
    const [error, setError] = useState("");

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

    const handleSubmit = (e) => {
      e.preventDefault();
      setError("");
      setShowAlert(false);

      const missingFields = [];
      if (!institution.trim()) missingFields.push({ label: "Institusi" });
      if (!whatsapp.trim()) missingFields.push({ label: "Nomor WhatsApp" });
      if (target === "workshop" && !workshopChoice)
        missingFields.push({ label: "Bidang Workshop" });

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

      registerEvent({
        eventId,
        intitutionName: institution,
        phoneNumber: whatsapp,
      })
        .then((response) => {
          console.log(response);
          setSubmitted(true);
        })
        .catch((error) => {
          console.error(error);
          setError("Anda sudah mendaftarkan diri!");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const closeAlert = () => {
        setShowAlert(false);
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
                        <div className="flex flex-col text-center text-green-300 font-semibold gap-3">
                            <p>Terima kasih telah mendaftar. Silahkan masuk ke grup whatsapp melalui tombol berikut:</p>
                            <button onClick={() => window.open(linkWhatsapp, "_blank")} className="bg-green-500 text-white px-4 py-2 rounded button-hover cursor-pointer hover:scale-102 transition duration-300">
                                <FaWhatsapp className="inline mr-1" /> Grup Whatsapp
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/dashboard/ikut-event");
                                }}
                                className="custom-button-bg text-white px-4 py-2 rounded button-hover cursor-pointer hover:scale-102 transition duration-300"
                            >
                                Kembali ke Beranda
                            </button>
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
                {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
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