import { CircleAlert, TriangleAlert } from "lucide-react";

export default function WarningWtmPopUp({onClose }) {
  return (
    <>
      {/* Overlay - clicking closes the popup */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Centered popup */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white text-black p-6 max-w-xl w-11/12 text-center shadow-lg rounded-lg"
      >
        <div className="font-inter mb-3 text-lg font-semibold flex justify-center">
          <TriangleAlert className="text-amber-300 font-black" size={50} />
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <h1 className="text-md sm:text-2xl font-semibold">A watermark was found in this image</h1>
          <p className="text-sm sm:text-md whitespace-pre-line">Please try upload another image</p>
          <button
            onClick={onClose}
            className="text-sm sm:text-md mt-4 bg-secondary text-white px-4 py-2 rounded hover:bg-primary transition"
          >
            OK
          </button>
        </div>
      </div>
    </>
  );
}

