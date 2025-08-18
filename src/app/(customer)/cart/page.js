"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { ChevronLeft, TicketPercent, Trash2 } from "lucide-react";
import useCartStore from "@/app/stores/cartStore";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import useCheckoutStore from "@/app/stores/checkoutStore";
import { useRouter } from "next/navigation";
import { getProductByIdAPI } from "@/app/apis/product.api";

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
  //const { productId } = ();
  const [product, setProduct] = useState(null);

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

  // useEffect(() => {
  //   const enrichImages = async () => {
  //     if (!cart.length) return;

  //     const updatedCart = await Promise.all(
  //       cart.map(async (item) => {
  //         if (item.image) return item;
  //         try {
  //           const productData = await getProductByIdAPI(item.productId);
  //           return {
  //             ...item,
  //             image: productData.imageUrls?.[0] || "/placeholder.png",
  //           };
  //         } catch {
  //           return { ...item, image: "/placeholder.png" };
  //         }
  //       })
  //     );

  //     useCartStore.setState({ cart: updatedCart });
  //   };

  //   enrichImages();
  // }, [cart]);

  return !isMobile ? (
    <div className="min-h-screen w-full bg-[#f5f5f5] text-primary py-10 px-4 font-inter">
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
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-32 h-32 object-cover rounded-lg"
                        onClick={() => handleProductClick(item.productId)}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex flex-col flex-grow justify-between h-full">
                      <div>
                        <span
                          onClick={() => handleProductClick(item.productId)}
                          className="font-semibold text-base"
                        >
                          {item.productName}
                        </span>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.selectedSize && (
                            <p>
                              Size:{" "}
                              <span className="font-normal">
                                {item.selectedSize}
                              </span>
                            </p>
                          )}
                          {item.selectedColor && (
                            <p>
                              Color:{" "}
                              <span className="font-normal">
                                {item.selectedColor}
                              </span>
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
    <div className="pt-10 min-h-screen w-full bg-[#f5f5f5] text-primary font-inter flex flex-col">
      {/* Heading */}
      <div className="flex items-center px-4 py-4 ">
        <Link href="/products">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-playfair text-black text-xl font-bold ml-3">
          SHOPPING CART
        </h1>
      </div>

      {/* Cart Items */}
      {cart && cart.length > 0 ? (
        <>
          <div className="flex-1 overflow-y-auto max-h-[600px] px-4 py-2">
            {cart.map((item) => (
              <div
                key={item.productId}
                className="flex flex-row items-center border-b border-gray-300 bg-white p-3 mb-2 rounded-lg shadow-sm h-[140px] sm:h-[150px]"
              >
                {/* Product Image */}
                <div className="flex-shrink-0 bg-gray-100 rounded-lg w-25 h-25">
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-full h-full rounded-lg object-cover"
                    onClick={() => handleProductClick(item.productId)}
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col flex-grow justify-between h-full ml-3">
                  <div>
                    <span 
                    onClick={() => handleProductClick(item.productId)}
                    className="font-semibold text-sm sm:text-xs">
                      {item.productName}
                    </span>
                    <div className="text-xs text-gray-600 mt-1">
                      {item.selectedSize && (
                        <p>
                          Size:{" "}
                          <span className="font-normal">
                            {item.selectedSize}
                          </span>
                        </p>
                      )}
                      {item.selectedColor && (
                        <p>
                          Color:{" "}
                          <span className="font-normal">
                            {item.selectedColor}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-semibold text-sm mt-1">
                    ${item.price}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end justify-between h-full ml-2">
                  <button
                    onClick={() => removeItemFromCart(item.id)}
                    className="text-black mb-2"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded hover:bg-gray-200 text-base font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="w-7 h-7 sm:w-8 sm:h-8 border border-gray-300 rounded bg-gray-100 hover:bg-gray-800 hover:text-white text-base font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="w-full bg-cream px-4 py-4  flex flex-col gap-3">
            {/* Voucher Input */}
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <TicketPercent className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter Coupon Code"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  value={promotionCode}
                  onChange={(e) =>
                    setFormData({ promotionCode: e.target.value })
                  }
                />
              </div>
              <button className="px-3 py-2 bg-black text-white rounded-md text-sm font-semibold hover:bg-gray-800 transition">
                Apply
              </button>
            </div>

            {/* Cart Summary */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Delivery Fee:</span>
                <span className="font-medium">0$</span>
              </div>
              <div className="flex justify-between font-semibold text-lg border-t border-dashed border-gray-300 pt-2">
                <span>Total:</span>
                <span className="text-black text-lg">
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

            {/* Checkout Button */}
            <Link
              href={{
                pathname: "/cart/checkout",
                query: { selected: JSON.stringify(selectedItems) },
              }}
              className="w-full mt-2"
            >
              <button
                className="w-full px-4 py-2 bg-primary text-white rounded-md text-base font-semibold hover:opacity-90 disabled:opacity-50"
                disabled={selectedItems.length === 0}
              >
                Checkout ({selectedItems.length})
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          <p className="text-lg font-semibold mb-2">
            Your cart is currently empty.
          </p>
          <p className="mb-4 text-gray-600">Explore exciting products now!</p>
          <Link href="/products">
            <button className="w-full max-w-xs rounded-2xl bg-secondary text-white px-6 py-2 hover:bg-gray-800 transition">
              Shopping Now
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
