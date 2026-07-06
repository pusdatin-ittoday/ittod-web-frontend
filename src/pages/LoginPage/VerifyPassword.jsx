import React from "react";
import FormVerifyPasswordWithRouter from "../../components/Login/FormVerifyPassword";
import NavbarNeo from "../../components/layout/Navbar";
import FooterNeo from "../../components/layout/Footer";

const VerifyPassword = () => {
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
                    <FormVerifyPasswordWithRouter />

                    {/* Bottom Decorative Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-12 select-none">
                        <span className="px-4 py-2 border-2 border-black bg-[#FCD34D] text-black font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-3 select-none">
                            CHECK_INBOX
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#6D6D9E] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] rotate-3 select-none">
                            VERIFY_FAST
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#374151] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-1 select-none">
                            IT_TODAY_2026
                        </span>
                    </div>
                </main>
            </div>
            <FooterNeo />
        </div>
    )
}

export default VerifyPassword;
