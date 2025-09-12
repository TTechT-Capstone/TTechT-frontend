import { TriangleAlert } from "lucide-react";

export default function WarningWtmPopUp({ onClose }) {
  return (
    <div className="font-inter">
      {/* Overlay - clicking closes the popup */}
      <div
        className="fixed inset-0 bg-black/50 z-40 flex justify-center items-center transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Centered popup */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="px-5 py-10 sm:p-10 flex flex-col items-center justify-center fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 max-w-xl w-11/12 text-center shadow-lg rounded-lg"
      >
        <div className="mb-4">
          <img
            className="w-20 h-20 sm:h-24 sm:w-24"
            src="/assets/triangle_alert.png"
            alt="Warning Icon"
          />
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <h1 className="text-md sm:text-2xl font-semibold font-playfair">
            A watermark was found in this image
          </h1>
          {/* <p className="mt-2 text-sm sm:text-md whitespace-pre-line">
            Please try upload another image
          </p> */}
          <button
            onClick={onClose}
            className="text-sm sm:text-md mt-2 bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition"
          >
            Please try upload another image
          </button>
        </div>
      </div>
    </div>
  );
}
