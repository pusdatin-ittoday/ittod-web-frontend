import React, { useEffect, useState } from "react";
import { MdCheckCircleOutline, MdInfo } from "react-icons/md";
import { TfiClipboard } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUserCompetitions } from "../../../api/user";
import { requireCompleteProfile } from "../../../utils/profileCompletion";

// Removed hardcoded eventsData

const CardSubmitNeo = ({ title, submitLink, isSubmitted }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-[550px] border-[4px] border-[#1A1C1C] bg-[#FFF] p-8 sm:p-12 shadow-[6px_6px_0_0_#000] flex flex-col items-center justify-between gap-6 relative overflow-hidden">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 text-[#34399F]">
          <TfiClipboard className="text-xl text-[#34399F]" />
          <span className="font-anybody text-xs sm:text-sm font-bold uppercase tracking-wider text-[#1A1C1C]">
            UPLOAD KARYA TERBAIKMU
          </span>
        </div>
        <p className="font-hanken-grotesk text-sm text-[#464652] text-center">
          Pastikan Karyamu Sudah Siap!
        </p>
      </div>

      <div className="my-6">
        <h3 className="font-anybody text-3xl sm:text-4xl font-extrabold text-[#34399F] tracking-wide uppercase text-center">
          {title}
        </h3>
      </div>

      {isSubmitted ? (
        <button
          onClick={() => navigate("/" + submitLink)}
          className="w-full flex items-center justify-center gap-2 border-[4px] border-[#1A1C1C] bg-[#BBF7D0] py-4 text-base sm:text-lg font-anybody font-extrabold text-[#166534] shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
        >
          ✓ SUBMITTED
        </button>
      ) : (
        <button
          onClick={() => navigate("/" + submitLink)}
          className="w-full flex items-center justify-center gap-3 border-[4px] border-[#1A1C1C] bg-[#34399F] py-4 text-base sm:text-lg font-anybody font-extrabold text-white shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
        >
          SUBMIT
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 20">
            <path d="M0 20V0L23.75 10L0 20ZM2.5 16.25L17.3125 10L2.5 3.75V8.125L10 10L2.5 11.875V16.25ZM2.5 16.25V10V3.75V8.125V11.875V16.25Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

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

const CompSubmitCard = ({ variant = "default" }) => {
  const navigate = useNavigate();
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [userData, setUserData] = useState({ name: "" });
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [noCompetitions, setNoCompetitions] = useState(false);

  const handleJoinTeam = async () => {
    if (await requireCompleteProfile(navigate)) {
      navigate("/dashboard/ikut-lomba", { state: { showJoinForm: true } });
    }
  };

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
        const [userResponse, competitionsResponse] = await Promise.all([
          getCurrentUser(),
          getUserCompetitions()
        ]);

        // Process user data
        if (userResponse.success && userResponse.data) {
          const fullName = userResponse.data.full_name || userResponse.data.name || "User";
          setUserData({ name: fullName });
        }

        // Process competitions data
        if (competitionsResponse.success && competitionsResponse.data) {
          setCompetitions(competitionsResponse.data);
          // Filter the events based on user's competitions that require submission AND are verified
          const userCompetitions = competitionsResponse.data || [];
          const filtered = userCompetitions
            .filter(comp => comp.requiresSubmission === true && (comp.isVerified === true || comp.isVerified === 1 || comp.isVerified === 'approved'))
            .map(comp => ({
              id: comp.competitionId,
              title: comp.competitionName,
              image: comp.logo_url,
              submitLink: `submit-competition/${comp.competitionId}`,
              isSubmitted: !!comp.submissionData
            }));

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

  if (variant === "neobrutal") {
    return (
      <div className="w-full border-[5px] border-[#1A1C1C] bg-[#F3F3F3] p-6 sm:p-9 shadow-[5px_5px_0_0_#1A1C1C] flex flex-col gap-6">
        {/* Header */}
        <div className="pb-6 border-b-2 border-dashed border-[#464652] flex flex-col gap-1.5">
          <h2 className="font-anybody text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#1A1C1C]">
            SUBMIT KARYA TERBAIK ANDA !
          </h2>
          <p className="font-hanken-grotesk text-sm sm:text-base text-[#464652]">
            Pilih Cabang Lomba yang anda ikuti
          </p>
        </div>

        {/* Alert */}
        {showSuccessAlert && (
          <div className="border-[3px] border-black bg-[#b8f2cf] p-4 text-xs font-bold text-[#166534] shadow-[4px_4px_0_0_#000] flex items-center gap-2 self-start mb-2">
            <MdCheckCircleOutline className="text-xl" />
            <span>Form berhasil dikirim!</span>
          </div>
        )}

        {/* Loading / Empty / Content states */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse text-black font-bold text-lg">Loading...</div>
          </div>
        ) : noCompetitions ? (
          <div className="w-full border-[4px] border-black bg-white p-6 sm:p-12 shadow-[6px_6px_0_0_#000]">
            <div className="w-full border-[2.4px] border-dashed border-[#34399F] bg-white p-8 sm:p-12 flex flex-col justify-center items-center gap-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <h3 className="font-anybody text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#1A1C1C]">
                  BELUM ADA LOMBA
                </h3>
                <p className="font-space-grotesk text-sm sm:text-base text-gray-500 max-w-md">
                  Kamu belum mendaftar ke lomba apapun. Yuk cari lomba dan mulai berkompetisi!
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <button
                  onClick={() => navigate("/dashboard/ikut-lomba")}
                  className="w-full sm:w-[240px] border-[2.4px] border-black bg-[#34399F] py-3 text-sm font-space-grotesk font-bold uppercase text-white shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  LIHAT DAFTAR LOMBA
                </button>
                <button
                  onClick={handleJoinTeam}
                  className="w-full sm:w-[257px] border-[2.4px] border-black bg-[#FCD400] py-3 text-sm font-space-grotesk font-bold uppercase text-[#6E5C00] shadow-[6px_6px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer"
                >
                  BERGABUNG TIM
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-items-center">
            {filteredEvents.map((event, idx) => (
              <CardSubmitNeo
                key={idx}
                title={event.title}
                submitLink={event.submitLink}
                isSubmitted={event.isSubmitted}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-[500px] w-full lg:w-[650px] bg-[#7b446c] rounded-lg shadow-lg flex flex-col p-6 border-[#dfb4d7]/60">
      {/* Header */}
      <div className="flex flex-col items-start mb-4 pb-2 border-b border-[#dfb4d7]/60">
        <div className="flex flex-col">
          <div className="flex items-center mb-1.5">
            <TfiClipboard className="text-sm sm:text-2xl input-text-glow  drop-shadow-[0_1px_6px_#FFE6FC] text-white mr-2" />
            <h2 className="text-sm sm:text-xl font-bold text-white input-text-glow drop-shadow-[0_1px_1px_#FFE6FC]">
              Upload Karya Terbaikmu
            </h2>
          </div>
          <p className="text-xs sm:text-sm pl-1 text-gray-300 ml-4.5 sm:ml-7">
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
          <MdInfo className="text-4xl sm:text-5xl text-pink-300 mb-3" />
          <h3 className="text-white text-lg sm:text-xl font-bold mb-2">Tidak ada lomba yang bisa disubmit</h3>
          <p className="text-gray-300 text-xs sm:text-xm">Kamu belum terdaftar pada lomba yang memiliki submission. Daftar lomba terlebih dahulu untuk dapat mengunggah karya.</p>
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
