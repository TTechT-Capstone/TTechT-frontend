import { getCancelReasonAPI } from "@/app/apis/order.api";
import React, { useEffect, useState } from "react";

export default function CancelOrderModal({
  isOpen,
  onClose,
  onConfirm,
  cancelReason,
  selectedOrderId,
  setCancelReason,
}) {
  const [reasons, setReasons] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    const fetchCancelReasons = async () => {
      try {
        const data = await getCancelReasonAPI();
        setReasons(data.result);
      } catch (error) {
        console.error("❌ Error fetching cancel reasons:", error);
        setReasons([]);
      }
    };
    fetchCancelReasons();
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <>
      <div className="font-inter fixed inset-0 flex items-center justify-center bg-black/80">
        <div className="bg-white m-10 p-6 rounded-lg shadow-lg flex flex-col space-y-4">
          <h2 className="font-playfair text-lg font-semibold">Cancel Order</h2>
          <p>Please select a reason for canceling the order:</p>
          <select
            className="w-full border border-gray-300 rounded-lg p-2"
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          >
            <option value="">Choose a reason</option>
            {reasons?.map((reason) => (
              <option key={reason.code} value={reason.code}>
                {reason.description}
              </option>
            ))}
          </select>
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(selectedOrderId)}
              className={`px-4 py-2 rounded transition duration-200 ${
                cancelReason && cancelReason.trim()
                  ? "bg-red-600 text-white hover:bg-red-700"
                  : "bg-gray-300 text-gray-400 cursor-not-allowed"
              }`}
              disabled={!cancelReason || !cancelReason.trim()}
            >
              Confirm Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
