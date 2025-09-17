"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ChevronDown, Search, Pencil, Trash2, SquarePen } from "lucide-react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "@/app/components/common/Loading";
import {
  getAllWatermarksAPI,
  getWatermarkHistoryAPI,
} from "@/app/apis/watermark.api";

export default function AdminWatermarkAnalysis() {
  const router = useRouter();
  const [watermarks, setWatermarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { idToken, user, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("detectionTimestamp");
  const [sortWatermark, setSortWatermark] = useState("desc");
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchWatermarks = async () => {
      setLoading(true);
      try {
        const response = await getWatermarkHistoryAPI();
        console.log("Fetched watermarks:", response);
        setWatermarks(response);
      } catch (error) {
        console.error("Error fetching watermarks:", error);
        setWatermarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWatermarks();
  }, []);

  const filteredAndSortedWatermarks = useMemo(() => {
    let filtered = [...watermarks];

    // 🔍 Filter by storeName or productId
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (w) =>
          String(w.productId).toLowerCase().includes(term) ||
          w.storeName.toLowerCase().includes(term)
      );
    }

    // 🔽 Sort logic
    filtered.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];

      if (valA == null) return 1;
      if (valB == null) return -1;

      if (sortBy === "detectionTimestamp") {
        return sortWatermark === "asc"
          ? new Date(valA).getTime() - new Date(valB).getTime()
          : new Date(valB).getTime() - new Date(valA).getTime();
      }

      if (sortBy === "detectionId" || sortBy === "productId") {
        return sortWatermark === "asc"
          ? Number(valA) - Number(valB)
          : Number(valB) - Number(valA);
      }

      if (typeof valA === "string" && typeof valB === "string") {
        return sortWatermark === "asc"
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortWatermark === "asc" ? valA - valB : valB - valA;
      }

      return 0;
    });

    return filtered;
  }, [watermarks, searchTerm, sortBy, sortWatermark]);

  const handleViewWatermark = (detectionId) => {
    router.push(`/admin/watermark/${detectionId}`);
  };

  if (loading) {
    return <Loading />;
  }

  return !isMobile ? (
    <main className="font-inter p-4 min-h-screen">
      {/* Header */}
      <div className="flex flex-row justify-between mb-4">
        <h1 className="font-playfair font-bold text-xl sm:text-2xl">
          Watermark Analysis
        </h1>
      </div>

      {/* Sort and Search */}
      <div className="flex flex-row justify-between mb-4">
        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SORT BY</label>
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="detectionId">Detection ID</option>
            <option value="productId">Product ID</option>
            <option value="storeName">Store Name</option>
            <option value="detectionTimestamp">Date Created</option>
          </select>
          <button
            className="text-sm underline"
            onClick={() =>
              setSortWatermark((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortWatermark.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SEARCH</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Store name or Product ID"
            className="border px-2 py-1 rounded"
          />
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-5 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Detection ID</div>
        <div>Store name</div>
        <div>Product ID</div>
        <div>Date Created</div>
        <div>Detected Info</div>
      </div>

      {/* Table Rows */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          Loading detection history...
        </div>
      ) : filteredAndSortedWatermarks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 col-span-5">
          No watermarks found.
        </div>
      ) : (
        filteredAndSortedWatermarks.map((watermark, index) => (
          <div
            key={watermark.detectionId}
            className={`grid grid-cols-5 justify-items-center items-center px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div>{watermark.detectionId}</div>
            <div>{watermark.storeName}</div>
            <div>{watermark.productId}</div>
            <div>
              {new Date(watermark.detectionTimestamp).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </div>
            <div>
              <button
                className="bg-secondary text-white px-2 py-1 rounded hover:bg-[#5d6c78] text-sm"
                onClick={() => handleViewWatermark(watermark.detectionId)}
              >
                View
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  ) : (
    <main className="font-inter p-4 min-h-screen">
      {/* Header */}
      <div className="flex mb-4">
        <h1 className="font-playfair font-bold text-xl sm:text-2xl">
          Watermark Analysis
        </h1>
      </div>

      {/* Sort and Search */}
      <div className="flex flex-col space-y-3 text-xs mb-4">
        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SORT BY</label>
          <select
            className="border rounded px-2 py-1"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="detectionId">Detection ID</option>
            <option value="productId">Product ID</option>
            <option value="storeName">Store Name</option>
            <option value="detectionTimestamp">Date Created</option>
          </select>
          <button
            className="text-sm underline"
            onClick={() =>
              setSortWatermark((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {sortWatermark.toUpperCase()}
          </button>
        </div>

        <div className="flex flex-row items-center space-x-2 font-inter font-semibold">
          <label>SEARCH</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Store name or Product ID"
            className="border px-2 py-1 rounded"
          />
          <Search className="h-5 w-5" />
        </div>
      </div>

      {/* Table Header */}
      <div className="text-sm grid grid-cols-4 justify-items-center font-urbanist font-bold bg-gray-100 px-4 py-3 rounded-t-lg">
        <div>Detection ID</div>
        <div>Product ID</div>
        <div>Date Created</div>
        <div>Detected Info</div>
      </div>

      {/* Table Rows */}
      {loading ? (
        <div className="text-center py-8 text-gray-500 font-urbanist col-span-6">
          Loading detection history...
        </div>
      ) : filteredAndSortedWatermarks.length === 0 ? (
        <div className="text-center py-8 text-gray-500 col-span-5">
          No detection watermarks found.
        </div>
      ) : (
        filteredAndSortedWatermarks.map((watermark, index) => (
          <div
            key={watermark.detectionId}
            className={`text-sm grid grid-cols-4 justify-items-center items-center px-4 py-3 ${
              index % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <div>{watermark.detectionId}</div>
            <div>{watermark.productId}</div>
            <div className="break-all">
              {new Date(watermark.detectionTimestamp).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }
              )}
            </div>
            <div>
              <button
                className="bg-secondary text-white px-2 py-1 rounded hover:bg-[#5d6c78] text-sm"
                onClick={() => handleViewWatermark(watermark.detectionId)}
              >
                View
              </button>
            </div>
          </div>
        ))
      )}
    </main>
  );
}
