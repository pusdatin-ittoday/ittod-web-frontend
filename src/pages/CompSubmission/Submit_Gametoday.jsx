import React from 'react'
import Navbar from "../../components/Navbar";

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
  
    window.location.href = "/dashboard"; // Redirect to dashboard after submission

  }


  return (
    <>
    <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">Form Submit GameToday</h2>

          {/* Form */}
          <form onSubmit={handleSubmit}  className="flex flex-col gap-4 font-dm-sans">
            <div className=''>
              <label htmlFor="SubmisiGame">Submisi Game (itch.io)</label>
              <input id='SubmisiGame' name='SubmisiGame' value={SubmisiGame} onChange={handleChange} type="text" placeholder="Link Submisi Game (itch.io)" className="text-sm lg:text-lg w-full px-4 py-2 rounded-xl text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>

            <div>
              <label htmlFor="TrailerGame">Trailer Game (youtube)</label>
              <input id='TrailerGame' name='TrailerGame' value={TrailerGame} onChange={handleChange} type="text" placeholder="Link Trailer Game (Youtube)" className="text-sm lg:text-lg w-full px-4 py-2 rounded-xl text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>

            <div>
              <label htmlFor="ExecutiveSummary">Executive Summary/Proposal (Drive)</label>
              <input id='ExecutiveSummary' name='ExecutiveSummary' value={ExecutiveSummary} onChange={handleChange} type="text" placeholder="Link Drive File Executive Summary/Proposal" className="text-sm lg:text-lg w-full px-4 py-2 rounded-xl text-black bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>

            <button type='submit' className='w-full text-center font-dm-sans font-bold border-2 text-white py-2 px-7 rounded-lg shadow-md button-hover hover:bg-neutral-100/20 transition duration-300 ease-in-out cursor-pointer'>Confirm</button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Submit_Gametoday