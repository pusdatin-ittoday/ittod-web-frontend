import React, { useState, useEffect } from 'react'
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaItchIo } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { submitCompetitionFile, editCompetitionFile } from "../../api/compeFile";
import { getUserCompetitions } from "../../api/user";

const Submit_Gametoday = () => {
  const [SubmisiGame, setSubmisiGame] = useState("");
  const [TrailerGame, setTrailerGame] = useState("");
  const [ExecutiveSummary, setExecutiveSummary] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamId, setTeamId] = useState("");
  const [fileId, setFileId] = useState(""); // For edit mode
  const [isEditMode, setIsEditMode] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

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
      // Update to use custom alert
      setIncompleteFields(emptyFields);
      setAlertMessage("Mohon lengkapi kolom berikut:");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Check if we have a team ID
    if (!teamId) {
      setAlertMessage("Tidak dapat menemukan ID tim Anda untuk GameToday");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data for submission
      const gameSubmission = {
        title: "Submisi GameToday",
        url_file: {
          SubmisiGame,
          TrailerGame,
          ExecutiveSummary
        },
        team_id: teamId
      };

      let result;
      
      if (isEditMode && fileId) {
        // Edit existing submission
        gameSubmission.id = fileId;
        result = await editCompetitionFile(gameSubmission);
      } else {
        // Submit new file
        result = await submitCompetitionFile(gameSubmission);
      }

      if (!result.success) {
        throw new Error(`Failed to submit: ${result.error}`);
      }

      console.log("Form Submitted Successfully!");
      
      // Store local data for UI feedback
      const submissionData = {
        SubmisiGame,
        TrailerGame,
        ExecutiveSummary,
      };
      
      // Save to sessionStorage
      sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));
      
      // Store active tab in localStorage
      localStorage.setItem("activeTab", "submit-lomba");
      
      // Reset form
      setSubmisiGame("");
      setTrailerGame("");
      setExecutiveSummary("");
      
      // Show success message and redirect
      setAlertType("success");
      setAlertMessage(isEditMode ? "Submission berhasil diupdate!" : "Submission berhasil dikirim!");
      setShowAlert(true);
      
      setTimeout(() => {
        window.location.href = "/dashboard/submit-lomba"; // Redirect to dashboard after submission
      }, 2000);
      
    } catch (error) {
      console.error("Submission error:", error);
      setAlertType("error");
      setAlertMessage(`Gagal mengirim submission: ${error.message}`);
      setShowAlert(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  const closeAlert = () => {
    setShowAlert(false);
  }

  // Initialize navigate (may be used for future redirects)
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  // Fetch team ID and existing submission data on component mount
  useEffect(() => {
    const fetchTeamIdAndSubmission = async () => {
      try {
        const result = await getUserCompetitions();
        if (result.success && result.data) {
          // Find the GameToday competition
          const gameTodayTeam = result.data.find(comp => 
            comp.competitionName?.toLowerCase() === 'gametoday'
          );
          
          if (gameTodayTeam && gameTodayTeam.teamID) {
            setTeamId(gameTodayTeam.teamID);
            console.log("Found team ID:", gameTodayTeam.teamID);
            
            // Check if there's existing submission data
            if (gameTodayTeam.submissionID && gameTodayTeam.submissionData) {
              setFileId(gameTodayTeam.submissionID);
              setIsEditMode(true);
              
              const submissionData = gameTodayTeam.submissionData.url_file || {};
              
              // Set form fields with existing data
              if (submissionData.SubmisiGame) setSubmisiGame(submissionData.SubmisiGame);
              if (submissionData.TrailerGame) setTrailerGame(submissionData.TrailerGame);
              if (submissionData.ExecutiveSummary) setExecutiveSummary(submissionData.ExecutiveSummary);
            }
          } else {
            console.error("No GameToday team found");
            setAlertType("error");
            setAlertMessage("Anda belum terdaftar di lomba GameToday");
            setShowAlert(true);
          }
        } else {
          console.error("Failed to get user competitions:", result?.error);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    
    fetchTeamIdAndSubmission();
  }, []);

  return (
    <>
      <Navbar />
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
              <a onClick={() => {
                localStorage.setItem("activeTab", "submit-lomba");
                window.location.href = "/dashboard/submit-lomba"
              }} type='cancel' className='bg-gray-300 text-black px-4 py-2 rounded mr-2 cursor-pointer transition duration-300 hover:scale-105'>Batal</a>
              <button 
                type='submit' 
                disabled={isSubmitting}
                className={`custom-button-bg text-white px-4 py-2 rounded cursor-pointer ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'button-hover transition duration-300 ease-in-out hover:scale-105'}`}
              >
                {isSubmitting ? 'Mengirim...' : (isEditMode ? 'Update' : 'Simpan')}
              </button>
            </div>
          </form>
        </div>
      </div>

      
      {/* Custom Alert Dialog */}
      {showAlert && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black/50">
          <div className={`${alertType === 'error' ? 'bg-red-600/90' : 'bg-green-600/90'} text-white px-6 py-4 rounded-lg shadow-xl max-w-md`}>
            <div className="flex justify-between items-start mb-2 gap-5">
              <h3 className="font-bold text-lg">
                <div className="flex items-center">
                  {alertType === 'error' ? (
                    <>
                      <MdErrorOutline className="text-xl mr-2" />
                      Data belum lengkap!
                    </>
                  ) : (
                    <>
                      <MdCheckCircleOutline className="text-xl mr-2" />
                      Berhasil!
                    </>
                  )}
                </div>
              </h3>
              <button
                onClick={closeAlert}
                className={`${alertType === 'error' ? 'bg-red-700/85 hover:bg-red-800/85' : 'bg-green-700/85 hover:bg-green-800/85'} rounded-full p-1 transition-colors`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <p className="text-sm mb-2">{alertMessage}</p>
            {alertType === 'error' && incompleteFields.length > 0 && (
              <ul className="list-disc pl-5 text-sm space-y-1">
                {incompleteFields.map((field, index) => (
                  <li key={index}>{field}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Submit_Gametoday