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
        // 1. Check for token in URL query parameters (for JWT-based flows)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        // Try to get user data (cookie-based or token-based)
        const result = await getCurrentUser();

        if (result.success) {
          // Notify app of auth state change
          window.dispatchEvent(new Event("auth-changed"));
          localStorage.removeItem('redirectAfterAuth');
          navigate("/dashboard/beranda");
        } else {
          throw new Error(result.error || "Could not get user information");
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(typeof err === 'object' ? err.message : String(err) || "Authentication failed");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    handleCallback();
  }, [navigate]);

  // Show loading or error UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#2A1138]">
        <div className="bg-red-600/90 text-white p-4 rounded-lg shadow-lg max-w-md w-full text-center">
          <p>{error}</p>
          <p className="text-sm mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2A1138]">
      {loading ? (
        <>
          <div className="w-16 h-16 border-4 border-t-[#AC6871] border-r-[#AC6871] border-b-transparent border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-xl">Processing authentication...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we verify your credentials</p>
        </>
      ) : (
        <p className="text-white text-xl">Authentication successful! Redirecting...</p>
      )}
    </div>
  );
};

export default AuthCallback;