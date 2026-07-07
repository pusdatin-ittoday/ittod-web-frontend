import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { loginUser, initiateGoogleLogin, resendVerificationEmail } from "../../api/user";
import Footer from "../../components/Footer";
import NavbarNeo from "../../components/layout/Navbar";

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if the user is redirected from email verification page
    const verified = location.state?.verified;
    const verificationMessage = location.state?.message;

    // Form inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // State indicators
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [needsVerification, setNeedsVerification] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // Initial effect to show verified alerts
    useEffect(() => {
        if (verified && verificationMessage) {
            setSuccessMessage(verificationMessage);
        }
    }, [verified, verificationMessage]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Clear alerts
        setErrorMessage("");
        setSuccessMessage("");
        setNeedsVerification(false);

        if (!email || !password) {
            setErrorMessage("Email dan password harus diisi!");
            return;
        }

        setLoading(true);

        try {
            const result = await loginUser({ email, password });

            if (result.success) {
                setSuccessMessage("Login berhasil! Sedang mengalihkan...");
                setLoading(false);
                setTimeout(() => {
                    navigate("/dashboard/beranda");
                }, 1000);
            } else {
                setErrorMessage(result.error || "Gagal masuk. Silakan coba lagi.");

                // Identify if verification is required
                const isVerificationError =
                    result.error?.toLowerCase().includes("verify") ||
                    result.error?.toLowerCase().includes("verifikasi") ||
                    result.error?.toLowerCase().includes("belum");

                setNeedsVerification(isVerificationError);
                setLoading(false);
            }
        } catch (error) {
            console.error("Login error:", error);
            setErrorMessage("Terjadi kesalahan sistem. Silakan coba lagi.");
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        initiateGoogleLogin();
    };

    const handleResendVerification = async () => {
        if (!email) {
            setErrorMessage("Masukkan email untuk verifikasi ulang!");
            return;
        }

        setResendLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const result = await resendVerificationEmail(email);
            if (result.success) {
                setSuccessMessage(result.message || "Email verifikasi berhasil dikirim ulang!");
                setNeedsVerification(false);
            } else {
                setErrorMessage(result.error || "Gagal mengirim email verifikasi.");
            }
        } catch (error) {
            console.error("Resend verification error:", error);
            setErrorMessage("Terjadi kesalahan. Silakan coba lagi.");
        } finally {
            setResendLoading(false);
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
            <NavbarNeo />
            <div className="flex flex-col flex-grow pt-16 md:pt-20">
                {/* Top Navbar Header */}
                {/* Main Content Area */}
                <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                    {/* Login Content Card */}
                    <div className="bg-white border-2 md:border-[3px] border-black shadow-[10px_10px_0px_0px_#000000] md:shadow-[14px_14px_0px_0px_#000000] w-full max-w-[460px] p-6 md:p-10 rounded-none my-8">

                        {/* Top Logo */}
                        <div className="flex justify-center mb-4">
                            <img
                                src="/logo-ittod.webp"
                                alt="ITTODAY Logo"
                                className="h-14 md:h-16 w-auto object-contain cursor-pointer"
                                onClick={() => navigate("/")}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://placehold.co/150x50/cccccc/ffffff?text=ITTODAY";
                                }}
                            />
                        </div>

                        {/* Sub-header "ENTER THE MULTIVERSE" */}
                        <h2 className="text-[#1E3A8A] font-black italic tracking-wide text-xl md:text-2xl font-sans uppercase text-center mt-2 mb-8 leading-tight">
                            ENTER THE <br /> MULTIVERSE
                        </h2>

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

                        {/* Resend Verification Action Button */}
                        {needsVerification && (
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={resendLoading}
                                className="w-full bg-[#1E3A8A] text-white text-xs font-bold py-2.5 px-4 rounded-none border-2 border-black hover:bg-blue-900 transition-colors uppercase mb-4 cursor-pointer"
                            >
                                {resendLoading ? "MENGIRIM..." : "Kirim Ulang Email Verifikasi"}
                            </button>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                            {/* Email Input */}
                            <div className="flex flex-col">
                                <label className="block text-[10px] md:text-xs font-extrabold text-[#1E3A8A] tracking-wider mb-1.5 uppercase font-sans">
                                    EMAIL
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="MASUKKAN EMAIL"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full pl-11 pr-4 py-3 border-2 border-black bg-white text-black text-xs md:text-sm font-semibold outline-none rounded-none placeholder-gray-300 focus:border-[#1E3A8A] font-sans tracking-wide transition-all shadow-[4px_4px_0px_0px_#000000]"
                                    />
                                </div>
                            </div>

                            {/* Password / Access Key Input */}
                            <div className="flex flex-col mt-1">
                                <label className="block text-[10px] md:text-xs font-extrabold text-[#1E3A8A] tracking-wider mb-1.5 uppercase font-sans">
                                    PASSWORD
                                </label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3.5 flex items-center justify-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-[#1E3A8A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a5 5 0 1 1-10 0 5 5 0 0 1 10 0zm-3 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm3 0h7M18 12v3.5M21 12v3.5" />
                                        </svg>
                                    </span>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="MASUKKAN PASSWORD"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                        required
                                        className="w-full pl-11 pr-10 py-3 border-2 border-black bg-white text-black text-xs md:text-sm font-semibold outline-none rounded-none placeholder-gray-300 focus:border-[#1E3A8A] font-sans tracking-wide transition-all shadow-[4px_4px_0px_0px_#000000]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3.5 flex items-center justify-center outline-none cursor-pointer select-none"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 hover:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Link Lupa Password */}
                            <div className="flex justify-end -mt-1">
                                <Link
                                    to="/forget-password"
                                    className="text-[10px] md:text-xs font-bold text-[#1E3A8A] underline hover:text-[#12255c] transition-colors"
                                >
                                    Lupa Password?
                                </Link>
                            </div>

                            {/* Submit Button MASUK */}
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#FBBF24] hover:bg-[#F59E0B] active:bg-[#D97706] text-black font-extrabold italic tracking-widest py-3.5 px-4 rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98] select-none cursor-pointer flex items-center justify-center gap-2 uppercase transition-all duration-150 text-xs md:text-sm"
                                >
                                    <span>{loading ? "MASUK..." : "MASUK"}</span>
                                </button>
                            </div>
                        </form>

                        {/* Separator ATAU */}
                        <div className="flex items-center my-6">
                            <div className="flex-grow border-t-2 border-dashed border-black"></div>
                            <span className="px-4 text-xs font-bold text-black uppercase font-sans">ATAU</span>
                            <div className="flex-grow border-t-2 border-dashed border-black"></div>
                        </div>

                        {/* Login With Google Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="w-full bg-[#1E3A8A] hover:bg-[#12255c] active:bg-[#0c1b48] border-2 border-black text-white text-xs md:text-sm font-bold py-3.5 px-4 rounded-none tracking-wider transition-all uppercase duration-200 select-none cursor-pointer flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_#000000] hover:shadow-[2px_2px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] active:scale-[0.98]"
                        >
                            <svg className="w-4 h-4 md:w-5 md:h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2A5.724 5.724 0 018.28 12.87a5.724 5.724 0 015.71-5.73 5.492 5.492 0 013.9 1.564l3.15-3.15A9.912 9.912 0 0013.99 2 9.99 9.99 0 004 12a9.99 9.99 0 009.99 10c5.518 0 9.99-4.482 9.99-10 0-.712-.082-1.397-.22-2.065H12.24z" />
                            </svg>
                            <span>LOGIN WITH GOOGLE</span>
                        </button>

                        {/* Link Back to Register */}
                        <div className="text-center mt-6">
                            <span className="text-xs font-semibold text-gray-600">Belum Punya Akun? </span>
                            <Link
                                to="/register"
                                className="text-xs font-bold text-[#1E3A8A] underline hover:text-[#12255c] uppercase tracking-wide font-sans transition-colors"
                            >
                                Daftar Sekarang
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Decorative Tags */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8 mb-12">
                        <span className="px-4 py-2 border-2 border-black bg-[#FCD34D] text-black font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-3 select-none">
                            TECH_ONLY
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#6D6D9E] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] rotate-3 select-none">
                            WIN_EXPECTED
                        </span>
                        <span className="px-4 py-2 border-2 border-black bg-[#374151] text-white font-black text-[10px] md:text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000000] -rotate-1 select-none">
                            NO_BORING_TECH
                        </span>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Login;
