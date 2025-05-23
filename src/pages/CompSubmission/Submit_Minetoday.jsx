import React from 'react'
import Navbar from "../../components/Navbar";
import { useNavigate } from 'react-router-dom';
import { FaGoogleDrive } from "react-icons/fa";
import { submitFileCompe } from '../../api/compeSubmit';


const Submit_Minetoday = () => {
  const [Drive, setDrive] = React.useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "Drive") {
      setDrive(value);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const emptyFields = [];
  
    const fieldLabels = {
      Drive: "Notebook, Model, Hasil Submission.csv (Drive)",
    };
  
    const fieldsToValidate = {
      Drive
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
      Drive,
    };
  
    try {
      // Submit Drive
      const driveData = {
        title: "Drive MineToday",
        url_file: Drive,
        team_id: "1", // need to change to team id from api call
      };
      const response = await submitFileCompe(driveData);
      console.log(response.data);
      // console.log("Form Submitted Successfully!");
      // console.log("Submitted Data:", submissionData);
    
      // Save to sessionStorage
      sessionStorage.setItem("SubmissionData", JSON.stringify(submissionData));
    
    
      // Reset form (optional)
      setDrive("");
    
      window.location.href = "/dashboard"; // Redirect to dashboard after submission
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim data.");
      console.log(err.message);
    }


  }

  const navigate = useNavigate();

  return (
    <>
    <Navbar />
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-[#7b446c] text-white rounded-2xl shadow-lg p-8 max-w-3xl w-full">
          <h2 className="text-lg lg:text-2xl font-dm-sans font-bold text-center mb-6">Form Submit MineToday</h2>

          {/* Form */}
          <form onSubmit={handleSubmit}  className="flex flex-col gap-4 font-dm-sans">
            <div className='mb-3 relative'>
              <label htmlFor="Drive" className='block text-sm font-bold mb-2'>Notebook, Model, Hasil Submission.csv (Drive)</label>
              <FaGoogleDrive className='absolute left-3 top-12 transform -translate-y-1/2 text-[#3D2357] text-xl'/>
              <input id='Drive' name='Drive' value={Drive} onChange={handleChange} type="text" placeholder="Link Drive notebook, model, hasil submission" className="pl-10 py-2 w-full rounded-md text-[#3D2357] bg-[#F4F0F8] focus:outline-none focus:ring-2 focus:ring-[#AC6871]" />
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

export default Submit_Minetoday