// ProductContent.js
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import {
  getProductsByCategoryAPI,
} from "@/app/apis/product.api";
import Loading from "../common/Loading";

export default function CategoryProductContent({ categoryId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const res = await getProductsByCategoryAPI(categoryId);
        setProducts(res);
      } catch (error) {
        console.error("Failed to fetch category products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryId]);

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {loading ? (
          <Loading />
        ) : products && products.length === 0 ?  (
          <p className="text-secondary font-inter">No products found.</p>
        ) : (
          products?.map((product) => (
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
    </div>
  );
}
