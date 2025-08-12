"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { ChevronLeft, TicketPercent, Trash2 } from "lucide-react";
import useCartStore from "@/app/stores/cartStore";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import useCheckoutStore from "@/app/stores/checkoutStore";
import { useRouter } from "next/navigation";

export default function ShoppingCartPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const {
    cart,
    cartId,
    loadCart,
    totalPrice,
    updateQuantity,
    removeItemFromCart,
    submitCart,
    selectedItems,
    setSelectedItems,
    toggleItemSelection,
    toggleAllItems,
    calculatePriceOfSelectedItems,
  } = useCartStore();

  //const cartTotal = totalPrice;
  const cartTotal = calculatePriceOfSelectedItems();
  const { promotionCode, setFormData } = useCheckoutStore();

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  useEffect(() => {
    loadCart();
    // Automatically select all items when cart loads on mobile
    if (isMobile) {
      const allItemIds = cart.map((item) => item.productId);
      setSelectedItems(allItemIds);
    }
  }, [loadCart, isMobile]);

  return !isMobile ? (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-roboto">
      {/* Heading */}
      <h1 className="px-4 sm:px-8 font-playfair text-black text-3xl font-bold text-left py-6">
        SHOPPING CART
      </h1>

      <div className="flex flex-row space-x-4 px-4 sm:px-8">
        <div className="w-2/3 flex flex-col space-y-4">
          <div className="flex flex-row space-x-2 px-6 py-3 bg-white w-full items-center border border-gray-400 rounded-lg">
            <div>
              <input
                type="checkbox"
                checked={selectedItems.length === cart.length}
                onChange={toggleAllItems}
              />
            </div>

            <p className="font-inter text-black font-md">Select All</p>
          </div>

          <div className="w-full mx-auto bg-white space-y-6">
            {cart && cart.length > 0 ? (
              <>
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-row items-center rounded-lg bg-white p-6 space-x-6 shadow-sm relative h-[180px]"
                  >
                    {/* Checkbox */}
                    <div>
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item.productId)}
                        onChange={() => toggleItemSelection(item.productId)}
                      />
                    </div>

                    {/* Product Image */}
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-32 h-32 object-contain"
                        onClick={() => handleProductClick(item.productId)}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col flex-grow justify-between h-full">
                      <div>
                        <span className="font-semibold text-base">
                          {item.productName}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.size && (
                            <p>
                              Size:{" "}
                              <span className="font-normal">{item.size}</span>
                            </p>
                          )}
                          {item.color && (
                            <p>
                              Color:{" "}
                              <span className="font-normal">{item.color}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-lg mt-2">
                        ${item.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between h-full">
                      {/* Trash Icon (top) */}
                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-black"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>

                      {/* Quantity Controls (bottom) */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-200 text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded bg-gray-100 hover:bg-gray-800 hover:text-white text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
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

        <div className="w-1/3">
          {/* Cart Summary */}
          <div className="w-full flex flex-col sticky bottom-0 bg-white p-6 gap-6 rounded-lg shadow-md z-20">
            {/* Voucher Input */}
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <TicketPercent className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                  value={promotionCode}
                  onChange={(e) =>
                    setFormData({ promotionCode: e.target.value })
                  }
                />
              </div>
              <button className="px-5 py-2 bg-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition">
                Apply
              </button>
            </div>

            {/* Delivery Fee */}
            <div className="flex justify-between text-gray-700 text-sm">
              <p>Delivery Fee:</p>
              <p className="font-medium">0$</p>
            </div>

            {/* Total Price */}
            <div className="flex justify-between font-semibold text-lg border-t border-gray-300 pt-3">
              <div>Total:</div>
              <div className="text-black text-xl">
                {cartTotal
                  ? Number(cartTotal).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "0.00"}{" "}
                USD
              </div>
            </div>

            {/* Checkout Button */}
            <div>
              <Link
                href={{
                  pathname: "/cart/checkout",
                  query: { selected: JSON.stringify(selectedItems) },
                }}
              >
                <button
                  className={`w-full py-3 rounded-md text-white font-semibold transition
            ${
              selectedItems.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
                  disabled={selectedItems.length === 0}
                >
                  Checkout ({selectedItems.length})
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="min-h-screen w-full bg-[#f5f5f5]  text-primary py-5 px-4 font-roboto">
      {/* Heading */}
      <div className="flex flex-row">
        <div className="flex items-center">
          <Link href="/products">
            <ChevronLeft className="h-6 w-6" />
          </Link>
        </div>

        <h1 className="font-playfair text-black text-xl font-bold text-left px-2 py-6">
          SHOPPING CART
        </h1>
      </div>

      <div>
        <div className="w-full mx-auto overflow-hidden">
          {cart && cart.length > 0 ? (
            <>
              <div className="grid grid-cols-1">
                {cart.map((item) => (
                  <div
                    key={item.productId}
                    className="flex flex-row items-center border-b border-gray-300 bg-white p-4 space-x-2 shadow-sm relative h-[150px]"
                  >
                    {/* Product Image */}
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-22 h-22 object-contain"
                        onClick={() => handleProductClick(item.productId)}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col flex-grow justify-between h-full">
                      <div>
                        <span className="font-semibold text-xs">
                          {item.productName}
                        </span>
                        <div className="text-xs text-gray-600 mt-1">
                          {item.size && (
                            <p>
                              Size:{" "}
                              <span className="font-normal">{item.size}</span>
                            </p>
                          )}
                          {item.color && (
                            <p>
                              Color:{" "}
                              <span className="font-normal">{item.color}</span>
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="font-semibold text-xs mt-2">
                        ${item.price}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-between h-full">
                      <button
                        onClick={() => removeItemFromCart(item.id)}
                        className="text-black"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>

                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-200 text-lg font-bold"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1)
                          }
                          className="w-8 h-8 border border-gray-300 rounded bg-gray-100 hover:bg-gray-800 hover:text-white text-lg font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10">
                {/* Voucher Input */}
                <div className="flex gap-3">
                  <div className="relative flex-grow">
                    <TicketPercent className="w-6 h-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter Coupon Code"
                      className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black transition"
                      value={promotionCode}
                      onChange={(e) =>
                        setFormData({ promotionCode: e.target.value })
                      }
                    />
                  </div>
                  <button className="px-5 py-2 bg-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition">
                    Apply
                  </button>
                </div>

                {/* Cart Summary */}
                <div className="w-full bottom-0 bg-cream rounded-lg mx-auto mt-6 mb-4 flex flex-col justify-end items-start p-6 gap-4">
                  <h2 className="font-inter font-semibold text-lg">
                    {" "}
                    Payment Details
                  </h2>
                  {/* Delivery Fee */}
                  <div className="w-full flex justify-between text-gray-700 text-sm">
                    <p>Delivery Fee:</p>
                    <p className="font-medium">0$</p>
                  </div>

                  {/* Cart Total */}
                  <div className="w-full flex justify-between font-semibold text-lg border-t border-dashed border-gray-300 pt-3">
                    <div>Total:</div>
                    <div className="text-black text-xl">
                      {cartTotal
                        ? Number(cartTotal).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "0.00"}{" "}
                      USD
                    </div>
                  </div>
                </div>

                {/* Checkout Buttons */}
                <div className="flex gap-4 w-full">
                  <Link
                    href={{
                      pathname: "/cart/checkout",
                      query: { selected: JSON.stringify(selectedItems) },
                    }}
                    className="w-full"
                  >
                    <button
                      className="px-6 py-2 bg-primary w-full text-white hover:opacity-90"
                      disabled={selectedItems.length === 0}
                    >
                      Checkout ({selectedItems.length})
                    </button>
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex flex-col h-[80vh] px-4">
                <div className="flex-grow flex flex-col items-center justify-center text-center">
                  <p className="text-xl font-semibold mb-4">
                    Your cart is currently empty.
                  </p>
                  <p className="mb-6 text-gray-600">
                    Explore exciting products now!
                  </p>
                </div>

                <div className="w-full">
                  <Link href="/products">
                    <button className="w-full rounded-2xl bg-secondary text-white px-6 py-2 hover:bg-gray-800 transition">
                      Shopping Now
                    </button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
