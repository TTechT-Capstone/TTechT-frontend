"use client";

import useAuth from "@/app/hooks/useAuth";
import { getSellerById } from "@/app/apis/seller.api";
import { useEffect, useRef, useState } from "react";
import { createWatermarkAPI } from "@/app/apis/watermark.api";

export default function SellerWatermarkImageGenerator() {
  const { idToken, user } = useAuth();
  const canvasRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [storeName, setStoreName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchSeller = async () => {
      if (user?.id) {
        try {
          const sellerData = await getSellerById(user.id);
          setStoreName(sellerData.storeName);
        } catch (err) {
          console.error("Failed to fetch store name:", err);
        }
      }
    };
    fetchSeller();
  }, [user]);

  useEffect(() => {
    if (!storeName) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const width = 400;
    const height = 200;
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = "#333";
    ctx.font = "bold 32px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(storeName, width / 2, height / 2);

    // Export image
    const url = canvas.toDataURL("image/png");
    setImageUrl(url);
  }, [storeName]);

  //   const handleUseImage = async () => {
  //   setSelectedImage(imageUrl);
  //   console.log("Selected image ready to be sent to API:", imageUrl);

  //   try {
  //     const blob = await (await fetch(imageUrl)).blob();
  //     const formData = new FormData();
  //     formData.append("watermark", blob, "watermark.png");

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/sellers/${user.id}/watermark`,
  //       {
  //         method: "POST",
  //         headers: {
  //           Authorization: `Bearer ${idToken}`,
  //         },
  //         body: formData,
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error("Upload failed");
  //     }

  //     const result = await response.json();
  //     console.log("✅ Watermark uploaded:", result);
  //   } catch (err) {
  //     console.error("❌ Failed to upload watermark:", err);
  //   }
  // };

  const handleUseImage = async () => {
    setSelectedImage(imageUrl);
    console.log("Selected image ready to be sent to API:", imageUrl);

    try {
      const payload = {
        store_name: storeName,
        watermark_url_image: imageUrl, // base64 data URL
      };

      const result = await createWatermarkAPI(payload);
      console.log("✅ Watermark created via API:", result);
    } catch (err) {
      console.error("❌ Failed to create watermark:", err);
    }
  };

  return (
    <section className="font-roboto p-6 max-w-5xl mx-auto rounded-xl">
      <h1 className="font-urbanist text-3xl font-bold text-primary mb-1">
        Watermarking Image
      </h1>
      <p className="text-gray-600 text-sm mb-8">
        This image will be used as your watermark to protect your products from
        unauthorized reuse.
      </p>

      <div className="bg-[#FAFAFA] border border-gray-200 rounded-xl p-6 space-y-6">
        <div className="text-gray-700 text-center">
          Watermarking Image Preview:
        </div>

        <div className="w-full aspect-video bg-white border border-gray-400 rounded-lg shadow-md flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Watermark Preview"
              className="max-h-full max-w-full object-contain rounded"
            />
          ) : (
            <p className="text-gray-400">Generating image...</p>
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {imageUrl && (
          <div className="flex justify-center gap-4">
            <button
              onClick={handleUseImage}
              className="bg-secondary hover:bg-[#5d6c78] text-white font-medium px-6 py-2 rounded-lg transition"
            >
              Use this image as watermarking image
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
