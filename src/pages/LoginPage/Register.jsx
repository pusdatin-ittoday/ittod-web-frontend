import React from "react";
import FormRegisterWithRouter from "../../components/Login/FormRegister";


const Register = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:m-0 m-10 gap-10 h-screen items-center justify-center bg-cover bg-center" >
            <img
                className="w-70 h-70 lg:w-96 lg:h-96 object-cover rounded-xl"
                src="/LOGO_ITTODAY_2025.webp"
            />
            <FormRegisterWithRouter />
        </div>
    )
}

export default Register;