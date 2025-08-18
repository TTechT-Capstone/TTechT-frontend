"use client";

import { useRouter } from "next/navigation";
import ProductCard from "@/app/components/product/ProductCard";

// This component is now a pure presentational component.
export default function SearchingProductResult({ products, loading }) {
  const router = useRouter();

  const handleProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  return (
    <div className="w-full">
      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
        {loading ? (
          <p>Loading...</p>
        ) : !products || products.length === 0 ? (
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
    </div>
  );
}