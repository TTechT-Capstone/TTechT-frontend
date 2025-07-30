"use client";

import React, { useState, useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import EditProduct from "@/app/components/product/EditProduct";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { getProductByIdAPI, updateProductAPI } from "@/app/apis/product.api";

export default function SellerEditProduct() {
  const { idToken, user, isAuthenticated, loading } = useAuth();
  const params = useParams();
  const productId = params.id;
  const [error, setError] = useState(null);
  const [loadingProduct, setLoadingProduct] = useState(true);
  const [products, setProducts] = useState([]);

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
      console.log("Fetching product with ID:", productId);
      if (!productId) return;
      try {
        const response = await getProductByIdAPI(productId);
        console.log("Fetched product data:", response);
        setProduct(response);
      } catch (err) {
        setError("Failed to fetch product");
        console.error(err);
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

    if (product.images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    try {
      const response = await updateProductAPI(productId, product);
      setSuccessMessage("✅ Product updated successfully!");
      // Redirect after a short delay
      setTimeout(() => {
        if (user?.role === "ADMIN") {
          router.push("/admin/products");
        } else {
          router.push("/seller/products");
        }
      }, 1500);
    } catch (error) {
      console.error("Error updating product:", error.message);
      alert("Failed to update product. Please try again.");
    }
  };

  return (
    <main className="min-h-screen p-8 font-roboto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        <Link href="/seller/products">
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
  );
}
