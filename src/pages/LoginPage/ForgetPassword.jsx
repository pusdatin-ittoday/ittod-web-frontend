import React from "react";
import FormForgetPasswordWithRouter from "../../components/Login/FormForgetPassword";

const ForgetPassword = () => {
    return (
        <div className="flex flex-row h-screen items-center justify-center bg-cover bg-center" >
            <img
                className="max-w-full max-h-85 bg-black rounded-xl mb-4 mr-20"
                src="/DummyImg.jpg"
            />
            <FormForgetPasswordWithRouter />
        </div>
    )
}

export default ForgetPassword;