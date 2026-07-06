import React from "react";
import FormNewPasswordWithRouter from "../../components/Login/FormNewPassword";
import NavbarNeo from "../../components/layout/Navbar";
import FooterNeo from "../../components/layout/Footer";

const NewPassword = () => {
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
                    <FormNewPasswordWithRouter />

                    {/* Bottom Decorative Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-12 select-none">
                        <span className="px-4 py-2 border-2 border-black bg-[#EF4444] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-3 select-none">
                            SECURE_PASS
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#10B981] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] rotate-3 select-none">
                            MIN_8_CHARS
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#FBBF24] text-black font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-1 select-none">
                            RESET_SUCCESS
                        </span>
                    </div>
                </main>
            </div>
            <FooterNeo />
        </div>
    )
}

export default NewPassword;