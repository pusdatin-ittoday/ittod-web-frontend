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
            console.log("Announcements fetched:", result); // See the structure in the console
            if (result.success) {
                // If result.data is an array, use it. If it's an object, try to extract the array.
                let list = [];
                if (Array.isArray(result.data)) {
                    list = result.data;
                } else if (result.data && Array.isArray(result.data.announcements)) {
                    list = result.data.announcements;
                }
                setAnnouncements(list);
            } else {
                setAnnouncements([]);
            }
            setLoading(false);
        };
        
        fetchAnnouncements();
    }, []);

    return (
        <div className="max-w-full py-4 flex flex-col bg-[#7b446c] text-white rounded-lg shadow-md lg:w-[250px] h-[500px] font-dm-sans overflow-hidden">
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
                        <div className="text-center text-gray-300">Belum ada pengumuman.</div>
                    ) : (
                        announcements.map((announcement) => (
                            <div key={announcement.id} className="bg-[#302044] p-4 rounded-lg">
                                <h4 className="text-xl font-semibold">{announcement.title}</h4>
                                <p className="text-sm text-gray-400">
                                    {announcement.date
                                        ? new Date(announcement.date).toLocaleDateString()
                                        : ""}
                                </p>
                                <p className="mt-2 text-base">{announcement.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Announcement;