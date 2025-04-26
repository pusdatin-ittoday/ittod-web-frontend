import React from "react";
import FormRegisterWithRouter from "../../components/Login/FormRegister";


const Register = () => {
    return (
        <div className="flex flex-row h-screen items-center justify-center bg-cover bg-center" >
            <img
                className="max-w-full max-h-85 bg-black rounded-xl mb-4 mr-20"
                src="/DummyImg.jpg"
            />
            <FormRegisterWithRouter />
        </div>
    )
}

export default Register;