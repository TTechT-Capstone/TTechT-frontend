"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, UploadCloud, Trash2 } from "lucide-react";
import { getAllCategoriesAPI } from "@/app/apis/category.api";

export default function CreateNewProduct() {
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    inventory: "",
    category: "",
    brand: "",
    size: [],
    color: [],
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategoriesAPI(0, 50);
        setCategories(data.categories || []);
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
    const value = type === "size" ? sizeInput.trim() : colorInput.trim();
    if (!value) return;

    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].includes(value) ? prev[type] : [...prev[type], value],
    }));

    type === "size" ? setSizeInput("") : setColorInput("");
  };

  const removeFromList = (type, value) => {
    setFormData((prev) => ({
      ...prev,
      [type]: prev[type].filter((item) => item !== value),
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...previews],
    }));
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = {
      ...formData,
      category: selectedCategory,
    };
    console.log("Submitting product:", finalData);
    // Submit via API...
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
        {/* Left Side */}
        <div className="w-full md:w-2/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name
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
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="input-field"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-1">
                Brand
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
                  onClick={() => addToList("size")}
                  className="px-4 py-2 bg-secondary text-white rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.size.map((s, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {s}
                    <button
                      onClick={() => removeFromList("size", s)}
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
                <input
                  value={colorInput}
                  onChange={(e) => setColorInput(e.target.value)}
                  placeholder="Add color"
                  className="input-field"
                />
                <button
                  type="button"
                  onClick={() => addToList("color")}
                  className="px-4 py-2 bg-secondary text-white rounded-xl"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.color.map((c, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {c}
                    <button
                      onClick={() => removeFromList("color", c)}
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
                Price (₫)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Enter price"
                className="input-field"
              />
            </div>

            <div className="w-full">
              <label className="block text-gray-700 font-medium mb-1">
                Inventory
              </label>
              <input
                type="number"
                name="inventory"
                value={formData.inventory}
                onChange={handleInputChange}
                placeholder="Available stock"
                className="input-field"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
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
              className="w-full px-6 py-2 bg-[#FFFFFD] text-gray-700 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full px-6 py-2 bg-secondary text-white rounded-xl"
            >
              Add New Product
            </button>
          </div>
        </div>

        {/* Right Side - Image Upload */}
        <div className="w-full md:w-1/3 bg-[#F4F4F4] p-6 rounded-2xl shadow space-y-4">
          <label className="block text-gray-700 font-medium mb-1">
            Product Images
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
          </div>
        </div>
      </form>
    </>
  );
}
