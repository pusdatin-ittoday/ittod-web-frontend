import React from "react";

const LoadingState = () => {
  return (
    <div
      className="min-h-screen bg-[#f7f7f4]"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="sr-only">Loading</span>
    </div>
  );
};

export default LoadingState;
