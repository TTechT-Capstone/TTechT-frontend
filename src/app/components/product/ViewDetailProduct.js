"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "../common/Loading";

export default function ViewDetailProduct({
  product,
  setProduct,
  loadingProduct,
}) {
  const router = useRouter();
  const { idToken, user, userId, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");


  return !isMobile ? (
    <>
      {loadingProduct ? (
        <Loading />
      ) : (
        <>
          <form
            //onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Left Side */}
            <div className="w-full md:w-2/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={product.name}
                  //onChange={handleInputChange}
                  //placeholder="Enter product name"
                  className="input-field"
                />
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                  name="categoryName"
                  value={product.categoryName}
                  //onChange={handleInputChange}
                  //placeholder="Enter product name"
                  className="input-field"
                />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="brand"
                    value={product.brand}
                    //onChange={handleInputChange}
                    //placeholder="Brand name"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Sizes */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Sizes
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes?.length > 0 ? (
                      product.sizes.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">null</span>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Colors
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors?.length > 0 ? (
                      product.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">null</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Price and Inventory */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    className="input-field"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  className="input-field h-32 resize-none"
                />
              </div>
            </div>

            {/* Right Side - Image Upload */}
            <div className="w-full md:w-1/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-4">
              <label className="block text-gray-700 font-medium mb-1">
                Product Images
              </label>

              {product.images[0] && (
                <img
                  src={product.images[0]}
                  className="w-full h-48 object-cover rounded-lg"
                  alt="Main"
                />
              )}

              <div className="flex flex-wrap gap-3">
                {product.images.map((src, idx) => (
                  <div key={idx} className="relative group">
                    <img src={src} className="w-16 h-16 object-cover rounded" />
                  </div>
                ))}
              </div>
            </div>
          </form>
        </>
      )}
    </>
  ) : (
    <>
      {loadingProduct ? (
        <Loading />
      ) : (
        <>
          <form
            //onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-6"
          >
            {/* Left Side */}
            <div className="w-full md:w-2/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
              {/* Product Name */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="name"
                  value={product.name}
                  className="input-field"
                />
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="categoryName"
                    value={product.categoryName}
                    className="input-field"
                  />
              
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="brand"
                    value={product.brand}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Sizes */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Sizes
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes?.length > 0 ? (
                      product.sizes.map((s, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">null</span>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Colors
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors?.length > 0 ? (
                      product.colors.map((c, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                        >
                          {c}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">null</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {/* Price and Inventory */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    className="input-field"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={product.stockQuantity}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  className="input-field h-32 resize-none"
                />
              </div>

              <div className="w-full bg-white p-6 rounded-2xl shadow space-y-4">
                <label className="block text-gray-700 font-medium mb-1">
                  Product Images
                </label>

                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    className="w-full h-48 object-cover rounded-lg"
                    alt="Main"
                  />
                )}

                <div className="flex flex-wrap gap-3">
                  {product.images.map((src, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col items-center space-y-1"
                    >
                      <img
                        src={src}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}
