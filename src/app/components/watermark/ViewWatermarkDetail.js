"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/app/hooks/useAuth";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Image from "next/image";
import DetectionDetailPopup from "./WatermarkDetailPopup";
import ArrowWithText from "./ArrowWithText";
import { getWatermarkHistoryByIdAPI } from "@/app/apis/watermark.api";

export default function ViewWatermarkDetail({ detectionId }) {
  const router = useRouter();
  const { idToken, user, userId, isAuthenticated } = useAuth();
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [watermark, setWatermark] = useState(null);
  const [loadingWatermark, setLoadingWatermark] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const toBase64Image = (base64) => {
  if (!base64) return "/product.jpg";
  return base64.startsWith("data:image") ? base64 : `data:image/png;base64,${base64}`;
};


  const embeddedSrc = toBase64Image(watermark?.detectedImageBase64);
  //const detectedSrc = (watermark?.detectedImageBase64);
  const detectedSrc = toBase64Image(watermark?.extractedWatermarkBase64);


  useEffect(() => {
    const fetchDetail = async () => {
      setLoadingWatermark(true);
      setError(null);
      try {
        const res = await getWatermarkHistoryByIdAPI(detectionId);
        setWatermark(res);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch watermark detail");
      } finally {
        setLoadingWatermark(false);
      }
    };
    if (detectionId) fetchDetail();
  }, [detectionId]);

  const handleViewDetails = () => setShowPopup(true);

  const metrics = watermark?.watermarkDetectResponse?.data?.metrics ?? {
    mse: watermark?.mse ?? "-",
    pcc: watermark?.pcc ?? "-",
    psnr: watermark?.psnr ?? "-",
    ssim: watermark?.ssim ?? "-",
    pcc_abs: watermark?.pcc_abs ?? "-",
  };

  if (loadingWatermark) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!watermark) return <div>No data available</div>;

  return (
    <>
      <div className="flex flex-col sm:flex-row space-y-8 md:space-y-0 md:space-x-8 justify-center items-center p-4">
        {/* Embedded Image */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="bg-secondary text-white px-2 py-1 sm:px-4 sm:py-2 font-playfair text-md sm:text-xl text-center">
            Embedded Image
          </h2>
          <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-gray-300 overflow-hidden relative">
            <Image src={embeddedSrc} alt="Embedded image" fill className="object-cover" />
          </div>
        </div>

        <ArrowWithText />

        {/* Detected Image */}
        <div className="flex flex-col items-center space-y-4">
          <h2 className="bg-secondary text-white px-2 py-1 sm:px-4 sm:py-2 font-playfair text-md sm:text-xl text-center">
            Extracted Image
          </h2>
          <div className="w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] border border-gray-300 overflow-hidden relative">
            <Image src={detectedSrc} alt="Detected image" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Watermark Info */}
      <div className="flex flex-col items-center space-y-4 border border-gray-300 rounded-lg p-6 my-8 mx-auto w-full max-w-2xl">
        <h3 className="text-center text-md sm:text-xl font-bold mb-4">Watermark Analysis Report</h3>

        <div className="flex justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Detection Status:</span>
          <span className="text-right font-bold text-red-500">{watermark.detectStatus ?? "N/A"}</span>
        </div>

        <div className="flex justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Store Name:</span>
          <span className="text-right font-bold">{watermark.storeName}</span>
        </div>

        <div className="flex justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Watermark ID:</span>
          <span className="text-right font-bold">{watermark.watermarkId}</span>
        </div>

        <div className="flex justify-between w-full p-2">
          <span className="font-semibold text-gray-700">Detailed Report:</span>
          <button
            className="bg-secondary px-4 py-2 font-bold text-white rounded-xl hover:bg-secondary-dark transition-colors"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      </div>

      {showPopup && <DetectionDetailPopup metrics={metrics} onClose={() => setShowPopup(false)} />}
    </>
  );
}
