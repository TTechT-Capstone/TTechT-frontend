"use client";

import { X } from "lucide-react";

export default function FilterDrawer({
  isOpen,
  isAnimating,
  onClose,
  filters,
  onClear,
  isMobile,
}) {
  if (!isOpen) return null;

  const drawerClassName = isMobile
    ? `fixed inset-x-0 bottom-0 h-4/5 bg-white shadow-lg z-[101] transform transition-transform duration-300 ease-in-out ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`
    : `fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white shadow-lg z-[101] transform transition-transform duration-300 ease-in-out ${
        isAnimating ? "translate-x-0" : "translate-x-full"
      }`;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] w-full transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={drawerClassName}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 relative">
          <h2 className="font-inter text-lg sm:text-xl font-semibold text-black absolute left-1/2 transform -translate-x-1/2">
            FILTER
          </h2>
          <X
            className="h-6 w-6 cursor-pointer text-gray-500 hover:text-primary transition-colors ml-auto"
            onClick={onClose}
          />
        </div>

        {/* Action buttons */}
        <div className="flex space-x-4 p-4 justify-center items-center w-full border-t border-gray-200">
          <button
            className="flex-1 px-4 py-2 bg-white border border-black text-black text-md sm:text-lg font-inter disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onClear}
            disabled={!filters || filters.length === 0}
          >
            CLEAR
          </button>
          <button className="flex-1 px-4 py-2 bg-black text-white font-inter text-md sm:text-lg">
            FILTER
          </button>
        </div>
      </div>
    </>
  );
}
