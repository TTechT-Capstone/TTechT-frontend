"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronRight, Funnel } from "lucide-react";
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

export default function ProductPage() {
  const router = useRouter();
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeSidebar = () => setSidebarVisible(false);
  //const [isMdScreen, setIsMdScreen] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleClearFilters = () => {
    console.log("Filters cleared!");
  };
  // useEffect(() => {
  //   const handleResize = () => {
  //     setIsMdScreen(window.innerWidth >= 768);
  //   };

  //   handleResize(); // Initial check
  //   window.addEventListener("resize", handleResize);

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  const handleBestSellerProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const data = await getBestSellingProductsAPI(isMobile ? 2 : 4);
      setBestSellers(data);
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
    <main className="bg-white">
      {/* Header Section */}
      {/* <section className="flex py-4 items-center justify-center bg-secondary font-urbanist text-white">
        <h1 className="font-semibold text-2xl">NEW COLLECTION</h1>
      </section> */}

      {/* Best Seller Section */}
      <section className="px-8 py-12">
        <h1 className="font-urbanist text-gray-800 font-extrabold text-3xl mb-8">
          BEST SELLER
        </h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestSellers.map((bestseller) => (
            <BestSellerCard
              key={bestseller.name}
              name={bestseller.name}
              price={bestseller.price}
              img={bestseller.images[0]}
              onClick={() => handleBestSellerProductClick(bestseller.productId)}
            />
          ))}
        </div>
      </section>

      {/* Filter and Sort Section */}
      <section className="flex justify-between items-center px-8 py-2 rounded-lg">
        <div
          className={`flex items-center space-x-4 font-urbanist font-bold text-gray-700 
      hover:text-primary transition-colors ${
        isMobile ? "pointer-events-none" : ""
      }`}
          onClick={!isMobile ? toggleSidebar : undefined}
        >
          <h1>FILTERS</h1>
          <Funnel className="h-5 w-5" />
        </div>

        {/* Sort By */}
        <div className="relative">
          <div
            className="flex items-center space-x-4 font-urbanist font-bold text-gray-700 cursor-pointer hover:text-primary transition-colors"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen}
          >
            <h1>SORT BY</h1>
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
      </section>

      {/* Divider */}
      <div className="my-4 border-t border-black opacity-80 mx-8"></div>

      <section className="flex flex-row px-8 py-4 items-start">
        {/* Filter sidebar */}

        <div className="hidden md:block w-[20%]">
          <FilterSidebar filters={filters} onClear={handleClearFilters} />
        </div>

        {/* Sidebar Dropdown for Smaller Screens */}
        {isSidebarVisible && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 flex justify-center items-center"
            onClick={closeSidebar}
          >
            <div
              className="bg-white p-4 rounded-lg shadow-lg w-3/4 max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex justify-end text-gray-700 cursor-pointer"
                onClick={toggleSidebar}
              >
                <X className="h-5 w-5" />
              </div>
              <FilterSidebar filters={filters} onClear={handleClearFilters} />
            </div>
          </div>
        )}

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
