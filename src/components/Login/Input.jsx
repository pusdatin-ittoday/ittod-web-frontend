import React from "react";

const Input = ({ type, placeholder, value, onChange, disabled }) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="w-full border-2 border-black pl-10 pr-10 py-3 text-xs md:text-sm font-bold text-black focus:outline-none rounded-none placeholder-gray-400 bg-white"
        />
    );
}

export default Input;

