"use client";

export default function EditOrder({
  order,
  setOrder,
  handleSubmit,
  loadingOrder,
}) {
  return (
    <>
      {loadingOrder ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading order...
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-6"
        >
          <div className="w-full bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Order Number
                </label>
                <input
                  name="orderNumber"
                  value={order.orderNumber}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Order Date
                </label>
                <input
                  name="orderDate"
                  value={new Date(order.createdAt).toLocaleDateString()}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Promotion Code
                </label>
                <input
                  name="promotionCode"
                  value={order.promotionCode || "null"}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>

              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Total Amount
                </label>
                <input
                  name="totalAmount"
                  value={order.totalAmount.toFixed(2)}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Order Status
              </label>
              <select
                name="orderStatus"
                value={order.orderStatus}
                onChange={(e) =>
                  setOrder({ ...order, orderStatus: e.target.value })
                }
                className="input-field"
              >
                <option value="NEW">New</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Customer Name
                </label>
                <input
                  name="contactName"
                  value={order.contactName}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Delivery Address
                </label>
                <input
                  name="deliveryAddress"
                  value={order.deliveryAddress}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Customer Email
                </label>
                <input
                  name="contactEmail"
                  value={order.contactEmail}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
              <div className="w-full">
                <label className="block text-gray-700 font-medium mb-1">
                  Customer Phone
                </label>
                <input
                  name="contactPhone"
                  value={order.contactPhone}
                  className="input-field cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Order Items
              </label>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-700 bg-white border rounded-md">
                  <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                    <tr>
                      <th className="px-4 py-2 border">#</th>
                      <th className="px-4 py-2 border">Product Name</th>
                      <th className="px-4 py-2 border">Quantity</th>
                      <th className="px-4 py-2 border">Unit Price (USD)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.orderItems?.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-4 py-2 border">{idx + 1}</td>
                        <td className="px-4 py-2 border">{item.productName}</td>
                        <td className="px-4 py-2 border">{item.quantity}</td>
                        <td className="px-4 py-2 border">{item.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-6 py-2 bg-secondary text-white rounded-xl"
              >
                Edit Order
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
