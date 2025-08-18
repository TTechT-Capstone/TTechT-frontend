"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
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
import {
  getAllProducts,
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
  const [sort, setSort] = useState("default");
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // State for available filter options extracted from all products
  const [availableFilters, setAvailableFilters] = useState({});
  // State for currently active filters
  const [activeFilters, setActiveFilters] = useState({});

  // const handleFilterOptionsChange = useCallback((options) => {
  //   setAvailableFilters(options);
  //   if (options.minPrice && options.maxPrice) {
  //     setActiveFilters((prev) => ({
  //       ...prev,
  //       priceRange: [options.minPrice, options.maxPrice],
  //     }));
  //   }
  // }, []);

  const handleFilterOptionsChange = useCallback((options) => {
  setAvailableFilters(options);
  // Remove the setActiveFilters call from here
}, []);

const handleFilterChange = (newFilters) => {
    setActiveFilters(newFilters);

    // Reset page to 1 when filters change
    setCurrentPage(1);
    // // Optionally, you can also close the filter drawer after applying filters
    // if (isFilterOpen) {
    //   setFilterAnimating(false);
    //   setTimeout(() => {
    //     setFilterOpen(false);
    //   }, 300);
    }
  const handleClearFilters = () => {
    // Reset filters to an empty object
    setActiveFilters({});
    // Reset page to 1
    setCurrentPage(1);
  };

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

  const handleBestSellerProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const data = await getBestSellingProductsAPI();
      setBestSellers(data);
      //console.log("Best sellers fetched:", data);
    } catch (error) {
      console.error("Failed to fetch bestsellers:", error);
    } finally {
      setLoading(false);
    }
  };

  // const fetchAvailableFilters = async () => {
  //   try {
  //     const data = await getAllProductsAPI(); // Fetch a large batch to get all options
  //     if (data && data.content) {
  //       const products = data.content;
  //       const colors = [...new Set(products.flatMap((p) => p.colors || []))];
  //       const sizes = [...new Set(products.flatMap((p) => p.sizes || []))];
  //       const categories = [...new Set(products.map((p) => p.categoryName))];
  //       const prices = products.map((p) => p.price);
  //       const minPrice = Math.min(...prices);
  //       const maxPrice = Math.max(...prices);
  //       setAvailableFilters({ colors, sizes, categories, minPrice, maxPrice });
  //       // Set initial price range for activeFilters
  //       setActiveFilters((prev) => ({
  //         ...prev,
  //         priceRange: [minPrice, maxPrice],
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch products for filters:", error);
  //   }
  // };

  const fetchAvailableFilters = async () => {
    try {
      const data = await getAllProducts(); // Use the non-paginated API
      if (Array.isArray(data) && data.length > 0) {
        const colors = [...new Set(data.flatMap((p) => p.colors || []))];
        const sizes = [...new Set(data.flatMap((p) => p.sizes || []))];
        const categories = [...new Set(data.map((p) => p.categoryName))];
        const prices = data.map((p) => p.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        setAvailableFilters({ colors, sizes, categories, minPrice, maxPrice });
        setActiveFilters((prev) => ({
          ...prev,
          priceRange: [minPrice, maxPrice],
        }));
      }
    } catch (error) {
      console.error("Failed to fetch products for filters:", error);
    }
  };

  useEffect(() => {
    fetchBestSellers();
    fetchAvailableFilters();
  }, []);

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
            <div className="text-black absolute z-10 right-0 bg-white shadow-md mt-2 border border-[#EDEDED] font-roboto font-semibold rounded-md overflow-hidden">
              <button
                onClick={() => {
                  setSort("default");
                  setDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm w-full text-left transition-colors ${
                  sort === "default"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Default
              </button>

              <button
                onClick={() => {
                  setSort("newest");
                  setDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm w-full text-left transition-colors ${
                  sort === "newest"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Newest
              </button>

              <button
                onClick={() => {
                  setSort("popular");
                  setDropdownOpen(false);
                }}
                className={`block px-4 py-2 text-sm w-full text-left transition-colors ${
                  sort === "popular"
                    ? "bg-primary text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                Popular
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
              onFilterChange={handleFilterChange}
              onClear={handleClearFilters}
              isMobile={isMobile}
              filtersFromParent={availableFilters}
              activeFilters={activeFilters}
            />
          )}
        </div>
      </section>

      {/* Divider */}
      <div className="my-4 border-t border-black opacity-80 mx-8"></div>

      <section className="flex flex-row px-8 py-4 items-start">
        <Suspense fallback={<p>Loading products...</p>}>
          <ProductContent
            sort={sort}
            filters={activeFilters}
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
            setTotalPages={setTotalPages}
            onFilterOptionsChange={handleFilterOptionsChange}
          />
        </Suspense>
      </section>
    </main>
  );
}
