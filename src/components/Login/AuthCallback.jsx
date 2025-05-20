import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Ambil token dari URL (kalau ada)
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
          // Simpen token ke localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("isLoggedIn", "true");
          navigate("/dashboard");
        } else {
          // Kalau backend pake cookie, bisa cek user langsung
          const res = await axios.get("/api/auth/me", { withCredentials: true });
          if (res.data) {
            navigate("/dashboard");
          } else {
            throw new Error("User not found");
          }
        }
      } catch (err) {
        console.error("Login gagal:", err);
        localStorage.removeItem("isLoggedIn", "false");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate]);

  return <p className="text-white text-center mt-10">Logging in with Google...</p>;
};

export default AuthCallback;
