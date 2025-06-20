"use client";
import React, { useState } from "react";

const mockSelectedCart = [
  {
    id: 1,
    name: "Product A",
    price: 100000,
    quantity: 2,
    image: "",
  },
  {
    id: 2,
    name: "Product B",
    price: 150000,
    quantity: 1,
    image: "",
  },
];

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedCartItems, setSelectedCartItems] = useState(mockSelectedCart);

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] py-10 px-4 font-roboto">
      {/* Heading */}
      <h1 className="text-3xl font-bold font-urbanist text-center mb-10">
        CHECKOUT
      </h1>

      <div className="flex md:flex-col flex-row gap-8 max-w-7xl mx-auto">
        {/* Delivery Information */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold mb-4 font-urbanist">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name*"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Phone Number*"
              className="input-field"
            />
          </div>

          <input
            type="text"
            placeholder="Address*"
            className="input-field"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Region*"
              className="input-field"
            />
            <input
              type="text"
              placeholder="City*"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Area*"
              className="input-field"
            />
            <input
              type="email"
              placeholder="Email*"
              className="input-field"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <div className="grid grid-cols-5 font-semibold text-sm  pb-2">
            <h2 className="col-span-2 text-left font-urbanist">Product</h2>
            <p className="text-center">Unit Price</p>
            <p className="text-center">Quantity</p>
            <p className="text-center">Total</p>
          </div>

          {selectedCartItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-5 items-center px-2 py-4 text-sm"
            >
              {/* Product Info */}
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={
                    item.image || "https://via.placeholder.com/60x60?text=No+Img"
                  }
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="font-medium">{item.name}</span>
              </div>

              {/* Unit Price */}
              <div className="text-center">
                ₫{item.price.toLocaleString("vi-VN")}
              </div>

              {/* Quantity */}
              <div className="text-center">{item.quantity}</div>

              {/* Total */}
              <div className="text-center text-red-500 font-semibold">
                ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}

          {/* Cart Total */}
          <div className="flex justify-between font-semibold pt-4 border-t border-dashed border-[#EDEDED]">
            <span>Total:</span>
            <span className="text-red-500 text-lg">
              ₫{cartTotal.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Origity Voucher */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-urbanist">Origity Voucher</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="input-field w-full"
            />
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium">
              Apply
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-urbanist">Payment Method</h2>

          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash On Delivery
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="payment"
                value="card"
                checked={paymentMethod === "card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Card
            </label>
          </div>

          {/* Final Total & Button */}
          <div className="pt-4 border-t">
            <div className="flex justify-between text-base font-semibold">
              Total:
              <span className="text-red-500 text-xl">
                ₫{cartTotal.toLocaleString("vi-VN")}
              </span>
            </div>

            <button className="mt-4 w-full bg-primary text-white py-2 hover:opacity-90">
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
