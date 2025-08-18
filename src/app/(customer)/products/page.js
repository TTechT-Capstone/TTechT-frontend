"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronDown,
  ChevronRight,
  Funnel,
  ListFilterIcon,
} from "lucide-react";
import Image from "next/image";
import ProductContent from "@/app/components/product/ProductContent";
import FilterSidebar from "@/app/components/filter/FilterSidebar";
import ProductCard from "@/app/components/product/ProductCard";
import BestSellerCard from "@/app/components/product/BestSellerCard";
import {
  getAllProductsAPI,
  getBestSellingProductsAPI,
} from "@/app/apis/product.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import BestSellerSlider from "@/app/components/product/BestSellerSlider";
import FilterDrawer from "@/app/components/filter/FilterDrawer";

export default function ProductPage() {
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeSidebar = () => setSidebarVisible(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [isFilterAnimating, setFilterAnimating] = useState(false);

  const openFilter = () => {
    setFilterOpen(true);
  };

  const closeFilter = () => {
    setFilterAnimating(false);
    setTimeout(() => {
      setFilterOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (isFilterOpen) {
      requestAnimationFrame(() => setFilterAnimating(true));
    }
  }, [isFilterOpen]);

  const handleClearFilters = () => {
    console.log("Filters cleared!");
  };

  const handleBestSellerProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const data = await getBestSellingProductsAPI();
      setBestSellers(data);
      console.log("Best sellers fetched:", data);
    } catch (error) {
      console.error("Failed to fetch bestsellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  const filters = [
    { name: "CATEGORY", options: ["Dresses", "T-Shirts", "Accessories"] },
    {
      name: "PRICE RANGE",
      options: ["Under 100,000 VND", "100,000-300,000 VND"],
    },
    { name: "COLOR", options: ["Red", "Blue", "Green"] },
    { name: "BRANDS", options: ["Brand A", "Brand B", "Brand C"] },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Best Seller Section */}
      <section className="px-8 pt-12 pb-6">
        <h1 className="font-playfair text-gray-800 font-normal text-3xl mb-2">
          BEST SELLER
        </h1>

        <BestSellerSlider
          bestSellers={bestSellers}
          handleBestSellerProductClick={handleBestSellerProductClick}
        />
      </section>

      {/* Filter and Sort Section */}
      <section className="flex justify-between items-center px-8 py-2 rounded-lg">
        {/* Sort By */}
        <div className="relative">
          <div
            className="flex items-center space-x-4 font-urbanist font-bold text-gray-700 cursor-pointer hover:text-primary transition-colors"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            <h1 className="font-inter text-md sm:text-lg">SORT BY</h1>
            <ChevronDown className="h-5 w-5" />
          </div>

          {isDropdownOpen && (
            <div className="text-primary absolute z-10 right-0 bg-white shadow-md mt-2 border border-[#EDEDED] font-roboto font-semibold">
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Recommend
              </button>
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Newest
              </button>
              <button className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left">
                Popularity
              </button>
            </div>
          )}
        </div>

        <div
          className="flex items-center space-x-4 font-urbanist font-bold text-gray-700 
                      hover:text-primary transition-colors"
          onClick={openFilter}
        >
          <h1 className="font-inter text-md sm:text-lg">FILTERS</h1>
          <ListFilterIcon className="h-5 w-5" />

          {isFilterOpen && (
            <FilterDrawer
              isOpen={isFilterOpen}
              isAnimating={isFilterAnimating}
              onClose={closeFilter}
              filters={filters}
              onClear={handleClearFilters}
              isMobile={isMobile}
            />
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="my-4 border-t border-black opacity-80 mx-8"></div>

      <section className="flex flex-row px-8 py-4 items-start">
        <Suspense fallback={<p>Loading products...</p>}>
          <ProductContent />
        </Suspense>
      </section>

      {/* Pagination Section
      <section className="flex justify-center space-x-2 items-center py-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`px-4 py-2 rounded ${
              i + 1 === currentPage
                ? "bg-primary text-white"
                : "text-primary hover:bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        {totalPages > 1 && currentPage < totalPages && (
          <>
            <span>...</span>
            <button
              aria-label="Next page"
              onClick={() => handlePageChange(currentPage + 1)}
              className="px-4 py-2 rounded text-primary hover:bg-gray-200"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </section> */}
    </main>
  );
}
