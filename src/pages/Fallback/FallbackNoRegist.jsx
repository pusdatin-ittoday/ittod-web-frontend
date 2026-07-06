import React from "react";
import NavbarNeo from "../../components/layout/Navbar";
import FooterNeo from "../../components/layout/Footer";
import { IoArrowUndoCircle } from "react-icons/io5";
import { useBatch } from "../../hooks/useRegisStatus";

const FallbackNoRegist = () => {
    const batch = useBatch();
    return (
        <div 
            className="flex flex-col min-h-screen w-full select-none justify-between"
            style={{
                background: "radial-gradient(circle at top left, #FDF5B0 0%, #E9E9F0 100%)"
            }}
        >
            <NavbarNeo />
            <div className="flex flex-col flex-grow pt-16 md:pt-20">
                <main className="flex-grow flex flex-col justify-center items-center p-4">
                    <div className="w-full max-w-[460px] font-sans flex flex-col justify-center bg-white p-6 md:p-10 gap-6 border-2 md:border-[3px] border-black shadow-[10px_10px_0px_0px_#000000] md:shadow-[14px_14px_0px_0px_#000000] rounded-none">
                        <h1 className="text-[#1E3A8A] text-4xl md:text-5xl font-black italic tracking-wide uppercase text-center font-sans mt-2">
                            Oops!
                        </h1>
                        <div className="text-center">
                            <p className="text-gray-700 text-sm md:text-base text-center font-sans leading-relaxed">
                                Pendaftaran <span className="font-black text-[#1E3A8A] border-b-2 border-black">{batch}</span> sudah ditutup nih! 
                            </p>
                            <p className="text-gray-500 text-xs md:text-sm text-center font-sans leading-relaxed mt-2 text-gray-500">
                                Tetap pantau update terbaru kami untuk batch selanjutnya ya! 🚀
                            </p>
                        </div>
                        <button 
                            className="w-full bg-[#1E3A8A] hover:bg-[#12255c] active:bg-[#0c1b48] border-2 border-black text-white text-xs md:text-sm font-bold py-3.5 px-4 rounded-none tracking-wider transition-all uppercase duration-200 select-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98] mb-4"
                            onClick={() => window.location.href = "/dashboard/beranda"}
                        >
                            <IoArrowUndoCircle className="text-white w-5 h-5" />
                            <span>Kembali ke Beranda</span>
                        </button>
                    </div>
                </main>
            </div>
            <FooterNeo />
        </div>
    )
}

export default FallbackNoRegist;