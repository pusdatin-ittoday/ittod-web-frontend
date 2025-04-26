import React from "react";

const Input = ({ type, placeholder, value, onChange }) => {
    return (
        <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className ="font-dm-sans pl-10 py-2 w-full rounded-md text-[#3D2357] focus:outline-none focus:ring-2 focus:ring-[#AC6871] bg-[#F4F0F8]"
        />
    );
}

export default Input;

