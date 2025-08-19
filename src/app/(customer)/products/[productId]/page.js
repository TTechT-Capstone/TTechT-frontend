"use client";
import React, { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import ProductCard from "../../../components/product/ProductCard";
import { getProductByIdAPI } from "@/app/apis/product.api";
import useCartStore from "@/app/stores/cartStore";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ImageSlider from "@/app/components/product/ImageSlider";
import Loading from "@/app/components/common/Loading";
import { ArrowLeft } from "lucide-react";

export default function ProductDetail() {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCartStore();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [addedProductInfo, setAddedProductInfo] = useState(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const productData = await getProductByIdAPI(productId);
        console.log("Fetched product data:", productData);

        if (productData?.images?.length > 0) {
          setMainImage(productData.images[0]);
        }

        setProduct({
          ...productData,
          imageUrls: productData.images || [],
        });
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
        setIsLoginModalOpen(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!selectedColor || !selectedSize) {
      alert("Please select a color and size before adding to cart.");
      return;
    }

    const newItem = {
      productId: Number(productId),
      productName: product.name,
      quantity,
      price: product.price,
      color: selectedColor,
      size: selectedSize,
      image: product.imageUrls?.[0],
    };

    try {
      await addToCart(newItem);
      console.log("Item added to cart:", newItem);

      setAddedProductInfo(newItem);
      setSuccessModalOpen(true);

      setTimeout(() => {
        setSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error("🚨 Error calling addToCart:", error);
    }
  };

  if (!product) return <Loading />

  return !isMobile ? (
    <div className="mt-5 mx-auto px-8 py-12 bg-white text-primary">
      {/* Product Section */}
      <div className="grid grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4 items-center">
          {/* Main Image */}
          <div className="w-[550px] h-[550px] flex justify-center items-center bg-white">
            <img
              src={mainImage}
              alt="Main Product"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Conditionally render Thumbnails */}
          {product.imageUrls && product.imageUrls.length > 1 && (
            <div className="flex flex-row gap-2">
              {product.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(url)}
                  className={`w-32 h-32 object-cover cursor-pointer border ${
                    mainImage === url ? "border-primary" : "border-gray-200"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {/* Product Info */}
        <div className="flex flex-col font-inter gap-6">
          {/* Store Name */}
          <span className=" bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full w-fit font-semibold">
            {product.storeName}
          </span>

          <h1 className="font-playfair text-3xl font-bold text-gray-900 font-playfair">
            {product.name}
          </h1>

          <p className="text-xl font-semibold text-black">
            {product.price
              ? Number(product.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}{" "}
            USD
          </p>

          {/* Conditional Fields */}
          <div className="text-sm text-gray-700 flex flex-col gap-3">
            {product.brand && (
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
            )}
            {/* Colors */}
            {product.colors && (
              <div>
                <span className="font-medium text-gray-700 mb-2 block">
                  Color:
                </span>
                <div className="flex gap-2">
                  {Array.from(new Set(product.colors)).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded border-2 focus:outline-none
                      ${
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-300"
                      }
                    `}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div>
                <span className="font-medium text-gray-700 mb-2 block">
                  Size:
                </span>
                <div className="flex gap-2">
                  {Array.from(new Set(product.sizes)).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border-2 font-medium
                      ${
                        selectedSize === size
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 bg-white text-gray-700"
                      }
                    `}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
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
            disabled={!selectedColor || !selectedSize}
            className={`py-3 px-6 shadow transition duration-300
            ${
              !selectedColor || !selectedSize
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-primary text-white hover:bg-[#6C7A84]"
            }
                `}
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

      {/* Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
            <div className="flex justify-end">
              <button
                onClick={() => setIsLoginModalOpen(false)}
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
            <h2 className="text-xl font-semibold text-center mb-4 font-inter">
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

      {/* Success Modal */}
      {successModalOpen && addedProductInfo && (
        <div className="fixed top-20 right-5 font-inter z-50 slide-in-right">
          <div className="bg-white shadow-sm p-6 max-w-xs sm:max-w-md w-full flex flex-row items-center gap-4">
            <div className="">
              <img
                src={addedProductInfo.image}
                alt={addedProductInfo.productName}
                className="w-48 h-48 object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="font-semibold text-left">
                  {addedProductInfo.productName}
                </p>

                <p className="font-semibold text-sm sm:text-md">
                  {addedProductInfo.price
                    ? Number(addedProductInfo.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}{" "}
                  USD
                </p>

                <div className="flex flex-row mt-2 text-sm sm:text-md">
                  <p>Color: {addedProductInfo.color}</p>
                </div>
                <div className="flex flex-row text-sm sm:text-md">
                  <p>Size: {addedProductInfo.size}</p>
                </div>
                <div className="flex flex-row text-sm sm:text-md">
                  <p>Quantity: {addedProductInfo.quantity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  ) : (
    <div className="mt-5 mx-auto px-8 py-12 bg-white text-primary">
       <Link href="/products">
          <div className="mb-4 flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
      {/* Product Section */}
      <div className="grid grid-cols-1 gap-12">
        <ImageSlider images={product.imageUrls} />

        {/* Product Info */}
        <div className="flex flex-col font-inter gap-6">
         

          {/* Store Name */}
          <span className=" bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full w-fit font-semibold">
            {product.storeName}
          </span>

          <h1 className="font-playfair text-3xl font-bold text-gray-900 font-urbanist">
            {product.name}
          </h1>

          <p className="text-xl font-semibold text-black">
            {product.price
              ? Number(product.price).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "0.00"}{" "}
            USD
          </p>

          {/* Conditional Fields */}
          <div className="text-sm text-gray-700 flex flex-col gap-3">
            {product.brand && (
              <p>
                <span className="font-medium">Brand:</span> {product.brand}
              </p>
            )}
            {/* Colors */}
            {product.colors && (
              <div>
                <span className="font-medium text-gray-700 mb-2 block">
                  Color:
                </span>
                <div className="flex gap-2">
                  {Array.from(new Set(product.colors)).map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded border-2 focus:outline-none
                      ${
                        selectedColor === color
                          ? "border-primary ring-2 ring-primary"
                          : "border-gray-300"
                      }
                    `}
                      style={{ backgroundColor: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && (
              <div>
                <span className="font-medium text-gray-700 mb-2 block">
                  Size:
                </span>
                <div className="flex gap-2">
                  {Array.from(new Set(product.sizes)).map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1 rounded border-2 font-medium
            ${
              selectedSize === size
                ? "border-primary bg-primary text-white"
                : "border-gray-300 bg-white text-gray-700"
            }
          `}
                      aria-label={`Select size ${size}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
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
            disabled={!selectedColor || !selectedSize}
            className={`py-3 px-6 shadow transition duration-300
          ${
            !selectedColor || !selectedSize
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-primary text-white hover:bg-[#6C7A84]"
          }
              `}
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

      {/* Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-150 flex items-center justify-center">
          <div className="font-inter bg-white rounded-lg p-6 max-w-sm w-full shadow-md">
            <div className="flex justify-end">
              <button
                onClick={() => setIsLoginModalOpen(false)}
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
            <h2 className="text-xl font-semibold text-center mb-4 font-playfair">
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

      {/* Success Modal */}
      {successModalOpen && addedProductInfo && (
        <div className="fixed top-20 right-5 font-inter z-50 slide-in-right">
          <div className="bg-white shadow-sm p-6 max-w-xs sm:max-w-md w-full flex flex-row items-center gap-4">
            <div className="">
              <img
                src={addedProductInfo.image}
                alt={addedProductInfo.productName}
                className="w-48 h-48 object-cover"
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex flex-col">
                <p className="font-semibold text-left">
                  {addedProductInfo.productName}
                </p>

                <p className="font-semibold text-sm sm:text-md">
                  {addedProductInfo.price
                    ? Number(addedProductInfo.price).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}{" "}
                  USD
                </p>

                <div className="flex flex-row mt-2 text-sm sm:text-md">
                  <p>Color: {addedProductInfo.color}</p>
                </div>
                <div className="flex flex-row text-sm sm:text-md">
                  <p>Size: {addedProductInfo.size}</p>
                </div>
                <div className="flex flex-row text-sm sm:text-md">
                  <p>Quantity: {addedProductInfo.quantity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
