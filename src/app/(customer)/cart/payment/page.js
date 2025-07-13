"use client";

import React, { useState, useEffect, useLocation, useNavigate } from "react";
import useAuth from "@/app/hooks/useAuth";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
//import { loadStripe } from "@stripe/stripe-js";
import useCartStore from "@/app/stores/cartStore";
import { createPaymentIntentAPI } from "@/app/apis/payment.api";

// ✅ Setup Stripe promise (add your key in .env)
//const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PaymentPage() {
  const { user } = useAuth();
  const { cart, loadCart, totalPrice } = useCartStore();
  const selectedCartItems = cart || [];

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);

const location = useLocation();
const navigate = useNavigate();

const {
  email,
  firstName,
  lastName,
  address,
  contactPhone,
  promotionCode,
  updatedCartItems,
} = location.state || {};

  const cartTotal = totalPrice;

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (user) {
      setForm({
        contactName: user.firstName || "",
        contactPhone: user.phoneNumber || "",
        contactEmail: user.email || "",
        deliveryAddress: user.address || "",
      });
    }
  }, [user]);


  const handlePayClick = async () => {
    if (!validateForm()) return;

    try {
      setLoadingClientSecret(true);
      setPaymentError("");

      const payload = {
        amount: cartTotal,
        name: form.contactName,
        phone: form.contactPhone,
        email: form.contactEmail,
        address: form.deliveryAddress,
      };

      const response = await createPaymentIntentAPI(payload);
      const secret = response?.result?.clientSecret;
      console.log("🚀 Payment intent response:", response);

      if (!secret) {
        throw new Error("No client secret returned");
      }

      setClientSecret(secret);
      setShowEmbeddedCheckout(true);
    } catch (error) {
      setPaymentError("Unable to load payment form. Try again.");
      console.error("❌ Stripe payment error:", error);
    } finally {
      setLoadingClientSecret(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulated backend process
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your first name"
                value={form.contactName}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactName: e.target.value }))
                }
              />
              {errors.contactName && (
                <p className="text-sm text-red-500">{errors.contactName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Phone number"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactPhone: e.target.value }))
                }
              />
              {errors.contactPhone && (
                <p className="text-sm text-red-500">{errors.contactPhone}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Address"
                value={form.deliveryAddress}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    deliveryAddress: e.target.value,
                  }))
                }
              />
              {errors.deliveryAddress && (
                <p className="text-sm text-red-500">{errors.deliveryAddress}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                }
              />
              {errors.contactEmail && (
                <p className="text-sm text-red-500">{errors.contactEmail}</p>
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
                  src={item.image}
                  alt={item.productName}
                  className="w-14 h-14 object-cover rounded"
                />
                <span className="font-medium">{item.productName}</span>
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
<div className="bg-white shadow-md rounded-lg p-6 space-y-4 flex-1">
  <h2 className="text-xl font-bold font-urbanist text-gray-800">Payment Method</h2>

  <div className="space-y-3">
    {/* Stripe Checkout UI */}
    {loadingClientSecret ? (
      <p className="text-sm text-gray-500">Loading payment information...</p>
    ) : showEmbeddedCheckout ? (
      <EmbeddedCheckoutProvider options={{ clientSecret }}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    ) : (
      <button
        onClick={handlePayClick}
        disabled={loadingClientSecret}
        className={`w-full sm:w-auto bg-secondary text-white px-6 py-2 rounded-md font-semibold transition duration-200 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        Pay
      </button>
    )}

    {/* Error Message */}
    {paymentError && (
      <p className="text-sm text-red-500">{paymentError}</p>
    )}
  </div>
</div>

        {/* Stripe Embedded Checkout */}
        {paymentMethod === "CARD" && (
          <div className="mb-6 p-4 rounded-lg shadow-sm bg-white flex-1">
            <h3 className="text-lg font-semibold mb-2 font-urbanist">
              Card Payment
            </h3>
            
          </div>
        )}

        {/* Place Order Button */}        
          <button
            className={`mt-4 w-full py-2 font-medium transition duration-200 ${
              isFormIncomplete || isProcessing
                ? "bg-gray-300 cursor-not-allowed text-gray-600"
                : "bg-primary text-white hover:opacity-90"
            }`}
            onClick={handleCheckout}
            disabled={isFormIncomplete || isProcessing}
          >
            {isProcessing ? "Processing..." : "Next: Payment"}
          </button>
      </div>
    </div>
  );
}
