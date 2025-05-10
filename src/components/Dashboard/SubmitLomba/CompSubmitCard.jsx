import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const events = [
  {
    title: "HACKTODAY",
    image: "/logo-competition/HACKTODAY.webp",
  },
  {
    title: "GAMETODAY",
    image: "/logo-competition/GAMETODAY.webp",
    submitLink: "submit-gametoday",
  },
  {
    title: "UXTODAY",
    image: "/logo-competition/UXTODAY.webp",
    submitLink: "submit-uxtoday",
  },
  {
    title: "MINETODAY",
    image: "/logo-competition/MINETODAY.webp",
    submitLink: "submit-minetoday",
  },
];

const SubmitLomba = ({ title, image, submitLink }) => {
  const navigate = useNavigate();
  return (
    <div className="font-dm-sans flex flex-col items-center text-white">
      <div className="w-[200px] h-[220px]">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover rounded-lg hover:scale-105 hover:brightness-120 transition duration-300 ease-in-out"
          />
        ) : (
          <div className="w-full h-full bg-black"></div>
        )}
      </div>
      <div className="text-center max-w-[200px]">
        <h3 className="decoration-white/50 white-text-glow text-2xl mb-5 font-bold">{title}</h3>
      </div>
      {submitLink && (
        <div className="flex gap-5">
          <button
            onClick={() => navigate("/" + submitLink)}
            className="mt-4 button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 text-sm"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

const CompSubmitCard = () => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    const shouldShow = sessionStorage.getItem("SubmissionData");
    if (shouldShow) {
      setShowSuccessAlert(true);
      setTimeout(() => {
        setShowSuccessAlert(false);
        sessionStorage.removeItem("SubmissionData");
      }, 5000);
    }
  }, []);

  return (
    <div className="h-[500px] w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-b border-[#dfb4d7]/60">
     

      {/* Header */}
      <div className="flex flex-row items-start mb-4 pb-2 gap-[45%] border-b border-[#dfb4d7]/60">
        <h2 className="text-xl font-bold text-white">Kompetisi yang Diikuti</h2>
      </div>
      
      {/* Alert */}
        {showSuccessAlert && (
            <div className="bg-green-600/90 text-white px-6 py-4 rounded-lg shadow-xl max-w-sm mb-4 self-center">
            <div className="flex justify-between items-center mb-1 gap-4">
                <h3 className="font-semibold text-md flex items-center">
                <MdCheckCircleOutline className="text-xl mr-2" />
                Form berhasil dikirim!
                </h3>
            </div>
            </div>
        )}

      {/* Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
          {events.map((event, idx) => (
            <SubmitLomba
              key={idx}
              title={event.title}
              image={event.image}
              submitLink={event.submitLink}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompSubmitCard;
