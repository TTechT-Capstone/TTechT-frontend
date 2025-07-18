"use client";

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { loadStripe } from "@stripe/stripe-js";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import useCartStore from "@/app/stores/cartStore";
import useCheckoutStore from "@/app/stores/checkoutStore";
import {
  createPaymentIntentAPI,
  createPaymentCheckoutAPI,
  getPaymentStatusAPI,
} from "@/app/apis/payment.api";
import { createOrderAPI } from "@/app/apis/order.api";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cartId, cart, loadCart, totalPrice } = useCartStore();
  const selectedCartItems = cart || [];

  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    contactName,
    contactPhone,
    contactEmail,
    deliveryAddress,
    promotionCode,
    setFormData,
    clearFormData,
  } = useCheckoutStore();

  const [errors, setErrors] = useState({});
  const cartTotal = totalPrice;

  useEffect(() => {
    loadCart();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        contactName: user.firstName || "",
        contactPhone: user.phoneNumber || "",
        contactEmail: user.email || "",
        deliveryAddress: user.address || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const load = async () => {
      const stripe = await stripePromise;
      setStripeInstance(stripe);
    };
    load();
  }, []);

  const isFormIncomplete =
    !contactName || !contactPhone || !deliveryAddress || !contactEmail;
  //!paymentMethod;

  const validateForm = () => {
    const newErrors = {};
    if (!contactName.trim()) newErrors.contactName = "Name is required";
    if (!contactPhone.trim())
      newErrors.contactPhone = "Phone number is required";
    if (!deliveryAddress.trim())
      newErrors.deliveryAddress = "Address is required";
    if (!contactEmail.trim()) newErrors.contactEmail = "Email is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayClick = async () => {
    if (!validateForm()) return;

    try {
      setLoadingClientSecret(true);
      setPaymentError("");

      const payload = {
        items: selectedCartItems.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
        customerEmail: contactEmail,
        customerName: contactName,
        description: "Test order from TTECHT store",
      };

      console.log("🚀 Creating payment intent with payload:", payload);

      const response = await createPaymentCheckoutAPI(payload);
      const secret = response?.result?.clientSecret;
      setSessionId(response?.result?.sessionId);

      console.log("🚀 Payment intent response:", response);

      if (!secret) {
        throw new Error("No client secret returned");
      }

      setClientSecret(secret);
      setShowEmbeddedCheckout(true);
    } catch (error) {
      setPaymentError("Unable to load payment form. Try again.");

      console.group("❌ Stripe Payment Error Details");

      if (error.response) {
        // Backend returned a non-2xx response
        console.error("👉 error.response.status:", error.response.status);
        console.error("👉 error.response.data:", error.response.data);
        console.error("👉 error.response.headers:", error.response.headers);
      } else if (error.request) {
        // Request was made but no response received
        console.error(
          "👉 error.request (no response received):",
          error.request
        );
      } else {
        // Something happened in setting up the request
        console.error("👉 error.message:", error.message);
      }

      // Always log full error object for safety
      console.error("👉 Full error object:", error);

      console.groupEnd();
    } finally {
      setLoadingClientSecret(false);
    }
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    if (!user?.id || !cartId || !sessionId) {
      alert("Missing user, cart, or payment session.");
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Check payment status before proceeding
      const paymentStatusResponse = await getPaymentStatusAPI(sessionId);
      const status = paymentStatusResponse?.result?.status;

      if (status !== "SUCCEEDED") {
        alert("Please complete payment before placing your order.");
        setPaymentCompleted(false);
        return;
      }

      setPaymentCompleted(true); // ✅ Payment is done!

      const cartItemIds = cart.map((item) => item.id);
      const orderPayload = {
        totalAmount: totalPrice,
        orderStatus: "PENDING",
        contactName,
        contactEmail,
        contactPhone,
        deliveryAddress,
        promotionCode: promotionCode || null,
        paymentMethod: "CARD",
        cartItemIds,
      };

      const orderData = await createOrderAPI(user.id, cartId, orderPayload);
      console.log("✅ Order created:", orderData);

      setIsModalOpen(true); // ✅ Show modal

      // Optional: redirect or reset state
    } catch (error) {
      console.error("❌ Failed to complete checkout:", error);
      alert("Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    setIsModalOpen(false);
    router.push("/products");
  };

  const handleViewOrder = () => {
    setIsModalOpen(false);
    router.push("/profile");
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
                value={contactName}
                // onChange={(e) =>
                //   setForm((prev) => ({ ...prev, contactName: e.target.value }))
                // }
                onChange={(e) => setFormData({ contactName: e.target.value })}
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
                value={contactPhone}
                // onChange={(e) =>
                //   setForm((prev) => ({ ...prev, contactPhone: e.target.value }))
                // }
                onChange={(e) => setFormData({ contactPhone: e.target.value })}
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
                value={deliveryAddress}
                // onChange={(e) =>
                //   setForm((prev) => ({
                //     ...prev,
                //     deliveryAddress: e.target.value,
                //   }))
                // }
                onChange={(e) =>
                  setFormData({ deliveryAddress: e.target.value })
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
                value={contactEmail}
                // onChange={(e) =>
                //   setForm((prev) => ({ ...prev, contactEmail: e.target.value }))
                // }
                onChange={(e) => setFormData({ contactEmail: e.target.value })}
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
                {item.price
                  ? Number(item.price).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}{" "}
                USD
              </div>
              <div className="text-center">{item.quantity}</div>
              <div className="text-center text-red-500 font-semibold">
                {item.price && item.quantity
                  ? (Number(item.price) * Number(item.quantity)).toLocaleString(
                      undefined,
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )
                  : "0.00"}{" "}
                USD
              </div>
            </div>
          ))}

          <div className="flex justify-between font-semibold pt-4 border-t border-dashed border-[#EDEDED]">
            <span>Total:</span>
            <span className="text-red-500 text-xl">
              {cartTotal
                ? Number(cartTotal).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : "0.00"}{" "}
              USD
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
          <h2 className="text-xl font-bold font-urbanist text-gray-800">
            Payment Method
          </h2>

          <div className="space-y-3">
            {/* Stripe Checkout UI */}
            {loadingClientSecret ? (
              <p className="text-sm text-gray-500">
                Loading payment information...
              </p>
            ) : showEmbeddedCheckout ? (
              <EmbeddedCheckoutProvider
                options={{ clientSecret }}
                stripe={stripePromise}
              >
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

        {/* Place Order Button */}
        <button
          className={`mt-4 w-full py-2 font-medium transition duration-200 ${
            isFormIncomplete || isProcessing || !paymentCompleted
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-primary text-white hover:opacity-90"
          }`}
          onClick={handleCheckout}
          disabled={isFormIncomplete || isProcessing || !paymentCompleted}
        >
          {isProcessing ? "Processing..." : "Checkout"}
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-secondary bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300"
          role="dialog"
          aria-labelledby="modalTitle"
          aria-hidden={!isModalOpen}
        >
          <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-md flex flex-col items-center justify-center space-y-6 transform transition-transform duration-300">
            <div>
              <img
                className="h-24 w-24"
                src="/assets/check.png"
                alt="Checkmark Icon"
              />
            </div>
            <h2
              id="modalTitle"
              className="text-2xl font-urbanist text-[#008080] font-bold text-center"
            >
              Thank You For Your Order
            </h2>
            <p className="text-center font-roboto text-gray-700">
              Your order has been successfully placed. You can continue shopping
              or review your orders.
            </p>
            <div className="flex flex-row space-x-4 font-roboto">
              <button
                onClick={handleContinueShopping}
                className="bg-secondary text-white px-6 py-2 rounded-md hover:bg-[#3d4a54] transition duration-200"
              >
                Continue Shopping
              </button>
              <button
                onClick={handleViewOrder}
                className="bg-white text-secondary px-6 py-2 border border-secondary rounded-md hover:bg-[#f2f7fb] transition duration-200"
              >
                View Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
