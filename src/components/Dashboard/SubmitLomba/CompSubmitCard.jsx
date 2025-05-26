import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline, MdInfo } from "react-icons/md";
import { TfiClipboard } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserCompetitions } from "../../../api/user";

// Competition data mapping
const eventsData = [
  {
    id: "gametoday",
    title: "GAMETODAY",
    image: "/logo-competition/GAMETODAY.webp",
    submitLink: "submit-gametoday",
  },
  {
    id: "uxtoday",
    title: "UXTODAY",
    image: "/logo-competition/UXTODAY.webp",
    submitLink: "submit-uxtoday",
  },
  {
    id: "minetoday",
    title: "MINETODAY",
    image: "/logo-competition/MINETODAY.webp",
    submitLink: "submit-minetoday",
  },
  // HACKTODAY doesn't have a submission page
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
  const [userData, setUserData] = useState({ name: "" });
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [noCompetitions, setNoCompetitions] = useState(false);
  
  // Handle submission success alert
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
  
  // Fetch user data and competitions
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch both user profile and competitions in parallel
        const [userResponse, competitionsResponse] = await Promise.all([
          getCurrentUser(),
          getUserCompetitions()
        ]);
        
        // console.log("User Response:", userResponse.data);
        // console.log("Competitions Response:", competitionsResponse.data);

        // Process user data
        if (userResponse.success && userResponse.data) {
          const fullName = userResponse.data.full_name || userResponse.data.name || "User";
          setUserData({ name: fullName });
        }
        
        // Process competitions data
        if (competitionsResponse.success && competitionsResponse.data) {
          setCompetitions(competitionsResponse.data);
            // Filter the events based on user's competitions
          const userCompetitions = competitionsResponse.data;
          const filtered = eventsData.filter(event => {
            // Check if the user is registered for this competition using competitionName
            return userCompetitions.some(comp => 
              comp.competitionName?.toLowerCase() === event.id.toLowerCase()
            );
          });
          
          setFilteredEvents(filtered);
          setNoCompetitions(filtered.length === 0);
        } else {
          console.error("Failed to fetch competitions:", competitionsResponse.error);
          setNoCompetitions(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setNoCompetitions(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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

      {/* Loading state */}
      {loading ? (
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-pulse text-white text-lg">Loading...</div>
        </div>
      ) : noCompetitions ? (
        <div className="flex-1 flex flex-col justify-center items-center text-center px-4">
          <MdInfo className="text-5xl text-pink-300 mb-3" />
          <h3 className="text-white text-xl font-bold mb-2">Tidak ada lomba yang bisa disubmit</h3>
          <p className="text-gray-300">Kamu belum terdaftar pada lomba yang memiliki submission. Daftar lomba terlebih dahulu untuk dapat mengunggah karya.</p>
        </div>
      ) : (
        /* Grid daftar kompetisi dengan scroll */
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6 justify-items-center">
            {filteredEvents.map((event, idx) => (
              <CardSubmit
                key={idx}
                title={event.title}
                image={event.image}
                submitLink={event.submitLink}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompSubmitCard;
