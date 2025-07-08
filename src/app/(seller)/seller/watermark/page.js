"use client";

import { SquarePen } from "lucide-react";
import { useState, useRef } from "react";

export default function SellerWatermarkImage() {
  const [watermarkImage, setWatermarkImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setWatermarkImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleReplaceClick = () => {
    fileInputRef.current.click();
  };

  return (
    <section className="font-roboto p-6 bg-white ">
      <div className="mb-6">
        <h1 className="font-urbanist text-3xl font-bold text-primary mb-1">
          Watermark Image
        </h1>
        <p className="text-gray-600 text-sm">
          Add your watermark image to protect your products from unauthorized reuse.
        </p>
      </div>

      {previewUrl === null ? (
        <div
          className="bg-gray-50 border-2 border-dashed border-gray-300 p-10 rounded-xl text-center cursor-pointer hover:bg-gray-100 transition"
          onClick={handleReplaceClick}
        >
          <p className="text-gray-500 mb-2">
            You must upload your watermark image before selling new product.
          </p>
          <p className="text-secondary font-medium hover:underline">
            Click here to upload watermark image
          </p>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-4 bg-[#F4F4F4] p-6 rounded-lg flex flex-col items-center">
        <p className="text-gray-600">Your watermark image is shown below.</p>

        <div className="relative w-full max-w-4xl mx-auto">
          <img
            src={previewUrl}
            alt="Watermark Preview"
            className="w-full h-auto border rounded-lg shadow-sm object-contain"
          />
          <button
            onClick={handleReplaceClick}
            className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 bg-secondary hover:bg-blue-700 text-white rounded-md shadow transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white"
          >
            <SquarePen className="w-4 h-4" />
            <span className="text-sm font-medium">Edit</span>
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
          className="hidden"
        />
      </div>
      )}
    </section>
  );
}
