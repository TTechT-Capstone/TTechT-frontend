import React from "react";
import useMediaQuery from "@/app/hooks/useMediaQuery";

const ArrowWithText = () => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  // On mobile, show a downward arrow
  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center space-y-2 my-4">
        <svg
          width="40"
          height="80"
          viewBox="0 0 40 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary"
        >
          {/* Arrow Body */}
          <rect
            x="10"
            y="0"
            width="20"
            height="50"
            fill="currentColor"
          />
          {/* Arrow Head */}
          <path d="M40 50L20 80L0 50H40Z" fill="currentColor" />
        </svg>
      </div>
    );
  }

  // On desktop, show a rightward arrow
  return (
    <div className="flex items-center justify-center space-x-2 w-48 mx-4 relative">
      <svg
        width="192"
        height="40"
        viewBox="0 0 192 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Arrow Body */}
        <rect
          x="0"
          y="10"
          width="160"
          height="20"
          fill="currentColor"
        />
        {/* Arrow Head */}
        <path d="M160 0L192 20L160 40V0Z" fill="currentColor" />
        {/* Text "DETECT" */}
        <text className="font-inter font-normal text-md px-4 py-4"
          x="80"
          y="20"
          fill="white"
          textAnchor="middle"
          alignmentBaseline="central"
        >
          DETECT
        </text>
      </svg>
    </div>
  );
};

export default ArrowWithText;