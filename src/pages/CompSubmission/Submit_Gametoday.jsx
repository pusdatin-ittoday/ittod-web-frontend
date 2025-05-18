import React from 'react'
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaItchIo } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";

const Submit_Gametoday = () => {
  const [SubmisiGame, setSubmisiGame] = React.useState("");
  const [TrailerGame, setTrailerGame] = React.useState("");
  const [ExecutiveSummary, setExecutiveSummary] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "SubmisiGame") {
      setSubmisiGame(value);
    } else if (name === "TrailerGame") {
      setTrailerGame(value);
    } else if (name === "ExecutiveSummary") {
      setExecutiveSummary(value);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = [];

    const fieldLabels = {
      SubmisiGame: "Link Submisi Game (itch.io)",
      TrailerGame: "Link Trailer Game (YouTube)",
      ExecutiveSummary: "Link Executive Summary (Google Drive)",
    };

    const fieldsToValidate = {
      SubmisiGame,
      TrailerGame,
      ExecutiveSummary,
    };

    for (const key in fieldsToValidate) {
      if (!fieldsToValidate[key] || fieldsToValidate[key].trim() === "") {
        emptyFields.push(fieldLabels[key]);
      }
    }

    if (emptyFields.length > 0) {
      alert(`Mohon lengkapi kolom berikut:\n- ${emptyFields.join("\n- ")}`);
      return;
    }

    const submissionData = {
      SubmisiGame,
      TrailerGame,
      ExecutiveSummary,
    };

    console.log("Form Submitted Successfully!");
    console.log("Submitted Data:", submissionData);

    // Save to sessionStorage
    sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));


    // Reset form (optional)
    setSubmisiGame("");
    setTrailerGame("");
    setExecutiveSummary("");

    window.location.href = "/dashboard/submit-lomba"; // Redirect to dashboard after submission

  }

  const navigate = useNavigate();

  return (
    <>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">Form Submit GameToday</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-dm-sans">
            <div className='mb-3 relative'>
              <label htmlFor="SubmisiGame" className='block text-sm font-bold mb-2'> Submisi Game (itch.io)</label>
              <FaItchIo className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl' />
              <input id='SubmisiGame' name='SubmisiGame' value={SubmisiGame} onChange={handleChange} type="text" placeholder="Link Submisi Game (itch.io)" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className='mb-3 relative'>
              <label htmlFor="TrailerGame" className='block text-sm font-bold mb-2'>Trailer Game (youtube)</label>
              <FaYoutube className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl' />
              <input id='TrailerGame' name='TrailerGame' value={TrailerGame} onChange={handleChange} type="text" placeholder="Link Trailer Game (Youtube)" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className='mb-3 relative'>
              <label htmlFor="ExecutiveSummary" className='block text-sm font-bold mb-2'>Executive Summary/Proposal (Drive)</label>
              <FaGoogleDrive className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl' />
              <input id='ExecutiveSummary' name='ExecutiveSummary' value={ExecutiveSummary} onChange={handleChange} type="text" placeholder="Link Drive File Executive Summary/Proposal" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className="buttons flex flex-row justify-end">
              <a onClick={() => window.location.href = "/dashboard/submit-lomba"} type='cancel' className='bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer transition duration-300 hover:scale-105'>Batal</a>
              <button type='submit' className='custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer'>Simpan</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Submit_Gametoday