import React from "react";
import Navbar from "../../components/Navbar";
import { IoArrowUndoCircle } from "react-icons/io5";

const FallbackNotFound= () => {
    return (
        <div className="font-dm-sans flex flex-col min-h-screen items-center justify-center h-screen">
            <div className="fixed top-0 left-0 right-0 z-50">
                <Navbar />
            </div>
            <div className="flex flex-col gap-5 items-center justify-center">
                <div className="flex gap-5 items-center">
                    <h1 className="font-dm-sans input-text-glow text-pink-400 text-5xl font-bold">Waduh!</h1>
                </div>
                <div className="text-center max-w-md">
                    <p className="font-dm-sans text-base md:text-lg leading-relaxed text-pink-100 drop-shadow-[0_0_10px_#ffffff77] mb-3">
                        Halaman yang kamu tuju <span className="font-bold text-pink-300 border-b-2 border-pink-300">gak ketemu</span> nih! 
                    </p>
                    <p className="font-dm-sans text-sm md:text-base leading-relaxed text-pink-200 drop-shadow-[0_0_10px_#ffffff77]">
                        Kok kamu bisa masuk ke sini sih?
                    </p>
                </div>
                <button 
                    className="flex gap-2 custom-button-bg cursor-pointer hover:scale-105 button-hover transition-all duration-300 text-pink-100 px-4 py-2 rounded-md"
                    onClick={() => window.location.href = "/"}
                    >
                    <IoArrowUndoCircle className="text-pink-100 w-6 h-6" />
                    <span>Kembali ke Home</span>
                </button>
            </div>
        </div>
    )
}

export default FallbackNotFound;