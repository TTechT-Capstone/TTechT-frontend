"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  X,
  ChevronDown,
  ChevronRight,
  Funnel,
  ListFilterIcon,
} from "lucide-react";
import Image from "next/image";
import ProductCategoryContent from "@/app/components/product/ProductCategoryContent";
import FilterSidebar from "@/app/components/filter/FilterSidebar";
import BestSellerCard from "@/app/components/product/BestSellerCard";
import { getBestSellersByCategoryAPI } from "@/app/apis/product.api";
import useMediaQuery from "@/app/hooks/useMediaQuery";
import ProductContent from "@/app/components/product/ProductContent";
import FilterDrawer from "@/app/components/filter/FilterDrawer";
import { getCategoryByIdAPI } from "@/app/apis/category.api";
import CategoryProductContent from "@/app/components/product/CategoryProductContent";

export default function CategoryProductPage() {
  const router = useRouter();
  const [category, setCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);
  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeSidebar = () => setSidebarVisible(false);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const { categoryId } = useParams();

  const handleBestSellerProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  // New useEffect to fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      if (categoryId) {
        try {
          const categoryData = await getCategoryByIdAPI(categoryId);
          setCategory(categoryData);
        } catch (error) {
          console.error("Failed to fetch category details:", error);
        }
      }
    };
    fetchCategory();
  }, [categoryId]);

  const fetchBestSellers = async () => {
    try {
      setLoading(true);

      const data = await getBestSellersByCategoryAPI(4);
      setBestSellers(data);
    } catch (error) {
      console.error("Failed to fetch bestsellers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <main className="pt-8 sm:pt-10 min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-cream flex px-8 py-8 items-center justify-center font-playfair text-black">
        <h1 className="font-semibold text-black text-lg sm:text-3xl uppercase">
          {/* Display the category name */}
          {category ? category.name : "Loading..."}
        </h1>
      </section>

      {/* Divider
      <div className="my-4 border-t border-black opacity-80 mx-8"></div> */}

      <section className="flex flex-row px-8 py-4 pb-15 items-start">
        <Suspense fallback={<p>Loading products...</p>}>
          <CategoryProductContent categoryId={categoryId} />{" "}
        </Suspense>
      </section>
    </main>
  );
}
