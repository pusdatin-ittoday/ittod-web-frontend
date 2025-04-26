import React from "react";
import FormLoginWithRouter from "../../components/Login/FormLogin";

const Login = () => {
    return (
        <div className="flex flex-col m-10 gap-10 lg:flex-row lg:m-0 h-screen items-center justify-center bg-cover bg-center px-4">
            <img
                className="w-70 h-70 lg:w-96 lg:h-96 object-cover rounded-xl"
                src="/DummyImg.jpg"
                alt="Login Illustration"
            />
            <FormLoginWithRouter />
        </div>
    );
};

export default Login;