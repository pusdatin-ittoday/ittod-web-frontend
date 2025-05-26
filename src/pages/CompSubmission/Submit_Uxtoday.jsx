import React, { useState, useEffect } from 'react'
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";
import { MdErrorOutline, MdCheckCircleOutline } from "react-icons/md";
import { upsertCompetitionFile } from "../../api/compeFile";
import { getUserCompetitions } from "../../api/user";

const Submit_Uxtoday = () => {  
  // Updated state management
  const [TrailerKarya, setTrailerKarya] = useState("");
  const [Proposal, setProposal] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("error"); // "error" or "success"
  const [incompleteFields, setIncompleteFields] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teamId, setTeamId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "TrailerKarya") {
      setTrailerKarya(value);
    } else if (name === "Proposal") {
      setProposal(value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isSubmitting) return;

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
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    // Check if we have a team ID
    if (!teamId) {
      setAlertMessage("Tidak dapat menemukan ID tim Anda untuk UXToday");
      setAlertType("error");
      setShowAlert(true);
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data with the new structure
      const uxSubmission = {
        team_id: teamId,
        submission_object: {
          TrailerKarya: TrailerKarya,
          Proposal: Proposal
        }
      };

      // Submit the file using upsert function
      const submissionResult = await upsertCompetitionFile(uxSubmission);
      
      if (!submissionResult.success) {
        throw new Error(`Failed to submit: ${submissionResult.error}`);
      }

      console.log("Form Submitted Successfully!");
      
      // Store local data for UI feedback
      const submissionData = {
        TrailerKarya,
        Proposal,
      };
      
      // Save to sessionStorage
      sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));
      
      // Store active tab in localStorage
      localStorage.setItem("activeTab", "submit-lomba");
      
      // Reset form
      setTrailerKarya("");
      setProposal("");
      
      // Show success message and redirect
      setAlertType("success");
      setAlertMessage("Submission berhasil dikirim!");
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

  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  
  // Fetch team ID on component mount
  useEffect(() => {
    const fetchTeamId = async () => {
      try {
        const result = await getUserCompetitions();
        if (result.success && result.data) {
          // Find the UXToday competition
          const uxTodayTeam = result.data.find(comp => 
            comp.competitionName?.toLowerCase() === 'uxtoday'
          );
          
          if (uxTodayTeam && uxTodayTeam.teamID) {
            setTeamId(uxTodayTeam.teamID);
            console.log("Found team ID:", uxTodayTeam.teamID);
            
            // Check if there's existing submission data
            if (uxTodayTeam.submissionData) {
              const submissionData = uxTodayTeam.submissionData.submission_object || {};
              
              // Set form fields with existing data
              if (submissionData.TrailerKarya) setTrailerKarya(submissionData.TrailerKarya);
              if (submissionData.Proposal) setProposal(submissionData.Proposal);
            }
          } else {
            console.error("No UXToday team found");
            setAlertType("error");
            setAlertMessage("Anda belum terdaftar di lomba UXToday");
            setShowAlert(true);
          }
        } else {
          console.error("Failed to get user competitions:", result?.error);
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    };
    
    fetchTeamId();
  }, []);

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
              <button 
                type='submit' 
                disabled={isSubmitting}
                className={`custom-button-bg text-white px-4 py-2 rounded cursor-pointer ${isSubmitting ? 'opacity-75 cursor-not-allowed' : 'button-hover transition duration-300 ease-in-out hover:scale-105'}`}
              >
                {isSubmitting ? 'Mengirim...' : 'Simpan'}
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

export default Submit_Uxtoday