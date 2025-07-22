"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronRight, Funnel } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import { getAllProductsAPI } from "@/app/apis/product.api";

export default function ProductContent() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const backendPage = currentPage - 1;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProductsAPI(backendPage, 10); // limit = 10
      //console.log("Fetched product data:", data);
      setProducts(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [backendPage]);

  const handlePageChange = (newPage) => {
    router.push(`/products?page=${newPage}`);
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
        ) : products.length === 0 ? (
          <p className="text-secondary font-roboto">No products found.</p>
        ) : (
          products.map((product) => (
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
