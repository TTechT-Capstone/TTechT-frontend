"use client";

import { ChevronDown, Search } from "lucide-react";

const watermarks = [
  {
    date: "2025-07-06",
    imageId: "IMG123",
    shopId: "SHOP001",
    productId: "PROD1001",
  },
  {
    date: "2025-07-05",
    imageId: "IMG456",
    shopId: "SHOP002",
    productId: "PROD1002",
  },
  {
    date: "2025-07-04",
    imageId: "IMG789",
    shopId: "SHOP003",
    productId: "PROD1003",
  },
];

export default function AdminWatermarkAnalysis() {
  return (
    <main className="font-roboto p-4 min-h-screen">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="font-urbanist font-bold text-2xl">Watermark Analysis</h1>
      </div>

      {/* Sort and Search */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SORT BY</span>
          <ChevronDown className="h-5 w-5" />
        </div>
        <div className="flex flex-row items-center space-x-2 font-urbanist font-bold">
          <span>SEARCH</span>
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Date</div>
        <div>Image ID</div>
        <div>Shop ID</div>
        <div>Product ID</div>
        <div>Detected Info</div>
      </div>

      {/* Table Rows */}
      {watermarks.map((watermark, index) => (
        <div
          key={index}
          className={`grid grid-cols-5 justify-items-center items-center px-4 py-3 ${
            index % 2 === 0 ? "bg-white" : "bg-gray-50"
          }`}
        >
          <div>{watermark.date}</div>
          <div>{watermark.imageId}</div>
          <div>{watermark.shopId}</div>
          <div>{watermark.productId}</div>
          <div>
            <button className="bg-secondary text-white px-2 py-1 rounded hover:bg-[#5d6c78] text-sm">
              View
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
