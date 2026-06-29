import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/user";

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A1138]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Memproses login Google...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A1138]">
        <div className="text-white text-center max-w-md">
          <p className="text-lg mb-4">Terjadi kesalahan:</p>
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-sm">Mengalihkan ke halaman login...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthCallback;