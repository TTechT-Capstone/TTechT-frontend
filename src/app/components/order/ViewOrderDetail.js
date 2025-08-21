"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "../common/Loading";

export default function ViewOrderDetail({ order, setOrder, loadingOrder }) {
  const router = useRouter();
  const { idToken, user, userId, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleCancel = () => {
    const role = user?.roles?.[0]?.name || "UNKNOWN";

    if (role === "ADMIN") {
      router.push("/admin/orders");
    } else if (role === "SELLER") {
      router.push("/seller/orders");
    } else {
      console.warn("Unknown role or not logged in");
    }
  };

  return (
    <>
      {loadingOrder ? (
        <Loading />
      ) : (
        <form
          //onSubmit={handleEditSubmit}
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
              <input
                name="orderStatus"
                value={order.orderStatus}
                className="input-field"
                readOnly
              />
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
                        <td className="px-4 py-2 border">{item.unitPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-center gap-4">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}
    </>
  );
}
