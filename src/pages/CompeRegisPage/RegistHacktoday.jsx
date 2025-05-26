import React, { useRef, useState } from "react";
import Navbar from "../../components/Navbar.jsx";
import { MdGroups } from "react-icons/md";
import { IoMdPerson } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaFileImage } from "react-icons/fa";

const RegistHackToday = () => {
  const navigate = useNavigate();

  const [NamaTim, setNamaTim] = useState("");
  const [NamaKetuaTim, setNamaKetuaTim] = useState("");

  const [Pembayaran, setPembayaran] = useState("");
  const pembayaranRef = useRef("");
  const [fileName, setFileName] = useState("");

  const handleClick = () => {
    pembayaranRef.current.click();
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "Pembayaran" && files[0]) {
      setPembayaran(files[0]);
      setFileName(files[0].name);
    } else if (name === "NamaTim") {
      setNamaTim(value);
    } else if (name === "NamaKetuaTim") {
      setNamaKetuaTim(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = [];

    const fieldLabels = {
      NamaTim: "Nama tim",
      NamaKetuaTim: "Nama ketua tim",
      Pembayaran: "Bukti pembayaran",
    };

    const fieldsToValidate = {
      NamaTim,
      NamaKetuaTim,
      Pembayaran,
    };

    for (const key in fieldsToValidate) {
      if (
        !fieldsToValidate[key] ||
        (typeof fieldsToValidate[key] === "string" &&
          fieldsToValidate[key].trim() === "")
      ) {
        emptyFields.push(fieldLabels[key]);
      }
    }

    if (emptyFields.length > 0) {
      alert(`Mohon lengkapi kolom berikut:\n- ${emptyFields.join("\n- ")}`);
      return;
    }

    const submissionData = {
      NamaTim,
      NamaKetuaTim,
      Pembayaran,
    };

    console.log("Form Submitted Successfully!");
    console.log("Submitted Data:", submissionData);

    // Save to sessionStorage
    sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));

    // Reset form (optional)
    setNamaTim("");
    setNamaKetuaTim("");
    setFileName("");
    setPembayaran("");

    window.location.href = "/dashboard"; // Redirect to dashboard after submission
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">
            Form Daftar HackToday
          </h2>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 font-dm-sans"
          >
            <div className="mb-3 relative">
              <label htmlFor="NamaTim" className="block text-sm font-bold mb-2">
                Nama Tim
              </label>
              <MdGroups className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
              <input
                value={NamaTim}
                onChange={handleChange}
                id="NamaTim"
                name="NamaTim"
                type="text"
                placeholder="nama tim"
                className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
              />
            </div>

            <div className="mb-3 relative">
              <label
                htmlFor="NamaKetuaTim"
                className="block text-sm font-bold mb-2"
              >
                Nama Ketua Tim
              </label>
              <IoMdPerson className="absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl" />
              <input
                value={NamaKetuaTim}
                onChange={handleChange}
                id="NamaKetuaTim"
                name="NamaKetuaTim"
                type="text"
                placeholder="nama ketua tim"
                className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]"
              />
            </div>

            <div className="mb-3 relative align-middle">
              <label
                htmlFor="Pembayaran"
                className="block text-sm font-bold mb-2"
              >
                Bukti Pembayaran{" "}
              </label>
              {/*<FaFileImage  className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl'/>*/}
              <input
                type="file"
                accept={"image/*"}
                ref={pembayaranRef}
                onChange={handleChange}
                id="Pembayaran"
                name="Pembayaran"
                className="hidden"
              />

              {/* Custom styled file upload */}
              <div
                onClick={handleClick}
                className="flex flex-col gap-3 items-center space-x-2 bg-gray-100 text-[#000000] px-4 py-3 rounded-lg cursor-pointer"
              >
                <FaFileImage className="text-5xl text-[#3D2357]" />
                <span className="text-sm">
                  {fileName ? fileName : "Upload Bukti Pembayaran"}
                </span>
              </div>
            </div>

            <div className="buttons flex flex-row justify-end">
              <a
                onClick={() => navigate("/dashboard/ikut-lomba")}
                type="cancel"
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2 transition duration-300 hover:scale-105 cursor-pointer"
              >
                Batal
              </a>
              <button
                type="submit"
                className="custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistHackToday;
