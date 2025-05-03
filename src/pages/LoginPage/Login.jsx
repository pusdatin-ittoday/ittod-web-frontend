import React from "react";
import FormLoginWithRouter from "../../components/Login/FormLogin";

const Login = () => {
    return (
        <div className="flex flex-col m-10 gap-10 lg:flex-row lg:m-0 h-screen items-center justify-center bg-cover bg-center px-4">
            <img
                className="w-70 lg:w-96 rounded-xl"
                src="/LOGO_ITTODAY_2025.webp"
                alt="Login Illustration"
            />
            <FormLoginWithRouter />
        </div>
    );
};

export default Login;