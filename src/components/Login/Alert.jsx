import React from "react";

const Alert = ({ message }) => {
  if (!message) return null; 

  return (
    <div className="bg-gradient-to-r bg-red-500 text-white p-2 rounded text-center mb-3 animate-pulse">
      {message}
    </div>
  );
};

export default Alert;