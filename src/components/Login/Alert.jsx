import React from "react";

const Alert = ({ message, type = "error" }) => {
  const bgColor =
    type === "success"
      ? "bg-green-500 "
      : "bg-red-500";

  return (
    <div
      className={`${bgColor} px-4 py-3 relative text-white p-2 rounded text-center mb-3 animate-pulse`}
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default Alert;