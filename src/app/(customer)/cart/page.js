"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { Trash2 } from "lucide-react";
import useCartStore from "@/app/stores/cartStore";

export default function ShoppingCartPage() {
  const { cart, loadCart, totalPrice, updateQuantity, removeItemFromCart, submitCart } =
    useCartStore();

  // const cartTotal = cart.reduce(
  //   (total, item) => total + item.price * item.quantity,
  //   0
  // );

    const cartTotal = totalPrice;


  const cartId = localStorage.getItem("cartId");

  useEffect(() => {
    loadCart();
  }, []);

  // const handleRemoveItem = async (itemId) => {
  //   try {
  //     await removeItemFromCart(itemId);
  //   } catch (err) {
  //     console.error("Failed to remove item:", err);
  //   }
  // };

  const handleSubmitCart = async () => {
    try {
      await submitCart();
      alert("🛍️ Order submitted successfully!");
    } catch (err) {
      alert("❌ Failed to submit cart: " + err.message);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-roboto">
      {/* Heading */}
      <h1 className="text-secondary text-3xl font-bold font-urbanist text-center py-6">
        Shopping Cart
      </h1>

      <div className="max-w-7xl mx-auto bg-white overflow-hidden mb-5">
        {/* Table Header */}
        <div className="grid grid-cols-7 px-6 py-3 bg-white text-gray-600 font-semibold text-sm">
          <div>
            <input type="checkbox" />
          </div>
          <div className="col-span-2">Product</div>
          <div className="text-center">Unit Price</div>
          <div className="text-center">Quantity</div>
          <div className="text-center">Subtotal</div>
          <div className="text-center">Actions</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white overflow-hidden">
        {cart && cart.length > 0 ? (
          <>
            {cart.map((item) => (
              <div
                key={item.productId}
                className="grid grid-cols-7 items-center px-6 py-5 border-b border-[#EDEDED] text-sm"
              >
                {/* Checkbox */}
                <div>
                  <input type="checkbox" />
                </div>

                {/* Product Info */}
                <div className="col-span-2 flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <span className="font-medium">{item.productName}</span>
                </div>

                {/* Unit Price */}
                <div className="text-center">₫{item.price}</div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center border border-[#EDEDED] overflow-hidden">
                    <button
                      className="px-3 py-1 hover:bg-gray-100"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                    >
                      -
                    </button>
                    <span className="px-3 py-1 border-l border-r border-[#EDEDED]">
                      {item.quantity}
                    </span>
                    <button
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-800 text-black hover:text-white"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <p className="text-xs text-red-500">
                    {item.stock ? `Only ${item.stock} left` : ""}
                  </p>
                </div>

                {/* Subtotal */}
                <div className="text-center text-red-500 font-semibold">
                  ₫{item.price * item.quantity}
                </div>

                {/* Actions */}
                <div className="text-center text-red-500">
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="items-center hover:text-red-500 text-gray-600"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            ))}

            {/* Cart Summary */}
            <div className="max-w-7xl sticky bottom-0 bg-white shadow-md mx-auto mt-6 flex flex-col md:flex-row justify-end items-center p-6 gap-4 z-10">
              {/* Cart Total */}
              <div className="text-base font-semibold">
                Total:{" "}
                <span className="text-red-500 text-xl">
                  ₫{cartTotal.toLocaleString("vi-VN")}
                </span>
              </div>

              {/* Checkout Buttons */}
              <div className="flex gap-4">
                <Link href="/cart/checkout">
                  <button className="px-6 py-2 bg-primary text-white hover:opacity-90">
                    Checkout
                  </button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg font-semibold mb-4">
              Your cart is currently empty.
            </p>
            <p className="mb-6 text-gray-600">
              Explore exciting products now!
            </p>
            <a
              href="/products"
              className="inline-block bg-secondary text-white px-6 py-2 rounded hover:bg-gray-800 transition"
            >
              Shopping Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
