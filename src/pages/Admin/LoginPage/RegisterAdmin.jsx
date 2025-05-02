import React from "react";
import FormRegisterAdminWithRouter from "../../../components/AdminLogin/FormRegisterAdmin";

const RegisterAdmin = () => {
  return (
    <div className="flex flex-col lg:flex-row lg:m-0 m-10 gap-10 h-screen items-center justify-center bg-cover bg-center">
      <img
        className="w-70 h-70 lg:w-96 lg:h-96 object-cover rounded-xl"
        src="/DummyImg.jpg"
        alt="Register Admin"
      />
      <FormRegisterAdminWithRouter />
    </div>
  );
};

export default RegisterAdmin;