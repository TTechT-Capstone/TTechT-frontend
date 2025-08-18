"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import { 
  getAllProductsAPI, 
  getBestNewArrivalsAPI, 
  getBestSellingProductsAPI 
} from "@/app/apis/product.api";

export default function ProductContent({ sort, filters }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );
  const backendPage = currentPage - 1;
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const currentSort = sort ?? "default";

  // const fetchProducts = async () => {
  //   try {
  //     setLoading(true);
  //     let data;

  //     if (currentSort === "newest") {
  //       // Fetch new arrivals (no pagination from backend)
  //       data = await getBestNewArrivalsAPI();
  //       setTotalPages(1);
  //       setProducts(data);
  //       return;
  //     }

  //     if (currentSort === "popular") {
  //       // Fetch best sellers (no pagination from backend)
  //       data = await getBestSellingProductsAPI();
  //       setTotalPages(1);
  //       setProducts(data);
  //       return;
  //     }

  //     // Apply category filter
  //     if (filters.category.length > 0) {
  //       data = data.filter((p) =>
  //         filters.category.includes(p.categoryName)
  //       );
  //     }

  //     // Apply color filter
  //     if (filters.color.length > 0) {
  //       data = data.filter((p) =>
  //         p.colors.some((c) => filters.color.includes(c))
  //       );
  //     }

  //     // Apply size filter
  //     if (filters.size.length > 0) {
  //       data = data.filter((p) =>
  //         p.sizes.some((s) => filters.size.includes(s))
  //       );
  //     }

  //     // Apply price range filter
  //     if (filters.priceRange.length > 0) {
  //       data = data.filter((p) =>
  //         filters.priceRange.some((range) => {
  //           if (range === "Under 100,000 VND") return p.price < 100000;
  //           if (range === "100,000-300,000 VND")
  //             return p.price >= 100000 && p.price <= 300000;
  //           return true;
  //         })
  //       );
  //     }

  //     // Default: fetch all products with pagination
  //     data = await getAllProductsAPI(backendPage, 10);
  //     setProducts(data.content);
  //     setTotalPages(data.totalPages);

  //   } catch (error) {
  //     console.error("Failed to fetch products:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchProducts = async () => {
  try {
    setLoading(true);
    let data;

    if (currentSort === "newest") {
      // Fetch new arrivals
      data = await getBestNewArrivalsAPI();
      setTotalPages(1);
    } else if (currentSort === "popular") {
      // Fetch best sellers
      data = await getBestSellingProductsAPI();
      setTotalPages(1);
    } else {
      // Default: fetch all products with pagination
      const res = await getAllProductsAPI(backendPage, 10);
      data = res.content;
      setTotalPages(res.totalPages);
    }

    // ✅ Apply filters after fetching data
    if (filters.category.length > 0) {
      data = data.filter((p) =>
        filters.category.includes(p.categoryName)
      );
    }

    if (filters.color.length > 0) {
      data = data.filter((p) =>
        p.colors.some((c) => filters.color.includes(c))
      );
    }

    if (filters.size.length > 0) {
      data = data.filter((p) =>
        p.sizes.some((s) => filters.size.includes(s))
      );
    }

    if (filters.priceRange.length > 0) {
      data = data.filter((p) =>
        filters.priceRange.some((range) => {
          if (range === "Under 100,000 VND") return p.price < 100000;
          if (range === "100,000-300,000 VND")
            return p.price >= 100000 && p.price <= 300000;
          return true;
        })
      );
    }

    setProducts(data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    // Reset to page 1 when sort option changes
    setCurrentPage(1);
  }, [sort]);

  useEffect(() => {
    fetchProducts();
  }, [backendPage, sort]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
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
              img={product.images?.[0]}
              onClick={() => handleProductClick(product.productId)}
            />
          ))
        )}
      </div>

      {/* Pagination (only for default sort mode) */}
      {sort === "default" && (
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
