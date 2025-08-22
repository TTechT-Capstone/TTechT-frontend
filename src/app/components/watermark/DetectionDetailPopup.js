"use client";

import { X } from "lucide-react";

export default function DetectionDetailPopup({ metrics, onClose }) {
  const getPccResult = (pcc) => {
    if (pcc >= 0.9) return { text: "Very high similarity", color: "text-green-600" };
    if (pcc >= 0.7) return { text: "Higher than average", color: "text-green-600" };
    if (pcc >= 0.5) return { text: "Moderate similarity", color: "text-yellow-600" };
    return { text: "Low similarity", color: "text-red-600" };
  };

  const pccResult = getPccResult(metrics.pcc);

  return (
    <div className="font-inter fixed inset-0 bg-white/70 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
        <h3 className="text-xl sm:text-2xl font-bold mb-4 text-center font-playfair">Detection Detail</h3>
        
        <div className="space-y-3">
          {/* RMSE */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">RMSE:</span>
            <span className="font-bold text-red-600">{metrics.rmse?.toFixed(2) || "N/A"}</span>
          </div>

          {/* SSIM */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">SSIM:</span>
            <span className="font-bold text-red-600">{metrics.ssim?.toFixed(2) || "N/A"}</span>
          </div>

          {/* PSNR */}
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">PSNR:</span>
            <span className="font-bold text-red-600">{metrics.psnr?.toFixed(2) || "N/A"}dB</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="font-bold mb-2">Extraction Result:</h4>
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">PCC:</span>
            <span className={`font-bold ${pccResult.color}`}>{metrics.pcc?.toFixed(2) || "N/A"}</span>
          </div>
          <p className={`mt-1 text-sm ${pccResult.color}`}>{pccResult.text}</p>
        </div>
      </div>
    </div>
  );
}