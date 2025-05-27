import React, { useEffect, useState } from "react";
import { GrAnnounce } from "react-icons/gr";
import { getAnnouncements } from "../../api/user";

const Announcement = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchAnnouncements = async () => {
        setLoading(true);
        const result = await getAnnouncements();
        const resultData = result.data || {};
        if (result.success && Array.isArray(resultData) && resultData.length > 0) {
            setAnnouncements(resultData);
        } else if (result.success && typeof resultData.data === 'object' && Object.keys(resultData.data).length > 0) {
          // If data is an object with keys, convert it to an array
          setAnnouncements(Object.values(resultData.data));
        //   console.log("this: ", resultData.data);
        //   console.log("Announcements fetched successfully:", Object.values(resultData.data));
        } else {
          setAnnouncements([]); // No announcements found
        //   console.log("No announcements found or error in fetching announcements.");
        }
        setLoading(false);
      };

      fetchAnnouncements();
    }, []);

    return (
      <div className="w-full py-4 flex flex-col bg-[#7b446c] text-white rounded-lg shadow-md h-[500px] font-dm-sans overflow-hidden lg:w-[250px]">
        {/* Header */}
        <div className="border-b border-[#dfb4d7]/60 mb-3 w-full">
          <div className="px-4 py-2.5 text-lg font-bold text-center flex items-center justify-center">
            <GrAnnounce className="input-text-glow inline-block mr-2 text-2xl text-white drop-shadow-[0_1px_6px_#FFE6FC]" />
            <span className="font-dm-sans text-xl font-bold input-text-glow text-white drop-shadow-[0_1px_1px_#FFE6FC]">
              Announcements
            </span>
          </div>
        </div>

        {/* Scrollable content wrapper */}
        <div className="flex-1 overflow-hidden px-4 py-2">
          <div className="h-full overflow-y-auto pr-2 space-y-2 custom-scrollbar">
            {loading ? (
              <div className="text-center text-gray-300">Loading...</div>
            ) : announcements.length === 0 ? (
              <div className="text-center text-gray-300">
                Belum ada pengumuman.
              </div>
            ) : (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-[#302044] p-4 rounded-lg shadow-lg"
                >
                  <h4 className="text-xl font-semibold">
                    {announcement.title}
                  </h4>
                  <p className="text-sm text-gray-400">
                    {announcement.updated_at
                      ? new Date(announcement.updated_at).toLocaleDateString()
                      : ""}
                  </p>
                  <p className="mt-2 text-base">{announcement.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
};

export default Announcement;