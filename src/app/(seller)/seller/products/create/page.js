"use client";
import CreateNewProduct from "@/app/components/product/CreateNewProduct";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";


export default function SellerCreateProduct() {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return !isMobile ? (
    <main className="min-h-screen p-8 font-inter">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 font-playfair">
          Add New Product
        </h1>
        <Link href="/seller/products">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
      </div>
      <CreateNewProduct />
    </main>
  ) : (
    <main className="min-h-screen p-4 font-inter">
      <div className="flex flex-col space-y-5 items-left mb-5">
        <Link href="/seller/products">
          <div className="flex items-center text-secondary cursor-pointer text-sm hover:underline">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to product list
          </div>
        </Link>
        <h1 className="text-xl font-bold text-gray-800 font-playfair">
          Add New Product
        </h1>
      </div>
      <CreateNewProduct />
    </main>
  );
}
