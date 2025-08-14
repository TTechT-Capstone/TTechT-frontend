"use client";

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import EditProduct from "@/app/components/product/EditProduct";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getProductByIdAPI, updateProductAPI } from "@/app/apis/product.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";

export default function AdminEditProduct() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const params = useParams();
  const productId = params.id;

  const [error, setError] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [products, setProducts] = useState([]);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const [product, setProduct] = useState({
    name: "",
    price: "",
    stockQuantity: "",
    categoryId: "",
    brand: "",
    sizes: [],
    colors: [],
    description: "",
    images: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      try {
        const response = await getProductByIdAPI(productId);
        setProduct(response);
      } catch (err) {
        setError("Failed to fetch product");
        console.error("❌ error:", err);
      } finally {
        setLoadingProduct(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.name || !product.price || !product.categoryId) {
      alert("Please fill in all required fields.");
      return;
    }
    if (!user || !user.id) {
      alert("User not found or not authenticated.");
      return;
    }
    try {
      const response = await updateProductAPI(productId, product, idToken);
      console.log("Product updated successfully:", response);
      alert("Product updated successfully!");
    } catch (error) {
      console.error("Error updating product:", error.message);
      alert("Failed to update product. Please try again.");
    }
  };

  return !isMobile ? (
    <main className="min-h-screen p-4 font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-playfair">
          Edit Product
        </h1>
        <Link href="/admin/products">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
      </div>
      <EditProduct
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
        loadingProduct={loadingProduct}
      />
    </main>
  ) : (
    <main className="min-h-screen p-4 font-inter">
      <div className="flex flex-col space-y-5 items-left mb-5">
        <Link href="/admin/products">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
        <h1 className="text-xl font-bold text-gray-800 font-playfair">
          Edit Product
        </h1>
      </div>
      <EditProduct
        product={product}
        setProduct={setProduct}
        handleSubmit={handleSubmit}
        loadingProduct={loadingProduct}
      />
    </main>
  );
}
