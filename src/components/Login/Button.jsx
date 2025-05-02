import React from "react";

const Button = ({ className, text, onClick, disabled }) => {
    return (
        <button
            className={className}
            onClick={onClick}
            disabled={disabled}
            style={{
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
            }}
        >
            {text}
        </button>
    );
}

export default Button;