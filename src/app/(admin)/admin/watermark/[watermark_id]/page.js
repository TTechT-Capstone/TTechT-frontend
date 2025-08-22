"use client"

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { useParams, useSearchParams } from "next/navigation";
import ViewWatermarkDetail from "@/app/components/watermark/ViewWatermarkDetail";

export default function AdminWatermarkDetail() {
    const { idToken, user, isAuthenticated, loading } = useAuth();
  const params = useParams();
  const watermarkId = params.watermark_id;
    const [error, setError] = useState(null);
    const [loadingWatermark, setLoadingWatermark] = useState(true);
    const [watermark, setWatermark] = useState(null);
    const isMobile = useMediaQuery("(max-width: 767px)");

  return !isMobile ? (
    <main className="min-h-screen p-4 font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 font-playfair">
          Watermark Analysis
        </h1>
        <Link href="/admin/watermark">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to watermark list
          </div>
        </Link>
      </div>
      <ViewWatermarkDetail
        watermark={watermark}
        setWatermark={setWatermark}
        loadingWatermark={loadingWatermark}
      />
    </main>
  ):(
    <main className="min-h-screen p-4 font-inter">
      <div className="flex flex-col space-y-5 items-left mb-5">
        <Link href="/admin/watermark">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to watermark list
          </div>
        </Link>

        <h1 className="text-xl sm:text-3xl font-bold text-gray-800 font-playfair">
          Watermark Analysis
        </h1>
      </div>
      <ViewWatermarkDetail
        watermark={watermark}
        setWatermark={setWatermark}
        loadingWatermark={loadingWatermark}
      />
    </main>
  );
}
