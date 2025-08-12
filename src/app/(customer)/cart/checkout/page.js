"use client";

import Link from "next/link";
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
  createPaymentCheckoutAPI,
  getPaymentStatusAPI,
} from "@/app/apis/payment.api";
import { createOrderAPI } from "@/app/apis/order.api";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { ChevronLeft } from "lucide-react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    cartId,
    cart,
    loadCart,
    totalPrice,
    selectedItems,
    calculatePriceOfSelectedItems,
  } = useCartStore();

  const selectedCartItems = cart.filter((item) =>
    selectedItems.includes(item.productId)
  );

  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingClientSecret, setLoadingClientSecret] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [showEmbeddedCheckout, setShowEmbeddedCheckout] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    contactName,
    contactPhone,
    contactEmail,
    deliveryAddress,
    promotionCode,
    setFormData,
  } = useCheckoutStore();

  const [errors, setErrors] = useState({});
  //const cartTotal = totalPrice;
  const cartTotal = calculatePriceOfSelectedItems();

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
  }, [user, setFormData]);

  const isFormIncomplete =
    !contactName || !contactPhone || !deliveryAddress || !contactEmail;

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
      //setPaymentStatus("Creating payment session...");

      const payload = {
        items: selectedCartItems.map((item) => ({
          productId: item.productId || item.id,
          quantity: item.quantity,
        })),
        customerEmail: contactEmail,
        customerName: contactName,
        description: `Order from TTECHT store - ${selectedCartItems.length} items`,
      };

      console.log("Creating checkout session with payload:", payload);

      const response = await createPaymentCheckoutAPI(payload);
      const secret = response?.result?.clientSecret;
      const sessionIdResponse = response?.result?.sessionId;

      console.log("Payment checkout response:", response);

      if (!secret || !sessionIdResponse) {
        throw new Error("No client secret or session ID returned");
      }

      setClientSecret(secret);
      setSessionId(sessionIdResponse);
      setShowEmbeddedCheckout(true);
      //setPaymentStatus("Payment form ready");

      setTimeout(() => {
        startPaymentStatusPolling(sessionIdResponse);
      }, 2000);
    } catch (error) {
      setPaymentError("Unable to load payment form. Try again.");
      //setPaymentStatus("");
      console.error("Stripe Payment Error:", error);
    } finally {
      setLoadingClientSecret(false);
    }
  };

  const startPaymentStatusPolling = (sessionId) => {
    let pollCount = 0;
    const maxPolls = 70; // (70 * 4 seconds)

    const pollInterval = setInterval(async () => {
      pollCount++;

      try {
        //... (${pollCount})`);

        const statusResponse = await getPaymentStatusAPI(sessionId);
        const status = statusResponse?.result?.status;

        console.log(`Payment status check ${pollCount}:`, status);

        if (status === "SUCCEEDED") {
          clearInterval(pollInterval);
          setPaymentCompleted(true);
          //setPaymentStatus("Payment completed successfully!");
          console.log("Payment completed successfully!");
        } else if (status === "FAILED") {
          clearInterval(pollInterval);
          setPaymentError("Payment failed. Please try again.");
          setPaymentStatus("");
        }

        // Stop polling after max attempts
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          //setPaymentStatus("Payment verification timeout");
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 4000); // Poll every 4 seconds
  };

  const handleCheckout = async () => {
    if (!validateForm()) return;

    if (!user?.id || !cartId || !sessionId) {
      alert("Missing user, cart, or payment session.");
      return;
    }

    if (!paymentCompleted) {
      alert("Please complete payment before placing your order.");
      return;
    }

    setIsProcessing(true);

    try {
      // ✅ Double-check payment status before creating order
      const paymentStatusResponse = await getPaymentStatusAPI(sessionId);
      const status = paymentStatusResponse?.result?.status;

      if (status !== "SUCCEEDED") {
        alert("Payment not completed. Please complete payment first.");
        setPaymentCompleted(false);
        return;
      }

      //const cartItemIds = cart.map((item) => item.id);

      const cartItemIds = selectedCartItems.map((item) => item.id);

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
    router.push("/user/order");
  };

  return !isMobile ? (
    <div className="mt-5 min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-inter">
      <h1 className="text-3xl text-black font-bold font-playfair text-center mb-10">
        CHECKOUT
      </h1>

      <div className="flex md:flex-col flex-row gap-8 max-w-7xl mx-auto">
        {/* Delivery Info */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold mb-4 font-playfair">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your first name"
                value={contactName}
                onChange={(e) => setFormData({ contactName: e.target.value })}
              />
              {errors.contactName && (
                <p className="text-sm text-red-500">{errors.contactName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Phone number"
                value={contactPhone}
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
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Address"
                value={deliveryAddress}
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
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={contactEmail}
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
          <div className="grid grid-cols-5 font-semibold font-inter text-sm pb-2">
            <h2 className="col-span-2 text-left">Product</h2>
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

                {(item.colors || item.sizes) && (
                    <p className="font-medium"> Type:{" "}
                      {item.colors}
                      {item.colors && item.sizes && <span>, </span>}
                      {item.sizes}
                    </p>
                  )}
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
              <div className="text-center text-black font-semibold">
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
            <span className="text-black text-xl">
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

        {/* Voucher
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-urbanist">Origity Voucher</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="input-field w-full"
              value={promotionCode}
              onChange={(e) => setFormData({ promotionCode: e.target.value })}
            />
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium">
              Apply
            </button>
          </div>
        </div> */}

        {/* Payment Method */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-playfair text-gray-800">
            Payment Method
          </h2>

          <div className="space-y-3">
            {/* Payment Status */}
            {paymentStatus && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">{paymentStatus}</p>
              </div>
            )}

            {/* Payment Completed Indicator */}
            {paymentCompleted && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700 font-semibold">
                  ✅ Payment completed successfully! You can now place your
                  order.
                </p>
              </div>
            )}

            {/* Stripe Checkout UI */}
            {loadingClientSecret ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-500">Loading payment form...</p>
              </div>
            ) : showEmbeddedCheckout && clientSecret ? (
              <div className="border rounded-lg overflow-hidden">
                <EmbeddedCheckoutProvider
                  options={{ clientSecret }}
                  stripe={stripePromise}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <button
                onClick={handlePayClick}
                disabled={loadingClientSecret || isFormIncomplete}
                className={`font-inter w-full sm:w-auto bg-secondary text-white px-6 py-2 font-normal transition duration-200 hover:bg-[#3d4a54] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingClientSecret ? "Loading..." : "Pay with Card"}
              </button>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-500">{paymentError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          className={`mt-4 w-full py-3 font-medium transition duration-200 ${
            isFormIncomplete || isProcessing || !paymentCompleted
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-black text-white hover:opacity-90"
          }`}
          onClick={handleCheckout}
          disabled={isFormIncomplete || isProcessing || !paymentCompleted}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Order...
            </div>
          ) : paymentCompleted ? (
            "Place Order"
          ) : (
            "Complete Payment First"
          )}
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
              className="text-2xl font-playfair text-[#008080] font-bold text-center"
            >
              Thank You For Your Order
            </h2>
            <p className="text-center font-inter text-gray-700">
              Your order has been successfully placed. You can continue shopping
              or review your orders.
            </p>
            <div className="flex flex-row space-x-4 font-inter">
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
  ) : (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-5 px-4 font-inter">
      {/* Heading */}
      <div className="flex flex-row">
        <div className="flex items-center">
          <Link href="/cart">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </div>

        <h1 className="font-playfair text-black text-xl font-bold text-left px-2 py-6">
          CHECKOUT
        </h1>
      </div>

      <div className="flex flex-col gap-3 mx-auto">
        {/* Delivery Info */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold mb-4 font-playfair">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your first name"
                value={contactName}
                onChange={(e) => setFormData({ contactName: e.target.value })}
              />
              {errors.contactName && (
                <p className="text-sm text-red-500">{errors.contactName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Phone number"
                value={contactPhone}
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
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Address"
                value={deliveryAddress}
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
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={contactEmail}
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
          <h2 className="text-xl font-bold font-playfair text-gray-800">
            Order Summary
          </h2>

          {selectedCartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-left px-2 py-4 text-sm w-full"
            >
              {/* Product image */}
              <div className="flex items-left gap-4">
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>

              {/* Product details */}
              <div className="flex flex-col w-full justify-between">
                {/* Product name */}
                <div className="flex flex-col">
                  <p className="font-medium">{item.productName}</p>
                  {(item.colors || item.sizes) && (
                    <p className="font-medium">
                      {item.colors}
                      {item.colors && item.sizes && <span>, </span>}
                      {item.sizes}
                    </p>
                  )}
                </div>

                <div className="flex flex-row justify-between">
                  {/* Unit price */}
                  <div className="text-center">
                    {item.price
                      ? Number(item.price).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "0.00"}{" "}
                    USD
                  </div>

                  {/* Quantity */}
                  <div className="text-center">
                    {"x"}
                    {item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between font-semibold pt-4 border-t border-dashed border-[#EDEDED]">
            <span>Total:</span>
            <span className="text-black text-xl">
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

        {/* Voucher
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-urbanist">Origity Voucher</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter Coupon Code"
              className="input-field w-full"
              value={promotionCode}
              onChange={(e) => setFormData({ promotionCode: e.target.value })}
            />
            <button className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded text-sm font-medium">
              Apply
            </button>
          </div>
        </div> */}

        {/* Payment Method */}
        <div className="bg-white shadow-md p-6 space-y-4 flex-1">
          <h2 className="text-xl font-bold font-playfair text-gray-800">
            Payment Method
          </h2>

          <div className="space-y-3">
            {/* Payment Status */}
            {paymentStatus && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <p className="text-sm text-blue-700">{paymentStatus}</p>
              </div>
            )}

            {/* Payment Completed Indicator */}
            {paymentCompleted && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700 font-semibold">
                  ✅ Payment completed successfully! You can now place your
                  order.
                </p>
              </div>
            )}

            {/* Stripe Checkout UI */}
            {loadingClientSecret ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-sm text-gray-500">Loading payment form...</p>
              </div>
            ) : showEmbeddedCheckout && clientSecret ? (
              <div className="border rounded-lg overflow-hidden">
                <EmbeddedCheckoutProvider
                  options={{ clientSecret }}
                  stripe={stripePromise}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </div>
            ) : (
              <button
                onClick={handlePayClick}
                disabled={loadingClientSecret || isFormIncomplete}
                className={`font-inter w-full sm:w-auto bg-secondary text-white px-6 py-2 font-normal transition duration-200 hover:bg-[#3d4a54] disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loadingClientSecret ? "Loading..." : "Pay with Card"}
              </button>
            )}

            {/* Error Message */}
            {paymentError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-500">{paymentError}</p>
              </div>
            )}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          className={`w-full py-3 font-medium transition duration-200 ${
            isFormIncomplete || isProcessing || !paymentCompleted
              ? "bg-gray-300 cursor-not-allowed text-gray-600"
              : "bg-black text-white hover:opacity-90"
          }`}
          onClick={handleCheckout}
          disabled={isFormIncomplete || isProcessing || !paymentCompleted}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Order...
            </div>
          ) : paymentCompleted ? (
            "Place Order"
          ) : (
            "Complete Payment First"
          )}
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
              className="text-2xl font-playfair text-[#008080] font-bold text-center"
            >
              Thank You For Your Order
            </h2>
            <p className="text-center font-inter text-gray-700">
              Your order has been successfully placed. You can continue shopping
              or review your orders.
            </p>
            <div className="flex flex-row space-x-4 font-inter">
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
