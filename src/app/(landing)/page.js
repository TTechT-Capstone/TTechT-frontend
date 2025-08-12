"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import NewCollectionCard from "../components/product/NewCollectionCard";

import { getAllCategoriesAPI } from "@/app/apis/category.api";
import { getBestNewArrivalsAPI } from "@/app/apis/product.api";
import CategoryCard from "../components/product/CategoryCard";
import useMediaQuery from "../hooks/useMediaQuery";
import CategorySlider from "../components/product/CategorySlider";

export default function LandingPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [newArrivalProduct, setNewArrivalProduct] = useState([]);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesAPI(0, 100);
        setCategories(res);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, [isMobile]);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const data = await getBestNewArrivalsAPI();

        setNewArrivalProduct(data);
      } catch (err) {
        console.error("Failed to fetch new arrival products", err);
      }
    };

    fetchNewArrival();
  }, [isMobile]);

  const handleNewArrivalProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/products/category/${categoryId}`);
  };

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-[300px] sm:h-[400px] md:h-[600px]">
        <Image
          src="/herobanner.jpg"
          alt="Shopping woman"
          fill
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/40 " />
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white mb-6 sm:mb-10 sm:mr-10">
          <h1 className="text-xl sm:text-3xl italic font-medium font-playfair mb-4 px-4">
            Original. Protected. Trusted.
          </h1>

          <p className="font-inter font-light mb-4 text-center max-w-sm sm:max-w-lg mx-auto md:mx-0 text-xs sm:text-base">
            Every image on Origity includes a secure digital watermark. This
            invisible signature ensures authenticity and traceability.
          </p>

          <Link href="/products">
            <button className="bg-white text-black text-sm font-light sm:text-base font-inter px-4 py-3 sm:px-6 rounded-2xl shadow-md hover:shadow-2xl hover:font-normal animate-pressDown transition-all duration-300">
              Shop Now
            </button>
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-4 sm:px-8 py-8 sm:py-12 text-center text-secondary bg-cream">
        <h2 className="text-md sm:text-lg font-semibold mb-2 sm:mb-2 font-inter">
          OUR CATEGORIES
        </h2>
        <p className="text-lg sm:text-2xl font-light font-playfair text-black">
          Let your day be filled with what inspires you.
        </p>
        <CategorySlider
          categories={categories}
          handleCategoryClick={handleCategoryClick}
        />
      </section>

      {/* New Collection Section */}
      <section className="py-8 text-left text-secondary">
        <div className="px-4 sm:px-8 md:px-16 flex flex-row items-center justify-between mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold font-playfair">
            OUR NEW ARRIVAL
          </h2>

          <Link href="/products">
            <button className="text-base text-black hover:font-semibold animate-pressDown transition-all duration-300">View All</button>
          </Link>
        </div>

        <div className="px-4 sm:px-8 md:px-16 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {newArrivalProduct.map((collection) => (
            <NewCollectionCard
              key={collection.name}
              name={collection.name}
              price={collection.price}
              img={collection.images[0]}
              onClick={() => handleNewArrivalProductClick(collection.productId)}
            />
          ))}
        </div>
      </section>

       {/* Divider */}
      <div className="my-3 border-t border-gray-500 opacity-20"></div>

      <section className="bg-white text-black px-4 sm:px-8 md:px-16 py-8 sm:py-12">
        <div className="mx-auto">
          <h2 className="text-xl sm:text-2xl font-semibold font-playfair mb-2">
            OUR MISSION
          </h2>

          <p className="font-inter mb-8 sm:mb-10 text-left mx-auto md:mx-0 text-sm sm:text-base">
            Every image on Origity includes a secure digital watermark. This
            invisible signature ensures authenticity and traceability.
          </p>

          <Link href="/about-us">
            <button className="bg-black text-white font-light text-sm sm:text-base font-inter px-4 py-3 sm:px-6 rounded-2xl shadow-md hover:shadow-2xl hover:font-normal animate-pressDown transition-all duration-300">
              Learn More
            </button>
          </Link>
        </div>
      </section>

      {/* <section className="bg-secondary text-white px-4 sm:px-8 md:px-16 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center md:text-left leading-snug">
            How Origity Protects Your Products
          </h2>
          <p className="font-roboto mb-8 sm:mb-10 text-center md:text-left max-w-3xl mx-auto md:mx-0 text-sm sm:text-base">
            Every image on Origity includes a secure digital watermark. This
            invisible signature ensures authenticity and traceability.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-base sm:text-lg">
                TAMPER-PROOF PROTECTION
              </h3>
              <p className="font-roboto text-sm sm:text-base">
                Your watermark cannot be removed or altered.
              </p>
            </div>
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-base sm:text-lg">
                ONLINE TRACKING CAPABILITIES
              </h3>
              <p className="font-roboto text-sm sm:text-base">
                Know when and where your images are used online.
              </p>
            </div>
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-base sm:text-lg">
                GUARANTEED ORIGINALITY
              </h3>
              <p className="font-roboto text-sm sm:text-base">
                Prove your image ownership anytime.
              </p>
            </div>
          </div>
        </div>
      </section> */}

     
    </main>
  );
}
