import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline } from "react-icons/md";
import { TfiClipboard } from "react-icons/tfi"; // Add this import
import { useNavigate } from "react-router-dom";

const events = [
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

const CardSubmit = ({ title, image, submitLink }) => {
  const navigate = useNavigate();
  return (
    <div className="font-dm-sans flex flex-col items-center text-white">
      <div className="w-full max-w-[160px] sm:max-w-[180px] md:max-w-[200px] lg:max-w-[220px] aspect-[1/1]">
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
            // To this:
            onClick={() => navigate("/" + submitLink)}
            className="mt-4 button-hover custom-button-bg text-white px-3 py-1.5 rounded-lg shadow-lg font-medium hover:scale-105 transition-all duration-300 text-sm cursor-pointer"
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
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
      {/* Header */}
      <div className="flex flex-col items-start mb-4 pb-2 border-b border-[#dfb4d7]/60">
        <div className="flex flex-col">
          <div className="flex items-center mb-1.5">
            <TfiClipboard className="text-xl text-white mr-2 drop-shadow-[0_1px_8px_#FFE6FC] input-text-glow" />
            <h2 className="text-xl lg:text-xl font-bold text-white input-text-glow drop-shadow-[0_1px_12px_#FFE6FC]">
              Upload Karya Terbaikmu di Sini
            </h2>
          </div>
          <p className="text-sm text-gray-200 ml-7">
            Pastikan Karyamu Sudah Siap!
          </p>
        </div>
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

      {/* Grid daftar kompetisi dengan scroll */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
          {events.map((event, idx) => (
            <CardSubmit
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
