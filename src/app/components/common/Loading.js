import React from "react";

const Loading = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white z-150 fixed inset-0">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-black"
        role="status"
        aria-label="Loading"
      >
        {/* The message is handled by aria-label for screen readers */}
      </div>
      <span className="text-lg text-gray-700 font-semibold mt-4">{message}</span>
    </div>
  );
};

export default Loading;