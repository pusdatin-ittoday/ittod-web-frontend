import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { requestPasswordReset } from "../../api/user";
import Footer from "../../components/Footer";

const ForgetPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email) {
            setErrorMessage("Email harus diisi!");
            setTimeout(() => {
                setErrorMessage("");
            }, 3000);
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const result = await requestPasswordReset({ email });
            if (result.success) {
                // Redirect immediately to verify password page, passing email in routing state
                navigate("/verify-password", { state: { email } });
            } else {
                setErrorMessage(result.error || "Gagal mengirim reset password. Silakan coba lagi.");
                setLoading(false);
            }
        } catch (error) {
            console.error("Password reset error:", error);
            setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
            setLoading(false);
        }
    };

    return (
        <div 
            className="flex flex-col min-h-screen w-full select-none justify-between"
            style={{
                background: "radial-gradient(circle at top left, #FDF5B0 0%, #E9E9F0 100%)"
            }}
        >
            {/* Top Area (Navbar + Form Content) */}
            <div className="flex flex-col flex-grow">
                {/* Top Navbar Header */}
                <header className="w-full bg-[#1E3A8A] h-16 flex items-center justify-between px-6 md:px-16 border-b-2 border-black">
                    <div className="flex items-center">
                        <img
                            src="/LOGO_ITTODAY_2025.webp"
                            alt="IT Today Logo"
                            className="h-10 md:h-12 w-auto object-contain cursor-pointer"
                            onClick={() => navigate("/")}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/150x50/cccccc/ffffff?text=ITTODAY";
                            }}
                        />
                    </div>
                    <nav className="flex items-center gap-6">
                        <a 
                            href="/" 
                            className="text-white text-xs md:text-sm font-bold tracking-wider hover:text-gray-300 transition-colors uppercase font-sans"
                        >
                            Home
                        </a>
                        <a 
                            href="/event" 
                            className="text-white text-xs md:text-sm font-bold tracking-wider hover:text-gray-300 transition-colors uppercase font-sans"
                        >
                            Event
                        </a>
                    </nav>
                </header>

                {/* Main Content Area */}
                <main className="flex-grow flex items-center justify-center p-4 md:p-8">
                    {/* Visual Content Card */}
                    <div className="bg-white border-2 md:border-[3px] border-[#0A0A0A] shadow-[8px_8px_0px_0px_#0A0A0A] md:shadow-[12px_12px_0px_0px_#0A0A0A] w-full max-w-[440px] p-6 md:p-10 rounded-none">
                        
                        {/* Header Text */}
                        <h1 className="text-[#1E3A8A] font-black italic tracking-wide text-2xl md:text-3xl font-sans uppercase mb-1">
                            LUPA PASSWORD
                        </h1>
                        
                        {/* Description Text */}
                        <p className="text-[#4B5563] text-[10px] md:text-xs font-bold tracking-wider uppercase font-sans mb-8">
                            MASUKKAN EMAIL UNTUK MENERIMA LINK RESET.
                        </p>

                        {/* Alerts */}
                        {errorMessage && (
                            <div className="bg-red-600 border-2 border-black text-white px-4 py-2.5 mb-4 rounded-none font-bold text-xs uppercase tracking-wide text-center">
                                {errorMessage}
                            </div>
                        )}
                        {successMessage && (
                            <div className="bg-green-600 border-2 border-black text-white px-4 py-2.5 mb-4 rounded-none font-bold text-xs uppercase tracking-wide text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col">
                                {/* Input Label */}
                                <label className="block text-[10px] font-bold text-gray-500 tracking-wider mb-2 uppercase font-sans">
                                    EMAIL IDENTITY
                                </label>
                                
                                {/* Input Wrapper */}
                                <div className="relative flex items-center">
                                    {/* Envelope Icon */}
                                    <span className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 text-[#1E3A8A]"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                    </span>
                                    
                                    {/* Input Element */}
                                    <input
                                        type="email"
                                        placeholder="YOUR@EMAIL.COM"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border-2 border-black bg-white text-black text-xs md:text-sm font-semibold outline-none rounded-none placeholder-gray-300 focus:border-[#1E3A8A] font-sans tracking-wide uppercase transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#1E3A8A] hover:bg-[#12255c] active:bg-[#0c1b48] text-white text-xs md:text-sm font-black tracking-widest py-3.5 px-4 rounded-none border-2 border-black transition-all uppercase duration-200 select-none cursor-pointer flex items-center justify-center"
                            >
                                {loading ? "SENDING..." : "RESET PASSWORD"}
                            </button>
                        </form>

                        {/* Bottom Navigation Link */}
                        <div className="text-center">
                            <Link 
                                to="/login" 
                                className="text-[#1E3A8A] text-xs font-bold tracking-widest hover:underline transition-colors uppercase font-sans block mt-8"
                            >
                                &larr; BACK TO LOGIN
                            </Link>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default ForgetPassword;