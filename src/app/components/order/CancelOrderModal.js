export default function CancelOrderModal({ isOpen, onClose, onConfirm, cancelReason, setCancelReason }) {
    if (!isOpen) return null;
    return(
        <>
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold mb-4">Cancel Order</h2>
        <p>Please provide a reason for canceling the order:</p>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-2 mt-2"
          rows="4"
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          placeholder="Enter your reason here..."
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={() => setIsCancelModalOpen(false)}
            className="mr-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => handleCancelOrder(selectedOrderId)}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
        </>
    )
}