"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "@/app/components/common/Loading";
import { getAllWatermarksAPI } from "@/app/apis/watermark.api";

export default function AdminWatermarkAnalysis() {
  const router = useRouter();
  const [watermarks, setWatermarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortWatermark, setSortWatermark] = useState("desc");
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchWatermarks = async () => {
      setLoading(true);
      try {
        const response = await getAllWatermarksAPI();
        console.log("Fetched watermarks:", response.data);
        setWatermarks(response.data.watermarks);
      } catch (error) {
        console.error("Error fetching watermarks:", error);
        setWatermarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatermarks();
  }, []);

  const handleViewWatermark = (watermark_id) => {
    router.push(`/admin/watermark/${watermark_id}`);
  };

  return (
    <main className="font-inter p-4 min-h-screen">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="font-playfair font-bold text-2xl">Watermark Analysis</h1>
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
        <div>Image</div>
        <div>Store name</div>
        <div>Product ID</div>
        <div>Date Created</div>
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
          <div>{watermark.watermark_id}</div>
          <div>{watermark.date}</div>
          <div>{watermark.store_name}</div>
          <div>{watermark.watermark_url_image}</div>
          <div>
            <button
              className="bg-secondary text-white px-2 py-1 rounded hover:bg-[#5d6c78] text-sm"
              onClick={() => handleViewWatermark(watermark.watermark_id)}
            >
              View
            </button>
          </div>
        </div>
      ))}
    </main>
  );
}
