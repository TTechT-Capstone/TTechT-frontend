"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import { UploadCloud, Trash2, CircleX, CircleCheck } from "lucide-react";
import { getAllCategoriesAPI } from "@/app/apis/category.api";
import { updateProductAPI } from "@/app/apis/product.api";
import { getSellerByUserId } from "@/app/apis/seller.api";
import ErrorPopUp from "../pop-up/ErrorPopUp";
import SuccessPopUp from "../pop-up/SuccessPopUp";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import WarningWtmPopUp from "../watermark/WarningWtmPopUp";
import isEqual from "lodash/isEqual";

export default function EditProduct({ product, setProduct, loadingProduct }) {
  const router = useRouter();
  const { user } = useAuth();

  const [originalProduct, setOriginalProduct] = useState(null);

  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [seller, setSeller] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    if (!loadingProduct && product && originalProduct === null) {
      setOriginalProduct(JSON.parse(JSON.stringify(product)));
    }
  }, [loadingProduct, product]);

  const hasChanges = originalProduct && !isEqual(product, originalProduct);

  const handleCancel = () => {
    router.push("/seller/products");
  };

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) return;
        const sellerData = await getSellerByUserId(userId);
        setSeller(sellerData);
      } catch (error) {
        console.error("Failed to fetch seller:", error);
      }
    };
    fetchSellers();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategoriesAPI(0, 50);
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const addToList = (type) => {
    const value = type === "sizes" ? sizeInput.trim() : colorInput.trim();
    if (!value || product[type].includes(value)) return;
    setProduct((prev) => ({ ...prev, [type]: [...prev[type], value] }));
    type === "sizes" ? setSizeInput("") : setColorInput("");
  };

  const removeFromList = (type, value) => {
    setProduct((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - (product.images?.length || 0);
    if (remainingSlots <= 0) return;

    const allowedFiles = files.slice(0, remainingSlots);

    const convertToBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      const base64Images = await Promise.all(
        allowedFiles.map((file) => convertToBase64(file))
      );
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  const removeImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller?.storeName) {
      alert("Missing store name.");
      return;
    }

    if (product.images.length === 0) {
      setEditError("Please upload at least one product image.");
      setShowErrorPopup(true);
      return;
    }

    setIsLoading(true);
    setSuccessMessage("");
    setShowWarning(false);

    const finalData = {
      ...product,
      storeName: seller.storeName,
      price: parseFloat(Number(product.price).toFixed(2)),
      stockQuantity: parseInt(product.stockQuantity),
    };

    try {
      await updateProductAPI(product.productId, finalData);

      setShowWarning(false);
      setSuccessMessage("Product updated successfully!");
      setShowSuccessPopup(true);

      setTimeout(() => {
        router.push("/seller/products");
      }, 2000);
    } catch (error) {
      const errorCode = error?.data?.errorCode;

      if (errorCode === "WATERMARK_DETECTED") {
        setShowWarning(true);
        //console.warn("Watermark detected in the image.");
        setEditError("");
        setShowErrorPopup(false);
      } else {
        setEditError("Failed to update product.");
        setShowErrorPopup(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return !isMobile ? (
    <>
      {isLoading && (
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          />
          <p className="mt-5 text-gray-700 font-medium">
            Updating product, please wait while your image is embedding a
            watermark...
          </p>
        </div>
      )}
      {showWarning && <WarningWtmPopUp onClose={() => setShowWarning(false)} />}

      {successMessage && (
        <div className="border border-green-300 bg-green-50 flex flex-row px-2 py-4 text-center">
          <CircleCheck className="text-green-400 inline-block mr-2" />
          <div className="text-black">{successMessage}</div>
        </div>
      )}

      {/* Error Message */}
      {editError && (
        <div className="border border-red-300 bg-red-50 flex flex-row px-2 py-4 text-center">
          <CircleX className="text-red-400 inline-block mr-2" />
          <div className="text-black">{editError}</div>
        </div>
      )}

      {loadingProduct ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading product...
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
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
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="input-field"
                />
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    placeholder="Brand name"
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
                  <div className="flex gap-2">
                    <input
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Add size"
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={() => addToList("sizes")}
                      className="px-4 py-2 bg-secondary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {s}
                        <button
                          onClick={() => removeFromList("sizes", s)}
                          className="ml-2 text-red-500"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Colors
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select a color</option>
                      {[
                        "Red",
                        "Blue",
                        "Orange",
                        "Green",
                        "Yellow",
                        "Pink",
                        "Purple",
                        "Black",
                        "White",
                        "Gray",
                      ].map((color) => (
                        <option key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addToList("colors")}
                      className="px-4 py-2 bg-secondary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {c}
                        <button
                          onClick={() => removeFromList("colors", c)}
                          className="ml-2 text-red-500"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setProduct((prev) => ({
                        ...prev,
                        // If empty, store as empty string to allow deleting
                        price: value === "" ? "" : parseFloat(value),
                      }));
                    }}
                    onBlur={() => {
                      setProduct((prev) => ({
                        ...prev,
                        // Format to 2 decimal places if valid number
                        price:
                          prev.price === "" || isNaN(prev.price)
                            ? ""
                            : parseFloat(prev.price).toFixed(2),
                      }));
                    }}
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
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
                    onChange={handleInputChange}
                    placeholder="Available stock"
                    className="input-field"
                    min="1"
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
                  onChange={handleInputChange}
                  placeholder="Write product description..."
                  className="input-field h-32 resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={!hasChanges || product.images.length === 0}
                  className={`w-full px-6 py-2 rounded-xl transition 
                  ${
                    !hasChanges || product.images.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-secondary text-white"
                  }
                `}
                >
                  Edit Product
                </button>
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
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 p-1 bg-black bg-opacity-60 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      type="button"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}

                {/* <label className="w-16 h-16 border border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer hover:border-gray-600">
                  <UploadCloud className="w-5 h-5 text-gray-500" />
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label> */}
                {product.images.length < 4 && (
                  <label className="w-16 h-16 border border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer hover:border-gray-600">
                    <UploadCloud className="w-5 h-5 text-gray-500" />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
          </form>
        </>
      )}
    </>
  ) : (
    <>
      {isLoading && (
        <div className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"
            role="status"
          />
          <p className="text-gray-700 text-sm text-center font-medium p-5">
            Updating product, please wait while your image is embedding a
            watermark...
          </p>
        </div>
      )}

      {showWarning && <WarningWtmPopUp onClose={() => setShowWarning(false)} />}

      {isMobile && showSuccessPopup && (
        <SuccessPopUp
          message={successMessage}
          onClose={() => {
            setShowSuccessPopup(false);
            setSuccessMessage("");
          }}
        />
      )}

      {isMobile && showErrorPopup && (
        <ErrorPopUp
          message={editError}
          onClose={() => {
            setShowErrorPopup(false);
            setEditError("");
          }}
        />
      )}

      {showWarning && <WarningWtmPopUp onClose={() => setShowWarning(false)} />}

      {loadingProduct ? (
        <p className="font-roboto text-lg text-gray-600 text-center">
          Loading product...
        </p>
      ) : (
        <>
          <form
            onSubmit={handleSubmit}
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
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  className="input-field"
                />
              </div>

              {/* Category and Brand */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoryId"
                    value={product.categoryId}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Brand <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="brand"
                    value={product.brand}
                    onChange={handleInputChange}
                    placeholder="Brand name"
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
                  <div className="flex gap-2">
                    <input
                      value={sizeInput}
                      onChange={(e) => setSizeInput(e.target.value)}
                      placeholder="Add size"
                      className="input-field"
                    />
                    <button
                      type="button"
                      onClick={() => addToList("sizes")}
                      className="px-4 py-2 bg-secondary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.sizes.map((s, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {s}
                        <button
                          onClick={() => removeFromList("sizes", s)}
                          className="ml-2 text-red-500"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-1">
                    Colors
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={colorInput}
                      onChange={(e) => setColorInput(e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select a color</option>
                      {[
                        "Red",
                        "Blue",
                        "Orange",
                        "Green",
                        "Yellow",
                        "Pink",
                        "Purple",
                        "Black",
                        "White",
                        "Gray",
                      ].map((color) => (
                        <option key={color} value={color}>
                          {color.charAt(0).toUpperCase() + color.slice(1)}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => addToList("colors")}
                      className="px-4 py-2 bg-secondary text-white rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {product.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                      >
                        {c}
                        <button
                          onClick={() => removeFromList("colors", c)}
                          className="ml-2 text-red-500"
                          type="button"
                        >
                          ×
                        </button>
                      </span>
                    ))}
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
                    onChange={(e) => {
                      const value = e.target.value;
                      setProduct((prev) => ({
                        ...prev,
                        // If empty, store as empty string to allow deleting
                        price: value === "" ? "" : parseFloat(value),
                      }));
                    }}
                    onBlur={() => {
                      setProduct((prev) => ({
                        ...prev,
                        // Format to 2 decimal places if valid number
                        price:
                          prev.price === "" || isNaN(prev.price)
                            ? ""
                            : parseFloat(prev.price).toFixed(2),
                      }));
                    }}
                    placeholder="Enter price"
                    step="0.01"
                    min="0"
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
                    onChange={handleInputChange}
                    placeholder="Available stock"
                    className="input-field"
                    min="1"
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
                  onChange={handleInputChange}
                  placeholder="Write product description..."
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
                      <button
                        onClick={() => removeImage(idx)}
                        className="flex items-center justify-center px-2 py-1 bg-gray-300 text-white text-xs rounded-md active:scale-95 transition"
                        type="button"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                      </button>
                    </div>
                  ))}

                  {product.images.length < 4 && (
                    <label className="w-16 h-16 border border-dashed border-gray-400 flex items-center justify-center rounded-lg cursor-pointer hover:border-gray-600">
                      <UploadCloud className="w-5 h-5 text-gray-500" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full px-6 py-2 text-sm bg-[#FFFFFD] text-gray-700 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={product.images.length === 0}
                  className={`w-full px-6 py-2 text-sm rounded-xl transition 
                  ${
                    product.images.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-secondary text-white"
                  }
                `}
                >
                  Edit Product
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </>
  );
}
