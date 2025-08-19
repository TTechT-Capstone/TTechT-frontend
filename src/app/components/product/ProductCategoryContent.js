"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { X, ChevronDown, ChevronRight, Funnel } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";

import { getProductsByCategoryAPI } from "@/app/apis/product.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import Loading from "../common/Loading";

export default function ProductsByCategory({ setCategory }) {
  const router = useRouter();
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const backendPage = currentPage - 1;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  

  useEffect(() => {
    if (!categoryId) return;

    const fetchProducts = async () => {
      try {
        const res = await getProductsByCategoryAPI(categoryId);
        setProducts(res || []);
        if (res && res.length > 0) {
          setCategory?.({ name: res[0].categoryName });
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [categoryId, setCategory]);

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {loading ? (
          <Loading />
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
