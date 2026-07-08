import React, { useState, useEffect } from "react";
import { MdChevronLeft, MdChevronRight, MdEvent } from "react-icons/md";
import { getCompetitionTimelines, getEventTimelines } from "../../../api/eventPublic";

const CalendarWidget = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTimelines = async () => {
            setLoading(true);
            try {
                const [compRes, eventRes] = await Promise.all([
                    getCompetitionTimelines(),
                    getEventTimelines()
                ]);
                
                const allEvents = [];

                if (compRes.success && Array.isArray(compRes.data)) {
                    allEvents.push(...compRes.data.map(e => ({
                        ...e,
                        type: "Competition",
                        dateObj: new Date(e.start_date || e.date)
                    })));
                }

                if (eventRes.success && Array.isArray(eventRes.data)) {
                    allEvents.push(...eventRes.data.map(e => ({
                        ...e,
                        type: "Event",
                        dateObj: new Date(e.start_date || e.date)
                    })));
                }
                
                setEvents(allEvents);
            } catch (error) {
                console.error("Error fetching timelines for calendar:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTimelines();
    }, []);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Adjust to make Monday the first day of the week (0 = Mon, 6 = Sun)
    const firstDayIndex = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const handleDateClick = (day) => {
        setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    const isSameDay = (d1, d2) => {
        return d1.getDate() === d2.getDate() &&
               d1.getMonth() === d2.getMonth() &&
               d1.getFullYear() === d2.getFullYear();
    };

    const isToday = (day) => {
        const today = new Date();
        return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), today);
    };

    const isSelected = (day) => {
        return isSameDay(new Date(currentDate.getFullYear(), currentDate.getMonth(), day), selectedDate);
    };

    const getEventsForDate = (date) => {
        return events.filter(e => isSameDay(e.dateObj, date));
    };

    const getEventsForDay = (day) => {
        return getEventsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    };

    const selectedEvents = getEventsForDate(selectedDate);

    return (
        <div className="w-full border-[4px] border-[#1A1C1C] bg-[#34399F] p-5 sm:p-7 shadow-[6px_6px_0_0_#1A1C1C] flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between text-white border-b-4 border-[#1A1C1C] pb-4 mb-2">
                <div className="flex items-center gap-2.5">
                    <MdEvent className="text-3xl text-[#FCD400]" />
                    <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight font-space-grotesk">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={handlePrevMonth}
                        className="p-1 border-[3px] border-[#1A1C1C] bg-[#FCD400] text-[#1A1C1C] shadow-[3px_3px_0_0_#1A1C1C] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer"
                    >
                        <MdChevronLeft className="text-2xl" />
                    </button>
                    <button 
                        onClick={handleNextMonth}
                        className="p-1 border-[3px] border-[#1A1C1C] bg-[#FCD400] text-[#1A1C1C] shadow-[3px_3px_0_0_#1A1C1C] hover:translate-y-0.5 hover:translate-x-0.5 hover:shadow-none transition-all cursor-pointer"
                    >
                        <MdChevronRight className="text-2xl" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white border-[4px] border-[#1A1C1C] p-4 shadow-[4px_4px_0_0_#1A1C1C]">
                {loading ? (
                    <div className="flex justify-center items-center py-10 font-bold text-[#1A1C1C] font-space-grotesk animate-pulse">
                        LOADING TIMELINE...
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map(day => (
                                <div key={day} className="text-center font-black text-[10px] sm:text-xs text-[#1A1C1C] uppercase font-space-grotesk">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 sm:gap-2">
                            {Array.from({ length: firstDayIndex }).map((_, idx) => (
                                <div key={`empty-${idx}`} className="h-8 sm:h-10"></div>
                            ))}
                            {Array.from({ length: daysInMonth }).map((_, idx) => {
                                const day = idx + 1;
                                const dayEvents = getEventsForDay(day);
                                const hasEvents = dayEvents.length > 0;
                                const selected = isSelected(day);
                                const today = isToday(day);

                                return (
                                    <button
                                        key={`day-${day}`}
                                        onClick={() => handleDateClick(day)}
                                        className={`
                                            relative h-8 sm:h-10 w-full flex items-center justify-center font-bold text-sm sm:text-base cursor-pointer font-hanken-grotesk
                                            transition-all duration-200
                                            ${selected ? "border-[3px] border-[#1A1C1C] bg-[#FCD400] text-[#1A1C1C] shadow-[2px_2px_0_0_#1A1C1C]" : 
                                              today ? "border-2 border-dashed border-[#34399F] text-[#34399F] bg-blue-50" : 
                                              "text-[#464652] hover:bg-gray-100"}
                                        `}
                                    >
                                        {day}
                                        {hasEvents && !selected && (
                                            <div className="absolute bottom-0.5 sm:bottom-1 flex gap-0.5">
                                                {dayEvents.slice(0, 3).map((_, i) => (
                                                    <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#E12E55]"></div>
                                                ))}
                                            </div>
                                        )}
                                        {hasEvents && selected && (
                                            <div className="absolute bottom-0.5 sm:bottom-1 flex gap-0.5">
                                                {dayEvents.slice(0, 3).map((_, i) => (
                                                    <div key={i} className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#1A1C1C]"></div>
                                                ))}
                                            </div>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Selected Date Events */}
            <div className="bg-[#FCD400] border-[4px] border-[#1A1C1C] p-4 shadow-[4px_4px_0_0_#1A1C1C] mt-2">
                <h3 className="font-bold text-sm sm:text-base text-[#1A1C1C] mb-3 font-space-grotesk border-b-2 border-[#1A1C1C] pb-2 flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#E12E55] border-2 border-[#1A1C1C]"></div>
                    {selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                
                {selectedEvents.length > 0 ? (
                    <div className="space-y-3 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                        {selectedEvents.map((event, idx) => (
                            <div key={idx} className="bg-white border-[3px] border-[#1A1C1C] p-3 shadow-[2px_2px_0_0_#1A1C1C]">
                                <div className="text-[10px] font-bold text-[#34399F] uppercase mb-1 tracking-wider">
                                    {event.type}
                                </div>
                                <div className="font-black text-sm text-[#1A1C1C] leading-tight font-space-grotesk">
                                    {event.title}
                                </div>
                                {event.agenda && (
                                    <div className="text-xs font-semibold text-gray-600 mt-1 font-hanken-grotesk">
                                        {event.agenda}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white border-[3px] border-[#1A1C1C] p-4 text-center text-sm font-bold text-[#464652] shadow-[2px_2px_0_0_#1A1C1C] font-hanken-grotesk">
                        Tidak ada agenda pada tanggal ini.
                    </div>
                )}
            </div>
        </div>
    );
};

export default CalendarWidget;
