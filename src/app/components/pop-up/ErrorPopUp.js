import { CircleAlert } from "lucide-react";

export default function ErrorPopup({ message, onClose }) {
  return (
    <>
      {/* Overlay - clicking closes the popup */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Centered popup */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 text-white p-6 max-w-xs w-11/12 text-center shadow-lg rounded-lg"
      >
        <div className="mb-3 text-lg font-semibold flex justify-center">
          <CircleAlert size={32} />
        </div>
        <p className="whitespace-pre-line">{message}</p>
      </div>
    </>
  );
}

