"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/product/ProductCard";
import { getProductByIdAPI } from "@/app/apis/product.api";
import useCartStore from "@/app/stores/cartStore";

export default function ProductDetail() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCartStore();
  const { productId } = useParams(); 
  
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductByIdAPI(productId);

        setMainImage(productData.imageUrls?.[0] || "");
        setProduct({
          ...productData,
          imageUrls: productData.imageUrls || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
        setIsModalOpen(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
  if (!isAuthenticated) {
    setIsModalOpen(true);
    return;
  }

  const newItem = {
    productId: Number(productId),
    productName: product.name,
    quantity,
  };

  try {
    await addToCart(newItem); // <-- passed in here
  } catch (error) {
    console.error("🚨 Error calling addToCart:", error);
  }
};





  if (!product) return <div>Loading product...</div>;

  return (
    <div className="mx-auto px-8 py-12 bg-white text-primary">
      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Main Image */}
          <img
            src={mainImage}
            alt="Main Product"
            className="rounded-lg shadow w-full max-h-[600px] object-cover"
          />

          {/* Thumbnails */}
          <div className="flex lg:flex-col gap-2">
            {product.imageUrls?.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => setMainImage(url)}
                className={`w-16 h-16 rounded-md object-cover cursor-pointer border ${
                  mainImage === url ? "border-primary" : "border-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6">
          {/* Store Name */}
          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full w-fit font-semibold">
            {product.storeName}
          </span>

          <h1 className="text-3xl font-bold text-gray-900 font-urbanist">
            {product.name}
          </h1>

          <p className="text-xl font-semibold text-red-600 font-roboto">
            {product.price.toLocaleString()} VND
          </p>

          {/* Conditional Fields */}
          <div className="text-sm text-gray-700 flex flex-col gap-4">
            {product.brand && (
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
            )}
            {product.color && (
              <p>
                <span className="font-medium">Color:</span> {product.color}
              </p>
            )}
            {product.size && (
              <p>
                <span className="font-medium">Size:</span> {product.size}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center border border-[#EDEDED] rounded overflow-hidden">
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="px-4 py-1 border-l border-r border-[#EDEDED]">
                {quantity}
              </span>
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-gray-800 text-black hover:text-white"
                onClick={() => setQuantity((prev) => Math.min(10, prev + 1))}
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="bg-primary text-white py-3 px-6 shadow hover:bg-[#6C7A84] transition duration-300"
          >
            Add to Cart
          </button>

          {/* Description */}
          <div className="text-sm text-gray-700 leading-relaxed">
            <h3 className="font-semibold mb-2">Product Description</h3>
            <p>{product.description}</p>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      <section className="mt-20">
        <h2 className="text-2xl font-bold text-center mb-8 font-urbanist">
          You May Also Like
        </h2>
        <div className="py-2 grid grid-cols-2 md:grid-cols-4 gap-6">
          <ProductCard
            name="White T-Shirt"
            price="150,000 VND"
            img="/product.jpg"
          />
          <ProductCard
            name="Summer Hat"
            price="80,000 VND"
            img="/product2.jpg"
          />
          <ProductCard
            name="Summer Glasses"
            price="150,000 VND"
            img="/product3.jpg"
          />
          <ProductCard
            name="Casual Jeans"
            price="290,000 VND"
            img="/product.jpg"
          />
        </div>

        <div className="flex justify-center mt-6">
          <Link href="/products">
            <button className="bg-primary text-white font-urbanist px-6 py-2 hover:bg-[#5d6c78] border border-primary transition">
              VIEW MORE
            </button>
          </Link>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
            <div className="flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="Close Modal"
              >
                <svg
                  className="h-6 w-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h2 className="text-xl font-semibold text-center mb-4 font-urbanist">
              Please Log In
            </h2>
            <p className="text-sm text-gray-600 text-center mb-4">
              You need to be logged in to add products to your cart.
            </p>
            <div className="flex justify-center">
              <Link href="/auth/login">
                <button className="bg-primary text-white px-4 py-2 rounded hover:bg-[#6C7A84] transition">
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
