"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  UploadCloud,
  Trash2,
  CircleX,
  CircleCheck,
} from "lucide-react";
import { getAllCategoriesAPI } from "@/app/apis/category.api";
import { createProductAPI } from "@/app/apis/product.api";
import useAuth from "@/app/hooks/useAuth";
import { getSellerByUserId } from "@/app/apis/seller.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import SuccessPopUp from "../pop-up/SuccessPopUp";
import ErrorPopup from "../pop-up/ErrorPopUp";
import ProgressIndicator from "../progress/ProgressIndicator";

export default function CreateNewProduct() {
  const { idToken, user, userId, isAuthenticated } = useAuth();
  const router = useRouter();
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [categories, setCategories] = useState([]);
  //const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [seller, setSeller] = useState(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [createError, setCreateError] = useState("");
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Show error popup on mobile
  useEffect(() => {
    if (isMobile && createError) {
      setShowErrorPopup(true);
    } else {
      setShowErrorPopup(false);
    }
  }, [createError, isMobile]);

  // Show success popup on mobile
  useEffect(() => {
    if (isMobile && successMessage) {
      setShowSuccessPopup(true);
    } else {
      setShowSuccessPopup(false);
    }
  }, [successMessage, isMobile]);

  // Auto-hide error popup
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setCreateError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  // Auto-hide success popup
  useEffect(() => {
    if (showSuccessPopup) {
      const timer = setTimeout(() => {
        setShowSuccessPopup(false);
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessPopup]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    brand: "",
    sizes: [],
    colors: [],
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("Missing userId in localStorage");
          return;
        }
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
        //console.log("Fetched categories:", data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addToList = (type) => {
    const value = type === "sizes" ? sizeInput.trim() : colorInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type] : [...prev[type], value],
    }));

    type === "sizes" ? setSizeInput("") : setColorInput("");
  };

  const removeFromList = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    // Check how many more images can be added
    const remainingSlots = 4 - formData.images.length;
    if (remainingSlots <= 0) return;

    // Limit selected files to remaining slots
    const allowedFiles = files.slice(0, remainingSlots);

    // Convert to base64
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

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...base64Images],
      }));
    } catch (error) {
      console.error("Error converting image to base64:", error);
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const isSubmitDisabled =
    !formData.name ||
    !formData.price ||
    !formData.stockQuantity ||
    !formData.categoryId ||
    !formData.brand ||
    !formData.description;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!seller?.storeName) {
      alert("Missing store name.");
      return;
    }

    if (!seller?.watermarkUrl) {
      setCreateError("Missing seller watermark. Please contact support.");
      return;
    }

    if (formData.images.length === 0) {
      setCreateError("Please upload at least one product image.");
      return;
    }
    setIsLoading(true);
    setSuccessMessage("");

    const sellerWatermarkUrl = seller.watermarkUrl;

    try {
      // Start progress
      setProcessingStep(1);

      // Step 1 & 2: Process each image for extraction and detection
      console.log("Step 1 & 2: Checking all images for existing watermarks...");
      for (const image of formData.images) {
        const extractResponse = await extractWatermarkAPI({
          suspect_image: image,
        });

        // If a watermark is extracted, check if it's the seller's
        if (extractResponse.extracted_watermark_url) {
          const detectResponse = await detectWatermarkAPI({
            original_watermark: sellerWatermarkUrl,
            extracted_watermark: extractResponse.extracted_watermark_url,
          });

          if (detectResponse.is_match) {
            console.error(
              "❌ An image you uploaded already has your watermark."
            );
            setCreateError(
              "An image you uploaded already contains your watermark. Please upload an original image without a watermark."
            );
            setIsLoading(false);
            setProcessingStep(0);
            return; // Stop the entire process
          }
        }
      }
      console.log("✅ All images passed the watermark detection check.");

      // Step 3: Embed the seller's watermark onto all images
      setProcessingStep(2);
      console.log("Step 3: Embedding seller's watermark onto all images...");
      const embeddedImages = await Promise.all(
        formData.images.map(async (image) => {
          const embedResponse = await embedWatermarkAPI({
            original_image: image,
            watermark_image: sellerWatermarkUrl,
          });
          return embedResponse.watermarked_image_url;
        })
      );
      console.log("✅ Watermark embedded on all images.");

      setProcessingStep(3);

      // Step 4: Create the product with the newly watermarked images
      console.log("Step 4: All checks passed. Creating the product...");
      const finalData = {
        ...formData,
        storeName: seller.storeName,
        price: parseFloat(Number(formData.price).toFixed(2)),
        stockQuantity: parseInt(formData.stockQuantity),
        images: embeddedImages,
      };

      const productResponse = await createProductAPI(finalData);
      console.log("✅ Product created successfully!", productResponse);
      setSuccessMessage("✅ Product created successfully!");
      setProcessingStep(0);
      // Redirect after a short delay
      setTimeout(() => {
        // if (user?.role === "ADMIN") {
        //   router.push("/admin/products");
        // } else {
        router.push("/seller/products");
        //}
      }, 1500);
    } catch (error) {
      console.error("Failed to create product:", error);
      setProcessingStep(0);
      alert("❌ Failed to create product.");
    } finally {
      setIsLoading(false);
    }
  };

  return !isMobile ? (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            {/* <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Creating product, please wait...
            </span> */}
            <ProgressIndicator step={processingStep} />
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-5 border border-green-300 bg-green-50 flex flex-row px-2 py-4 text-center">
          <CircleCheck className="text-green-400 inline-block mr-2" />
          <div className="text-black">{successMessage}</div>
        </div>
      )}

      {/* Error Message */}
      {createError && (
        <div className="mb-5 border border-red-300 bg-red-50 flex flex-row px-2 py-4 text-center">
          <CircleX className="text-red-400 inline-block mr-2" />
          <div className="text-black">{createError}</div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full md:w-2/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
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
                value={formData.categoryId}
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
                value={formData.brand}
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
                {formData.sizes.map((s, idx) => (
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
                {formData.colors.map((c, idx) => (
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
                value={formData.price}
                onChange={handleInputChange}
                onBlur={() => {
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(prev.price || 0).toFixed(2),
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
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
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
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write product description..."
              className="input-field h-32 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (user?.role === "ADMIN") {
                  router.push("/admin/products");
                } else {
                  router.push("/seller/products");
                }
              }}
              className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitDisabled || formData.images.length === 0}
              className={`w-full px-6 py-2 rounded-xl transition 
                  ${
                    isSubmitDisabled || formData.images.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-secondary text-white"
                  }
                `}
            >
              Add New Product
            </button>
          </div>
        </div>

        {/* Right Side - Image Upload */}
        <div className="w-full md:w-1/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-4">
          <label className="block text-gray-700 font-medium mb-1">
            Product Images <span className="text-red-500">*</span>
          </label>

          {formData.images[0] && (
            <img
              src={formData.images[0]}
              className="w-full h-48 object-cover rounded-lg"
              alt="Main"
            />
          )}

          <div className="flex flex-wrap gap-3">
            {formData.images.map((src, idx) => (
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

            {formData.images.length < 4 && (
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
      {/* Popups for mobile */}
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
        <ErrorPopup
          message={createError}
          onClose={() => {
            setShowPopup(false);
            setCreateError("");
          }}
        />
      )}
    </>
  ) : (
    <>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            {/* <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Creating product, please wait...
            </span> */}
            <ProgressIndicator step={processingStep} />
          </div>
        </div>
      )}


      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full md:w-2/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={formData.name}
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
                value={formData.categoryId}
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
                value={formData.brand}
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
                {formData.sizes.map((s, idx) => (
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
                {formData.colors.map((c, idx) => (
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
                value={formData.price}
                onChange={handleInputChange}
                onBlur={() => {
                  setFormData((prev) => ({
                    ...prev,
                    price: parseFloat(prev.price || 0).toFixed(2),
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
                Stock Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stockQuantity"
                value={formData.stockQuantity}
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
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Write product description..."
              className="input-field h-32 resize-none"
            />
          </div>

          <div className="w-full bg-white p-6 rounded-2xl shadow space-y-4">
            <label className="block text-gray-700 font-medium mb-1">
              Product Images <span className="text-red-500">*</span>
            </label>

            {formData.images[0] && (
              <img
                src={formData.images[0]}
                className="w-full h-48 object-cover rounded-lg"
                alt="Main"
              />
            )}

            <div className="flex flex-wrap gap-3">
              {formData.images.map((src, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col items-center space-y-1"
                >
                  <img src={src} className="w-16 h-16 object-cover rounded" />
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

              {formData.images.length < 4 && (
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
              onClick={() => {
                if (user?.role === "ADMIN") {
                  router.push("/admin/products");
                } else {
                  router.push("/seller/products");
                }
              }}
              className="w-full px-6 py-2 text-sm bg-[#FFFFFD] text-gray-700 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitDisabled || formData.images.length === 0}
              className={`w-full px-6 py-2 text-sm rounded-xl transition 
                  ${
                    isSubmitDisabled || formData.images.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-secondary text-white"
                  }
                `}
            >
              Add New Product
            </button>
          </div>
        </div>
      </form>
      {/* Popups for mobile */}
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
        <ErrorPopup
          message={createError}
          onClose={() => {
            setShowPopup(false);
            setCreateError("");
          }}
        />
      )}
    </>
  );
}
