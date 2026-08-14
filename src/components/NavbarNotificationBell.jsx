import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { getAnnouncements, getCurrentUser, markAnnouncementsAsRead } from '../api/user';

const NavbarNotificationBell = ({ variant }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const [result, userRes] = await Promise.all([
                    getAnnouncements(),
                    getCurrentUser()
                ]);
                if (result && result.success && result.data) {
                    const dataArray = Array.isArray(result.data) ? result.data : Object.values(result.data);
                    
                    const sortedData = [...dataArray].sort((a, b) => {
                        const pA = Number(a.priority) || 0;
                        const pB = Number(b.priority) || 0;
                        if (pB !== pA) return pB - pA;
                        if (b.is_pinned !== a.is_pinned) return (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
                        return new Date(b.created_at) - new Date(a.created_at);
                    });
                    
                    setAnnouncements(sortedData.slice(0, 2));
                    
                    if (dataArray.length > 0) {
                        const latest = dataArray.reduce((prev, current) => 
                            new Date(current.created_at) > new Date(prev.created_at) ? current : prev
                        );
                        const lastRead = userRes?.data?.last_read_announcements_at;
                        if (!lastRead || new Date(latest.created_at) > new Date(lastRead)) {
                            setHasUnread(true);
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to fetch announcements for bell", e);
            }
        };
        fetchAnnouncements();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
        if (!dropdownOpen && hasUnread) {
            setHasUnread(false);
            markAnnouncementsAsRead().catch(console.error);
        }
    };

    if (variant === "neo") {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="relative flex items-center justify-center border-[3px] border-black bg-[#FCD400] text-black w-10 h-10 p-1 shadow-[3px_3px_0_#111] transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#111] active:translate-x-1 active:translate-y-1 active:shadow-none"
                >
                    {hasUnread && (
                        <span className="absolute -top-1 -right-1 z-10 flex h-3 w-3 items-center justify-center rounded-full border border-black bg-red-600">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        </span>
                    )}
                    <FaBell className="text-xl" />
                </button>
                
                {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 border-[4px] border-black bg-white shadow-[6px_6px_0_0_#000] z-[9999]">
                        <div className="bg-[#FCD400] border-b-[3px] border-black p-3">
                            <h3 className="font-inter font-black text-black uppercase text-sm">Announcements</h3>
                        </div>
                        <div className="flex flex-col max-h-[300px] overflow-y-auto">
                            {announcements.length > 0 ? (
                                announcements.map((ann, idx) => (
                                    <div key={idx} className={`p-3 text-black ${idx !== announcements.length - 1 ? 'border-b-2 border-black/10' : ''} hover:bg-gray-50 transition-colors`}>
                                        <h4 className="font-inter font-bold text-sm mb-1 line-clamp-1">{ann.title}</h4>
                                        <p className="font-inter text-xs text-gray-600 line-clamp-2">{ann.description}</p>
                                        <div className="mt-2 text-[10px] text-gray-400 font-bold">
                                            {new Date(ann.created_at || ann.date).toLocaleDateString('id-ID')}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-4 text-center font-inter text-sm font-bold text-gray-500">
                                    Belum ada pengumuman
                                </div>
                            )}
                        </div>
                        <button 
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/dashboard/pengumuman");
                            }}
                            className="w-full bg-black font-inter text-white p-2 text-xs font-bold uppercase hover:bg-gray-800"
                        >
                            Lihat Semua
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={toggleDropdown}
                className="relative flex items-center justify-center text-white focus:outline-none hover:text-pink-400 transition-colors duration-300 w-8 h-8"
            >
                <FaBell className="text-xl" />
                {hasUnread && (
                    <span className="absolute top-1 right-1 z-10 flex h-2.5 w-2.5 items-center justify-center rounded-full border border-black bg-red-600">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    </span>
                )}
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 backdrop-blur-xl bg-[#302044]/95 border border-white/20 text-white rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/10">
                        <h3 className="font-dm-sans font-bold text-white text-sm">Notifications</h3>
                    </div>
                    <div className="flex flex-col max-h-[300px] overflow-y-auto custom-scrollbar">
                        {announcements.length > 0 ? (
                            announcements.map((ann, idx) => (
                                <div key={idx} className={`p-4 ${idx !== announcements.length - 1 ? 'border-b border-white/10' : ''} hover:bg-white/5 transition-colors cursor-default`}>
                                    <h4 className="font-bold text-sm mb-1 text-pink-100 line-clamp-1">{ann.title}</h4>
                                    <p className="text-xs text-gray-300 line-clamp-2">{ann.description}</p>
                                    <div className="mt-2 text-[10px] text-gray-400 font-medium">
                                        {new Date(ann.created_at || ann.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-6 text-center text-sm font-medium text-gray-400">
                                Belum ada pengumuman
                            </div>
                        )}
                    </div>
                    <div className="border-t border-white/10 p-2">
                        <button 
                            onClick={() => {
                                setDropdownOpen(false);
                                navigate("/dashboard/pengumuman");
                            }}
                            className="w-full text-center py-2 text-xs font-bold text-pink-300 hover:text-pink-200 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            Lihat Semua
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NavbarNotificationBell;
