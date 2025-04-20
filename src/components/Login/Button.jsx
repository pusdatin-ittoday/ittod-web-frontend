import React from "react";

const Button = ({ classname, text, onClick }) => {
    return (
        <button
            className={classname}
            onClick={onClick}
        >
            {text}
        </button>
    );
}

export default Button;