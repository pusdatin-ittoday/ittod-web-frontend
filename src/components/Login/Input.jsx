import React from "react";

const Input = ({ type, placeholder, value, onChange }) => {
    return (
        <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className=" bg-[#F8F5F6] text-[#40274E] placeholder:text-[#40274E] placeholder:opacity-50 rounded-md p-2 w-full focus:outline-none"
        />
    );
}

export default Input;

// #40274E