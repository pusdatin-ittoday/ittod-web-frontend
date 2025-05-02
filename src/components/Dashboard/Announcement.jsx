import React from "react";

const Announcement = () => {
    const announcements = [
        {
            id: 1,
            title: "HackToday: Coding Challenge",
            date: "2025-05-01",
            content:
                "Join the HackToday coding challenge. Test your skills and win exciting prizes! Registration ends May 10th.",
        },
        {
            id: 2,
            title: "National Seminar: Innovation in Technology",
            date: "2025-05-03",
            content:
                "Attend the National Seminar on Innovation in Technology. Hear from industry leaders and explore the future of tech. Limited seats!",
        },
        {
            id: 3,
            title: "UXToday: Design Your Future",
            date: "2025-05-02",
            content:
                "Submit your best UX designs to the UXToday competition. Showcase your creativity and win a chance to collaborate with top designers.",
        },
    ];

    return (
        <div className="py-4 flex flex-col bg-[#7b446c] text-white rounded-lg shadow-md w-1/3 max-w-sm h-[500px] font-dm-sans overflow-hidden">
            {/* Header */}
            <div className="mb-2 px-4 py-3 border-b text-lg font-bold text-center">
                <span className="font-rowdies">ANNOUNCEMENT</span>
            </div>

            {/* Scrollable content wrapper */}
            <div className="flex-1 overflow-hidden px-4 py-2">
                <div className="h-full overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="bg-[#302044] p-4 rounded-lg">
                            <h4 className="text-xl font-semibold">{announcement.title}</h4>
                            <p className="text-sm text-gray-400">{announcement.date}</p>
                            <p className="mt-2 text-base">{announcement.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Announcement;