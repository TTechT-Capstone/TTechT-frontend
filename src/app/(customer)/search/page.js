"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronDown, ChevronRight, Funnel } from "lucide-react";
import Image from "next/image";
import ProductContent from "@/app/components/product/ProductContent";
import FilterSidebar from "@/app/components/filter/FilterSidebar";
import ProductCard from "@/app/components/product/ProductCard";
import BestSellerCard from "@/app/components/product/BestSellerCard";
import {
  getAllProductsAPI,
  getBestSellingProductsAPI,
  searchProductsByNameAPI,
} from "@/app/apis/product.api";
import SearchingProductResult from "@/app/components/product/SearchingProductResult";
import useMediaQuery from "@/app/hooks/useMediaQuery";

export default function SearchProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams(); // Get search params from the URL
  const searchTerm = searchParams.get("query"); // Get the 'query' parameter, or default to an empty string

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true); // Set initial loading state to true
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchTerm?.trim()) return;

      if (searchTerm) {
        setLoading(true);
        try {
          const res = await searchProductsByNameAPI(searchTerm);
          setSearchResults(res);
        } catch (error) {
          console.error("Failed to fetch search results:", error);
          setSearchResults([]); // Ensure the state is an empty array on error
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
        setLoading(false);
      }
    };
    fetchSearchResults();
  }, [searchTerm]); 

  return (
    <main className="pt-8 sm:pt-10 min-h-screen bg-white">
      {/* Header Section */}
      <section className="flex px-8 py-8  font-playfair text-black flex-col">
        <h1 className="font-normal text-black text-lg sm:text-xl uppercase">
          Search Results
        </h1>
        <p className="mt-2 text-2xl sm:text-3xl font-bold">
          {searchTerm}
        </p>
        
        {!loading && searchResults?.length === 0 && (
          <p className="mt-4 text-gray-500 text-sm sm:text-base">
            We found no results. Please try again with a different word.
          </p>
        )}
      </section>

      <section className="flex flex-row px-8 py-4 pb-15 items-start">
        <Suspense fallback={<p>Loading products...</p>}>
          <SearchingProductResult 
            products={searchResults} 
            loading={loading} 
          />
        </Suspense>
      </section>
    </main>
  );
}