import React from 'react'
import { submitFileCompe } from "../../api/compeSubmit.js";
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaYoutube } from "react-icons/fa";
import { FaGoogleDrive } from "react-icons/fa";

const Submit_Uxtoday = () => {
  const [TrailerKarya, setTrailerKarya] = React.useState("");
  const [Proposal, setProposal] = React.useState("");

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
      alert(`Mohon lengkapi kolom berikut:\n- ${emptyFields.join("\n- ")}`);
      return;
    }

    const submissionData = {
      TrailerKarya,
      Proposal,
    };

    // console.log("Form Submitted Successfully!");
    // console.log("Submitted Data:", submissionData);

    try {
      const filesToSubmit = [
        {
          title: "Trailer Karya UXToday",
          url_file: TrailerKarya,
          team_id: "1", // need to change to team id from api call
        },
        {
          title: "Proposal UXToday",
          url_file: Proposal,
          team_id: "1", // need to change to team id from api call
        },
      ];

      for (const fileData of filesToSubmit){
        let response = await submitFileCompe(fileData);
        console.log(response.data);
      }

      sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));

    // Reset form (optional)
    setTrailerKarya("");
    setProposal("");

    window.location.href = "/dashboard"; // Redirect to dashboard after submission
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.error(err.message);
    }
  }

  const navigate = useNavigate();

  return (
    <>
    <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">Form Submit UXToday</h2>

          {/* Form */}
          <form onSubmit={handleSubmit}  className="flex flex-col gap-4 font-dm-sans">
            <div className='mb-3 relative'>
              <label htmlFor="TrailerKarya" className='block text-sm font-bold mb-2'>Trailer Karya (youtube)</label>
              <FaYoutube className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl'/>
              <input id='TrailerKarya' name='TrailerKarya' value={TrailerKarya} onChange={handleChange} type="text" placeholder="Link Karya (Youtube)" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className='mb-3 relative'>
              <label htmlFor="Proposal" className='block text-sm font-bold mb-2'>Proposal (Drive)</label>
              <FaGoogleDrive className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl'/>
              <input id='Proposal' name='Proposal' value={Proposal} onChange={handleChange} type="text" placeholder="Link Drive Proposal" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
            </div>

            <div className="buttons flex flex-row justify-end">
              <a onClick={() => navigate("/dashboard")} type='cancel' className='bg-gray-300 text-black px-4 py-2 rounded mr-2'>Batal</a>
              <button type='submit' className='custom-button-bg text-white button-hover transition duration-300 ease-in-out hover:scale-105 px-4 py-2 rounded'>Simpan</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Submit_Uxtoday