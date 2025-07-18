"use client";
import React from "react";

export default function OrdersSection({
  orders,
  loadingOrders,
  selectedOrderId,
  orderDetails,
  orderStatusFilter,
  setOrderStatusFilter,
  handleOrderClick,
  setIsCancelModalOpen,
  setSelectedOrderId,
  filteredOrders,
}) {
  const renderOrderFilter = () => (
    <div className="mb-4 text-primary">
      <label
        htmlFor="orderStatus"
        className="block text-sm font-medium text-gray-700"
      >
        Filter by Order Status:
      </label>
      <select
        id="orderStatus"
        className="mt-1 block w-full border border-gray-300 rounded-md"
        value={orderStatusFilter}
        onChange={(e) => setOrderStatusFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="new">New</option>
        <option value="completed">Completed</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      <div className="bg-white p-4 shadow rounded-lg">
        <h1 className="font-urbanist text-2xl font-semibold text-primary text-center">
          My Orders
        </h1>
        {renderOrderFilter()}
      </div>
      {loadingOrders ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading orders...
        </p>
      ) : filteredOrders().length > 0 ? (
        <div className="space-y-4">
          {filteredOrders().map((order) => (
            <div
              key={order.id}
              className="bg-white shadow-lg p-4 rounded-xl space-y-2 cursor-pointer"
              onClick={() => handleOrderClick(order.id)}
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-gray-600">
                  Order Number:
                </p>
                <p className="text-lg font-bold text-green-600">
                  {order.orderNumber}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">
                  Order Status:{" "}
                  <span className="font-medium">{order.orderStatus}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Order Date:{" "}
                  <span className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Total Amount:
                  <span
                    className={`font-medium ${
                      order.discountAmount ? "text-green-600" : ""
                    }`}
                  >
                    {order.discountAmount
                      ? ` $${order.discountAmount.toFixed(
                          2
                        )} (discount applied: $${(
                          order.totalAmount - order.discountAmount
                        ).toFixed(2)})`
                      : ` $${order.totalAmount.toFixed(2)}`}
                  </span>
                </p>
              </div>

              {selectedOrderId === order.id &&
                orderDetails &&
                Array.isArray(orderDetails.orderItems) && (
                  <div className="mt-2">
                    <h2 className="text-lg font-semibold">Order Items:</h2>
                    <ul className="list-disc pl-5">
                      {(orderDetails.orderItems || []).map((item) => (
                        <li key={item.id} className="text-sm text-gray-600">
                          {item.productName} - Quantity: {item.quantity} -
                          Price: $
                          {item.discountPrice
                            ? `${item.discountPrice} (Previous price: $${item.price})`
                            : item.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {order.status === "new" && (
                <div className="flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCancelModalOpen(true); // Open the cancel modal
                      setSelectedOrderId(order.id); // Set the selected order ID
                    }}
                    className="mt-2 px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600 text-center">No orders found.</p>
      )}
    </div>
  );
}
