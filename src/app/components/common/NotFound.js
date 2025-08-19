import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen font-inter">
      {/* Main content grows to take remaining space */}
      <div className="flex flex-col flex-1 items-center justify-center px-4">
        <div className="text-xl sm:text-3xl font-playfair font-bold text-black mb-4">
          THIS PAGE WAS NOT FOUND
        </div>
        <span className="text-lg text-gray-700 font-normal mb-2 text-center">
          The content you are looking for is not available.
        </span>
        <Link
          href="/"
          className="font-inter mt-4 px-6 py-2 bg-secondary text-white hover:bg-gray-800 transition"
        >
          Go to Origity
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
