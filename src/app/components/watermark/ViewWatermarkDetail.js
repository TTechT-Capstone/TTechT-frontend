"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "../common/Loading";
import Image from "next/image";
import DetectionDetailPopup from "./DetectionDetailPopup";
import { ArrowBigRight, ArrowRight } from "lucide-react";
import ArrowWithText from "./ArrowWithText";

export default function ViewWatermarkDetail({
  watermark,
  setWatermark,
  loadingWatermark,
}) {
  const router = useRouter();
  const { idToken, user, userId, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [showPopup, setShowPopup] = useState(false);
  const embeddedSrc = watermark?.imageUrl || "/product.jpg";
  const detectedSrc = watermark?.detectedImageUrl || "/product.jpg";
  const hasWatermark = watermark?.detectionStatus;

  const handleViewDetails = () => {
    setShowPopup(true);
  };

  const metrics = {
    rmse: watermark?.rmse,
    ssim: watermark?.ssim,
    psnr: watermark?.psnr,
    pcc: watermark?.pcc,
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center items-center p-4">
        {/* Embedded Image Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="bg-secondary text-white px-2 py-1 sm:px-4 sm:py-2 font-playfair text-md sm:text-xl font-normal text-center">
            Embedded Image
          </h2>
          <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-gray-300 overflow-hidden relative">
            <Image
              src={embeddedSrc}
              alt="Embedded product image"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
        <ArrowWithText />
        {/* Detected Image Section */}
        <div className="flex flex-col items-center justify-center space-y-4">
          <h2 className="bg-secondary text-white px-2 py-1 sm:px-4 sm:py-2 font-playfair text-md sm:text-xl font-normal text-center">
            Detected Image
          </h2>
          <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-gray-300 overflow-hidden relative">
            <Image
              src={detectedSrc}
              alt="Detected product image with watermark"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Metric Table */}
      <div className="flex flex-col items-center justify-center space-y-4 md:space-x-4 border border-gray-300 rounded-lg p-6 my-8 mx-auto w-full max-w-2xl">
        <h3 className="text-xl font-bold mb-4">Watermark Analysis Report</h3>

        {/* Detection Status */}
        <div className="flex flex-row justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Detection Status:</span>
          <span
            className={`font-bold ${
              hasWatermark ? "text-green-600" : "text-red-600"
            }`}
          >
            {hasWatermark ? "Watermark Found" : "No Watermark"}
          </span>
        </div>

        {/* Store Name */}
        <div className="flex flex-row justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Store Name:</span>
          <span className="font-bold">{watermark?.storeName || "N/A"}</span>
        </div>

        {/* Watermark ID */}
        <div className="flex flex-row justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Watermark ID:</span>
          <span className="font-bold">{watermark?.watermarkId || "N/A"}</span>
        </div>

        {/* Similarity Metric */}
        <div className="flex flex-row justify-between w-full p-2">
          <span className="font-semibold text-gray-700">
            Similarity Score (NC):
          </span>
          <span className="font-bold">
            {watermark?.similarityScore?.toFixed(2) || "N/A"}
          </span>
        </div>

        {/* View Details Button (now functional) */}
        <div className="flex flex-row justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Detailed Report:</span>
          <button
            className="bg-secondary px-4 py-2 font-bold text-white rounded-xl hover:bg-secondary-dark transition-colors"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>

      {/* Conditionally render the popup */}
      {showPopup && (
        <DetectionDetailPopup
          metrics={metrics}
          onClose={() => setShowPopup(false)}
        />
      )}
    </>
  );
}
