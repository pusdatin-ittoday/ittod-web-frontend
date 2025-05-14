import React from "react";
import FormLoginWithRouter from "../../components/Login/FormLogin";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col m-10 gap-10 lg:flex-row lg:m-0 h-screen items-center justify-center bg-cover bg-center px-4">
             <img
                className="w-70 lg:w-96 object-cover rounded-xl hover:scale-105 transition duration-300 ease-in-out cursor-pointer"
                src="/LOGO_ITTODAY_2025.webp"
                alt="Logo ITTODAY"
                onClick={() => navigate("/")}
            />
            <FormLoginWithRouter />
        </div>
    );
};

export default Login;