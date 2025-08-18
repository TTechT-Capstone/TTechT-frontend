// ProductContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import {
  getAllProductsAPI,
  getBestNewArrivalsAPI,
  getBestSellingProductsAPI,
} from "@/app/apis/product.api";

export default function ProductContent({
  sort,
  filters,
  currentPage,
  totalPages,
  setCurrentPage,
  setTotalPages,
  onFilterOptionsChange,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSort = sort ?? searchParams.get("sort") ?? "default";

  useEffect(() => {
    // Log mỗi khi useEffect được kích hoạt
    console.log("useEffect triggered. Current state:", {
      currentPage,
      sort,
      filters,
    });

    const fetchAndFilterProducts = async () => {
      // Log trạng thái loading ban đầu
      console.log("Setting loading to true...");
      setLoading(true);

      try {
        let fetchedData;
        let totalPagesFromAPI = 1;

        // Bắt đầu đo thời gian gọi API
        const startTime = Date.now();

        const [res] = await Promise.all([
          (async () => {
            if (sort === "default") {
              const res = await getAllProductsAPI(currentPage - 1, 10);
              return res;
            } else if (sort === "newest") {
              return await getBestNewArrivalsAPI();
            } else if (sort === "popular") {
              return await getBestSellingProductsAPI();
            }
          })(),
          new Promise((resolve) => setTimeout(resolve, 300)), // Độ trễ tối thiểu 300ms
        ]);

        const endTime = Date.now();
        console.log(`API call and delay took: ${endTime - startTime}ms`);

        if (sort === "default") {
          fetchedData = res.content;
          totalPagesFromAPI = res.totalPages;
        } else {
          fetchedData = res;
        }

        console.log("Fetched Data from API:", fetchedData);
        setTotalPages(totalPagesFromAPI);

        if (fetchedData && fetchedData.length > 0) {
          const colors = [...new Set(fetchedData.flatMap((p) => p.colors || []))];
          const sizes = [...new Set(fetchedData.flatMap((p) => p.sizes || []))];
          const categories = [...new Set(fetchedData.map((p) => p.categoryName))];
          const prices = fetchedData.map((p) => p.price);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          onFilterOptionsChange({ colors, sizes, categories, minPrice, maxPrice });
        } else {
          onFilterOptionsChange({});
        }

        let filteredProducts = fetchedData;
        if (filters && Object.keys(filters).length > 0) {
          // Log filters đang được áp dụng
          console.log("Applying filters:", filters);
          if (filters.categories?.length > 0) {
            filteredProducts = filteredProducts.filter((p) => filters.categories.includes(p.categoryName));
          }
          if (filters.colors?.length > 0) {
            filteredProducts = filteredProducts.filter((p) => p.colors && p.colors.some((c) => filters.colors.includes(c)));
          }
          if (filters.sizes?.length > 0) {
            filteredProducts = filteredProducts.filter((p) => p.sizes && p.sizes.some((s) => filters.sizes.includes(s)));
          }
          if (filters.priceRange?.length === 2) {
            const [min, max] = filters.priceRange;
            filteredProducts = filteredProducts.filter((p) => p.price >= min && p.price <= max);
          }
        }
        
        setProducts(filteredProducts);
        // Log sản phẩm cuối cùng sau khi lọc
        console.log("Final products to display:", filteredProducts);
      } catch (error) {
        console.error("Failed to fetch and filter products:", error);
        setProducts([]);
      } finally {
        // Log trạng thái loading khi kết thúc
        console.log("Setting loading to false.");
        setLoading(false);
      }
    };
    fetchAndFilterProducts();
  }, [sort, filters, currentPage, onFilterOptionsChange]);

  const handlePageChange = (newPage) => {
    console.log("Changing page to:", newPage);
    setCurrentPage(newPage);
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-secondary font-inter">No products found.</p>
        ) : (
          products.map((product) => (
            <ProductCard
              key={product.productId || product.name}
              name={product.name}
              price={product.price}
              img={product.images?.[0]}
              onClick={() => handleProductClick(product.productId)}
            />
          ))
        )}
      </div>

      {currentSort === "default" && (
        <section className="px-8 flex justify-center space-x-2 items-center py-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              className={`px-2 sm:px-4 py-2 rounded ${
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
                className="px-2 sm:px-4 py-2 rounded text-primary hover:bg-gray-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
        </section>
      )}
    </div>
  );
}