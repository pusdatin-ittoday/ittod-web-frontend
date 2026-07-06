import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/user";
import LoadingState from "../ui/LoadingState";

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Check URL parameters for errors from backend
        const params = new URLSearchParams(window.location.search);
        const urlError = params.get("error");
        
        if (urlError) {
          // Check if it's an account conflict error
          if (urlError === 'account_exists' || urlError === 'email_exists' || urlError.includes('already_registered')) {
            // Redirect to login with account conflict message
            navigate('/login?error=' + encodeURIComponent('Akun kamu sudah teregistrasi dengan email dan password. Silakan login menggunakan email dan password.'));
            return;
          } else {
            // Other errors
            const errorMessage = decodeURIComponent(urlError);
            navigate('/login?error=' + encodeURIComponent(errorMessage));
            return;
          }
        }

        // If no error, try to get user data to confirm successful login
        const userResponse = await getCurrentUser();
        
        if (userResponse.success) {
          // Notify app of auth state change
          window.dispatchEvent(new Event("auth-changed"));
          
          // Get redirect path
          const redirectPath = localStorage.getItem('redirectAfterAuth') || '/dashboard/beranda';
          localStorage.removeItem('redirectAfterAuth');
          
          navigate(redirectPath);
        } else {
          throw new Error("Authentication verification failed");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err.message);
        
        // Redirect to login with error after a delay
        setTimeout(() => {
          navigate('/login?error=' + encodeURIComponent('Terjadi kesalahan saat login dengan Google. Silakan coba lagi.'));
        }, 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div 
        className="flex flex-col min-h-screen w-full select-none items-center justify-center p-4 md:p-8"
        style={{
            background: "radial-gradient(circle at top left, #FDF5B0 0%, #E9E9F0 100%)"
        }}
      >
        <div className="w-full max-w-[460px] font-sans flex flex-col justify-center bg-white p-6 md:p-10 gap-6 border-2 md:border-[3px] border-black shadow-[10px_10px_0px_0px_#000000] md:shadow-[14px_14px_0px_0px_#000000] rounded-none">
          <h1 className="text-red-600 text-xl font-black uppercase text-center font-sans">Terjadi Kesalahan</h1>
          <p className="text-gray-700 text-sm font-medium text-center font-sans leading-relaxed">{error}</p>
          <p className="text-gray-400 text-xs text-center font-sans">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;