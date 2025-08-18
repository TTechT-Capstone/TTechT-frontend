"use client";
import { useRef, useState, useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategorySlider({ categories, handleCategoryClick }) {
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
  }, [categories]);

  return (
    <section className="px-4 py-8 relative">
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
        {categories.map((category) => (
          <div
            key={category.categoryId}
            className="flex-shrink-0 w-48 snap-center cursor-pointer"
            onClick={() => handleCategoryClick(category.categoryId)}
          >
            <CategoryCard
              title={category.name}
              img={category.imagePath}
              id={category.categoryId}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
