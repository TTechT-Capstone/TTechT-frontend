"use client";
import React, { useState } from "react";
import { useStripe, useElements, Elements, EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";


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
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [selectedCartItems, setSelectedCartItems] = useState(mockSelectedCart);
  

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    region: "",
    city: "",
    area: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const cartTotal = selectedCartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const isFormIncomplete =
    !form.name ||
    !form.phone ||
    !form.address ||
    !form.region ||
    !form.city ||
    !form.area ||
    !form.email ||
    !paymentMethod;

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    if (!form.address.trim()) newErrors.address = "Address is required";
    if (!form.region.trim()) newErrors.region = "Region is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.area.trim()) newErrors.area = "Area is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!paymentMethod) newErrors.paymentMethod = "Select a payment method";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      alert("Order placed successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-roboto">
      <h1 className="text-3xl text-secondary font-bold font-urbanist text-center mb-10">
        CHECKOUT
      </h1>

      <div className="flex md:flex-col flex-row gap-8 max-w-7xl mx-auto">
        {/* Delivery Info */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold mb-4 font-urbanist">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Name*"
                className="input-field"
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Phone Number*"
                className="input-field"
                value={form.phone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <input
              type="text"
              placeholder="Address*"
              className="input-field"
              value={form.address}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, address: e.target.value }))
              }
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Region*"
                className="input-field"
                value={form.region}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, region: e.target.value }))
                }
              />
              {errors.region && (
                <p className="text-sm text-red-500">{errors.region}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="City*"
                className="input-field"
                value={form.city}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, city: e.target.value }))
                }
              />
              {errors.city && (
                <p className="text-sm text-red-500">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="Area*"
                className="input-field"
                value={form.area}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, area: e.target.value }))
                }
              />
              {errors.area && (
                <p className="text-sm text-red-500">{errors.area}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                placeholder="Email*"
                className="input-field"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <div className="grid grid-cols-5 font-semibold text-sm pb-2">
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
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={
                    item.image ||
                    "https://via.placeholder.com/60x60?text=No+Img"
                  }
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="text-center">
                ₫{item.price.toLocaleString("vi-VN")}
              </div>
              <div className="text-center">{item.quantity}</div>
              <div className="text-center text-red-500 font-semibold">
                ₫{(item.price * item.quantity).toLocaleString("vi-VN")}
              </div>
            </div>
          ))}

          <div className="flex justify-between font-semibold pt-4 border-t border-dashed border-[#EDEDED]">
            <span>Total:</span>
            <span className="text-red-500 text-lg">
              ₫{cartTotal.toLocaleString("vi-VN")}
            </span>
          </div>
        </div>

        {/* Voucher */}
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
        {/* <div className="mb-6 p-4 rounded-lg shadow-sm bg-white flex-1">
          <h3 className="text-lg font-semibold mb-2 font-urbanist">
            Payment Method
          </h3>
          {loadingClientSecret ? (
            <p>Loading payment information...</p>
          ) : (
            <>
              {showEmbeddedCheckout ? (
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{ clientSecret }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              ) : (
                <button
                  className="bg-[#E89F71] text-white px-6 py-2 rounded-md hover:bg-orange-500 transition duration-200"
                  onClick={handlePayClick}
                >
                  Pay
                </button>
              )}
              {paymentError && (
                <p className="text-red-500 text-sm mt-2">{paymentError}</p>
              )}
            </>
          )}
        </div> */}

        <button
          className={`mt-4 w-full py-2 font-medium transition duration-200 ${
            isFormIncomplete || isProcessing
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-primary text-white hover:opacity-90"
          }`}
          onClick={handleCheckout}
          disabled={isFormIncomplete || isProcessing}
        >
          {isProcessing ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
}
