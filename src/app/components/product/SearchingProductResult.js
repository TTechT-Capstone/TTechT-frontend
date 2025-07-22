"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronRight, Funnel } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import {
  getAllProductsAPI,
  searchProductsByNameAPI,
} from "@/app/apis/product.api";

export default function SearchingProductResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("query");
  const [products, setProducts] = useState([]);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const backendPage = currentPage - 1;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const fetchSearchResults = async () => {
    if (!searchQuery?.trim()) return;

    try {
      setLoading(true);
      const result = await searchProductsByNameAPI(
        searchQuery,
        backendPage,
        10
      );
      setSearchResults(result || []);
      setTotalPages(result.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery, backendPage]);

  const handlePageChange = (newPage) => {
    router.push(
      `/products?query=${encodeURIComponent(searchQuery)}&page=${newPage}`
    );
  };

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : searchResults.length === 0 ? (
          <p className="text-secondary font-roboto">No products found.</p>
        ) : (
          searchResults.map((product) => (
            <ProductCard
              key={product.productId || product.name}
              name={product.name}
              price={product.price}
              img={product.img || "/placeholder.jpg"}
              onClick={() => handleProductClick(product.productId)}
            />
          ))
        )}
      </div>

      {/* Pagination Section */}
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
      </section>
    </div>
  );
}
