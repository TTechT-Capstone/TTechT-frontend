// ProductContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import {
  getAllProducts,
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
    const fetchAndFilterProducts = async () => {
      setLoading(true);
      try {
        let fetchedData;
        let totalPagesFromAPI = 1;
        const hasActiveFilters = Object.keys(filters).length > 0;

        const [res] = await Promise.all([
          (async () => {
            if (sort === "default") {
              if (hasActiveFilters) {
                return await getAllProducts();
              } else {
                const res = await getAllProductsAPI(currentPage - 1, 10);
                return res;
              }
            } else if (sort === "newest") {
              return await getBestNewArrivalsAPI();
            } else if (sort === "popular") {
              return await getBestSellingProductsAPI();
            }
          })(),
          new Promise((resolve) => setTimeout(resolve, 300)),
        ]);

        if (sort === "default") {
          if (hasActiveFilters) {
            fetchedData = res; 
            totalPagesFromAPI = 1;
          } else {
            fetchedData = res.content;
            totalPagesFromAPI = res.totalPages;
          }
        } else {
          fetchedData = res;
        }

        setTotalPages(totalPagesFromAPI);

        let finalProducts = fetchedData;
        if (hasActiveFilters) {
          if (filters.categories?.length > 0) {
            finalProducts = finalProducts.filter((p) => filters.categories.includes(p.categoryName));
          }
          if (filters.colors?.length > 0) {
            finalProducts = finalProducts.filter((p) => p.colors && p.colors.some((c) => filters.colors.includes(c)));
          }
          if (filters.sizes?.length > 0) {
            finalProducts = finalProducts.filter((p) => p.sizes && p.sizes.some((s) => filters.sizes.includes(s)));
          }
          if (filters.priceRange?.length === 2) {
            const [min, max] = filters.priceRange;
            finalProducts = finalProducts.filter((p) => p.price >= min && p.price <= max);
          }
        }
        
        setProducts(finalProducts);
      } catch (error) {
        console.error("Failed to fetch and filter products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAndFilterProducts();
  }, [sort, filters, currentPage]);

  const handlePageChange = (newPage) => {
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

      {/* Hide pagination if filters are active */}
      {currentSort === "default" && Object.keys(filters).length === 0 && (
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
