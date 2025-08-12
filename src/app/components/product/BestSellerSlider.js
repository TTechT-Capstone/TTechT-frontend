
"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BestSellerCard from "./BestSellerCard";

export default function BestSellerSlider({ bestSellers, handleBestSellerProductClick }) {
  const containerRef = useRef(null);
  const [showButtons, setShowButtons] = useState(false);

  const scrollBy = (distance) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  };

  useEffect(() => {
    function checkOverflow() {
      const container = containerRef.current;
      if (!container) return;

      setShowButtons(container.scrollWidth > container.clientWidth);
    }

    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [bestSellers]);

  return (
    <section className="py-2 relative">
      {showButtons && (
        <>
          <button
            onClick={() => scrollBy(-200)}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-white z-10 opacity-10 hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="text-primary h-5 w-5" />
          </button>
          <button
            onClick={() => scrollBy(200)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-200 p-2 rounded-full shadow hover:bg-white z-10 opacity-10 hover:opacity-100 transition-opacity duration-300 hidden sm:block"
            aria-label="Scroll Right"
          >
            <ChevronRight className="text-primary h-5 w-5" />
          </button>
        </>
      )}

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto space-x-4 scrollbar-hide scroll-smooth snap-x snap-mandatory"
      >
        {bestSellers.map((bestseller) => (
          <div
            key={bestseller.productId}
            className="flex-shrink-0 snap-center cursor-pointer"
            onClick={() => handleBestSellerProductClick(bestseller.productId)}
          >
            <BestSellerCard
              key={bestseller.name}
              name={bestseller.name}
              price={bestseller.price}
              img={bestseller.images[0]}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
