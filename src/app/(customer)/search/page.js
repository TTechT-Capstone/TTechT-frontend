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

export default function SearchProductPage() {
  const router = useRouter();
  //const searchParams = useSearchParams();
  //const searchQuery = searchParams.get("query");
  
  //       const fetchAvailableFilters = async () => {
//   try {
//     const data = await getAllProducts();
//     console.log("All products fetched:", data);

//     // Check if the data is a valid array with items before proceeding.
//     // The previous error happened because you tried to access a property that didn't exist.
//     if (Array.isArray(data) && data.length > 0) {
//       const products = data;
//       const colors = [...new Set(products.flatMap(p => p.colors || []))];
//       const sizes = [...new Set(products.flatMap(p => p.sizes || []))];
//       const categories = [...new Set(products.map(p => p.categoryName))];
//       const prices = products.map(p => p.price);
//       const minPrice = Math.min(...prices);
//       const maxPrice = Math.max(...prices);
      
//       setAvailableFilters({ colors, sizes, categories, minPrice, maxPrice });
//       setActiveFilters(prev => ({ ...prev, priceRange: [minPrice, maxPrice] }));
//     } else {
//       console.log("No products found to build filters from.");

//       setAvailableFilters({});
//       setActiveFilters({});
//     }
//   } catch (error) {
//     console.error("Failed to fetch products for filters:", error);
//     // Handle the error state appropriately
//     setAvailableFilters({});
//     setActiveFilters({});
//   }
// };


  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeSidebar = () => setSidebarVisible(false);
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleClearFilters = () => {
    console.log("Filters cleared!");
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBestSellerProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const data = await getBestSellingProductsAPI(4);
      setBestSellers(data);
    } catch (error) {
      console.error("Failed to fetch bestsellers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { name: "CATEGORY", options: ["Dresses", "T-Shirts", "Accessories"] },
    {
      name: "PRICE RANGE",
      options: ["Under 100,000 VND", "100,000-300,000 VND"],
    },
    { name: "COLOR", options: ["Red", "Blue", "Green"] },
    { name: "BRANDS", options: ["Brand A", "Brand B", "Brand C"] },
  ];

//   const fetchSearchResults = async () => {
//     if (!searchQuery?.trim()) return;

//     try {
//       setLoading(true);
//       const result = await searchProductsByNameAPI(searchQuery);
//       setSearchResults(result || []);
//     } catch (error) {
//       console.error("Failed to fetch search results:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSearchResults();
//   }, [searchQuery]);

    useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <main className="bg-white">
      {/* Header Section */}
      {/* <section className="flex py-4 items-center justify-center bg-secondary font-urbanist text-white">
        <h1 className="font-semibold text-2xl">NEW COLLECTION</h1>
      </section> */}


      {/* Filter and Sort Section */}
      <section className="flex justify-between items-center px-8 py-2 rounded-lg">
        <div
          className={`flex items-center space-x-4 font-urbanist font-bold text-gray-700 
      hover:text-primary transition-colors ${
        isMdScreen ? "pointer-events-none" : ""
      }`}
          onClick={!isMdScreen ? toggleSidebar : undefined}
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
          <SearchingProductResult />
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
