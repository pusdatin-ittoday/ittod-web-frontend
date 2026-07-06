import React, { useState, useEffect } from "react";
import { getAnnouncements, getUserCompetitions } from "../../../api/user";
import { getPublicEvents } from "../../../api/eventPublic";
import AnnouncementCard from "./AnnouncementCard";
import AnnouncementSidebar from "./AnnouncementSidebar";

const ITEMS_PER_PAGE = 3;

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex items-center justify-center gap-4 mt-8 pb-10">
            <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="grid size-12 place-items-center border-[4px] border-[#1A1C1C] bg-white text-xl text-[#1A1C1C] shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                aria-label="Previous Page"
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#1A1C1C"/>
                </svg>
            </button>
            {Array.from({ length: totalPages }, (_, pageIndex) => (
                <button
                    key={pageIndex}
                    type="button"
                    onClick={() => onPageChange(pageIndex)}
                    className={`grid size-12 place-items-center border-[4px] border-[#1A1C1C] text-base font-bold shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 ${
                        pageIndex === currentPage ? 'bg-[#FCD400] text-[#1A1C1C]' : 'bg-white text-[#1A1C1C]'
                    }`}
                >
                    {pageIndex + 1}
                </button>
            ))}
            <button
                type="button"
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
                className="grid size-12 place-items-center border-[4px] border-[#1A1C1C] bg-white text-xl text-[#1A1C1C] shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                aria-label="Next Page"
            >
                <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#1A1C1C"/>
                </svg>
            </button>
        </div>
    );
};

const PengumumanNeo = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [competitions, setCompetitions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [annResponse, compResponse, pubResponse] = await Promise.all([
                    getAnnouncements(),
                    getUserCompetitions(),
                    getPublicEvents(),
                ]);

                // 1. Process announcements
                let rawAnn = [];
                if (annResponse.success && annResponse.data) {
                    const resultData = annResponse.data;
                    if (Array.isArray(resultData)) {
                        rawAnn = resultData;
                    } else if (resultData.data && typeof resultData.data === "object") {
                        rawAnn = Object.values(resultData.data);
                    } else if (typeof resultData === "object") {
                        rawAnn = Object.values(resultData);
                    }
                }
                setAnnouncements(rawAnn);

                // 2. Process user competitions and map timelines
                let compData = [];
                if (compResponse.success && compResponse.data) {
                    compData = Array.isArray(compResponse.data)
                        ? compResponse.data
                        : Object.values(compResponse.data);
                }

                const eventTimelinesMap = {};
                if (pubResponse.success && Array.isArray(pubResponse.data)) {
                    pubResponse.data.forEach((ev) => {
                        eventTimelinesMap[ev.id] = ev.timelines || [];
                    });
                }

                const enrichedCompetitions = compData.map((c) => {
                    const compId = c.competitionId || c.competition_id;
                    return {
                        ...c,
                        id: compId,
                        title: c.competitionName || c.title || "Event",
                        timelines: eventTimelinesMap[compId] || [],
                    };
                });

                setCompetitions(enrichedCompetitions);
            } catch (error) {
                console.error("Error fetching announcements data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper to identify the category of each announcement
    const getAnnouncementCategory = (ann) => {
        return ann.event ? "event" : "umum";
    };

    // The API already scopes event-specific announcements to registrations
    // belonging to the authenticated participant.
    const visibleAnnouncements = announcements;

    // Filter list based on selected category tab
    const filteredAnnouncements = visibleAnnouncements.filter((ann) => {
        const cat = getAnnouncementCategory(ann);
        if (activeTab === "ALL") return true;
        if (activeTab === "UMUM") return cat === "umum";
        // Tab is specific event ID
        return ann.event?.id === activeTab;
    });

    // Pagination Calculation
    const totalPages = Math.ceil(filteredAnnouncements.length / ITEMS_PER_PAGE);
    const paginatedAnnouncements = filteredAnnouncements.slice(
        currentPage * ITEMS_PER_PAGE,
        (currentPage + 1) * ITEMS_PER_PAGE
    );

    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        setCurrentPage(0);
    };

    // Define Dynamic Filter Tabs
    const announcementEvents = announcements.reduce((events, announcement) => {
        if (
            announcement.event &&
            !events.some((event) => event.id === announcement.event.id)
        ) {
            events.push(announcement.event);
        }
        return events;
    }, []);
    const registeredEventTabs = [
        ...competitions.map((competition) => ({
            id: competition.id,
            title: competition.title,
        })),
        ...announcementEvents,
    ].filter(
        (event, index, events) =>
            events.findIndex((candidate) => candidate.id === event.id) === index
    );

    const filterTabs = [
        { id: "ALL", label: "ALL" },
        { id: "UMUM", label: "UMUM" },
        ...registeredEventTabs.map((event) => ({
            id: event.id,
            label: event.title.toUpperCase(),
        })),
    ];

    if (loading) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">
                <p className="border-[3px] border-[#1A1C1C] bg-[#ffd400] px-5 py-3 text-xs font-black uppercase shadow-[4px_4px_0_#1A1C1C]">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="flex flex-col xl:flex-row gap-8 justify-center items-start w-full">
            {/* Main Column */}
            <div className="flex-1 w-full flex flex-col gap-6">
                {/* Header */}
                <div className="relative mb-6 self-start">
                    <div className="transform -rotate-2 border-b-[8px] border-[#FCD400] pb-1">
                        <h1 className="font-['Anybody'] text-4xl sm:text-5xl font-extrabold uppercase text-[#34399F] tracking-tight">
                            ANNOUNCEMENTS
                        </h1>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 items-center mb-4">
                    {filterTabs.map((tab, idx) => {
                        const isActive = activeTab === tab.id;
                        const rotation = idx % 2 === 0 ? "rotate-[-2deg]" : "rotate-[2deg]";
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`transform ${rotation} border-[2px] border-[#1A1C1C] px-6 py-2.5 text-xs font-bold uppercase shadow-[4px_4px_0_#000] transition-all hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                                    isActive
                                        ? "bg-[#FCD400] text-[#6E5C00]"
                                        : "bg-white text-[#1A1C1C]"
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Announcement Cards List */}
                <div className="flex flex-col gap-6">
                    {paginatedAnnouncements.length === 0 ? (
                        <div className="border-[4px] border-[#1A1C1C] bg-white p-10 text-center shadow-[6px_6px_0_#000]">
                            <p className="font-['Space_Grotesk'] text-base font-bold text-gray-500">
                                Tidak ada pengumuman untuk kategori ini.
                            </p>
                        </div>
                    ) : (
                        paginatedAnnouncements.map((ann) => {
                            const cat = getAnnouncementCategory(ann);
                            return (
                                <AnnouncementCard
                                    key={ann.id}
                                    title={ann.title}
                                    description={ann.description}
                                    date={ann.updated_at || ann.created_at}
                                    category={cat}
                                    eventTitle={ann.event?.title}
                                />
                            );
                        })
                    )}
                </div>

                {/* Pagination Controls */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>

            {/* Sidebar Column */}
            <AnnouncementSidebar competitions={competitions} />
        </div>
    );
};

export default PengumumanNeo;
