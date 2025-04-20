import React from "react";
import FormLoginWithRouter from "../../components/Login/FormLogin";

const Login = () => {
    return (
        <div className="flex flex-row h-screen items-center justify-center bg-cover bg-center" >
            <img
                className="max-w-full max-h-85 bg-black rounded-xl mb-4 mr-20"
                src="/DummyImg.jpg"
            />
            <FormLoginWithRouter />
        </div>
    )
}

export default Login;