import { CircleAlert, CircleCheck } from "lucide-react";

export default function SuccessWtmPopUp({ onClose }) {
  return (
    <>
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
        {/* <div className="font-inter mb-3 text-lg font-semibold flex justify-center">
          <CircleCheck className="text-green-300 font-black" size={50} />
        </div> */}
        <div className="mb-4">
          <img
            className="w-20 h-20 sm:h-24 sm:w-24"
            src="/assets/check.png"
            alt="Checkmark Icon"
          />
        </div>
        <div className="flex flex-col space-y-2 sm:space-y-3">
          <h1 className="text-md sm:text-2xl font-semibold">
            Create New Product Successfully
          </h1>
          <p className="text-sm sm:text-md whitespace-pre-line">
            Success protect your product with hidden watermark
          </p>
        </div>
      </div>
    </>
  );
}
