import React, { useState } from 'react'
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import { MdErrorOutline } from "react-icons/md";

const Submit_Uxtoday = () => {
  // Updated state management
  const [TrailerKarya, setTrailerKarya] = useState("");
  const [Proposal, setProposal] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [incompleteFields, setIncompleteFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "TrailerKarya") {
      setTrailerKarya(value);
    } else if (name === "Proposal") {
      setProposal(value);
    }
  }
  
  const handleSubmit = (e) => {
    e.preventDefault();

    const emptyFields = [];

    const fieldLabels = {
      TrailerKarya: "Link Trailer Karya (YouTube)",
      Proposal: "Link Proposal dan Presentasi Penjelasan Karya (Google Drive)",
    };

    const fieldsToValidate = {
      TrailerKarya,
      Proposal
    };

    for (const key in fieldsToValidate) {
      if (!fieldsToValidate[key] || fieldsToValidate[key].trim() === "") {
        emptyFields.push(fieldLabels[key]);
      }
    }

    if (emptyFields.length > 0) {
      // Replace alert with custom alert
      setIncompleteFields(emptyFields);
      setAlertMessage("Mohon lengkapi kolom berikut:");
      setShowAlert(true);
      return;
    }

    const submissionData = {
      TrailerKarya,
      Proposal,
    };

    console.log("Form Submitted Successfully!");
    console.log("Submitted Data:", submissionData);

    // Save to sessionStorage
    sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));

    // Store active tab in localStorage
    localStorage.setItem("activeTab", "submit-lomba");

    // Reset form (optional)
    setTrailerKarya("");
    setProposal("");

    window.location.href = "/dashboard/submit-lomba"; // Redirect to dashboard after submission
  }
  
  const closeAlert = () => {
    setShowAlert(false);
  }

  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">Form Submit UXToday</h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 font-dm-sans">
            <div className='mb-3 relative'>
              <label htmlFor="TrailerKarya" className='block text-sm font-bold mb-2'>Trailer Karya (youtube)</label>
              <FaYoutube className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl' />
              <input id='TrailerKarya' name='TrailerKarya' value={TrailerKarya} onChange={handleChange} type="text" placeholder="Link Karya (Youtube)" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className='mb-3 relative'>
              <label htmlFor="Proposal" className='block text-sm font-bold mb-2'>Proposal (Drive)</label>
              <FaGoogleDrive className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl' />
              <input id='Proposal' name='Proposal' value={Proposal} onChange={handleChange} type="text" placeholder="Link Drive Proposal" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className="buttons flex flex-row justify-end">
              <a onClick={() => {
                localStorage.setItem("activeTab", "submit-lomba");
                window.location.href = "/dashboard/submit-lomba";
              }} type='cancel' className='bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer transition duration-300 hover:scale-105'>Batal</a>
              <button type='submit' className='custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded cursor-pointer'>Simpan</button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Custom Alert Dialog */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
          <div className="bg-red-600/90 text-white px-6 py-4 rounded-lg shadow-xl max-w-md">
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
            <p className="text-sm mb-2">{alertMessage}</p>
            <ul className="list-disc pl-5 text-sm space-y-1">
              {incompleteFields.map((field, index) => (
                <li key={index}>{field}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}

export default Submit_Uxtoday