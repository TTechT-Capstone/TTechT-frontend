"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Image from "next/image";
import Link from "next/link";
import NewCollectionCard from "../components/product/NewCollectionCard";

import { getAllCategoriesAPI } from "@/app/apis/category.api";
import { getBestNewArrivalsAPI } from "@/app/apis/product.api";
import CategoryCard from "../components/product/CategoryCard";


export default function LandingPage() {
  const router = useRouter();
  const [randomCategories, setRandomCategories] = useState([]);
  const [newArrivalProduct, setNewArrivalProduct] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesAPI(0, 100); // fetch all, or adjust limit
        //const allCategories = res?.content ?? [];
        console.log("Fetched categories:", res);

        // Random pick 4 categories
        const shuffled = res.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        setRandomCategories(selected);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchNewArrival = async () => {
      try {
        const data = await getBestNewArrivalsAPI(4); 
        setNewArrivalProduct(data);
      } catch (err) {
        console.error("Failed to fetch new arrival products", err);
      }
    };

    fetchNewArrival();
  }, []);

  const handleNewArrivalProductClick = (id) => {
    router.push(`/products/${id}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/products/category/${categoryId}`);
  };

  return (
    <main className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-[600px]">
        <Image
          src="/herobanner.jpg"
          alt="Shopping woman"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 flex flex-col items-end justify-end text-center text-white bg-opacity-30 mb-10 mr-10">
          <h1 className="text-3xl italic font-medium font-urbanist mb-4">
            Original. Protected. Trusted.
          </h1>

          <Link href="/products">
            <button className="bg-white text-black font-urbanist px-6 py-2 hover:bg-gray-200 transition">
              SHOP NOW
            </button>
          </Link>
        </div>
      </section>

      <section className="bg-secondary text-white px-4 sm:px-8 md:px-16 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-center md:text-left">
            How Origity Protects Your Products
          </h2>
          <p className="font-roboto mb-10 text-center md:text-left max-w-3xl mx-auto md:mx-0">
            Every image on Origity includes a secure digital watermark. This
            invisible signature ensures authenticity and traceability.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-lg">
                TAMPER-PROOF PROTECTION
              </h3>
              <p className="font-roboto">
                Your watermark cannot be removed or altered.
              </p>
            </div>
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-lg">
                ONLINE TRACKING CAPABILITIES
              </h3>
              <p className="font-roboto">
                Know when and where your images are used online.
              </p>
            </div>
            <div>
              <h3 className="font-urbanist font-semibold mb-2 text-lg">
                GUARANTEED ORIGINALITY
              </h3>
              <p className="font-roboto">Prove your image ownership anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Tiles Section */}
      <section className="px-8 py-12 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {randomCategories.map((category) => (
            <CategoryCard
              key={category.categoryId}
              title={category.name}
              img={category.img}
              id={category.categoryId}
              onClick={() => handleCategoryClick(category.categoryId)}
            />
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="my-3 border-t border-black opacity-20 mx-12"></div>

      {/* New Collection Section */}
      <section className="px-8 py-12 text-center text-secondary">
        <h2 className="text-2xl font-semibold mb-8 font-urbanist">NEW ARRIVAL</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {newArrivalProduct.map((collection) => (
            <NewCollectionCard
              key={collection.name}
              name={collection.name}
              price={collection.price}
              img={collection.img}
              onClick={() => handleNewArrivalProductClick(collection.productId)}
            />
          ))}
        </div>

        <Link href="/products">
          <button className="mt-8 px-6 py-2 bg-gray-800 text-white hover:bg-gray-700 transition">
            VIEW ALL
          </button>
        </Link>
      </section>
    </main>
  );
}
