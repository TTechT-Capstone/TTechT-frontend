import React, { useState } from "react";

export default function ImageSlider({ images }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
      <div className="w-[350px] h-[350px] overflow-hidden rounded">
        <img
          src={images[currentIndex]}
          alt={`Product Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to image ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentIndex === idx ? "bg-primary" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
