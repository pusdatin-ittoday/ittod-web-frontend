import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../api/user";
import instance from "../../api/axios";

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Remove trailing slash if present
const cleanApiUrl = API_BASE_URL.endsWith('/') 
  ? API_BASE_URL.slice(0, -1) 
  : API_BASE_URL;

const AuthCallback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 1. Check for token in URL query parameters
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        
        if (token) {
          // Store token in localStorage for future API requests
          localStorage.setItem("authToken", token);
          
          try {
            // Set the token in the axios instance for this request
            instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            
            // Use the API function to get user data
            const result = await getCurrentUser();
            
            if (result.success) {
              // Success - user data already stored by getCurrentUser
              localStorage.removeItem('redirectAfterAuth');
              navigate("/dashboard/beranda");
            } else {
              // Couldn't get user data, but we have a token so continue anyway
              console.warn("Could not fetch user data:", result.error);
              localStorage.removeItem('redirectAfterAuth');
              navigate("/dashboard/beranda");
            }
          } catch (userError) {
            // Even if user data fetch fails, continue with the token we have
            console.warn("Error fetching user data:", userError);
            localStorage.removeItem('redirectAfterAuth');
            navigate("/dashboard/beranda");
          }
        } else {
          // No token in URL - might be a cookie based auth
          console.log("No token found in URL, checking cookies...");
          
          try {
            // Try to get user data with cookies only
            const result = await getCurrentUser();
            
            if (result.success) {
              // Cookie authentication successful
              localStorage.removeItem('redirectAfterAuth');
              navigate("/dashboard/beranda");
            } else {
              throw new Error(result.error || "Could not get user information");
            }
          } catch (cookieError) {
            console.error("Cookie auth check failed:", cookieError);
            throw new Error("Authentication failed - please try logging in again");
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(typeof err === 'object' ? err.message : String(err) || "Authentication failed");
        
        // Redirect to login after showing error
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    // Execute the callback handling
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